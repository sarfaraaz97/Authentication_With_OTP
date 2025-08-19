"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"
import { Shield, ArrowLeft, Mail, User, Lock } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [step, setStep] = useState<"register" | "verify">("register")
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (formData.username.length < 3 || formData.username.length > 50) {
      setError("Username must be between 3 and 50 characters")
      return
    }

    setIsLoading(true)

    try {
      const response = await apiClient.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })

      if (response.success) {
        toast({
          title: "Registration Successful",
          description: "Please check your email for the verification code.",
        })
        setStep("verify")
      } else {
        setError(response.message || "Registration failed")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed")
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
      const response = await apiClient.verifyRegistration({
        email: formData.email,
        otp: otp,
      })

      if (response.success) {
        toast({
          title: "Email Verified Successfully",
          description: "Your account has been activated. You can now sign in.",
        })
        router.push("/auth/login")
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
        type: "REGISTRATION",
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
            {step === "register" ? "Create your secure account" : "Verify your email address"}
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              {step === "register" ? (
                <>
                  <User className="h-5 w-5 text-primary mr-2" />
                  Create Account
                </>
              ) : (
                <>
                  <Mail className="h-5 w-5 text-primary mr-2" />
                  Email Verification
                </>
              )}
            </CardTitle>
            <CardDescription>
              {step === "register"
                ? "Fill in your details to get started"
                : `Enter the 6-digit code sent to ${formData.email}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {step === "register" ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    minLength={3}
                    maxLength={50}
                  />
                </div>

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
                    minLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Create Account
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

                <Button type="submit" className="w-full" size="lg" disabled={isLoading || otp.length !== 6}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Verify Email
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
                    onClick={() => setStep("register")}
                    className="text-sm"
                    disabled={isLoading}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Registration
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
