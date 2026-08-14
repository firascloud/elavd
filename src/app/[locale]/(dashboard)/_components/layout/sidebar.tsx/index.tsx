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
import logo from '@/assets/logo.webp';
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
    const { isSidebarOpen, setSidebarOpen } = useAppStore();
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
                    className="fixed inset-0 z-[45] bg-black/35 backdrop-blur-[2px] lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            <aside className={cn(
                "fixed lg:sticky start-0 top-0 z-[50] flex h-dvh flex-col overflow-hidden border-e border-border/70 bg-background/95 shadow-2xl backdrop-blur-xl transition-[width,transform,opacity] duration-300 ease-out lg:bg-background lg:shadow-none",
                isSidebarOpen
                    ? "w-[min(86vw,280px)] translate-x-0 opacity-100 lg:w-[280px]"
                    : "pointer-events-none w-[min(86vw,280px)] opacity-0 ltr:-translate-x-full rtl:translate-x-full lg:w-0 lg:translate-x-0"
            )}>
                <div className="flex h-20 shrink-0 items-center justify-between gap-3 border-b border-border/60 px-5">
                    <Link href="/admin" aria-label={isAr ? 'لوحة التحكم' : 'Dashboard'}>
                        <Image
                            src={logo}
                            alt="Elavd"
                            width={155}
                            height={36}
                            priority
                            className="h-9 w-auto object-contain"
                        />
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl border border-border/70 bg-muted/40 text-muted-foreground hover:bg-primary/10 hover:text-primary lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                        aria-label={isAr ? 'إغلاق القائمة' : 'Close menu'}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <nav className="custom-scrollbar flex-1 min-h-0 space-y-1 overflow-y-auto px-3 py-4" aria-label={isAr ? 'التنقل في لوحة التحكم' : 'Dashboard navigation'}>
                    {nav.map((n) => {
                        const localizedHref = `/${locale}${n.href}`;
                        const isDashboardHome = n.href === '/admin';
                        const isActive = isDashboardHome
                            ? pathname === n.href || pathname === localizedHref
                            : pathname === n.href || pathname.startsWith(`${n.href}/`) || pathname === localizedHref || pathname.startsWith(`${localizedHref}/`);
                        const Icon = n.icon;

                        return (
                            <Link
                                key={n.href}
                                href={n.href}
                                onClick={() => {
                                    if (window.innerWidth < 1024) setSidebarOpen(false);
                                }}
                                aria-current={isActive ? 'page' : undefined}
                                className={cn(
                                    'group relative flex min-h-11 items-center rounded-xl px-3 py-2 text-[13px] font-bold transition-all duration-200',
                                    isActive
                                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                        : 'text-foreground/75 hover:bg-muted/70 hover:text-foreground'
                                )}
                            >
                                {isActive && (
                                    <span className="absolute inset-y-2 start-0 w-1 rounded-e-full bg-secondary" />
                                )}

                                <div className="relative z-10 flex min-w-0 items-center gap-3">
                                    <span className={cn(
                                        "grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors duration-200",
                                        isActive
                                            ? "bg-white/15 text-white"
                                            : "bg-secondary/10 text-secondary group-hover:bg-secondary/15"
                                    )}>
                                    <Icon className={cn(
                                            "h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-105"
                                    )} />
                                    </span>
                                    <span className="truncate">{n.label[isAr ? 'ar' : 'en']}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto shrink-0 space-y-2 border-t border-border/60 bg-muted/20 p-3">
                    <Button
                        variant="outline"
                        asChild
                        className="h-10 w-full rounded-xl border-border/80 bg-background text-xs font-bold text-foreground/75 shadow-none hover:border-secondary/40 hover:bg-secondary/5 hover:text-secondary"
                    >
                        <Link href="/">
                            {isAr ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                            <span>{isAr ? 'العودة إلى الموقع' : 'Back to website'}</span>
                        </Link>
                    </Button>
                    <Button
                        onClick={handleLogout}
                        disabled={isLoading}
                        variant="outline"
                        className="h-10 w-full rounded-xl border-transparent bg-destructive/10 text-xs font-bold text-destructive shadow-none hover:border-destructive/20 hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <LogOut className="h-4 w-4" />
                        )}
                        {t("Logout")}
                    </Button>
                </div>
            </aside>
        </>
    );
}
