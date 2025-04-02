import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Sparkles, Zap, ShoppingBag, Users, Star } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navegação */}
      <header className="sticky px-4 top-0 z-40 w-full flex items-center justify-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">VestAi</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Cadastrar-se</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Seção Hero */}
        <section className="relative px-4 py-20 md:py-28 flex items-center justify-center">
          <div className="container flex flex-col items-center text-center">
            <Badge className="mb-4" variant="outline">
              Moda impulsionada por IA
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Descubra Seu Estilo Perfeito <br className="hidden md:inline" />
              <span className="text-primary">Com Tecnologia de IA</span>
            </h1>
            <p className="max-w-[42rem] text-muted-foreground text-lg mb-10">
              Nossa IA analisa suas preferências, tipo de corpo e objetivos de estilo para recomendar looks personalizados que realmente refletem quem você é.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto justify-center">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full">
                  Experimente Grátis
                </Button>
              </Link>
            </div>

            <div className="relative w-full max-w-5xl mt-16 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/hero-image.jpg"
                alt="Interface da plataforma VestAi"
                width={1200}
                height={600}
                className="rounded-lg border"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-30"></div>
            </div>
          </div>
        </section>

        {/* Seção de Recursos */}
        <section id="features" className="py-20 px-4 bg-muted/50 flex items-center justify-center">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que escolher VestAi?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Nossa plataforma usa IA avançada para transformar sua experiência de moda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="p-2 w-12 h-12 rounded-full bg-primary/10 mb-4 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Recomendações Personalizadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Nossa IA analisa suas preferências e seu tipo de corpo para sugerir looks que combinam com você.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="p-2 w-12 h-12 rounded-full bg-primary/10 mb-4 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Combinação de Estilos Instantânea</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Receba sugestões de looks que combinam com sua ocasião e orçamento com apenas alguns cliques.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="p-2 w-12 h-12 rounded-full bg-primary/10 mb-4 flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Compre com Confiança</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Compre itens recomendados diretamente na nossa plataforma, com descontos exclusivos de marcas parceiras.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

       {/* Seção Como Funciona */}
        <section id="how-it-works" className="py-20 flex items-center justify-center px-4">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Como a VestAi Funciona</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Nosso processo simples de 3 passos ajuda você a descobrir seu estilo perfeito.
              </p>
            </div>

            <Tabs defaultValue="profile" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">1. Crie Seu Perfil</TabsTrigger>
                <TabsTrigger value="analyze">2. Análise por IA</TabsTrigger>
                <TabsTrigger value="discover">3. Descubra Looks</TabsTrigger>
              </TabsList>
              <TabsContent value="profile" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Crie Seu Perfil de Estilo</h3>
                    <p className="text-muted-foreground mb-6">
                      Responda algumas perguntas sobre suas preferências, tipo de corpo e objetivos de estilo.
                      Envie fotos de roupas que você gosta ou não gosta para ajudar nossa IA a entender seu gosto.
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Questionário rápido de 5 minutos"
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg overflow-hidden border">
                    <Image
                      src="/placeholder.svg?height=400&width=500"
                      alt="Interface de criação de perfil"
                      width={500}
                      height={400}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="analyze" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">A IA Analisa Seu Estilo</h3>
                    <p className="text-muted-foreground mb-6">
                      Nossa IA avançada processa suas informações para entender suas preferências de estilo,
                      formato do corpo e necessidades de moda.
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Correspondência de paleta de cores",
                        "Detecção de preferências de estilo",
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg overflow-hidden border">
                    <Image
                      src="/placeholder.svg?height=400&width=500"
                      alt="Visualização da análise da IA"
                      width={500}
                      height={400}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="discover" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Descubra Looks Perfeitos</h3>
                    <p className="text-muted-foreground mb-6">
                      Navegue por recomendações personalizadas de looks feitas especialmente para você.
                      Salve seus favoritos, compre os itens diretamente ou solicite ajustes.
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Galeria personalizada de looks",
                        "Opções para combinar peças",
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg overflow-hidden border">
                    <Image
                      src="/placeholder.svg?height=400&width=500"
                      alt="Interface de recomendações de looks"
                      width={500}
                      height={400}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Seção Chamada para Ação (CTA) */}
        <section className="py-20 bg-primary text-primary-foreground flex items-center justify-center px-4">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para Transformar Seu Estilo?</h2>
            <p className="max-w-2xl mx-auto mb-10 text-primary-foreground/90">
              Junte-se a milhares de entusiastas da moda que já descobriram seu estilo perfeito com a VestAi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary">
                  Experimente Grátis
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Rodapé */}
      <footer className="border-t py-12 bg-muted/30 flex items-center justify-center px-4">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">VestAi</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Recomendações de moda impulsionadas por IA, personalizadas para o seu estilo único.
              </p>
              <div className="flex gap-4">
                {["Instagram", "LinkedIn"].map((social, i) => (
                  <Link key={i} href="#" className="text-muted-foreground hover:text-primary">
                    {social}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Produto</h3>
              <ul className="space-y-2">
                {["Recursos", "Como Funciona"].map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="text-muted-foreground hover:text-primary">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Empresa</h3>
              <ul className="space-y-2">
                {["Sobre Nós", "Contato"].map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="text-muted-foreground hover:text-primary">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                {["Termos de Serviço", "Política de Privacidade"].map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="text-muted-foreground hover:text-primary">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} VestAi. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

