import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNotifications } from "@/hooks/notifications/useNotifications";
import { cn } from "@/lib/utils";

const NotificationBell = () => {
    const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="relative shrink-0">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <span className="font-semibold text-sm">Notifications</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs gap-1"
                            onClick={() => markAllRead()}
                        >
                            <CheckCheck className="h-3.5 w-3.5" />
                            Mark all read
                        </Button>
                    )}
                </div>
                <div className="h-[360px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
                            No notifications yet
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={cn(
                                        "px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors",
                                        !n.isRead && "bg-blue-50 dark:bg-blue-950/20"
                                    )}
                                    onClick={() => !n.isRead && markRead(n.id)}
                                >
                                    <div className="flex items-start gap-2">
                                        {!n.isRead && (
                                            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                                        )}
                                        <div className={cn("flex-1", n.isRead && "pl-4")}>
                                            <p className="text-sm font-medium leading-tight">{n.title}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{n.body}</p>
                                            <p className="text-[10px] text-muted-foreground mt-1">
                                                {new Date(n.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationBell;
