import { LoginOptions } from "@/components/auth/login-options"

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container max-w-md p-6">
        <LoginOptions />
      </div>
    </main>
  )
}
