"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DashboardImageUpload
} from "@/app/[locale]/(dashboard)/_components/common/Modal";
import { useTranslations } from "next-intl";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Label } from "@/components/ui/label";
import { ImageIcon, Globe, Layers, Type } from "lucide-react";

interface BrandFormProps {
    initialData?: any;
    onSuccess: () => void;
    onCancel: () => void;
    formId?: string;
}

export default function BrandForm({ initialData, onSuccess, onCancel, formId }: BrandFormProps) {
    const t = useTranslations("dashboard");
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, setValue, watch } = useForm({
        defaultValues: initialData || {
            name_en: "",
            name_ar: "",
            slug_en: "",
            slug_ar: "",
            brand_index_en: "",
            brand_index_ar: "",
            image_url: "",
        }
    });

    const imageUrl = watch("image_url");

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const { id: _id, created_at: _createdAt, updated_at: _updatedAt, ...cleanData } = data;

            // Handle empty strings for optional fields
            if (!cleanData.brand_index_en) delete cleanData.brand_index_en;
            if (!cleanData.brand_index_ar) delete cleanData.brand_index_ar;

            if (initialData?.id) {
                const { error } = await supabaseBrowser
                    .from('brands')
                    .update(cleanData)
                    .eq('id', initialData.id);
                if (error) throw error;
            } else {
                const { error } = await supabaseBrowser
                    .from('brands')
                    .insert([cleanData]);
                if (error) throw error;
            }
            onSuccess();
        } catch (error: any) {
            console.error("Error saving brand:", error);
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
                            <h3 className="text-base font-semibold tracking-tight text-foreground">{t("General")}</h3>
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

                {/* Section: Indexing */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4 transition-all group">
                        <div className="h-9 w-9 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary ring-1 ring-secondary/20 transition-transform">
                            <Type className="h-5 w-5 stroke-[2]" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold tracking-tight text-foreground">{t("Indexing")}</h3>
                            <p className="text-[11px] font-medium text-muted-foreground">{t("Optional")}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                        {[
                            { label: t("BrandIndexEn"), name: "brand_index_en" },
                            { label: t("BrandIndexAr"), name: "brand_index_ar" }
                        ].map((field) => (
                            <div key={field.name} className="space-y-2 group">
                                <Label className="text-[11px] font-semibold text-muted-foreground mb-1 block group-focus-within:text-foreground transition-colors">
                                    {field.label}
                                </Label>
                                <Input
                                    {...register(field.name)}
                                    maxLength={1}
                                    className="h-11 rounded-xl border-border/60 bg-background/60 shadow-sm transition-all focus:ring-2 focus:ring-primary/10 focus:border-border px-4 font-medium text-sm"
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
                            <h3 className="text-base font-semibold tracking-tight text-foreground">{t("Images")}</h3>
                            <p className="text-[11px] font-medium text-muted-foreground">{t("VisualBrand")}</p>
                        </div>
                    </div>

                    <div className="bg-background/60 border border-dashed border-border/60 rounded-2xl p-10 flex flex-col items-center hover:bg-foreground/[0.02] transition-colors">
                        <DashboardImageUpload
                            value={imageUrl}
                            onUpload={(url) => setValue("image_url", url)}
                            bucket="brands"
                        />
                        <div className="mt-6 text-center space-y-1">
                            <p className="text-[11px] font-semibold tracking-wide text-foreground/80">{t("ImageUrl")}</p>
                            <p className="text-[11px] font-medium text-muted-foreground/80">{t("ImageRecommendedSizeCategory")}</p>
                        </div>
                    </div>
                </section>
            </div>
        </form>
    );
}
