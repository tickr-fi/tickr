import { forwardRef, ReactNode } from 'react';
import { cn } from '@/lib';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ leftIcon, rightIcon, variant = 'default', size = 'md', className, ...props }, ref) => {
    const baseClasses = 'w-full font-mono text-xs transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed h-[30px]';
    
    const variantClasses = {
      default: 'bg-secondary-background text-foreground placeholder-muted-foreground border border-border focus:border-primary',
      outline: 'bg-transparent text-foreground placeholder-muted-foreground border border-primary focus:border-primary',
    };
    
    const sizeClasses = {
      sm: 'px-3 rounded-md',
      md: 'px-4 rounded-lg',
      lg: 'px-6 rounded-lg',
    };

    const inputClasses = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      className
    );

    if (leftIcon || rightIcon) {
      return (
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={inputClasses}
            suppressHydrationWarning
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={inputClasses}
        suppressHydrationWarning
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
