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
        { value: "shipped", label: t("Shipped"), icon: <Truck className="h-4 w-4" /> },
        { value: "delivered", label: t("Delivered"), icon: <CheckCircle2 className="h-4 w-4" /> },
    ];

    return (
        <div className="space-y-8 py-6">
            <div className="space-y-3 group">
                <Label className="text-[11px] font-medium text-muted-foreground mb-1 block">
                    {t("CurrentWorkflowStage")}
                </Label>
                <Select onValueChange={(val) => setStatus(val)} defaultValue={status}>
                    <SelectTrigger className="h-11 rounded-xl border-border/60 bg-white shadow-sm transition-all focus:ring-2 focus:ring-primary/10 focus:border-border px-4 font-medium text-sm">
                        <SelectValue placeholder={t("SelectStatus")} />
                    </SelectTrigger>
                    <SelectContent 
                        position="popper" 
                        sideOffset={4}
                        className="rounded-xl border border-border/60 shadow-2xl overflow-hidden bg-white z-[9999] p-1 min-w-[var(--radix-select-trigger-width)]"
                    >
                        {statuses.map((s) => (
                            <SelectItem
                                key={s.value}
                                value={s.value}
                                className="py-2.5 px-4 rounded-lg focus:bg-primary/5 focus:text-primary transition-all cursor-pointer font-medium text-sm my-0.5"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-current opacity-30 shrink-0" />
                                    <span>{s.label}</span>
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
                    <span className="ms-1">{t("Update")}</span>
                </Button>
            </div>
        </div>
    );
}
