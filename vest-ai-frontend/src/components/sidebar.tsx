"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Sparkles, 
  Shirt, 
  ShoppingBag, 
  Menu,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface SidebarProps {
  isMobile?: boolean
  isMobileSidebarOpen?: boolean
  setIsMobileSidebarOpen?: (value: boolean) => void
}

export function Sidebar({ 
  isMobile = false, 
  isMobileSidebarOpen = false, 
  setIsMobileSidebarOpen 
}: SidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  if (isMobile) {
    return (
      <>
        <div 
          className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden transition-opacity duration-200 ${
            isMobileSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileSidebarOpen?.(false)}
        />
        
        <div 
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transform transition-transform duration-300 ease-in-out md:hidden ${
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-sidebar-primary" />
            <span className="text-xl font-bold">VestAI</span>
          </div>
          
          <Separator className="bg-sidebar-border" />
          
          <div className="flex-1 py-4">
            <nav className="space-y-1 px-2">
              <Link href="/chat" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent/50 text-sidebar-foreground">
                <Sparkles className="h-5 w-5" />
                <span>Assistente</span>
              </Link>
              <Link href="/wardrobe" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent/50 text-sidebar-foreground">
                <Shirt className="h-5 w-5" />
                <span>Guarda Roupa</span>
              </Link>
              <Link href="/wishlist" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent/50 text-sidebar-foreground">
                <ShoppingBag className="h-5 w-5" />
                <span>Lista de Desejos</span>
              </Link>
            </nav>
          </div>
          
          <Separator className="bg-sidebar-border" />
          
          <div className="p-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start gap-2 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/50"
              onClick={() => setIsMobileSidebarOpen?.(false)}
            >
              <X className="h-4 w-4" />
              <span>Fechar</span>
            </Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <div 
      className={`hidden md:flex flex-col w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ${
        isSidebarOpen ? "md:w-64" : "md:w-20"
      }`}
    >
      <div className="p-4 flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-sidebar-primary" />
        {isSidebarOpen && <span className="text-xl font-bold">VestAI</span>}
      </div>
      
      <Separator className="bg-sidebar-border" />
      
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          <Link href="/chat" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent/50 text-sidebar-foreground">
            <Sparkles className="h-5 w-5" />
            {isSidebarOpen && <span>Assistente</span>}
          </Link>
          <Link href="/wardrobe" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent/50 text-sidebar-foreground">
            <Shirt className="h-5 w-5" />
            {isSidebarOpen && <span>Guarda Roupa</span>}
          </Link>
          <Link href="/wishlist" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent/50 text-sidebar-foreground">
            <ShoppingBag className="h-5 w-5" />
            {isSidebarOpen && <span>Lista de Desejos</span>}
          </Link>
        </nav>
      </div>
      
      <Separator className="bg-sidebar-border" />
      
      <div className="p-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start gap-2 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/50"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <>
              <X className="h-4 w-4" />
              <span>Recolher</span>
            </>
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}