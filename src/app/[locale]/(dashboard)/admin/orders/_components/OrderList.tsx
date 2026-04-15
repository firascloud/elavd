"use client";

import React, { useEffect, useState } from "react";
import {
    DashboardTable,
    DashboardTableRow,
    DashboardTableCell
} from "@/app/[locale]/(dashboard)/_components/common/Table";
import {
    DashboardSearch,
    DashboardSelectFilter,
    DashboardPagination
} from "@/app/[locale]/(dashboard)/_components/common/Filters";
import {
    DashboardModal
} from "@/app/[locale]/(dashboard)/_components/common/Modal";
import {
    DashboardHeader
} from "@/app/[locale]/(dashboard)/_components/common/DashboardHeader";
import { Price } from "@/app/[locale]/(dashboard)/_components/common/Price";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import { supabaseBrowser } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Edit2, Eye, RefreshCw, ShoppingBag, User as UserIcon, Calendar, CheckCircle2, Clock, Truck, XCircle, MoreVertical, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import UpdateStatus from "./UpdateStatus";
import OrderDetails from "./OrderDetails";

export default function OrderList() {
    const t = useTranslations("dashboard");
    const locale = useLocale();
    const isAr = locale === "ar";

    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [totalCount, setTotalCount] = useState<number>(0);

    const fetchOrders = async () => {
        setLoading(true);
        // Assuming 'orders' table joined with profiles for name
        let query = supabaseBrowser
            .from('orders')
            .select('*, items:order_items(*)', { count: 'exact' });

        if (search) {
            query = query.ilike('id', `%${search}%`);
        }

        if (statusFilter !== "all") {
            query = query.eq('status', statusFilter);
        }

        const pageSize = 10;
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        const { data, count, error } = await query
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to load orders");
        } else {
            setOrders(data || []);
            if (count) {
                setTotalPages(Math.ceil(count / pageSize));
                setTotalCount(count);
            } else {
                setTotalCount(data?.length || 0);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, [page, search, statusFilter]);

    const handleStatusUpdate = (order: any) => {
        setSelectedOrder(order);
        setIsStatusOpen(true);
    };

    const handleViewDetails = (order: any) => {
        setSelectedOrder(order);
        setIsDetailsOpen(true);
    };

    const handleSuccess = () => {
        setIsStatusOpen(false);
        fetchOrders();
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-primary/10 text-primary border-primary/20';
            case 'shipped': return 'bg-accent/10 text-accent border-accent/20';
            case 'delivered': return 'bg-secondary/10 text-secondary border-secondary/20';
            default: return 'bg-muted/30 text-muted-foreground border-transparent';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="h-3 w-3" />;
            case 'shipped': return <Truck className="h-3 w-3" />;
            case 'delivered': return <CheckCircle2 className="h-3 w-3" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <DashboardHeader
                title={t("Orders")}
                description={t("OrdersPageDescription")}
                actions={
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={fetchOrders}
                            className="h-12 w-12 rounded-2xl border-border/40 bg-background/40 hover:bg-background/60 transition-all duration-300 shadow-sm shrink-0"
                        >
                            <RefreshCw className={cn("h-5 w-5 text-muted-foreground", loading && "animate-spin")} />
                        </Button>
                    </div>
                }
            >
                <DashboardSearch
                    placeholder={t("SearchOrderID")}
                    onChange={(val) => { setSearch(val); setPage(1); }}
                    className="w-full lg:w-[32rem]"
                />

                <div className="flex flex-wrap items-center gap-3 justify-end flex-1">
                    <DashboardSelectFilter
                        value={statusFilter}
                        onChange={(val) => { setStatusFilter(val); setPage(1); }}
                        options={[
                            { label: t("All"), value: "all" },
                            { label: t("Pending"), value: "pending" },
                            { label: t("Shipped"), value: "shipped" },
                            { label: t("Delivered"), value: "delivered" },
                        ]}
                        placeholder={t("Filter")}
                        className="w-full sm:w-[180px]"
                    />
                </div>
            </DashboardHeader>

            <DashboardTable headers={[
                t("OrderID"),
                t("Customer"),
                t("Phone"),
                t("Total"),
                t("Status"),
                t("CreatedAt"),
                t("Actions")
            ]}
                headerClasses={["", "", "", "", "hidden sm:table-cell", "hidden md:table-cell", ""]}
                isLoading={loading}
                emptyMessage={t("NoOrdersFound") || "No orders found."}
            >
                {orders.map((order) => (
                    <DashboardTableRow key={order.id}>
                        <DashboardTableCell>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted/60 px-3 py-1 rounded-full">
                                #{order.id.slice(0, 8)}
                            </span>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                                    <UserIcon className="h-4 w-4" />
                                </div>
                                <span className="font-bold ltr:tracking-tight text-sm truncate max-w-[120px]">
                                    {order.customer_name || `${t("CustomerHash")} ${order.user_id?.slice(0, 4)}`}
                                </span>
                            </div>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            {order.customer_phone ? (
                                <a
                                    href={`https://wa.me/${order.customer_phone.replace(/\+/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-secondary/80 bg-secondary/5 px-3 py-1.5 rounded-lg transition-colors w-fit"
                                >
                                    <MessageSquare className="h-3 w-3" />
                                    {order.customer_phone}
                                </a>
                            ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                            )}
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <span className="font-bold text-primary font-mono"><Price amount={order.total} /></span>
                        </DashboardTableCell>
                        <DashboardTableCell className="hidden sm:table-cell">
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-xl border border-dashed font-bold text-[10px] uppercase w-fit ${getStatusStyle(order.status)}`}>
                                {getStatusIcon(order.status)}
                                {t(order.status.charAt(0).toUpperCase() + order.status.slice(1))}
                            </div>
                        </DashboardTableCell>
                        <DashboardTableCell className="hidden md:table-cell">
                            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                <Calendar className="h-3 w-3 opacity-50" />
                                {new Date(order.created_at).toLocaleDateString(locale)}
                            </span>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleViewDetails(order)} className="h-9 w-9 rounded-full hover:bg-foreground/[0.06] hover:text-foreground transition-all">
                                    <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleStatusUpdate(order)} className="h-9 w-9 rounded-full hover:bg-foreground/[0.06] hover:text-foreground transition-all">
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </DashboardTableCell>
                    </DashboardTableRow>
                ))}
            </DashboardTable>

            <DashboardPagination
                page={page}
                totalPages={totalPages}
                onPrev={() => setPage(p => Math.max(1, p - 1))}
                onNext={() => setPage(p => Math.min(totalPages, p + 1))}
                totalCount={totalCount}
                onPageSelect={(p) => setPage(p)}
            />

            <DashboardModal
                isOpen={isStatusOpen}
                onClose={() => setIsStatusOpen(false)}
                title={t("UpdateStatus")}
                description={`${t("OrderID")}: #${selectedOrder?.id?.slice(0, 8)}`}
                className="max-w-md"
            >
                <UpdateStatus
                    order={selectedOrder}
                    onSuccess={handleSuccess}
                    onCancel={() => setIsStatusOpen(false)}
                />
            </DashboardModal>

            <DashboardModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                title={t("OrderDetails")}
                description={`${t("OrderDetailsDescription")} ${selectedOrder?.id?.slice(0, 8)}`}
                className="max-w-4xl"
            >
                <OrderDetails order={selectedOrder} />
            </DashboardModal>
        </div>
    );
}
