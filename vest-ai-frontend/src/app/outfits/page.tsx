"use client"

import { useState } from "react"
import { Menu, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/ui/sidebar"
import { Header } from "@/components/ui/header"
import { useOutfits } from "@/hooks/useOutfits"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "sonner"

export default function OutfitsPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const { outfits, isLoading, deleteOutfit } = useOutfits()

  const handleDeleteOutfit = async (outfitId: string) => {
    try {
      await deleteOutfit.mutateAsync(outfitId)
    } catch (error) {
      toast.error("Erro ao excluir outfit")
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
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

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Meus Outfits</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {outfits?.map((outfit: {_id : string, items: Array<{id : string, src: string, alt: string}>, name: string}) => (
                <div 
                  key={outfit._id} 
                  className="bg-card rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow relative group"
                >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteOutfit(outfit._id)}
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Excluir outfit</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  <h2 className="text-2xl font-semibold mb-6">{outfit.name}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {outfit.items.map((item : {id : string, src: string, alt: string}) => (
                      <div key={item.id} className="aspect-square relative rounded-md overflow-hidden">
                        <img
                          src={item.src}
                          alt={item.alt}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}