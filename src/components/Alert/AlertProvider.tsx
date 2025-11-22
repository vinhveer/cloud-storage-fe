import React from 'react'
import { useLocation } from '@tanstack/react-router'
import Alert from './Alert'
import type { AlertType } from './types'

type AlertConfig = {
    type: AlertType
    message: string
    heading?: string
    duration?: number
    icon?: React.ReactNode | false
}

type AlertContextType = {
    showAlert: (config: AlertConfig) => void
    hideAlert: () => void
}

const AlertContext = React.createContext<AlertContextType | undefined>(undefined)

export function AlertProvider({ children }: { children: React.ReactNode }) {
    const [alert, setAlert] = React.useState<(AlertConfig & { visible: boolean }) | null>(null)
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    const showAlert = React.useCallback((config: AlertConfig) => {
        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        setAlert({ ...config, visible: true })

        // Auto-hide after duration (default 5 seconds)
        if (config.duration !== 0) {
            timeoutRef.current = setTimeout(() => {
                setAlert(prev => prev ? { ...prev, visible: false } : null)
            }, config.duration || 5000)
        }
    }, [])

    const hideAlert = React.useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        setAlert(prev => prev ? { ...prev, visible: false } : null)
    }, [])

    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    // Auto-dismiss alert on route change
    const location = useLocation()
    React.useEffect(() => {
        hideAlert()
    }, [location.pathname, hideAlert])

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            {alert?.visible && (
                <div className="fixed top-4 right-4 z-50 w-full min-w-[200px] max-w-[300px] animate-slide-in">
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        heading={alert.heading}
                        icon={alert.icon}
                        dismissible
                        onDismiss={hideAlert}
                    />
                </div>
            )}
        </AlertContext.Provider>
    )
}

export function useAlert() {
    const context = React.useContext(AlertContext)
    if (!context) {
        throw new Error('useAlert must be used within AlertProvider')
    }
    return context
}
