import { UserModel } from '@/types';
import { jwtDecode } from 'jwt-decode';

// Define types for authentication
export interface LoginCredentials {
  username: string;
  password: string;
  roleNo: number;
}

interface JwtPayload {
  name: string;
  entityNumber: string;
  secretword: string;
  role: string;
  exp: number;
}

// Helper function to map role number to role string
const mapRoleNumberToString = (roleNo: string): UserModel['role'] => {
  // Map role numbers to user roles based on your system's roles
  switch (roleNo) {
    case "1": return "admin";
    case "2": return "doctor";
    case "3": return "nurse";
    case "4": return "receptionist";
    case "5": return "patient";
    case "6": return "finance";
    case "7": return "pathologist";
    case "8": return "pharmacist";
    default: return "patient"; // Default role
  }
};

// Authentication service
export const authService = {
  // Login function - now works with real API
  async login(loginResponse: { token: string }): Promise<UserModel> {
    const token = loginResponse.token;
    
    // Store token in local storage
    localStorage.setItem('token', token);
    
    // Decode token to get user information
    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      
      // Create user object from token payload
      const user: UserModel = {
        id: decodedToken.entityNumber,
        firstName: decodedToken.name.split(' ')[0] || '',
        lastName: decodedToken.name.split(' ').slice(1).join(' ') || '',
        email: '', // Not available in token
        role: mapRoleNumberToString(decodedToken.role),
        department: undefined,
        phone: '',
        username: '',
        shift: undefined
      };
      
      // Store user in local storage
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new Error('Invalid token');
    }
  },

  // Logout function
  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user from local storage
  getCurrentUser(): UserModel | null {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      // Try to reconstruct user from token
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        
        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          this.logout();
          return null;
        }
        
        const user: UserModel = {
          id: decodedToken.entityNumber,
          firstName: decodedToken.name.split(' ')[0] || '',
          lastName: decodedToken.name.split(' ').slice(1).join(' ') || '',
          email: '',
          role: mapRoleNumberToString(decodedToken.role),
          department: undefined,
          phone: '',
          username: '',
          shift: undefined
        };
        
        return user;
      } catch (error) {
        console.error('Error decoding token:', error);
        this.logout();
        return null;
      }
    }

    try {
      return JSON.parse(userJson) as UserModel;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      localStorage.removeItem('user');
      return null;
    }
  },

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    
    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;
      
      if (decodedToken.exp < currentTime) {
        // Token is expired
        this.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Invalid token:', error);
      this.logout();
      return false;
    }
  },
};
