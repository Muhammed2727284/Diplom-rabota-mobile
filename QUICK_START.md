# Быстрый старт JobBoard

## ✅ Backend уже запущен!

Backend работает на **http://localhost:8000**

### Доступы:
- **Admin панель**: http://localhost:8000/admin
  - Email: `admin@jobboard.com`
  - Пароль: `admin123`

- **API**: http://localhost:8000/api

## 📱 Запуск Frontend (React Native)

### 1. Установите Node.js

Скачайте и установите Node.js с официального сайта:
**https://nodejs.org/en/download/**

Выберите версию **LTS** (рекомендуется) для Windows.

После установки перезапустите терминал и проверьте:
```bash
node --version
npm --version
```

### 2. Установите зависимости

```bash
cd mobile
npm install
```

### 3. Запустите приложение

```bash
npx expo start
```

### 4. Откройте приложение

**Вариант А: На физическом телефоне**
1. Установите **Expo Go** из Google Play или App Store
2. Отсканируйте QR-код из терминала
3. Приложение откроется автоматически

**Вариант Б: На эмуляторе Android**
1. Установите Android Studio
2. Создайте виртуальное устройство (AVD)
3. Нажмите `a` в терминале Expo

**Вариант В: На эмуляторе iOS (только Mac)**
1. Установите Xcode
2. Нажмите `i` в терминале Expo

## 🔧 Если используете физический телефон

Замените IP-адрес в файле `mobile/src/api/client.js`:

```javascript
// Найдите строку:
const API_BASE_URL = 'http://10.0.2.2:8000/api';

// Замените на IP вашего компьютера:
const API_BASE_URL = 'http://192.168.X.X:8000/api';
```

Чтобы узнать IP компьютера:
```bash
ipconfig
```
Найдите "IPv4 Address" в разделе вашей сети.

## 📝 Тестирование

1. Откройте приложение
2. Зарегистрируйте аккаунт (выберите роль USER или ORG)
3. Войдите в систему
4. Проверьте функционал:
   - USER: создание резюме, отклики на вакансии
   - ORG: создание вакансий, просмотр откликов

## 🛑 Остановка серверов

**Backend**: Нажмите `Ctrl+C` в терминале где запущен Django

**Frontend**: Нажмите `Ctrl+C` в терминале где запущен Expo

## 📚 Полезные команды

### Backend
```bash
cd backend
python manage.py runserver          # Запустить сервер
python manage.py createsuperuser    # Создать админа
python manage.py test               # Запустить тесты
```

### Frontend
```bash
cd mobile
npm install                         # Установить зависимости
npx expo start                      # Запустить Expo
npx expo start --clear              # Очистить кэш и запустить
```

## ❓ Проблемы?

1. **Backend не запускается**: Проверьте что Python 3.8+ установлен
2. **Frontend не запускается**: Установите Node.js
3. **Приложение не подключается к API**: Проверьте IP-адрес в `client.js`
4. **Ошибки миграций**: Удалите `db.sqlite3` и запустите `python manage.py migrate` заново
