"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
// Add Users to the imports at the top
import { 
  Send, 
  User, 
  Menu,
  X,
  Plus  // Add this import
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sidebar } from "@/components/sidebar"
import { ClothingCard } from "@/components/ui/clothing-card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"

export default function ChatPage() {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<{text: string, sender: "user" | "ai"}[]>([
    { text: "Olá! Sou sua assistente de moda pessoal. Como posso ajudar você hoje?", sender: "ai" }
  ])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  
  // Mock data for the image grid
  const [outfitSuggestions, setOutfitSuggestions] = useState([
    { id: 1, src: "/images/black-tshirt.jpg?height=300&width=300", alt: "Outfit 1" },
    { id: 2, src: "/images/blue-jeans-pants.jpg?height=300&width=300", alt: "Outfit 2" },
    { id: 3, src: "/placeholder.svg?height=300&width=300", alt: "Outfit 3" },
    { id: 4, src: "/placeholder.svg?height=300&width=300", alt: "Outfit 4" },
    { id: 5, src: "/placeholder.svg?height=300&width=300", alt: "Outfit 5" },
  ])

  const handleSendMessage = () => {
    if (!message.trim()) return
    
    // Add user message
    setMessages(prev => [...prev, { text: message, sender: "user" }])
    
    // Clear input
    setMessage("")
    
    // Simulate AI response (in a real app, this would be an API call)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "Aqui estão algumas sugestões de looks baseadas no seu estilo!", 
        sender: "ai" 
      }])
    }, 1000)
  }

  const [isOutfitDrawerOpen, setIsOutfitDrawerOpen] = useState(false)
  const [outfitItems, setOutfitItems] = useState<Array<{ id: number; src: string; alt: string }>>([])

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

  // Add this state for outfit name
  const [outfitName, setOutfitName] = useState("")

  const handleCreateOutfit = () => {
    if (!outfitName.trim()) {
      toast.error("Por favor, dê um nome ao seu outfit")
      return
    }
    
    // Add logic to save the outfit with its name
    setOutfitItems([])
    setOutfitName("")
    setIsOutfitDrawerOpen(false)
    toast.success("Outfit criado com sucesso!")
  }

  // In the Sheet component, add this after SheetTitle:
  <SheetContent side="right" className="w-full sm:w-[400px]">
    <SheetHeader>
      <SheetTitle>Criar Novo Outfit</SheetTitle>
    </SheetHeader>
    
    <div className="flex flex-col gap-4">
      <div className="py-4">
        <Input
          placeholder="Nome do outfit..."
          value={outfitName}
          onChange={(e) => setOutfitName(e.target.value)}
        />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          {outfitItems.map((item) => (
            <div key={item.id} className="relative">
              <Image
                src={item.src}
                alt={item.alt}
                width={150}
                height={150}
                className="rounded-md"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1"
                onClick={() => handleRemoveFromOutfit(item.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>

    <SheetFooter>
      <Button 
        onClick={handleCreateOutfit}
        disabled={outfitItems.length === 0}
        className="w-full"
      >
        Criar Outfit
      </Button>
    </SheetFooter>
  </SheetContent>
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
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4">
          <div className="md:hidden">
            {/* Placeholder for mobile sidebar toggle */}
          </div>
          
          <div className="flex-1 md:flex-none md:pl-16"></div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsOutfitDrawerOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Criar Outfit
            </Button>
            <Button variant="ghost" size="sm" onClick={() => router.push("/account")}>
              Minha Conta
            </Button>           
          </div>
        </header>

        {/* Upper Scrollable Area - Messages */}
        <div className="h-[calc(42vh-48px)] overflow-y-auto">
          <div className="max-w-3xl mx-auto flex flex-col gap-4 p-4">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fixed Input Bar */}
        <div className="h-20 border-y bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-3xl mx-auto py-4 px-4">
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Lower Scrollable Area - Suggestions */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4">
            <h3 className="text-lg font-medium mb-4">Sugestões de Looks</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {outfitSuggestions.map((outfit) => (
                <ClothingCard
                  key={outfit.id}
                  id={outfit.id}
                  src={outfit.src}
                  alt={outfit.alt}
                  buttons={["wardrobe", "wishlist", "outfit"]}
                  onAddToOutfit={handleAddToOutfit}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Outfit Creation Drawer */}
      <Sheet open={isOutfitDrawerOpen} onOpenChange={setIsOutfitDrawerOpen}>
        <SheetContent side="right" className="w-full sm:w-[400px] flex flex-col">
          <SheetHeader>
            <SheetTitle>Criar Novo Outfit</SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto py-4">
            <div className="grid grid-cols-2 gap-4">
              {outfitItems.map((item) => (
                <div key={item.id} className="relative">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={150}
                    height={150}
                    className="rounded-md"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1"
                    onClick={() => handleRemoveFromOutfit(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="px-4">
              <Input
                placeholder="Nome do outfit..."
                value={outfitName}
                onChange={(e) => setOutfitName(e.target.value)}
                className="w-full"
              />
            </div>
            
            <SheetFooter className="flex gap-2">
              <Button 
                onClick={handleCreateOutfit}
                disabled={outfitItems.length === 0}
                className="flex-1"
              >
                Criar Outfit
              </Button>
              <Button 
                onClick={() => {
                  setOutfitItems([])
                  setOutfitName("")
                }}
                variant="outline"
                disabled={outfitItems.length === 0}
              >
                Limpar
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}