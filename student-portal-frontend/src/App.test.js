import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import '@testing-library/jest-dom';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }))
}));

test('renders navigation links', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  
  // Check for Dashboard link
  const dashboardLink = screen.getByText(/dashboard/i);
  expect(dashboardLink).toBeInTheDocument();
  
  // Check for Add Student link
  const addStudentLink = screen.getByText(/add student/i);
  expect(addStudentLink).toBeInTheDocument();
});
