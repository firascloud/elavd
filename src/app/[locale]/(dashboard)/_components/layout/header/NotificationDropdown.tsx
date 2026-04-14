"use client";

import React, { useEffect, useState } from 'react';
import { 
    Bell, 
    MessageSquare, 
    Clock, 
    Check, 
    ExternalLink,
    User
} from 'lucide-react';
import { 
    Popover, 
    PopoverContent, 
    PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLocale } from "next-intl";
import { getContacts, updateContactStatus } from "@/services/contactService";
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import Link from 'next/link';
import { cn } from "@/lib/utils";

export default function NotificationDropdown() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const locale = useLocale();
    const isAr = locale === "ar";

    const fetchNewContacts = async () => {
        setLoading(true);
        try {
            const { data } = await getContacts({
                status: 'new',
                page: 1,
                pageSize: 10
            });
            setNotifications(data || []);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNewContacts();
        
        // Refresh every minute to keep times current and check for new ones
        const interval = setInterval(fetchNewContacts, 60000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await updateContactStatus(id, 'read');
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const unreadCount = notifications.length;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                        "text-muted-foreground hover:text-primary relative h-8 w-8 sm:h-9 sm:w-9 transition-all duration-300 rounded-xl",
                        unreadCount > 0 ? "bg-primary/5 text-primary" : "hover:bg-primary/5"
                    )}
                >
                    <Bell className={cn("h-4 w-4 sm:h-5 sm:w-5", unreadCount > 0 && "animate-[bell-shake_2s_infinite]")} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary border-2 border-background"></span>
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent 
                align="end" 
                className="w-[90vw] max-w-[380px] p-0 border-primary/10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden rounded-[2rem] bg-background/95 backdrop-blur-xl"
                sideOffset={12}
            >
                <div className="flex items-center justify-between p-5 bg-gradient-to-br from-primary/[0.03] to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                            <Bell className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="font-black text-sm tracking-tight text-foreground uppercase">
                                {isAr ? "التنبيهات" : "Notifications"}
                            </h4>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.1em]">
                                {unreadCount > 0 
                                    ? (isAr ? `لديك ${unreadCount} رسائل جديدة` : `You have ${unreadCount} new inquiries`)
                                    : (isAr ? "لا توجد رسائل جديدة" : "All caught up")
                                }
                            </p>
                        </div>
                    </div>
                </div>
                
                <Separator className="bg-primary/5" />
                
                <div className="max-h-[380px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/10">
                    {notifications.length > 0 ? (
                        <div className="p-2 space-y-1">
                            {notifications.map((notif) => (
                                <div 
                                    key={notif.id} 
                                    className="p-4 rounded-2xl hover:bg-primary/[0.03] transition-all duration-300 group relative border border-transparent hover:border-primary/10"
                                >
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 shrink-0 rounded-xl bg-muted/50 flex items-center justify-center border border-border/50 group-hover:scale-110 transition-transform">
                                            <User className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div className="flex flex-col min-w-0 flex-1">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-xs font-black text-foreground truncate pr-2">
                                                    {notif.name}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1.5 shrink-0 bg-muted/30 px-2 py-0.5 rounded-full">
                                                    <Clock className="h-3 w-3 opacity-60" />
                                                    {formatDistanceToNow(new Date(notif.created_at), { 
                                                        addSuffix: true,
                                                        locale: isAr ? ar : enUS
                                                    })}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground/80 line-clamp-2 leading-relaxed mb-4">
                                                "{notif.message}"
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="h-8 px-3 text-[10px] font-black rounded-xl border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 uppercase tracking-widest gap-2 bg-primary/5"
                                                    asChild
                                                >
                                                    <Link href={`/${locale}/admin/contacts`}>
                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                        {isAr ? "عرض" : "View"}
                                                    </Link>
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    onClick={() => markAsRead(notif.id)}
                                                    className="h-8 px-3 text-[10px] font-black rounded-xl hover:bg-green-500/10 hover:text-green-600 transition-all duration-300 uppercase tracking-widest gap-2"
                                                >
                                                    <Check className="h-3.5 w-3.5" />
                                                    {isAr ? "تحديد كمقروء" : "Done"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary group-hover:h-8 transition-all duration-500 rounded-full" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="relative mb-6">
                                <div className="h-16 w-16 bg-primary/5 rounded-[2rem] flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform">
                                    <MessageSquare className="h-8 w-8 text-primary/20" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-background rounded-full flex items-center justify-center border border-primary/10 shadow-sm">
                                    <Check className="h-3 w-3 text-primary" />
                                </div>
                            </div>
                            <h5 className="text-sm font-black text-foreground uppercase tracking-tight mb-1">
                                {isAr ? "لا توجد رسائل جديدة" : "Perfectly Clean!"}
                            </h5>
                            <p className="text-[11px] text-muted-foreground font-medium max-w-[180px] leading-relaxed">
                                {isAr ? "لقد رددت على جميع الاستفسارات الواردة مؤخراً" : "You've handled all recent customer inquiries."}
                            </p>
                        </div>
                    )}
                </div>
                
                <Separator className="bg-primary/5" />
                <div className="p-4">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-[11px] font-black uppercase tracking-[0.2em] h-12 rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all duration-500 border border-primary/10 hover:border-primary shadow-sm group"
                        asChild
                    >
                        <Link href={`/${locale}/admin/contacts`} className="flex items-center justify-center gap-2">
                            {isAr ? "عرض جميع الاستفسارات" : "Inquiry Management Center"}
                            <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>
                    </Button>
                </div>
            </PopoverContent>
            <style jsx global>{`
                @keyframes bell-shake {
                    0%, 100% { transform: rotate(0); }
                    10%, 30%, 50%, 70%, 90% { transform: rotate(10deg); }
                    20%, 40%, 60%, 80% { transform: rotate(-10deg); }
                }
            `}</style>
        </Popover>
    );
}
