# 지브리풍 이미지 변환기

이미지를 스튜디오 지브리 스타일로 변환하는 웹 애플리케이션입니다.

## 기능

- 이미지 업로드 (드래그 앤 드롭 또는 클릭하여 선택)
- OpenAI API를 사용하여 업로드된 이미지를 지브리풍으로 변환
- 변환 결과 이미지 표시 및 다운로드 기능

## 기술 스택

- Next.js - React 프레임워크
- TypeScript - 정적 타이핑
- OpenAI API - 이미지 분석 및 생성
- React Dropzone - 이미지 업로드 컴포넌트
- Axios - HTTP 요청 처리

## 시작하기

1. 환경 변수 설정
   `.env.local` 파일에 OpenAI API 키를 설정합니다:

   ```
   OPENAI_API_KEY=your_openai_api_key
   ```

2. 의존성 설치

   ```bash
   npm install
   ```

3. 개발 서버 실행

   ```bash
   npm run dev
   ```

4. 브라우저에서 다음 주소로 접속
   ```
   http://localhost:3000
   ```

## 주요 구성 요소

- `src/app/page.tsx` - 메인 페이지 및 UI 컴포넌트
- `src/app/api/transform/route.ts` - 이미지 변환 API 엔드포인트
- `src/app/layout.tsx` - 앱 레이아웃 및 메타데이터

## 작동 방식

1. 사용자가 이미지를 업로드합니다.
2. OpenAI의 Vision 모델로 이미지를 분석합니다.
3. 분석 결과를 바탕으로 DALL-E 모델이 지브리풍 이미지를 생성합니다.
4. 생성된 이미지를 사용자에게 표시하고 다운로드할 수 있게 합니다.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
