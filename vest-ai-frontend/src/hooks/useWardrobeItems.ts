import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export interface WardrobeItem {
  _id: string
  src: string
  alt: string
  section: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function useWardrobeItems() {
  const { data: items, isLoading } = useQuery({
    queryKey: ['wardrobeItems'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/wardrobe`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch wardrobe items')
      return response.json()
    }
  })

  const queryClient = useQueryClient()

  const deleteItem = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await fetch(`${API_URL}/wardrobe/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!response.ok) throw new Error('Failed to delete wardrobe item')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wardrobeItems'] })
    }
  })

  return { items, isLoading, deleteItem }
}

