'use client';

import * as React from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface CurrencyInputProps extends Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange' | 'type'> {
    value: string;
    onChange: (value: string) => void;
}

/**
 * Formats a number string with thousand separators (e.g., 1000000 -> 1,000,000)
 */
function formatWithCommas(value: string): string {
    // Remove all non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '');

    // Split by decimal point
    const parts = numericValue.split('.');

    // Format the integer part with commas
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Rejoin with decimal if exists
    return parts.join('.');
}

/**
 * Removes formatting (commas) to get raw numeric string
 */
function stripFormatting(value: string): string {
    return value.replace(/,/g, '');
}

export function CurrencyInput({ value, onChange, className, ...props }: CurrencyInputProps) {
    // Display value is the formatted version
    const displayValue = value ? formatWithCommas(value) : '';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        // Strip commas and non-numeric chars (except decimal) before storing
        const rawValue = stripFormatting(inputValue).replace(/[^\d.]/g, '');

        // Prevent multiple decimal points
        const parts = rawValue.split('.');
        const sanitizedValue = parts.length > 2
            ? parts[0] + '.' + parts.slice(1).join('')
            : rawValue;

        onChange(sanitizedValue);
    };

    return (
        <Input
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={handleChange}
            className={cn(className)}
            {...props}
        />
    );
}
