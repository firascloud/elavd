"use client";

import React, { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { StatsCard, DashboardCard } from '@/app/[locale]/(dashboard)/_components/common/Card';
import { DashboardTable, DashboardTableRow, DashboardTableCell } from '@/app/[locale]/(dashboard)/_components/common/Table';
import { supabaseBrowser } from '@/lib/supabase/client';
import { DashboardHeader } from '@/app/[locale]/(dashboard)/_components/common/DashboardHeader';
import { Package, ShoppingCart, Users, SaudiRiyal, Calendar, User as UserIcon, RefreshCw, Tag, Layers } from 'lucide-react';
import { Price } from '@/app/[locale]/(dashboard)/_components/common/Price';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
    const t = useTranslations('dashboard');
    const locale = useLocale();
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        users: 0,
        revenue: 0,
        activeOffers: 0,
        subCategories: 0
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
                { count: subCategoriesCount }
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

            const revenue = (revenueAgg || []).reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);

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
                subCategories: subCategoriesCount || 0
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
            case 'shipped': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
            case 'delivered': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'canceled': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
            default: return 'bg-muted/30 text-muted-foreground border-transparent';
        }
    };

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header Section */}
            <DashboardHeader
                title={`${t('WelcomeBack')}, ${t('Admin')}`}
                description={t('DashboardSubtitle')}
                actions={
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={load}
                            className="h-12 w-12 rounded-2xl border-border/40 bg-background/40 hover:bg-background/60 transition-all duration-300 shadow-sm backdrop-blur-xl shrink-0"
                        >
                            <RefreshCw className={cn("h-5 w-5 text-muted-foreground", loading && "animate-spin")} />
                        </Button>
                    </div>
                }
            />

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatsCard
                    title={t('TotalProducts')}
                    value={loading ? '—' : stats.products}
                    icon={Package}
                    change="12%"
                    isIncrease={true}
                />
                <StatsCard
                    title={t('TotalOrders')}
                    value={loading ? '—' : stats.orders}
                    icon={ShoppingCart}
                    change="5.4%"
                    isIncrease={true}
                />
                <StatsCard
                    title={t('TotalUsers')}
                    value={loading ? '—' : stats.users}
                    icon={Users}
                    change="2.1%"
                    isIncrease={false}
                />
                <StatsCard
                    title={t('RecentRevenue')}
                    value={loading ? '—' : <Price amount={stats.revenue} iconClassName='w-7 h-7' />}
                    icon={SaudiRiyal}
                    change="24%"
                    isIncrease={true}
                />
                <StatsCard
                    title={t('SubCategories')}
                    value={loading ? '—' : stats.subCategories}
                    icon={Layers}
                    change="8.2%"
                    isIncrease={true}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders List */}
                <DashboardCard
                    title={t('RecentOrders')}
                    subtitle={t('LatestFiveOrders')}
                    className="lg:col-span-2"
                >
                    <DashboardTable headers={[
                        t('OrderID'),
                        t('Customer'),
                        t('Status'),
                        t('Total'),
                        t('CreatedAt')
                    ]}>
                        {recentOrders.map((order) => (
                            <DashboardTableRow key={order.id} className="group cursor-pointer">
                                <DashboardTableCell>
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground bg-foreground/[0.04] px-2.5 py-1 rounded-lg border border-border/40 group-hover:bg-primary/5 transition-colors">
                                        #{order.id?.slice(0, 8)}
                                    </span>
                                </DashboardTableCell>
                                <DashboardTableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
                                            <UserIcon className="h-4.5 w-4.5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm ltr:tracking-tight">{t('CustomerHash')}{order.user_id?.slice(0, 4)}</span>
                                            <span className="text-[10px] text-muted-foreground">{t('PremiumUser') || 'Premium User'}</span>
                                        </div>
                                    </div>
                                </DashboardTableCell>
                                <DashboardTableCell>
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ltr:tracking-tighter",
                                        getStatusStyle(order.status)
                                    )}>
                                        {t(order.status.charAt(0).toUpperCase() + order.status.slice(1))}
                                    </span>
                                </DashboardTableCell>
                                <DashboardTableCell>
                                    <span className="font-black font-mono text-sm ltr:tracking-tighter">
                                        <Price amount={order.total_amount || 0} />
                                    </span>
                                </DashboardTableCell>
                                <DashboardTableCell>
                                    <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5 opacity-40" />
                                        {order.created_at ? new Date(order.created_at).toLocaleDateString(locale) : '—'}
                                    </span>
                                </DashboardTableCell>
                            </DashboardTableRow>
                        ))}
                    </DashboardTable>
                </DashboardCard>

                {/* Dashboard Highlights */}
                <div className="space-y-6">
                    <DashboardCard title={t('QuickActivity') || 'Quick Activity'}>
                        <div className="space-y-5">
                            {[
                                { icon: ShoppingCart, label: t('TotalOrders'), val: stats.orders, color: 'text-amber-500 bg-amber-500/10' },
                                { icon: Package, label: t('TotalProducts'), val: stats.products, color: 'text-blue-500 bg-blue-500/10' },
                                { icon: Layers, label: t('SubCategories'), val: stats.subCategories, color: 'text-purple-500 bg-purple-500/10' },
                                { icon: Tag, label: t('TotalOffers'), val: stats.activeOffers, color: 'text-emerald-500 bg-emerald-500/10' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-foreground/[0.02] border border-border/40 hover:bg-foreground/[0.04] transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shadow-sm", item.color)}>
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <span className="text-sm font-bold text-muted-foreground">{item.label}</span>
                                    </div>
                                    <span className="text-lg font-black ltr:tracking-tight">{item.val}</span>
                                </div>
                            ))}
                        </div>
                    </DashboardCard>

                    <div className="p-6 rounded-[2.5rem] bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12 group-hover:scale-[1.8] transition-transform duration-700">
                            <Tag className="h-24 w-24" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-black mb-1">{t('ActiveOffers')}</h3>
                            <p className="text-primary-foreground/70 text-xs font-medium mb-4">{t('OffersDescription')}</p>
                            <div className="text-4xl font-black">{stats.activeOffers}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
