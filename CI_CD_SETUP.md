# Student Portal CI/CD Setup Documentation

This document outlines the Continuous Integration and Continuous Deployment (CI/CD) setup for the Student Portal project, which consists of:
- Frontend (React)
- Backend (Spring Boot)
- Database (PostgreSQL)

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Repository Structure](#repository-structure)
3. [GitHub Actions Workflows](#github-actions-workflows)
4. [Docker Configuration](#docker-configuration)
5. [Environment Variables](#environment-variables)
6. [Deployment Process](#deployment-process)
7. [Monitoring and Logs](#monitoring-and-logs)

## Prerequisites

### Required Accounts and Access
- GitHub Account
- Docker Hub Account
- Access to deployment environment

### Required Secrets in GitHub Repository
Add these secrets in your GitHub repository (Settings > Secrets and variables > Actions):
```
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-password
FRONTEND_IMAGE=ayushtech123/student-portal-frontend
BACKEND_IMAGE=ayushtech123/student-portal-backend
```

## Repository Structure

```
student-portal/
├── student-portal-frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
├── student-portal-backend/
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
├── .github/
│   └── workflows/
│       ├── frontend.yml
│       └── backend.yml
└── docker-compose.yml
```

## GitHub Actions Workflows

### Frontend Workflow (.github/workflows/frontend.yml)
```yaml
name: Frontend CI/CD

on:
  push:
    branches: [ main ]
    paths:
      - 'student-portal-frontend/**'
  pull_request:
    branches: [ main ]
    paths:
      - 'student-portal-frontend/**'

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        working-directory: ./student-portal-frontend
        run: npm ci
      
      - name: Run tests
        working-directory: ./student-portal-frontend
        run: npm test
      
      - name: Build application
        working-directory: ./student-portal-frontend
        run: npm run build
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: ./student-portal-frontend
          push: true
          tags: |
            ${{ secrets.FRONTEND_IMAGE }}:latest
            ${{ secrets.FRONTEND_IMAGE }}:${{ github.sha }}
```

### Backend Workflow (.github/workflows/backend.yml)
```yaml
name: Backend CI/CD

on:
  push:
    branches: [ main ]
    paths:
      - 'student-portal-backend/**'
  pull_request:
    branches: [ main ]
    paths:
      - 'student-portal-backend/**'

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: maven
      
      - name: Build with Maven
        working-directory: ./student-portal-backend
        run: mvn clean package -DskipTests
      
      - name: Run tests
        working-directory: ./student-portal-backend
        run: mvn test
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: ./student-portal-backend
          push: true
          tags: |
            ${{ secrets.BACKEND_IMAGE }}:latest
            ${{ secrets.BACKEND_IMAGE }}:${{ github.sha }}
```

## Docker Configuration

### Frontend Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile
```dockerfile
# Build stage
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Production stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Docker Compose
```yaml
services:
  postgres:
    image: postgres:latest
    environment:
      POSTGRES_DB: mydatabase
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - student-portal-network

  backend:
    image: ayushtech123/student-portal-backend:latest
    depends_on:
      postgres:
        condition: service_healthy
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/mydatabase
      SPRING_DATASOURCE_USERNAME: myuser
      SPRING_DATASOURCE_PASSWORD: secret
    networks:
      - student-portal-network

  frontend:
    image: ayushtech123/student-portal-frontend:latest
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - REACT_APP_API_URL=http://localhost:8080
    networks:
      - student-portal-network

networks:
  student-portal-network:
    driver: bridge

volumes:
  postgres_data:
```

## Environment Variables

### Frontend Environment Variables
- `REACT_APP_API_URL`: Backend API URL

### Backend Environment Variables
- `SPRING_DATASOURCE_URL`: PostgreSQL connection URL
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password

## Deployment Process

1. **Local Development**
   ```bash
   # Clone the repository
   git clone <repository-url>
   
   # Start the services
   docker compose up -d
   ```

2. **Production Deployment**
   ```bash
   # Pull the latest images
   docker compose pull
   
   # Start the services
   docker compose up -d
   ```

## Monitoring and Logs

### View Container Logs
```bash
# View all container logs
docker compose logs

# View specific service logs
docker compose logs frontend
docker compose logs backend
docker compose logs postgres
```

### Container Status
```bash
# Check container status
docker compose ps

# Check container health
docker ps --format "table {{.Names}}\t{{.Status}}"
```

## Troubleshooting

### Common Issues and Solutions

1. **Port Conflicts**
   - Check if ports 3000, 8080, or 5432 are already in use
   - Use `docker compose down` to stop all containers
   - Modify port mappings in docker-compose.yml if needed

2. **Database Connection Issues**
   - Ensure PostgreSQL container is healthy
   - Check database credentials in environment variables
   - Verify network connectivity between containers

3. **Build Failures**
   - Check GitHub Actions logs for detailed error messages
   - Verify all required secrets are set in GitHub
   - Ensure Docker Hub credentials are correct

## Security Considerations

1. **Secrets Management**
   - Never commit sensitive data to the repository
   - Use GitHub Secrets for sensitive information
   - Rotate Docker Hub passwords regularly

2. **Network Security**
   - Use Docker networks to isolate services
   - Expose only necessary ports
   - Implement proper authentication in the application

## Best Practices

1. **Version Control**
   - Use semantic versioning for releases
   - Tag Docker images with both latest and specific versions
   - Keep commit messages clear and descriptive

2. **Testing**
   - Write unit tests for both frontend and backend
   - Include integration tests
   - Run tests in CI pipeline before deployment

3. **Documentation**
   - Keep README files updated
   - Document API changes
   - Maintain changelog for releases 