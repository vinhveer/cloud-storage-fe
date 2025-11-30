export type AccountDropdownProps = {
  userName?: string
  userEmail?: string
  userAvatar?: string | null
  settingsHref?: string
  onLogout?: () => Promise<void> | void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export type UseAccountDropdownOptions = {
  userName: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}


