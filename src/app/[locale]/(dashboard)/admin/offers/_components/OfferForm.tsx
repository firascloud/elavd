"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DashboardImageUpload
} from "@/app/[locale]/(dashboard)/_components/common/Modal";
import { useTranslations } from "next-intl";
import { supabaseBrowser } from "@/lib/supabase/client";
import { insertRecord, updateRecord } from "@/app/actions/db";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Package, FileText, ImageIcon, Globe, Plus, RefreshCw, Megaphone, Calendar, Link as LinkIcon, Layers } from "lucide-react";
import TextEditor from "@/components/TextEditor";

interface OfferFormProps {
    initialData?: any;
    onSuccess: () => void;
    onCancel: () => void;
    formId?: string;
}

export default function OfferForm({ initialData, onSuccess, onCancel, formId }: OfferFormProps) {
    const t = useTranslations("dashboard");
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [subCategories, setSubCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, setValue, watch, control } = useForm({
        defaultValues: initialData || {
            type: "both",
            title_en: "",
            title_ar: "",
            description_en: "",
            description_ar: "",
            image_url: "",
            link: "",
            product_id: null,
            category_id: null,
            sub_category_id: null,
            is_active: true,
            position: 0,
            start_date: "",
            end_date: "",
            seo_title_en: "",
            seo_title_ar: "",
            seo_description_en: "",
            seo_description_ar: "",
            seo_keywords_en: "",
            seo_keywords_ar: "",
        }
    });

    const offerType = watch("type");
    const imageUrl = watch("image_url");

    useEffect(() => {
        const fetchData = async () => {
            const [
                { data: prods },
                { data: cats },
                { data: subCats }
            ] = await Promise.all([
                supabaseBrowser.from('products').select('id, name_en, name_ar'),
                supabaseBrowser.from('categories').select('id, name_en, name_ar'),
                supabaseBrowser.from('sub_categories').select('id, name_en, name_ar, category_id')
            ]);
            if (prods) setProducts(prods);
            if (cats) setCategories(cats);
            if (subCats) setSubCategories(subCats);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!initialData) return;
        Object.entries(initialData).forEach(([key, val]) => {
            setValue(key as any, val as any, { shouldDirty: false });
        });
        if (initialData.image_url && typeof initialData.image_url === "string" && !/^https?:\/\//.test(initialData.image_url)) {
            const { data } = supabaseBrowser.storage.from('offers').getPublicUrl(initialData.image_url);
            if (data?.publicUrl) {
                setValue("image_url", data.publicUrl, { shouldDirty: false });
            }
        }
    }, [initialData, setValue]);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const finalData = {
                ...data,
                product_id: data.product_id === "none" ? null : data.product_id,
                category_id: data.category_id === "none" ? null : data.category_id,
                sub_category_id: data.sub_category_id === "none" ? null : data.sub_category_id,
                start_date: data.start_date || null,
                end_date: data.end_date || null,
                seo_keywords_en: typeof data.seo_keywords_en === 'string' ? data.seo_keywords_en.split(',').map((k: string) => k.trim()).filter(Boolean) : data.seo_keywords_en,
                seo_keywords_ar: typeof data.seo_keywords_ar === 'string' ? data.seo_keywords_ar.split(',').map((k: string) => k.trim()).filter(Boolean) : data.seo_keywords_ar,
            };

            if (initialData?.id) {
                await updateRecord('offers', finalData, initialData.id);
            } else {
                await insertRecord('offers', finalData);
            }
            onSuccess();
        } catch (error: any) {
            console.error("Error saving offer:", error);
            toast.error(error.message || "Error saving offer");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <div className="max-h-[70vh] overflow-y-auto pe-2 custom-scrollbar space-y-12 py-2 px-1">
                <section className="space-y-6">
                    <div className="flex items-center gap-4 transition-all group">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary ring-1 ring-primary/20 transition-transform">
                            <Megaphone className="h-5 w-5 stroke-[2]" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold ltr:tracking-tight text-foreground">{t("General")}</h3>
                            <p className="text-[11px] font-medium text-muted-foreground">{t("BasicInfo")}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-background/60 border border-border/60">
                            <div className="space-y-2 group">
                                <Label className="text-[11px] font-semibold text-muted-foreground mb-1 block group-focus-within:text-foreground transition-colors">
                                    {t("Type")}
                                </Label>
                                <Controller
                                    name="type"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value || "both"}>
                                            <SelectTrigger className="h-11 rounded-xl border-border/60 bg-background/60 shadow-sm transition-all focus:ring-2 focus:ring-primary/10 focus:border-border px-4 font-medium text-sm">
                                                <SelectValue placeholder={t("SelectTypePlaceholder")} />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-border/60 shadow-xl bg-background/95 backdrop-blur-md z-[9999]">
                                                <SelectItem value="both" className="py-2.5 px-4 focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer font-medium text-sm">{t("OfferTypeBoth")}</SelectItem>
                                                <SelectItem value="image" className="py-2.5 px-4 focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer font-medium text-sm">{t("OfferTypeImage")}</SelectItem>
                                                <SelectItem value="text" className="py-2.5 px-4 focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer font-medium text-sm">{t("OfferTypeText")}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            <div className="space-y-2 group">
                                <Label className="text-[11px] font-semibold text-muted-foreground mb-1 block group-focus-within:text-foreground transition-colors">
                                    {t("Position")}
                                </Label>
                                <Input {...register("position")} type="number" className="h-11 rounded-xl border-border/60 bg-background/60 shadow-sm transition-all focus:ring-2 focus:ring-primary/10 focus:border-border px-4 font-medium text-sm" />
                            </div>
                        </div>

                        {offerType !== "image" && (
                            <>
                                {[
                                    { label: t("TitleEn"), name: "title_en", required: true },
                                    { label: t("TitleAr"), name: "title_ar", required: true }
                                ].map((field) => (
                                    <div key={field.name} className="space-y-2 group">
                                        <Label className="text-[11px] font-semibold text-muted-foreground mb-1 block group-focus-within:text-foreground transition-colors">
                                            {field.label}
                                        </Label>
                                        <Input
                                            {...register(field.name as any, { required: field.required })}
                                            className="h-11 rounded-xl border-border/60 bg-background/60 shadow-sm transition-all focus:ring-2 focus:ring-primary/10 focus:border-border px-4 font-medium text-sm"
                                        />
                                    </div>
                                ))}
                            </>
                        )}

                        {[
                            { label: t("DescriptionEn"), name: "description_en" },
                            { label: t("DescriptionAr"), name: "description_ar" },
                        ].map((area) => (
                            <div key={area.name} className="space-y-2 md:col-span-1">
                                <Label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                                    {area.label}
                                </Label>
                                <Controller
                                    control={control}
                                    name={area.name as any}
                                    render={({ field }) => (
                                        <TextEditor
                                            value={field.value}
                                            onChange={(text, html) => field.onChange(html)}
                                            dir={area.name.endsWith("_ar") ? "rtl" : "ltr"}
                                        />
                                    )}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="flex items-center gap-4 transition-all group">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary ring-1 ring-primary/20 transition-transform">
                            <LinkIcon className="h-5 w-5 stroke-[2]" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold ltr:tracking-tight text-foreground">{t("LinkingConnectivity")}</h3>
                            <p className="text-[11px] font-medium text-muted-foreground">{t("TargetProductCategory")}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                        <div className="space-y-2 group">
                            <Label className="text-[11px] font-semibold text-muted-foreground mb-1 block group-focus-within:text-foreground transition-colors">
                                {t("Product")}
                            </Label>
                            <Controller
                                name="product_id"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value || "none"}>
                                        <SelectTrigger className="h-11 rounded-xl border-border/60 bg-background/60 shadow-sm transition-all focus:ring-2 focus:ring-primary/10 focus:border-border px-4 font-medium text-sm">
                                            <SelectValue placeholder={t("LinkToProduct")} />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-border/60 shadow-xl bg-background/95 backdrop-blur-md z-[9999]">
                                            <SelectItem value="none" className="py-2.5 px-4 focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer font-medium text-sm">{t("None")}</SelectItem>
                                            {products.map(p => (
                                                <SelectItem key={p.id} value={p.id} className="py-2.5 px-4 focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer font-medium text-sm">{p.name_en}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="space-y-2 group">
                            <Label className="text-[11px] font-semibold text-muted-foreground mb-1 block group-focus-within:text-foreground transition-colors">
                                {t("Category")}
                            </Label>
                            <Controller
                                name="category_id"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={(val) => { field.onChange(val); setValue("sub_category_id", null); }} value={field.value || "none"}>
                                        <SelectTrigger className="h-11 rounded-xl border-border/60 bg-background/60 shadow-sm transition-all focus:ring-2 focus:ring-primary/10 focus:border-border px-4 font-medium text-sm">
                                            <SelectValue placeholder={t("LinkToCategory")} />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-border/60 shadow-xl bg-background/95 backdrop-blur-md z-[9999]">
                                            <SelectItem value="none" className="py-2.5 px-4 focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer font-medium text-sm">{t("None")}</SelectItem>
                                            {categories.map(c => (
                                                <SelectItem key={c.id} value={c.id} className="py-2.5 px-4 focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer font-medium text-sm">{c.name_en}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="space-y-2 group">
                            <Label className="text-[11px] font-semibold text-muted-foreground mb-1 block group-focus-within:text-foreground transition-colors">
                                {t("SubCategory")}
                            </Label>
                            <Controller
                                name="sub_category_id"
                                control={control}
                                render={({ field }) => {
                                    const selectedCategoryId = watch("category_id");
                                    const filteredSubs = subCategories.filter(sc => sc.category_id === selectedCategoryId);
                                    return (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || "none"}
                                            disabled={!selectedCategoryId || selectedCategoryId === "none"}
                                        >
                                            <SelectTrigger className="h-11 rounded-xl border-border/60 bg-background/60 shadow-sm transition-all focus:ring-2 focus:ring-primary/10 focus:border-border px-4 font-medium text-sm">
                                                <SelectValue placeholder={t("SubCategory")} />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-border/60 shadow-xl bg-background/95 backdrop-blur-md z-[9999]">
                                                <SelectItem value="none" className="py-2.5 px-4 focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer font-medium text-sm">{t("None")}</SelectItem>
                                                {filteredSubs.map(sc => (
                                                    <SelectItem key={sc.id} value={sc.id} className="py-2.5 px-4 focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer font-medium text-sm">{sc.name_en}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    );
                                }}
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2 group">
                            <Label className="text-[11px] font-semibold text-muted-foreground mb-1 block group-focus-within:text-foreground transition-colors">
                                {t("CustomLink")} ({t("Link")})
                            </Label>
                            <Input {...register("link")} placeholder="https://..." className="h-11 rounded-xl border-border/60 bg-background/60 shadow-sm transition-all focus:ring-2 focus:ring-primary/10 focus:border-border px-4 font-medium text-sm" />
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="flex items-center gap-4 transition-all group">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary ring-1 ring-primary/20 transition-transform">
                            <Calendar className="h-5 w-5 stroke-[2]" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold ltr:tracking-tight text-foreground">{t("Timeline")}</h3>
                            <p className="text-[11px] font-medium text-muted-foreground">{t("StartEndDates")}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                        <div className="space-y-2 group">
                            <Label className="text-[11px] font-semibold text-muted-foreground mb-1 block group-focus-within:text-foreground transition-colors">
                                {t("StartDate")}
                            </Label>
                            <Input {...register("start_date")} type="datetime-local" className="h-11 rounded-xl border-border/60 bg-background/60 shadow-sm transition-all focus:ring-2 focus:ring-primary/10 focus:border-border px-4 font-medium text-sm" />
                        </div>
                        <div className="space-y-2 group">
                            <Label className="text-[11px] font-semibold text-muted-foreground mb-1 block group-focus-within:text-foreground transition-colors">
                                {t("EndDate")}
                            </Label>
                            <Input {...register("end_date")} type="datetime-local" className="h-11 rounded-xl border-border/60 bg-background/60 shadow-sm transition-all focus:ring-2 focus:ring-primary/10 focus:border-border px-4 font-medium text-sm" />
                        </div>

                        <div className="md:col-span-2 flex items-center gap-4 bg-background/60 p-6 rounded-2xl border border-border/60 shadow-sm">
                            <Switch
                                checked={watch("is_active")}
                                onCheckedChange={(val) => setValue("is_active", val)}
                                className="data-[state=checked]:bg-secondary scale-90"
                            />
                            <Label className="text-sm font-medium text-muted-foreground"> {t("ActiveStatus")}</Label>
                        </div>
                    </div>
                </section>

                {offerType !== "text" && (
                    <section className="space-y-6">
                        <div className="flex items-center gap-4 transition-all group">
                            <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center text-accent ring-1 ring-accent/20 transition-transform">
                                <ImageIcon className="h-5 w-5 stroke-[2]" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold ltr:tracking-tight text-foreground">{t("VisualAsset")}</h3>
                                <p className="text-[11px] font-medium text-muted-foreground">{t("OfferBannerImage")}</p>
                            </div>
                        </div>

                        <div className="bg-background/60 border border-dashed border-border/60 rounded-2xl p-10 flex flex-col items-center hover:bg-foreground/[0.02] transition-colors">
                            <DashboardImageUpload
                                value={imageUrl}
                                onUpload={(url) => setValue("image_url", url)}
                                bucket="offers"
                            />
                            <div className="mt-6 text-center space-y-1">
                                <p className="text-[11px] font-semibold ltr:tracking-wide text-foreground/80">{t("ImageUrl")}</p>
                                <p className="text-[11px] font-medium text-muted-foreground/80">{t("ImageRecommendedSizeOffer")}</p>
                            </div>
                        </div>
                    </section>
                )}

                <section className="space-y-6">
                    <div className="flex items-center gap-4 transition-all group">
                        <div className="h-9 w-9 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary ring-1 ring-secondary/20 transition-transform">
                            <Globe className="h-5 w-5 stroke-[2]" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold ltr:tracking-tight text-foreground">{t("SEO")} {t("Settings")}</h3>
                            <p className="text-[11px] font-medium text-muted-foreground">{t("SearchOptimization")}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8">
                        {[
                            { label: t("SEOTitleEn"), name: "seo_title_en" },
                            { label: t("SEOTitleAr"), name: "seo_title_ar" },
                            { label: t("SEODescEn"), name: "seo_description_en", area: true },
                            { label: t("SEODescAr"), name: "seo_description_ar", area: true },
                            { label: t("Keywords") + " (EN)", name: "seo_keywords_en", placeholder: t("KeywordsOfferPlaceholder") },
                            { label: t("Keywords") + " (AR)", name: "seo_keywords_ar", placeholder: t("KeywordsOfferPlaceholder") }
                        ].map((seo) => (
                            <div key={seo.name} className={`space-y-2 ${seo.area ? 'md:col-span-2' : ''}`}>
                                <Label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                                    {seo.label}
                                </Label>
                                {seo.area ? (
                                    <Textarea {...register(seo.name as any)} className="h-24 rounded-xl border-border/60 bg-background/60 shadow-sm transition-all focus:ring-2 focus:ring-primary/10 focus:border-border p-4 font-medium text-sm" />
                                ) : (
                                    <Input
                                        {...register(seo.name as any)}
                                        placeholder={seo.placeholder}
                                        className="h-11 rounded-xl border-border/60 bg-background/60 shadow-sm transition-all focus:ring-2 focus:ring-primary/10 focus:border-border px-4 font-medium text-sm"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </form>
    );
}
