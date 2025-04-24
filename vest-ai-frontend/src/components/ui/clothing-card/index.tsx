"use client"

import Image from "next/image"
import { Shirt, ShoppingBag, Plus, Trash2, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import "./styles.css"
import { useState } from "react"
import { WardrobeSectionSheet } from "@/components/ui/wardrobe-section-sheet"

interface ClothingCardProps {
  id: string
  src: string
  alt: string
  buttons?: Array<'wardrobe' | 'wishlist' | 'outfit' | 'remove' | 'link'>
  onAddToOutfit?: (item: { id: string; src: string; alt: string }) => void
  onRemoveFromWardrobe?: (id: string) => void
  onAddToWardrobe?: (itemId: string, sectionId: string) => void
  wardrobeSections?: Array<{ _id: string; name: string }>
  isWishlist?: boolean
  onSearchImage?: () => void
}

export function ClothingCard({ 
  id, 
  src, 
  alt, 
  buttons = [], 
  onAddToOutfit,
  onRemoveFromWardrobe,
  onAddToWardrobe,
  wardrobeSections = [],
  isWishlist = false,
  onSearchImage
}: ClothingCardProps) {
  const [isWardrobeSheetOpen, setIsWardrobeSheetOpen] = useState(false)

  const buttonConfig = {
    wardrobe: {
      icon: <Shirt className="h-6 w-6" />,
      tooltip: "Adicionar ao guarda roupa",
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsWardrobeSheetOpen(true)
      }
    },
    wishlist: {
      icon: <ShoppingBag className="h-6 w-6" />,
      tooltip: "Adicionar à lista de desejos",
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation()
        // Add wishlist action here
      }
    },
    outfit: {
      icon: <Plus className="h-6 w-6" />,
      tooltip: "Adicionar ao outfit",
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation()
        onAddToOutfit?.({ id, src, alt })
      }
    },
    remove: {
      icon: <Trash2 className="h-6 w-6" />,
      tooltip: isWishlist ? "Remover da lista de desejos" : "Remover do guarda roupa",
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation()
        onRemoveFromWardrobe?.(id)
      }
    },
    link: {
      icon: <Link className="h-6 w-6" />,
      tooltip: "Buscar imagem similar no Google",
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation()
        onSearchImage?.()
      }
    }
  }

  return (
    <div className="clothing-card">
      <Image
        src={src}
        alt={alt}
        fill
        className="clothing-card-image"
      />
      
      <div className="clothing-card-overlay">
        <TooltipProvider>
          {buttons.map((buttonType) => (
            <Tooltip key={buttonType}>
              <TooltipTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="clothing-card-button"
                  onClick={buttonConfig[buttonType].onClick}
                >
                  {buttonConfig[buttonType].icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{buttonConfig[buttonType].tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      <WardrobeSectionSheet
        isOpen={isWardrobeSheetOpen}
        onOpenChange={setIsWardrobeSheetOpen}
        sections={wardrobeSections}
        onSelectSection={(sectionId) => {
          onAddToWardrobe?.(id, sectionId)
          setIsWardrobeSheetOpen(false)
        }}
        itemId={id}
      />
    </div>
  )
}