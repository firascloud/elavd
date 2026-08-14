"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DashboardImageUpload
} from "@/app/[locale]/(dashboard)/_components/common/Modal";
import { useLocale, useTranslations } from "next-intl";
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
import { Package, FileText, ImageIcon, Globe } from "lucide-react";
import TextEditor from "@/components/TextEditor";
import { insertRecord, updateRecord } from "@/app/actions/db";
import { toast } from "sonner";

interface ProductFormProps {
    initialData?: any;
    onSuccess: () => void;
    onCancel: () => void;
    formId?: string;
}

export default function ProductForm({ initialData, onSuccess, formId }: ProductFormProps) {
    const t = useTranslations("dashboard");
    const locale = useLocale();
    const isAr = locale === "ar";
    const [categories, setCategories] = useState<any[]>([]);
    const [subCategories, setSubCategories] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, setValue, watch, reset, control } = useForm({
        defaultValues: initialData || {
            is_active: true,
            is_featured: false,
            is_popular: false,
            is_event: false,
            price: 0,
            discount_price: 0,
            category_id: initialData?.category_id || "",
            sub_category_id: initialData?.sub_category_id || "",
            brand_id: initialData?.brand_id || "",
            main_image: "",
            sort_order: initialData?.sort_order || 0,
        }
    });

    const mainImageUrl = watch("main_image");
    const selectedCategoryId = watch("category_id");

    useEffect(() => {
        const fetchData = async () => {
            const [
                { data: catData },
                { data: subData },
                { data: brandData }
            ] = await Promise.all([
                supabaseBrowser.from('categories').select('id, name_en, name_ar'),
                supabaseBrowser.from('sub_categories').select('id, name_en, name_ar, category_id'),
                supabaseBrowser.from('brands').select('id, name_en, name_ar')
            ]);
            if (catData) setCategories(catData);
            if (subData) setSubCategories(subData);
            if (brandData) setBrands(brandData);
        };
        fetchData();
    }, []);

    const filteredSubCategories = subCategories.filter(sc => sc.category_id === selectedCategoryId);

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
                sort_order: parseInt(data.sort_order) || 0,
                category_id: (data.category_id && data.category_id !== "none") ? data.category_id : null,
                sub_category_id: (data.sub_category_id && data.sub_category_id !== "none") ? data.sub_category_id : null,
                brand_id: (data.brand_id && data.brand_id !== "none") ? data.brand_id : null,
                seo_keywords_en: toKeywordsArray(data.seo_keywords_en),
                seo_keywords_ar: toKeywordsArray(data.seo_keywords_ar),
            };

            // Remove relational/non-table fields that might come from defaultValues (joins)
            const {
                categories: _categories,
                sub_categories: _sub_categories,
                brands: _brands,
                category: _category,
                sub_category: _sub_category,
                brand: _brand,
                id: _id,
                created_at: _createdAt,
                updated_at: _updatedAt,
                ...cleanData
            } = finalData as any;

            if (initialData?.id) {
                await updateRecord('products', cleanData, initialData.id);
            } else {
                await insertRecord('products', cleanData);
            }
            onSuccess();
        } catch (error: any) {
            console.error("Error saving product:", error);
            toast.error(error.message || "Error saving product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form id={formId} onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">

                <section className="space-y-5 rounded-2xl border border-border/70 bg-muted/[0.14] p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                            <Package className="h-4 w-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-foreground">{t("General")}</h3>
                            <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">{t("BasicInfo")}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {[
                            { label: t("NameEn"), name: "name_en", required: true },
                            { label: t("NameAr"), name: "name_ar", required: true },
                            { label: t("Price"), name: "price", type: "number" },
                            { label: t("DiscountPrice"), name: "discount_price", type: "number" },
                            { label: t("Order"), name: "sort_order", type: "number" }
                        ].map((field) => (
                            <div key={field.name} className="group space-y-1.5">
                                <Label className="block text-[10px] font-bold text-muted-foreground transition-colors group-focus-within:text-primary">
                                    {field.label}
                                </Label>
                                <Input
                                    {...register(field.name, { required: field.required })}
                                    type={field.type || "text"}
                                    step={field.type === "number" ? "0.01" : undefined}
                                    className="h-10 rounded-xl border-border/70 bg-background px-3 text-xs font-semibold shadow-none focus-visible:border-primary/30 focus-visible:ring-primary/10"
                                />
                            </div>
                        ))}

                        <div className="group space-y-1.5">
                            <Label className="block text-[10px] font-bold text-muted-foreground transition-colors group-focus-within:text-primary">
                                {t("Category")}
                            </Label>
                            <Controller
                                name="category_id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(val) => {
                                            field.onChange(val);
                                            setValue("sub_category_id", "");
                                        }}
                                        value={field.value}
                                    >
                                        <SelectTrigger className="h-10 rounded-xl border-border/70 bg-background px-3 text-start text-xs font-semibold shadow-none focus:ring-primary/10">
                                            <SelectValue placeholder={t("Category")} />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-border/60 shadow-xl overflow-hidden bg-background/95 backdrop-blur-md z-[9999]">
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id} className="py-2.5 px-4 focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer font-medium text-sm">
                                                    {(isAr ? cat.name_ar : cat.name_en) || cat.name_en}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="group space-y-1.5">
                            <Label className="block text-[10px] font-bold text-muted-foreground transition-colors group-focus-within:text-primary">
                                {t("SubCategory")}
                            </Label>
                            <Controller
                                name="sub_category_id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={!selectedCategoryId}
                                    >
                                        <SelectTrigger className="h-10 rounded-xl border-border/70 bg-background px-3 text-start text-xs font-semibold shadow-none focus:ring-primary/10">
                                            <SelectValue placeholder={t("SubCategory")} />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-border/60 shadow-xl overflow-hidden bg-background/95 backdrop-blur-md z-[9999]">
                                            <SelectItem value="none" className="py-2.5 px-4 focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer font-medium text-sm opacity-70">
                                                {t("None")}
                                            </SelectItem>
                                            {filteredSubCategories.map((sub) => (
                                                <SelectItem key={sub.id} value={sub.id} className="py-2.5 px-4 focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer font-medium text-sm">
                                                    {(isAr ? sub.name_ar : sub.name_en) || sub.name_en}
                                                </SelectItem>
                                            ))}
                                            {filteredSubCategories.length === 0 && (
                                                <div className="p-4 text-xs text-muted-foreground text-center">{t("None")}</div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="group space-y-1.5">
                            <Label className="block text-[10px] font-bold text-muted-foreground transition-colors group-focus-within:text-primary">
                                {t("Brand")}
                            </Label>
                            <Controller
                                name="brand_id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger className="h-10 rounded-xl border-border/70 bg-background px-3 text-start text-xs font-semibold shadow-none focus:ring-primary/10">
                                            <SelectValue placeholder={t("Brand")} />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-border/60 shadow-xl overflow-hidden bg-background/95 backdrop-blur-md z-[9999]">
                                            <SelectItem value="none" className="py-2.5 px-4 focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer font-medium text-sm  opacity-70">
                                                {t("None")}
                                            </SelectItem>
                                            {brands.map((brand) => (
                                                <SelectItem key={brand.id} value={brand.id} className="py-2.5 px-4 focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer font-medium text-sm">
                                                    {(isAr ? brand.name_ar : brand.name_en) || brand.name_en}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="group space-y-1.5">
                            <Label className="block text-[10px] font-bold text-muted-foreground transition-colors group-focus-within:text-primary">
                                {t("CountryOfOrigin")}
                            </Label>
                            <Input {...register("country_of_origin")} className="h-10 rounded-xl border-border/70 bg-background px-3 text-xs font-semibold shadow-none focus-visible:border-primary/30 focus-visible:ring-primary/10" />
                        </div>

                        <div className="grid grid-cols-2 gap-2 rounded-xl border border-border/60 bg-background p-2 md:col-span-2 xl:col-span-3 xl:grid-cols-4">
                            {[
                                { name: "is_active", label: t("Active") },
                                { name: "is_featured", label: t("Featured") },
                                { name: "is_popular", label: t("Popular") },
                                { name: "is_event", label: t("Event") }
                            ].map((flag) => (
                                <div key={flag.name} className="flex min-h-11 items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-muted/60">
                                    <Label className="text-[10px] font-bold text-foreground/75">
                                        {flag.label}
                                    </Label>
                                    <Switch
                                        checked={watch(flag.name)}
                                        onCheckedChange={(val) => setValue(flag.name, val)}
                                        className="scale-90 data-[state=checked]:bg-secondary"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="space-y-5 rounded-2xl border border-border/70 bg-muted/[0.14] p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                            <FileText className="h-4 w-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-foreground">{t("Descriptions")}</h3>
                            <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">{t("LocalizedContent")}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                        {[
                            { label: t("ShortDescEn"), name: "short_desc_en", h: "h-24" },
                            { label: t("ShortDescAr"), name: "short_desc_ar", h: "h-24" },
                            { label: t("FullDescEn"), name: "full_desc_en", h: "h-40", span: true },
                            { label: t("FullDescAr"), name: "full_desc_ar", h: "h-40", span: true }
                        ].map((area) => (
                            <div key={area.name} className="w-full min-w-0 space-y-1.5">
                                <Label className="block text-[10px] font-bold text-muted-foreground">
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

                <section className="space-y-5 rounded-2xl border border-border/70 bg-muted/[0.14] p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary/10 text-secondary">
                            <ImageIcon className="h-4 w-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-foreground">{t("Images")}</h3>
                            <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">{t("VisualPresentation")}</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center rounded-xl border border-dashed border-border/70 bg-background p-5 transition-colors hover:border-secondary/30 hover:bg-secondary/[0.02] sm:flex-row sm:justify-center sm:gap-6">
                        <DashboardImageUpload
                            value={mainImageUrl}
                            onUpload={(url) => setValue("main_image", url)}
                            bucket="products"
                        />
                        <div className="mt-4 text-center sm:mt-0 sm:text-start">
                            <p className="text-xs font-black text-foreground/80">{t("MainImage")}</p>
                            <p className="mt-1 text-[10px] font-medium text-muted-foreground">{t("ImageRecommendedSizeProduct")}</p>
                        </div>
                    </div>
                </section>

                <section className="space-y-5 rounded-2xl border border-border/70 bg-muted/[0.14] p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary/10 text-secondary">
                            <Globe className="h-4 w-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-foreground">{t("SEO")} {t("Settings")}</h3>
                            <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">{t("SearchOptimization")}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                            <div key={seo.name} className={`space-y-1.5 ${seo.area ? 'md:col-span-2' : ''}`}>
                                <Label className="block text-[10px] font-bold text-muted-foreground">
                                    {seo.label}
                                </Label>
                                {seo.area ? (
                                    <Textarea {...register(seo.name)} className="min-h-20 resize-y rounded-xl border-border/70 bg-background p-3 text-xs font-medium shadow-none focus-visible:border-primary/30 focus-visible:ring-primary/10" />
                                ) : (
                                    <Input
                                        {...register(seo.name, { required: seo.required })}
                                        placeholder={seo.placeholder}
                                        className="h-10 rounded-xl border-border/70 bg-background px-3 text-xs font-semibold shadow-none focus-visible:border-primary/30 focus-visible:ring-primary/10"
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
