import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RouterProvider from './app/providers/RouterProvider'
import { Provider } from 'react-redux'
import { store } from './state/store'
import { ThemeProvider } from './app/providers/ThemeProvider'
import QueryProvider from './app/providers/QueryProvider'
import { SidebarProvider } from './components/Sidebar/SidebarContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryProvider>
        <ThemeProvider>
          <SidebarProvider>
            <RouterProvider />
          </SidebarProvider>
        </ThemeProvider>
      </QueryProvider>
    </Provider>
  </StrictMode>,
)
