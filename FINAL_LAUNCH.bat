@echo off
color 0A
title JobBoard Perfect Launch

echo ========================================
echo   JobBoard - Final Perfect Launch
echo ========================================
echo.

echo [1/5] Cleaning old installations...
cd /d "%~dp0mobile"
if exist node_modules (
    echo Removing old node_modules...
    rmdir /s /q node_modules 2>nul
)
if exist package-lock.json (
    del /f /q package-lock.json 2>nul
)

echo.
echo [2/5] Installing fresh dependencies (SDK 51)...
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo ERROR: Installation failed
    pause
    exit /b 1
)

echo.
echo [3/5] Starting Backend Server...
cd /d "%~dp0backend"
start "Django Backend - http://localhost:8000" cmd /k "color 0B && title Backend Server && python manage.py runserver"
timeout /t 5 /nobreak >nul

echo.
echo [4/5] Starting Expo Frontend...
cd /d "%~dp0mobile"
start "Expo Frontend - QR Code" cmd /k "color 0E && title Expo QR Code && npx expo start --tunnel --clear"

echo.
echo [5/5] Launch Complete!
echo.
echo ========================================
echo   SERVERS RUNNING
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Admin:    http://localhost:8000/admin
echo           Email: admin@jobboard.com
echo           Password: admin123
echo.
echo Frontend: Check "Expo QR Code" window
echo           Scan QR with Expo Go app
echo.
echo ========================================
echo   INSTRUCTIONS
echo ========================================
echo.
echo 1. Wait for QR code in Expo window
echo 2. Open Expo Go on your phone
echo 3. Tap "Scan QR code"
echo 4. Point camera at QR code
echo 5. App will load and work!
echo.
echo Note: Both servers running in separate windows
echo       Close windows to stop servers
echo.
pause
