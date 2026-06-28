import { SheetContent } from "../ui/sheet";
import { NavLink } from "react-router-dom";
import { Home, Package, Package2, ShoppingCart, Users, Truck, Store } from "lucide-react";

const navItems = [
    { to: "/admin/dashboard",   label: "Dashboard",   Icon: Home },
    { to: "/admin/orders",      label: "Orders",      Icon: ShoppingCart },
    { to: "/admin/inventory",   label: "Inventory",   Icon: Package },
    { to: "/admin/customers",   label: "Customers",   Icon: Users },
    { to: "/admin/riders",      label: "Riders",      Icon: Truck },
    { to: "/admin/restaurants", label: "Restaurants", Icon: Store },
];

const CollapsedSidebar = () => {
    return (
        <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
                <NavLink
                    to="/admin/dashboard"
                    className="flex items-center gap-2 text-lg font-semibold mb-2"
                >
                    <Package2 className="h-6 w-6" />
                    <span>Admin</span>
                </NavLink>
                {navItems.map(({ to, label, Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 transition-all ${
                                isActive
                                    ? "bg-muted text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            }`
                        }
                    >
                        <Icon className="h-5 w-5" />
                        {label}
                    </NavLink>
                ))}
            </nav>
        </SheetContent>
    );
};

export default CollapsedSidebar;
