"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Loader2, FileX } from "lucide-react";

interface DashboardTableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  emptyMessage?: string;
  headerClasses?: string[];
}

export function DashboardTable({ headers, children, className, isLoading, emptyMessage, headerClasses = [] }: DashboardTableProps) {
  const hasRows = React.Children.count(children) > 0;
  return (
    <div className={cn("rounded-2xl sm:rounded-[2.5rem] border border-border/40 bg-background/20 backdrop-blur-2xl overflow-hidden shadow-2xl shadow-black/[0.02]", className)}>
      <div className="w-full overflow-hidden">
        <Table className="w-full sm:table-auto border-collapse">
          <TableHeader className="hidden sm:table-header-group bg-foreground/[0.02] sticky top-0 z-10">
            <TableRow className="hover:bg-transparent border-border/40 h-16">
              {headers.map((header, index) => (
                <TableHead key={index} className={cn("text-[10px] ltr:text-left rtl:text-right uppercase font-[800] tracking-widest text-muted-foreground/50 px-6", headerClasses[index])}>
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="flex flex-col sm:table-row-group divide-y divide-border/10">
            {isLoading ? (
              <TableRow className="border-none">
                <TableCell colSpan={headers.length}>
                  <div className="flex flex-col items-center justify-center py-20 sm:py-32 text-muted-foreground gap-4">
                    <div className="relative">
                      <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
                      <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse"></div>
                    </div>
                    <span className="text-[11px] font-black tracking-[0.2em] uppercase opacity-40">Processing Transaction Cycle...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : hasRows ? (
              children
            ) : (
              <TableRow className="border-none">
                <TableCell colSpan={headers.length}>
                  <div className="flex flex-col items-center justify-center py-20 sm:py-32 text-center">
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl sm:rounded-3xl bg-background/40 border border-border/20 flex items-center justify-center text-muted-foreground/30 mb-5 shadow-inner">
                      <FileX className="h-7 w-7 sm:h-8 sm:w-8" />
                    </div>
                    <p className="text-base sm:text-lg font-[900] tracking-tight text-foreground">Zero Manifests Found</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2  mx-auto font-medium opacity-80">
                      {emptyMessage || "Expand your horizons with a fresh search or refined filters."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function DashboardTableRow({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <TableRow className={cn("flex flex-col sm:table-row border-border/10 hover:bg-foreground/[0.03] odd:bg-foreground/[0.01] transition-all duration-300 group h-auto sm:h-20 p-4 sm:p-0", className)}>
      {children}
    </TableRow>
  );
}

export function DashboardTableCell({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <TableCell className={cn("flex sm:table-cell px-0 sm:px-6 py-2 sm:py-4 text-sm font-bold tracking-tight text-foreground/80 whitespace-normal sm:whitespace-nowrap transition-all duration-300 group-hover:text-foreground border-none sm:border-b", className)}>
      {children}
    </TableCell>
  );
}
