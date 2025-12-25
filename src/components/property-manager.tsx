'use client';

import { useState } from 'react';
import { Player, Property } from '@/types';
import { MONOPOLY_PROPERTIES, MonopolyPropertyTemplate } from '@/data/monopoly-properties';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Home, X, Lock, Unlock, Search } from 'lucide-react';

interface PropertyManagerProps {
    player: Player;
    properties: Property[];
    onAddProperty: (name: string, value: number, templateId?: string, colorHex?: string) => void;
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
    const [selectedTemplate, setSelectedTemplate] = useState<MonopolyPropertyTemplate | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleAdd = () => {
        if (newName && newValue) {
            onAddProperty(
                newName,
                parseFloat(newValue),
                selectedTemplate?.id,
                selectedTemplate?.colorHex
            );
            resetForm();
        }
    };

    const resetForm = () => {
        setNewName('');
        setNewValue('');
        setSelectedTemplate(null);
        setSearchQuery('');
        setAddDialogOpen(false);
    };

    const handleSelectProperty = (template: MonopolyPropertyTemplate) => {
        setSelectedTemplate(template);
        setNewName(template.name);
        setNewValue(template.price.toString());
        setSearchQuery('');
    };

    const handleClearSelection = () => {
        setSelectedTemplate(null);
        setNewName('');
        setNewValue('');
    };

    // Filter properties for search
    const filteredProperties = MONOPOLY_PROPERTIES.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.colorGroup.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                                            {property.colorHex && (
                                                <div
                                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: property.colorHex }}
                                                />
                                            )}
                                            <span className="font-medium truncate">{property.name}</span>
                                            {property.isMortgaged && (
                                                <Badge variant="outline" className="text-orange-500 border-orange-500">
                                                    Mortgaged
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            £{property.value.toLocaleString()}
                                            {property.isMortgaged && (
                                                <span className="ml-2 text-orange-500">
                                                    (Unmortgage: £{getUnmortgageCost(property.id).toLocaleString()})
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
                                    Total Mortgaged: £{mortgagedValue.toLocaleString()}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={addDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); else setAddDialogOpen(true); }}>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add Property for {player.name}</DialogTitle>
                        <DialogDescription>
                            Search for a UK Monopoly property or enter custom details. You can adjust the value.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {/* Search for Monopoly properties */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Search UK Monopoly Properties</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search... (e.g., Mayfair, station)"
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            {searchQuery && (
                                <div className="max-h-48 overflow-y-auto border rounded-md p-1 space-y-1">
                                    {filteredProperties.map((prop) => (
                                        <button
                                            key={prop.id}
                                            className="w-full text-left px-3 py-2 rounded hover:bg-accent flex items-center gap-2"
                                            onClick={() => handleSelectProperty(prop)}
                                        >
                                            <div
                                                className="w-3 h-3 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: prop.colorHex }}
                                            />
                                            <span className="flex-1">{prop.name}</span>
                                            <span className="text-muted-foreground">£{prop.price}</span>
                                        </button>
                                    ))}
                                    {filteredProperties.length === 0 && (
                                        <p className="text-sm text-muted-foreground text-center py-2">
                                            No properties found
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Selected Property Preview */}
                        {selectedTemplate && (
                            <div className="p-3 rounded-lg border bg-accent/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: selectedTemplate.colorHex }}
                                        />
                                        <span className="font-medium">{selectedTemplate.name}</span>
                                        <Badge variant="outline" className="text-xs">
                                            {selectedTemplate.colorGroup}
                                        </Badge>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleClearSelection}
                                    >
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Property Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Property Name</label>
                            <Input
                                placeholder="Property name"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </div>

                        {/* Property Value - Always Editable */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Value (you can adjust this)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    £
                                </span>
                                <CurrencyInput
                                    placeholder="Value"
                                    className="pl-7"
                                    value={newValue}
                                    onChange={setNewValue}
                                />
                            </div>
                            {selectedTemplate && newValue !== selectedTemplate.price.toString() && (
                                <p className="text-xs text-muted-foreground">
                                    Default value: £{selectedTemplate.price.toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={resetForm}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAdd}
                            disabled={!newName || !newValue}
                        >
                            Add Property
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
