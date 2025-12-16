# SpendSense API

A production-ready backend API for personal expense tracking with authentication, analytics, and async email verification.

This project is API-only (no frontend).

## Features

- JWT authentication (access + refresh)

- User registration with OTP email verification

- Category & expense management (CRUD)

- Monthly, daily & category-wise analytics

- Budget management

-Async email sending using Celery + Redis

- Secure environment-based configuration

- Swagger API documentation

## Tech Stack

- Backend: Django, Django REST Framework

- Auth: Simple JWT

- Async Tasks: Celery + Redis

- Database: MySQL

- Docs: Swagger (drf-yasg)

- Deployment: Render

## API Structure

- /api/accounts/ → registration & OTP verification

- /api/auth/ → JWT token & refresh

- /api/categories/ → expense categories

- /api/expenses/ → expense CRUD

- /api/budgets/ → budget CRUD

- /api/analytics/ → aggregated insights

- /swagger/ → API documentation

- Root / returns a simple health response.

## Environment Setup

- Python 3.10+

- git clone <repo-url>
- cd spendsense
- python -m venv venv
- source venv/bin/activate   # Windows: venv\Scripts\activate
- pip install -r requirements.txt


## Create .env from the example:

- cp .env.example .env


.env is intentionally excluded.
Create your own from .env.example.

## Database

MySQL must be running.

python manage.py migrate
python manage.py createsuperuser

Running Locally
Start Redis:
redis-server

Start Django:
python manage.py runserver

Start Celery worker:
celery -A core worker -l info --pool=solo

(Email OTPs print to console in development.)

## API Docs

### Swagger UI:

- http://127.0.0.1:8000/swagger/

## Deployment (Render)

- Environment variables are configured in Render dashboard

- No .env file is committed or used in production

- Redis is used as the Celery broker

### Separate services:

- Web (Django)

- Worker (Celery)

## Design Notes

- API-only backend by design

- Celery is used to avoid blocking requests during email delivery

- Analytics are calculated using database aggregation queries

- JWT ensures stateless authentication

- Settings are environment-driven for safe deployment

 
