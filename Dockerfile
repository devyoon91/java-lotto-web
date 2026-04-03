# Stage 1: Frontend 빌드
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Backend 빌드
FROM eclipse-temurin:17-jdk-alpine AS backend-builder
WORKDIR /app
COPY backend/gradle gradle
COPY backend/gradlew .
COPY backend/build.gradle backend/settings.gradle ./
RUN chmod +x gradlew
RUN ./gradlew dependencies --no-daemon 2>/dev/null || true
COPY backend/src src
# Frontend 빌드 결과를 Spring Boot static 리소스로 복사
COPY --from=frontend-builder /app/frontend/dist src/main/resources/static
RUN ./gradlew bootJar --no-daemon

# Stage 3: 실행
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=backend-builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
