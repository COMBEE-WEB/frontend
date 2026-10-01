export async function authRequest(action, body) {
  const response = await fetch(`/api/auth/${action}`, {
    method: ["me", "recovery-status"].includes(action) ? "GET" : "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    cache: "no-store",
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok) {
    const detail = data.detail;
    const message = Array.isArray(detail)
      ? detail.map((item) => `${item.loc?.at(-1) || "입력값"}: ${item.msg}`).join(" / ")
      : detail || "요청을 처리하지 못했습니다.";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return data;
}
