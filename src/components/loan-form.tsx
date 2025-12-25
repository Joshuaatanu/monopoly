'use client';

import { useState } from 'react';
import { Player, InterestRate } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface LoanFormProps {
    player: Player | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (playerId: string, amount: number, interestRate: InterestRate) => void;
    currentDebt?: number;
    debtLimit?: number;
}

export function LoanForm({
    player,
    open,
    onOpenChange,
    onSubmit,
    currentDebt = 0,
    debtLimit = 0,
}: LoanFormProps) {
    const [amount, setAmount] = useState('');
    const [interestRate, setInterestRate] = useState<InterestRate>(10);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (player && amount) {
            onSubmit(player.id, parseFloat(amount), interestRate);
            setAmount('');
            setInterestRate(10);
            onOpenChange(false);
        }
    };

    const newTotal = currentDebt + (parseFloat(amount) || 0);
    const wouldExceedLimit = debtLimit > 0 && newTotal > debtLimit;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New Loan</DialogTitle>
                    <DialogDescription>
                        Create a new loan for {player?.name}. Interest will be added each
                        time they pass GO.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                                Amount
                            </Label>
                            <div className="col-span-3 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    $
                                </span>
                                <CurrencyInput
                                    id="amount"
                                    placeholder="0"
                                    className="pl-7"
                                    value={amount}
                                    onChange={setAmount}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="interest" className="text-right">
                                Interest
                            </Label>
                            <Select
                                value={interestRate.toString()}
                                onValueChange={(v) => setInterestRate(parseInt(v) as InterestRate)}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select rate" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5% per GO (Low)</SelectItem>
                                    <SelectItem value="10">10% per GO (Standard)</SelectItem>
                                    <SelectItem value="15">15% per GO (High)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {debtLimit > 0 && (
                            <div className="text-sm text-muted-foreground text-right">
                                Current debt: ${currentDebt.toLocaleString()} / ${debtLimit.toLocaleString()} limit
                            </div>
                        )}
                        {wouldExceedLimit && (
                            <div className="text-sm text-destructive text-right">
                                ⚠️ This would exceed the debt limit!
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!amount || parseFloat(amount) <= 0}>
                            Create Loan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
