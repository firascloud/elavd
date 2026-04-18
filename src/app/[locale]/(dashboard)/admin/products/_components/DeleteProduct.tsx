"use client";

import React, { useState } from "react";
import { DeleteConfirmModal } from "@/app/[locale]/(dashboard)/_components/common/DeleteConfirmModal";
import { deleteRecord } from "@/app/actions/db";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";

interface DeleteProductProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    product: any;
}

export default function DeleteProduct({ isOpen, onClose, onSuccess, product }: DeleteProductProps) {
    const t = useTranslations("dashboard");
    const locale = useLocale();
    const isAr = locale === "ar";
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!product) return;
        setLoading(true);
        try {
            await deleteRecord('products', product.id);
            toast.success(t("DeleteSuccess"));
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Error deleting product:", error);
            toast.error(t("DeleteFailed"), { description: error.message });
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
            itemName={isAr ? product?.name_ar : product?.name_en}
        />
    );
}