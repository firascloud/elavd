"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: React.ReactNode;
  icon: LucideIcon;
  tone?: "primary" | "secondary" | "amber" | "blue" | "violet";
}

const toneStyles = {
  primary: {
    icon: "bg-primary/10 text-primary ring-primary/15",
    accent: "bg-primary",
  },
  secondary: {
    icon: "bg-secondary/10 text-secondary ring-secondary/15",
    accent: "bg-secondary",
  },
  amber: {
    icon: "bg-amber-500/10 text-amber-600 ring-amber-500/15",
    accent: "bg-amber-500",
  },
  blue: {
    icon: "bg-blue-500/10 text-blue-600 ring-blue-500/15",
    accent: "bg-blue-500",
  },
  violet: {
    icon: "bg-violet-500/10 text-violet-600 ring-violet-500/15",
    accent: "bg-violet-500",
  },
} as const;

export function StatsCard({ title, value, icon: Icon, tone = "primary" }: StatsCardProps) {
  const styles = toneStyles[tone];

  return (
    <div className="group relative min-h-[126px] overflow-hidden rounded-2xl border border-border/70 bg-background p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="pt-1 text-[11px] font-bold uppercase leading-4 text-muted-foreground ltr:tracking-wide">
          {title}
        </p>
        <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 transition-transform duration-200 group-hover:scale-105", styles.icon)}>
          <Icon className="h-[18px] w-[18px] stroke-[2.25]" />
        </div>
      </div>

      <div className="mt-4 text-3xl font-black leading-none text-foreground ltr:tracking-tight [&_svg]:h-6 [&_svg]:w-6">
        {value}
      </div>

      <div className={cn("absolute inset-x-0 bottom-0 h-0.5 opacity-70", styles.accent)} />
    </div>
  );
}

export function DashboardCard({
  title,
  subtitle,
  children,
  className,
  contentClassName,
  action,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  action?: React.ReactNode;
}) {
  return (
    <section className={cn("overflow-hidden rounded-2xl border border-border/70 bg-background shadow-sm", className)}>
      <div className="flex min-h-16 items-center justify-between gap-4 border-b border-border/60 px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <h2 className="text-base font-extrabold text-foreground ltr:tracking-tight sm:text-lg">{title}</h2>
          {subtitle && <p className="mt-0.5 truncate text-xs font-medium text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className={cn("p-4 sm:p-5", contentClassName)}>{children}</div>
    </section>
  );
}
