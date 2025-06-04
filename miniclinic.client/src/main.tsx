import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
                <App />
                <Toaster
                    toastOptions={{
                        unstyled: false,
                        classNames: {
                            toast: 'group flex items-center gap-1 px-4 py-3 rounded-lg shadow-lg border border-border transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=closed]:slide-out-to-right-full',
                            error: 'bg-red-50 text-red-800 border-red-200',
                            success: 'bg-green-50 text-green-800 border-green-200',
                            warning: 'bg-amber-50 text-amber-800 border-amber-200',
                            info: 'bg-blue-50 text-blue-800 border-blue-200',
                            title: 'font-medium text-sm',
                            description: 'text-sm text-black',
                            actionButton: 'bg-primary text-primary-foreground hover:bg-primary/90 text-xs px-2 py-1 rounded-md',
                            cancelButton: 'bg-muted text-muted-foreground hover:bg-muted/90 text-xs px-2 py-1 rounded-md',
                            closeButton:
                                'absolute top-2 right-2 p-1 rounded-md text-foreground/50 opacity-0 group-hover:opacity-100 hover:text-foreground transition-opacity',
                        },
                        closeButton: true,
                    }}
                    position="top-right"
                    richColors
                />
      </BrowserRouter>
      {/* Add React Query Devtools in development mode */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>,
)
