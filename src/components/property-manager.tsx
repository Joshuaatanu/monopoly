'use client';

import { useState } from 'react';
import { Player, Property } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Home, X, Lock, Unlock } from 'lucide-react';

interface PropertyManagerProps {
    player: Player;
    properties: Property[];
    onAddProperty: (name: string, value: number) => void;
    onRemoveProperty: (propertyId: string) => void;
    onToggleMortgage: (propertyId: string) => void;
    getUnmortgageCost: (propertyId: string) => number;
}

export function PropertyManager({
    player,
    properties,
    onAddProperty,
    onRemoveProperty,
    onToggleMortgage,
    getUnmortgageCost,
}: PropertyManagerProps) {
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [newValue, setNewValue] = useState('');

    const handleAdd = () => {
        if (newName && newValue) {
            onAddProperty(newName, parseFloat(newValue));
            setNewName('');
            setNewValue('');
            setAddDialogOpen(false);
        }
    };

    const mortgagedValue = properties
        .filter((p) => p.isMortgaged)
        .reduce((sum, p) => sum + p.value, 0);

    return (
        <>
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            Properties
                        </CardTitle>
                        <Button size="sm" variant="outline" onClick={() => setAddDialogOpen(true)}>
                            + Add
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {properties.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-2">
                            No properties
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {properties.map((property) => (
                                <div
                                    key={property.id}
                                    className={`flex items-center justify-between p-2 rounded border ${property.isMortgaged ? 'bg-orange-500/10 border-orange-500/50' : ''
                                        }`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium truncate">{property.name}</span>
                                            {property.isMortgaged && (
                                                <Badge variant="outline" className="text-orange-500 border-orange-500">
                                                    Mortgaged
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            ${property.value.toLocaleString()}
                                            {property.isMortgaged && (
                                                <span className="ml-2 text-orange-500">
                                                    (Unmortgage: ${getUnmortgageCost(property.id).toLocaleString()})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8"
                                            onClick={() => onToggleMortgage(property.id)}
                                            title={property.isMortgaged ? 'Unmortgage' : 'Mortgage'}
                                        >
                                            {property.isMortgaged ? (
                                                <Unlock className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <Lock className="h-4 w-4 text-orange-500" />
                                            )}
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 hover:bg-destructive/20"
                                            onClick={() => onRemoveProperty(property.id)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {mortgagedValue > 0 && (
                                <div className="text-sm text-orange-500 text-right pt-2 border-t">
                                    Total Mortgaged: ${mortgagedValue.toLocaleString()}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Property for {player.name}</DialogTitle>
                        <DialogDescription>
                            Track a property to manage mortgages.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Input
                            placeholder="Property name (e.g., Boardwalk)"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            autoFocus
                        />
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                $
                            </span>
                            <CurrencyInput
                                placeholder="Value"
                                className="pl-7"
                                value={newValue}
                                onChange={setNewValue}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAdd} disabled={!newName || !newValue}>
                            Add Property
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
