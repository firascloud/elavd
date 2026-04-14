"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    itemName?: string;
    isLoading?: boolean;
}

export function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    itemName,
    isLoading
}: DeleteConfirmModalProps) {
    const t = useTranslations("dashboard");

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[400px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl bg-background/95 backdrop-blur-xl">
                <div className="bg-destructive/5 p-10 flex flex-col items-center text-center space-y-5">
                    <div className="h-24 w-24 rounded-[2rem] bg-destructive/10 flex items-center justify-center text-destructive animate-in zoom-in duration-500 shadow-inner">
                        <AlertTriangle className="h-12 w-12" />
                    </div>
                    
                    <div className="space-y-3">
                        <DialogTitle className="text-2xl font-black text-foreground tracking-tight uppercase">
                            {title || t("DeleteConfirm")}
                        </DialogTitle>
                        <DialogDescription className="text-xs font-bold text-muted-foreground/70 leading-relaxed px-6 uppercase tracking-wider">
                            {itemName ? (
                                <span>
                                    {t("DeleteDesc")} <span className="text-destructive font-black underline underline-offset-4">"{itemName}"</span>?
                                </span>
                            ) : (
                                description || t("DeleteDesc")
                            )}
                        </DialogDescription>
                    </div>
                </div>


                <div className="p-8 bg-background flex flex-col gap-3">
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-destructive/20 hover:shadow-destructive/40 transition-all duration-500 gap-3 text-xs"
                    >
                        {isLoading ? (
                            <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Trash2 className="h-5 w-5" />
                        )}
                        {t("Delete")}
                    </Button>
                    
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-muted-foreground hover:bg-muted/50 transition-all duration-500"
                    >
                        {t("Cancel")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
