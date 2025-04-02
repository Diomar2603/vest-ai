"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ClothingCard } from "@/components/ui/clothing-card"
import { OutfitDrawer } from "@/components/outfit-drawer"
import { toast } from "sonner"

export default function WardrobePage() {
  const [isOutfitDrawerOpen, setIsOutfitDrawerOpen] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  // Add these new states
  const [outfitItems, setOutfitItems] = useState<Array<{ id: number; src: string; alt: string }>>([])
  const [outfitName, setOutfitName] = useState("")

  // Update handleAddToOutfit
  const handleAddToOutfit = (item: { id: number; src: string; alt: string }) => {
    const isDuplicate = outfitItems.some(existingItem => existingItem.id === item.id)
    
    if (isDuplicate) {
      toast.error("Este item já faz parte do outfit atual.")
      return
    }

    setOutfitItems(prev => [...prev, item])
    setIsOutfitDrawerOpen(true)
  }

  // Add these new handlers
  const handleRemoveFromOutfit = (itemId: number) => {
    setOutfitItems(prev => prev.filter(item => item.id !== itemId))
  }

  const handleClearOutfit = () => {
    setOutfitItems([])
    setOutfitName("")
  }

  const handleCreateOutfit = () => {
    if (!outfitName.trim()) {
      toast.error("Por favor, dê um nome ao seu outfit")
      return
    }
    
    setOutfitItems([])
    setOutfitName("")
    setIsOutfitDrawerOpen(false)
    toast.success("Outfit criado com sucesso!")
  }

  // Add handlers for clothing card actions
  const handleRemoveFromWardrobe = (itemId: number) => {
    // TODO: Implement remove logic
    console.log('Remove item:', itemId)
  }
  
  const sections = [
    {
      id: 'shirts',
      title: 'Camisas',
      items: [
        { id: 1, src: "/images/black-tshirt.jpg?height=300&width=300", alt: "Camisa 1" },
        { id: 2, src: "/placeholder.svg?height=300&width=300", alt: "Camisa 2" },
        { id: 3, src: "/placeholder.svg?height=300&width=300", alt: "Camisa 3" },
      ]
    },
    {
      id: 'pants',
      title: 'Calças',
      items: [
        { id: 1, src: "/placeholder.svg?height=300&width=300", alt: "Calça 1" },
        { id: 2, src: "/placeholder.svg?height=300&width=300", alt: "Calça 2" },
      ]
    },
    {
      id: 'shoes',
      title: 'Sapatos',
      items: [
        { id: 1, src: "/placeholder.svg?height=300&width=300", alt: "Sapato 1" },
        { id: 2, src: "/placeholder.svg?height=300&width=300", alt: "Sapato 2" },
        { id: 3, src: "/placeholder.svg?height=300&width=300", alt: "Sapato 3" },
      ]
    },
    {
      id: 'accessories',
      title: 'Acessórios',
      items: [
        { id: 1, src: "/placeholder.svg?height=300&width=300", alt: "Acessório 1" },
        { id: 2, src: "/placeholder.svg?height=300&width=300", alt: "Acessório 2" },
      ]
    }
  ]

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
      <Header onCreateOutfit={() => setIsOutfitDrawerOpen(true)} />

        {/* Wardrobe Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Meu Guarda-Roupa</h1>

            <div className="space-y-10">
              {sections.map((section) => (
                <section key={section.id}>
                  <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {section.items.map((item) => (
                      <ClothingCard 
                        key={item.id}
                        id={item.id}
                        src={item.src}
                        alt={item.alt}
                        buttons={["remove", "outfit"]}
                        onRemoveFromWardrobe={() => handleRemoveFromWardrobe(item.id)}
                        onAddToOutfit={() => handleAddToOutfit(item)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
      <OutfitDrawer 
        isOpen={isOutfitDrawerOpen}
        onOpenChange={setIsOutfitDrawerOpen}
        outfitItems={outfitItems}
        outfitName={outfitName}
        onOutfitNameChange={(e) => setOutfitName(e.target.value)}
        onRemoveItem={handleRemoveFromOutfit}
        onClearOutfit={handleClearOutfit}
        onCreateOutfit={handleCreateOutfit}
      />
    </div>
  )
}