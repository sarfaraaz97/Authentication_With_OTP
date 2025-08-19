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
import { Shield, ArrowLeft, Mail, Key, Lock } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "reset">("email")
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.email) {
      setError("Please enter your email address")
      return
    }

    setIsLoading(true)

    try {
      const response = await apiClient.forgotPassword({
        email: formData.email,
      })

      if (response.success) {
        toast({
          title: "Reset Code Sent",
          description: "Please check your email for the password reset code.",
        })
        setStep("reset")
      } else {
        setError(response.message || "Failed to send reset code")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to send reset code")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!formData.otp || formData.otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    if (!formData.newPassword || formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const response = await apiClient.resetPassword({
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      })

      if (response.success) {
        toast({
          title: "Password Reset Successful",
          description: "Your password has been updated. You can now sign in with your new password.",
        })
        router.push("/auth/login")
      } else {
        setError(response.message || "Password reset failed")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Password reset failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.forgotPassword({
        email: formData.email,
      })

      if (response.success) {
        toast({
          title: "Reset Code Resent",
          description: "A new password reset code has been sent to your email.",
        })
      } else {
        setError(response.message || "Failed to resend reset code")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to resend reset code")
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: "", color: "" }
    if (password.length < 6) return { strength: 1, text: "Too short", color: "text-destructive" }
    if (password.length < 8) return { strength: 2, text: "Weak", color: "text-orange-500" }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { strength: 3, text: "Fair", color: "text-yellow-500" }
    return { strength: 4, text: "Strong", color: "text-green-500" }
  }

  const passwordStrength = getPasswordStrength(formData.newPassword)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold text-foreground">SecureAuth</h1>
          </div>
          <p className="text-muted-foreground">{step === "email" ? "Reset your password" : "Create a new password"}</p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              {step === "email" ? (
                <>
                  <Mail className="h-5 w-5 text-primary mr-2" />
                  Forgot Password
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5 text-primary mr-2" />
                  Reset Password
                </>
              )}
            </CardTitle>
            <CardDescription>
              {step === "email"
                ? "Enter your email address to receive a password reset code"
                : `Enter the code sent to ${formData.email} and your new password`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {step === "email" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 inline mr-1" />
                    We'll send a 6-digit verification code to your email address.
                  </p>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending Code...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Reset Code
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                    required
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    required
                    minLength={6}
                  />
                  {formData.newPassword && (
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            passwordStrength.strength === 1
                              ? "bg-destructive w-1/4"
                              : passwordStrength.strength === 2
                                ? "bg-orange-500 w-2/4"
                                : passwordStrength.strength === 3
                                  ? "bg-yellow-500 w-3/4"
                                  : passwordStrength.strength === 4
                                    ? "bg-green-500 w-full"
                                    : "w-0"
                          }`}
                        />
                      </div>
                      <span className={`text-xs ${passwordStrength.color}`}>{passwordStrength.text}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading || formData.otp.length !== 6 || passwordStrength.strength < 2}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Reset Password
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
                      setStep("email")
                      setFormData({ ...formData, otp: "", newPassword: "", confirmPassword: "" })
                      setError("")
                    }}
                    className="text-sm"
                    disabled={isLoading}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Email
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {step === "email" && (
          <div className="mt-6 text-center">
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Key className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm font-medium">Secure Password Reset</span>
              </div>
              <p className="text-xs text-muted-foreground">
                For your security, we'll send a verification code to your registered email address. This code will
                expire in 5 minutes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
