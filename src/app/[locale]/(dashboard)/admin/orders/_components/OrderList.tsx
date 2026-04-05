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
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Edit2, Eye, RefreshCw, ShoppingBag, User as UserIcon, Calendar, CheckCircle2, Clock, Truck, XCircle, MoreVertical } from "lucide-react";
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
            .select('*', { count: 'exact' });

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
            case 'pending': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
            case 'processing': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
            case 'shipped': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
            case 'delivered': return 'bg-green-500/10 text-green-600 border-green-500/20';
            case 'canceled': return 'bg-red-500/10 text-red-600 border-red-500/20';
            default: return 'bg-muted/30 text-muted-foreground border-transparent';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="h-3 w-3" />;
            case 'processing': return <RefreshCw className="h-3 w-3 animate-spin" />;
            case 'shipped': return <Truck className="h-3 w-3" />;
            case 'delivered': return <CheckCircle2 className="h-3 w-3" />;
            case 'canceled': return <XCircle className="h-3 w-3" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-3 md:gap-4">
                <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center justify-between">
                    <DashboardSearch
                        placeholder={t("SearchOrderID")}
                        onChange={(val) => { setSearch(val); setPage(1); }}
                        className="w-full md:w-[28rem]"
                    />
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 justify-between md:justify-end w-full md:w-auto">
                        <DashboardSelectFilter
                            value={statusFilter}
                            onChange={(val) => { setStatusFilter(val); setPage(1); }}
                            options={[
                                { label: t("All"), value: "all" },
                                { label: t("Pending"), value: "pending" },
                                { label: t("Processing"), value: "processing" },
                                { label: t("Shipped"), value: "shipped" },
                                { label: t("Delivered"), value: "delivered" },
                                { label: t("Canceled"), value: "canceled" },
                            ]}
                            placeholder={t("Filter")}
                        />
                        <Button variant="outline" size="icon" onClick={fetchOrders} className="h-8 w-8 md:h-9 md:w-9 rounded-full border-border/60 hover:border-foreground/30">
                            <RefreshCw className={loading ? "animate-spin" : ""} />
                        </Button>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                        {totalCount} {t("results")}
                    </span>
                </div>
            </div>

            <DashboardTable headers={[
                t("OrderID"),
                t("Customer"),
                t("Total"),
                t("Status"),
                t("CreatedAt"),
                t("Actions")
            ]}>
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
                                <span className="font-bold tracking-tight text-sm">{t("CustomerHash")} {order.user_id?.slice(0, 4)}</span>
                            </div>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <span className="font-bold text-primary font-mono">${order.total_amount?.toFixed(2)}</span>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-xl border border-dashed font-bold text-[10px] uppercase w-fit ${getStatusStyle(order.status)}`}>
                                {getStatusIcon(order.status)}
                                {t(order.status.charAt(0).toUpperCase() + order.status.slice(1))}
                            </div>
                        </DashboardTableCell>
                        <DashboardTableCell>
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
