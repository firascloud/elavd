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
import { Separator } from "@/components/ui/separator";
import { Package, FileText, ImageIcon, Globe, Plus, RefreshCw } from "lucide-react";
import TextEditor from "@/components/TextEditor";

interface ProductFormProps {
    initialData?: any;
    onSuccess: () => void;
    onCancel: () => void;
    formId?: string;
}

export default function ProductForm({ initialData, onSuccess, onCancel, formId }: ProductFormProps) {
    const t = useTranslations("dashboard");
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, setValue, watch, reset, control } = useForm({
        defaultValues: initialData || {
            is_active: true,
            is_featured: false,
            is_popular: false,
            is_event: false,
            price: 0,
            discount_price: 0,
            main_image: "",
        }
    });

    const mainImageUrl = watch("main_image");

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabaseBrowser
                .from('categories')
                .select('id, name_en, name_ar');
            if (data) setCategories(data);
        };
        fetchCategories();
    }, []);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            // Prepare arrays for keywords and ensure numbers are valid
            const toKeywordsArray = (val: any) => {
                if (Array.isArray(val)) return val;
                if (typeof val === "string") {
                    return val.split(",").map((k: string) => k.trim()).filter(Boolean);
                }
                return [];
            };
            const finalData = {
                ...data,
                price: data.price ? parseFloat(data.price) : null,
                discount_price: data.discount_price ? parseFloat(data.discount_price) : null,
                seo_keywords_en: toKeywordsArray(data.seo_keywords_en),
                seo_keywords_ar: toKeywordsArray(data.seo_keywords_ar),
            };

            // Remove relational/non-table fields that might come from defaultValues (joins)
            const {
                categories: _categories,
                id: _id,
                created_at: _createdAt,
                updated_at: _updatedAt,
                ...cleanData
            } = finalData as any;

            if (initialData?.id) {
                const { error } = await supabaseBrowser
                    .from('products')
                    .update(cleanData)
                    .eq('id', initialData.id);
                if (error) throw error;
            } else {
                const { error } = await supabaseBrowser
                    .from('products')
                    .insert([cleanData]);
                if (error) throw error;
            }
            onSuccess();
        } catch (error: any) {
            console.error("Error saving product:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* Scrollable Container */}
            <div className="max-h-[70vh] overflow-y-auto pe-2 custom-scrollbar space-y-12 py-2 px-1">

                {/* Section: General */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4 transition-all group">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary ring-1 ring-primary/20 transition-transform">
                            <Package className="h-5 w-5 stroke-[2]" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold tracking-tight text-foreground">{t("General")}</h3>
                            <p className="text-[11px] font-medium text-muted-foreground">{t("BasicInfo") || "Basic Info"}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                        {[
                            { label: t("NameEn"), name: "name_en", required: true },
                            { label: t("NameAr"), name: "name_ar", required: true },
                            { label: t("Price"), name: "price", type: "number" },
                            { label: t("DiscountPrice"), name: "discount_price", type: "number" }
                        ].map((field) => (
                            <div key={field.name} className="space-y-2 group">
                                <Label className="text-[11px] font-semibold text-muted-foreground mb-1 block group-focus-within:text-foreground transition-colors">
                                    {field.label}
                                </Label>
                                <Input
                                    {...register(field.name, { required: field.required })}
                                    type={field.type || "text"}
                                    step="0.01"
                                    className="h-11 rounded-xl border-border/60 bg-background/60 shadow-sm transition-all focus:ring-2 focus:ring-primary/10 focus:border-border px-4 font-medium text-sm"
                                />
                            </div>
                        ))}

                        <div className="space-y-2 group">
                            <Label className="text-[11px] font-semibold text-muted-foreground mb-1 block group-focus-within:text-foreground transition-colors">
                                {t("Category")}
                            </Label>
                            <Select onValueChange={(val) => setValue("category_id", val)} defaultValue={initialData?.category_id}>
                                <SelectTrigger className="h-11 rounded-xl border-border/60 bg-background/60 shadow-sm transition-all focus:ring-2 focus:ring-primary/10 focus:border-border px-4 font-medium text-sm">
                                    <SelectValue placeholder={t("Category")} />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border/60 shadow-xl overflow-hidden bg-background/70 backdrop-blur">
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id} className="py-3 px-5 border-b border-border/60 last:border-none focus:bg-foreground transition-colors cursor-pointer font-medium text-sm">
                                            {cat.name_en}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 group">
                            <Label className="text-[11px] font-semibold text-muted-foreground mb-1 block group-focus-within:text-foreground transition-colors">
                                {t("CountryOfOrigin")}
                            </Label>
                            <Input {...register("country_of_origin")} className="h-11 rounded-xl border-border/60 bg-background/60 shadow-sm transition-all focus:ring-2 focus:ring-primary/10 focus:border-border px-4 font-medium text-sm" />
                        </div>

                        {/* Special Flags */}
                        <div className="md:col-span-2 bg-background/60 p-6 rounded-2xl border border-border/60 shadow-sm grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { name: "is_active", label: t("Active") },
                                { name: "is_featured", label: t("Featured") },
                                { name: "is_popular", label: t("Popular") },
                                { name: "is_event", label: t("Event") }
                            ].map((flag) => (
                                <div key={flag.name} className="flex flex-col items-center gap-3">
                                    <Switch
                                        checked={watch(flag.name)}
                                        onCheckedChange={(val) => setValue(flag.name, val)}
                                        className="data-[state=checked]:bg-primary scale-90"
                                    />
                                    <Label className="text-[11px] font-medium text-muted-foreground">
                                        {flag.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section: Descriptions */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4 transition-all group">
                        <div className="h-9 w-9 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 ring-1 ring-orange-500/20 transition-transform">
                            <FileText className="h-5 w-5 stroke-[2]" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold tracking-tight text-foreground">{t("Descriptions")}</h3>
                            <p className="text-[11px] font-medium text-muted-foreground">{t("LocalizedContent")}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        {[
                            { label: t("ShortDescEn"), name: "short_desc_en", h: "h-24" },
                            { label: t("ShortDescAr"), name: "short_desc_ar", h: "h-24" },
                            { label: t("FullDescEn"), name: "full_desc_en", h: "h-40", span: true },
                            { label: t("FullDescAr"), name: "full_desc_ar", h: "h-40", span: true }
                        ].map((area) => (
                            <div key={area.name} className={`space-y-2 w-full ${area.span ? 'md:col-span-1' : ''}`}>
                                <Label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                                    {area.label}
                                </Label>
                                <Controller
                                    control={control}
                                    name={area.name}
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

                {/* Section: Image */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4 transition-all group">
                        <div className="h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 ring-1 ring-purple-500/20 transition-transform">
                            <ImageIcon className="h-5 w-5 stroke-[2]" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold tracking-tight text-foreground">{t("Images")}</h3>
                            <p className="text-[11px] font-medium text-muted-foreground">{t("VisualPresentation")}</p>
                        </div>
                    </div>

                    <div className="bg-background/60 border border-dashed border-border/60 rounded-2xl p-10 flex flex-col items-center hover:bg-foreground/[0.02] transition-colors">
                        <DashboardImageUpload
                            value={mainImageUrl}
                            onUpload={(url) => setValue("main_image", url)}
                            bucket="products"
                        />
                        <div className="mt-6 text-center space-y-1">
                            <p className="text-[11px] font-semibold tracking-wide text-foreground/80">{t("MainImage") || "Primary Image"}</p>
                            <p className="text-[11px] font-medium text-muted-foreground/80">{t("ImageRecommendedSizeProduct")}</p>
                        </div>
                    </div>
                </section>

                {/* Section: SEO */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4 transition-all group">
                        <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 ring-1 ring-green-500/20 transition-transform">
                            <Globe className="h-5 w-5 stroke-[2]" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold tracking-tight text-foreground">{t("SEO")} {t("Settings")}</h3>
                            <p className="text-[11px] font-medium text-muted-foreground">{t("SearchOptimization")}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8">
                        {[
                            { label: t("SlugEnLabel"), name: "slug_en", required: true },
                            { label: t("SlugArLabel"), name: "slug_ar", required: true },
                            { label: t("SEOTitleEn"), name: "seo_title_en" },
                            { label: t("SEOTitleAr"), name: "seo_title_ar" },
                            { label: t("SEODescEn"), name: "seo_description_en", area: true },
                            { label: t("SEODescAr"), name: "seo_description_ar", area: true },
                            { label: t("Keywords") + " (EN)", name: "seo_keywords_en", placeholder: t("KeywordsEnPlaceholder") },
                            { label: t("Keywords") + " (AR)", name: "seo_keywords_ar", placeholder: t("KeywordsArPlaceholder") }
                        ].map((seo) => (
                            <div key={seo.name} className={`space-y-2 ${seo.area ? 'md:col-span-2' : ''}`}>
                                <Label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                                    {seo.label}
                                </Label>
                                {seo.area ? (
                                    <Textarea {...register(seo.name)} className="h-24 rounded-xl border-border/60 bg-background/60 shadow-sm transition-all focus:ring-2 focus:ring-primary/10 focus:border-border p-4 font-medium text-sm" />
                                ) : (
                                    <Input
                                        {...register(seo.name, { required: seo.required })}
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
