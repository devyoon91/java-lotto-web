### 2026-04-03
* 작업 내용: java-lotto-web 프로젝트 구축 및 GitHub 배포 완료
* 수정 파일: 전체 프로젝트 파일 (65개)
* 상세 설명:
  - 기존 nextstep java-lotto 도메인 코드를 Spring Boot 3.2.4 + Java 17로 재구성
  - 패키지명 변경: lotto.domain → com.devyoon91.lotto.domain
  - REST API 구현: POST /api/lotto/buy, POST /api/lotto/result
  - React 18 + Vite + TailwindCSS + Framer Motion 프론트엔드 구현
  - LottoBall 애니메이션, BuyStep, ResultStep(confetti 효과) 컴포넌트 작성
  - Dockerfile, render.yaml, GitHub Actions CI/CD 구성
  - GitHub 저장소 생성 및 push 완료: https://github.com/devyoon91/java-lotto-web
  - Render.com 배포 준비 완료 (render.yaml 작성)
