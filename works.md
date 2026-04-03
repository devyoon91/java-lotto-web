### 2026-04-03
* 작업 내용: 5등 당첨 결과 아이콘 수정
* 수정 파일: frontend/src/components/ResultStep.jsx, backend/src/main/resources/static/*
* 상세 설명: 5등 이모지를 검은 리본(🎗)에서 클로버(🍀)로 변경. 프론트엔드 빌드 후 GitHub push → Render 자동 재배포


### 2026-04-03
* 작업 내용: 수동 구매 버그 수정
* 수정 파일: backend/src/main/java/com/devyoon91/lotto/service/LottoVendingMachine.java
* 상세 설명: 두 가지 버그 수정 - 1) 수동 번호 파싱 시 공백 미제거로 인한 NumberFormatException (e.trim() 추가), 2) 수동 구매 시 자동 생성 개수 계산 오류 (전체 금액이 아닌 수동 차감 후 금액으로 자동 생성)
