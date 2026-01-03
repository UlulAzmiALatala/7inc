/**
 * Modern Authentication Service
 * Handles all auth operations dengan error handling dan CORS support
 */

const API_URL = 'http://localhost:8000/api';

class AuthService {
  constructor() {
    this.baseURL = API_URL;
  }

  /**
   * Sanitize URL - pastikan tidak ada double /api/
   */
  sanitizeUrl(endpoint) {
    if (endpoint.startsWith('/')) {
      return endpoint;
    }
    return '/' + endpoint;
  }

  /**
   * Get auth headers dengan CORS config
   */
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': window.location.origin,
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Make API request dengan proper error handling
   */
  async request(endpoint, method = 'GET', body = null, includeAuth = true) {
    const url = `${this.baseURL}${this.sanitizeUrl(endpoint)}`;

    const config = {
      method,
      headers: this.getHeaders(includeAuth),
      credentials: 'include', // Important untuk CORS
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);

      // Check response content type
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text };
      }

      // Handle HTTP errors
      if (!response.ok) {
        throw {
          status: response.status,
          statusText: response.statusText,
          data: data,
          message: data?.message || data?.error || 'Request failed',
        };
      }

      return {
        success: true,
        data,
        status: response.status,
      };
    } catch (error) {
      console.error('Auth Service Error:', error);
      throw {
        success: false,
        status: error.status || 0,
        message: error.message || 'Network error',
        data: error.data || null,
      };
    }
  }

  /**
   * Register user dengan role
   */
  async register(name, email, password, role = 'writer') {
    return this.request('/auth/register', 'POST', {
      name,
      email,
      password,
      password_confirmation: password,
      role,
    }, false);
  }

  /**
   * Login user
   */
  async login(email, password) {
    try {
      const result = await this.request('/auth/login', 'POST', {
        email,
        password,
      }, false);

      if (result.success && result.data.token) {
        // Store auth data
        this.setToken(result.data.token);
        this.setRole(result.data.user.role);
        this.setUser(result.data.user);

        return {
          success: true,
          user: result.data.user,
          token: result.data.token,
        };
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      await this.request('/auth/logout', 'POST', {}, true);
    } catch (error) {
      // Ignore error, just clear local storage
      console.warn('Logout request failed, clearing local storage anyway');
    } finally {
      this.clearAuth();
    }
  }

  /**
   * Get current user info
   */
  async me() {
    return this.request('/auth/me', 'GET', null, true);
  }

  /**
   * Token management
   */
  setToken(token) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  hasToken() {
    return !!this.getToken();
  }

  /**
   * Role management
   */
  setRole(role) {
    localStorage.setItem('role', role);
  }

  getRole() {
    return localStorage.getItem('role');
  }

  /**
   * User data management
   */
  setUser(user) {
    localStorage.setItem('userData', JSON.stringify(user));
  }

  getUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Clear all auth data
   */
  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userData');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.hasToken() && this.getRole();
  }

  /**
   * Check if user has specific role
   */
  hasRole(role) {
    const userRole = this.getRole();
    return userRole === role;
  }

  /**
   * Check if user has any of the roles
   */
  hasAnyRole(roles = []) {
    const userRole = this.getRole();
    return roles.includes(userRole);
  }
}

// Export singleton instance
export default new AuthService();
