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
import { Edit2, Trash2, Plus, RefreshCw, ImageIcon } from "lucide-react";
import BrandForm from "./BrandForm";
import DeleteBrand from "./DeleteBrand";
import { toast } from "sonner";

export default function BrandList() {
    const t = useTranslations("dashboard");
    const locale = useLocale();
    const isAr = locale === "ar";

    const [brands, setBrands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<any>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [imageFilter, setImageFilter] = useState<string>("all");
    const [totalCount, setTotalCount] = useState<number>(0);

    const fetchBrands = async () => {
        setLoading(true);
        let query = supabaseBrowser
            .from('brands')
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
            console.error("Error fetching brands:", error);
            toast.error(t("FailedLoadBrands") || "Failed to load brands");
        } else {
            setBrands(data || []);
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
        fetchBrands();
    }, [page, search, imageFilter]);

    const handleEdit = (brand: any) => {
        setSelectedBrand(brand);
        setIsEditOpen(true);
    };

    const handleDelete = (brand: any) => {
        setSelectedBrand(brand);
        setIsDeleteOpen(true);
    };

    const handleSuccess = () => {
        setIsEditOpen(false);
        setIsDeleteOpen(false);
        fetchBrands();
        toast.success(t("Done"));
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <DashboardHeader
                title={t("Brands")}
                description={t("BrandsDescription")}
                actions={
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={fetchBrands}
                            className="h-12 w-12 rounded-2xl border-border/40 bg-background/40 hover:bg-background/60 transition-all duration-300 shadow-sm shrink-0"
                        >
                            <RefreshCw className={cn("h-5 w-5 text-muted-foreground", loading && "animate-spin")} />
                        </Button>
                        <Button
                            onClick={() => { setSelectedBrand(null); setIsEditOpen(true); }}
                            className="h-12 px-6 rounded-2xl font-bold tracking-tight gap-2.5 shadow-xl shadow-foreground/10 border-none bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 whitespace-nowrap"
                        >
                            <Plus className="h-5 w-5 stroke-[3]" />
                            <span>{t("AddBrand")}</span>
                        </Button>
                    </div>
                }
            >
                <DashboardSearch
                    placeholder={t("SearchBrands")}
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
                t("Slug"),
                t("CreatedAt"),
                t("Actions")
            ]}
                headerClasses={["", "", "hidden sm:table-cell", "hidden md:table-cell", ""]}
                isLoading={loading}
                emptyMessage={t("NoBrandsFound") || "No brands found."}
            >
                {brands.map((brand) => (
                    <DashboardTableRow key={brand.id}>
                        <DashboardTableCell>
                            <div className="h-14 w-14 rounded-xl overflow-hidden border border-border/60 bg-background/60 p-1 group">
                                {brand.image_url ? (
                                    <img src={brand.image_url} alt="" className="h-full w-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-105" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-muted-foreground/60">
                                        <ImageIcon className="h-6 w-6 opacity-30" />
                                    </div>
                                )}
                            </div>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <span className="font-semibold tracking-tight text-sm">{isAr ? brand.name_ar : brand.name_en}</span>
                        </DashboardTableCell>
                        <DashboardTableCell className="hidden sm:table-cell">
                            <span className="text-[10px] uppercase font-medium text-muted-foreground bg-foreground/[0.05] px-3 py-1 rounded-full border border-border/60">
                                {isAr ? brand.slug_ar : brand.slug_en}
                            </span>
                        </DashboardTableCell>
                        <DashboardTableCell className="hidden md:table-cell">
                            <span className="text-xs text-muted-foreground font-medium">
                                {new Date(brand.created_at).toLocaleDateString(locale)}
                            </span>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(brand)} className="h-9 w-9 rounded-full hover:bg-foreground/[0.06] hover:text-foreground transition-all">
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(brand)} className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive transition-all">
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
                title={selectedBrand ? t("EditBrand") : t("AddBrand")}
                description={selectedBrand ? (isAr ? selectedBrand.name_ar : selectedBrand.name_en) : t("AddBrandDescription")}
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
                            form="brand-form"
                        >
                            {t("Save")}
                        </Button>
                    </div>
                }
            >
                <BrandForm
                    initialData={selectedBrand}
                    onSuccess={handleSuccess}
                    onCancel={() => setIsEditOpen(false)}
                    formId="brand-form"
                />
            </DashboardModal>

            <DeleteBrand
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onSuccess={handleSuccess}
                brand={selectedBrand}
            />
        </div>
    );
}
