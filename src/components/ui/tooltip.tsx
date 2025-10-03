import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  children: ReactNode;
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
  className?: string;
}

export function Tooltip({ 
  children, 
  content, 
  side = 'top',
  align = 'center',
  delayDuration = 200,
  className 
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={4}
            className={cn(
              'z-50 px-2 py-1 text-xs font-mono whitespace-nowrap',
              'bg-secondary-background border border-border rounded',
              'text-foreground shadow-lg',
              'animate-in fade-in-0 zoom-in-95 duration-200',
              'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
              className
            )}
          >
            {content}
            <TooltipPrimitive.Arrow 
              className="fill-secondary-background border-border" 
              width={8} 
              height={4} 
            />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
