import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import '@testing-library/jest-dom';

// Mock any modules that App depends on
jest.mock('./services/api', () => {
  return {
    get: jest.fn(() => Promise.resolve({ data: {} }))
  };
});

// Mock the components that use axios
jest.mock('./pages/Dashboard', () => () => <div>Dashboard</div>);
jest.mock('./pages/AddStudent', () => () => <div>Add Student</div>);
jest.mock('./pages/EditStudent', () => () => <div>Edit Student</div>);

test('renders without crashing', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  // Test for a basic element that should be present
  const appElement = document.querySelector('.App');
  expect(appElement).toBeInTheDocument();
});

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
