# BCA Study Nepal API Documentation

## Overview
BCA Study Nepal is a platform that provides educational resources for BCA students. This API documentation covers all the endpoints and services available.

## Authentication
The API uses JWT (JSON Web Token) authentication. Most endpoints require authentication except for public resources.

## Base URL
- Development: `http://localhost:8000/api/`
- Production: [Your production URL]

## Available Endpoints

### Authentication
- `POST /api/users/token/` - Obtain JWT token
- `POST /api/users/token/refresh/` - Refresh JWT token

### Colleges
- `GET /api/colleges/` - List all colleges
- `GET /api/colleges/{id}/` - Get college details
- `POST /api/colleges/` - Add new college (Admin only)
- `PUT /api/colleges/{id}/` - Update college (Admin only)
- `DELETE /api/colleges/{id}/` - Delete college (Admin only)

### Notes
- `GET /api/notes/` - List all notes
- `GET /api/notes/{id}/` - Get note details
- `POST /api/notes/` - Upload new note (Authenticated users)
- `GET /api/notes/{id}/download/` - Download note

### Question Papers
- `GET /api/question-papers/` - List all question papers
- `GET /api/question-papers/{id}/` - Get question paper details
- `POST /api/question-papers/` - Upload new question paper
- `GET /api/question-papers/{id}/download/` - Download question paper

### Search
- `GET /api/search/` - Global search across notes, colleges, and question papers

## Rate Limiting
- Anonymous users: 100 requests per hour
- Authenticated users: 1000 requests per hour
- Downloads: 50 per hour per user

## Error Handling
All errors follow a standard format:
```json
{
    "error": "Error Type",
    "detail": "Detailed error message"
}
``` 