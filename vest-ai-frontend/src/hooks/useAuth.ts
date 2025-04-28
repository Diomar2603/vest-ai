import { useMutation } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  gender: string;
  phoneNumber?: string;

  dressingStyle: string[];
  preferredColors: string[];
  clothingSize: string;
  fitPreference: string;

  age: number;
  ethnicity: string;
  hasObesity: boolean;
  salaryRange: number;
  hobbies: string[];
}

interface ResetPassword{
  email: string;
}



export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to login');
      }
      
      return response.json();
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to register');
      }
      
      return response.json();
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (data: ResetPassword) => {
      const response = await fetch(`${API_URL}/auth/resetPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed reset password');
      }
      
      return response.json();
    },
  });
}