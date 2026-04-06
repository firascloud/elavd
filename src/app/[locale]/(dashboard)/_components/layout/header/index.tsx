"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User, Bell, Search as SearchIcon, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LanguageSwitcher from '@/components/Layout/header/LanguageSwitcher';
import useAppStore from "@/store/store";


export default function Header() {
    const { user, signOut } = useAuth();
    const t = useTranslations("common");
    const locale = useLocale();
    const isAr = locale === "ar";
    const router = useRouter();
    const logoutStore = useAppStore((state) => state.logout);
    const { isSidebarOpen, toggleSidebar } = useAppStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            await signOut();
            logoutStore();
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
            setIsLoading(false);
        }
    };

    return (
        <header className="sticky top-0 z-40 h-14 sm:h-16 border-b border-primary/10 bg-background/60 backdrop-blur-md flex items-center justify-between px-3 sm:px-6 transition-all duration-300">
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="text-foreground hover:bg-primary/10 hover:text-primary"
            >
                {isSidebarOpen ? (
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                    <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
            </Button>

            <div className="flex items-center gap-2 sm:gap-4">
                <LanguageSwitcher />
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary relative h-8 w-8 sm:h-9 sm:w-9">
                    <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full p-0 overflow-hidden border border-primary/10 hover:border-primary/20">
                            <Avatar className="h-full w-full">
                                <AvatarImage src={user?.user_metadata?.avatar_url} alt="Admin" />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[78vw] max-w-[280px] sm:w-56 mt-2 border-primary/10 p-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <DropdownMenuLabel className="font-normal px-2 py-3">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-bold leading-none">{user?.email?.split('@')[0] || 'Admin'}</p>
                                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-primary/5" />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            disabled={isLoading}
                            className="focus:bg-red-500 bg-red-500/10 text-red-500 cursor-pointer rounded-md disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="me-2 h-4 w-4 animate-spin" />
                            ) : (
                                <LogOut className="me-2 h-4 w-4" />
                            )}
                            <span>{t("Logout")}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
