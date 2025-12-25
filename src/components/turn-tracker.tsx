'use client';

import { Player, MONOPOLY_PIECES } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TurnTrackerProps {
    players: Player[];
    onNextTurn: () => void;
    onSetTurn: (playerId: string) => void;
}

export function TurnTracker({ players, onNextTurn, onSetTurn }: TurnTrackerProps) {
    const currentPlayer = players.find((p) => p.isCurrentTurn);
    const currentIndex = players.findIndex((p) => p.isCurrentTurn);
    const nextIndex = players.length > 0 ? (currentIndex + 1) % players.length : 0;
    const nextPlayer = players[nextIndex];

    const getAvatarEmoji = (player: Player) => {
        const piece = MONOPOLY_PIECES.find((p) => p.piece === player.avatar);
        return piece?.emoji || '🎮';
    };

    if (players.length === 0) {
        return null;
    }

    return (
        <Card className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-500/30">
            <CardContent className="py-4">
                <div className="flex items-center justify-between gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                            const prevIndex = (currentIndex - 1 + players.length) % players.length;
                            onSetTurn(players[prevIndex].id);
                        }}
                        disabled={players.length < 2}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex-1 text-center">
                        <div className="text-sm text-muted-foreground mb-1">Current Turn</div>
                        <div className="flex items-center justify-center gap-3">
                            <span className="text-4xl">{currentPlayer ? getAvatarEmoji(currentPlayer) : '❓'}</span>
                            <div>
                                <div
                                    className="text-2xl font-bold"
                                    style={{ color: currentPlayer?.color }}
                                >
                                    {currentPlayer?.name || 'No players'}
                                </div>
                                {nextPlayer && players.length > 1 && (
                                    <div className="text-sm text-muted-foreground">
                                        Next: {getAvatarEmoji(nextPlayer)} {nextPlayer.name}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onNextTurn}
                        disabled={players.length < 2}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* Player dots */}
                {players.length > 1 && (
                    <div className="flex justify-center gap-2 mt-3">
                        {players.map((player, index) => (
                            <button
                                key={player.id}
                                onClick={() => onSetTurn(player.id)}
                                className={`w-3 h-3 rounded-full transition-all ${player.isCurrentTurn
                                        ? 'scale-125 ring-2 ring-offset-2 ring-offset-background'
                                        : 'opacity-50 hover:opacity-100'
                                    }`}
                                style={{
                                    backgroundColor: player.color,
                                    ringColor: player.color,
                                }}
                                title={player.name}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
