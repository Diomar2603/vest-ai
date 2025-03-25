"use client"

import { useState } from "react"
import Image from "next/image"
import { Shirt, ShoppingBag, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import "./styles.css"

interface ClothingCardProps {
  id: number
  src: string
  alt: string
}

export function ClothingCard({ id, src, alt }: ClothingCardProps) {
  return (
    <div className="clothing-card">
      <Image
        src={src}
        alt={alt}
        fill
        className="clothing-card-image"
      />
      
      <div className="clothing-card-overlay">
        <Button 
          variant="secondary" 
          size="icon" 
          className="clothing-card-button"
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
          className="clothing-card-button"
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
          className="clothing-card-button"
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