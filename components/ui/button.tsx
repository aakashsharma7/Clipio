import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/50 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-charcoal hover:shadow-accent-lg border-2 border-emerald-400/30",
        destructive: "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-charcoal hover:shadow-accent-lg border-2 border-rose-400/30",
        outline: "border-2 border-emerald-500 bg-transparent hover:bg-emerald-500/10 hover:border-emerald-400 text-emerald-400 hover:text-emerald-300",
        secondary: "bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-100 border-2 border-charcoal-600 hover:border-charcoal-500 shadow-charcoal",
        ghost: "bg-transparent hover:bg-charcoal-800/50 text-charcoal-300 hover:text-charcoal-100 border-2 border-transparent hover:border-emerald-500/30",
        link: "text-emerald-400 underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white shadow-charcoal hover:shadow-accent-lg border-2 border-emerald-400/30",
        glass: "bg-charcoal-900/30 backdrop-blur-md border-2 border-emerald-500/40 hover:bg-emerald-500/10 hover:border-emerald-400/60 text-emerald-300 shadow-charcoal",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-lg px-3 py-2",
        lg: "h-12 rounded-xl px-8 py-4 text-base",
        xl: "h-14 rounded-xl px-10 py-5 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
