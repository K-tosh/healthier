import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-blue-600 text-white shadow-sm hover:bg-blue-700",
        secondary:
          "border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200",
        destructive:
          "border-transparent bg-red-500 text-white shadow-sm hover:bg-red-600",
        outline: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50",
        success: "border-transparent bg-green-500 text-white shadow-sm hover:bg-green-600",
        warning: "border-transparent bg-amber-500 text-white shadow-sm hover:bg-amber-600",
        medical: "border-transparent bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm",
        category: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
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
