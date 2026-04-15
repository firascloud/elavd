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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Package, FileText, ImageIcon, Globe, Plus, RefreshCw, Layers } from "lucide-react";
import TextEditor from "@/components/TextEditor";

interface CategoryFormProps {
    initialData?: any;
    onSuccess: () => void;
    onCancel: () => void;
    formId?: string;
}

export default function CategoryForm({ initialData, onSuccess, onCancel, formId }: CategoryFormProps) {
    const t = useTranslations("dashboard");
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, setValue, watch, control } = useForm({
        defaultValues: initialData || {
            name_en: "",
            name_ar: "",
            slug_en: "",
            slug_ar: "",
            description_en: "",
            description_ar: "",
            image_url: "",
            seo_title_en: "",
            seo_title_ar: "",
            seo_description_en: "",
            seo_description_ar: "",
            seo_keywords_en: "",
            seo_keywords_ar: "",
        }
    });

    const imageUrl = watch("image_url");

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const finalData = {
                ...data,
                seo_keywords_en: typeof data.seo_keywords_en === 'string' ? data.seo_keywords_en.split(',').map((k: string) => k.trim()).filter(Boolean) : data.seo_keywords_en,
                seo_keywords_ar: typeof data.seo_keywords_ar === 'string' ? data.seo_keywords_ar.split(',').map((k: string) => k.trim()).filter(Boolean) : data.seo_keywords_ar,
            };

            const { id: _id, created_at: _createdAt, updated_at: _updatedAt, ...cleanData } = finalData;

            if (initialData?.id) {
                const { error } = await supabaseBrowser
                    .from('categories')
                    .update(cleanData)
                    .eq('id', initialData.id);
                if (error) throw error;
            } else {
                const { error } = await supabaseBrowser
                    .from('categories')
                    .insert([cleanData]);
                if (error) throw error;
            }
            onSuccess();
        } catch (error: any) {
            console.error("Error saving category:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <div className="max-h-[70vh] overflow-y-auto pe-2 custom-scrollbar space-y-12 py-2 px-1">

                {/* Section: General */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4 transition-all group">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary ring-1 ring-primary/20 transition-transform">
                            <Layers className="h-5 w-5 stroke-[2]" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold ltr:tracking-tight text-foreground">{t("General")}</h3>
                            <p className="text-[11px] font-medium text-muted-foreground">{t("BasicInfo")}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                        {[
                            { label: t("NameEn"), name: "name_en", required: true },
                            { label: t("NameAr"), name: "name_ar", required: true },
                            { label: t("SlugEn"), name: "slug_en", required: true },
                            { label: t("SlugAr"), name: "slug_ar", required: true }
                        ].map((field) => (
                            <div key={field.name} className="space-y-2 group">
                                <Label className="text-[11px] font-semibold text-muted-foreground mb-1 block group-focus-within:text-foreground transition-colors">
                                    {field.label}
                                </Label>
                                <Input
                                    {...register(field.name, { required: field.required })}
                                    className="h-11 rounded-xl border-border/60 bg-background/60 shadow-sm transition-all focus:ring-2 focus:ring-primary/10 focus:border-border px-4 font-medium text-sm"
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section: Descriptions */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4 transition-all group">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary ring-1 ring-primary/20 transition-transform">
                            <FileText className="h-5 w-5 stroke-[2]" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold ltr:tracking-tight text-foreground">{t("Descriptions")}</h3>
                            <p className="text-[11px] font-medium text-muted-foreground">{t("LocalizedContent")}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { label: t("DescriptionEn"), name: "description_en", h: "h-24" },
                            { label: t("DescriptionAr"), name: "description_ar", h: "h-24" },
                        ].map((area) => (
                            <div key={area.name} className="space-y-2">
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
                        <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center text-accent ring-1 ring-accent/20 transition-transform">
                            <ImageIcon className="h-5 w-5 stroke-[2]" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold ltr:tracking-tight text-foreground">{t("Images")}</h3>
                            <p className="text-[11px] font-medium text-muted-foreground">{t("VisualBrand")}</p>
                        </div>
                    </div>

                    <div className="bg-background/60 border border-dashed border-border/60 rounded-2xl p-10 flex flex-col items-center hover:bg-foreground/[0.02] transition-colors">
                        <DashboardImageUpload
                            value={imageUrl}
                            onUpload={(url) => setValue("image_url", url)}
                            bucket="categories"
                        />
                        <div className="mt-6 text-center space-y-1">
                            <p className="text-[11px] font-semibold ltr:tracking-wide text-foreground/80">{t("ImageUrl")}</p>
                            <p className="text-[11px] font-medium text-muted-foreground/80">{t("ImageRecommendedSizeCategory")}</p>
                        </div>
                    </div>
                </section>

                {/* Section: SEO */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4 transition-all group">
                        <div className="h-9 w-9 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary ring-1 ring-secondary/20 transition-transform">
                            <Plus className="h-5 w-5 stroke-[2]" />
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
                            { label: t("Keywords") + " (EN)", name: "seo_keywords_en", placeholder: t("KeywordsCategoryPlaceholder") },
                            { label: t("Keywords") + " (AR)", name: "seo_keywords_ar", placeholder: t("KeywordsCategoryPlaceholder") }
                        ].map((seo) => (
                            <div key={seo.name} className={`space-y-2 ${seo.area ? 'md:col-span-2' : ''}`}>
                                <Label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                                    {seo.label}
                                </Label>
                                {seo.area ? (
                                    <Textarea {...register(seo.name)} className="h-24 rounded-xl border-border/60 bg-background/60 shadow-sm transition-all focus:ring-2 focus:ring-primary/10 focus:border-border p-4 font-medium text-sm" />
                                ) : (
                                    <Input
                                        {...register(seo.name)}
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
