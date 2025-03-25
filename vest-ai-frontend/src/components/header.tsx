"use client"

import { useRouter } from "next/navigation"
import { User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function Header() {
  const router = useRouter()
  
  return (
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
  )
}