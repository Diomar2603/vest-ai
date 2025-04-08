"use client"

import { useState } from "react"
import { Menu, X, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/ui/sidebar"
import { Header } from "@/components/ui/header"
import { ClothingCard } from "@/components/ui/clothing-card"

export default function WishlistPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [wishlistItems] = useState([
    { id: 1, src: "https://media.istockphoto.com/id/483960103/pt/foto/t-shirt-preta-em-branco-à-frente-com-traçado-de-recorte.jpg?s=2048x2048&w=is&k=20&c=a_H5M2ukApXL_j5aoY3ABMAIMvbUoejjqBdUPYWOf7Y=", alt: "Item 1" },
    { id: 2, src: "https://cdn.pixabay.com/photo/2024/05/05/04/59/ai-generated-8740190_1280.png", alt: "Item 2" },
    { id: 3, src: "/placeholder.svg?height=300&width=300", alt: "Item 3" },
    { id: 4, src: "/placeholder.svg?height=300&width=300", alt: "Item 4" },
  ])

  const handleRemoveFromWishlist = (itemId: number) => {

    console.log('Remove item:', itemId)
  }

  const handleImageSearch = async (src: string) => {
    const urlImagem = encodeURIComponent(src);
    const urlBusca = `https://lens.google.com/uploadbyurl?url=${urlImagem}`;
    window.open(urlBusca, '_blank');
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
              {wishlistItems.map((item) => (
                <ClothingCard 
                  key={item.id}
                  id={item.id}
                  src={item.src}
                  alt={item.alt}
                  buttons={["remove", "link"]}
                  onRemoveFromWardrobe={() => handleRemoveFromWishlist(item.id)}
                  onSearchImage={() => handleImageSearch(item.src)}
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