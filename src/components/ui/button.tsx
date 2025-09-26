import { ReactNode } from 'react';
import { cn } from '@/lib';

interface ButtonProps {
  children?: ReactNode;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  disableHoverAnimation?: boolean;
}

export function Button({
  children,
  icon,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  type = 'button',
  disabled = false,
  disableHoverAnimation = false,
}: ButtonProps) {
  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2 font-mono font-medium',
    'transition-colors cursor-pointer focus:outline-none',
    'disabled:opacity-50 disabled:cursor-not-allowed h-7'
  );

  const variantClasses = {
    primary: 'bg-primary hover:opacity-90 text-primary-foreground',
    secondary: cn(
      'bg-secondary hover:bg-primary hover:text-primary-foreground',
      'hover:border-primary text-secondary-foreground border border-border',
      !disableHoverAnimation && 'hover:scale-105 transition-all duration-200'
    ),
    outline: 'border border-primary text-primary hover:bg-primary hover:text-primary-foreground',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-md',
    md: 'px-4 py-2 text-xs rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
