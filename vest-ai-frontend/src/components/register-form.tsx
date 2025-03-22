"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react"

// Update FormValues type
type FormValues = {
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string,
  // Optional but recommended
  phoneNumber?: string,
  // New style preference fields

  dressingStyle: string[],
  preferredColors: string[],
  stylePreferences: string[],
  priceRange: string,
  preferredPatterns: string[],
  followsTrends: string,
  
  // Clothes and Fabrics
  commonClothingTypes: string[],
  preferredFabrics: string[],
  avoidedFabrics: string[],
  
  // Fit and Size
  clothingSize: string,
  fitPreference: string,
  bodyType: string,
  
  // Occasions
  occasionNeeds: string[],
  formalStyle: string,
  casualStyle: string[],
  
  // Accessories
  commonAccessories: string[],
  commonShoeTypes: string[],
  
  // Additional Preferences
  sustainabilityPreference: string,
  skinTonePalette: string,
}

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [step, setStep] = useState(1);
   const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[100%] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {step === 1 ? "Criar Conta" : "Suas Preferências de Estilo"}
          </CardTitle>
          <CardDescription>
            {step === 1 
              ? "Crie uma conta preenchendo os campos abaixo"
              : "Conte-nos sobre seu estilo para recomendações personalizadas"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              {step === 1 ? (
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Nome completo</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="João da Silva"
                      {...register("fullName", { required: true })}
                    />
                    {errors?.fullName && <CardDescription className="text-red-500">Campo obrigatório</CardDescription>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      {...register("email", { required: true })}
                    />
                    {errors?.email && <CardDescription className="text-red-500">Campo obrigatório</CardDescription>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      {...register("password", { required: true, minLength: 8 })}
                    />
                    {errors?.password && <CardDescription className="text-red-500">Senha deve ter no mínimo 8 caracteres</CardDescription>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...register("confirmPassword", { required: true  })}
                    />
                    {errors?.confirmPassword && <CardDescription className="text-red-500">As senhas devem ser iguais</CardDescription>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phoneNumber">Telefone (opcional)</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="(11) 98765-4321"
                      {...register("phoneNumber")}
                    />
                  </div>
                  <Button 
                    type="button" 
                    className="w-full"
                    onClick={() => setStep(2)}
                  >
                    Próximo
                  </Button>
                </div>
              // Replace the second step content with:
              ) : (
                <div className="grid gap-8">  {/* Changed from gap-6 to gap-8 */}
                  <div className="grid gap-2">
                    <Label>Tipo Corporal</Label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                      {...register("bodyType", { required: true })}
                    >
                      <option value="">Selecione seu tipo corporal</option>
                      <option value="hourglass">Ampulheta</option>
                      <option value="rectangle">Retangular</option>
                      <option value="triangle">Triângulo</option>
                      <option value="inverted-triangle">Triângulo Invertido</option>
                      <option value="oval">Oval</option>
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Estilo Preferido</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {["Casual", "Elegante", "Esportivo", "Vintage", "Minimalista"].map((style) => (
                        <label key={style} className="flex items-center space-x-3">
                          <div className="w-5">
                            <Input
                              type="checkbox"
                              value={style}
                              className="h-4 w-4"
                              {...register("stylePreferences")}
                            />
                          </div>
                          <span className="text-sm">{style}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Faixa de Preço</Label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                      {...register("priceRange", { required: true })}
                    >
                      <option value="">Selecione sua faixa de preço</option>
                      <option value="budget">Econômico</option>
                      <option value="moderate">Moderado</option>
                      <option value="premium">Premium</option>
                      <option value="luxury">Luxo</option>
                    </select>
                  </div>

                  <div className="grid gap-4">  {/* Added a section wrapper with gap-8 */}
                    <h3 className="font-semibold">Estilo e Preferências</h3>
                    
                    <div className="grid gap-4">  {/* Changed from gap-2 to gap-4 */}
                      <div className="grid gap-2">
                        <Label>Estilo Preferido</Label>
                        <div className="grid grid-cols-2 gap-4">
                          {["Casual", "Formal", "Esportivo", "Boho", "Minimalista", "Clássico"].map((style) => (
                            <label key={style} className="flex items-center space-x-3">
                              <div className="w-5">
                                <Input
                                  type="checkbox"
                                  value={style}
                                  className="h-4 w-4"
                                  {...register("dressingStyle")}
                                />
                              </div>
                              <span className="text-sm">{style}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label>Cores preferidas (escolha até 3)</Label>
                        <div className="grid grid-cols-3 gap-4">
                          {["Preto", "Branco", "Azul", "Vermelho", "Verde", "Rosa", "Bege", "Marrom", "Roxo"].map((color) => (
                            <label key={color} className="flex items-center space-x-3">
                              <div className="w-5">
                                <Input
                                  type="checkbox"
                                  value={color}
                                  className="h-4 w-4"
                                  {...register("preferredColors")}
                                />
                              </div>
                              <span className="text-sm">{color}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label>Padrões preferidos</Label>
                        <div className="grid grid-cols-2 gap-4">
                          {["Liso", "Listrado", "Estampado", "Xadrez", "Poá", "Floral"].map((pattern) => (
                            <label key={pattern} className="flex items-center space-x-3">
                              <div className="w-5">
                                <Input
                                  type="checkbox"
                                  value={pattern}
                                  className="h-4 w-4"
                                  {...register("preferredPatterns")}
                                />
                              </div>
                              <span className="text-sm">{pattern}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">  {/* Added consistent section spacing */}
                    <h3 className="font-semibold">Tamanho e Caimento</h3>
                    
                    <div className="grid gap-2">
                      <Label>Tamanho de roupa</Label>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                        {...register("clothingSize")}
                      >
                        <option value="">Selecione seu tamanho</option>
                        {["PP", "P", "M", "G", "GG", "XG"].map((size) => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid gap-2">
                      <Label>Preferência de caimento</Label>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                        {...register("fitPreference")}
                      >
                        <option value="">Selecione sua preferência</option>
                        <option value="fitted">Ajustado ao corpo</option>
                        <option value="loose">Mais solto</option>
                        <option value="mixed">Depende da peça</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Tom de pele</Label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                      {...register("skinTonePalette")}
                    >
                      <option value="">Selecione seu subtom</option>
                      <option value="cool">Frio (subtom rosa, vermelho ou azul)</option>
                      <option value="warm">Quente (subtom dourado, amarelo ou pêssego)</option>
                      <option value="neutral">Neutro (mistura equilibrada)</option>
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex gap-4 pt-4">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>
                        Voltar
                      </Button>
                      <Button type="submit" className="flex-1">
                        Finalizar Cadastro
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
