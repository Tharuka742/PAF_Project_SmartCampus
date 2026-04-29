# Smart Campus Backend - Startup Script
# Always uses JDK 25 regardless of system JAVA_HOME

$env:JAVA_HOME = "C:\Program Files\Java\jdk-25"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# Point Spring Data MongoDB at the shared Atlas cluster (same as checkdb.js).
$env:MONGODB_URI = "mongodb+srv://Malith_Induwara:malith123@event.puotuo9.mongodb.net/smartCampusDB?retryWrites=true&w=majority&appName=EVENT"

Write-Host ""
Write-Host "  Smart Campus Backend" -ForegroundColor Cyan
Write-Host "  Using: $(java -version 2>&1 | Select-String 'version')" -ForegroundColor Green
Write-Host "  MongoDB: Atlas (smartCampusDB)" -ForegroundColor Green
Write-Host ""

.\mvnw.cmd spring-boot:run
