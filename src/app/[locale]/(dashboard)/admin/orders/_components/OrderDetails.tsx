"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { ShoppingCart, Truck, CreditCard, User as UserIcon, Calendar, Package, MapPin, Receipt, ArrowRight, MessageSquare, Mail } from "lucide-react";
import {
    DashboardTable,
    DashboardTableRow,
    DashboardTableCell
} from "@/app/[locale]/(dashboard)/_components/common/Table";
import { Price } from "@/app/[locale]/(dashboard)/_components/common/Price";

interface OrderDetailsProps {
    order: any;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
    const t = useTranslations("dashboard");
    const locale = useLocale();
    const isAr = locale === "ar";

    if (!order) return null;

    return (
        <div className="space-y-12 py-8 max-h-[75vh] overflow-y-auto pe-4 custom-scrollbar">

            {/* Header / Summary Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: t("ExecutionDate"), value: new Date(order.created_at).toLocaleDateString(locale), icon: <Calendar />, color: "bg-primary/10 text-primary" },
                    { label: t("PaymentMethod"), value: order.payment_method?.toUpperCase() || t("CreditCard"), icon: <CreditCard />, color: "bg-accent/10 text-accent" },
                    { label: t("LogisticsType"), value: t("StandardShipping"), icon: <Truck />, color: "bg-secondary/10 text-secondary" }
                ].map((item, id) => (
                    <div key={id} className="p-6 rounded-2xl bg-background/60 border border-border/60 shadow-sm transition-all group">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-4 ring-1 ring-foreground/10 ${item.color}`}>
                            {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: "h-6 w-6 stroke-[1.5]" })}
                        </div>
                        <p className="text-[11px] font-medium text-muted-foreground mb-1">{item.label}</p>
                        <p className="text-sm font-semibold text-foreground">{item.value}</p>
                    </div>
                ))}
            </div>

            {/* Address & User Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="space-y-6">
                    <div className="flex items-center gap-4 transition-all group">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center text-primary">
                            <MapPin className="h-5 w-5 stroke-[2]" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold ltr:tracking-tight text-foreground">{t("DeliveryPoint")}</h3>
                            <p className="text-[11px] font-medium text-muted-foreground">{t("FinalDestination")}</p>
                        </div>
                    </div>

                    <div className="bg-background/60 border border-border/60 p-6 rounded-2xl space-y-4">
                        <div className="flex gap-4">
                            <div className="h-9 w-9 bg-foreground/[0.06] rounded-full flex-shrink-0 flex items-center justify-center text-muted-foreground">
                                <UserIcon className="h-4 w-4" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-foreground leading-none">{order.customer_name || t("GuestCheckout")}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Mail className="h-3 w-3 text-muted-foreground" />
                                    <p className="text-xs text-muted-foreground">{order.customer_email || t("NoContactInfo")}</p>
                                </div>
                                {order.customer_phone && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <MessageSquare className="h-3 w-3 text-green-500" />
                                        <a
                                            href={`https://wa.me/${order.customer_phone.replace(/\+/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-green-600 font-bold hover:underline"
                                        >
                                            {order.customer_phone}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[11px] font-medium text-muted-foreground">{t("City") || (isAr ? "المدينة" : "City")}</p>
                            <p className="text-xs leading-relaxed text-foreground font-bold">
                                {order.address || t("CityNotProvided") || "—"}
                            </p>
                        </div>
                        <div className="h-px bg-border w-full" />
                        <div className="space-y-2">
                            <p className="text-[11px] font-medium text-muted-foreground">{t("YourMessage") || (isAr ? "سؤال العميل" : "Customer Question")}</p>
                            <p className="text-xs leading-relaxed text-foreground/80 italic">
                                {order.notes || t("NoQuestionProvided") || "—"}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Financial Summary */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4 transition-all group">
                        <div className="h-9 w-9 rounded-lg bg-secondary/10 ring-1 ring-secondary/20 flex items-center justify-center text-secondary">
                            <Receipt className="h-5 w-5 stroke-[2]" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold ltr:tracking-tight text-foreground">{t("FinancialRecap")}</h3>
                            <p className="text-[11px] font-medium text-muted-foreground">{t("LedgerBalance")}</p>
                        </div>
                    </div>

                    <div className="bg-background/60 p-6 rounded-2xl border border-border/60 shadow-sm space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 h-24 w-24 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2" />

                        {[
                            { label: t("Subtotal"), value: order.subtotal || order.total },
                            { label: t("ShippingCost"), value: order.shipping_fee || 0 },
                        ].map((row, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                                <span className="text-xs font-medium text-muted-foreground ltr:tracking-tight">{row.label}</span>
                                <span className="text-sm font-semibold text-foreground font-mono"><Price amount={row.value || 0} /></span>
                            </div>
                        ))}
                        <div className="h-px bg-border w-full" />
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-sm font-semibold text-foreground">{t("Total")}</span>
                            <span className="text-xl font-bold text-foreground font-mono"><Price amount={order.total || 0} /></span>
                        </div>
                    </div>
                </section>
            </div>

            {/* Product Items Table (Assuming items array) */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-foreground" />
                    <h3 className="text-base font-semibold ltr:tracking-tight">{t("ManifestItems")}</h3>
                </div>

                <DashboardTable headers={[
                    t("CatalogItem"),
                    t("Price"),
                    t("Quantity"),
                    t("Total")
                ]}>
                    {(order.items || []).map((item: any) => (
                        <DashboardTableRow key={item.id}>
                            <DashboardTableCell>
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-xl bg-foreground/[0.06] flex items-center justify-center text-muted-foreground text-xs font-mono">
                                        PCK
                                    </div>
                                    <span className="font-medium text-sm ltr:tracking-tight">
                                        {isAr ? item.product_name_ar : item.product_name_en}
                                    </span>
                                </div>
                            </DashboardTableCell>
                            <DashboardTableCell><span className="font-medium text-xs"><Price amount={item.price || 0} /></span></DashboardTableCell>
                            <DashboardTableCell><span className="text-xs font-semibold bg-foreground/[0.06] p-2 rounded-full min-w-[2rem] text-center inline-block">x{item.quantity || 1}</span></DashboardTableCell>
                            <DashboardTableCell><span className="font-semibold text-sm text-foreground font-mono"><Price amount={(item.price || 0) * (item.quantity || 1)} /></span></DashboardTableCell>
                        </DashboardTableRow>
                    ))}
                </DashboardTable>
            </section>
        </div>
    );
}
