import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-healthierke-oxford-blue text-white hover:bg-healthierke-dark-imperial-blue focus:ring-healthierke-vista-blue",
        secondary:
          "border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200",
        destructive:
          "border-transparent bg-red-500 text-white hover:bg-red-600",
        outline: "border-healthierke-vista-blue text-healthierke-oxford-blue bg-white hover:bg-healthierke-vista-blue/10",
        success: "border-transparent bg-green-600 text-white hover:bg-green-700",
        warning: "border-transparent bg-amber-500 text-white hover:bg-amber-600",
        medical: "border-transparent bg-healthierke-vista-blue text-white hover:bg-healthierke-cetacean-blue shadow-md",
        category: "border-healthierke-vista-blue bg-healthierke-vista-blue/10 text-healthierke-oxford-blue hover:bg-healthierke-vista-blue/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
