import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RouterProvider from './app/providers/RouterProvider'
import { ThemeProvider } from './app/providers/ThemeProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider />
    </ThemeProvider>
  </StrictMode>,
)
