import { Outlet } from "react-router-dom";
import { ModeToggle } from "@/components/Theme/mode-toggle.tsx";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import SidePanel from "@/components/Dashboard/SidePanel.tsx";
import SearchBar from "@/components/Dashboard/SearchBar.tsx";
import AccountAvatar from "@/components/Dashboard/AccountAvatar.tsx";
import CollapsedSidebar from "@/components/Dashboard/CollapsedSidebar.tsx";

const AdminPage = () => {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
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
                    <SearchBar />
                    <ModeToggle className="ml-auto" />
                    <AccountAvatar />
                </header>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminPage;
