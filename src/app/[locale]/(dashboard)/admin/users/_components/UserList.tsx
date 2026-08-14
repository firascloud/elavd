"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Edit2,
    Lock,
    Mail,
    RefreshCcw,
    Search,
    Shield,
    User as NameIcon,
    User as UserIcon,
    UsersRound,
    X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { DashboardTable, DashboardTableCell, DashboardTableRow } from "@/app/[locale]/(dashboard)/_components/common/Table";
import { DashboardModal } from "@/app/[locale]/(dashboard)/_components/common/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabaseBrowser } from "@/lib/supabase/client";
import { updateRecord } from "@/app/actions/db";
import type { UserRow } from "@/types/admin";

export default function UserList() {
    const t = useTranslations("dashboard");
    const locale = useLocale();
    const [users, setUsers] = useState<UserRow[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [editUser, setEditUser] = useState<UserRow | null>(null);
    const [updating, setUpdating] = useState(false);
    const { register, handleSubmit, reset, setValue } = useForm();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabaseBrowser
                .from("users")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching users:", error);
                setUsers([]);
                return;
            }

            setUsers((data || []) as UserRow[]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (!editUser) return;
        setValue("email", editUser.email);
        setValue("name", editUser.name || "");
        setValue("password", "");
    }, [editUser, setValue]);

    const summary = useMemo(() => ({
        total: users.length,
        admins: users.filter((user) => user.role === "admin").length,
        regular: users.filter((user) => user.role !== "admin").length,
    }), [users]);

    const filteredUsers = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return users;

        return users.filter((user) =>
            [user.email, user.name, user.role]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(query)),
        );
    }, [searchTerm, users]);

    const onUpdate = async (data: any) => {
        if (!editUser) return;
        setUpdating(true);

        const updates: Record<string, string> = {
            email: data.email,
            name: data.name,
        };
        if (data.password) updates.password = data.password;

        try {
            await updateRecord("users", updates, editUser.id);
            toast.success(t("UpdateSuccess"));
            setEditUser(null);
            reset();
            await fetchUsers();
        } catch (error: any) {
            toast.error(t("FailedToUpdateUser"), { description: error.message });
        } finally {
            setUpdating(false);
        }
    };

    const formatDate = (value: string) => new Intl.DateTimeFormat(
        locale === "ar" ? "ar-SA" : "en-US",
        { year: "numeric", month: "short", day: "numeric" },
    ).format(new Date(value));

    const headers = [t("Email"), t("Name"), t("Role"), t("CreatedAt"), t("Actions")];

    const summaryCards = [
        { label: t("TotalCount"), value: summary.total, icon: UsersRound, style: "bg-primary/10 text-primary" },
        { label: t("Admin"), value: summary.admins, icon: Shield, style: "bg-secondary/10 text-secondary" },
        { label: t("User"), value: summary.regular, icon: UserIcon, style: "bg-blue-500/10 text-blue-600" },
    ];

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {summaryCards.map((card) => (
                    <div key={card.label} className="flex items-center justify-between rounded-2xl border border-border/70 bg-background p-4 shadow-sm">
                        <div>
                            <p className="text-[11px] font-bold uppercase text-muted-foreground ltr:tracking-wide">{card.label}</p>
                            <p className="mt-1 text-2xl font-black leading-none text-foreground">{loading ? "—" : card.value}</p>
                        </div>
                        <div className={`grid h-10 w-10 place-items-center rounded-xl ${card.style}`}>
                            <card.icon className="h-[18px] w-[18px]" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-md">
                    <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder={t("SearchUsers")}
                        className="h-10 rounded-xl border-border/70 bg-muted/25 ps-10 pe-10 text-xs shadow-none focus-visible:bg-background"
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm("")}
                            className="absolute end-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                            aria-label={t("Cancel")}
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <span className="text-[11px] font-bold text-muted-foreground">
                        {filteredUsers.length} {t("results")}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchUsers}
                        disabled={loading}
                        className="h-9 rounded-xl border-border/70 px-3 text-[11px] font-bold shadow-none hover:border-secondary/25 hover:bg-secondary/5 hover:text-secondary"
                    >
                        <RefreshCcw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                        {t("Refresh")}
                    </Button>
                </div>
            </div>

            <DashboardTable
                headers={headers}
                headerClasses={["", "hidden sm:table-cell", "", "hidden lg:table-cell", "w-20"]}
                isLoading={loading}
                emptyMessage={t("NoUsersFound")}
                loadingMessage={t("Loading")}
            >
                {filteredUsers.map((user) => (
                    <DashboardTableRow key={user.id} className="h-16">
                        <DashboardTableCell className="font-bold">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-xs font-black uppercase text-primary">
                                    {(user.name || user.email || "U").charAt(0)}
                                </div>
                                <span className="max-w-[240px] truncate text-xs sm:text-sm">{user.email}</span>
                            </div>
                        </DashboardTableCell>
                        <DashboardTableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                            {user.name || "—"}
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black ${user.role === "admin"
                                ? "bg-secondary/10 text-secondary"
                                : "bg-blue-500/10 text-blue-600"
                            }`}>
                                {user.role === "admin" ? <Shield className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
                                {user.role === "admin" ? t("Admin") : t("User")}
                            </span>
                        </DashboardTableCell>
                        <DashboardTableCell className="hidden text-[11px] font-medium text-muted-foreground lg:table-cell">
                            {user.created_at ? formatDate(user.created_at) : "—"}
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditUser(user)}
                                className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                aria-label={t("EditUser")}
                            >
                                <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                        </DashboardTableCell>
                    </DashboardTableRow>
                ))}
            </DashboardTable>

            <DashboardModal
                isOpen={!!editUser}
                onClose={() => setEditUser(null)}
                title={t("EditUser")}
                description={editUser?.email}
            >
                <form onSubmit={handleSubmit(onUpdate)} className="space-y-5 pt-4">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[11px] font-black uppercase text-muted-foreground ltr:tracking-wider">
                            <NameIcon className="h-3.5 w-3.5" />
                            {t("Name")}
                        </label>
                        <Input {...register("name")} placeholder={t("UserNamePlaceholder")} className="h-11 rounded-xl border-border/70 bg-background" />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[11px] font-black uppercase text-muted-foreground ltr:tracking-wider">
                            <Mail className="h-3.5 w-3.5" />
                            {t("Email")}
                        </label>
                        <Input {...register("email")} type="email" placeholder={t("EmailPlaceholder")} className="h-11 rounded-xl border-border/70 bg-background" />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[11px] font-black uppercase text-muted-foreground ltr:tracking-wider">
                            <Lock className="h-3.5 w-3.5" />
                            {t("Password")}
                        </label>
                        <Input {...register("password")} type="password" placeholder={t("PasswordPlaceholder")} className="h-11 rounded-xl border-border/70 bg-background" />
                        <p className="text-[10px] leading-relaxed text-muted-foreground">{t("PasswordHint")}</p>
                    </div>

                    <div className="flex justify-end gap-2 border-t border-border/60 pt-4">
                        <Button type="button" variant="ghost" className="h-10 rounded-xl px-5 text-xs font-bold" onClick={() => setEditUser(null)}>
                            {t("Cancel")}
                        </Button>
                        <Button type="submit" disabled={updating} className="h-10 rounded-xl px-6 text-xs font-bold shadow-lg shadow-primary/15">
                            {updating ? <RefreshCcw className="h-4 w-4 animate-spin" /> : t("Save")}
                        </Button>
                    </div>
                </form>
            </DashboardModal>
        </div>
    );
}
