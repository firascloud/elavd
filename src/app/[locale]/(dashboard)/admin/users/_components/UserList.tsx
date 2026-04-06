"use client";

import { useEffect, useState } from "react";
import { RefreshCcw, Edit2, Shield, User as UserIcon, Mail, Lock, User as NameIcon } from "lucide-react";
import {
    DashboardTable,
    DashboardTableRow,
    DashboardTableCell
} from "@/app/[locale]/(dashboard)/_components/common/Table";
import { DashboardModal } from "@/app/[locale]/(dashboard)/_components/common/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { format } from "date-fns";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";

export default function UserList() {
    const tDashboard = useTranslations("dashboard");
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editUser, setEditUser] = useState<any>(null);
    const [updating, setUpdating] = useState(false);

    const { register, handleSubmit, reset, setValue } = useForm();

    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabaseBrowser
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        } else {
            setUsers(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (editUser) {
            setValue("email", editUser.email);
            setValue("name", editUser.name || "");
            setValue("password", ""); // Keep empty for security
        }
    }, [editUser, setValue]);

    const onUpdate = async (data: any) => {
        if (!editUser) return;
        setUpdating(true);

        // Only include password if it's not empty
        const updates: any = {
            email: data.email,
            name: data.name,
        };
        if (data.password) {
            updates.password = data.password;
        }

        try {
            const { error: updateError } = await supabaseBrowser
                .from('users')
                .update(updates)
                .eq('id', editUser.id);

            if (updateError) {
                toast.error(tDashboard("UpdateFailed"), { description: updateError.message });
            } else {
                toast.success(tDashboard("UpdateSuccess"));
                setEditUser(null);
                reset();
                fetchUsers();
            }
        } catch (err: any) {
            toast.error(tDashboard("FailedToUpdateUser"), { description: err.message });
        } finally {
            setUpdating(false);
        }
    };

    const headers = [
        tDashboard("Email"),
        tDashboard("Name"),
        tDashboard("Role"),
        tDashboard("CreatedAt"),
        tDashboard("Actions")
    ];

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <RefreshCcw className="h-8 w-8 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center px-4 py-2 bg-muted/20 rounded-2xl border border-primary/5">
                <p className="text-sm font-bold text-muted-foreground">
                    {tDashboard("TotalCount")}: <span className="text-foreground">{users.length}</span>
                </p>
                <Button variant="ghost" size="sm" onClick={fetchUsers} className="text-xs font-bold hover:text-primary">
                    <RefreshCcw className="h-3 w-3 me-2" />
                    {tDashboard("Refresh")}
                </Button>
            </div>

            <DashboardTable
                headers={headers}
                headerClasses={["", "hidden sm:table-cell", "", "hidden md:table-cell", ""]}
                isLoading={loading}
                emptyMessage={tDashboard("NoUsersFound") || "No users found."}
            >
                {users.map((user) => (
                    <DashboardTableRow key={user.id}>
                        <DashboardTableCell className="font-bold">
                            {user.email}
                        </DashboardTableCell>
                        <DashboardTableCell className="text-muted-foreground hidden sm:table-cell">
                            {user.name || '-'}
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <div className={`px-2 py-1 rounded-full text-[10px] font-black inline-flex items-center gap-1.5 ${user.role === 'admin'
                                ? 'bg-primary/10 text-primary'
                                : 'bg-muted text-muted-foreground'
                                }`}>
                                {user.role === 'admin' ? <Shield className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
                                {user.role === 'admin' ? tDashboard("Admin") : tDashboard("User")}
                            </div>
                        </DashboardTableCell>
                        <DashboardTableCell className="text-xs text-muted-foreground font-medium hidden md:table-cell">
                            {user.created_at ? format(new Date(user.created_at), 'MMM dd, yyyy') : '-'}
                        </DashboardTableCell>
                        <DashboardTableCell>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditUser(user)}
                                className="h-8 w-8 p-0 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        </DashboardTableCell>
                    </DashboardTableRow>
                ))}
            </DashboardTable>

            {/* Edit Modal */}
            <DashboardModal
                isOpen={!!editUser}
                onClose={() => setEditUser(null)}
                title={tDashboard("EditUser")}
                description={editUser?.email}
            >
                <form onSubmit={handleSubmit(onUpdate)} className="space-y-5 pt-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <NameIcon className="h-3 w-3" />
                            {tDashboard("Name")}
                        </label>
                        <Input
                            {...register("name")}
                            placeholder={tDashboard("UserNamePlaceholder")}
                            className="bg-muted/30 border-none rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            {tDashboard("Email")}
                        </label>
                        <Input
                            {...register("email")}
                            type="email"
                            placeholder={tDashboard("EmailPlaceholder")}
                            className="bg-muted/30 border-none rounded-xl"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Lock className="h-3 w-3" />
                            {tDashboard("Password")}
                        </label>
                        <Input
                            {...register("password")}
                            type="password"
                            placeholder={tDashboard("PasswordPlaceholder")}
                            className="bg-muted/30 border-none rounded-xl"
                        />
                        <p className="text-[10px] text-muted-foreground italic">{tDashboard("PasswordHint")}</p>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-primary/5">
                        <Button type="button" variant="ghost" className="font-bold rounded-xl" onClick={() => setEditUser(null)}>
                            {tDashboard("Cancel")}
                        </Button>
                        <Button type="submit" disabled={updating} className="font-bold rounded-xl px-8 shadow-lg shadow-primary/20">
                            {updating ? <RefreshCcw className="h-4 w-4 animate-spin" /> : tDashboard("Save")}
                        </Button>
                    </div>
                </form>
            </DashboardModal>
        </div>
    );
}
