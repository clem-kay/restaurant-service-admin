import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {RouterProvider} from "react-router-dom";
import router from "@/routes/routes.tsx";
import {ThemeProvider} from './components/Theme/theme-provider.tsx';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {Toaster} from "react-hot-toast";
import { ClerkProvider } from '@clerk/clerk-react';

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key");
}
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <Toaster position="top-right"
                         reverseOrder={false}
                         toastOptions={{
                             style: {
                                 paddingInline: 30,
                                 paddingBlock: 20,
                                 zIndex: 1000000000
                             }
                         }}
                />
                <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
                <RouterProvider router={router}/>
                </ClerkProvider>
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    </React.StrictMode>,
)
