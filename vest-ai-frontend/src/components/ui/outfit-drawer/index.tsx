"use client"

import Image from "next/image"
import { X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"

interface OutfitDrawerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  outfitItems: Array<{ id: number; src: string; alt: string }>
  outfitName: string
  onOutfitNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveItem: (id: number) => void
  onClearOutfit: () => void
  onCreateOutfit: () => void
}

export function OutfitDrawer({
  isOpen,
  onOpenChange,
  outfitItems,
  outfitName,
  onOutfitNameChange,
  onRemoveItem,
  onClearOutfit,
  onCreateOutfit,
}: OutfitDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
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
                  onClick={() => onRemoveItem(item.id)}
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
              onChange={onOutfitNameChange}
              className="w-full"
            />
          </div>
          
          <SheetFooter className="flex gap-2">
            <Button 
              onClick={onCreateOutfit}
              disabled={outfitItems.length === 0}
              className="flex-1"
            >
              Criar Outfit
            </Button>
            <Button 
              onClick={onClearOutfit}
              variant="outline"
              disabled={outfitItems.length === 0}
            >
              Limpar
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}