// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock React Router hooks
const mockNavigate = jest.fn();
const mockLocation = {
  pathname: '/',
  search: '',
  hash: '',
  state: null
};
const mockParams = {};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
  useParams: () => mockParams,
  MemoryRouter: ({ children }) => children
}));

// Reset mocks before each test
beforeEach(() => {
  mockNavigate.mockReset();
  mockLocation.pathname = '/';
  mockLocation.search = '';
  mockLocation.hash = '';
  mockLocation.state = null;
  Object.keys(mockParams).forEach(key => delete mockParams[key]);
});
