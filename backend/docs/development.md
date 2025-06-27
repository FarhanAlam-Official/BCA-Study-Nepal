# Development Setup Guide

## Prerequisites
- Python 3.8+
- pip
- virtualenv (recommended)
- Git

## Initial Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd bca-study-nepal
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
- Copy `.env.example` to `.env`
- Update the values as needed

5. Run migrations:
```bash
python manage.py migrate
```

6. Create superuser:
```bash
python manage.py createsuperuser
```

7. Run development server:
```bash
python manage.py runserver
```

## Project Structure

```
backend/
├── api/
│   ├── apps/           # Django apps
│   │   ├── colleges/   # College-related functionality
│   │   ├── notes/      # Notes-related functionality
│   │   ├── subjects/   # Subjects and programs
│   │   └── users/      # User management
│   ├── core/           # Core functionality
│   ├── services/       # Business logic
│   └── utils/          # Utility functions
├── docs/               # Documentation
├── media/              # User-uploaded files
└── static/             # Static files
```

## Development Guidelines

1. Code Style
- Follow PEP 8 guidelines
- Use meaningful variable and function names
- Add docstrings for functions and classes

2. Git Workflow
- Create feature branches from `develop`
- Use meaningful commit messages
- Submit pull requests for review

3. Testing
- Write tests for new features
- Run tests before committing:
```bash
python manage.py test
```

4. API Development
- Document new endpoints in `docs/api/README.md`
- Follow REST principles
- Use appropriate HTTP methods and status codes

## Common Issues and Solutions

1. Database Issues
```bash
python manage.py migrate --run-syncdb
```

2. Static Files
```bash
python manage.py collectstatic
```

3. Cache Clear
```bash
python manage.py clear_cache
``` 