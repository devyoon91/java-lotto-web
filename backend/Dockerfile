FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app
COPY gradle gradle
COPY gradlew .
COPY build.gradle settings.gradle .
RUN chmod +x gradlew
RUN ./gradlew dependencies --no-daemon 2>/dev/null || true
COPY src src
RUN ./gradlew bootJar --no-daemon

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
