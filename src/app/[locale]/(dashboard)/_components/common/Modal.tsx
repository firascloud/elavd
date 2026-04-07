"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { toast } from "sonner";

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  loading?: boolean;
}

export function DashboardModal({ isOpen, onClose, title, description, children, footer, className, loading }: DashboardModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn(
        "sm:max-w-3xl p-0 z-[2000] gap-0",
        className
      )}>
        <button 
          onClick={onClose}
          className="absolute cursor-pointer right-6 top-6 rounded-full p-2 hover:bg-muted transition-colors z-50 text-muted-foreground hover:text-foreground outline-none"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex flex-col h-full max-h-[90vh]">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-[12px] font-medium text-muted-foreground mt-1">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm font-medium">Loading...</span>
                </div>
              </div>
            ) : (
              children
            )}
          </div>

          {footer && (
            <DialogFooter className="p-6 pt-0">
              {footer}
            </DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DashboardImageUpload({ onUpload, value, bucket = "products" }: { onUpload: (url: string) => void, value?: string, bucket?: string }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(value);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabaseBrowser.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabaseBrowser.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setPreview(publicUrl);
      onUpload(publicUrl);
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error("Upload failed", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className={cn(
        "relative aspect-square w-full max-w-[220px] rounded-xl border border-dashed flex flex-col items-center justify-center transition-all bg-background/60 hover:bg-foreground/[0.02] group",
        preview ? "border-foreground/30" : "border-border/60",
        loading && "opacity-50 pointer-events-none"
      )}>
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="h-full w-full object-cover rounded-xl" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
              <Button size="icon" variant="ghost" className="text-white hover:text-red-500" onClick={() => { setPreview(""); onUpload(""); }}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center p-6 space-y-2">
            <div className="h-11 w-11 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto transition-transform group-hover:scale-105 group-hover:rotate-1 duration-300 ring-1 ring-primary/20">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Upload Image</p>
            <p className="text-[11px] font-medium text-muted-foreground/70">SVG, PNG, JPG (max 2MB)</p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="absolute inset-x-0 h-full w-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}
