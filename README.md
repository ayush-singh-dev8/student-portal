# Student Portal

A full-stack student portal application with React frontend and Spring Boot backend.

## Project Structure

```
student-portal/
├── student-portal-frontend/    # React frontend application
├── student-portal-backend/     # Spring Boot backend application
├── docker-compose.yml         # Docker Compose configuration
└── README.md                  # This file
```

## Prerequisites

- Java 17
- Node.js 18
- Docker and Docker Compose
- Maven
- npm

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/student-portal.git
   cd student-portal
   ```

2. Start the application using Docker Compose:
   ```bash
   docker compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

## Development

### Frontend Development
```bash
cd student-portal-frontend
npm install
npm start
```

### Backend Development
```bash
cd student-portal-backend
./mvnw spring-boot:run
```

## Testing

### Frontend Tests
```bash
cd student-portal-frontend
npm test
```

### Backend Tests
```bash
cd student-portal-backend
./mvnw test
```

## Docker

Build and run using Docker Compose:
```bash
docker compose up --build
```

## CI/CD

This project uses GitHub Actions for CI/CD. The pipeline:
1. Runs tests for both frontend and backend
2. Builds Docker images
3. Pushes images to Docker Hub
4. Deploys to server (when configured)

## License

MIT # Testing CI Pipeline
