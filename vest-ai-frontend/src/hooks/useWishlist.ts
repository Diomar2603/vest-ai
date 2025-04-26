import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

interface WishlistItem {
  _id: string
  src: string
  alt: string
  userId: string
}

export function useWishlist() {
  const queryClient = useQueryClient()
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const { data: wishlistItems, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/wishlist`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch wishlist')
      return response.json()
    }
  })

  const addToWishlist = useMutation({
    mutationFn: async (item: { src: string; alt: string }) => {
      const response = await fetch(`${API_URL}/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(item)
      })
      if (!response.ok) throw new Error('Failed to add to wishlist')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    }
  })

  const deleteFromWishlist = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await fetch(`${API_URL}/wishlist/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!response.ok) throw new Error('Failed to delete from wishlist')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    }
  })

  return { 
    wishlistItems, 
    isLoading, 
    addToWishlist,
    deleteFromWishlist
  }
}