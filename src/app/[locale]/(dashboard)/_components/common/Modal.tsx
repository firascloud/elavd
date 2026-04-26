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
            <DialogTitle className="text-lg font-semibold ltr:tracking-tight text-foreground">
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
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);

  // Sync preview with value prop
  React.useEffect(() => {
    if (value) {
      setPreview(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File too large", { description: "Maximum size is 2MB" });
      return;
    }

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      const { error: uploadError } = await supabaseBrowser.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabaseBrowser.storage
        .from(bucket)
        .getPublicUrl(filePath);

      if (!data?.publicUrl) throw new Error("Could not get public URL");

      onUpload(data.publicUrl);
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      console.error("Upload error:", error);
      setPreview(value || null); // Revert preview on error
      toast.error("Upload failed", { description: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setPreview(null);
    onUpload("");
  };

  return (
    <div className="relative group cursor-pointer">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      
      <div className={cn(
        "h-32 w-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 overflow-hidden relative bg-background/40",
        preview ? "border-primary/20 bg-primary/5" : "border-border/60 hover:border-primary/40 hover:bg-primary/[0.02]",
        uploading && "opacity-50"
      )}>
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="h-full w-full object-cover rounded-xl" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <>
                <div className="h-10 w-10 rounded-xl bg-foreground/[0.03] flex items-center justify-center">
                  <Upload className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold uppercase ltr:tracking-wider">{uploading ? "Uploading..." : "Upload Image"}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
