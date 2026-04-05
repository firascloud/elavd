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
            description: inList ? t('AddedToWishlist') : t('RemovedFromWishlist'),
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#1a1a1a]/80 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        className="relative w-full max-w-6xl bg-white rounded-md shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row max-h-[95vh]"
                    > 
                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 z-50 p-3 bg-white/50 hover:bg-white text-gray-900 rounded-lg shadow-md cursor-pointer backdrop-blur-md transition-all active:scale-95"
                        >
                            <X size={24} />
                        </button>
 
                        <div className="w-full md:w-1/2 bg-[#f8f9fa] flex items-center justify-center p-12 lg:p-20 relative">
                             <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#f38d38]/5 blur-[80px] rounded-full" />
                             <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#f38d38]/10 blur-[80px] rounded-full" />
                             
                             <motion.div 
                                layoutId={`image-${product.id}`}
                                className="relative w-full aspect-square drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
                             >
                                <Image
                                    src={product.main_image || ''}
                                    alt={name || ''}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                             </motion.div>
 
                             <div className="absolute bottom-10 left-10 flex gap-2">
                                {product.is_featured && (
                                    <div className="px-5 py-2 bg-white/80 backdrop-blur-md border border-white text-[#1a1a1a] text-[11px] font-black rounded-full shadow-sm tracking-widest flex items-center gap-2 uppercase">
                                        <div className="size-2 bg-[#f38d38] rounded-full animate-pulse" />
                                        {t('Featured')}
                                    </div>
                                )}
                             </div>
                        </div>
 
                        <div className="w-full md:w-1/2 p-8 lg:p-16 overflow-y-auto flex flex-col bg-white">
                            <div className="mb-10 text-center md:text-start">
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }} 
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-[#f38d38] text-[13px] font-black tracking-[0.2em] mb-4 flex items-center justify-center md:justify-start gap-2 uppercase font-inter"
                                >
                                    <Layers className="size-4" />
                                    {t('Products')}
                                </motion.div>
                                <h2 className="text-3xl lg:text-4xl font-black text-[#1a1a1a] mb-3 ">
                                    {name}
                                </h2>
                            </div>

                            <div className="space-y-5 flex-1">
                                <div className="space-y-4">
                                    <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-widest border-l-4 border-[#f38d38] pl-3 rtl:border-l-0 rtl:border-r-4 rtl:pr-3">
                                        {t('DescriptionTab')}
                                    </h4>
                                    <div className="text-gray-600 text-base leading-8 font-medium">
                                        {fullDesc || shortDesc}
                                    </div>
                                    <Link 
                                        href={`/products/${product.id}`}
                                        className="text-[#f38d38] font-bold text-sm flex items-center gap-1 hover:underline underline-offset-4 group transition-all"
                                    >
                                        {t('ViewFullDetails')}
                                        <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>

                             <div className=" pt-10 border-t border-gray-100 grid grid-cols-1 gap-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-[2] h-15 bg-[#1a1a1a] text-white font-black rounded-md cursor-pointer hover:bg-[#000] transition-all flex items-center justify-center gap-4 shadow-2xl shadow-gray-200 active:scale-95 group"
                                    >
                                        <ShoppingCart size={22} className="group-hover:-translate-y-0.5 transition-transform" />
                                        <span className="text-lg">{t('addToCart')}</span>
                                    </button>
                                    
                                    <div className="flex gap-4 sm:flex-1 justify-center sm:justify-end">
                                        <button 
                                            onClick={handleWishlist}
                                            className={`size-16 rounded-md cursor-pointer flex items-center justify-center transition-all shadow-md active:scale-95 ${isInWishlist(product.id) ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-gray-50 text-gray-400 border border-gray-100 hover:bg-gray-100'}`}
                                        >
                                            <Heart size={24} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                                        </button>

                                        <button 
                                            onClick={handleCompare}
                                            className="size-16 bg-gray-50 border border-gray-100 rounded-md cursor-pointer flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all shadow-md active:scale-95"
                                        >
                                            <Repeat size={24} />
                                        </button>
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
