"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitHandler, useForm, FieldErrors } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { useRegister } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

// Update FormValues type
type FormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender : string;
  phoneNumber?: string;

  dressingStyle: string[];
  preferredColors: string[];
  clothingSize: string;
  fitPreference: string;
  
  // Additional Preferences
  age: number;
  ethnicity: string;
  hasObesity: boolean;
  salaryRange: number;
  hobbies: string[];
};

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const registerMutation = useRegister();
  const [step, setStep] = useState(1);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedHobies, setSselectedHobies] = useState<string[]>([]);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>();

  const password = watch("password");

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      if (selectedColors.length < 3) {
        setSelectedColors([...selectedColors, value]);
      }
    } else {
      setSelectedColors(selectedColors.filter((color) => color !== value));
    }
  };

  const handleStyleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      if (selectedStyles.length < 2) {
        setSelectedStyles([...selectedStyles, value]);
      }
    } else {
      setSelectedStyles(selectedStyles.filter((style) => style !== value));
    }
  };

  const handleHobiesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      if (selectedHobies.length < 5) {
        setSselectedHobies([...selectedHobies, value]);
      }
    } else {
      setSselectedHobies(selectedHobies.filter((hobie) => hobie !== value));
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    registerMutation.mutate({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        gender: data.gender,
        phoneNumber: data.phoneNumber,
      
        dressingStyle: data.dressingStyle,
        preferredColors: data.preferredColors,
        clothingSize: data.clothingSize,
        fitPreference: data.fitPreference,
      
        age: data.age,
        ethnicity: data.ethnicity,
        hasObesity: data.hasObesity,
        salaryRange: data.salaryRange,
        hobbies: data.hobbies,
      },    
      {
        onSuccess: () => {
          toast.success("Cadastro realizado com sucesso!");
          router.push('/login');
        },
        onError: (error: Error) => {
          toast.error(error.message || "Erro ao realizar cadastro");
        },
      }
    );
  };

  const onSubmitError = (errors: FieldErrors<FormValues>) => {
    const messages = Object.entries(errors).map(([field, error]) => {
      return `• ${error?.message}`;
    });

    toast("Erros no formulário", {
      description: (
        <div className="mt-2 space-y-1">
          {messages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      ),
      duration: 6000,
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {step === 1
              ? "Criar Conta"
              : step === 2
              ? "Suas Preferências de Estilo"
              : step === 3
              ? "Informações pessoais"
              : null}
          </CardTitle>
          <CardDescription>
            {step === 1
              ? "Crie uma conta preenchendo os campos abaixo"
              : step === 2
              ? "Conte-nos sobre seu estilo para recomendações personalizadas"
              : step === 3
              ? "Nos fale um pouco de suas caracteristicas pessoais (Todas as respostas desta pagina são opcionais)"
              : null}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
            <div className="grid gap-6">
              {step === 1 ? (
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Nome completo</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Nome Completo"
                      {...register("fullName", { required: "O nome é obrigatório" })}
                    />
                    {errors?.fullName && (
                      <CardDescription className="text-red-500">
                        Campo obrigatório
                      </CardDescription>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      {...register("email", { required: "O email é obrigatório" })}
                    />
                    {errors?.email && (
                      <CardDescription className="text-red-500">
                        Campo obrigatório
                      </CardDescription>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      {...register("password", { required: "A senha é obrigatória", minLength: 8 })}
                    />
                    {errors?.password && (
                      <CardDescription className="text-red-500">
                        Senha deve ter no mínimo 8 caracteres
                      </CardDescription>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...register("confirmPassword", {
                        required: "Confirmar a senha é obrigatório",
                        validate: (value) =>
                          value === password || "As senhas não coincidem",
                      })}
                    />
                    {errors?.confirmPassword && (
                      <CardDescription className="text-red-500">
                        {errors.confirmPassword.message}
                      </CardDescription>
                    )}
                  </div>
                  <div className="grid gap-2">
                      <Label>Genero</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                        {...register("gender", {required: "Selecionar opção é obrigatório"})}
                      >
                        <option value="">Selecione o Genero ao qual se identifica</option>
                        {["Masculino","Feminino", "Não-binario", "Outro", "Prefiro não responder"].map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phoneNumber">Telefone (opcional)</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="(11) 90000-0000"
                      {...register("phoneNumber")}
                    />
                  </div>
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleSubmit(() => setStep(2), onSubmitError)}
                  >
                    Próximo
                  </Button>
                </div>
              ) : step === 2 ? (
                <div className="grid gap-8">
                  <div className="grid gap-4">
                    <h3 className="font-semibold">Estilo e Preferências</h3>

                    <div className="grid gap-4">
                      <div className="grid gap-2">
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
                            <label key={style} className="flex items-center space-x-3">
                              <div className="w-5">
                                <Input
                                  type="checkbox"
                                  value={style}
                                  className="h-4 w-4"
                                  {...register("dressingStyle", {required: "Escolha ao menos um estilo"})}
                                  checked={selectedStyles.includes(style)}
                                  onChange={handleStyleChange}
                                  disabled={
                                    selectedStyles.length >= 2 && !selectedStyles.includes(style)
                                  }
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
                            <label key={color} className="flex items-center space-x-3">
                              <div className="w-5">
                                <Input
                                  type="checkbox"
                                  value={color}
                                  className="h-4 w-4"
                                  {...register("preferredColors", {required: "Escolha ao menos uma cor"})}
                                  checked={selectedColors.includes(color)}
                                  onChange={handleColorChange}
                                  disabled={
                                    selectedColors.length >= 3 && !selectedColors.includes(color)
                                  }
                                />
                              </div>
                              <span className="text-sm">{color}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <h3 className="font-semibold">Tamanho e Caimento</h3>

                    <div className="grid gap-2">
                      <Label>Tamanho de roupa</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                        {...register("clothingSize", {required: "Escolher preferencia de tamanho é obrigatório"})}
                      >
                        <option value="">Selecione seu tamanho</option>
                        {["PP", "P", "M", "G", "GG", "XG", "XGG", "3G", "4G"].map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid gap-2">
                      <Label>Preferência de caimento</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                        {...register("fitPreference",{required: "Escolha um caimento é obrigatório"})}
                      >
                        <option value="">Selecione sua preferência</option>
                        <option value="Slim">Slim Fit</option>
                        <option value="Regular">Regular Fit</option>
                        <option value="Relaxed">Loose Fit / Relaxed Fit</option>
                        <option value="Oversized">Oversized</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex gap-4 pt-4">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>
                        Voltar
                      </Button>
                      <Button type="submit" className="flex-1" onClick={handleSubmit(() => setStep(3), onSubmitError)}>
                        Próximo
                      </Button>
                    </div>
                  </div>
                </div>
              ) : step === 3 ? (
                <div className="grid gap-8">
                  <div className="grid gap-4">
                    <h3 className="font-semibold">Informações pessoais</h3>

                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="age">Idade</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="Sua idade"
                          {...register("age", { required: false })}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>A qual etnia se identifica</Label>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                          {...register("ethnicity", { required: false })}
                        >
                          <option value="">Selecione sua etnia</option>
                          {["Branca", "Parda", "Preta", "Amarela", "Indígena"].map((size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid gap-2">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="hasObesity" className="mr-2">Você se considera/é obeso(a)?</Label>
                          <Input
                            id="hasObesity"
                            type="checkbox"
                            {...register("hasObesity")}
                            className="h-4 w-4"
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label>Hobbies preferidos (escolha até 5)</Label>
                        <div className="grid grid-cols-2 gap-4">
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
                            "Jogos de tabuleiro"
                            ].map((hobie) => (
                            <label key={hobie} className="flex items-center space-x-3">
                              <div className="w-5">
                                <Input
                                  type="checkbox"
                                  value={hobie}
                                  className="h-4 w-4"
                                  {...register("hobbies")}
                                  checked={selectedHobies.includes(hobie)}
                                  onChange={handleHobiesChange}
                                  disabled={
                                    selectedHobies.length >= 5 && !selectedHobies.includes(hobie)
                                  }
                                />
                              </div>
                              <span className="text-sm">{hobie}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-2">
                      <Label>Faixa Salarial</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                        {...register("salaryRange")}
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

                      
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex gap-4 pt-4">
                      <Button type="button" variant="outline" onClick={() => setStep(2)}>
                        Voltar
                      </Button>
                      <Button type="submit" className="flex-1">
                        Finalizar Cadastro
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
