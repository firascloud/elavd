"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { ShoppingBag, Truck, CreditCard, User as UserIcon, Calendar, Package, MapPin, Receipt, ArrowRight } from "lucide-react";
import {
    DashboardTable,
    DashboardTableRow,
    DashboardTableCell
} from "@/app/[locale]/(dashboard)/_components/common/Table";

interface OrderDetailsProps {
    order: any;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
    const t = useTranslations("dashboard");
    const locale = useLocale();

    if (!order) return null;

    return (
        <div className="space-y-12 py-8 max-h-[75vh] overflow-y-auto pe-4 custom-scrollbar">

            {/* Header / Summary Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: t("ExecutionDate"), value: new Date(order.created_at).toLocaleDateString(locale), icon: <Calendar />, color: "bg-blue-500/10 text-blue-600" },
                    { label: t("PaymentMethod"), value: order.payment_method?.toUpperCase() || t("CreditCard"), icon: <CreditCard />, color: "bg-purple-500/10 text-purple-600" },
                    { label: t("LogisticsType"), value: t("StandardShipping"), icon: <Truck />, color: "bg-orange-500/10 text-orange-600" }
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
                            <h3 className="text-base font-semibold tracking-tight text-foreground">{t("DeliveryPoint")}</h3>
                            <p className="text-[11px] font-medium text-muted-foreground">{t("FinalDestination")}</p>
                        </div>
                    </div>

                    <div className="bg-background/60 border border-border/60 p-6 rounded-2xl space-y-4">
                        <div className="flex gap-4">
                            <div className="h-9 w-9 bg-foreground/[0.06] rounded-full flex-shrink-0 flex items-center justify-center text-muted-foreground">
                                <UserIcon className="h-4 w-4" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-foreground leading-none">{order.full_name || t("GuestCheckout")}</p>
                                <p className="text-xs text-muted-foreground">{order.email || t("NoContactInfo")}</p>
                            </div>
                        </div>
                        <div className="h-px bg-border w-full" />
                        <div className="space-y-2">
                            <p className="text-[11px] font-medium text-muted-foreground">{t("StreetAddress")}</p>
                            <p className="text-xs leading-relaxed text-foreground/80">
                                {order.shipping_address || t("AddressNotDisclosed")}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Financial Summary */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4 transition-all group">
                        <div className="h-9 w-9 rounded-lg bg-green-500/10 ring-1 ring-green-500/20 flex items-center justify-center text-green-500">
                            <Receipt className="h-5 w-5 stroke-[2]" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold tracking-tight text-foreground">{t("FinancialRecap")}</h3>
                            <p className="text-[11px] font-medium text-muted-foreground">{t("LedgerBalance")}</p>
                        </div>
                    </div>

                    <div className="bg-background/60 p-6 rounded-2xl border border-border/60 shadow-sm space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 h-24 w-24 bg-green-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />

                        {[
                            { label: t("Subtotal"), value: order.total_amount - (order.shipping_cost || 0) },
                            { label: t("ShippingCost"), value: order.shipping_cost || 0 },
                        ].map((row, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                                <span className="text-xs font-medium text-muted-foreground tracking-tight">{row.label}</span>
                                <span className="text-sm font-semibold text-foreground font-mono">${row.value.toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="h-px bg-border w-full" />
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-sm font-semibold text-foreground">{t("Total")}</span>
                            <span className="text-xl font-bold text-foreground font-mono">${order.total_amount.toFixed(2)}</span>
                        </div>
                    </div>
                </section>
            </div>

            {/* Product Items Table (Assuming items array) */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-foreground" />
                    <h3 className="text-base font-semibold tracking-tight">{t("ManifestItems")}</h3>
                </div>

                <DashboardTable headers={[
                    t("CatalogItem"),
                    t("Price"),
                    t("Quantity"),
                    t("Total")
                ]}>
                    {(order.items || [{ id: 1, name: t("SampleItem"), price: order.total_amount, quantity: 1 }]).map((item: any) => (
                        <DashboardTableRow key={item.id}>
                            <DashboardTableCell>
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-xl bg-foreground/[0.06] flex items-center justify-center text-muted-foreground text-xs font-mono">
                                        PCK
                                    </div>
                                    <span className="font-medium text-sm tracking-tight">{item.name || t("DefaultOffering")}</span>
                                </div>
                            </DashboardTableCell>
                            <DashboardTableCell><span className="font-medium text-xs">${(item.price || 0).toFixed(2)}</span></DashboardTableCell>
                            <DashboardTableCell><span className="text-xs font-semibold bg-foreground/[0.06] p-2 rounded-full min-w-[2rem] text-center inline-block">x{item.quantity || 1}</span></DashboardTableCell>
                            <DashboardTableCell><span className="font-semibold text-sm text-foreground font-mono">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span></DashboardTableCell>
                        </DashboardTableRow>
                    ))}
                </DashboardTable>
            </section>
        </div>
    );
}
