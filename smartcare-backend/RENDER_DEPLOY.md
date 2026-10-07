# SmartCare Backend — Render.com Deployment Config
# This file documents deployment settings for Render.com
# (No render.yaml needed — use Render dashboard settings below)

# Service Type: Web Service
# Runtime: Docker or Java
# Build Command: mvn package -DskipTests -f pom.xml
# Start Command: java -jar target/smartcare-1.0.0.jar
# Java Version: 17
# Port: 8080
#
# Environment Variables to set in Render Dashboard:
#   DB_PASSWORD=<your_mysql_password>
#   JWT_SECRET=SmartCareHMS2024SecretKey@JwtSign
#   MAIL_USERNAME=<your_gmail>
#   MAIL_PASSWORD=<your_app_password>
#   GROQ_API_KEY=<your_groq_key>
#   SPRING_DATASOURCE_URL=jdbc:mysql://<render-mysql-host>:3306/smartcare_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
#   SPRING_DATASOURCE_USERNAME=<render-mysql-user>
