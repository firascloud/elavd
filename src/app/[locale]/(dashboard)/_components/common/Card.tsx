"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: React.ReactNode;
  change?: string;
  isIncrease?: boolean;
  icon: LucideIcon;
  color?: string;
}

export function StatsCard({ title, value, change, isIncrease, icon: Icon, color = "primary" }: StatsCardProps) {
  return (
    <div className="group rounded-2xl bg-background/70 backdrop-blur border border-border/60 p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          "bg-[radial-gradient(1200px_400px_at_120%_-20%,hsl(var(--primary)/0.06),transparent_60%)]",
          "group-hover:bg-[radial-gradient(1200px_400px_at_120%_-20%,hsl(var(--primary)/0.09),transparent_60%)] transition-colors"
        )}
      />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[11px] font-semibold uppercase ltr:tracking-wide text-muted-foreground/80 mb-1">{title}</p>
          <h3 className="text-3xl font-bold ltr:tracking-tight text-foreground">{value}</h3>

          {change && (
            <div className="flex items-center gap-1.5 mt-2">
              <div className={cn(
                "px-2 py-0.5 rounded-full text-[11px] font-semibold",
                isIncrease ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"
              )}>
                {isIncrease ? "+" : ""}{change}
              </div>
              <span className="text-[11px] font-medium text-muted-foreground/80">vs last month</span>
            </div>
          )}
        </div>

        <div className={cn(
          "h-11 w-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:rotate-6",
          "bg-primary/10 text-primary ring-1 ring-primary/20"
        )}>
          <Icon className="h-5 w-5 stroke-[2.25]" />
        </div>
      </div>
    </div>
  );
}

export function DashboardCard({ title, subtitle, children, className, action }: { title: string, subtitle?: string, children: React.ReactNode, className?: string, action?: React.ReactNode }) {
  return (
    <div className={cn("rounded-2xl bg-background/60 backdrop-blur border border-border/60 p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold ltr:tracking-tight text-foreground">{title}</h2>
          {subtitle && <p className="text-sm font-medium text-muted-foreground/80 mt-1">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
