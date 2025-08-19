"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api"
import { Shield, ArrowLeft, Lock, Key } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [step, setStep] = useState<"login" | "verify">("login")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [loginResponse, setLoginResponse] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    setIsLoading(true)

    try {
      const response = await apiClient.login({
        email: formData.email,
        password: formData.password,
      })

      if (response.success) {
        // Store the login response for later use after OTP verification
        setLoginResponse(response.data)
        toast({
          title: "Credentials Verified",
          description: "Please check your email for the verification code.",
        })
        setStep("verify")
      } else {
        setError(response.message || "Login failed")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    setIsLoading(true)

    try {
      const response = await apiClient.verifyLogin({
        email: formData.email,
        otp: otp,
      })

      if (response.success && response.data) {
        // Login successful, store token and user data
        login(response.data.token, {
          username: response.data.username,
          email: response.data.email,
        })

        toast({
          title: "Login Successful",
          description: `Welcome back, ${response.data.username}!`,
        })

        // Redirect to dashboard
        router.push("/dashboard")
      } else {
        setError(response.message || "OTP verification failed")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "OTP verification failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.resendOtp({
        email: formData.email,
        type: "LOGIN",
      })

      if (response.success) {
        toast({
          title: "OTP Resent",
          description: "A new verification code has been sent to your email.",
        })
      } else {
        setError(response.message || "Failed to resend OTP")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to resend OTP")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold text-foreground">SecureAuth</h1>
          </div>
          <p className="text-muted-foreground">
            {step === "login" ? "Sign in to your account" : "Verify your identity"}
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              {step === "login" ? (
                <>
                  <Lock className="h-5 w-5 text-primary mr-2" />
                  Sign In
                </>
              ) : (
                <>
                  <Key className="h-5 w-5 text-primary mr-2" />
                  Two-Factor Authentication
                </>
              )}
            </CardTitle>
            <CardDescription>
              {step === "login"
                ? "Enter your credentials to access your account"
                : `Enter the 6-digit code sent to ${formData.email}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {step === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
                    />
                    <Label htmlFor="rememberMe" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </div>

                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground text-center">
                    <Key className="h-4 w-4 inline mr-1" />
                    This code will expire in 5 minutes
                  </p>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading || otp.length !== 6}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4 mr-2" />
                      Verify & Sign In
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <Button type="button" variant="ghost" onClick={handleResendOtp} disabled={isLoading}>
                    Resend Code
                  </Button>
                </div>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setStep("login")
                      setOtp("")
                      setError("")
                    }}
                    className="text-sm"
                    disabled={isLoading}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Sign In
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/register" className="text-primary hover:underline font-medium">
                  Create one
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {step === "login" && (
          <div className="mt-6 text-center">
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm font-medium">Secure Login Process</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Your account is protected with two-factor authentication. After entering your credentials, you'll
                receive a verification code via email.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
