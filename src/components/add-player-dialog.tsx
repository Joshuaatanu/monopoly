'use client';

import { useState } from 'react';
import { MonopolyPiece, MONOPOLY_PIECES } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { UserPlus } from 'lucide-react';

interface AddPlayerDialogProps {
    onAddPlayer: (name: string, avatar?: MonopolyPiece) => void;
}

export function AddPlayerDialog({ onAddPlayer }: AddPlayerDialogProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState<MonopolyPiece>('car');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onAddPlayer(name.trim(), selectedAvatar);
            setName('');
            setSelectedAvatar('car');
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Player
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Player</DialogTitle>
                    <DialogDescription>
                        Enter the player&apos;s name and choose their game piece.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <Input
                            placeholder="Player name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                        <div>
                            <label className="text-sm font-medium mb-2 block">Game Piece</label>
                            <div className="flex flex-wrap gap-2">
                                {MONOPOLY_PIECES.map((piece) => (
                                    <button
                                        key={piece.piece}
                                        type="button"
                                        onClick={() => setSelectedAvatar(piece.piece)}
                                        className={`text-2xl p-2 rounded-lg border transition-all ${selectedAvatar === piece.piece
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
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!name.trim()}>
                            Add Player
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
