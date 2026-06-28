import { NavLink } from "react-router-dom";
import { Bell, Home, Package, Package2, ShoppingCart, Users, Truck, Store } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", Icon: Home },
    { to: "/admin/orders",    label: "Orders",     Icon: ShoppingCart },
    { to: "/admin/inventory", label: "Inventory",  Icon: Package },
    { to: "/admin/customers", label: "Customers",  Icon: Users },
    { to: "/admin/riders",    label: "Riders",     Icon: Truck },
    { to: "/admin/restaurants", label: "Restaurants", Icon: Store },
];

const SidePanel = () => {
    return (
        <div className="fixed inset-y-0 left-0 flex flex-col w-72 h-full max-h-screen bg-background shadow-lg border-muted/80 border">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <NavLink to="/admin/dashboard" className="flex items-center gap-2 font-semibold">
                    <Package2 className="h-6 w-6" />
                    <span>Admin</span>
                </NavLink>
                <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                    <Bell className="h-4 w-4" />
                    <span className="sr-only">Toggle notifications</span>
                </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                    {navItems.map(({ to, label, Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                                    isActive ? "bg-muted text-primary" : "text-muted-foreground"
                                }`
                            }
                        >
                            <Icon className="h-4 w-4" />
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default SidePanel;
