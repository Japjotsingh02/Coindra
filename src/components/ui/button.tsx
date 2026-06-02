import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-brand text-[#050505] shadow-none hover:bg-brand/90',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'bg-[#111111] border border-[#222222] hover:border-[#444444] text-[#888888] hover:text-white',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'hover:bg-white/[0.05] hover:text-white/60',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-7 sm:h-7 md:h-7 xl:h-7 2xl:h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        md: 'h-5 sm:h-5 md:h-5 xl:h-5 2xl:h-6 px-3 rounded-[4px]',
        lg: 'h-7 sm:h-7 md:h-7 xl:h-7 2xl:h-8 rounded-[4px] px-2 sm:px-2.5 md:px-3.5 xl:px-2.5 2xl:px-3.5 text-[10px] sm:text-xs md:text-sm xl:text-xs 2xl:text-base',
        xl: 'h-8! 2xl:h-11! text-[10px] rounded-[4px] px-2 sm:px-2.5 md:px-3.5 xl:px-2.5 2xl:px-3.5 sm:text-xs md:text-sm xl:text-xs 2xl:text-base',
        icon: 'size-9',
        iconLg: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
