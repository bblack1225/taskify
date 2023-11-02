FROM maven:3.9.5-eclipse-temurin-17 AS build

COPY src /home/app/src
COPY pom.xml /home/app

RUN mvn -f /home/app/pom.xml clean package

FROM eclipse-temurin:17

#ENV APP_HOME=/app
#RUN mkdir -p $APP_HOME
#WORKDIR $APP_HOME

COPY --from=build /home/app/target/*.jar /usr/local/lib/app.jar


EXPOSE 8088

CMD ["java", "-jar", "/usr/local/lib/app.jar"]