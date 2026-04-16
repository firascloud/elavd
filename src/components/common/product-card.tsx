"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Eye, Heart, Repeat, Layers } from "lucide-react";
import useAppStore from "@/store/store";
import { toast } from "sonner";
import { Product } from "@/services/home";
import { QuickViewModal } from "./QuickViewModal";
import { Link } from "@/i18n/routing";

export interface ProductCardProps extends Product {
    is_hot?: boolean;
    view?: "grid" | "list";
}

const Tooltip = ({ text, isVisible }: { text: string; isVisible: boolean }) => (
    <AnimatePresence>
        {isVisible && (
            <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 10 }}
                className="absolute top-1/2 -translate-y-1/2 ltr:right-full ltr:me-3 rtl:left-full rtl:ms-3 px-2 py-1 bg-foreground text-primary-foreground text-[10px] rounded whitespace-nowrap z-30 pointer-events-none"
            >
                {text}
                <div className="absolute top-1/2 -translate-y-1/2 ltr:-right-1 rtl:-left-1 border-t-4 border-t-transparent border-b-4 border-b-transparent ltr:border-l-4 ltr:border-l-foreground rtl:border-r-4 rtl:border-r-foreground" />
            </motion.div>
        )}
    </AnimatePresence>
);

const IconButton = ({
    icon: Icon,
    tooltip,
    onClick,
    isActive = false,
    activeColor = "hover:bg-primary"
}: {
    icon: any;
    tooltip: string;
    onClick?: () => void;
    isActive?: boolean;
    activeColor?: string
}) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <Tooltip text={tooltip} isVisible={isHovered} />
            <button
                onClick={(e) => {
                    e.preventDefault();
                    onClick?.();
                }}
                className={`p-2.5 cursor-pointer rounded-full bg-background shadow-md transition-all ${isActive ? 'bg-secondary text-primary-foreground' : 'text-muted-foreground hover:bg-primary hover:text-primary-foreground'}`}
            >
                <Icon size={16} fill={isActive ? "currentColor" : "none"} />
            </button>
        </div>
    );
};

