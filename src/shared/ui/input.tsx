import * as React from "react"

import { cn } from "@/shared/lib/utils"

function Input({ className, type, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full min-w-0 rounded-lg border border-input bg-card px-4 py-2 text-base",
        "placeholder:text-muted-foreground/70",
        "transition-[border-color,box-shadow] duration-200 outline-none",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/25",
        "disabled:cursor-not-allowed disabled:opacity-55",
        "md:text-sm",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
