"use client";

import React, { useState } from "react";
import { DashboardModal } from "@/app/[locale]/(dashboard)/_components/common/Modal";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { supabaseBrowser } from "@/lib/supabase/client";
import { toast } from "sonner";

interface DeleteOfferProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    offer: any;
}

export default function DeleteOffer({ isOpen, onClose, onSuccess, offer }: DeleteOfferProps) {
    const t = useTranslations("dashboard");
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!offer) return;
        setLoading(true);
        try {
            const { error } = await supabaseBrowser
                .from('offers')
                .delete()
                .eq('id', offer.id);

            if (error) throw error;
            toast.success(t("DeleteOfferSuccess"));
            onSuccess();
        } catch (error: any) {
            console.error("Error deleting offer:", error);
            toast.error(t("DeleteOfferFailed"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardModal
            isOpen={isOpen}
            onClose={onClose}
            title={t("DeleteConfirm")}
            description={t("DeleteDesc")}
            footer={
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={onClose}>
                        {t("Cancel")}
                    </Button>
                    <Button variant="default" onClick={handleDelete} disabled={loading}>
                        {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        <span className="ml-2">{t("Delete")}</span>
                    </Button>
                </div>
            }
        >
            <div className="flex flex-col items-center gap-6 py-8">
                <div className="h-16 w-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600">
                    <AlertTriangle className="h-8 w-8 stroke-[1.75]" />
                </div>

                <div className="text-center px-4">
                    <p className="text-sm font-semibold text-foreground mb-1">{offer?.title_en}</p>
                </div>
            </div>
        </DashboardModal>
    );
}
