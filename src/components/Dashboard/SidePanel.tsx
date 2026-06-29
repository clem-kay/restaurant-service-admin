import { NavLink } from "react-router-dom";
import { Bell, Home, Package, Package2, ShoppingCart, Users, Truck, Store, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import useAuthStore from "@/store/useAuthStore.ts";

const navItems = [
    { to: "/admin/dashboard",   label: "Dashboard",   Icon: Home,         roles: null },
    { to: "/admin/orders",      label: "Orders",       Icon: ShoppingCart, roles: null },
    { to: "/admin/inventory",   label: "Inventory",    Icon: Package,      roles: null },
    { to: "/admin/customers",   label: "Customers",    Icon: Users,        roles: ['PLATFORM_ADMIN', 'RESTAURANT_ADMIN', 'RESTAURANT_STAFF'] },
    { to: "/admin/riders",      label: "Riders",       Icon: Truck,        roles: ['PLATFORM_ADMIN', 'RESTAURANT_ADMIN'] },
    { to: "/admin/users",       label: "Team",         Icon: UserCog,      roles: ['RESTAURANT_ADMIN', 'RESTAURANT_STAFF'] },
    { to: "/admin/restaurants", label: "Restaurants",  Icon: Store,        roles: ['PLATFORM_ADMIN'] },
];

const SidePanel = () => {
    const role = useAuthStore((state) => state.user?.role);
    const visibleItems = navItems.filter(item => !item.roles || item.roles.includes(role as string));

    return (
        <div className="flex flex-col h-screen sticky top-0 bg-background border-r border-muted/80">
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
                    {visibleItems.map(({ to, label, Icon }) => (
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
