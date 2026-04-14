"use client";

import React, { useState } from "react";
import { DeleteConfirmModal } from "@/app/[locale]/(dashboard)/_components/common/DeleteConfirmModal";
import { supabaseBrowser } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";

interface DeleteSubCategoryProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    subCategory: any;
}

export default function DeleteSubCategory({ isOpen, onClose, onSuccess, subCategory }: DeleteSubCategoryProps) {
    const t = useTranslations("dashboard");
    const locale = useLocale();
    const isAr = locale === "ar";
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!subCategory) return;
        setLoading(true);
        try {
            const { error } = await supabaseBrowser
                .from('sub_categories')
                .delete()
                .eq('id', subCategory.id);

            if (error) throw error;
            toast.success(t("DeleteSubCategorySuccess"));
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Error deleting sub-category:", error);
            toast.error(t("DeleteSubCategoryFailed"));
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
            itemName={isAr ? subCategory?.name_ar : subCategory?.name_en}
        />
    );
}

