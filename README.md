# JobBoard Mobile App

Мобильное приложение для вакансий и резюме с ролями: SUPERADMIN, USER, ORG.

## Стек
- **Backend**: PostgreSQL + Django (DRF)
- **Frontend**: React Native (Expo)
- **Auth**: JWT (access/refresh)

## Структура проекта

```
├── backend/            # Django REST API
│   ├── config/         # Django settings, urls
│   ├── users/          # Auth, profiles
│   ├── organizations/  # Organization model
│   ├── vacancies/      # Vacancies CRUD
│   ├── resumes/        # Resumes CRUD
│   ├── favorites/      # Favorites toggle
│   ├── applications/   # Job applications
│   ├── Dockerfile
│   └── requirements.txt
├── mobile/             # React Native (Expo)
│   ├── src/
│   │   ├── api/        # Axios API client
│   │   ├── components/ # Shared UI components
│   │   ├── constants/  # Theme, colors
│   │   ├── context/    # Auth context
│   │   ├── navigation/ # React Navigation stacks
│   │   └── screens/    # All screens
│   ├── App.js
│   └── package.json
└── docker-compose.yml
```

## Запуск Backend

### С Docker
```bash
docker-compose up --build
```

### Без Docker (локально)
```bash
cd backend
pip install -r requirements.txt

# Настроить .env: DB_HOST=localhost
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Создание суперадмина
```bash
docker-compose exec backend python manage.py createsuperuser
```

## Запуск Frontend

```bash
cd mobile
npm install
npx expo start
```

Для Android эмулятора API URL по умолчанию: `http://10.0.2.2:8000/api`
Для физического устройства: заменить на IP компьютера в `src/api/client.js`

## API Endpoints

### Auth
- `POST /api/auth/register/` — регистрация (email, password, confirm_password, role)
- `POST /api/auth/login/` — вход (email, password)
- `POST /api/auth/refresh/` — обновление токена
- `POST /api/auth/logout/` — выход (blacklist refresh)

### Profile
- `GET/PATCH /api/me/` — текущий пользователь
- `GET/PATCH /api/me/profile/` — профиль USER
- `GET/PATCH /api/me/organization/` — профиль ORG

### Vacancies
- `GET /api/vacancies/` — список (фильтры: q, city, salary_from, employment_type, work_format)
- `GET /api/vacancies/{id}/` — детали
- `POST /api/vacancies/create/` — создать (ORG)
- `PATCH /api/vacancies/{id}/edit/` — редактировать (owner)
- `DELETE /api/vacancies/{id}/delete/` — удалить (owner)
- `GET /api/my/vacancies/` — мои вакансии (ORG)

### Resumes
- `GET /api/resumes/` — список
- `GET /api/resumes/{id}/` — детали
- `POST /api/resumes/create/` — создать (USER)
- `PATCH /api/resumes/{id}/edit/` — редактировать (owner)
- `DELETE /api/resumes/{id}/delete/` — удалить (owner)
- `GET /api/my/resumes/` — мои резюме (USER)

### Favorites
- `GET /api/favorites/` — список избранного
- `POST /api/favorites/toggle/` — добавить/удалить из избранного
- `DELETE /api/favorites/{id}/` — удалить

### Applications
- `POST /api/vacancies/{id}/apply/` — откликнуться (USER)
- `GET /api/my/applications/` — мои отклики (USER)
- `GET /api/my/vacancies/{id}/applications/` — отклики на вакансию (ORG)
- `PATCH /api/applications/{id}/status/` — изменить статус (ORG)

## Роли
- **USER** — соискатель: создает резюме, откликается на вакансии
- **ORG** — работодатель: создает вакансии, просматривает отклики
- **SUPERADMIN** — полный доступ через Django Admin (`/admin/`)
