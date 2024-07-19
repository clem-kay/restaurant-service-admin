import { Link } from 'react-router-dom';
import { Home, LineChart, Package, Package2, ShoppingCart, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SheetContent } from '@/components/ui/sheet';
import useOrderStore from '@/store/useOrderStore';

const CollapsedSidebar = () => {
    const orders = useOrderStore(s => s.orders);

    const links = [
        { to: "", icon: Home, label: "Dashboard" },
        { to: "orders", icon: ShoppingCart, label: "Orders", badge: orders.length || 0 },
        { to: "categories", icon: Package, label: "Categories" },
        { to: "#", icon: Users, label: "Customers" },
        { to: "#", icon: LineChart, label: "Analytics" },
    ];

    return (
        <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
                <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-2 text-lg font-semibold"
                >
                    <Package2 className="h-6 w-6" />
                    <span className="sr-only">Acme Inc</span>
                </Link>
                {links.map((link, index) => {
                    const Icon = link.icon;
                    return (
                        <Link
                            key={index}
                            to={link.to}
                            className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground ${link.badge ? 'bg-muted text-foreground' : ''}`}
                        >
                            <Icon className="h-5 w-5" />
                            {link.label}
                            {link.badge && (
                                <Badge
                                    className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                                >
                                    {link.badge}
                                </Badge>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </SheetContent>
    );
};

export default CollapsedSidebar;
