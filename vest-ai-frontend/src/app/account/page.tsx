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
    plan: "Premium",
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

  // Dados dos planos
  const plans = [
    {
      id: "basic",
      name: "Básico",
      price: "$9.99",
      period: "mês",
      description: "Perfeito para experimentar nossas recomendações de moda com IA",
      features: ["Perfil de estilo básico", "10 recomendações de looks por mês", "Salvar looks favoritos", "Suporte por e-mail"],
      current: false,
    },
    {
      id: "premium",
      name: "Premium",
      price: "$19.99",
      period: "mês",
      description: "Nosso plano mais popular para entusiastas de moda",
      features: [
        "Perfil de estilo avançado",
        "Recomendações de looks ilimitadas",
        "Atualizações sazonais do guarda-roupa",
        "Compre diretamente pela plataforma",
        "Suporte prioritário",
      ],
      current: true,
    },
    {
      id: "stylist",
      name: "Estilista",
      price: "$39.99",
      period: "mês",
      description: "Para quem quer a melhor experiência em moda",
      features: [
        "Todos os recursos Premium",
        "Estilista pessoal com IA",
        "Consultas por vídeo",
        "Estilo para ocasiões especiais",
        "Descontos exclusivos em marcas",
        "Suporte 24/7",
      ],
      current: false,
    },
  ]

  // Métodos de pagamento
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "card1",
      type: "Visa",
      last4: "4242",
      expiry: "04/28",
      default: true,
    },
    {
      id: "card2",
      type: "Mastercard",
      last4: "5555",
      expiry: "09/26",
      default: false,
    },
  ])

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

  // Definir método de pagamento padrão
  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods((methods) =>
      methods.map((method) => ({
        ...method,
        default: method.id === id,
      })),
    )

    toast("Método de pagamento padrão atualizado", {
      description: "Seu método de pagamento padrão foi alterado",
    })
  }

  // Remover método de pagamento
  const removePaymentMethod = (id: string) => {
    setPaymentMethods((methods) => methods.filter((method) => method.id !== id))

    toast("Método de pagamento removido", {
      description: "Seu método de pagamento foi removido",
    })
  }

  // Atualizar plano
  const upgradePlan = (planId: string) => {
    // Em um aplicativo real, isso abriria um fluxo de pagamento
    toast("Atualização de plano iniciada",{
      description: `Você está atualizando para o plano ${planId.charAt(0).toUpperCase() + planId.slice(1)}`,
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
            <TabsList className="grid w-full grid-cols-4 md:w-auto">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="security">Segurança</TabsTrigger>
              <TabsTrigger value="billing">Cobrança</TabsTrigger>
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
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
                      <p className="text-sm font-medium">Plano Atual</p>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary">{userData.plan}</Badge>
                        <Link href="#billing" className="text-xs text-primary hover:underline">
                          Gerenciar Plano
                        </Link>
                      </div>
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

                <div className="w-full md:w-80 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Autenticação de Dois Fatores</CardTitle>
                      <CardDescription>Adicione uma camada extra de segurança à sua conta</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">Autenticação por SMS</p>
                          <p className="text-xs text-muted-foreground">Receba códigos via mensagem de texto</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">Aplicativo Autenticador</p>
                          <p className="text-xs text-muted-foreground">Use um aplicativo autenticador</p>
                        </div>
                        <Switch />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        <Shield className="h-4 w-4 mr-2" />
                        Gerenciar Configurações de 2FA
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Histórico de Login</CardTitle>
                      <CardDescription>Atividade recente da conta</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { device: "MacBook Pro", location: "Nova York, EUA", time: "Agora mesmo" },
                        { device: "iPhone 15", location: "Nova York, EUA", time: "Ontem" },
                      ].map((login, i) => (
                        <div key={i} className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{login.device}</p>
                            <p className="text-xs text-muted-foreground">{login.location}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{login.time}</p>
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" className="w-full">
                        <History className="h-4 w-4 mr-2" />
                        Ver Histórico Completo
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Aba de Cobrança */}
            <TabsContent value="billing" className="space-y-6 pt-6">
              <div className="flex flex-col gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Plano de Assinatura</CardTitle>
                    <CardDescription>Gerencie sua assinatura e detalhes de cobrança</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="font-medium">Plano Premium</h3>
                            <p className="text-sm text-muted-foreground">$19.99/mês</p>
                          </div>
                          <Badge>Ativo</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">Próxima data de cobrança: 15 de abril de 2025</p>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm">
                            Gerenciar Assinatura
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            Cancelar Assinatura
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-6">Planos Disponíveis</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                      <Card key={plan.id} className={`${plan.current ? "border-primary" : ""} relative`}>
                        {plan.current && (
                          <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                            <Badge className="bg-primary">Plano Atual</Badge>
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle>{plan.name}</CardTitle>
                          <div className="mt-4">
                            <span className="text-4xl font-bold">{plan.price}</span>
                            <span className="text-muted-foreground"> / {plan.period}</span>
                          </div>
                          <CardDescription className="mt-2">{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {plan.features.map((feature, j) => (
                              <li key={j} className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                        <CardFooter>
                          <Button
                            className={`w-full ${plan.current ? "bg-primary/10 text-primary hover:bg-primary/20" : plan.id === "stylist" ? "bg-primary hover:bg-primary/90" : ""}`}
                            variant={plan.current ? "outline" : plan.id === "stylist" ? "default" : "outline"}
                            disabled={plan.current}
                            onClick={() => upgradePlan(plan.id)}
                          >
                            {plan.current ? "Plano Atual" : `Atualizar para ${plan.name}`}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Métodos de Pagamento</CardTitle>
                    <CardDescription>Gerencie seus métodos de pagamento e preferências de cobrança</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <CreditCardIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {method.type} •••• {method.last4}
                            </p>
                            <p className="text-sm text-muted-foreground">Expira em {method.expiry}</p>
                          </div>
                          {method.default && (
                            <Badge variant="outline" className="ml-2">
                              Padrão
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {!method.default && (
                            <Button variant="ghost" size="sm" onClick={() => setDefaultPaymentMethod(method.id)}>
                              Definir como Padrão
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removePaymentMethod(method.id)}
                          >
                            Remover
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button variant="outline" className="w-full">
                      <CreditCardIcon className="h-4 w-4 mr-2" />
                      Adicionar Método de Pagamento
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Cobrança</CardTitle>
                    <CardDescription>Veja suas faturas anteriores e histórico de pagamentos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Visualização desktop - layout tradicional de tabela */}
                    <div className="hidden md:block rounded-md border">
                      <div className="grid grid-cols-5 p-4 font-medium">
                        <div>Data</div>
                        <div>Descrição</div>
                        <div>Valor</div>
                        <div>Status</div>
                        <div className="text-right">Fatura</div>
                      </div>
                      <Separator />
                      {[
                        { date: "15 de março de 2025", description: "Plano Premium", amount: "$19.99", status: "Pago" },
                        { date: "15 de fevereiro de 2025", description: "Plano Premium", amount: "$19.99", status: "Pago" },
                        { date: "15 de janeiro de 2025", description: "Plano Premium", amount: "$19.99", status: "Pago" },
                      ].map((invoice, i) => (
                        <div key={i} className="grid grid-cols-5 p-4 text-sm">
                          <div>{invoice.date}</div>
                          <div>{invoice.description}</div>
                          <div>{invoice.amount}</div>
                          <div>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                              {invoice.status}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <Button variant="ghost" size="sm">
                              Baixar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Visualização mobile - layout baseado em cards */}
                    <div className="md:hidden space-y-4">
                      {[
                        { date: "15 de março de 2025", description: "Plano Premium", amount: "$19.99", status: "Pago" },
                        { date: "15 de fevereiro de 2025", description: "Plano Premium", amount: "$19.99", status: "Pago" },
                        { date: "15 de janeiro de 2025", description: "Plano Premium", amount: "$19.99", status: "Pago" },
                      ].map((invoice, i) => (
                        <div key={i} className="border rounded-md p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{invoice.date}</span>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                              {invoice.status}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Descrição:</span>
                              <span>{invoice.description}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Valor:</span>
                              <span className="font-medium">{invoice.amount}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="w-full">
                            Baixar Fatura
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Aba de Notificações */}
            <TabsContent value="notifications" className="space-y-6 pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preferências de Notificação</CardTitle>
                  <CardDescription>Gerencie como e quando você recebe notificações</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Notificações por E-mail</h3>
                    <div className="space-y-4">
                      {[
                        { title: "Recomendações de Moda", description: "Receba sugestões de estilo personalizadas" },
                        { title: "Novos Recursos", description: "Seja o primeiro a saber sobre novos recursos da plataforma" },
                        { title: "Ofertas Especiais", description: "Receba ofertas e promoções exclusivas" },
                        { title: "Atualizações da Conta", description: "Informações importantes sobre sua conta" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <Switch defaultChecked={i < 2} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Notificações por Push</h3>
                    <div className="space-y-4">
                      {[
                        { title: "Respostas no Chat", description: "Receba notificações quando a IA responder suas mensagens" },
                        { title: "Combinações de Estilo", description: "Quando encontrarmos itens que combinam com seu estilo" },
                        { title: "Atualizações Sazonais", description: "Recomendações de guarda-roupa sazonais" },
                        { title: "Lembretes", description: "Lembretes sobre itens salvos e favoritos" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <Switch defaultChecked={i < 2} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Preferências de Comunicação</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="font-medium">E-mails de Marketing</p>
                          <p className="text-sm text-muted-foreground">Receba e-mails de marketing e promoções</p>
                        </div>
                        <Switch defaultChecked={false} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="font-medium">Newsletter</p>
                          <p className="text-sm text-muted-foreground">Tendências e dicas de moda semanais</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="font-medium">Atualizações por SMS</p>
                          <p className="text-sm text-muted-foreground">Receba mensagens de texto para atualizações importantes</p>
                        </div>
                        <Switch defaultChecked={false} />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>
                    <Bell className="h-4 w-4 mr-2" />
                    Salvar Preferências
                  </Button>
                </CardFooter>
              </Card>
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