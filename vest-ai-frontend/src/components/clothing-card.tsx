"use client"

import Image from "next/image"
import { Shirt, ShoppingBag, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ClothingCardProps {
  id: number
  src: string
  alt: string
}

export function ClothingCard({ id, src, alt }: ClothingCardProps) {
  return (
    <div className="group relative cursor-pointer">
      <Card className="overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
        <CardContent className="p-0">
          <div className="relative aspect-square">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              priority
              className="object-cover transition-all duration-300 group-hover:blur-[2px]"
            />
          </div>
        </CardContent>
      </Card>
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
        <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 shadow-md hover:scale-110">
          <Shirt className="h-5 w-5" />
        </Button>
        <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 shadow-md hover:scale-110">
          <ShoppingBag className="h-5 w-5" />
        </Button>
        <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 shadow-md hover:scale-110">
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}