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
                        className="absolute inset-0 bg-[#1a1a1a]/70 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                    > 
                        <button
                            onClick={onClose}
                            className="absolute top-5 right-5 z-50 p-2.5 bg-white/80 hover:bg-white text-gray-900 rounded-lg shadow-sm cursor-pointer backdrop-blur-sm transition-all active:scale-95 border border-gray-100"
                        >
                            <X size={20} />
                        </button>
 
                        {/* Image Left Canvas */}
                        <div className="w-full md:w-[45%] bg-[#fcfcfc] flex items-center justify-center p-8 lg:p-12 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-full h-full bg-radial-gradient from-orange-50/20 to-transparent opacity-50" />
                             
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
                                    <div className="px-3 py-1.5 bg-white/90 backdrop-blur-sm border border-orange-100 text-[#f38d38] text-[9px] font-black rounded-lg shadow-sm tracking-widest flex items-center gap-1.5 uppercase">
                                        <div className="size-1.5 bg-[#f38d38] rounded-full animate-pulse" />
                                        {t('Featured')}
                                    </div>
                                )}
                             </div>
                        </div>
 
                        {/* Content Right Hub */}
                        <div className="w-full md:w-[55%] p-6 lg:p-10 overflow-y-auto flex flex-col bg-white">
                            <div className="mb-8 text-center md:text-start">
                                <motion.div 
                                    initial={{ opacity: 0, x: -5 }} 
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-[#f38d38] text-[10px] font-black tracking-[0.2em] mb-3 flex items-center justify-center md:justify-start gap-2 uppercase"
                                >
                                    <Layers className="size-3.5" />
                                    {t('Products')}
                                </motion.div>
                                <h2 className="text-2xl lg:text-3xl font-black text-[#1a1a1a] mb-2 font-cairo tracking-tight">
                                    {name}
                                </h2>
                            </div>

                            <div className="space-y-6 flex-1">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-l-3 border-[#f38d38] pl-2 rtl:border-l-0 rtl:border-r-3 rtl:pr-2">
                                        {t('DescriptionTab')}
                                    </h4>
                                    <div className="text-gray-500 text-sm leading-7 font-medium line-clamp-6">
                                        {fullDesc || shortDesc}
                                    </div>
                                    <Link 
                                        href={`/products/${product.id}`}
                                        className="text-[#f38d38] font-bold text-xs flex items-center gap-1 hover:underline underline-offset-4 group transition-all"
                                    >
                                        {t('ViewFullDetails')}
                                        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </Link>
                                </div>
                            </div>

                             <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col space-y-5">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-[2] h-12 bg-[#1a1a1a] text-white font-black text-sm rounded-xl cursor-pointer hover:bg-black transition-all flex items-center justify-center gap-3 shadow-lg shadow-gray-200 active:scale-95 group uppercase tracking-widest"
                                    >
                                        <ShoppingCart size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                                        <span>{t('addToCart')}</span>
                                    </button>
                                    
                                    <div className="flex gap-3 sm:flex-1 justify-center sm:justify-end">
                                        <button 
                                            onClick={handleWishlist}
                                            className={`size-12 rounded-xl cursor-pointer flex items-center justify-center transition-all shadow-sm active:scale-95 border ${isInWishlist(product.id) ? 'bg-red-50 text-red-500 border-red-100' : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'}`}
                                        >
                                            <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                                        </button>

                                        <button 
                                            onClick={handleCompare}
                                            className="size-12 bg-white border border-gray-100 rounded-xl cursor-pointer flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                                        >
                                            <Repeat size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between px-1">
                                    <div className="flex items-center gap-2 text-[9px] text-gray-400 font-black uppercase tracking-[0.1em]">
                                        <div className="size-1.5 bg-green-500 rounded-full" />
                                        {t('FastShipping')}
                                    </div>
                                    <div className="text-[9px] text-gray-400 font-black uppercase tracking-[0.1em] flex items-center gap-2">
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
