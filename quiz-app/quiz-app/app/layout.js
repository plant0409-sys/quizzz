import './globals.css'

export const metadata = {
  title: 'Quiz App',
  description: '이미지 학습 퀴즈 도구',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
