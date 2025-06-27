<h1 align="center">🎓 BCA Study Nepal</h1>

<div align="center">
  
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.1-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)

</div>

<p align="center">
    A comprehensive study platform for BCA students of Pokhara University, providing access to notes, syllabi, and resources.
</p>

<hr>

## 📑 Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

<hr>

## 🌟 Overview

**BCA Study Nepal** is a modern, full-stack web application designed to support BCA students at Pokhara University. The platform offers:

- 📚 Comprehensive study materials and notes
- 📝 Past question papers and solutions
- 🎓 College information and comparisons
- 👥 User authentication with Google OAuth
- 📱 Responsive design for all devices
- 🔍 Advanced search and filtering capabilities

## 🚀 Key Features

### For Students
- **Study Resources**
  - Semester-wise notes and materials
  - Past question papers with solutions
  - Syllabus and course information
  
### For Colleges
- **College Profiles**
  - Detailed college information
  - Admission procedures
  - Fee structures
  
### Technical Features
- **Authentication & Security**
  - Google OAuth integration
  - JWT-based authentication
  - Rate limiting and security measures
  
- **Performance**
  - Elasticsearch integration for fast search
  - Redis caching (planned)
  - Optimized database queries

## 💻 Tech Stack

### Backend
- **Framework:** Django 5.1, Django REST Framework
- **Database:** MySQL
- **Search:** Elasticsearch
- **Authentication:** JWT, Google OAuth
- **Email:** SMTP with Gmail
- **Documentation:** drf-yasg (Swagger/OpenAPI)

### Frontend
- **Framework:** React 18 with TypeScript
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **UI Components:** Material-UI
- **Forms:** React Hook Form
- **API Client:** Axios

## 📁 Project Structure

\`\`\`
BCA Study Nepal/
├── backend/
│   ├── api/
│   │   ├── apps/
│   │   │   ├── colleges/
│   │   │   ├── notes/
│   │   │   ├── resources/
│   │   │   ├── subjects/
│   │   │   └── users/
│   │   ├── core/
│   │   └── utils/
│   └── config/
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── features/
    │   ├── hooks/
    │   ├── services/
    │   └── utils/
    └── public/
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 16+
- MySQL 8.0+
- Git

### Installation

1. **Clone the Repository**
\`\`\`bash
git clone https://github.com/FarhanAlam-Official/BCA-Study-Nepal.git
cd BCA-Study-Nepal
\`\`\`

2. **Backend Setup**
\`\`\`bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
\`\`\`

3. **Frontend Setup**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

### Environment Setup

Create a \`.env\` file in the backend directory:

\`\`\`env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=mysql://user:password@localhost:3306/bca_study_nepal
GOOGLE_OAUTH2_CLIENT_ID=your-client-id
GOOGLE_OAUTH2_CLIENT_SECRET=your-client-secret
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
\`\`\`

## 📚 API Documentation

API documentation is available at:
- Swagger UI: \`http://localhost:8000/api/swagger/\`
- ReDoc: \`http://localhost:8000/api/redoc/\`

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📬 Contact

- **Project Lead:** [Farhan Alam](https://github.com/FarhanAlam-Official)
- **Email:** [istaqalam930@gmail.com](mailto:thefarhanalam01@gmail.com)
- **Project Link:** [https://github.com/FarhanAlam-Official/BCA-Study-Nepal](https://github.com/FarhanAlam-Official/BCA-Study-Nepal)

<div align="center">
  <sub>Built with ❤️ by Farhan Alam</sub>
</div>
