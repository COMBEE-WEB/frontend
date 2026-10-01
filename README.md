# COMBEE frontend

## 백엔드 연결

백엔드를 8000 포트에서 실행하고 이 폴더에서 `npm run dev`를 실행합니다.
로그인: http://localhost:3000/auth / 회원가입: http://localhost:3000/auth/signup
로그인 성공 시 `/account`에서 Supabase 프로필과 회원 정보를 확인합니다.

기본 백엔드는 `http://127.0.0.1:8000`입니다. 변경하려면 `.env.local`에
`BACKEND_URL`을 설정합니다 (`.env.example` 참고). 이 값은 서버에서만 사용합니다.

인증 흐름: 브라우저 → Next.js `/api/auth/*` → FastAPI → Supabase.
토큰은 HttpOnly 쿠키에 저장하며 자바스크립트 응답이나 localStorage에 노출하지 않습니다.
이메일 인증이 필요한 가입은 인증 안내를 표시하며, 인증 완료 후 이메일로 로그인합니다.
`localhost`와 `127.0.0.1`은 쿠키가 별개이므로 테스트 중에는 같은 주소를 사용합니다.

현재 연결 범위: 회원가입, 이메일 로그인, 내 정보, 자동 세션 갱신, 로그아웃, 비밀번호 찾기·변경.
`/auth/find-password` 한 화면에서 이메일 입력 → 인증번호 6~8자리 확인 → 새 비밀번호 설정을 진행합니다.
Supabase Reset password 메일 본문에 `{{ .Token }}`이 필요합니다. `backend/supabase/templates/recovery.html`을 대시보드에 적용하세요.
`/account`의 비밀번호 변경 링크는 `/auth/change-password`로 이동합니다.
아이디 찾기 화면은 아직 연결되지 않았습니다.

실제 세션 통합 검증은 `backend/tests/smoke_frontend.py`에서 수행합니다.
테스트 계정 정보는 Git에서 제외한 `backend/.env.signup-test`에만 저장합니다.

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
