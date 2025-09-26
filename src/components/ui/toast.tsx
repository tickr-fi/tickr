'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Toast {
    id: string;
    title: string;
    description?: string;
    type?: 'success' | 'error' | 'info';
    duration?: number;
}

interface ToastProps {
    toast: Toast;
    onRemove: (id: string) => void;
}

function ToastComponent({ toast, onRemove }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);

        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onRemove(toast.id), 300); // Wait for animation
        }, toast.duration || 3000);

        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, onRemove]);

    const handleRemove = () => {
        setIsVisible(false);
        setTimeout(() => onRemove(toast.id), 300);
    };

    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return <Check className="w-4 h-4 text-green-500" />;
            case 'error':
                return <X className="w-4 h-4 text-red-500" />;
            default:
                return <Check className="w-4 h-4 text-blue-500" />;
        }
    };

    const getBackgroundColor = () => {
        switch (toast.type) {
            case 'success':
                return 'bg-green-800/60 border-green-600';
            case 'error':
                return 'bg-red-800/60 border-red-600';
            default:
                return 'bg-blue-800/60 border-blue-600';
        }
    };

    return (
        <div
            className={cn(
                'flex items-start gap-2 p-3 md:p-4 rounded-lg border shadow-lg transition-all duration-300 transform',
                getBackgroundColor(),
                isVisible
                    ? 'translate-y-0 opacity-100 scale-100'
                    : 'translate-y-full opacity-0 scale-95'
            )}
        >
            {getIcon()}
            <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-mono font-medium text-white">
                    {toast.title}
                </p>
                {toast.description && (
                    <p className="text-xs font-mono text-muted-white mt-1">
                        {toast.description}
                    </p>
                )}
            </div>
            <button
                onClick={handleRemove}
                className="p-1 hover:bg-muted rounded transition-colors"
            >
                <X className="w-3 h-3 text-white" />
            </button>
        </div>
    );
}

const ToastContext = createContext<{
    addToast: (toast: Omit<Toast, 'id'>) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { ...toast, id }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[9999] space-y-2 w-[calc(100vw-4rem)] max-w-xs">
                {toasts.map((toast) => (
                    <ToastComponent
                        key={toast.id}
                        toast={toast}
                        onRemove={removeToast}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
