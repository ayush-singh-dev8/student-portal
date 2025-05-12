import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Change this to your Spring Boot backend URL if different
});

export default api; 