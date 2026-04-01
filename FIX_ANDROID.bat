@echo off
color 0C
title Fix Android Connection

echo ========================================
echo   Fix Android Connection
echo ========================================
echo.

echo [1/4] Getting your IP address...
ipconfig | findstr "IPv4"
echo.

echo [2/4] Make sure backend allows external connections...
cd /d "%~dp0backend"
echo Starting backend with 0.0.0.0 (allows phone access)...
start cmd /k "python manage.py runserver 0.0.0.0:8000"
timeout /t 3 /nobreak >nul

echo [3/4] Starting frontend...
cd /d "%~dp0mobile"
start cmd /k "npx expo start --tunnel --clear"

echo.
echo [4/4] IMPORTANT INSTRUCTIONS
echo ========================================
echo.
echo 1. Find your IP address above (like 192.168.1.100)
echo 2. Open mobile/src/api/client.js
echo 3. Replace 192.168.1.100 with your IP address
echo 4. Save the file
echo 5. Restart Expo (Ctrl+C, then npx expo start)
echo.
echo Backend now runs on 0.0.0.0:8000 (accessible from phone)
echo Frontend uses tunnel (works via internet)
echo.
echo Try both methods:
echo - Local WiFi: Use your IP in client.js
echo - Internet tunnel: No changes needed
echo.
pause
