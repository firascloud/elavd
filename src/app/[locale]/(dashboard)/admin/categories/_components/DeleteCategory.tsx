"use client";

import React, { useState } from "react";
import { DeleteConfirmModal } from "@/app/[locale]/(dashboard)/_components/common/DeleteConfirmModal";
import { deleteRecord } from "@/app/actions/db";
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
            await deleteRecord('categories', category.id);
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