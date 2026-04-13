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
import { 
    Eye, 
    RefreshCw, 
    Mail, 
    Phone, 
    Calendar, 
    Clock, 
    CheckCircle2, 
    Trash2, 
    Check, 
    MessageSquare, 
    Archive,
    RotateCcw
} from "lucide-react";
import { toast } from "sonner";
import { contactService } from "@/services/contactService";

export default function ContactList() {
    const t = useTranslations("dashboard");
    const locale = useLocale();
    const isAr = locale === "ar";

    const [contacts, setContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedContact, setSelectedContact] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [totalCount, setTotalCount] = useState<number>(0);

    const fetchContacts = async () => {
        setLoading(true);
        let query = supabaseBrowser
            .from('contacts')
            .select('*', { count: 'exact' });

        if (search) {
            query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
        }

        if (statusFilter !== "all") {
            query = query.eq('status', statusFilter);
        }

        const pageSize = 10;
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        const { data, count, error } = await query
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) {
            console.error("Error fetching contacts:", error);
            toast.error(isAr ? "فشل تحميل الرسائل" : "Failed to load contacts");
        } else {
            setContacts(data || []);
            if (count) {
                setTotalPages(Math.ceil(count / pageSize));
                setTotalCount(count);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchContacts();
    }, [page, search, statusFilter]);

    const handleViewDetails = (contact: any) => {
        setSelectedContact(contact);
        setIsDetailsOpen(true);
        
        if (contact.status === 'new') {
            updateStatus(contact.id, 'read');
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await contactService.updateContactStatus(id, status);
            setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
            toast.success(isAr ? "تم تحديث الحالة بنجاح" : "Status updated successfully");
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error(isAr ? "فشل تحديث الحالة" : "Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(isAr ? "هل أنت متأكد من حذف هذه الرسالة؟" : "Are you sure you want to delete this message?")) return;
        
        const { error } = await supabaseBrowser.from('contacts').delete().eq('id', id);
        if (error) {
            toast.error(t("FailedDeleteMessage"));
        } else {
            toast.success(t("MessageDeleted"));
            fetchContacts();
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-500/10 text-blue-600 border-blue-200';
            case 'read': return 'bg-amber-500/10 text-amber-600 border-amber-200';
            case 'replied': return 'bg-green-500/10 text-green-600 border-green-200';
            case 'archived': return 'bg-slate-500/10 text-slate-600 border-slate-200';
            default: return 'bg-muted/30 text-muted-foreground border-transparent';
        }
    };

    const getStatusLabel = (status: string) => {
        if (status === 'new') return t("New");
        if (status === 'read') return t("Read");
        if (status === 'replied') return t("Replied");
        if (status === 'archived') return isAr ? "مؤرشف" : "Archived";
        return status;
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <DashboardHeader
                title={t("Inquiries")}
                description={t("InquiriesDescription")}
                actions={
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={fetchContacts}
                        className="h-12 w-12 rounded-2xl border-border/40 bg-background/40 hover:bg-background/60 transition-all duration-300 shadow-sm"
                    >
                        <RefreshCw className={cn("h-5 w-5 text-muted-foreground", loading && "animate-spin")} />
                    </Button>
                }
            >
                <DashboardSearch
                    placeholder={t("SearchContacts")}
                    onChange={(val) => { setSearch(val); setPage(1); }}
                    className="w-full lg:w-[32rem]"
                />

                <div className="flex flex-wrap items-center gap-3 justify-end flex-1">
                    <DashboardSelectFilter
                        value={statusFilter}
                        onChange={(val) => { setStatusFilter(val); setPage(1); }}
                        options={[
                            { label: t("AllMessages"), value: "all" },
                            { label: t("New"), value: "new" },
                            { label: t("Read"), value: "read" },
                            { label: t("Replied"), value: "replied" },
                            { label: isAr ? "المؤرشف" : "Archived", value: "archived" },
                        ]}
                        placeholder={t("Filter")}
                        className="w-full sm:w-[180px]"
                    />
                </div>
            </DashboardHeader>

            <DashboardTable headers={[
                t("Customer"),
                t("ContactInfo"),
                t("MessagePreview"),
                t("Status"),
                t("CreatedAt"),
                t("Actions")
            ]}
                isLoading={loading}
                emptyMessage={t("NoMessagesFound")}
            >
                {contacts.map((contact) => (
                    <DashboardTableRow key={contact.id}>
                        <DashboardTableCell>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm tracking-tight">{contact.name}</span>
                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">#{contact.id.slice(0, 8)}</span>
                            </div>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <div className="flex flex-col gap-1">
                                <a href={`mailto:${contact.email}`} className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5">
                                    <Mail className="h-3 w-3" />
                                    {contact.email}
                                </a>
                                <a href={`tel:${contact.phone}`} className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                    <Phone className="h-3 w-3" />
                                    {contact.phone}
                                </a>
                            </div>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                                {contact.message}
                            </p>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <div className={cn(
                                "flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase w-fit",
                                getStatusStyle(contact.status)
                            )}>
                                {contact.status === 'new' && <Clock className="h-3 w-3" />}
                                {contact.status === 'read' && <Eye className="h-3 w-3" />}
                                {contact.status === 'replied' && <CheckCircle2 className="h-3 w-3" />}
                                {contact.status === 'archived' && <Archive className="h-3 w-3" />}
                                {getStatusLabel(contact.status)}
                            </div>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                <Calendar className="h-3 w-3 opacity-50" />
                                {new Date(contact.created_at).toLocaleDateString(locale)}
                            </span>
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <div className="flex items-center gap-2">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleViewDetails(contact)} 
                                    className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary transition-all shadow-sm border border-border/40"
                                    title={isAr ? "عرض التفاصيل" : "View Details"}
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>

                                {contact.status !== 'replied' && contact.status !== 'archived' && (
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => updateStatus(contact.id, 'replied')} 
                                        className="h-9 w-9 rounded-full hover:bg-green-500/10 hover:text-green-600 transition-all text-muted-foreground shadow-sm border border-border/40"
                                        title={isAr ? "تم الرد" : "Mark as Replied"}
                                    >
                                        <Check className="h-4 w-4" />
                                    </Button>
                                )}

                                {contact.status !== 'archived' ? (
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => updateStatus(contact.id, 'archived')} 
                                        className="h-9 w-9 rounded-full hover:bg-slate-500/10 hover:text-slate-600 transition-all text-muted-foreground shadow-sm border border-border/40"
                                        title={isAr ? "أرشفة" : "Archive"}
                                    >
                                        <Archive className="h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => updateStatus(contact.id, 'read')} 
                                        className="h-9 w-9 rounded-full hover:bg-blue-500/10 hover:text-blue-600 transition-all text-muted-foreground shadow-sm border border-border/40"
                                        title={isAr ? "إعادة تفعيل" : "Restore"}
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                    </Button>
                                )}

                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleDelete(contact.id)} 
                                    className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive transition-all text-muted-foreground shadow-sm border border-border/40"
                                    title={isAr ? "حذف" : "Delete"}
                                >
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
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                title={t("MessageDetails")}
                description={`${t("ReceivedOn")} ${selectedContact ? new Date(selectedContact.created_at).toLocaleString(locale) : ''}`}
                className="max-w-2xl"
            >
                {selectedContact && (
                    <div className="space-y-6 pt-4" dir={isAr ? 'rtl' : 'ltr'}>
                        <div className="flex items-center justify-between mb-2">
                             <div className={cn(
                                "flex items-center gap-2 px-4 py-1.5 rounded-full border text-[11px] font-black uppercase w-fit",
                                getStatusStyle(selectedContact.status)
                            )}>
                                {getStatusLabel(selectedContact.status)}
                            </div>
                            <div className="flex gap-2">
                                {selectedContact.status !== 'replied' && (
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => {
                                            updateStatus(selectedContact.id, 'replied');
                                            setSelectedContact({...selectedContact, status: 'replied'});
                                        }}
                                        className="h-9 rounded-xl border-green-200 text-green-600 hover:bg-green-50"
                                    >
                                        <Check className="h-4 w-4 mr-2" />
                                        {isAr ? "تحديد كتم الرد" : "Mark as Replied"}
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                                    {t("From")}
                                </p>
                                <p className="font-bold text-foreground">{selectedContact.name}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                                    {t("Phone")}
                                </p>
                                <p className="font-bold text-foreground">{selectedContact.phone}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 col-span-2">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                                    {t("Email")}
                                </p>
                                <p className="font-bold text-foreground tracking-tight">{selectedContact.email}</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-primary/[0.03] border border-primary/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <MessageSquare className="h-12 w-12" />
                            </div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 relative z-10">
                                {t("MessageContent")}
                            </p>
                            <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap relative z-10">{selectedContact.message}</p>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-top border-border/40">
                            <Button 
                                variant="outline"
                                onClick={() => setIsDetailsOpen(false)}
                                className="rounded-xl font-bold px-8 border-border/60"
                            >
                                {isAr ? "إغلاق" : "Close"}
                            </Button>
                            <Button 
                                asChild
                                className="rounded-xl font-bold px-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                            >
                                <a href={`mailto:${selectedContact.email}`}>
                                    <Mail className="h-4 w-4 mr-2" />
                                    {isAr ? "رد عبر البريد" : "Reply via Email"}
                                </a>
                            </Button>
                        </div>
                    </div>
                )}
            </DashboardModal>
        </div>
    );
}
