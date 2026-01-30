"use client";

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface BookingButtonProps {
    children: ReactNode;
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
}

export function BookingButton({ children, className, variant = "default", size = "default" }: BookingButtonProps) {
    return (
        <Button
            variant={variant}
            size={size}
            className={className}
            onClick={() => document.getElementById('booking-modal')?.classList.remove('hidden')}
        >
            {children}
        </Button>
    );
}
