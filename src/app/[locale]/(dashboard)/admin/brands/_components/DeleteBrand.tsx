"use client";

import React, { useState } from "react";
import {
    DashboardModal
} from "@/app/[locale]/(dashboard)/_components/common/Modal";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import { supabaseBrowser } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";

interface DeleteBrandProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    brand: any;
}

export default function DeleteBrand({ isOpen, onClose, onSuccess, brand }: DeleteBrandProps) {
    const t = useTranslations("dashboard");
    const locale = useLocale();
    const isAr = locale === "ar";
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!brand) return;
        setLoading(true);
        try {
            const { error } = await supabaseBrowser
                .from('brands')
                .delete()
                .eq('id', brand.id);

            if (error) throw error;

            toast.success(t("DeleteBrandSuccess"));
            onSuccess();
        } catch (error: any) {
            console.error("Error deleting brand:", error);
            toast.error(t("DeleteBrandFailed"));
        } finally {
            setLoading(false);
            onClose();
        }
    };

    return (
        <DashboardModal
            isOpen={isOpen}
            onClose={onClose}
            title={t("DeleteConfirm")}
            description={t("DeleteDesc")}
            className="sm:max-w-[440px]"
            footer={
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 sm:flex-none h-11 rounded-xl font-semibold"
                    >
                        {t("Cancel")}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex-1 sm:flex-none h-11 rounded-xl font-bold bg-destructive hover:bg-destructive/90 shadow-lg shadow-destructive/20 border-none gap-2"
                    >
                        {loading ? (
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                        {t("Delete")}
                    </Button>
                </div>
            }
        >
            <div className="bg-destructive/5 border border-destructive/10 rounded-2xl p-6 mb-2">
                <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive shrink-0">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground">
                            {isAr ? brand?.name_ar : brand?.name_en}
                        </p>
                        <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                            {t("DeleteDesc")}
                        </p>
                    </div>
                </div>
            </div>
        </DashboardModal>
    );
}
