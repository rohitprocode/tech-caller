"use client";

import type { ButtonHTMLAttributes } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ConfirmButton({
  message,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { message: string }) {
  return (
    <Button
      variant="danger"
      type="submit"
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
      {...props}
    >
      <Trash2 aria-hidden className="h-4 w-4" />
      {children}
    </Button>
  );
}
