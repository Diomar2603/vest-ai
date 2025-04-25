"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ClothingCard } from "@/components/ui/clothing-card"
import { Header } from "@/components/ui/header"
import { Sidebar } from "@/components/ui/sidebar"
import { useWishlist } from "@/hooks/useWishlist"
import { useAddToWardrobe } from "@/hooks/useAddToWardrobe"
import { useWardrobeSections } from "@/hooks/useWardrobeSections"

export default function WishlistPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const { wishlistItems, isLoading, deleteFromWishlist } = useWishlist()
  const { sections: wardrobeSections, isLoading: sectionsLoading } = useWardrobeSections()
  const { addToWardrobe } = useAddToWardrobe()

  const handleRemoveFromWishlist = async (itemId: string) => {
    try {
      await deleteFromWishlist.mutateAsync(itemId)
      toast.success("Item removido da lista de desejos")
    } catch (error) {
      toast.error("Erro ao remover item da lista de desejos")
    }
  }

  const handleAddToWardrobe = async (itemId: string, sectionId: string) => {
    try {
      await addToWardrobe({ 
        itemId, 
        sectionId,
        items: [{ id: itemId, src: wishlistItems?.find((item: { _id: string, src: string }) => item._id === itemId)?.src || '', alt: '' }]
      })
      toast.success("Item adicionado ao guarda-roupa")
    } catch (error) {
      toast.error("Erro ao adicionar item ao guarda-roupa")
    }
  }

  const handleImageSearch = async (src: string) => {
    const urlImagem = encodeURIComponent(src);
    const urlBusca = `https://lens.google.com/uploadbyurl?url=${urlImagem}`;
    window.open(urlBusca, '_blank');
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="rounded-full"
        >
          {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <Sidebar isMobile={false} />
      <Sidebar 
        isMobile={true} 
        isMobileSidebarOpen={isMobileSidebarOpen} 
        setIsMobileSidebarOpen={setIsMobileSidebarOpen} 
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Lista de Desejos</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {wishlistItems?.map((item : {_id : string, src: string, alt: string}) => (
                <ClothingCard 
                  key={item._id}
                  id={item._id}
                  src={item.src}
                  alt={item.alt}
                  buttons={["remove", "link", "wardrobe"]}
                  onRemoveFromWardrobe={() => handleRemoveFromWishlist(item._id)}
                  onSearchImage={() => handleImageSearch(item.src)}
                  onAddToWardrobe={handleAddToWardrobe}
                  wardrobeSections={wardrobeSections}
                  isWishlist={true}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}