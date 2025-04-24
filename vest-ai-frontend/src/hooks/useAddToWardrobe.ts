import { toast } from "sonner"

interface AddToWardrobeParams {
  itemId: number
  sectionId: string
  items: Array<{ id: number; src: string; alt: string }>
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useAddToWardrobe() {
  const addToWardrobe = async ({ itemId, sectionId, items }: AddToWardrobeParams) => {
    try {
      const item = items.find(item => item.id === itemId)
      
      const response = await fetch(`${API_URL}/wardrobe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          section: sectionId,
          src: item?.src,
          alt: item?.alt
        })
      });

      if (!response.ok) throw new Error();
      toast.success("Item adicionado ao guarda-roupa");
    } catch (error) {
      toast.error("Erro ao adicionar item ao guarda-roupa");
    }
  };

  return { addToWardrobe }
}