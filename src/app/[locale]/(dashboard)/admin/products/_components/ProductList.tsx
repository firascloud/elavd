"use client";

import React, { useEffect, useState } from "react";
import {
    DashboardTable,
    DashboardTableRow,
    DashboardTableCell
} from "@/app/[locale]/(dashboard)/_components/common/Table";
import {
    DashboardSelectFilter,
    DashboardPagination
} from "@/app/[locale]/(dashboard)/_components/common/Filters";
import {
    DashboardModal
} from "@/app/[locale]/(dashboard)/_components/common/Modal";
import { Price } from "@/app/[locale]/(dashboard)/_components/common/Price";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import { supabaseBrowser } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Boxes, Edit2, Trash2, Plus, Star, Package, RefreshCw, Search, X } from "lucide-react";
import ProductForm from "./ProductForm";
import DeleteProduct from "./DeleteProduct";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

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
            .order('sort_order', { ascending: true })
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) {
            console.error("Error fetching products:", error);
            toast.error(t("FailedLoadProducts"));
        } else {
            setProducts(data || []);
            if (count !== null) {
                setTotalPages(Math.max(1, Math.ceil(count / pageSize)));
                setTotalCount(count);
            } else {
                setTotalCount(data?.length || 0);
                setTotalPages(1);
            }
        }
        setLoading(false);
    };

    const handleUpdateOrder = async (id: string, newOrder: number) => {
        try {
            const { error } = await supabaseBrowser
                .from('products')
                .update({ sort_order: newOrder })
                .eq('id', id);

            if (error) throw error;
            toast.success(t("OrderUpdated"));
            fetchProducts();
        } catch (error) {
            console.error("Error updating order:", error);
            toast.error(t("UpdateFailed"));
        }
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <section className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/[0.07] via-background to-secondary/[0.07] px-5 py-5 shadow-sm sm:px-7 sm:py-6">
                <div className="pointer-events-none absolute -end-14 -top-16 h-44 w-44 rounded-full bg-secondary/10 blur-3xl" />
                <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-secondary/15 bg-background/70 px-3 py-1 text-[11px] font-bold text-secondary shadow-sm backdrop-blur">
                            <Boxes className="h-3.5 w-3.5" />
                            {t("Overview")}
                        </div>
                        <h1 className="text-2xl font-black leading-tight text-foreground sm:text-3xl">{t("Products")}</h1>
                        <p className="mt-2 max-w-2xl text-xs font-medium leading-relaxed text-muted-foreground sm:text-sm">
                            {t("ProductsDescription")}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={fetchProducts}
                            disabled={loading}
                            className="h-10 rounded-xl border-border/70 bg-background/75 px-3 text-xs font-bold shadow-none hover:border-secondary/25 hover:bg-secondary/5 hover:text-secondary"
                            aria-label={t("Refresh")}
                        >
                            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
                            <span className="hidden sm:inline">{t("Refresh")}</span>
                        </Button>
                        <Button
                            onClick={() => { setSelectedProduct(null); setIsEditOpen(true); }}
                            className="h-10 rounded-xl px-4 text-xs font-bold shadow-lg shadow-primary/15"
                        >
                            <Plus className="h-4 w-4" />
                            {t("AddProduct")}
                        </Button>
                    </div>
                </div>
            </section>

            <section className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-xl">
                    <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                        placeholder={t("SearchProducts")}
                        className="h-10 rounded-xl border-border/70 bg-muted/25 ps-10 pe-10 text-xs shadow-none focus-visible:bg-background"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => { setSearch(""); setPage(1); }}
                            className="absolute end-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                            aria-label={t("Cancel")}
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <span className="whitespace-nowrap text-[11px] font-bold text-muted-foreground">
                        {totalCount} {t("results")}
                    </span>
                    <DashboardSelectFilter
                        value={statusFilter}
                        onChange={(val) => { setStatusFilter(val); setPage(1); }}
                        options={[
                            { label: t("All"), value: "all" },
                            { label: t("Active"), value: "active" },
                            { label: t("Inactive"), value: "inactive" },
                            { label: t("Featured"), value: "featured" },
                        ]}
                        placeholder={t("Filter")}
                        className="h-10 min-w-[150px] rounded-xl border-border/70 bg-muted/25 px-3 text-xs shadow-none sm:w-[170px]"
                    />
                </div>
            </section>

            <DashboardTable headers={[
                t("Images"),
                t("NameEn"),
                t("Category"),
                t("SubCategory"),
                t("Price"),
                t("Order"),
                t("Status"),
                t("Actions")
            ]}
                headerClasses={["", "", "hidden md:table-cell", "hidden lg:table-cell", "", "w-[100px]", "hidden sm:table-cell", ""]}
                isLoading={loading}
                emptyMessage={t("NoProductsFound")}
                loadingMessage={t("Loading")}
                className="border-border/70 bg-background shadow-sm"
            >
                {products.map((product) => (
                    <DashboardTableRow key={product.id} className="h-[72px]">
                        <DashboardTableCell className="py-3">
                            <div className="group h-12 w-12 overflow-hidden rounded-xl border border-border/60 bg-muted/30 p-1">
                                {product.main_image ? (
                                    <img
                                        src={product.main_image}
                                        alt={isAr ? product.name_ar : product.name_en}
                                        className="h-full w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-muted-foreground/60">
                                        <Package className="h-5 w-5 opacity-40" />
                                    </div>
                                )}
                            </div>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <div className="flex max-w-[260px] flex-col gap-1">
                                <span className="truncate text-sm font-extrabold text-foreground">
                                    {(isAr ? product.name_ar : product.name_en) || product.name_en || product.name_ar}
                                </span>
                                <span className="truncate text-[10px] font-medium text-muted-foreground" dir="ltr">
                                    {product.slug_en || "—"}
                                </span>
                            </div>
                        </DashboardTableCell>
                        <DashboardTableCell className="hidden md:table-cell">
                            <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold text-foreground/75">
                                {(isAr ? product.categories?.name_ar : product.categories?.name_en) || "—"}
                            </span>
                        </DashboardTableCell>
                        <DashboardTableCell className="hidden lg:table-cell">
                            <span className="inline-flex rounded-full bg-secondary/10 px-2.5 py-1 text-[10px] font-bold text-secondary">
                                {(isAr ? product.sub_categories?.name_ar : product.sub_categories?.name_en) || "—"}
                            </span>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-black text-foreground">
                                    <Price amount={product.discount_price > 0 ? product.discount_price : product.price} />
                                </span>
                                {product.discount_price > 0 && (
                                    <span className="text-[10px] font-medium text-muted-foreground line-through decoration-1">
                                        <Price amount={product.price} showIcon={false} />
                                    </span>
                                )}
                            </div>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <Input
                                type="number"
                                defaultValue={product.sort_order || 0}
                                onBlur={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (val !== product.sort_order) {
                                        handleUpdateOrder(product.id, val);
                                    }
                                }}
                                className="h-8 w-14 rounded-lg border-border/60 bg-muted/20 text-center text-xs font-bold shadow-none focus:ring-primary/20"
                                aria-label={t("Order")}
                            />
                        </DashboardTableCell>
                        <DashboardTableCell className="hidden sm:table-cell">
                            <div className="flex flex-wrap items-center gap-1.5">
                                <span className={cn(
                                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black",
                                    product.is_active ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"
                                )}>
                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                    {product.is_active ? t("Active") : t("Inactive")}
                                </span>
                                {product.is_featured && (
                                    <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-500/10 text-amber-600" title={t("Featured")}>
                                        <Star className="h-3 w-3 fill-current" />
                                    </span>
                                )}
                            </div>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEdit(product)}
                                    className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                    aria-label={t("EditProduct")}
                                >
                                    <Edit2 className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(product)}
                                    className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                    aria-label={t("Delete")}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
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
                className="mt-0 rounded-2xl border-border/70 bg-background p-4 shadow-sm lg:p-5"
            />

            <DashboardModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title={selectedProduct ? t("EditProduct") : t("AddProduct")}
                description={selectedProduct ? (isAr ? selectedProduct.name_ar : selectedProduct.name_en) : t("AddProductDescription")}
                className="w-[calc(100%_-_1.25rem)] overflow-hidden rounded-3xl border-border/70 sm:max-w-5xl"
                footer={
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditOpen(false)}
                            className="h-10 rounded-xl px-5 text-xs font-bold"
                        >
                            {t("Cancel")}
                        </Button>
                        <Button
                            type="submit"
                            form="product-form"
                            className="h-10 rounded-xl px-6 text-xs font-bold shadow-lg shadow-primary/15"
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

            <DeleteProduct
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onSuccess={handleSuccess}
                product={selectedProduct}
            />
        </div>
    );
}
