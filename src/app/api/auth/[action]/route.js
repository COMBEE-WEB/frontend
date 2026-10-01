import { sameOrigin } from '@/lib/server-origin.mjs';
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const backend = process.env.BACKEND_URL || "http://127.0.0.1:8000";
const accessCookie = "combee_access";
const refreshCookie = "combee_refresh";
const recoveryCookie = "combee_recovery";
const options = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" };

function reply(data, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

async function upstream(action, { body, token } = {}) {
  const response = await fetch(`${backend}/api/auth/${action}`, {
    method: action === "me" ? "GET" : "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  return { status: response.status, ok: response.ok, data: response.status === 204 ? {} : await response.json() };
}

function saveSession(jar, session) {
  jar.set(accessCookie, session.access_token, { ...options, maxAge: session.expires_in || 3600 });
  jar.set(refreshCookie, session.refresh_token, { ...options, maxAge: 60 * 60 * 24 * 30 });
}

function clearSession(jar) {
  jar.set(accessCookie, "", { ...options, maxAge: 0 });
  jar.set(refreshCookie, "", { ...options, maxAge: 0 });
}

async function handle(request, context) {
  const { action } = await context.params;
  if (!(request.method === "GET" ? ["me", "recovery-status"] : ["login", "signup", "logout", "forgot-password", "verify-recovery-code", "recovery-session", "reset-password", "change-password"]).includes(action)) {
    return reply({ detail: "지원하지 않는 요청입니다." }, 404);
  }
  // Cookie authentication requires same-origin writes.
  if (request.method === "POST" && !sameOrigin(request)) {
    return reply({ detail: "허용되지 않은 요청입니다." }, 403);
  }
  const jar = await cookies();
  try {
    if (action === "recovery-status") {
      const token = jar.get(recoveryCookie)?.value;
      if (!token) return reply({ detail: "메일의 재설정 링크를 열어주세요." }, 401);
      const result = await upstream("recovery-session", { token });
      if ([401, 403].includes(result.status)) jar.set(recoveryCookie, "", { ...options, maxAge: 0 });
      return reply(result.data, result.status);
    }
    let body;
    if (request.method === "POST" && action !== "logout") {
      try { body = await request.json(); } catch { return reply({ detail: "입력 형식이 올바르지 않습니다." }, 400); }
    }
    if (action === "forgot-password") {
      const result = await upstream(action, { body });
      if (result.ok) jar.set(recoveryCookie, "", { ...options, maxAge: 0 });
      return reply(result.data, result.status);
    }
    if (action === "verify-recovery-code") {
      const result = await upstream(action, { body });
      if (!result.ok) return reply(result.data, result.status);
      const session = result.data.session;
      if (!session?.access_token) return reply({ detail: "인증 응답을 처리하지 못했습니다." }, 502);
      jar.set(recoveryCookie, session.access_token, { ...options, maxAge: Math.min(session.expires_in || 900, 900) });
      return reply({ success: true, email: result.data.user?.email });
    }
    if (action === "recovery-session") {
      if (typeof body?.access_token !== "string" || body.access_token.length > 8192) {
        return reply({ detail: "재설정 링크가 올바르지 않습니다." }, 400);
      }
      const result = await upstream(action, { token: body.access_token });
      if (result.ok) jar.set(recoveryCookie, body.access_token, { ...options, maxAge: 900 });
      else jar.set(recoveryCookie, "", { ...options, maxAge: 0 });
      return reply(result.data, result.status);
    }
    if (action === "reset-password") {
      const token = jar.get(recoveryCookie)?.value;
      if (!token) return reply({ detail: "이메일 인증번호를 먼저 확인해주세요." }, 401);
      const result = await upstream(action, { body, token });
      if (result.ok || [401, 403].includes(result.status)) jar.set(recoveryCookie, "", { ...options, maxAge: 0 });
      if (result.ok) clearSession(jar);
      return reply(result.data, result.status);
    }
    if (["login", "signup"].includes(action)) {
      const result = await upstream(action, { body });
      if (!result.ok) return reply(result.data, result.status);
      if (result.data.session) saveSession(jar, result.data.session);
      return reply({ user: result.data.user, email_confirmation_required: result.data.email_confirmation_required || false }, result.status);
    }
    let token = jar.get(accessCookie)?.value;
    const refreshToken = jar.get(refreshCookie)?.value;
    let result = token ? await upstream(action, { token, body }) : { status: 401, ok: false, data: { detail: "로그인이 필요합니다." } };
    if (result.status === 401 && refreshToken) {
      const refreshed = await upstream("refresh", { body: { refresh_token: refreshToken } });
      if (refreshed.ok && refreshed.data.session) {
        saveSession(jar, refreshed.data.session);
        token = refreshed.data.session.access_token;
        result = await upstream(action, { token, body });
      } else {
        if ([400, 401, 403, 422].includes(refreshed.status)) clearSession(jar);
        return reply(refreshed.data, refreshed.status);
      }
    }
    if (action === "logout" && (result.ok || result.status === 401)) {
      clearSession(jar);
      jar.set(recoveryCookie, "", { ...options, maxAge: 0 });
      return reply({ success: true });
    }
    if (action === "change-password" && result.ok) clearSession(jar);
    if (result.status === 401) clearSession(jar);
    return reply(result.data, result.status);
  } catch {
    return reply({ detail: "백엔드에 연결할 수 없습니다. 서버 실행 상태를 확인해주세요." }, 502);
  }
}

export const GET = handle;
export const POST = handle;
