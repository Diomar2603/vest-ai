"use client"

import { useState } from "react"
import Image from "next/image"
import { Shirt, ShoppingBag, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ClothingCardProps {
  id: number
  src: string
  alt: string
}

export function ClothingCard({ id, src, alt }: ClothingCardProps) {
  const [isSelected, setIsSelected] = useState(false)

  return (
    <div 
      className="relative w-full aspect-square rounded-lg overflow-hidden bg-white shadow-sm transition-all duration-300 hover:bg-[#ffffff]"
      onClick={() => setIsSelected(!isSelected)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover hover:shadow-lg transition-all duration-300 ${isSelected ? 'scale-105 blur-sm' : ''}`}
      />
      
      <div className={`absolute inset-0 bg-black/50 flex hover:shadow-lg items-center justify-center gap-3 transition-all duration-300 ${
        isSelected ? 'opacity-100' : 'opacity-0'
      }`}>
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-12 w-12 rounded-full bg-white/80 hover:bg-white hover:scale-110 transition-all"
          onClick={(e) => {
            e.stopPropagation()
            // Add wardrobe action here
          }}
        >
          <Shirt className="h-6 w-6" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-12 w-12 rounded-full bg-white/80 hover:bg-white hover:scale-110 transition-all"
          onClick={(e) => {
            e.stopPropagation()
            // Add wishlist action here
          }}
        >
          <ShoppingBag className="h-6 w-6" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-12 w-12 rounded-full bg-white/80 hover:bg-white hover:scale-110 transition-all"
          onClick={(e) => {
            e.stopPropagation()
            // Add create outfit action here
          }}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}