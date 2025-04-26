"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  LogOut,
  Eye,
  EyeOff,
  Save,
  ArrowRight,
  Sparkles,
  Lock,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useGetUserCredentials, useUpdateCredentials , useUpdateFashionInformations, useUpdatePassword, useUpdatePersonalInformations} from "@/hooks/useUser"
import { useForm } from "react-hook-form";


export default function AccountPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data, isLoading, error } = useGetUserCredentials();
  const updateCredentialsMutation = useUpdateCredentials();
  const updatePasswordMutation = useUpdatePassword();
  const updatePersonalInformationsMutation = useUpdatePersonalInformations();
  const updateFashionInformationsMutation = useUpdateFashionInformations();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "",
  });

  const [userInformation, setUserInformationData] = useState({
    age: "",
    ethnicity: "",
    gender: "",
    hasObesity: false,
    clothingSize: "",
    fitPreference: "",
    hobbies: [] as string[],
    dressingStyle: [] as string[],
    preferredColors: [] as string[],
    salaryRange: 0
  });
  
  useEffect(() => {
    if (data) {
      setUserData({
        name: data.fullName,
        email: data.email,
        phone: data.phoneNumber,
        avatar: "/placeholder.svg?height=100&width=100", 
        joinDate: data.joinDate,
      });

      setUserInformationData({
        gender: data.preference.gender,
        age: data.preference.age || "Não informado",
        ethnicity: data.preference.ethnicity || "Não informado",
        hasObesity: data.preference.hasObesity || false,
        clothingSize: data.preference.clothingSize,
        fitPreference: data.preference.fitPreference,
        hobbies: data.preference.hobbies || [],
        dressingStyle: data.preference.dressingStyle || [],
        preferredColors: data.preference.preferredColors || [],
        salaryRange: data.preference.salaryRange || 0
      })
    }
  
    if (error) {
      toast.error(error.message || "Erro ao buscar dados");
    }
  }, [data, error]);
  
  // Controle grids multseleções
  const [selectedStyles, setSelectedStyles] = useState<string[]>(userInformation?.dressingStyle || []);
  const [selectedColors, setSelectedColors] = useState<string[]>(userInformation?.preferredColors ||[]);
  const [selectedHobies, setSelectedHobies] = useState<string[]>(userInformation?.hobbies ||[]);

  const { register, setValue, watch } = useForm({
    defaultValues: {
      dressingStyle: [] as string [],
      preferredColors: [] as string [],
      hobbies: [] as string [],

    },
  });

  // -> Estilos
  useEffect(() => {
    if (userInformation?.dressingStyle) {
      setSelectedStyles(userInformation.dressingStyle);
      setValue("dressingStyle", userInformation?.dressingStyle || []);
    }
  }, [userInformation?.dressingStyle, setValue]);

  const handleStyleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (selectedStyles.includes(value)) {
      setSelectedStyles(selectedStyles.filter((style) => style !== value));
    } else if (selectedStyles.length < 2) {
      setSelectedStyles([...selectedStyles, value]);
    }
  };

  // -> Cores preferidas
  useEffect(() => {
    if (userInformation?.preferredColors) {
      setSelectedColors(userInformation.preferredColors);
      setValue("preferredColors", userInformation.preferredColors); // se RHF
    }
  }, [userInformation?.preferredColors, setValue]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let updated = [...selectedColors];
  
    if (selectedColors.includes(value)) {
      updated = updated.filter((color) => color !== value);
    } else if (selectedColors.length < 3) {
      updated.push(value);
    }
  
    setSelectedColors(updated);
    setValue("preferredColors", updated); 
  };

  //hobbies
  useEffect(() => {
    if (userInformation?.hobbies) {
      setSelectedHobies(userInformation.hobbies);
      setValue("hobbies", userInformation.hobbies); // se RHF
    }
  }, [userInformation?.hobbies, setValue]);

  const handleHobiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let updated = [...selectedHobies];
  
    if (selectedHobies.includes(value)) {
      updated = updated.filter((hobie) => hobie !== value);
    } else if (selectedHobies.length < 5) {
      updated.push(value);
    }
  
    setSelectedHobies(updated);
    setValue("hobbies", updated); // se estiver usando React Hook Form
  };
  

  // Estado das senhas
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  
  const saveProfileChanges = () => {
    setUserData((prev) => ({
      ...prev,
      name: (document.getElementById("name") as HTMLInputElement).value,
      email: (document.getElementById("email") as HTMLInputElement).value,
      phone: (document.getElementById("phone") as HTMLInputElement).value,
      avatar: prev.avatar,
    }))

    updateCredentialsMutation.mutate({
      fullName: (document.getElementById("name") as HTMLInputElement).value,
      email: (document.getElementById("email") as HTMLInputElement).value,
      phoneNumber: (document.getElementById("phone") as HTMLInputElement).value,
    },    
    {
      onSuccess: () => {
        toast("Perfil atualizado", {
          description: "Seu perfil foi atualizado com sucesso",
        })
        router.push('/account');
      },
      onError: (error: Error) => {
        toast.error(error.message || "Erro ao atualizar credenciais");
      },
    });
  }

  const savePersonalInformations = () => {
    setUserInformationData((prev) => ({
      ...prev,
      age: (document.getElementById("age") as HTMLInputElement).value,
      ethnicity: (document.getElementById("ethnicity") as HTMLInputElement).value,
      gender: (document.getElementById("gender") as HTMLInputElement).value,
      hasObesity: (document.getElementById("hasObesity") as HTMLInputElement).checked,
      salaryRange: parseInt((document.getElementById("salaryRange") as HTMLInputElement).value,10)
    }))

    updatePersonalInformationsMutation.mutate({
      age: parseInt((document.getElementById("age") as HTMLInputElement).value, 10),
      ethnicity: (document.getElementById("ethnicity") as HTMLInputElement).value,
      gender: (document.getElementById("gender") as HTMLInputElement).value,
      hasObesity: (document.getElementById("hasObesity") as HTMLInputElement).checked,
      salaryRange: parseInt((document.getElementById("salaryRange") as HTMLInputElement).value,10)
    },    
    {
      onSuccess: () => {
        toast("Informações pessoais atualizadas", {
          description: "Suas informações foram atualizado com sucesso",
        })
        router.push('/account');
      },
      onError: (error: Error) => {
        toast.error(error.message || "Erro ao atualizar informações pessoais");
      },
    });
  }

  const saveFashionInformations = () => {
    const errors: string[] = [];
  
    if (selectedStyles.length <= 0) {
      errors.push("Selecione pelo menos um estilo.");
    }
  
    if (selectedColors.length <= 0) {
      errors.push("Selecione pelo menos uma cor preferida.");
    }
  
    if (selectedHobies.length <= 0) {
      errors.push("Selecione pelo menos um hobbie.");
    }
  
    if (errors.length > 0) {
      toast.error(
        <div>
          <strong>Erros encontrados:</strong>
          <ul style={{ marginTop: 8 }}>
            {errors.map((err, idx) => (
              <li key={idx}>- {err}</li>
            ))}
          </ul>
        </div>
      );
      return;
    }
  
    setUserInformationData((prev) => ({
      ...prev,
      clothingSize: (document.getElementById("clothingSize") as HTMLInputElement).value,
      fitPreference: (document.getElementById("fitPreference") as HTMLInputElement).value,
      dressingStyle: selectedStyles,
      preferredColors: selectedColors,
      hobbies: selectedHobies
    }));
  
    updateFashionInformationsMutation.mutate({
      clothingSize: (document.getElementById("clothingSize") as HTMLInputElement).value,
      fitPreference: (document.getElementById("fitPreference") as HTMLInputElement).value,
      dressingStyle: selectedStyles,
      preferredColors: selectedColors,
      hobbies: selectedHobies
    },    
    {
      onSuccess: () => {
        toast("Preferências de estilo atualizadas", {
          description: "Suas preferências de estilo foram atualizadas com sucesso",
        });
        router.push('/account');
      },
      onError: (error: Error) => {
        toast.error(error.message || "Erro ao atualizar preferências de estilo");
      },
    });
  };
  
  const logout = () => {
    // Remove do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  
    // Limpa o cookie
    document.cookie = 'token=; path=/; max-age=0';
  
    // Mostra um toast opcional
    toast("Você foi desconectado com sucesso.");
  
    // Redireciona para o login
    router.push('/login');
  };
  

  const changePassword = () => {
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

    updatePasswordMutation.mutate({
      oldPassword: (document.getElementById("current-password") as HTMLInputElement).value,
      newPassword: (document.getElementById("new-password") as HTMLInputElement).value,
    },    
    {
      onSuccess: () => {
        toast("Senha atualizada",{
          description: "Sua senha foi alterada com sucesso",
        })
        router.push('/account');
      },
      onError: (error: Error) => {
        toast.error(error.message || "Erro ao atualizar credenciais");
      },
    });

    setPasswords({
      current: "",
      new: "",
      confirm: "",
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
            <p className="text-muted-foreground">Gerencie as configurações da sua conta</p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:w-auto">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="security">Segurança</TabsTrigger>
              <TabsTrigger value="fashion">Preferências do Usuario</TabsTrigger>
            </TabsList>

            {/* Aba de Perfil */}
            <TabsContent value="profile" className="space-y-6 pt-6">
              <div className="flex flex-col md:flex-row gap-8">
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>Atualize seus dados pessoais</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col items-center gap-4 mb-6">
                      <div className="relative group">
                        <Avatar className="h-24 w-24 border-2 border-primary">
                          <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div
                          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                        />
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
                      onClick={logout}
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
            
            {/* Aba de Preferencias de Estilo*/}
            <TabsContent value="fashion" className="space-y-6 pt-6">
              <div className="flex flex-col md:flex-row gap-8">
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>Preferencias de Estilo</CardTitle>
                    <CardDescription>Nos deixe atualizados sobre você e seus gostos para ter um match perfeito com seu estilo</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">

                      <div className="flex flex-wrap gap-8 divide-x md:divide-x md:divide-gray-300 divide-x-0">
                        <div className="space-y-2 min-w-[300px] flex-1 border-r border-gray-300 px-4">
                          <Label>Estilo Preferido (escolha 2 que mais se identifica)</Label>
                          <div className="grid grid-cols-2 gap-4">
                            {[
                              "Casual",
                              "Formal",
                              "Esportivo",
                              "Boho",
                              "Minimalista",
                              "Old Money",
                              "Streetwear",
                              "Vintage",
                              "Gótico",
                              "Grunge",
                            ].map((style) => (
                              <label key={style} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  value={style}
                                  className="h-4 w-4"
                                  checked={selectedStyles.includes(style)}
                                  onChange={handleStyleChange}
                                  disabled={
                                    selectedStyles.length >= 2 && !selectedStyles.includes(style)
                                  }
                                />
                                <span className="text-sm">{style}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2 min-w-[300px] flex-1 border-r border-gray-300 px-4">
                          <Label>Cores preferidas (escolha até 3)</Label>
                          <div className="grid grid-cols-3 gap-4">
                            {[
                              "Preto",
                              "Branco",
                              "Azul",
                              "Vermelho",
                              "Verde",
                              "Rosa",
                              "Bege",
                              "Marrom",
                              "Roxo",
                            ].map((color) => (
                              <label key={color} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  value={color}
                                  className="h-4 w-4"
                                  checked={selectedColors.includes(color)}
                                  onChange={handleColorChange}
                                  disabled={
                                    selectedColors.length >= 3 && !selectedColors.includes(color)
                                  }
                                />
                                <span className="text-sm">{color}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2 min-w-[300px] flex-1 ">
                          <Label>Hobbies preferidos (escolha até 5)</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                              "Leitura",
                              "Viagens",
                              "Cozinhar",
                              "Exercícios físicos",
                              "Pintura",
                              "Desenho",
                              "Música",
                              "Fotografia",
                              "Jardinagem",
                              "Caminhadas",
                              "Videogames",
                              "Artesanato",
                              "Colecionismo",
                              "Meditação",
                              "Voluntariado",
                              "Esportes",
                              "Estudo de línguas",
                              "Modelismo",
                              "Criação de conteúdo online",
                              "Jogos de tabuleiro",
                            ].map((hobie) => (
                              <label key={hobie} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  value={hobie}
                                  className="h-4 w-4"
                                  checked={selectedHobies.includes(hobie)}
                                  onChange={handleHobiesChange}
                                  disabled={
                                    selectedHobies.length >= 5 && !selectedHobies.includes(hobie)
                                  }
                                />
                                <span className="text-sm">{hobie}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4 mt-8">
                      <h3 className="text-lg font-semibold">Tamanho e Caimento</h3>

                      {/* Tamanho de Roupa */}
                      <div className="grid gap-2">
                        <label htmlFor="clothingSize" className="text-sm font-medium">Tamanho de roupa</label>
                        <select
                          id="clothingSize"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                          defaultValue={userInformation?.clothingSize || ""}
                        >
                          {["PP", "P", "M", "G", "GG", "XGG"].map((size) => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </div>

                      {/* Preferência de Caimento */}
                      <div className="grid gap-2">
                        <label htmlFor="fitPreference" className="text-sm font-medium">Preferência de caimento</label>
                        <select
                          id="fitPreference"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                          defaultValue={userInformation?.fitPreference || ""}
                        >
                          {["Slim Fit", "Regular Fit", "Loose Fit", "Oversized"].map((fit) => (
                            <option key={fit} value={fit}>{fit}</option>
                          ))}
                        </select>
                      </div>
                    </div>


                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={saveFashionInformations} disabled={isUploading}>
                      {isUploading ? (
                        <>
                          <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Atualizar Preferencias de Estilo
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="w-full max-w-md mx-auto">
                  <CardHeader>
                    <CardTitle>Informações pessoais do usuario</CardTitle>
                    <CardDescription>Nos atualize de suas informações pessoais</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="age" className="text-sm font-medium">Idade</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Idade não informada"
                        defaultValue={userInformation.age ?? ""}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">Genero</p>
                      <div className="grid gap-2">
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                          id = "gender"
                          defaultValue={userInformation.gender}>
                          {["Masculino", "Feminino", "Não-binário", "Outro", "Prefiro não responder"].map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">Etinia</p>
                      <div className="grid gap-2">
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                          id = "ethnicity"
                          defaultValue={userInformation.ethnicity}>
                          {["Branca", "Parda", "Preta", "Amarela", "Indígena"].map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="grid gap-2">
                        <label htmlFor="hasObesity" className="flex items-center space-x-2 text-sm font-medium">
                          <span>Você se considera/é obeso(a)?</span>
                          <input
                            id="hasObesity"
                            type="checkbox"
                            defaultChecked={userInformation.hasObesity}
                            className="h-4 w-4"
                          />
                        </label>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label>Faixa Salarial</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                        id = "salaryRange"
                        defaultValue={userInformation.salaryRange || "0"}
                      >
                        <option value="0">Selecione sua faixa salarial</option>
                        <option value="1">Menos de R$ 1.500</option>
                        <option value="2">R$ 1.500 - R$ 3.000</option>
                        <option value="3">R$ 3.000 - R$ 5.000</option>
                        <option value="4">R$ 5.000 - R$ 10.000</option>
                        <option value="5">R$ 10.000 - R$ 20.000</option>
                        <option value="6">R$ 20.000 - R$ 50.000</option>
                        <option value="7">Acima de R$ 50.000</option>
                      </select>
                    </div>

                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button onClick={savePersonalInformations} disabled={isUploading}>
                        {isUploading ? (
                          <>
                            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Atualizar Informações pessoais
                          </>
                        )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}