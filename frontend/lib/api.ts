export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: number
    username: string
    email: string
    enabled: boolean
    emailVerified: boolean
  }
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface OtpVerificationRequest {
  email: string
  otp: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  email: string
  otp: string
  newPassword: string
}

export interface ResendOtpRequest {
  email: string
  type: "LOGIN" | "REGISTRATION"
}

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const token = localStorage.getItem("authToken")

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "An error occurred")
      }

      return data
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Only use endpoints from provided AuthController
  async register(data: RegisterRequest): Promise<ApiResponse<string>> {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async verifyRegistration(data: OtpVerificationRequest): Promise<ApiResponse<string>> {
    return this.request("/auth/verify-registration", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async login(data: LoginRequest): Promise<ApiResponse<string>> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async verifyLogin(data: OtpVerificationRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request("/auth/verify-login", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async resendOtp(data: ResendOtpRequest): Promise<ApiResponse<string>> {
    return this.request("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<string>> {
    return this.request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<string>> {
    return this.request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new ApiClient()
