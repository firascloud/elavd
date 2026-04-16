"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Heart, Repeat, Info, ArrowUpRight, CheckCircle2, Layers } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Product } from "@/services/home";
import useAppStore from "@/store/store";
import { toast } from "sonner";
import { Link } from "@/i18n/routing";

interface QuickViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
    isOpen,
    onClose,
    product
}) => {
    const locale = useLocale();
    const t = useTranslations('common');
    const { toggleWishlist, isInWishlist, addToCompare, isInCompare, addToCart } = useAppStore();

    if (!product) return null;

    const name = locale === 'ar' ? product.name_ar : product.name_en;
    const shortDesc = locale === 'ar' ? product.short_desc_ar : product.short_desc_en;
    const fullDesc = locale === 'ar' ? product.full_desc_ar : product.full_desc_en;

    const handleAddToCart = () => {
        addToCart(product);
        toast.success(name, {
            description: t('AddedToCartDesc'),
            icon: <CheckCircle2 className="text-green-500" />,
            action: {
                label: t('ViewCart'),
                onClick: () => window.location.href = `/${locale}/cart`,
            },
        });
    };

    const handleWishlist = () => {
        toggleWishlist(product);
        const inList = isInWishlist(product.id);
        toast.success(name, {
            description: inList ? t('RemovedFromWishlist') : t('AddedToWishlist'),
        });
    };

    const handleCompare = () => {
        addToCompare(product);
        toast.success(name, {
            description: t('AddedToCompare')
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-foreground/70 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        className="relative w-full max-w-5xl bg-background rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-5 right-5 z-50 p-2.5 bg-background/80 hover:bg-background text-foreground rounded-lg shadow-sm cursor-pointer backdrop-blur-sm transition-all active:scale-95 border border-border"
                        >
                            <X size={20} />
                        </button>

                        {/* Image Left Canvas */}
                        <div className="w-full md:w-[45%] bg-muted/30 flex items-center justify-center p-8 lg:p-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-full h-full bg-radial-gradient from-primary/10 to-transparent opacity-50" />

                            <motion.div
                                layoutId={`image-${product.id}`}
                                className="relative w-full aspect-square max-w-[320px]"
                            >
                                <Image
                                    src={product.main_image || ''}
                                    alt={name || ''}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </motion.div>

                            <div className="absolute bottom-6 left-6 flex gap-2">
                                {product.is_featured && (
                                    <div className="px-3 py-1.5 bg-background/90 backdrop-blur-sm border border-primary/10 text-primary text-[9px] font-black rounded-lg shadow-sm ltr:tracking-widest flex items-center gap-1.5 uppercase">
                                        <div className="size-1.5 bg-primary rounded-full animate-pulse" />
                                        {t('Featured')}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content Right Hub */}
                        <div className="w-full md:w-[55%] p-6 lg:p-10 overflow-y-auto flex flex-col bg-background">
                            <div className="mb-8 text-center md:text-start">
                                <motion.div
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-primary text-[10px] font-black ltr:tracking-[0.2em] mb-3 flex items-center justify-center md:justify-start gap-2 uppercase"
                                >
                                    <Layers className="size-3.5" />
                                    {t('Products')}
                                </motion.div>
                                <h2 className="text-2xl lg:text-3xl font-black text-foreground mb-2 font-cairo ltr:tracking-tight">
                                    {name}
                                </h2>
                            </div>

                            <div className="space-y-6 flex-1">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-muted-foreground uppercase ltr:tracking-widest border-l-3 border-primary ps-2 rtl:border-l-0 rtl:border-r-3 rtl:pe-2">
                                        {t('DescriptionTab')}
                                    </h4>
                                    <div className="text-muted-foreground text-sm leading-7 font-medium line-clamp-6">
                                        {fullDesc || shortDesc}
                                    </div>
                                    <Link
                                        href={`/product/${product.slug_en || product.id}`}
                                        className="text-primary font-bold text-xs flex items-center gap-1 hover:underline underline-offset-4 group transition-all"
                                    >
                                        {t('ViewFullDetails')}
                                        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-border/50 flex flex-col space-y-5">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    {/* <button
                                        onClick={handleAddToCart}
                                        className="flex-[2] h-12 bg-foreground text-primary-foreground font-black text-sm rounded-xl cursor-pointer hover:bg-foreground/90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-foreground/20 active:scale-95 group uppercase ltr:tracking-widest"
                                    >
                                        <ShoppingCart size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                                        <span>{t('addToCart')}</span>
                                    </button> */}

                                    <div className="flex gap-3 sm:flex-1 justify-center sm:justify-end">
                                        <button
                                            onClick={handleWishlist}
                                            className={`size-12 rounded-xl cursor-pointer flex items-center justify-center transition-all shadow-sm active:scale-95 border ${isInWishlist(product.id) ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-background text-muted-foreground border-border hover:bg-muted/30'}`}
                                        >
                                            <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                                        </button>

                                        <button
                                            onClick={handleCompare}
                                            className="size-12 bg-background border border-border rounded-xl cursor-pointer flex items-center justify-center text-muted-foreground hover:bg-muted/30 transition-all shadow-sm active:scale-95"
                                        >
                                            <Repeat size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between px-1">
                                    <div className="flex items-center gap-2 text-[9px] text-muted-foreground font-black uppercase ltr:tracking-[0.1em]">
                                        <div className="size-1.5 bg-green-500 rounded-full" />
                                        {t('FastShipping')}
                                    </div>
                                    <div className="text-[9px] text-muted-foreground font-black uppercase ltr:tracking-[0.1em] flex items-center gap-2">
                                        <Info size={12} />
                                        {t('TermsConditions')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
