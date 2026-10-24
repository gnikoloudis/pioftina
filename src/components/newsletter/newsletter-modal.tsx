"use client";

import React from "react";
import { X } from "lucide-react";
import { NewsletterCard } from "./newsletter-card";

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-transparent">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 size-8 rounded-full bg-background border border-border shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
        >
          <X className="size-4" />
        </button>
        <NewsletterCard source="settings" />
      </div>
    </div>
  );
}
