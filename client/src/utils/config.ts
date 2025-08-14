// API Configuration

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
  companies: `${API_BASE_URL}/api/companies`,
  // Add other endpoints as needed
} as const;

// PostHog Configuration
export const POSTHOG_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_POSTHOG_API_KEY || '',
  host: process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
  enabled: process.env.EXPO_PUBLIC_POSTHOG_ENABLED === 'true',
} as const;
