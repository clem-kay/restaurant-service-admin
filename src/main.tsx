import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {RouterProvider} from "react-router-dom";
import router from "@/routes/routes.tsx";
import {ThemeProvider} from './components/theme-provider';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {Toaster} from "react-hot-toast";

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
                <RouterProvider router={router}/>
                </ThemeProvider>
                <ReactQueryDevtools initialIsOpen={false}/>
            </QueryClientProvider>
    </React.StrictMode>,
)
