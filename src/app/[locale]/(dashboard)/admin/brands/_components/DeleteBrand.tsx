"use client";

import React, { useState } from "react";
import { DeleteConfirmModal } from "@/app/[locale]/(dashboard)/_components/common/DeleteConfirmModal";
import { supabaseBrowser } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";

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
            onClose();
        } catch (error: any) {
            console.error("Error deleting brand:", error);
            toast.error(t("DeleteBrandFailed"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <DeleteConfirmModal 
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={handleDelete}
            isLoading={loading}
            itemName={isAr ? brand?.name_ar : brand?.name_en}
        />
    );
}

