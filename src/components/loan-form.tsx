'use client';

import { useState } from 'react';
import { Player, Property, InterestRate } from '@/types';
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
import { Switch } from '@/components/ui/switch';
import { Shield, ShieldOff } from 'lucide-react';

interface LoanFormProps {
    player: Player | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (playerId: string, amount: number, interestRate: InterestRate, collateralPropertyId?: string) => void;
    currentDebt?: number;
    debtLimit?: number;
    availableCollateral?: Property[];
}

export function LoanForm({
    player,
    open,
    onOpenChange,
    onSubmit,
    currentDebt = 0,
    debtLimit = 0,
    availableCollateral = [],
}: LoanFormProps) {
    const [amount, setAmount] = useState('');
    const [interestRate, setInterestRate] = useState<InterestRate>(10);
    const [useCollateral, setUseCollateral] = useState(false);
    const [selectedCollateralId, setSelectedCollateralId] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (player && amount) {
            const collateralId = useCollateral && selectedCollateralId ? selectedCollateralId : undefined;
            onSubmit(player.id, parseFloat(amount), interestRate, collateralId);
            resetForm();
            onOpenChange(false);
        }
    };

    const resetForm = () => {
        setAmount('');
        setInterestRate(10);
        setUseCollateral(false);
        setSelectedCollateralId('');
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) resetForm();
        onOpenChange(open);
    };

    const newTotal = currentDebt + (parseFloat(amount) || 0);
    const wouldExceedLimit = debtLimit > 0 && newTotal > debtLimit;
    const selectedCollateral = availableCollateral.find(p => p.id === selectedCollateralId);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
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
                                    £
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

                        {/* Collateral Section */}
                        <div className="border-t pt-4 mt-2">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    {useCollateral ? (
                                        <Shield className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <ShieldOff className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <Label htmlFor="collateral-toggle" className="cursor-pointer">
                                        Secure with collateral
                                    </Label>
                                </div>
                                <Switch
                                    id="collateral-toggle"
                                    checked={useCollateral}
                                    onCheckedChange={setUseCollateral}
                                    disabled={availableCollateral.length === 0}
                                />
                            </div>

                            {useCollateral && (
                                <div className="space-y-2">
                                    {availableCollateral.length > 0 ? (
                                        <>
                                            <Select
                                                value={selectedCollateralId}
                                                onValueChange={setSelectedCollateralId}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select property as collateral" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableCollateral.map((property) => (
                                                        <SelectItem key={property.id} value={property.id}>
                                                            <div className="flex items-center gap-2">
                                                                {property.colorHex && (
                                                                    <div
                                                                        className="w-3 h-3 rounded-full"
                                                                        style={{ backgroundColor: property.colorHex }}
                                                                    />
                                                                )}
                                                                <span>{property.name}</span>
                                                                <span className="text-muted-foreground">
                                                                    (£{property.value.toLocaleString()})
                                                                </span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {selectedCollateral && (
                                                <div className="text-sm text-muted-foreground p-2 rounded bg-green-500/10 border border-green-500/30">
                                                    <div className="flex items-center gap-2">
                                                        <Shield className="h-3 w-3 text-green-500" />
                                                        <span>Secured by {selectedCollateral.name}</span>
                                                    </div>
                                                    <div className="text-xs mt-1">
                                                        Collateral value: £{selectedCollateral.value.toLocaleString()}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            No properties available as collateral. Add properties first.
                                        </p>
                                    )}
                                </div>
                            )}

                            {!useCollateral && (
                                <p className="text-xs text-muted-foreground">
                                    This loan will be unsecured. Toggle above to add collateral.
                                </p>
                            )}
                        </div>

                        {debtLimit > 0 && (
                            <div className="text-sm text-muted-foreground text-right">
                                Current debt: £{currentDebt.toLocaleString()} / £{debtLimit.toLocaleString()} limit
                            </div>
                        )}
                        {wouldExceedLimit && (
                            <div className="text-sm text-destructive text-right">
                                ⚠️ This would exceed the debt limit!
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
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
