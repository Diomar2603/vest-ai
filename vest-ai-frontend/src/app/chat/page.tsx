"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
// Add Users to the imports at the top
import { 
  Sparkles, 
  Send, 
  User, 
  Shirt, 
  ShoppingBag, 
  Settings, 
  LogOut,
  Menu,
  X,
  Users
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Sidebar } from "@/components/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

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
    { id: 1, src: "/placeholder.svg?height=300&width=300", alt: "Outfit 1" },
    { id: 2, src: "/placeholder.svg?height=300&width=300", alt: "Outfit 2" },
    { id: 3, src: "/placeholder.svg?height=300&width=300", alt: "Outfit 3" },
    { id: 4, src: "/placeholder.svg?height=300&width=300", alt: "Outfit 4" },
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
        {/* Header */}
        <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4">
          <div className="md:hidden">
            {/* Placeholder for mobile sidebar toggle */}
          </div>
          
          <div className="flex-1 md:flex-none md:pl-16"></div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/account")}>
              Minha Conta
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.push("/account")}>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
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

        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="max-w-3xl mx-auto flex gap-2">
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

        {/* Image Grid */}
        <div className="p-4 border-t">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-medium mb-4">Sugestões de Looks</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {outfitSuggestions.map((outfit) => (
                <Card key={outfit.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                      <Image
                        src={outfit.src}
                        alt={outfit.alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}