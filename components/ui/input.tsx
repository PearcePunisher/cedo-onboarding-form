import * as React from 'react'

import { cn } from '@/lib/utils'

interface InputProps extends React.ComponentProps<'input'> {
  showCharCount?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, showCharCount = false, maxLength, value, ...props }, ref) => {
    const currentLength = typeof value === 'string' ? value.length : 0
    
    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type={type}
          data-slot="input"
          className={cn(
            'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            className,
          )}
          maxLength={maxLength}
          value={value}
          {...props}
        />
        {showCharCount && maxLength && type === 'text' && (
          <div className="mt-1 text-xs text-muted-foreground text-right">
            {currentLength} / {maxLength} characters
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
