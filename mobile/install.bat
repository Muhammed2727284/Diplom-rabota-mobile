@echo off
cd /d "%~dp0"
echo Installing dependencies...
call npm install
echo Dependencies installed!
echo Starting Expo...
call npx expo start
pause
