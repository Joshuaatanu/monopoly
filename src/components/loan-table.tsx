'use client';

import { useState } from 'react';
import { Player, Loan, LoanEvent, Property } from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CurrencyInput } from '@/components/ui/currency-input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { LoanHistory } from './loan-history';
import { History, Shield, ShieldOff } from 'lucide-react';

interface LoanTableProps {
    loans: Loan[];
    getPlayer: (playerId: string) => Player | undefined;
    getLoanEvents: (loanId: string) => LoanEvent[];
    getLoanCollateral: (loanId: string) => Property | undefined;
    onPayOff: (loanId: string, amount: number) => void;
}

export function LoanTable({ loans, getPlayer, getLoanEvents, getLoanCollateral, onPayOff }: LoanTableProps) {
    const [payingLoan, setPayingLoan] = useState<Loan | null>(null);
    const [payAmount, setPayAmount] = useState('');
    const [historyLoan, setHistoryLoan] = useState<Loan | null>(null);

    const handlePaySubmit = () => {
        if (payingLoan && payAmount) {
            onPayOff(payingLoan.id, parseFloat(payAmount));
            setPayingLoan(null);
            setPayAmount('');
        }
    };

    const handlePayFull = () => {
        if (payingLoan) {
            onPayOff(payingLoan.id, payingLoan.currentAmount);
            setPayingLoan(null);
            setPayAmount('');
        }
    };

    if (loans.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No loans yet. Create a loan for a player to get started.
            </div>
        );
    }

    return (
        <>
            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Player</TableHead>
                            <TableHead className="text-right">Initial</TableHead>
                            <TableHead className="text-right">Current</TableHead>
                            <TableHead className="text-center">Rate</TableHead>
                            <TableHead className="text-center">Pass GO</TableHead>
                            <TableHead className="text-right">Interest</TableHead>
                            <TableHead>Collateral</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loans.map((loan) => {
                            const player = getPlayer(loan.playerId);
                            const interest = loan.currentAmount - loan.initialAmount;
                            const collateral = getLoanCollateral(loan.id);
                            return (
                                <TableRow key={loan.id} className={loan.isPaidOff ? 'opacity-50' : ''}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: player?.color }}
                                            />
                                            <span className="font-medium">{player?.name || 'Unknown'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        £{loan.initialAmount.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right font-mono font-bold">
                                        £{loan.currentAmount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className={
                                            loan.interestRate === 5 ? 'text-green-500 border-green-500' :
                                                loan.interestRate === 15 ? 'text-red-500 border-red-500' :
                                                    ''
                                        }>
                                            {loan.interestRate}%
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline">{loan.passedGoCount}x</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-orange-500">
                                        +£{interest.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </TableCell>
                                    <TableCell>
                                        {collateral ? (
                                            <div className="flex items-center gap-1.5">
                                                <Shield className="h-3 w-3 text-green-500" />
                                                <div className="flex items-center gap-1">
                                                    {collateral.colorHex && (
                                                        <div
                                                            className="w-2 h-2 rounded-full"
                                                            style={{ backgroundColor: collateral.colorHex }}
                                                        />
                                                    )}
                                                    <span className="text-xs truncate max-w-20" title={collateral.name}>
                                                        {collateral.name}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <ShieldOff className="h-3 w-3" />
                                                <span className="text-xs">Unsecured</span>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={loan.isPaidOff ? 'secondary' : 'destructive'}>
                                            {loan.isPaidOff ? 'Paid Off' : 'Active'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8"
                                                onClick={() => setHistoryLoan(loan)}
                                                title="View History"
                                            >
                                                <History className="h-4 w-4" />
                                            </Button>
                                            {!loan.isPaidOff && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setPayingLoan(loan);
                                                        setPayAmount('');
                                                    }}
                                                >
                                                    Pay
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Pay Dialog */}
            <Dialog open={!!payingLoan} onOpenChange={(open) => !open && setPayingLoan(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Pay Off Loan</DialogTitle>
                        <DialogDescription>
                            Current balance: £{payingLoan?.currentAmount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    £
                                </span>
                                <CurrencyInput
                                    placeholder="Amount to pay"
                                    className="pl-7"
                                    value={payAmount}
                                    onChange={setPayAmount}
                                    autoFocus
                                />
                            </div>
                            <Button variant="secondary" onClick={handlePayFull}>
                                Pay Full
                            </Button>
                        </div>
                        {payingLoan?.collateralPropertyId && (
                            <div className="text-sm text-muted-foreground p-2 rounded bg-green-500/10 border border-green-500/30">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-3 w-3 text-green-500" />
                                    <span>Paying off this loan will release the collateral</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPayingLoan(null)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePaySubmit}
                            disabled={!payAmount || parseFloat(payAmount) <= 0}
                        >
                            Pay £{payAmount || '0'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* History Dialog */}
            <LoanHistory
                events={historyLoan ? getLoanEvents(historyLoan.id) : []}
                open={!!historyLoan}
                onOpenChange={(open) => !open && setHistoryLoan(null)}
                loanAmount={historyLoan?.currentAmount}
            />
        </>
    );
}
