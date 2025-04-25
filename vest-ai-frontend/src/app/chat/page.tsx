"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { OutfitDrawer } from "@/components/ui/outfit-drawer"
import { 
  Send, 
  Menu,
  X,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sidebar } from "@/components/ui/sidebar"
import { ClothingCard } from "@/components/ui/clothing-card"
import { Header } from "@/components/ui/header"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useSendMessage } from "@/hooks/useChat"
import { Loader2 } from "lucide-react" // Add this import
import { useWardrobeSections } from "@/hooks/useWardrobeSections";
import { useAddToWardrobe } from "@/hooks/useAddToWardrobe"
import { useOutfits } from "@/hooks/useOutfits"

export default function ChatPage() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<{text: string, sender: "user" | "ai"}[]>([
    { text: "Olá! Sou sua assistente de moda pessoal. Como posso ajudar você hoje?", sender: "ai" }
  ])
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  
  const [outfitSuggestions, setOutfitSuggestions] = useState<Array<{ id: string; src: string; alt: string }>>([])
  const sendMessage = useSendMessage()

  const handleSendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || message;
    if (!messageToSend.trim()) return
    
    setMessages(prev => [...prev, { text: messageToSend, sender: "user" }])
    
    try {
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}')
      if (!userInfo.id) {
        toast.error("Usuário não autenticado")
        return
      }

      const response = await sendMessage.mutateAsync({
        message: messageToSend,
        userId: userInfo.id
      })
      
      // Add AI response
      setMessages(prev => [...prev, { 
        text: "Aqui estão algumas sugestões de looks baseadas no seu estilo!", 
        sender: "ai" 
      }])

      if (response.body && Array.isArray(response.body)) {
        const newSuggestions = response.body.map((url: string, index: number) => ({
          id: index + 1,
          src: url,
          alt: `Outfit Suggestion ${index + 1}`
        }));
        setOutfitSuggestions(newSuggestions);
      }

    } catch (error) {
      toast.error("Erro ao processar mensagem")
    } finally {
      setMessage("")
    }
  }

  const [isOutfitDrawerOpen, setIsOutfitDrawerOpen] = useState(false)
  const [outfitItems, setOutfitItems] = useState<Array<{ id: string; src: string; alt: string }>>([])

  const handleAddToOutfit = (item: { id: string; src: string; alt: string }) => {
    const isDuplicate = outfitItems.some(existingItem => existingItem.id === item.id)
    
    if (isDuplicate) {
      toast.error("Este item já faz parte do outfit atual.")
      return
    }

    setOutfitItems(prev => [...prev, item])
    setIsOutfitDrawerOpen(true)
  }

  const handleRemoveFromOutfit = (itemId: string) => {
    setOutfitItems(prev => prev.filter(item => item.id !== itemId))
  }

  const [outfitName, setOutfitName] = useState("")

  const { createOutfit } = useOutfits()

  const handleCreateOutfit = async () => {
    if (!outfitName.trim()) {
      toast.error("Por favor, dê um nome ao seu outfit")
      return
    }

    try {
      await createOutfit.mutateAsync({
        name: outfitName,
        items: outfitItems.map(item => ({
          id: item.id,
          section: "", // Since these are suggestions, they don't have a section yet
          src: item.src,
          alt: item.alt
        }))
      })

      setOutfitItems([])
      setOutfitName("")
      setIsOutfitDrawerOpen(false)
      toast.success("Outfit criado com sucesso!")
    } catch (error) {
      toast.error("Erro ao criar outfit")
    }
  }

  const handleAskForOutfit = () => {
    const prompt = "Crie um outfit para mim por favor";
    console.log("message é " + message);
    setMessage(prompt);
    console.log("message é " + message);
    handleSendMessage(prompt);
  }

  const handleClearOutfit = () => {
    setOutfitItems([])
    setOutfitName("")
  }

  const { sections: wardrobeSections, isLoading: sectionsLoading } = useWardrobeSections();

  const { addToWardrobe } = useAddToWardrobe()

  const handleAddToWardrobe = async (itemId: string, sectionId: string) => {
    await addToWardrobe({ 
      itemId, 
      sectionId, 
      items: outfitSuggestions 
    })
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

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header onCreateOutfit={() => setIsOutfitDrawerOpen(true)} />

        {/* Messages */}
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

        {/* Input */}
        <div className="h-20 border-y bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-3xl mx-auto py-4 px-4">
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
                disabled={sendMessage.isPending}
              />
              <Button 
                onClick={() => handleSendMessage()}
                disabled={sendMessage.isPending}
              >
                {sendMessage.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="secondary"
                      disabled={sendMessage.isPending}
                      onClick={handleAskForOutfit}
                    >
                      {sendMessage.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Peça ao assistente para criar um outfit</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4">
            <h3 className="text-lg font-medium mb-4">Sugestões de Looks</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {outfitSuggestions && Array.isArray(outfitSuggestions) && (outfitSuggestions as Array<{ id: string; src: string; alt: string }>).map((outfit) => (
                <ClothingCard
                  key={outfit.id}
                  id={outfit.id}
                  src={outfit.src}
                  alt={outfit.alt}
                  buttons={["wardrobe", "wishlist", "outfit"]}
                  onAddToOutfit={handleAddToOutfit}
                  onAddToWardrobe={handleAddToWardrobe}
                  wardrobeSections={wardrobeSections}
                />
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