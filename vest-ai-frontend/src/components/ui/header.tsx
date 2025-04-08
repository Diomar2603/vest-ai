import { FC } from 'react'
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onCreateOutfit?: () => void
}

export const Header: FC<HeaderProps> = ({ onCreateOutfit }) => {
  const router = useRouter()

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4">
      <div className="md:hidden">
        {/* Placeholder for mobile sidebar toggle */}
      </div>
      
      <div className="flex-1 md:flex-none md:pl-16"></div>
      
      <div className="flex items-center gap-4">
        {onCreateOutfit && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCreateOutfit}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Criar Outfit
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={() => router.push("/account")}>
          Minha Conta
        </Button>           
      </div>
    </header>
  )
}