// API client for communicating with the unified server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://91.108.112.113:8080/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  user?: any;
  users?: any[];
  analytics?: any;
  exists?: boolean;
  oldCredits?: number;
  newCredits?: number;
}

class ApiClient {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      method: options.method || 'GET',
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options, credentials: 'omit', cache: 'no-store' });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Authentication
  async register(userData: { name: string; email: string; password: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async loginWithGoogle(idToken: string) {
    return this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
  }

  async checkEmailExists(email: string) {
    return this.request<{ exists: boolean }>('/auth/check-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // User management
  async getUserById(id: string) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id: string, updates: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: typeof updates.name === 'string' ? updates.name : undefined,
        email: typeof updates.email === 'string' ? updates.email : undefined,
      }),
    });
  }

  // Credit management
  async updateCredits(id: string, credits: number) {
    return this.request(`/users/${id}/credits`, {
      method: 'POST',
      body: JSON.stringify({ credits }),
    });
  }

  async addCredits(id: string, creditsToAdd: number) {
    return this.request(`/users/${id}/credits/add`, {
      method: 'POST',
      body: JSON.stringify({ creditsToAdd }),
    });
  }

  async deductVideoCredits(id: string) {
    return this.request(`/users/${id}/credits/deduct-video`, {
      method: 'POST',
    });
  }

  async deduct3DModelCredits(id: string) {
    return this.request(`/users/${id}/credits/deduct-3d`, {
      method: 'POST',
    });
  }

  // Admin
  async getAllUsers() {
    return this.request('/admin/users');
  }

  async deleteUser(id: string) {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getAnalytics() {
    return this.request('/admin/analytics');
  }

  async getAnalyticsByPeriod(period: string) {
    return this.request(`/admin/analytics/${period}`);
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiClient = new ApiClient();

// Legacy service wrapper for backward compatibility
export const userService = {
  // Authentication
  async register(userData: { name: string; email: string; password: string }) {
    const response = await apiClient.register(userData);
    return response.user;
  },

  async login(email: string, password: string) {
    const response = await apiClient.login(email, password);
    return response.user;
  },

  async loginWithGoogle(idToken: string) {
    const response = await apiClient.loginWithGoogle(idToken);
    return response.user;
  },

  async findUserByEmail(email: string) {
    // Note: This would need a new endpoint in the API
    // For now, we'll use the existing database method
    throw new Error('findUserByEmail not implemented in API yet');
  },

  // User management
  async getUserById(id: string) {
    const response = await apiClient.getUserById(id);
    return response.user;
  },

  async updateUser(id: string, updates: any) {
    const response = await apiClient.updateUser(id, updates);
    return response.user;
  },

  // Credit management
  async updateCredits(id: string, credits: number) {
    const response = await apiClient.updateCredits(id, credits);
    return response.user;
  },

  async addCredits(id: string, creditsToAdd: number) {
    const response = await apiClient.addCredits(id, creditsToAdd);
    return response.user;
  },

  async deductVideoCredits(id: string) {
    const response = await apiClient.deductVideoCredits(id);
    return response.user;
  },

  async deduct3DModelCredits(id: string) {
    const response = await apiClient.deduct3DModelCredits(id);
    return response.user;
  },

  // Email validation
  async checkEmailExists(email: string) {
    const response = await apiClient.checkEmailExists(email);
    return response.exists;
  },

  // Admin
  async getAllUsers() {
    const response = await apiClient.getAllUsers();
    return response.users;
  },

  async deleteUser(id: string) {
    const response = await apiClient.deleteUser(id);
    return response.success;
  },

  async getAnalytics() {
    const response = await apiClient.getAnalytics();
    return response.analytics;
  },

  async getAnalyticsByPeriod(period: string) {
    const response = await apiClient.getAnalyticsByPeriod(period);
    return response.analytics;
  },
};
