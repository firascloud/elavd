"use client";

import React, { useState } from 'react';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import {
    Home,
    Users,
    Package,
    LayoutGrid,
    ShoppingCart,
    Tag,
    Ticket,
    Settings,
    ChevronRight,
    LogOut,
    Loader2,
    X,
    ArrowLeft,
    ArrowRight,
    Layers,
    Award,
    Mail
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import logo from '@/assets/logo.svg';
import useAppStore from '@/store/store';
import { useEffect } from 'react';


const nav = [
    { href: '/admin', label: { en: 'Dashboard', ar: 'لوحة التحكم' }, icon: Home },
    { href: '/admin/users', label: { en: 'Users', ar: 'المستخدمون' }, icon: Users },
    { href: '/admin/products', label: { en: 'Products', ar: 'المنتجات' }, icon: Package },
    { href: '/admin/categories', label: { en: 'Categories', ar: 'التصنيفات' }, icon: LayoutGrid },
    { href: '/admin/sub-categories', label: { en: 'Sub-categories', ar: 'التصنيفات الفرعية' }, icon: Layers },
    { href: '/admin/brands', label: { en: 'Brands', ar: 'العلامات التجارية' }, icon: Award },
    { href: '/admin/orders', label: { en: 'Orders', ar: 'الطلبات' }, icon: ShoppingCart },
    { href: '/admin/offers', label: { en: 'Offers', ar: 'العروض' }, icon: Tag },
    { href: '/admin/contacts', label: { en: 'Contacts', ar: 'الرسائل' }, icon: Mail },
];

export default function Sidebar() {
    const locale = useLocale();
    const { signOut } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const isAr = locale === 'ar';
    const logoutStore = useAppStore((state) => state.logout);
    const { isSidebarOpen, setSidebarOpen, toggleSidebar } = useAppStore();
    const t = useTranslations("common");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setSidebarOpen]);

    const handleLogout = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            await signOut();
            logoutStore();
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[45] lg:hidden transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside className={cn(
                "fixed lg:sticky top-0 h-screen bg-background border-e border-primary/5 flex flex-col transition-all duration-500 z-[50]",
                isSidebarOpen ? "w-72 translate-x-0" : "w-0 -translate-x-full lg:w-0 lg:translate-x-0 opacity-0 overflow-hidden",
                isAr && !isSidebarOpen ? "translate-x-full" : ""
            )}>
                <div className="p-8 flex items-center justify-between gap-3">
                    <Image src={logo} alt="Logo" width={170} height={40} className="w-auto h-10 object-contain" />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar pt-2">
                    {nav.map((n) => {
                        const isActive = pathname === n.href || pathname === `/${locale}${n.href}`;
                        const Icon = n.icon;

                        return (
                            <Link
                                key={n.href}
                                href={n.href}
                                onClick={() => {
                                    if (window.innerWidth < 1024) setSidebarOpen(false);
                                }}
                                className={cn(
                                    'flex items-center justify-between group rounded-2xl px-5 py-3.5 text-sm font-bold transition-all duration-300 relative overflow-hidden',
                                    isActive
                                        ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/25'
                                        : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
                                )}
                            >
                                <div className="flex items-center gap-3 relative z-10">
                                    <Icon className={cn(
                                        "h-5 w-5 transition-all duration-300 group-hover:scale-110",
                                        isActive ? "text-white" : "text-secondary group-hover:font-bold"
                                    )} />
                                    <span>{n.label[isAr ? 'ar' : 'en']}</span>
                                </div>

                                {isActive && (
                                    <div className="absolute inset-y-0 ltr:right-0 rtl:left-0 w-1 bg-secondary rounded-full my-3" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 mt-auto">
                    <Button variant="link" asChild className="w-full h-12 mb-5 flex items-center gap-2 text-sm font-medium border-2 border-secondary rounded-2xl text-foreground hover:bg-secondary/5 transition-all duration-300">
                        <Link href="/">
                            <p>back to website</p>
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </Button>
                    <Button
                        onClick={handleLogout}
                        disabled={isLoading}
                        variant="outline"
                        className="w-full h-12 hover:bg-destructive hover:text-destructive-foreground bg-destructive/10 border-none text-destructive rounded-2xl font-bold transition-all duration-300 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 me-3 animate-spin" />
                        ) : (
                            <LogOut className="h-5 w-5 me-3" />
                        )}
                        {t("Logout")}
                    </Button>
                </div>
            </aside>
        </>
    );
}
