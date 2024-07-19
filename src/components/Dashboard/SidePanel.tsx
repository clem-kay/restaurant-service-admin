import {ForwardRefExoticComponent, RefAttributes, useState} from 'react';
import {NavLink, useLocation} from "react-router-dom";
import {Bell, Home, LineChart, LucideProps, Package, Package2, ShoppingCart, Users} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import useOrderStore from "@/store/useOrderStore.tsx";


const SidePanel = () => {
    const location = useLocation();
    const [selectedNavLink, setSelectedLink] = useState(location.pathname);
    const [shouldSetDefault, setShouldSetDefault] = useState<boolean>(true)
    const orders = useOrderStore(s => s.orders);

    const links = [
        {to: "", icon: Home, label: "Dashboard"},
        {to: "orders", icon: ShoppingCart, label: "Orders", badge: orders.filter(o => o.food_status === "PENDING").length || 0},
        {to: "categories", icon: Package, label: "Categories"},
        {to: "#", icon: Users, label: "Customers"},
        {to: "#", icon: LineChart, label: "Analytics"},
    ];
    const handleNavLinkClick = (link: {
        to: string;
        icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
        label: string;
        badge?: undefined;
    } | {
        to: string;
        icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
        label: string;
        badge: number;
    }) => {
        setShouldSetDefault(false)
        setSelectedLink(link.to);
    };

    return (
        <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <NavLink to="/admin/dashboard" className="flex items-center gap-2 font-semibold">
                    <Package2 className="h-6 w-6"/>
                    <span>Admin</span>
                </NavLink>
                <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                    <Bell className="h-4 w-4"/>
                    <span className="sr-only">Toggle notifications</span>
                </Button>
            </div>
            <div className="flex-1">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                    {links.map((link, index) => {
                        const Icon = link.icon;
                        const isActive = selectedNavLink === link.to;
                        return (
                            <NavLink
                                key={index}
                                to={link.to}
                                onClick={() => handleNavLinkClick(link)}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${shouldSetDefault &&
                                link.label === 'Dashboard' ? 'text-primary' : ''} transition-all ${isActive ? 'text-primary' : 'text-muted-foreground'} hover:text-primary`}
                            >
                                <Icon className="h-4 w-4"/>
                                {link.label} {" "}
                                {link.badge && (
                                    <Badge
                                        className="ml-auto flex h-6 w-6 shrink-0 i transition-all tems-center justify-center rounded-full">
                                        {link.badge}
                                    </Badge>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};

export default SidePanel;