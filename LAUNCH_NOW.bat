@echo off
cd /d C:\Users\acer\Desktop\дипломдук жумуш\backend
start cmd /k python manage.py runserver
timeout /t 5 /nobreak >nul
cd /d C:\Users\acer\Desktop\дипломдук жумуш\mobile
start cmd /k npx expo start --tunnel --clear
