import * as React from 'react'

import { cn } from '@/lib/utils'

interface TextareaProps extends React.ComponentProps<'textarea'> {
  showCharCount?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, showCharCount = false, maxLength, value, ...props }, ref) => {
    const currentLength = typeof value === 'string' ? value.length : 0
    
    return (
      <div className="relative w-full">
        <textarea
          ref={ref}
          data-slot="textarea"
          className={cn(
            'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            className,
          )}
          maxLength={maxLength}
          value={value}
          {...props}
        />
        {showCharCount && maxLength && (
          <div className="mt-1 text-xs text-muted-foreground text-right">
            {currentLength} / {maxLength} characters
          </div>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }
