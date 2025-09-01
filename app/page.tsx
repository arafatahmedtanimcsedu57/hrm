import { LoginForm } from "@/components/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">HRM System</h1>
          <p className="text-muted-foreground">Professional Human Resource Management</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Sign in to manage your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
