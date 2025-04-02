"use client"

import { useState } from "react"
import { Menu, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function OutfitsPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [outfits, setOutfits] = useState([
    {
      id: 1,
      name: "Casual de Verão",
      items: [
        { id: 1, src: "/images/black-tshirt.jpg?height=300&width=300", alt: "Camisa Preta" },
        { id: 2, src: "https://cdn.pixabay.com/photo/2024/05/05/04/59/ai-generated-8740190_1280.png", alt: "Calça Jeans" },
        { id: 3, src: "https://cdn.pixabay.com/photo/2018/10/10/14/23/pants-3737399_960_720.jpg", alt: "Calça Jeans" },
        { id: 4, src: "https://cdn.pixabay.com/photo/2018/10/24/10/39/watch-3769945_960_720.jpg", alt: "Calça Jeans" },
        { id: 5, src: "https://media.istockphoto.com/id/1184522745/pt/foto/rodeo-horse-rider-wild-west-culture-americana-and-american-country-music-concept-theme-with-a.jpg?s=2048x2048&w=is&k=20&c=75DCH-7K8I6vWKQ0Qg1KuP8V-qKh6wF0YyzdWX9u2y4=", alt: "Calça Jeans" },
      ]
    },
    {
      id: 2,
      name: "Trabalho",
      items: [
        { id: 3, src: "/placeholder.svg?height=300&width=300", alt: "Camisa Social" },
        { id: 4, src: "/placeholder.svg?height=300&width=300", alt: "Calça Social" },
      ]
    },
    {
        id: 3,
        name: "Casual de Verão",
        items: [
          { id: 1, src: "/images/black-tshirt.jpg?height=300&width=300", alt: "Camisa Preta" },
          { id: 2, src: "https://cdn.pixabay.com/photo/2024/05/05/04/59/ai-generated-8740190_1280.png", alt: "Calça Jeans" },
          { id: 3, src: "https://cdn.pixabay.com/photo/2018/10/10/14/23/pants-3737399_960_720.jpg", alt: "Calça Jeans" },
        ]
      },
      {
        id: 4,
        name: "Casual de Verão",
        items: [
          { id: 1, src: "/images/black-tshirt.jpg?height=300&width=300", alt: "Camisa Preta" },
          { id: 2, src: "https://cdn.pixabay.com/photo/2024/05/05/04/59/ai-generated-8740190_1280.png", alt: "Calça Jeans" },
          { id: 3, src: "https://cdn.pixabay.com/photo/2018/10/10/14/23/pants-3737399_960_720.jpg", alt: "Calça Jeans" },
        ]
      },
  ])

  const handleDeleteOutfit = (outfitId: number) => {
    setOutfits(prev => prev.filter(outfit => outfit.id !== outfitId))
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Sidebar Toggle */}
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

      {/* Sidebar Components */}
      <Sidebar isMobile={false} />
      <Sidebar 
        isMobile={true} 
        isMobileSidebarOpen={isMobileSidebarOpen} 
        setIsMobileSidebarOpen={setIsMobileSidebarOpen} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        {/* Outfits Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Meus Outfits</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {outfits.map((outfit) => (
                <div 
                  key={outfit.id} 
                  className="bg-card rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow relative group"
                >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteOutfit(outfit.id)}
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Excluir outfit</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  <h2 className="text-2xl font-semibold mb-6">{outfit.name}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {outfit.items.map((item) => (
                      <div key={item.id} className="aspect-square relative rounded-md overflow-hidden">
                        <img
                          src={item.src}
                          alt={item.alt}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}