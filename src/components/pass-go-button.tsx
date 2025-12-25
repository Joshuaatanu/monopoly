'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PassGoButtonProps {
    onPassGo: () => void;
    activeLoansCount: number;
}

export function PassGoButton({ onPassGo, activeLoansCount }: PassGoButtonProps) {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = () => {
        setIsAnimating(true);
        onPassGo();
        setTimeout(() => setIsAnimating(false), 600);
    };

    return (
        <div className="relative">
            <Button
                size="lg"
                onClick={handleClick}
                disabled={activeLoansCount === 0}
                className={cn(
                    'relative h-20 px-12 text-xl font-bold',
                    'bg-gradient-to-r from-green-500 to-emerald-600',
                    'hover:from-green-600 hover:to-emerald-700',
                    'shadow-lg hover:shadow-xl transition-all duration-300',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    isAnimating && 'scale-110'
                )}
            >
                <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">🎲 PASS GO 🎲</span>
                    <span className="text-sm font-normal opacity-90">+10% Interest on All Loans</span>
                </div>
            </Button>
            {isAnimating && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl animate-ping">
                        💰
                    </div>
                </div>
            )}
        </div>
    );
}
