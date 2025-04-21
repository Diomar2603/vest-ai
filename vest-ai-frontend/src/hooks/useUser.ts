import { authorizedFetch } from '@/lib/authorizedFetch';
import { useMutation, useQuery } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface UserData {
    phoneNumber: string;
    fullName: string;
    email: string;
    joinDate: string
}

interface UpdateUserCredentials {
  phoneNumber: string;
  fullName: string;
  email: string;
}

interface UpdateUserPassword {
  oldPassword: string,
  newPassword: string
}

export function useGetUserCredentials() {
  return useQuery<UserData,Error>({
    queryKey: ['userCredentials'],
    queryFn: async () => {
      const response = await authorizedFetch(`${API_URL}/user/credentials`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao buscar credenciais');
      }
    
      const data = await response.json();
    
      const formatted: UserData = {
        fullName: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        joinDate: new Date(data.createdAt).toLocaleDateString('pt-BR'),
      };
    
      return formatted;
    }    
  });
}

export function useUpdateCredentials() {
  return useMutation({
    mutationFn: async (credentials: UpdateUserCredentials) => {
      const response = await authorizedFetch(`${API_URL}/user/updateCredentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed update credentials');
      }
      
      return response.json();
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async (credentials: UpdateUserPassword) => {
      const response = await authorizedFetch(`${API_URL}/user/updatePassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed update credentials');
      }
      
      return response.json();
    },
  });
}