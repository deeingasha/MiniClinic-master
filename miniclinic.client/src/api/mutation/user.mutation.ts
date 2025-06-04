import { useMutation } from '@tanstack/react-query';

export interface LoginCredentials {
  username: string;
  password: string;
  roleNo: number;
}

export interface LoginResponse {
  token: string;
  message: string;
}

// Function to make the login API call
const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await fetch('/api/Login/Authentication', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to login');
  }

  return response.json();
};

// Hook to use the login mutation
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: loginUser,
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
};

// Function to reset a user's password
export interface ResetPasswordCredentials {
  entityNo: string;
  secretword: string;
  password: string;
}

const resetPassword = async (credentials: ResetPasswordCredentials): Promise<{ message: string }> => {
  const response = await fetch('/api/Login/ResetPassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to reset password');
  }

  return response.json();
};

// Hook to use the password reset mutation
export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: resetPassword,
    onError: (error) => {
      console.error('Password reset error:', error);
    },
  });
};