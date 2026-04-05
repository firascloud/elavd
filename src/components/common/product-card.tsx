"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Eye, Heart, ShoppingCart, Repeat, Layers } from "lucide-react";
import useAppStore from "@/store/store";
import { toast } from "sonner";
import { Product } from "@/services/home";
import { QuickViewModal } from "./QuickViewModal";

export interface ProductCardProps extends Product {
    is_hot?: boolean;
}

const Tooltip = ({ text, isVisible }: { text: string; isVisible: boolean }) => (
    <AnimatePresence>
        {isVisible && (
            <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 10 }}
                className="absolute top-1/2 -translate-y-1/2 ltr:right-full ltr:mr-3 rtl:left-full rtl:ml-3 px-2 py-1 bg-[#1a1a1a] text-white text-[10px] rounded whitespace-nowrap z-30 pointer-events-none"
            >
                {text}
                <div className="absolute top-1/2 -translate-y-1/2 ltr:-right-1 rtl:-left-1 border-t-4 border-t-transparent border-b-4 border-b-transparent ltr:border-l-4 ltr:border-l-[#1a1a1a] rtl:border-r-4 rtl:border-r-[#1a1a1a]" />
            </motion.div>
        )}
    </AnimatePresence>
);

const IconButton = ({ 
    icon: Icon, 
    tooltip, 
    onClick,
    isActive = false,
    activeColor = "hover:bg-[#f38d38]" 
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
                className={`p-2.5 cursor-pointer rounded-full bg-white shadow-md ${activeColor} ${isActive ? 'text-[#f38d38]' : 'text-gray-400'} hover:text-white transition-colors`}
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
        id
    } = props;

    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const locale = useLocale();
    const t = useTranslations('common');
    const { toggleWishlist, isInWishlist, addToCompare, isInCompare, addToCart } = useAppStore();
    
    const name = locale === 'ar' ? name_ar : name_en;
    const description = locale === 'ar' ? short_desc_ar : short_desc_en;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addToCart(props);
        toast.success(locale === 'ar' ? 'تمت الإضافة للسلة' : 'Added to cart');
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative flex flex-col bg-white border border-gray-300 p-6 transition-all hover:shadow-md shadow-sm rounded-md h-full"
            > 
                {is_hot && (
                    <div className="absolute top-4 ltr:right-4 rtl:left-4 z-10 px-3 py-1 bg-[#d32f2f] text-white text-[10px] font-extrabold rounded-full tracking-wider uppercase">
                        HOT
                    </div>
                )}
 
                <div className="absolute top-14 ltr:right-4 rtl:left-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 ltr:group-hover:translate-x-0 rtl:group-hover:-translate-x-0 z-20">
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
 
                <div className="relative h-60 w-full mb-6 flex items-center justify-center bg-white overflow-hidden shrink-0">
                    {main_image ? (
                        <div className="relative size-44">
                            <Image
                                src={main_image}
                                alt={name || 'Product'}
                                fill
                                className="object-contain transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                    ) : (
                        <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                            <Layers size={32} />
                        </div>
                    )}
                </div>
 
                <div className="flex flex-col items-center text-center flex-1">
                    <h3 className="text-[#1a1a1a] font-bold text-base line-clamp-1 mb-1 font-cairo">
                        {name || '—'}
                    </h3>
                    <p className="text-gray-400 text-xs font-medium mb-8 line-clamp-1 h-4">
                        {description || '—'}
                    </p>
 
                    <button
                        onClick={handleAddToCart}
                        className="group/btn cursor-pointer relative w-full h-11 bg-[#f38d38] text-white font-bold text-sm rounded-full transition-all hover:bg-[#e67e22] shadow-sm mt-auto transform active:scale-95 overflow-hidden"
                    >
                        <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover/btn:-translate-y-full">
                            {t('ReadMore')}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-300 translate-y-full group-hover/btn:translate-y-0 text-white">
                            <ShoppingCart size={18} />
                            <span>{t('addToCart')}</span>
                        </div>
                    </button>
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
