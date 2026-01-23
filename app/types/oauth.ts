export interface ConnectedAccountDto {
  id: string
  platform: 'Instagram' | 'Messenger' | 'WhatsApp'
  platformAccountId: string
  accountName: string
  profilePictureUrl?: string
  isActive: boolean
  connectedAt: string
  tokenExpiringSoon: boolean
  lastError?: string
}

export interface AvailablePage {
  pageId: string
  pageName: string
  pagePictureUrl?: string
  hasInstagram: boolean
  instagramAccountId?: string
  instagramUsername?: string
  instagramProfilePicture?: string
}

export interface OAuthUrlResponse {
  authorizationUrl: string
  state: string
}

export interface AvailablePagesResponse {
  state: string
  pages: AvailablePage[]
}

export interface ConnectPageRequest {
  state: string
  pageId: string
  connectInstagram: boolean
  connectMessenger: boolean
}
