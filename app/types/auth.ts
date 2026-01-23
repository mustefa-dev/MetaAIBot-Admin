// Authentication Types

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: string
}

export type UserRole = 'SuperAdmin' | 'Admin' | 'User'

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  passwordConfirmation: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  newPasswordConfirmation: string
}

export interface UpdateProfileRequest {
  name?: string
  email?: string
  avatar?: string
}
