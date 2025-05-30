import { BrowserRouter, HashRouter } from 'react-router'
import { ThemeProvider } from './contexts/ThemeContext'
import { Toaster } from "@/components/ui/sonner"
import Router from './Router'

const AppRouter = import.meta.env.VITE_USE_HASH_ROUTE === 'true' ? HashRouter : BrowserRouter

import posthog from 'posthog-js'

const posthogToken = import.meta.env.VITE_POSTHOG_TOKEN
if (!posthogToken) {
    console.warn('PostHog token is not set. Analytics will not be initialized.')
} else {
    posthog.init(posthogToken,
        {
            api_host: 'https://us.i.posthog.com',
            person_profiles: 'always' 
        }
)

export default function App() {
    return (
        <ThemeProvider>
            <AppRouter>
                <Toaster richColors closeButton />
                <Router />
            </AppRouter>
        </ThemeProvider>
    )
}
