// API Configuration
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'https://b01068571f2b.ngrok-free.app';

// API Endpoints
export const API_ENDPOINTS = {
  companies: `${API_BASE_URL}/api/companies`,
  // Add other endpoints as needed
} as const;
