"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

type FormValues = {
  email: string
  password: string
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  
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
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bem vindo de volta</h1>
                <p className="text-muted-foreground text-balance">
                  Entre com sua conta VestAi
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@exemplo.com"
                  {...register("email", { required: true })}
                />
                {errors?.email && <CardDescription className="text-red-500">Campo obrigatório</CardDescription>}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <Input id="password" type="password" {...register("password", {required: true})} />
                {errors?.password && <CardDescription className="text-red-500">Campo obrigatório</CardDescription>}
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
              <div className="text-center text-sm">
                Não possui uma conta?{" "}
                <a href="/register" className="underline underline-offset-4">
                  Cadastre-se
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/images/login-image2.jpg"
              alt="Image"
              layout="fill"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
