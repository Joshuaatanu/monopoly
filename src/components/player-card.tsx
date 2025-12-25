'use client';

import { useState } from 'react';
import { Player, Loan, MonopolyPiece, MONOPOLY_PIECES } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { X, Settings, AlertTriangle } from 'lucide-react';

interface PlayerCardProps {
    player: Player;
    loans: Loan[];
    onRemove: () => void;
    onCreateLoan: () => void;
    onPassGo: () => void;
    onUpdateNotes: (notes: string) => void;
    onUpdateAvatar: (avatar: MonopolyPiece) => void;
    isOverDebtLimit?: boolean;
    isBankrupt?: boolean;
}

export function PlayerCard({
    player,
    loans,
    onRemove,
    onCreateLoan,
    onPassGo,
    onUpdateNotes,
    onUpdateAvatar,
    isOverDebtLimit = false,
    isBankrupt = false,
}: PlayerCardProps) {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [notes, setNotes] = useState(player.notes);

    const activeLoans = loans.filter((l) => !l.isPaidOff);
    const totalDebt = activeLoans.reduce((sum, l) => sum + l.currentAmount, 0);

    const avatarEmoji = MONOPOLY_PIECES.find((p) => p.piece === player.avatar)?.emoji || '🎮';

    const handleSaveSettings = () => {
        onUpdateNotes(notes);
        setSettingsOpen(false);
    };

    return (
        <TooltipProvider>
            <Card
                className={`relative overflow-hidden transition-all duration-300 ${player.isCurrentTurn ? 'ring-2 ring-amber-400 shadow-lg shadow-amber-400/20' : ''
                    } ${isBankrupt ? 'ring-2 ring-destructive' : ''}`}
            >
                <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundColor: player.color }}
                />
                {player.isCurrentTurn && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-yellow-400" />
                )}
                <CardHeader className="relative pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => setSettingsOpen(true)}
                                        className="text-2xl hover:scale-110 transition-transform"
                                    >
                                        {avatarEmoji}
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>Click to edit settings</TooltipContent>
                            </Tooltip>
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    {player.name}
                                    {player.isCurrentTurn && (
                                        <Badge className="bg-amber-500 text-xs">Turn</Badge>
                                    )}
                                </CardTitle>
                                {player.notes && (
                                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                                        {player.notes}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {(isOverDebtLimit || isBankrupt) && (
                                <Tooltip>
                                    <TooltipTrigger>
                                        <AlertTriangle className={`h-5 w-5 ${isBankrupt ? 'text-destructive' : 'text-orange-500'}`} />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {isBankrupt ? 'Bankrupt!' : 'Over debt limit!'}
                                    </TooltipContent>
                                </Tooltip>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => setSettingsOpen(true)}
                            >
                                <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 hover:bg-destructive/20"
                                onClick={onRemove}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="relative space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Debt</span>
                        <span
                            className={`text-xl font-bold ${isBankrupt ? 'text-destructive' : ''}`}
                            style={{ color: isBankrupt ? undefined : player.color }}
                        >
                            £{totalDebt.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                    {player.debtLimit > 0 && (
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Limit</span>
                            <span className={isOverDebtLimit ? 'text-orange-500' : ''}>
                                £{player.debtLimit.toLocaleString()}
                            </span>
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Active Loans</span>
                        <Badge variant={activeLoans.length > 0 ? 'default' : 'secondary'}>
                            {activeLoans.length}
                        </Badge>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <Button className="flex-1" variant="outline" onClick={onCreateLoan}>
                            + Loan
                        </Button>
                        <Button
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                            onClick={onPassGo}
                            disabled={activeLoans.length === 0}
                        >
                            🎲 Pass GO
                        </Button>
                    </div>
                </CardContent>

                {/* Settings Dialog */}
                <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Player Settings - {player.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Avatar</label>
                                <div className="flex flex-wrap gap-2">
                                    {MONOPOLY_PIECES.map((piece) => (
                                        <button
                                            key={piece.piece}
                                            onClick={() => onUpdateAvatar(piece.piece)}
                                            className={`text-2xl p-2 rounded-lg border transition-all ${player.avatar === piece.piece
                                                ? 'border-primary bg-primary/10 scale-110'
                                                : 'border-muted hover:border-primary/50'
                                                }`}
                                            title={piece.label}
                                        >
                                            {piece.emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Notes</label>
                                <Textarea
                                    placeholder="e.g., Owns Mayfair, needs £200"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSaveSettings}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </Card>
        </TooltipProvider>
    );
}
