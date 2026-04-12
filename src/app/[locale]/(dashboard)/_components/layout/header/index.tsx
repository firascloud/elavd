"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, Bell, Loader2, User2 } from "lucide-react";
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
                    <DropdownMenuTrigger className='!p-0' asChild>
                        <Button 
                            variant="ghost" 
                            className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full p-0 overflow-hidden border border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                        >
                            <Avatar className="h-full w-full px-0">
                                <AvatarImage 
                                    src={user?.user_metadata?.avatar_url} 
                                    alt={user?.email || "Admin"} 
                                    className="object-cover"
                                />
                                <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-bold">
                                    <User2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    
                    <DropdownMenuContent 
                        align="end" 
                        className="w-[85vw] max-w-[300px] sm:w-64 mt-2 border-primary/10 p-2 overflow-hidden shadow-2xl"
                    >
                        <DropdownMenuLabel className="font-normal px-3 py-4">
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border border-primary/10">
                                        <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email || "Admin"} />
                                        <AvatarFallback className="bg-primary/5 text-primary text-xs">
                                            {user?.email?.[0].toUpperCase() || "A"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col min-w-0">
                                        <p className="text-sm font-bold leading-none truncate text-foreground/90">
                                            {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin'}
                                        </p>
                                        <p className="text-[11px] leading-tight text-muted-foreground truncate mt-1">
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        
                        <DropdownMenuSeparator className="bg-primary/10 mx-1 my-2" />
                        
                        <div className="p-1">
                            <DropdownMenuItem
                                onClick={handleLogout}
                                disabled={isLoading}
                                className="focus:bg-destructive focus:text-destructive-foreground bg-destructive/5 text-destructive cursor-pointer rounded-lg p-2.5 transition-all duration-200 group"
                            >
                                {isLoading ? (
                                    <Loader2 className="me-3 h-4 w-4 animate-spin" />
                                ) : (
                                    <LogOut className="me-3 h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
                                )}
                                <span className="font-medium">{t("Logout")}</span>
                            </DropdownMenuItem>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
