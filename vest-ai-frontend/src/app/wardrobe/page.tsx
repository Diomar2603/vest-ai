"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ClothingCard } from "@/components/ui/clothing-card"

export default function WardrobePage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  
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
        <Header />

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
                        buttons={['remove', 'wishlist', 'outfit']}
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
  )
}