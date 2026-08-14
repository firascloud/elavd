"use client";

import React, { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
    ArrowUpRight,
    Calendar,
    Layers,
    LayoutDashboard,
    Package,
    RefreshCw,
    SaudiRiyal,
    ShoppingCart,
    Tag,
    User as UserIcon,
    Users,
} from 'lucide-react';
import { DashboardCard, StatsCard } from '@/app/[locale]/(dashboard)/_components/common/Card';
import { DashboardTable, DashboardTableCell, DashboardTableRow } from '@/app/[locale]/(dashboard)/_components/common/Table';
import { Price } from '@/app/[locale]/(dashboard)/_components/common/Price';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { supabaseBrowser } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

export default function AdminDashboardPage() {
    const t = useTranslations('dashboard');
    const locale = useLocale();
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        users: 0,
        revenue: 0,
        activeOffers: 0,
        subCategories: 0,
    });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const [
                { count: productsCount },
                { count: ordersCount },
                { count: usersCount },
                { count: offersCount },
                { count: subCategoriesCount },
            ] = await Promise.all([
                supabaseBrowser.from('products').select('*', { count: 'exact', head: true }),
                supabaseBrowser.from('orders').select('*', { count: 'exact', head: true }),
                supabaseBrowser.from('profiles').select('*', { count: 'exact', head: true }),
                supabaseBrowser.from('offers').select('*', { count: 'exact', head: true }).eq('is_active', true),
                supabaseBrowser.from('sub_categories').select('*', { count: 'exact', head: true }),
            ]);

            const { data: revenueAgg } = await supabaseBrowser
                .from('orders')
                .select('total_amount, status')
                .order('created_at', { ascending: false })
                .limit(100);

            const revenue = (revenueAgg || []).reduce(
                (sum: number, order: any) => sum + (order.total_amount || 0),
                0,
            );

            const { data: latest } = await supabaseBrowser
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(6);

            setStats({
                products: productsCount || 0,
                orders: ordersCount || 0,
                users: usersCount || 0,
                revenue,
                activeOffers: offersCount || 0,
                subCategories: subCategoriesCount || 0,
            });
            setRecentOrders(latest || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
            case 'processing': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
            case 'shipped': return 'bg-violet-500/10 text-violet-600 border-violet-500/20';
            case 'delivered': return 'bg-secondary/10 text-secondary border-secondary/20';
            case 'canceled': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
            default: return 'bg-muted/50 text-muted-foreground border-border/60';
        }
    };

    const quickLinks = [
        { href: '/admin/orders', icon: ShoppingCart, label: t('Orders'), value: stats.orders, color: 'bg-amber-500/10 text-amber-600' },
        { href: '/admin/products', icon: Package, label: t('Products'), value: stats.products, color: 'bg-blue-500/10 text-blue-600' },
        { href: '/admin/sub-categories', icon: Layers, label: t('SubCategories'), value: stats.subCategories, color: 'bg-violet-500/10 text-violet-600' },
        { href: '/admin/offers', icon: Tag, label: t('Offers'), value: stats.activeOffers, color: 'bg-secondary/10 text-secondary' },
    ];

    return (
        <div className="mx-auto w-full max-w-[1600px] space-y-6 pb-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <section className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/[0.08] via-background to-secondary/[0.08] px-5 py-5 shadow-sm sm:px-7 sm:py-6">
                <div className="pointer-events-none absolute -end-16 -top-20 h-52 w-52 rounded-full bg-primary/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 start-1/3 h-44 w-44 rounded-full bg-secondary/10 blur-3xl" />

                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/70 px-3 py-1 text-[11px] font-bold text-primary shadow-sm backdrop-blur">
                            <LayoutDashboard className="h-3.5 w-3.5" />
                            {t('Overview')}
                        </div>
                        <h1 className="text-2xl font-black leading-tight text-foreground sm:text-3xl">
                            {t('WelcomeBack')}, {t('Admin')}
                        </h1>
                        <p className="mt-2 max-w-2xl text-xs font-medium leading-relaxed text-muted-foreground sm:text-sm">
                            {t('DashboardSubtitle')}
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        onClick={load}
                        disabled={loading}
                        className="h-10 w-full shrink-0 rounded-xl border-border/70 bg-background/80 px-4 text-xs font-bold shadow-sm backdrop-blur hover:border-primary/25 hover:bg-background sm:w-auto"
                    >
                        <RefreshCw className={cn('h-4 w-4 text-primary', loading && 'animate-spin')} />
                        {t('Refresh')}
                    </Button>
                </div>
            </section>

            <section
                aria-label={t('TotalStatistics')}
                className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-5"
            >
                <StatsCard title={t('TotalProducts')} value={loading ? '—' : stats.products} icon={Package} tone="blue" />
                <StatsCard title={t('TotalOrders')} value={loading ? '—' : stats.orders} icon={ShoppingCart} tone="amber" />
                <StatsCard title={t('TotalUsers')} value={loading ? '—' : stats.users} icon={Users} tone="secondary" />
                <StatsCard
                    title={t('RecentRevenue')}
                    value={loading ? '—' : <Price amount={stats.revenue} iconClassName="h-6 w-6" />}
                    icon={SaudiRiyal}
                    tone="primary"
                />
                <StatsCard title={t('SubCategories')} value={loading ? '—' : stats.subCategories} icon={Layers} tone="violet" />
            </section>

            <section className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(280px,0.7fr)]">
                <DashboardCard
                    title={t('RecentOrders')}
                    subtitle={t('LatestFiveOrders')}
                    contentClassName="p-0"
                    action={
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-8 rounded-lg px-2.5 text-[11px] font-bold text-primary hover:bg-primary/10 hover:text-primary"
                        >
                            <Link href="/admin/orders">
                                {t('Orders')}
                                <ArrowUpRight className="h-3.5 w-3.5 rtl:-rotate-90" />
                            </Link>
                        </Button>
                    }
                >
                    <DashboardTable
                        headers={[t('OrderID'), t('Customer'), t('Status'), t('Total'), t('CreatedAt')]}
                        className="rounded-none border-0 shadow-none"
                        isLoading={loading}
                        emptyMessage={t('NoOrdersFound')}
                        loadingMessage={t('Loading')}
                    >
                        {recentOrders.map((order) => {
                            const status = order.status || 'pending';

                            return (
                                <DashboardTableRow key={order.id} className="group h-16 cursor-pointer">
                                    <DashboardTableCell>
                                        <span className="rounded-lg border border-border/50 bg-muted/50 px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-muted-foreground transition-colors group-hover:bg-primary/5">
                                            #{order.id?.slice(0, 8)}
                                        </span>
                                    </DashboardTableCell>
                                    <DashboardTableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-primary/15 bg-primary/10 text-primary">
                                                <UserIcon className="h-4 w-4" />
                                            </div>
                                            <div className="flex min-w-0 flex-col">
                                                <span className="truncate text-xs font-bold ltr:tracking-tight">
                                                    {t('CustomerHash')}{order.user_id?.slice(0, 4) || '—'}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground">{t('PremiumUser')}</span>
                                            </div>
                                        </div>
                                    </DashboardTableCell>
                                    <DashboardTableCell>
                                        <span className={cn(
                                            'rounded-full border px-2.5 py-1 text-[10px] font-black uppercase ltr:tracking-tighter',
                                            getStatusStyle(status),
                                        )}>
                                            {t(status.charAt(0).toUpperCase() + status.slice(1))}
                                        </span>
                                    </DashboardTableCell>
                                    <DashboardTableCell>
                                        <span className="font-mono text-xs font-black ltr:tracking-tighter">
                                            <Price amount={order.total_amount || 0} />
                                        </span>
                                    </DashboardTableCell>
                                    <DashboardTableCell>
                                        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                                            <Calendar className="h-3.5 w-3.5 opacity-40" />
                                            {order.created_at ? new Date(order.created_at).toLocaleDateString(locale) : '—'}
                                        </span>
                                    </DashboardTableCell>
                                </DashboardTableRow>
                            );
                        })}
                    </DashboardTable>
                </DashboardCard>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-1">
                    <DashboardCard title={t('QuickActivity')} contentClassName="space-y-2 p-3 sm:p-3">
                        {quickLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="group flex items-center justify-between gap-3 rounded-xl border border-transparent p-2.5 transition-colors hover:border-border/60 hover:bg-muted/50"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl', item.color)}>
                                        <item.icon className="h-[18px] w-[18px]" />
                                    </div>
                                    <span className="truncate text-xs font-bold text-foreground/80 group-hover:text-foreground">
                                        {item.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-black text-foreground">{loading ? '—' : item.value}</span>
                                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary rtl:-rotate-90" />
                                </div>
                            </Link>
                        ))}
                    </DashboardCard>

                    <Link
                        href="/admin/offers"
                        className="group relative min-h-48 overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/85 p-5 text-primary-foreground shadow-lg shadow-primary/15 transition-transform duration-200 hover:-translate-y-0.5"
                    >
                        <div className="absolute -end-8 -top-8 h-32 w-32 rounded-full border-[22px] border-white/5 transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute bottom-0 end-0 p-5 opacity-10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                            <Tag className="h-20 w-20" />
                        </div>
                        <div className="relative z-10 flex h-full flex-col">
                            <div className="mb-5 flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-black">{t('ActiveOffers')}</h3>
                                    <p className="mt-1 line-clamp-2 text-[11px] font-medium leading-relaxed text-primary-foreground/70">
                                        {t('OffersDescription')}
                                    </p>
                                </div>
                                <ArrowUpRight className="h-5 w-5 shrink-0 opacity-70 rtl:-rotate-90" />
                            </div>
                            <div className="mt-auto text-4xl font-black">{loading ? '—' : stats.activeOffers}</div>
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
}
