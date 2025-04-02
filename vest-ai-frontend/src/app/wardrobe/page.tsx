"use client"

import { useState } from "react"
import { Menu, X, Settings, Plus, Trash, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ClothingCard } from "@/components/ui/clothing-card"
import { OutfitDrawer } from "@/components/outfit-drawer"
import { toast } from "sonner"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function WardrobePage() {
  const [isOutfitDrawerOpen, setIsOutfitDrawerOpen] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [outfitItems, setOutfitItems] = useState<Array<{ id: number; src: string; alt: string }>>([])
  const [outfitName, setOutfitName] = useState("")
  const [isSectionsDrawerOpen, setIsSectionsDrawerOpen] = useState(false)
  
  const [sections, setSections] = useState([
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
  ])

  const [tempSections, setTempSections] = useState(sections)

  const handleAddToOutfit = (item: { id: number; src: string; alt: string }) => {
    const isDuplicate = outfitItems.some(existingItem => existingItem.id === item.id)
    
    if (isDuplicate) {
      toast.error("Este item já faz parte do outfit atual.")
      return
    }

    setOutfitItems(prev => [...prev, item])
    setIsOutfitDrawerOpen(true)
  }

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

  const handleRemoveFromWardrobe = (itemId: number) => {
    // TODO: Implement remove logic
    console.log('Remove item:', itemId)
  }

  const handleUpdateSection = (id: string, newTitle: string) => {
    if (!newTitle.trim()) {
      toast.error("O nome da seção não pode estar vazio")
      return
    }
    setTempSections(prev => prev.map(section => 
      section.id === id ? { ...section, title: newTitle } : section
    ))
  }

  const handleAddSection = () => {
    setTempSections(prev => [...prev, {
      id: `section-${Date.now()}`,
      title: "Nova Seção",
      items: []
    }])
  }

  const handleDeleteSection = (id: string) => {
    if (tempSections.length <= 1) {
      toast.error("Você precisa manter pelo menos uma seção")
      return
    }
    setTempSections(prev => prev.filter(section => section.id !== id))
  }

  const handleSaveSections = () => {
    setSections(tempSections)
    setIsSectionsDrawerOpen(false)
    toast.success("Alterações salvas com sucesso!")
  }

  return (
      <div>
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
  
              <div className="flex justify-end mb-6 gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Criar com IA
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Peça ajuda ao assistente para criar um novo outfit</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Sheet open={isSectionsDrawerOpen} onOpenChange={setIsSectionsDrawerOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Personalizar Seções
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Gerenciar Seções</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col h-full p-3">
                      <div className="flex-1 space-y-4 py-4">
                        {tempSections.map((section) => (
                          <div key={section.id} className="flex items-center gap-2">
                            <Input 
                              defaultValue={section.title}
                              onBlur={(e) => handleUpdateSection(section.id, e.target.value)}
                              className="w-[300px]"
                            />
                            <Button 
                              variant="destructive" 
                              size="icon"
                              onClick={() => handleDeleteSection(section.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={handleAddSection}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Seção
                        </Button>
                      </div>
                      <div className="flex justify-end py-4 border-t">
                        <Button onClick={handleSaveSections} className="w-full">
                          Salvar Alterações
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
  
              <div className="space-y-8">
                {sections.map((section) => (
                  <section 
                    key={section.id} 
                    className="bg-muted/50 rounded-lg p-6 first:pt-6"
                  >
                    <h2 className="text-2xl font-semibold mb-6">{section.title}</h2>
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
    </div>)
    }