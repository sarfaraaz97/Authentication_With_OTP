"use client"
import { Settings } from "lucide-react" // Import Settings icon

import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Mail, User, CheckCircle, XCircle, Key } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <DashboardHeader />

        <main className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your secure account dashboard</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Profile Information Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 text-primary mr-2" />
                  Profile Information
                </CardTitle>
                <CardDescription>Your account details and verification status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Username</label>
                    <p className="text-lg font-medium">{user?.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">User ID</label>
                    <p className="text-lg font-medium">#{user?.id}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-lg font-medium">{user?.email}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                    <div className="flex items-center space-x-2 mt-1">
                      {user?.enabled ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-500" />
                          <Badge variant="destructive">Disabled</Badge>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email Verification</label>
                    <div className="flex items-center space-x-2 mt-1">
                      {user?.emailVerified ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Verified
                          </Badge>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-500" />
                          <Badge variant="destructive">Unverified</Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 text-primary mr-2" />
                  Security Status
                </CardTitle>
                <CardDescription>Your account security overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Key className="h-4 w-4 text-primary" />
                    <span className="text-sm">Two-Factor Auth</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Enabled
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="text-sm">Email Verification</span>
                  </div>
                  {user?.emailVerified ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Required</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-sm">Account Status</span>
                  </div>
                  {user?.enabled ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Disabled</Badge>
                  )}
                </div>

                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  Security Settings
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your account and security settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                    <User className="h-6 w-6" />
                    <span>Edit Profile</span>
                  </Button>

                  <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                    <Key className="h-6 w-6" />
                    <span>Change Password</span>
                  </Button>

                  <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                    <Shield className="h-6 w-6" />
                    <span>Security Settings</span>
                  </Button>

                  <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                    <Mail className="h-6 w-6" />
                    <span>Email Preferences</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Notice */}
          <div className="mt-8">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-primary">Security Notice</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your account is protected with enterprise-grade security including two-factor authentication,
                      email verification, and encrypted password storage. Always keep your login credentials secure and
                      never share your OTP codes with anyone.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
