"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { ShieldCheck } from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

// Sample credentials for demonstration (these should exist in your database from the seed)
const SAMPLE_CREDENTIALS = [
  { email: "admin@example.com", password: "admin123", role: "admin" },
  { email: "hr@example.com", password: "hr123", role: "hr" },
  { email: "itlead@example.com", password: "lead123", role: "team_lead" },
  { email: "itemployee1@example.com", password: "employee123", role: "employee" },
]

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(3, { message: "Password must be at least 3 characters" }),
})

export function LoginPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showCredentials, setShowCredentials] = useState(false)
  
  // Redirect if already logged in
  useEffect(() => {
    if (session?.user) {
      if (session.user.role === "admin") {
        router.push("/admin/dashboard")
      } else if (session.user.role === "hr") {
        router.push("/hr/dashboard")
      } else if (session.user.role === "team_lead") {
        router.push("/team-lead/dashboard")
      } else if (session.user.role === "employee") {
        router.push("/employee/dashboard")
      } else {
        router.push("/dashboard")
      }
    }
  }, [session, router])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null)
    setIsLoading(true)

    try {
      // Use NextAuth signIn method
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      })

      if (!result?.ok) {
        throw new Error(result?.error || "Failed to authenticate")
      }

      // The useSession hook will automatically detect the session change
      // and trigger the useEffect above to handle the redirection
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <ShieldCheck className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">HR Management System</CardTitle>
          <CardDescription className="text-center">Enter your credentials to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>

          <div className="mt-6">
            <Button variant="outline" className="w-full" onClick={() => setShowCredentials(!showCredentials)}>
              {showCredentials ? "Hide Sample Credentials" : "Show Sample Credentials"}
            </Button>

            {showCredentials && (
              <div className="mt-4 p-4 border rounded-md text-sm">
                <h3 className="font-medium mb-2">Sample Credentials:</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  These users should exist in your database from the seed script.
                </p>
                <ul className="space-y-2">
                  {SAMPLE_CREDENTIALS.map((cred, index) => (
                    <li key={index} className="border-b pb-2 last:border-0 last:pb-0">
                      <p>
                        <strong>Role:</strong> {cred.role}
                      </p>
                      <p>
                        <strong>Email:</strong> {cred.email}
                      </p>
                      <p>
                        <strong>Password:</strong> {cred.password}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} HR Management System. All rights reserved.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
