import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RouterProvider from './app/providers/RouterProvider'
import { ThemeProvider } from './app/providers/ThemeProvider'
import QueryProvider from './app/providers/QueryProvider'
import { SidebarProvider } from './contexts/SidebarContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <ThemeProvider>
        <SidebarProvider>
          <RouterProvider />
        </SidebarProvider>
      </ThemeProvider>
    </QueryProvider>
  </StrictMode>,
)
