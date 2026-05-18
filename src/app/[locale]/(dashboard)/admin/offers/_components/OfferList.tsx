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
import { Edit2, Trash2, Plus, RefreshCw, Megaphone, ImageIcon, Calendar } from "lucide-react";
import OfferForm from "./OfferForm";
import DeleteOffer from "./DeleteOffer";
import { toast } from "sonner";

export default function OfferList() {
    const t = useTranslations("dashboard");
    const locale = useLocale();
    const isAr = locale === "ar";

    const [offers, setOffers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<any>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [totalCount, setTotalCount] = useState<number>(0);

    const fetchOffers = async () => {
        setLoading(true);
        let query = supabaseBrowser
            .from('offers')
            .select('*, sub_categories(name_en, name_ar)', { count: 'exact' });

        if (search) {
            query = query.or(`title_en.ilike.%${search}%,title_ar.ilike.%${search}%`);
        }

        if (statusFilter === "active") {
            query = query.eq('is_active', true);
        } else if (statusFilter === "inactive") {
            query = query.eq('is_active', false);
        } else if (statusFilter === "banner") {
            query = query.eq('type', 'banner');
        }

        const pageSize = 10;
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        const { data, count, error } = await query
            .order('position', { ascending: true })
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) {
            console.error("Error fetching offers:", error);
            toast.error(t("FailedLoadOffers"));
        } else {
            // Normalize image URLs to public URLs if needed
            const normalized = (data || []).map((o) => {
                if (o?.image_url && typeof o.image_url === "string" && !/^https?:\/\//.test(o.image_url)) {
                    const { data: pub } = supabaseBrowser.storage.from('offers').getPublicUrl(o.image_url);
                    return { ...o, image_url: pub?.publicUrl || o.image_url };
                }
                return o;
            });
            setOffers(normalized);
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
        fetchOffers();
    }, [page, search, statusFilter]);

    const handleEdit = (offer: any) => {
        setSelectedOffer(offer);
        setIsEditOpen(true);
    };

    const handleDelete = (offer: any) => {
        setSelectedOffer(offer);
        setIsDeleteOpen(true);
    };

    const handleSuccess = () => {
        setIsEditOpen(false);
        setIsDeleteOpen(false);
        fetchOffers();
        toast.success(t("Done"));
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <DashboardHeader
                title={t("Offers")}
                description={t("OffersDescription")}
                actions={
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={fetchOffers}
                            className="h-12 w-12 rounded-2xl border-border/40 bg-background/40 hover:bg-background/60 transition-all duration-300 shadow-sm shrink-0"
                        >
                            <RefreshCw className={cn("h-5 w-5 text-muted-foreground", loading && "animate-spin")} />
                        </Button>
                        <Button
                            onClick={() => { setSelectedOffer(null); setIsEditOpen(true); }}
                            className="h-12 px-6 rounded-2xl font-bold ltr:tracking-tight gap-2.5 shadow-xl shadow-foreground/10 border-none bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 whitespace-nowrap"
                        >
                            <Plus className="h-5 w-5 stroke-[3]" />
                            <span>{t("AddOffer")}</span>
                        </Button>
                    </div>
                }
            >
                <DashboardSearch
                    placeholder={t("SearchOffers")}
                    onChange={(val) => { setSearch(val); setPage(1); }}
                    className="w-full lg:w-[32rem]"
                />

                <div className="flex flex-wrap items-center gap-3 justify-end flex-1">
                    <DashboardSelectFilter
                        value={statusFilter}
                        onChange={(val) => { setStatusFilter(val); setPage(1); }}
                        options={[
                            { label: t("All"), value: "all" },
                            { label: t("Active"), value: "active" },
                            { label: t("Inactive"), value: "inactive" },
                            { label: t("Banner"), value: "banner" },
                        ]}
                        placeholder={t("Filter")}
                        className="w-full sm:w-[180px]"
                    />
                </div>
            </DashboardHeader>

            <DashboardTable headers={[
                t("Images"),
                t("TitleEn"),
                t("Type"),
                t("SubCategory"),
                t("Timeline"),
                t("Status"),
                t("Actions")
            ]}
                headerClasses={["", "", "hidden sm:table-cell", "hidden md:table-cell", "hidden md:table-cell", "hidden sm:table-cell", ""]}
                isLoading={loading}
                emptyMessage={t("NoOffersFound") || "No offers found."}
            >
                {offers.map((offer) => (
                    <DashboardTableRow key={offer.id}>
                        <DashboardTableCell>
                            <div className="h-14 w-14 rounded-xl overflow-hidden border border-border/60 bg-background/60 p-1 group">
                                {offer.image_url ? (
                                    <img src={offer.image_url} alt="" className="h-full w-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-105" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-muted-foreground/60">
                                        <ImageIcon className="h-6 w-6 opacity-30" />
                                    </div>
                                )}
                            </div>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <div className="flex flex-col">
                                <span className="font-semibold ltr:tracking-tight text-sm">{isAr ? offer.title_ar : offer.title_en}</span>
                                {offer.position > 0 && <span className="text-[10px] text-muted-foreground">{t("Pos")}: {offer.position}</span>}
                            </div>
                        </DashboardTableCell>
                        <DashboardTableCell className="hidden sm:table-cell">
                            <span className="text-[10px] uppercase font-medium text-secondary bg-secondary/5 px-2 py-0.5 rounded-full">
                                {offer.type}
                            </span>
                        </DashboardTableCell>
                        <DashboardTableCell className="hidden md:table-cell">
                            <span className="text-xs font-semibold px-3 py-1 bg-secondary/5 text-secondary border border-secondary/20 rounded-full">
                                {isAr ? offer.sub_categories?.name_ar : offer.sub_categories?.name_en || "-"}
                            </span>
                        </DashboardTableCell>
                        <DashboardTableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{offer.start_date ? new Date(offer.start_date).toLocaleDateString(locale) : "-"}</span>
                                <span>→</span>
                                <span>{offer.end_date ? new Date(offer.end_date).toLocaleDateString(locale) : "-"}</span>
                            </div>
                        </DashboardTableCell>
                        <DashboardTableCell className="hidden sm:table-cell">
                            <div className={`h-2.5 w-2.5 rounded-full ${offer.is_active ? 'bg-secondary' : 'bg-destructive'}`} />
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(offer)} className="h-9 w-9 rounded-full hover:bg-foreground/[0.06] hover:text-foreground transition-all">
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(offer)} className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive transition-all">
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
                title={selectedOffer ? t("EditOffer") : t("AddOffer")}
                description={selectedOffer ? (isAr ? selectedOffer.title_ar : selectedOffer.title_en) : t("AddOfferDescription")}
                className="max-w-5xl"
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
                            form="offer-form"
                        >
                            {t("Save")}
                        </Button>
                    </div>
                }
            >
                <OfferForm
                    initialData={selectedOffer}
                    onSuccess={handleSuccess}
                    onCancel={() => setIsEditOpen(false)}
                    formId="offer-form"
                />
            </DashboardModal>

            <DeleteOffer
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onSuccess={handleSuccess}
                offer={selectedOffer}
            />
        </div>
    );
}
