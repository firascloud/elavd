"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function DashboardHeader({
  title,
  description,
  actions,
  children,
  className,
}: DashboardHeaderProps) {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <div className={cn("flex flex-col gap-5 sm:gap-6 mb-6 sm:mb-10", className)}>
      {/* Title and Global Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between items-start gap-4 sm:gap-6">
        <div className="space-y-1 sm:space-y-1.5 flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-[900] ltr:tracking-tight text-foreground leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground font-medium text-xs sm:text-sm lg:text-base max-w-2xl leading-relaxed opacity-80">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
            {actions}
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      {children && (
        <div className="w-full">
          <div className="relative p-1.5 sm:p-2 rounded-sm bg-background/30 backdrop-blur-3xl border border-border/40 shadow-2xl shadow-black/[0.03]">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 sm:gap-3">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
