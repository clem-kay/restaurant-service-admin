import * as React from "react"
import {cva, type VariantProps} from "class-variance-authority"

import {cn} from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground hover:bg-border/80",
                success:
                    "border-transparent bg-green-500 text-primary-foreground hover:bg-border/80",
                gray:
                    "border-transparent bg-border text-primary-foreground hover:bg-muted/80",
                orange:
                    "border-transparent bg-gray-400 text-primary-foreground hover:bg-muted/80",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-border/80",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground hover:bg-background/80",
                outline: "text-foreground bg-muted border-border hover:bg-border",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {
}

function Badge({className, variant, ...props}: BadgeProps) {
    return (
        <div className={cn(badgeVariants({variant}), className)} {...props} />
    )
}

export {Badge, badgeVariants}
