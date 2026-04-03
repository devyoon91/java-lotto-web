# 🎰 Lucky Lotto Web

> nextstep java-lotto 과제를 Spring Boot + React 웹 앱으로 재구성한 프로젝트

## 🚀 기술 스택

### Backend
- Java 17 + Spring Boot 3.2.4
- Gradle 8.5
- REST API (Spring Web)

### Frontend
- React 18 + Vite 5
- TailwindCSS 3
- Framer Motion (애니메이션)
- Canvas Confetti (당첨 효과)

## 📦 프로젝트 구조

```
java-lotto-web/
├── backend/          # Spring Boot 백엔드
│   ├── src/main/java/com/devyoon91/lotto/
│   │   ├── domain/   # 로또 도메인 로직
│   │   ├── service/  # LottoVendingMachine
│   │   ├── controller/ # REST API
│   │   └── dto/      # 요청/응답 DTO
│   └── Dockerfile
├── frontend/         # React 프론트엔드
│   └── src/
│       ├── components/ # LottoBall, BuyStep, ResultStep
│       └── App.jsx
└── render.yaml       # Render.com 배포 설정
```

## 🎮 기능

- 구매 금액 입력 (1,000원 단위)
- 수동/자동 번호 구매
- 화려한 로또볼 애니메이션
- 당첨 번호 + 보너스볼 입력
- 등수별 당첨 통계
- 수익률 계산
- 당첨 시 Confetti 효과

## 🛠️ 로컬 실행

```bash
# 백엔드
cd backend && ./gradlew bootRun

# 프론트엔드
cd frontend && npm install && npm run dev
```

## ☁️ 배포

Render.com 무료 티어 배포
- Backend: Web Service (Docker)
- Frontend: Static Site
