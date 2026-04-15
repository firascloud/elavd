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
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import { supabaseBrowser } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Edit2, Trash2, Plus, RefreshCw, Layers, ImageIcon } from "lucide-react";
import SubCategoryForm from "./SubCategoryForm";
import DeleteSubCategory from "./DeleteSubCategory";
import { toast } from "sonner";

export default function SubCategoryList() {
    const t = useTranslations("dashboard");
    const locale = useLocale();
    const isAr = locale === "ar";

    const [subCategories, setSubCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [imageFilter, setImageFilter] = useState<string>("all");
    const [totalCount, setTotalCount] = useState<number>(0);

    const fetchSubCategories = async () => {
        setLoading(true);
        let query = supabaseBrowser
            .from('sub_categories')
            .select('*, categories(name_en, name_ar)', { count: 'exact' });

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
            console.error("Error fetching sub-categories:", error);
            toast.error(t("FailedLoadSubCategories"));
        } else {
            setSubCategories(data || []);
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
        fetchSubCategories();
    }, [page, search, imageFilter]);

    const handleEdit = (subCat: any) => {
        setSelectedSubCategory(subCat);
        setIsEditOpen(true);
    };

    const handleDelete = (subCat: any) => {
        setSelectedSubCategory(subCat);
        setIsDeleteOpen(true);
    };

    const handleSuccess = () => {
        setIsEditOpen(false);
        setIsDeleteOpen(false);
        fetchSubCategories();
        toast.success(t("Done"));
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <DashboardHeader
                title={t("SubCategories")}
                description={t("SubCategoriesDescription")}
                actions={
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={fetchSubCategories}
                            className="h-12 w-12 rounded-2xl border-border/40 bg-background/40 hover:bg-background/60 transition-all duration-300 shadow-sm shrink-0"
                        >
                            <RefreshCw className={cn("h-5 w-5 text-muted-foreground", loading && "animate-spin")} />
                        </Button>
                        <Button
                            onClick={() => { setSelectedSubCategory(null); setIsEditOpen(true); }}
                            className="h-12 px-6 rounded-2xl font-bold ltr:tracking-tight gap-2.5 shadow-xl shadow-foreground/10 border-none bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 whitespace-nowrap"
                        >
                            <Plus className="h-5 w-5 stroke-[3]" />
                            <span>{t("AddSubCategory")}</span>
                        </Button>
                    </div>
                }
            >
                <DashboardSearch
                    placeholder={t("SearchSubCategories")}
                    onChange={(val) => { setSearch(val); setPage(1); }}
                    className="w-full lg:w-[32rem]"
                />

                <div className="flex flex-wrap items-center gap-3 justify-end flex-1">
                    <DashboardSelectFilter
                        value={imageFilter}
                        onChange={(val) => { setImageFilter(val); setPage(1); }}
                        options={[
                            { label: t("All"), value: "all" },
                            { label: t("WithImage"), value: "with_image" },
                            { label: t("WithoutImage"), value: "without_image" },
                        ]}
                        placeholder={t("Filter")}
                        className="w-full sm:w-[180px]"
                    />
                </div>
            </DashboardHeader>

            <DashboardTable headers={[
                t("Images"),
                t("NameEn"),
                t("Category"),
                t("Slug"),
                t("CreatedAt"),
                t("Actions")
            ]}
                headerClasses={["", "", "", "hidden sm:table-cell", "hidden md:table-cell", ""]}
                isLoading={loading}
                emptyMessage={t("NoSubCategoriesFound") || "No sub-categories found."}
            >
                {subCategories.map((subCat) => (
                    <DashboardTableRow key={subCat.id}>
                        <DashboardTableCell>
                            <div className="h-14 w-14 rounded-xl overflow-hidden border border-border/60 bg-background/60 p-1 group">
                                {subCat.image_url ? (
                                    <img src={subCat.image_url} alt="" className="h-full w-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-105" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-muted-foreground/60">
                                        <ImageIcon className="h-6 w-6 opacity-30" />
                                    </div>
                                )}
                            </div>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <span className="font-semibold ltr:tracking-tight text-sm">{isAr ? subCat.name_ar : subCat.name_en}</span>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <span className="text-xs font-semibold px-3 py-1 bg-primary/5 text-primary border border-primary/20 rounded-full">
                                {isAr ? subCat.categories?.name_ar : subCat.categories?.name_en}
                            </span>
                        </DashboardTableCell>
                        <DashboardTableCell className="hidden sm:table-cell">
                            <span className="text-[10px] uppercase font-medium text-muted-foreground bg-foreground/[0.05] px-3 py-1 rounded-full border border-border/60">
                                {isAr ? subCat.slug_ar : subCat.slug_en}
                            </span>
                        </DashboardTableCell>
                        <DashboardTableCell className="hidden md:table-cell">
                            <span className="text-xs text-muted-foreground font-medium">
                                {new Date(subCat.created_at).toLocaleDateString(locale)}
                            </span>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(subCat)} className="h-9 w-9 rounded-full hover:bg-foreground/[0.06] hover:text-foreground transition-all">
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(subCat)} className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive transition-all">
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

            <DashboardModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title={selectedSubCategory ? t("EditSubCategory") : t("AddSubCategory")}
                description={selectedSubCategory ? (isAr ? selectedSubCategory.name_ar : selectedSubCategory.name_en) : t("AddSubCategoryDescription")}
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
                            form="subcategory-form"
                        >
                            {t("Save")}
                        </Button>
                    </div>
                }
            >
                <SubCategoryForm
                    initialData={selectedSubCategory}
                    onSuccess={handleSuccess}
                    onCancel={() => setIsEditOpen(false)}
                    formId="subcategory-form"
                />
            </DashboardModal>

            <DeleteSubCategory
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onSuccess={handleSuccess}
                subCategory={selectedSubCategory}
            />
        </div>
    );
}
