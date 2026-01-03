/**
 * API Service Module
 * 
 * Centralized API communication layer for the Job Application Tracker.
 * Handles all HTTP requests to the FastAPI backend with proper error handling.
 * Base URL: http://127.0.0.1:8000
 */

const API_BASE_URL = 'http://127.0.0.1:8000';

// ============================================
// Authentication APIs
// ============================================

/**
 * Register a new user account
 * @param {string} email - User email address
 * @param {string} password - User password
 * @returns {Promise<Object>} Response with success message
 */
export const signupUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Signup failed');
  }

  return response.json();
};

/**
 * Authenticate user and obtain JWT token
 * @param {string} email - User email address
 * @param {string} password - User password
 * @returns {Promise<Object>} Response with access_token
 */
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Login failed');
  }

  return response.json();
};

// ============================================
// Job Application APIs
// ============================================

/**
 * Create a new job application
 * @param {Object} jobData - Job application data (company, role, status, notes)
 * @param {string} token - JWT authentication token
 * @returns {Promise<Object>} Created job application with _id
 */
export const createJob = async (jobData, token) => {
  const response = await fetch(`${API_BASE_URL}/jobs/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(jobData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create job');
  }

  return response.json();
};

/**
 * Fetch all job applications for authenticated user
 * @param {string} token - JWT authentication token
 * @returns {Promise<Array>} Array of job application objects
 */
export const getJobs = async (token) => {
  const response = await fetch(`${API_BASE_URL}/jobs/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch jobs');
  }

  return response.json();
};

/**
 * Fetch job application statistics
 * @param {string} token - JWT authentication token
 * @returns {Promise<Object>} Stats object with counts and conversion rates
 */
export const getStats = async (token) => {
  const response = await fetch(`${API_BASE_URL}/jobs/stats`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch stats');
  }

  return response.json();
};
/**
 * Update an existing job application
 * @param {string} jobId - ID of job to update
 * @param {Object} updates - Fields to update (company, role, status, notes)
 * @param {string} token - JWT authentication token
 * @returns {Promise<Object>} Updated job application
 */export const updateJob = async (jobId, jobData, token) => {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(jobData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update job');
  }

  return response.json();
};

/**
 * Delete a job application
 * @param {string} jobId - ID of job to delete
 * @param {string} token - JWT authentication token
 * @returns {Promise<Object>} Deletion confirmation message
 */
export const deleteJob = async (jobId, token) => {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to delete job');
  }

  return response.json();
};
