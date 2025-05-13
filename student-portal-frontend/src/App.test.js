import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import '@testing-library/jest-dom';

// Mock the components that use axios
jest.mock('./pages/Dashboard', () => () => <div data-testid="dashboard-page">Dashboard</div>);
jest.mock('./pages/AddStudent', () => () => <div>Add Student</div>);
jest.mock('./pages/EditStudent', () => () => <div>Edit Student</div>);

test('renders without crashing', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  // Test for a basic element that should be present
  const appElement = document.querySelector('.App');
  expect(appElement).toBeInTheDocument();
});

test('renders navigation links', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  
  // Check for Dashboard link in navigation
  const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
  expect(dashboardLink).toBeInTheDocument();
  expect(dashboardLink).toHaveAttribute('href', '/');
  
  // Check for Add Student link
  const addStudentLink = screen.getByRole('link', { name: /add student/i });
  expect(addStudentLink).toBeInTheDocument();
  expect(addStudentLink).toHaveAttribute('href', '/add');
});
