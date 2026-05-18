"use client";

import React from "react";
import { Search as SearchIcon, Filter as FilterIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchBoxProps {
  placeholder?: string;
  onChange?: (val: string) => void;
  className?: string;
}

export function DashboardSearch({ placeholder, onChange, className }: SearchBoxProps) {
  return (
    <div className={cn("relative group flex-1", className)}>
      <div className="absolute inset-y-0 left-0 ps-4 flex items-center pointer-events-none">
        <SearchIcon className="h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors duration-300" />
      </div>
      <input
        type="text"
        placeholder={placeholder || "Search items..."}
        onChange={(e) => onChange?.(e.target.value)}
        className="block h-12 w-full rounded-sm bg-background/40 backdrop-blur-xl border border-border/40 focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all duration-300 outline-none ps-11 pe-4 text-sm font-medium shadow-sm hover:bg-background/60"
      />
    </div>
  );
}

export function DashboardFilter({ options, onSelect, selectedValue }: { options: { label: string, value: string }[], onSelect: (val: string) => void, selectedValue?: string }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-background/40 backdrop-blur-xl rounded-2xl border border-border/40 shrink-0">
        <FilterIcon className="h-3.5 w-3.5 text-foreground/70" />
        <span className="text-[10px] font-bold uppercase ltr:tracking-widest text-muted-foreground">Filter</span>
      </div>

      <div className="flex items-center gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={cn(
              "px-5 py-2.5 cursor-pointer rounded-2xl text-xs font-semibold whitespace-nowrap border transition-all duration-300 shrink-0",
              selectedValue === opt.value
                ? "bg-foreground text-background border-transparent shadow-lg shadow-foreground/10 translate-y-[-1px]"
                : "bg-background/20 border-border/40 text-muted-foreground hover:border-foreground/20 hover:bg-background/60 hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function DashboardPagination({
  page,
  totalPages,
  onPrev,
  onNext,
  totalCount,
  onPageSelect,
  className
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  totalCount?: number;
  onPageSelect?: (p: number) => void;
  className?: string;
}) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const isAr = locale === "ar";

  const makePages = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxButtons = 5;
    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    const add = (p: number | string) => pages.push(p);
    add(1);
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    if (start > 2) add("…");
    for (let i = start; i <= end; i++) add(i);
    if (end < totalPages - 1) add("…");
    add(totalPages);
    return pages;
  };

  const pageSize = 10;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount || page * pageSize);

  return (
    <div className={cn(
      "flex flex-col lg:flex-row lg:items-center justify-between gap-6 mt-12 p-6 lg:p-8 bg-background/30 backdrop-blur-2xl border border-border/30 rounded-[2.5rem] shadow-xl shadow-black/[0.02]",
      className
    )}>
      {/* Status Info */}
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 min-w-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shadow-sm">
          {isAr ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase ltr:tracking-[0.2em] font-black text-muted-foreground/40">{t("Pagination")}</span>
          {totalCount ? (
            <div className="flex items-center gap-1.5 text-sm font-bold text-foreground/80">
              <span>{Math.min(from, totalCount)}</span>
              <span className="opacity-20">/</span>
              <span>{to}</span>
              <span className="mx-1 text-[10px] opacity-40 uppercase ltr:tracking-widest font-black">{t("of")}</span>
              <span className="text-primary">{totalCount}</span>
            </div>
          ) : (
            <p className="text-sm font-bold text-foreground/80">
              {t("Page")} {page} <span className="opacity-20 px-1">/</span> {totalPages}
            </p>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center sm:justify-end gap-2 flex-wrap sm:flex-nowrap">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={page <= 1}
          className="h-11 w-11 p-0 rounded-2xl border-border/40 bg-background/40 hover:bg-foreground hover:text-background hover:border-transparent transition-all duration-300 disabled:opacity-20 shadow-sm shrink-0"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-1.5 px-2 py-1 bg-foreground/[0.02] rounded-2xl border border-border/5">
          {makePages().map((p, idx) => (
            <Button
              key={`${p}-${idx}`}
              variant={p === page ? "default" : "ghost"}
              size="sm"
              onClick={() => typeof p === "number" && onPageSelect?.(p)}
              disabled={typeof p !== "number"}
              className={cn(
                "h-9 min-w-9 px-0 cursor-pointer rounded-xl font-bold transition-all duration-300",
                p === page 
                  ? "bg-foreground text-background shadow-lg shadow-foreground/10 active:scale-95 translate-y-[-1px]" 
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground active:scale-95"
              )}
            >
              {p}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={onNext}
          disabled={page >= totalPages}
          className="h-11 w-11 p-0 cursor-pointer rounded-2xl border-border/40 bg-background/40 hover:bg-foreground hover:text-background hover:border-transparent transition-all duration-300 disabled:opacity-20 shadow-sm shrink-0"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

export function DashboardSelectFilter({
  value,
  options,
  onChange,
  className,
  placeholder,
}: {
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn("h-12 px-5 rounded-2xl border-border/40 bg-background/40 focus:ring-4 focus:ring-primary/5 min-w-[180px] shadow-sm hover:bg-background/60 transition-all duration-300", className)}>
        <div className="flex items-center gap-2">
          <FilterIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <SelectValue placeholder={placeholder || "Filter"} />
        </div>
      </SelectTrigger>
      <SelectContent className="rounded-2xl border-border/40 bg-background/80 backdrop-blur-2xl shadow-2xl p-1 z-[9999]">
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="rounded-xl py-2.5 px-4 cursor-pointer focus:bg-foreground focus:text-background transition-colors duration-200">
            <span className="font-medium">{opt.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