export const ProductCard: React.FC<ProductCardProps> = (props) => {
    const {
        name_en,
        name_ar,
        short_desc_en,
        short_desc_ar,
        main_image,
        is_hot = true,
        slug_en,
        slug_ar,
        id,
        view = "grid"
    } = props;

    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const locale = useLocale();
    const t = useTranslations('common');
    const { toggleWishlist, isInWishlist, addToCompare, isInCompare, addToCart } = useAppStore();

    const name = locale === 'ar' ? name_ar : name_en;
    const description = locale === 'ar' ? short_desc_ar : short_desc_en;
    const localizedSlug = locale === 'ar' ? slug_ar : slug_en;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addToCart(props);
        toast.success(t('AddedToCartDesc'));
    };

    if (view === "list") {
        return (
            <>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="group relative flex flex-col md:flex-row bg-muted/30 border border-border rounded-md overflow-hidden hover:shadow-md transition-all duration-500"
                >
                    <div className="relative w-full md:w-80 h-64 md:h-auto bg-background flex items-center justify-center px-4 py-1 shrink-0">
                        {main_image ? (
                            <div className="relative size-48 md:size-56">
                                <Image
                                    src={main_image}
                                    alt={name || ''}
                                    fill
                                    className="object-contain transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                        ) : (
                            <Layers size={48} className="text-muted-foreground/30" />
                        )}
                        {is_hot && (
                            <div className="absolute top-6 ltr:left-6 rtl:right-6 px-3 py-1 bg-destructive text-destructive-foreground text-[10px] font-black rounded-full shadow-lg">
                                {t('Hot')}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                        <div className="space-y-4">
                            <h4 className="text-muted-foreground font-bold text-xs uppercase ltr:tracking-widest font-cairo">
                                {t('CategoryMetalSafes')}
                            </h4>
                            <Link href={`/product/${localizedSlug || id}`} className="text-xl md:text-2xl font-black text-foreground font-cairo leading-tight">
                                {name || '—'}
                            </Link>

                        </div>

                        <div className="flex flex-wrap items-center gap-6 mt-10">
                            {/* <button
                                onClick={handleAddToCart}
                                className="px-10 py-3 bg-primary text-primary-foreground font-black text-xs uppercase ltr:tracking-widest rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 transform active:scale-95"
                            >
                                {t('addToCart')}
                            </button> */}

                            <div className="flex items-center gap-3">
                                <IconButton
                                    icon={Heart}
                                    tooltip={t('Wishlist')}
                                    onClick={() => toggleWishlist(props)}
                                    isActive={isInWishlist(id)}
                                />
                                <IconButton
                                    icon={Repeat}
                                    tooltip={t('Compare')}
                                    onClick={() => addToCompare(props)}
                                    isActive={isInCompare(id)}
                                />
                                <IconButton
                                    icon={Eye}
                                    tooltip={t('QuickView')}
                                    onClick={() => setIsQuickViewOpen(true)}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
                <QuickViewModal
                    isOpen={isQuickViewOpen}
                    onClose={() => setIsQuickViewOpen(false)}
                    product={props}
                />
            </>
        )
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative flex flex-col bg-background border border-border p-6 transition-all hover:shadow-md hover:border-secondary/30 shadow-sm rounded-md h-full overflow-hidden"
            >
                <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                {is_hot && (
                    <div className="absolute top-4 ltr:right-4 rtl:left-4 z-10 px-3 py-1 bg-destructive text-destructive-foreground text-[10px] font-extrabold rounded-full ltr:tracking-wider uppercase">
                        {t('Hot')}
                    </div>
                )}

                <div className="absolute top-14 ltr:right-4 rtl:left-4 flex flex-col gap-2 z-20 transition-all transform 
                    opacity-100 translate-x-0 
                    md:opacity-0 md:translate-x-2 
                    md:group-hover:opacity-100 md:ltr:group-hover:translate-x-0 md:rtl:group-hover:-translate-x-0">
                    <IconButton
                        icon={Heart}
                        tooltip={t('Wishlist')}
                        onClick={() => toggleWishlist(props)}
                        isActive={isInWishlist(id)}
                    />
                    <IconButton
                        icon={Repeat}
                        tooltip={t('Compare')}
                        onClick={() => addToCompare(props)}
                        isActive={isInCompare(id)}
                    />
                    <IconButton
                        icon={Eye}
                        tooltip={t('QuickView')}
                        onClick={() => setIsQuickViewOpen(true)}
                    />
                </div>

                <div className="relative h-60 w-full mb-6 flex items-center justify-center bg-background overflow-hidden shrink-0">
                    {main_image ? (
                        <div className="relative size-44">
                            <Link href={`/product/${localizedSlug || id}`} >
                                <Image
                                    src={main_image}
                                    alt={name || 'Product'}
                                    fill
                                    className="object-contain transition-transform duration-700 group-hover:scale-110"
                                />
                            </Link>
                        </div>
                    ) : (
                        <div className="size-16 bg-muted/30 rounded-full flex items-center justify-center text-muted-foreground/30">
                            <Layers size={32} />
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center text-center flex-1">
                    <Link href={`/product/${localizedSlug || id}`} >
                        <h3 className="text-foreground font-bold text-base line-clamp-1 mb-1 font-cairo">
                            {name || '—'}
                        </h3>
                    </Link>
                    <p className="text-muted-foreground text-xs font-medium mb-8 line-clamp-1 h-4">
                        {description || '—'}
                    </p>

                    {/* <button
                        onClick={handleAddToCart}
                        className="group/btn cursor-pointer relative w-full h-11 bg-primary text-primary-foreground font-bold text-sm rounded-full transition-all hover:bg-primary/90 shadow-sm mt-auto transform active:scale-95 overflow-hidden"
                    >
                        <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover/btn:-translate-y-full">
                            {t('ReadMore')}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-300 translate-y-full group-hover/btn:translate-y-0 text-primary-foreground">
                            <ShoppingCart size={18} />
                            <span>{t('addToCart')}</span>
                        </div>
                    </button> */}
                    <Link
                        href={`/product/${localizedSlug || id}`}
                        className="w-full h-11 bg-primary text-primary-foreground font-bold text-sm rounded-full transition-all hover:bg-primary/90 shadow-sm mt-auto transform active:scale-95 flex items-center justify-center"
                    >
                        {t('ReadMore')}
                    </Link>
                </div>
            </motion.div>

            <QuickViewModal
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
                product={props}
            />
        </>
    );
};
