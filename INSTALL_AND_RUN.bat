@echo off
color 0A
echo ========================================
echo   JobBoard Perfect Setup - SDK 54
echo ========================================
echo.

echo [Step 1/5] Installing updated dependencies...
cd /d "%~dp0mobile"
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo [Step 2/5] Starting Backend Server...
cd /d "%~dp0backend"
start "Django Backend - Port 8000" cmd /k "color 0B && python manage.py runserver"
timeout /t 5 /nobreak >nul

echo.
echo [Step 3/5] Clearing Expo cache...
cd /d "%~dp0mobile"

echo.
echo [Step 4/5] Starting Expo with Tunnel mode...
echo.
echo ========================================
echo   IMPORTANT INSTRUCTIONS
echo ========================================
echo.
echo 1. Expo will start with tunnel mode
echo 2. Wait for QR code to appear
echo 3. Open Expo Go on your phone
echo 4. Scan the QR code
echo 5. App will load (SDK 54 compatible!)
echo.
echo ========================================
echo.

start "Expo Frontend - Tunnel Mode" cmd /k "color 0E && npx expo start --tunnel --clear"

echo.
echo ========================================
echo   Servers Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Admin:    http://localhost:8000/admin
echo           Email: admin@jobboard.com
echo           Password: admin123
echo.
echo Frontend: Check Expo window for QR code
echo.
echo Both servers are running in separate windows
echo Close those windows to stop the servers
echo.
pause
