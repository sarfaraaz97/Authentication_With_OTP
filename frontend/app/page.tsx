"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Lock, Mail, Key } from "lucide-react"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-foreground">SecureAuth</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional authentication system with advanced security features including OTP verification and email
            validation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 text-primary mr-2" />
                Secure Login
              </CardTitle>
              <CardDescription>Access your account with two-factor authentication</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/auth/login")} className="w-full" size="lg">
                Sign In
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2" />
                Create Account
              </CardTitle>
              <CardDescription>Register with email verification and secure setup</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/auth/register")} variant="outline" className="w-full" size="lg">
                Sign Up
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <Key className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">OTP Verification</h3>
            <p className="text-sm text-muted-foreground">Two-factor authentication with time-based OTP codes</p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Email Verification</h3>
            <p className="text-sm text-muted-foreground">Secure email validation for account activation</p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Enterprise Security</h3>
            <p className="text-sm text-muted-foreground">JWT tokens with BCrypt encryption and secure sessions</p>
          </div>
        </div>
      </div>
    </div>
  )
}
