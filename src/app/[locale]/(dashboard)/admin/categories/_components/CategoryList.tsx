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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations, useLocale } from "next-intl";
import { supabaseBrowser } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Edit2, Trash2, Plus, RefreshCw, Layers, ImageIcon, Search, X } from "lucide-react";
import CategoryForm from "./CategoryForm";
import DeleteCategory from "./DeleteCategory";
import { toast } from "sonner";

export default function CategoryList() {
    const t = useTranslations("dashboard");
    const locale = useLocale();
    const isAr = locale === "ar";

    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [imageFilter, setImageFilter] = useState<string>("all");
    const [totalCount, setTotalCount] = useState<number>(0);

    const fetchCategories = async () => {
        setLoading(true);
        let query = supabaseBrowser
            .from('categories')
            .select('*, sub_categories(id, name_en, name_ar)', { count: 'exact' });

        if (search) {
            query = query.or(`name_en.ilike.%${search}%,name_ar.ilike.%${search}%`);
        }

        if (imageFilter === "with_image") {
            query = query.not('image_url', 'is', null);
        } else if (imageFilter === "without_image") {
            query = query.is('image_url', null);
        }

        const pageSize = 10;
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        const { data, count, error } = await query
            .order('sort_order', { ascending: true })
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) {
            console.error("Error fetching categories:", error);
            toast.error(t("FailedLoadCategories"));
        } else {
            setCategories(data || []);
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
                .from('categories')
                .update({ sort_order: newOrder })
                .eq('id', id);

            if (error) throw error;
            toast.success(t("OrderUpdated"));
            fetchCategories();
        } catch (error) {
            console.error("Error updating order:", error);
            toast.error(t("UpdateFailed"));
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [page, search, imageFilter]);

    const handleEdit = (category: any) => {
        setSelectedCategory(category);
        setIsEditOpen(true);
    };

    const handleDelete = (category: any) => {
        setSelectedCategory(category);
        setIsDeleteOpen(true);
    };

    const handleSuccess = () => {
        setIsEditOpen(false);
        setIsDeleteOpen(false);
        fetchCategories();
        toast.success(t("Done"));
    };
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <section className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/[0.07] via-background to-secondary/[0.07] px-5 py-5 shadow-sm sm:px-7 sm:py-6">
                <div className="pointer-events-none absolute -end-14 -top-16 h-44 w-44 rounded-full bg-secondary/10 blur-3xl" />
                <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-secondary/15 bg-background/70 px-3 py-1 text-[11px] font-bold text-secondary shadow-sm backdrop-blur">
                            <Layers className="h-3.5 w-3.5" />
                            {t("Overview")}
                        </div>
                        <h1 className="text-2xl font-black leading-tight text-foreground sm:text-3xl">{t("Categories")}</h1>
                        <p className="mt-2 max-w-2xl text-xs font-medium leading-relaxed text-muted-foreground sm:text-sm">
                            {t("CategoriesDescription")}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={fetchCategories}
                            disabled={loading}
                            className="h-10 rounded-xl border-border/70 bg-background/75 px-3 text-xs font-bold shadow-none hover:border-secondary/25 hover:bg-secondary/5 hover:text-secondary"
                            aria-label={t("Refresh")}
                        >
                            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
                            <span className="hidden sm:inline">{t("Refresh")}</span>
                        </Button>
                        <Button
                            onClick={() => { setSelectedCategory(null); setIsEditOpen(true); }}
                            className="h-10 rounded-xl px-4 text-xs font-bold shadow-lg shadow-primary/15"
                        >
                            <Plus className="h-4 w-4" />
                            {t("AddCategory")}
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
                        placeholder={t("SearchCategories")}
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
                        value={imageFilter}
                        onChange={(val) => { setImageFilter(val); setPage(1); }}
                        options={[
                            { label: t("All"), value: "all" },
                            { label: t("WithImage"), value: "with_image" },
                            { label: t("WithoutImage"), value: "without_image" },
                        ]}
                        placeholder={t("Filter")}
                        className="h-10 min-w-[150px] rounded-xl border-border/70 bg-muted/25 px-3 text-xs shadow-none sm:w-[170px]"
                    />
                </div>
            </section>

            <DashboardTable headers={[
                t("Images"),
                t("NameEn"),
                t("SubCategories"),
                t("Slug"),
                t("Order"),
                t("CreatedAt"),
                t("Actions")
            ]}
                headerClasses={["", "", "hidden md:table-cell", "hidden sm:table-cell", "w-[100px]", "hidden md:table-cell", ""]}
                isLoading={loading}
                emptyMessage={t("NoCategoriesFound")}
                loadingMessage={t("Loading")}
                className="border-border/70 bg-background shadow-sm"
            >
                {categories.map((category) => (
                    <DashboardTableRow key={category.id} className="h-[72px]">
                        <DashboardTableCell className="py-3">
                            <div className="group h-12 w-12 overflow-hidden rounded-xl border border-border/60 bg-muted/30 p-1">
                                {category.image_url ? (
                                    <img
                                        src={category.image_url}
                                        alt={(isAr ? category.name_ar : category.name_en) || ""}
                                        className="h-full w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-muted-foreground/60">
                                        <ImageIcon className="h-5 w-5 opacity-40" />
                                    </div>
                                )}
                            </div>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <div className="flex max-w-[240px] flex-col gap-1">
                                <span className="truncate text-sm font-extrabold text-foreground">
                                    {(isAr ? category.name_ar : category.name_en) || category.name_en || category.name_ar}
                                </span>
                                <span className="truncate text-[10px] font-medium text-muted-foreground" dir="ltr">
                                    {category.slug_en || "—"}
                                </span>
                            </div>
                        </DashboardTableCell>
                        <DashboardTableCell className="hidden md:table-cell">
                            <div className="flex flex-wrap gap-1.5 max-w-[250px]">
                                {(category.sub_categories || []).slice(0, 3).map((sub: any) => (
                                    <span key={sub.id} className="whitespace-nowrap rounded-full bg-secondary/10 px-2.5 py-1 text-[10px] font-bold text-secondary">
                                        {(isAr ? sub.name_ar : sub.name_en) || sub.name_en}
                                    </span>
                                ))}
                                {category.sub_categories?.length > 3 && (
                                    <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold text-muted-foreground">
                                        +{category.sub_categories.length - 3}
                                    </span>
                                )}
                                {(!category.sub_categories || category.sub_categories.length === 0) && (
                                    <span className="text-[10px] font-medium text-muted-foreground ">
                                        {t("None")}
                                    </span>
                                )}
                            </div>
                        </DashboardTableCell>
                        <DashboardTableCell className="hidden sm:table-cell">
                            <span className="inline-flex max-w-[170px] truncate rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground" dir="ltr">
                                {(isAr ? category.slug_ar : category.slug_en) || "—"}
                            </span>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <Input
                                type="number"
                                defaultValue={category.sort_order || 0}
                                onBlur={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (val !== category.sort_order) {
                                        handleUpdateOrder(category.id, val);
                                    }
                                }}
                                className="h-8 w-14 rounded-lg border-border/60 bg-muted/20 text-center text-xs font-bold shadow-none focus:ring-primary/20"
                                aria-label={t("Order")}
                            />
                        </DashboardTableCell>
                        <DashboardTableCell className="hidden md:table-cell">
                            <span className="text-[11px] font-medium text-muted-foreground">
                                {category.created_at ? new Intl.DateTimeFormat(isAr ? "ar-SA" : "en-US", { year: "numeric", month: "short", day: "numeric" }).format(new Date(category.created_at)) : "—"}
                            </span>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(category)} className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary" aria-label={t("EditCategory")}>
                                    <Edit2 className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(category)} className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label={t("Delete")}>
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
                title={selectedCategory ? t("EditCategory") : t("AddCategory")}
                description={selectedCategory ? (isAr ? selectedCategory.name_ar : selectedCategory.name_en) : t("AddCategoryDescription")}
                className="w-[calc(100%_-_1.25rem)] overflow-hidden rounded-3xl border-border/70 sm:max-w-4xl"
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
                            form="category-form"
                            className="h-10 rounded-xl px-6 text-xs font-bold shadow-lg shadow-primary/15"
                        >
                            {t("Save")}
                        </Button>
                    </div>
                }
            >
                <CategoryForm
                    initialData={selectedCategory}
                    onSuccess={handleSuccess}
                    onCancel={() => setIsEditOpen(false)}
                    formId="category-form"
                />
            </DashboardModal>

            <DeleteCategory
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onSuccess={handleSuccess}
                category={selectedCategory}
            />
        </div>
    );
}
