# SpendSense API

Personal expense tracking application with Django REST Framework backend and a minimal React frontend.

---

## Demo

- Live Project demo: [Click here to view](https://drive.google.com/file/d/1XaETIr6R5hK38w_hNPW4c2idIO8A6fWW/view?usp=sharing)


---

## Features

### Backend
- JWT authentication (access + refresh tokens)
- User registration with OTP email verification
- Category management (CRUD)
- Expense management (CRUD)
- Budget management
- Monthly, daily, and category-wise analytics
- Async email sending using Celery + Redis
- Environment-based configuration
- Swagger API documentation

### Frontend
- React application for user authentication and dashboard
- Protected routes
- Category and expense management UI
- Axios integration with JWT token handling

---

## Tech Stack

### Backend
- Django
- Django REST Framework
- Simple JWT
- MySQL
- Celery
- Redis
- drf-yasg (Swagger)

### Frontend
- React (Vite)
- React Router
- Axios
- Context API

---

## API Structure

- `/api/accounts/` → registration & OTP verification
- `/api/auth/` → JWT token & refresh
- `/api/categories/` → expense categories
- `/api/expenses/` → expense CRUD
- `/api/budgets/` → budget CRUD
- `/api/analytics/` → aggregated insights
- `/swagger/` → API documentation
- `/` → health response

---

## Environment Setup

### Prerequisites
- Python 3.10+
- Node.js 16+
- MySQL
- Redis

### 1. Clone Repository

```bash
git clone <repo-url>
cd spendsense
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
```

### 3. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create `.env` from example:

```bash
cp .env.example .env
```

`.env` is excluded from version control.

---

## Database Setup

Ensure MySQL is running, then:

```bash
python manage.py migrate
python manage.py createsuperuser
```

---

## Running Locally

### Start Redis

```bash
redis-server
```

### Start Django Server

```bash
python manage.py runserver
```

Backend runs at: http://127.0.0.1:8000

### Start Celery Worker

```bash
celery -A core worker -l info --pool=solo
```

### Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

---

## API Documentation

Swagger UI: http://127.0.0.1:8000/swagger/

---

## Notes

- Celery is used for asynchronous email delivery.
- Analytics are calculated using database aggregation queries.
- JWT provides stateless authentication.
- All sensitive settings are managed through environment variables.
