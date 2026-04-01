@echo off
echo ========================================
echo   Get Your IP Address
echo ========================================
echo.
echo Your IP addresses:
ipconfig | findstr "IPv4"
echo.
echo Use this IP in mobile/src/api/client.js
echo Example: http://192.168.1.100:8000/api
echo.
pause
