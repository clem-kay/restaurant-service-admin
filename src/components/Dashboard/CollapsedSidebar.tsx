import { SheetContent } from "../ui/sheet";
import {Link} from "react-router-dom";
import {Home, LineChart, Package, Package2, ShoppingCart, Users} from "lucide-react";
import {Badge} from "@/components/ui/badge.tsx";

const CollapsedSidebar = () => {
    return (
        <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
                <Link
                    to="#"
                    className="flex items-center gap-2 text-lg font-semibold"
                >
                    <Package2 className="h-6 w-6"/>
                    <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                    to="#"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                    <Home className="h-5 w-5"/>
                    Dashboard
                </Link>
                <Link
                    to="#"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                >
                    <ShoppingCart className="h-5 w-5"/>
                    Orders
                    <Badge
                        className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                        6
                    </Badge>
                </Link>
                <Link
                    to="#"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                    <Package className="h-5 w-5"/>
                    Products
                </Link>
                <Link
                    to="#"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                    <Users className="h-5 w-5"/>
                    Customers
                </Link>
                <Link
                    to="#"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                    <LineChart className="h-5 w-5"/>
                    Analytics
                </Link>
            </nav>
        </SheetContent>
    );
};

export default CollapsedSidebar;