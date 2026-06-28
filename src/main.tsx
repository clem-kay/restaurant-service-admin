import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from "react-router-dom";
import router from "@/routes/routes.tsx";
import { ThemeProvider } from './components/Theme/theme-provider.tsx';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "@/components/ErrorBoundary.tsx";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 30_000,   // data considered fresh for 30 seconds
            gcTime: 5 * 60_000,  // keep in cache for 5 minutes
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                    <Toaster
                        position="top-right"
                        reverseOrder={false}
                        toastOptions={{
                            style: {
                                paddingInline: 30,
                                paddingBlock: 20,
                                zIndex: 1000000000,
                            },
                        }}
                    />
                    <RouterProvider router={router} />
                </ThemeProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ErrorBoundary>
    </React.StrictMode>,
);
