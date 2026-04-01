@echo off
echo ========================================
echo   JobBoard QR Launcher for Phone
echo ========================================
echo.

echo [1/3] Checking Backend...
cd /d "%~dp0backend"
python -c "import django; django.setup(); print('Backend OK')" 2>nul
if errorlevel 1 (
    echo Starting Backend...
    start "Django Backend" cmd /k "python manage.py runserver"
    timeout /t 5 /nobreak >nul
) else (
    echo Backend already running
)

echo [2/3] Starting Frontend with Tunnel...
cd /d "%~dp0mobile"
echo.
echo ========================================
echo   IMPORTANT: Use Tunnel for Phone!
echo ========================================
echo.
echo When Expo starts, press 't' for tunnel mode
echo This will work with your phone via internet
echo.
echo Starting Expo...
npx expo start --tunnel

echo.
echo ========================================
echo   Instructions
echo ========================================
echo.
echo 1. When Expo starts, press 't' for tunnel
echo 2. Open Expo Go on your phone  
echo 3. Scan the QR code
echo 4. App will work via internet tunnel
echo.
pause
