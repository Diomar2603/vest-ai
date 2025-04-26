import { authorizedFetch } from '@/lib/authorizedFetch';
import { useMutation, useQuery } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface UserData {
    phoneNumber: string;
    fullName: string;
    email: string;
    joinDate: string
    preference: {
      gender: string;
      dressingStyle: string[];
      preferredColors: string[];
      clothingSize: string;
      fitPreference: string;
      age?: string;
      ethnicity?: string;
      hasObesity?: boolean;
      salaryRange?: number;
      hobbies?: string[];
    };
}

interface UpdateUserCredentials {
  phoneNumber: string;
  fullName: string;
  email: string;
}

interface UpdateUserPersonalInformations{
  age: number;
  gender: string;
  ethnicity: string;
  hasObesity: boolean;
  salaryRange: number;
}

interface UpdateUserFashionInformations{
  dressingStyle : string[];
  preferredColors : string[];
  hobbies : string[];
  clothingSize: string;
  fitPreference: string;
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
        preference: {
          gender: data.preference.gender,
          dressingStyle: data.preference.dressingStyle,
          preferredColors: data.preference.preferredColors,
          clothingSize: data.preference.clothingSize,
          fitPreference: data.preference.fitPreference,
          age: data.preference.age,
          ethnicity: data.preference.ethnicity,
          hasObesity: data.preference.hasObesity,
          salaryRange: data.preference.salaryRange,
          hobbies: data.preference.hobbies
        },
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

export function useUpdatePersonalInformations() {
  return useMutation({
    mutationFn: async (credentials: UpdateUserPersonalInformations) => {
      const response = await authorizedFetch(`${API_URL}/user/updatePersonalInformations`, {
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

export function useUpdateFashionInformations() {
  return useMutation({
    mutationFn: async (credentials: UpdateUserFashionInformations) => {
      const response = await authorizedFetch(`${API_URL}/user/updateFashionInformations`, {
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