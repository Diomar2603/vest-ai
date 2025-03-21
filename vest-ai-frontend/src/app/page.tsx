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
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
              <Button size="lg" className="w-full">
                Experimente Grátis
              </Button>
              <Button size="lg" variant="outline" className="w-full">
                Ver Exemplos
              </Button>
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
                        "Questionário rápido de 5 minutos",
                        "Envie fotos de inspiração",
                        "Defina suas preferências de orçamento",
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
                        "Análise do formato do corpo",
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
                        "Links diretos para compra",
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

        {/* Seção de Depoimentos */}
        <section id="testimonials" className="py-20 bg-muted/50 flex items-center justify-center px-4">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">O Que Nossos Usuários Dizem</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Milhares de pessoas transformaram seu estilo com a VestAi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Executiva de Marketing",
                  image: "/images/icon-person.jpg",
                  quote:
                    "A VestAi transformou completamente meu guarda-roupa. Eu costumava perder horas escolhendo roupas, mas agora tenho looks perfeitos para todas as ocasiões!",
                },
                {
                  name: "Michael Chen",
                  role: "Desenvolvedor de Software",
                  image: "/images/icon-person.jpg",
                  quote:
                    "Como alguém que nunca soube o que ficava bem em mim, a VestAi foi um divisor de águas. As recomendações são precisas para o meu tipo de corpo e preferências de estilo.",
                },
                {
                  name: "Aisha Patel",
                  role: "Estudante Universitária",
                  image: "/images/icon-person.jpg",
                  quote:
                    "Com um orçamento de estudante, eu precisava fazer escolhas de moda inteligentes. A VestAi me ajudou a montar um guarda-roupa versátil com peças que combinam perfeitamente.",
                },
              ].map((testimonial, i) => (
                <Card key={i} className="relative">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="rounded-full max-w-12 max-h-12 object-cover" 
                      />
                      <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <CardDescription>{testimonial.role}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex mb-2">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                    </div>
                    <p className="text-muted-foreground">{testimonial.quote}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-16 text-center">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-lg font-medium">Confiado por mais de 10.000 entusiastas da moda</span>
              </div>
              <Button size="lg">Leia Mais Histórias de Sucesso</Button>
            </div>
          </div>
        </section>


        {/* Seção Preços */}
        <section id="pricing" className="py-20 flex items-center justify-center px-4">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Preços Simples e Transparentes</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Escolha o plano que melhor atende às suas necessidades de moda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: "Básico",
                  price: "R$ 49,90",
                  description: "Perfeito para experimentar nossas recomendações de moda com IA.",
                  features: [
                    "Perfil de estilo básico",
                    "10 recomendações de looks por mês",
                    "Salvar looks favoritos",
                    "Suporte por e-mail",
                  ],
                  popular: false,
                  buttonText: "Comece Agora",
                },
                {
                  name: "Premium",
                  price: "R$ 99,90",
                  description: "Nosso plano mais popular para entusiastas da moda.",
                  features: [
                    "Perfil de estilo avançado",
                    "Recomendações de looks ilimitadas",
                    "Atualizações sazonais do guarda-roupa",
                    "Compra direta pela plataforma",
                    "Suporte prioritário",
                  ],
                  popular: true,
                  buttonText: "Experimente o Premium",
                },
                {
                  name: "Personal Stylist",
                  price: "R$ 199,90",
                  description: "Para quem busca a experiência de moda definitiva.",
                  features: [
                    "Todos os recursos do Premium",
                    "Consultor de estilo com IA",
                    "Consultas por vídeo",
                    "Estilização para ocasiões especiais",
                    "Descontos exclusivos em marcas parceiras",
                    "Suporte 24/7",
                  ],
                  popular: false,
                  buttonText: "Escolha Personal Stylist",
                },
              ].map((plan, i) => (
                <Card key={i} className={`relative ${plan.popular ? "border-primary shadow-lg" : ""}`}>
                  {plan.popular && (
                    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                      <Badge className="bg-primary">Mais Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground"> / mês</span>
                    </div>
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">
                Todos os planos incluem um teste gratuito de 14 dias. Não é necessário cartão de crédito.
              </p>
              <Link href="#" className="text-primary hover:underline">
                Ver comparação completa dos planos →
              </Link>
            </div>
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
              <Button size="lg" variant="secondary">
                Experimente Grátis
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
              >
                Agendar uma Demonstração
              </Button>
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
                {["Twitter", "Instagram", "Facebook", "LinkedIn"].map((social, i) => (
                  <Link key={i} href="#" className="text-muted-foreground hover:text-primary">
                    {social}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Produto</h3>
              <ul className="space-y-2">
                {["Recursos", "Como Funciona", "Preços", "FAQ", "Depoimentos"].map((item, i) => (
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
                {["Sobre Nós", "Blog", "Carreiras", "Imprensa", "Contato"].map((item, i) => (
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
                {["Termos de Serviço", "Política de Privacidade", "Política de Cookies", "GDPR"].map((item, i) => (
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

