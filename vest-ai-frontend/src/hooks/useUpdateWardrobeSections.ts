import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function useUpdateWardrobeSections() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (sections: Array<{ _id: string; name: string }>) => {
      const response = await fetch(`${API_URL}/wardrobe/sections`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ sections })
      })

      if (!response.ok) throw new Error('Failed to update sections')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wardrobeSections'] })
    }
  })
}