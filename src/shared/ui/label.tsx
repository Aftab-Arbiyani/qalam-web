"use client"

import * as LabelPrimitive from "@radix-ui/react-label"
import * as React from "react"

import { cn } from "@/shared/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn(
        "text-sm font-medium text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-60",
        className,
      )}
      {...props}
    />
  )
}

export { Label }
