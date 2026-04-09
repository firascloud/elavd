"use client";

import React, { useEffect, useState } from "react";
import {
    DashboardTable,
    DashboardTableRow,
    DashboardTableCell
} from "@/app/[locale]/(dashboard)/_components/common/Table";
import {
    DashboardSearch,
    DashboardSelectFilter,
    DashboardPagination
} from "@/app/[locale]/(dashboard)/_components/common/Filters";
import {
    DashboardModal
} from "@/app/[locale]/(dashboard)/_components/common/Modal";
import {
    DashboardHeader
} from "@/app/[locale]/(dashboard)/_components/common/DashboardHeader";
import { Price } from "@/app/[locale]/(dashboard)/_components/common/Price";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import { supabaseBrowser } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Edit2, Trash2, Plus, Star, Package, RefreshCw, Eye } from "lucide-react";
import ProductForm from "./ProductForm";
import DeleteProduct from "./DeleteProduct";
import { toast } from "sonner";

export default function ProductList() {
    const t = useTranslations("dashboard");
    const locale = useLocale();
    const isAr = locale === "ar";

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        let query = supabaseBrowser
            .from('products')
            .select(`
                *,
                categories(name_en, name_ar),
                sub_categories(name_en, name_ar),
                brands(name_en, name_ar)
            `, { count: 'exact' });

        if (search) {
            query = query.or(`name_en.ilike.%${search}%,name_ar.ilike.%${search}%`);
        }

        // Apply status filter
        if (statusFilter === "active") {
            query = query.eq('is_active', true);
        } else if (statusFilter === "inactive") {
            query = query.eq('is_active', false);
        } else if (statusFilter === "featured") {
            query = query.eq('is_featured', true);
        }

        const pageSize = 10;
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        const { data, count, error } = await query
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) {
            console.error("Error fetching products:", error);
            toast.error(t("FailedLoadProducts"));
        } else {
            setProducts(data || []);
            if (count) {
                setTotalPages(Math.ceil(count / pageSize));
                setTotalCount(count);
            } else {
                setTotalCount(data?.length || 0);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, [page, search, statusFilter]);

    const handleEdit = (product: any) => {
        setSelectedProduct(product);
        setIsEditOpen(true);
    };

    const handleDelete = (product: any) => {
        setSelectedProduct(product);
        setIsDeleteOpen(true);
    };

    const handleSuccess = () => {
        setIsEditOpen(false);
        setIsDeleteOpen(false);
        fetchProducts();
        toast.success(t("Done"));
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <DashboardHeader
                title={t("Products")}
                description={t("ProductsDescription")}
                actions={
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={fetchProducts}
                            className="h-12 w-12 rounded-2xl border-border/40 bg-background/40 hover:bg-background/60 transition-all duration-300 shadow-sm shrink-0"
                        >
                            <RefreshCw className={cn("h-5 w-5 text-muted-foreground", loading && "animate-spin")} />
                        </Button>
                        <Button
                            onClick={() => { setSelectedProduct(null); setIsEditOpen(true); }}
                            className="h-12 px-6 rounded-2xl font-bold tracking-tight gap-2.5 shadow-xl shadow-foreground/10 border-none bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 whitespace-nowrap"
                        >
                            <Plus className="h-5 w-5 stroke-[3]" />
                            <span>{t("AddProduct")}</span>
                        </Button>
                    </div>
                }
            >
                <DashboardSearch
                    placeholder={t("SearchProducts")}
                    onChange={(val) => { setSearch(val); setPage(1); }}
                    className="w-full lg:w-[32rem]"
                />

                <div className="flex flex-wrap items-center gap-3 justify-end flex-1">
                    <DashboardSelectFilter
                        value={statusFilter}
                        onChange={(val) => { setStatusFilter(val); setPage(1); }}
                        options={[
                            { label: t("All") || "All", value: "all" },
                            { label: t("Active") || "Active", value: "active" },
                            { label: t("Inactive") || "Inactive", value: "inactive" },
                            { label: t("Featured") || "Featured", value: "featured" },
                        ]}
                        placeholder={t("Filter") || "Filter"}
                        className="w-full sm:w-[180px]"
                    />
                </div>
            </DashboardHeader>

            <DashboardTable headers={[
                t("Images"),
                t("NameEn"),
                t("Category"),
                t("SubCategory"),
                t("Brand"),
                t("Price"),
                t("Status"),
                t("Actions")
            ]}
                headerClasses={["", "", "hidden md:table-cell", "hidden lg:table-cell", "hidden lg:table-cell", "", "hidden sm:table-cell", ""]}
                isLoading={loading}
                emptyMessage={t("NoProductsFound") || "No products found."}
            >
                {products.map((product) => (
                    <DashboardTableRow key={product.id}>
                        <DashboardTableCell>
                            <div className="h-14 w-14 rounded-xl overflow-hidden border border-border/60 bg-background/60 p-1 group">
                                {product.main_image ? (
                                    <img src={product.main_image} alt="" className="h-full w-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-105" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-muted-foreground/60">
                                        <Package className="h-6 w-6 opacity-30" />
                                    </div>
                                )}
                            </div>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <div className="flex flex-col gap-1">
                                <span className="font-semibold tracking-tight">{isAr ? product.name_ar : product.name_en}</span>
                                <span className="text-[10px] uppercase font-medium text-secondary bg-secondary/5 px-2 py-0.5 rounded-full self-start border border-secondary/20">
                                    {product.slug_en}
                                </span>
                            </div>
                        </DashboardTableCell>
                        <DashboardTableCell className="hidden md:table-cell">
                            <span className="text-xs font-semibold px-3 py-1 bg-background/60 border border-border/60 rounded-full text-foreground/80">
                                {isAr ? product.categories?.name_ar : product.categories?.name_en || "-"}
                            </span>
                        </DashboardTableCell>
                        <DashboardTableCell className="hidden lg:table-cell">
                            <span className="text-xs font-semibold px-3 py-1 bg-primary/5 text-primary border border-primary/20 rounded-full">
                                {isAr ? product.sub_categories?.name_ar : product.sub_categories?.name_en || "-"}
                            </span>
                        </DashboardTableCell>
                        <DashboardTableCell className="hidden lg:table-cell">
                            <span className="text-xs font-semibold px-3 py-1 bg-accent/5 text-accent border border-accent/20 rounded-full">
                                {isAr ? product.brands?.name_ar : product.brands?.name_en || "-"}
                            </span>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <div className="flex flex-col">
                                <span className="font-semibold text-foreground"><Price amount={product.price} /></span>
                                {product.discount_price > 0 && <span className="text-[11px] text-muted-foreground line-through decoration-2"><Price amount={product.discount_price} showIcon={false} /></span>}
                            </div>
                        </DashboardTableCell>
                        <DashboardTableCell className="hidden sm:table-cell">
                            <div className="flex items-center gap-3">
                                <div className={`h-2.5 w-2.5 rounded-full ${product.is_active ? 'bg-secondary' : 'bg-destructive'}`} />
                                {product.is_featured && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
                            </div>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(product)} className="h-9 w-9 rounded-full hover:bg-foreground/[0.06] hover:text-foreground transition-all">
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(product)} className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive transition-all">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </DashboardTableCell>
                    </DashboardTableRow>
                ))}
            </DashboardTable>

            <DashboardPagination
                page={page}
                totalPages={totalPages}
                onPrev={() => setPage(p => Math.max(1, p - 1))}
                onNext={() => setPage(p => Math.min(totalPages, p + 1))}
                totalCount={totalCount}
                onPageSelect={(p) => setPage(p)}
            />

            {/* Edit/Create Modal */}
            <DashboardModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title={selectedProduct ? t("EditProduct") : t("AddProduct")}
                description={selectedProduct ? (isAr ? selectedProduct.name_ar : selectedProduct.name_en) : t("AddProductDescription")}
                footer={
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditOpen(false)}
                        >
                            {t("Cancel")}
                        </Button>
                        <Button
                            type="submit"
                            form="product-form"
                        >
                            {t("Save")}
                        </Button>
                    </div>
                }
            >
                <ProductForm
                    initialData={selectedProduct}
                    onSuccess={handleSuccess}
                    onCancel={() => setIsEditOpen(false)}
                    formId="product-form"
                />
            </DashboardModal>

            {/* Delete Modal */}
            <DeleteProduct
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onSuccess={handleSuccess}
                product={selectedProduct}
            />
        </div>
    );
}