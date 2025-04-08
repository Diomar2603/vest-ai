import { LoginForm } from "@/components/ui/login-form"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl flex-col gap-6 flex">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md  text-primary-foreground">
              <Sparkles  className="h-6 w-6 text-primary" />
            </div>
            Vest Ai.
        </Link>
        <LoginForm />
      </div>
    </div>
  )
}
