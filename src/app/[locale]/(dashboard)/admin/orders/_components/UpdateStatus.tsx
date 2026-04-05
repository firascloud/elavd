"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { supabaseBrowser } from "@/lib/supabase/client";
import { RefreshCw, CheckCircle2, Clock, Truck, XCircle, Package } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface UpdateStatusProps {
    order: any;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function UpdateStatus({ order, onSuccess, onCancel }: UpdateStatusProps) {
    const t = useTranslations("dashboard");
    const [status, setStatus] = useState(order?.status || "pending");
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const { error } = await supabaseBrowser
                .from('orders')
                .update({ status })
                .eq('id', order.id);

            if (error) throw error;
            toast.success(t("OrderStatusUpdated"));
            onSuccess();
        } catch (error: any) {
            console.error("Error updating status:", error);
            toast.error(t("FailedToUpdateStatus"));
        } finally {
            setLoading(false);
        }
    };

    const statuses = [
        { value: "pending", label: t("Pending"), icon: <Clock className="h-4 w-4" /> },
        { value: "processing", label: t("Processing"), icon: <Package className="h-4 w-4" /> },
        { value: "shipped", label: t("Shipped"), icon: <Truck className="h-4 w-4" /> },
        { value: "delivered", label: t("Delivered"), icon: <CheckCircle2 className="h-4 w-4" /> },
        { value: "canceled", label: t("Canceled"), icon: <XCircle className="h-4 w-4" /> },
    ];

    return (
        <div className="space-y-8 py-6">
            <div className="space-y-3 group">
                <Label className="text-[11px] font-medium text-muted-foreground mb-1 block">
                    {t("CurrentWorkflowStage")}
                </Label>
                <Select onValueChange={(val) => setStatus(val)} defaultValue={status}>
                    <SelectTrigger className="h-11 rounded-xl border-border/60 bg-background/60 shadow-sm transition-all focus:ring-2 focus:ring-primary/10 focus:border-border px-4 font-medium text-sm">
                        <SelectValue placeholder={t("SelectStatus")} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/60 shadow-xl overflow-hidden bg-background/70 backdrop-blur z-[999] p-1">
                        {statuses.map((s) => (
                            <SelectItem
                                key={s.value}
                                value={s.value}
                                className="py-3 px-4 border-b border-border/60 last:border-none focus:bg-foreground/[0.04] transition-colors cursor-pointer font-medium text-sm flex gap-3"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-current opacity-30" />
                                    {s.label}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex gap-3 pt-2 justify-end">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    className="h-10 rounded-full"
                >
                    {t("Cancel")}
                </Button>
                <Button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="h-10 rounded-full gap-2"
                >
                    {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    <span className="ml-1">{t("Update")}</span>
                </Button>
            </div>
        </div>
    );
}
