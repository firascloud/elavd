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
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Edit2, Trash2, Plus, RefreshCw, Layers, ImageIcon } from "lucide-react";
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
            .select('*', { count: 'exact' });

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
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) {
            console.error("Error fetching categories:", error);
            toast.error(t("FailedLoadCategories"));
        } else {
            setCategories(data || []);
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-3 md:gap-4">
                <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center justify-between">
                    <DashboardSearch
                        placeholder={t("SearchCategories")}
                        onChange={(val) => { setSearch(val); setPage(1); }}
                        className="w-full md:w-[28rem]"
                    />

                    <div className="flex flex-wrap items-center gap-2 md:gap-3 justify-between md:justify-end w-full md:w-auto">
                        <DashboardSelectFilter
                            value={imageFilter}
                            onChange={(val) => { setImageFilter(val); setPage(1); }}
                            options={[
                                { label: t("All"), value: "all" },
                                { label: t("WithImage"), value: "with_image" },
                                { label: t("WithoutImage"), value: "without_image" },
                            ]}
                            placeholder={t("Filter")}
                        />
                        <Button variant="outline" size="icon" onClick={fetchCategories} className="h-8 w-8 md:h-9 md:w-9 rounded-full border-border/60 hover:border-foreground/30">
                            <RefreshCw className={loading ? "animate-spin" : ""} />
                        </Button>
                        <Button onClick={() => { setSelectedCategory(null); setIsEditOpen(true); }} className="font-semibold rounded-full px-4 md:px-6 gap-2 shadow-sm border border-border/60 bg-foreground text-background hover:bg-foreground/90">
                            <Plus className="h-5 w-5 stroke-[3]" />
                            {t("AddCategory")}
                        </Button>
                    </div>
                </div>
            </div>

            <DashboardTable headers={[
                t("Images"),
                t("NameEn"),
                t("Slug"),
                t("CreatedAt"),
                t("Actions")
            ]}>
                {categories.map((category) => (
                    <DashboardTableRow key={category.id}>
                        <DashboardTableCell>
                            <div className="h-14 w-14 rounded-xl overflow-hidden border border-border/60 bg-background/60 p-1 group">
                                {category.image_url ? (
                                    <img src={category.image_url} alt="" className="h-full w-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-105" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-muted-foreground/60">
                                        <ImageIcon className="h-6 w-6 opacity-30" />
                                    </div>
                                )}
                            </div>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <span className="font-semibold tracking-tight text-sm">{isAr ? category.name_ar : category.name_en}</span>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <span className="text-[10px] uppercase font-medium text-muted-foreground bg-foreground/[0.05] px-3 py-1 rounded-full border border-border/60">
                                {isAr ? category.slug_ar : category.slug_en}
                            </span>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <span className="text-xs text-muted-foreground font-medium">
                                {new Date(category.created_at).toLocaleDateString(locale)}
                            </span>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(category)} className="h-9 w-9 rounded-full hover:bg-foreground/[0.06] hover:text-foreground transition-all">
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(category)} className="h-9 w-9 rounded-full hover:bg-rose-500/10 hover:text-rose-600 transition-all">
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
            />

            <DashboardModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title={selectedCategory ? t("EditCategory") : t("AddCategory")}
                description={selectedCategory ? (isAr ? selectedCategory.name_ar : selectedCategory.name_en) : t("AddCategoryDescription")}
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
                            form="category-form"
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