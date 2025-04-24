"use client"
import { useEffect } from "react"
import { useState } from "react"
import { Menu, X, Settings, Plus, Trash, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/ui/sidebar"
import { Header } from "@/components/ui/header"
import { ClothingCard } from "@/components/ui/clothing-card"
import { OutfitDrawer } from "@/components/ui/outfit-drawer"
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
import { useWardrobeSections } from "@/hooks/useWardrobeSections"
import { useWardrobeItems, WardrobeItem } from "@/hooks/useWardrobeItems"
import { useUpdateWardrobeSections } from "@/hooks/useUpdateWardrobeSections"

export default function WardrobePage() {
  const [isOutfitDrawerOpen, setIsOutfitDrawerOpen] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [outfitItems, setOutfitItems] = useState<Array<WardrobeItem>>([])
  const [outfitName, setOutfitName] = useState("")
  const [isSectionsDrawerOpen, setIsSectionsDrawerOpen] = useState(false)
  
  const { sections, isLoading: sectionsLoading } = useWardrobeSections()
  const { items, isLoading: itemsLoading } = useWardrobeItems()

  const [tempSections, setTempSections] = useState<Array<{ _id: string; name: string }>>([])

  useEffect(() => {
    if (isSectionsDrawerOpen && sections) {
      setTempSections(sections)
    }
  }, [isSectionsDrawerOpen, sections])

  const handleAddToOutfit = (item: WardrobeItem) => {
    const isDuplicate = outfitItems.some(existingItem => existingItem._id === item._id)
    
    if (isDuplicate) {
      toast.error("Este item já faz parte do outfit atual.")
      return
    }

    setOutfitItems(prev => [...prev, item])
    setIsOutfitDrawerOpen(true)
  }

  const handleRemoveFromOutfit = (itemId: string) => {
    setOutfitItems(prev => prev.filter(item => item._id !== itemId))
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

  const handleRemoveFromWardrobe = (itemId: string) => {
    console.log('Remove item:', itemId)
  }

  const handleUpdateSection = (id: string, newTitle: string) => {
    if (!newTitle.trim()) {
      toast.error("O nome da seção não pode estar vazio")
      return
    }
    setTempSections(prev => prev.map(section => 
      section._id === id ? { ...section, name: newTitle } : section
    ))
  }

  const handleAddSection = () => {
    setTempSections(prev => [...prev, {
      _id: `section-${Date.now()}`,
      name: "Nova Seção",
      items: []
    }])
  }

  const handleDeleteSection = (id: string) => {
    if (tempSections.length <= 1) {
      toast.error("Você precisa manter pelo menos uma seção")
      return
    }
    setTempSections(prev => prev.filter(section => section._id !== id))
  }

  const updateSections = useUpdateWardrobeSections()

  const handleSaveSections = async () => {
    try {
      await updateSections.mutateAsync(tempSections)
      setIsSectionsDrawerOpen(false)
      toast.success("Alterações salvas com sucesso!")
    } catch (error) {
      toast.error("Erro ao salvar alterações")
    }
  }

  if (sectionsLoading || itemsLoading) {
    return <div>Loading...</div>
  }

  return (
      <div>
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
          <Header onCreateOutfit={() => setIsOutfitDrawerOpen(true)} />
  
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
                          <div key={section._id} className="flex items-center gap-2">
                            <Input 
                              defaultValue={section.name}
                              onBlur={(e) => handleUpdateSection(section._id, e.target.value)}
                              className="w-[300px]"
                            />
                            <Button 
                              variant="destructive" 
                              size="icon"
                              onClick={() => handleDeleteSection(section._id)}
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
                {sections?.map((section) => (
                  <section 
                    key={section._id} 
                    className="bg-muted/50 rounded-lg p-6 first:pt-6"
                  >
                    <h2 className="text-2xl font-semibold mb-6">{section.name}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {items?.filter((item: WardrobeItem) => item.section === section._id).map((item: WardrobeItem) => (
                        <ClothingCard 
                          key={item._id}
                          id={item._id}
                          src={item.src}
                          alt={item.alt}
                          buttons={["remove", "outfit"]}
                          onRemoveFromWardrobe={() => handleRemoveFromWardrobe(item._id)}
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
          outfitItems={outfitItems.map(item => ({
            id: item._id,
            src: item.src,
            alt: item.alt
          }))}
          outfitName={outfitName}
          onOutfitNameChange={(e) => setOutfitName(e.target.value)}
          onRemoveItem={(id) => handleRemoveFromOutfit(outfitItems.filter(t => t._id === id)[0]._id)}
          onClearOutfit={handleClearOutfit}
          onCreateOutfit={handleCreateOutfit}
        />
    </div>
  )
}
