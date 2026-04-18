"use client";

import React, { useState } from "react";
import { DeleteConfirmModal } from "@/app/[locale]/(dashboard)/_components/common/DeleteConfirmModal";
import { deleteRecord } from "@/app/actions/db";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";

interface DeleteOfferProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    offer: any;
}

export default function DeleteOffer({ isOpen, onClose, onSuccess, offer }: DeleteOfferProps) {
    const t = useTranslations("dashboard");
    const locale = useLocale();
    const isAr = locale === "ar";
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!offer) return;
        setLoading(true);
        try {
            await deleteRecord('offers', offer.id);
            toast.success(t("DeleteOfferSuccess"));
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Error deleting offer:", error);
            toast.error(t("DeleteOfferFailed"));
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
            itemName={isAr ? offer?.title_ar : offer?.title_en}
        />
    );
}

