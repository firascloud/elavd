"use client";

import React, { useState } from "react";
import { DeleteConfirmModal } from "@/app/[locale]/(dashboard)/_components/common/DeleteConfirmModal";
import { supabaseBrowser } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";

interface DeleteCategoryProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    category: any;
}

export default function DeleteCategory({ isOpen, onClose, onSuccess, category }: DeleteCategoryProps) {
    const t = useTranslations("dashboard");
    const locale = useLocale();
    const isAr = locale === "ar";
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!category) return;
        setLoading(true);
        try {
            const { error } = await supabaseBrowser
                .from('categories')
                .delete()
                .eq('id', category.id);

            if (error) throw error;
            toast.success(t("DeleteCategorySuccess"));
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Error deleting category:", error);
            toast.error(t("DeleteCategoryFailed"));
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
            itemName={isAr ? category?.name_ar : category?.name_en}
        />
    );
}