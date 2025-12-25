'use client';

import { LoanEvent } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface LoanHistoryProps {
    events: LoanEvent[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    loanAmount?: number;
}

const eventTypeConfig = {
    created: { label: 'Created', color: 'bg-blue-500', icon: '📝' },
    interest: { label: 'Interest', color: 'bg-orange-500', icon: '📈' },
    payment: { label: 'Payment', color: 'bg-green-500', icon: '💰' },
};

export function LoanHistory({ events, open, onOpenChange, loanAmount }: LoanHistoryProps) {
    const sortedEvents = [...events].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        📋 Loan History
                        {loanAmount !== undefined && (
                            <Badge variant="outline">
                                Current: £{loanAmount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                            </Badge>
                        )}
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[400px] pr-4">
                    {sortedEvents.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No events recorded yet.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sortedEvents.map((event) => {
                                const config = eventTypeConfig[event.type];
                                return (
                                    <div
                                        key={event.id}
                                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border"
                                    >
                                        <div className="text-2xl">{config.icon}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <Badge className={config.color}>{config.label}</Badge>
                                                <span className="text-sm text-muted-foreground">
                                                    {new Date(event.timestamp).toLocaleDateString()}{' '}
                                                    {new Date(event.timestamp).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <p className="text-sm mt-1">{event.description}</p>
                                            <p className="text-lg font-mono font-bold mt-1">
                                                {event.type === 'payment' ? '-' : '+'}£
                                                {event.amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
