import { useMutation } from '@tanstack/react-query';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ChatMessage {
  message: string;
  userId: string;
}

export function useSendMessage() {
  return useMutation({
    mutationFn: async (data: ChatMessage) => {
      const response = await fetch(`${API_URL}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      return response.json();
    },
  });
}