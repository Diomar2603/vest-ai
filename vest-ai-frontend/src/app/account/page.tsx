"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Shield,
  Bell,
  LogOut,
  Upload,
  X,
  Eye,
  EyeOff,
  Save,
  ArrowRight,
  Sparkles,
  Lock,
  History,
  CreditCardIcon,
  CheckCircle2,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export default function AccountPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Estado dos dados do usuário
  const [userData, setUserData] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "15 de janeiro de 2025",
  })

  // Estado das senhas
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  // Lidar com o upload da foto de perfil
  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Verificar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast("Arquivo muito grande",{
        description: "Por favor, selecione uma imagem com menos de 5MB",
      })
      setIsUploading(false)
      return
    }

    // Verificar tipo do arquivo
    if (!file.type.startsWith("image/")) {
      toast("Tipo de arquivo inválido",{
        description: "Por favor, selecione um arquivo de imagem",
      })
      setIsUploading(false)
      return
    }

    // Criar uma URL para a imagem
    const reader = new FileReader()
    reader.onload = (e) => {
      setProfileImage(e.target?.result as string)
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  // Salvar alterações do perfil
  const saveProfileChanges = () => {
    // Atualizar dados do usuário com os valores do formulário
    setUserData((prev) => ({
      ...prev,
      name: (document.getElementById("name") as HTMLInputElement).value,
      email: (document.getElementById("email") as HTMLInputElement).value,
      phone: (document.getElementById("phone") as HTMLInputElement).value,
      avatar: profileImage || prev.avatar,
    }))

    toast("Perfil atualizado", {
      description: "Seu perfil foi atualizado com sucesso",
    })
  }

  // Alterar senha
  const changePassword = () => {
    // Validar senhas
    if (!passwords.current) {
      toast("Senha atual necessária",{
        description: "Por favor, insira sua senha atual",
      })
      return
    }

    if (passwords.new.length < 8) {
      toast("Senha muito curta",{
        description: "A nova senha deve ter pelo menos 8 caracteres",
      })
      return
    }

    if (passwords.new !== passwords.confirm) {
      toast("As senhas não coincidem",{
        description: "A nova senha e a confirmação devem ser iguais",
      })
      return
    }

    // Resetar campos de senha
    setPasswords({
      current: "",
      new: "",
      confirm: "",
    })

    toast("Senha atualizada",{
      description: "Sua senha foi alterada com sucesso",
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4">
      <header className="sticky flex justify-center top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">VestAI</span>
            </Link>
          </div>
         
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/chat")}>
              Voltar para o Chat
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={profileImage || userData.avatar} />
                <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Configurações da Conta</h1>
            <p className="text-muted-foreground">Gerencie as configurações da sua conta e plano de assinatura</p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:w-auto">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="security">Segurança</TabsTrigger>
            </TabsList>

            {/* Aba de Perfil */}
            <TabsContent value="profile" className="space-y-6 pt-6">
              <div className="flex flex-col md:flex-row gap-8">
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>Atualize seus dados pessoais e foto de perfil</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col items-center gap-4 mb-6">
                      <div className="relative group">
                        <Avatar className="h-24 w-24 border-2 border-primary">
                          <AvatarImage src={profileImage || userData.avatar} />
                          <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div
                          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-6 w-6 text-white" />
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleProfilePictureUpload}
                        />
                      </div>
                      {profileImage && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setProfileImage(null)}>
                            <X className="h-4 w-4 mr-1" /> Cancelar
                          </Button>
                        </div>
                      )}
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Clique para enviar uma nova foto de perfil</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome Completo</Label>
                          <Input id="name" defaultValue={userData.name} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Endereço de E-mail</Label>
                          <Input id="email" type="email" defaultValue={userData.email} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Número de Telefone</Label>
                        <Input id="phone" defaultValue={userData.phone} />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={saveProfileChanges} disabled={isUploading}>
                      {isUploading ? (
                        <>
                          <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar Alterações
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="w-full md:w-80">
                  <CardHeader>
                    <CardTitle>Informações da Conta</CardTitle>
                    <CardDescription>Detalhes e status da sua conta</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">Membro Desde</p>
                      <p className="text-sm text-muted-foreground">{userData.joinDate}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">Status da Conta</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          Ativo
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start gap-2">
                    <Button variant="outline" className="w-full justify-between" asChild>
                      <Link href="/chat">
                        Ir para o Chat com IA <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            {/* Aba de Segurança */}
            <TabsContent value="security" className="space-y-6 pt-6">
              <div className="flex flex-col md:flex-row gap-8">
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>Alterar Senha</CardTitle>
                    <CardDescription>Atualize sua senha para manter sua conta segura</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Senha Atual</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showPassword ? "text" : "password"}
                          value={passwords.current}
                          onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nova Senha</Label>
                      <Input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        value={passwords.new}
                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                      <Input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      />
                    </div>

                    <div className="text-sm text-muted-foreground">
                      A senha deve ter pelo menos 8 caracteres e incluir uma mistura de letras, números e símbolos.
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={changePassword}>
                      <Lock className="h-4 w-4 mr-2" />
                      Atualizar Senha
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:h-24 items-center md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">© 2025 VestAI. Todos os direitos reservados.</p>
          </div>
          <div className="flex items-center gap-4 md:gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">
              Termos
            </Link>
            <Link href="#" className="hover:text-foreground">
              Privacidade
            </Link>
            <Link href="#" className="hover:text-foreground">
              Contato
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}