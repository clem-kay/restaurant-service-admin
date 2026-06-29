import { Outlet } from "react-router-dom";
import { ModeToggle } from "@/components/Theme/mode-toggle.tsx";
import { Menu, Store, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import SidePanel from "@/components/Dashboard/SidePanel.tsx";
import SearchBar from "@/components/Dashboard/SearchBar.tsx";
import AccountAvatar from "@/components/Dashboard/AccountAvatar.tsx";
import CollapsedSidebar from "@/components/Dashboard/CollapsedSidebar.tsx";
import NotificationBell from "@/components/Dashboard/NotificationBell.tsx";
import useAuthStore from "@/store/useAuthStore.ts";
import useRestaurantStore from "@/store/useRestaurantStore";

const AdminPage = () => {
    const role = useAuthStore((s) => s.user?.role);
    const { selectedRestaurant, clearSelectedRestaurant } = useRestaurantStore();
    const showBanner = role === 'PLATFORM_ADMIN' && !!selectedRestaurant;

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[240px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <SidePanel />
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <CollapsedSidebar />
                    </Sheet>
                    <div className="flex-1 hidden md:flex">
                        <SearchBar />
                    </div>
                    <ModeToggle className="ml-auto" />
                    <NotificationBell />
                    <AccountAvatar />
                </header>

                {showBanner && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border-b text-sm font-medium">
                        <Store className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-primary">
                            Viewing: <strong>{selectedRestaurant.name}</strong>
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="ml-auto h-6 w-6 text-muted-foreground hover:text-foreground"
                            onClick={clearSelectedRestaurant}
                        >
                            <X className="h-3.5 w-3.5" />
                            <span className="sr-only">Back to overview</span>
                        </Button>
                    </div>
                )}

                <main className="flex-1 p-4 md:p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminPage;
