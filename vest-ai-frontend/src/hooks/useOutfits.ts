import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

interface OutfitItem {
  id: string
  section: string
  src: string
  alt: string
}

interface Outfit {
  _id: string
  name: string
  items: OutfitItem[]
  userId: string
}

interface CreateOutfitDTO {
  name: string
  items: OutfitItem[]
}

export function useOutfits() {
  const queryClient = useQueryClient()
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const { data: outfits, isLoading } = useQuery({
    queryKey: ['outfits'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/outfits`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      })
      if (!response.ok) throw new Error('Failed to fetch outfits')
      return response.json()
    }
  })

  const createOutfit = useMutation({
    mutationFn: async (data: CreateOutfitDTO) => {
      const response = await fetch(`${API_URL}/outfits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('Failed to create outfit')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outfits'] })
    }
  })

  const deleteOutfit = useMutation({
    mutationFn: async (outfitId: string) => {
      const response = await fetch(`${API_URL}/outfits/${outfitId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!response.ok) throw new Error('Failed to delete outfit')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outfits'] })
    }
  })

  return {
    outfits,
    isLoading,
    createOutfit,
    deleteOutfit
  }
}