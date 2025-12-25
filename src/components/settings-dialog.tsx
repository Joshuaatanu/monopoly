'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencyInput } from '@/components/ui/currency-input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';
import { toast } from 'sonner';

interface SettingsDialogProps {
    bankruptcyThreshold: number;
    onBankruptcyThresholdChange: (threshold: number) => void;
}

export function SettingsDialog({
    bankruptcyThreshold,
    onBankruptcyThresholdChange,
}: SettingsDialogProps) {
    const [open, setOpen] = useState(false);
    const [threshold, setThreshold] = useState(bankruptcyThreshold.toString());
    const [bankruptcyEnabled, setBankruptcyEnabled] = useState(bankruptcyThreshold > 0);

    useEffect(() => {
        setThreshold(bankruptcyThreshold.toString());
        setBankruptcyEnabled(bankruptcyThreshold > 0);
    }, [bankruptcyThreshold]);

    const handleSave = () => {
        const newThreshold = bankruptcyEnabled ? parseFloat(threshold) || 5000 : 0;
        onBankruptcyThresholdChange(newThreshold);
        setOpen(false);
        toast.success('Settings saved');
    };

    const handleCancel = () => {
        setThreshold(bankruptcyThreshold.toString());
        setBankruptcyEnabled(bankruptcyThreshold > 0);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" title="Game Settings">
                    <Settings className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Game Settings</DialogTitle>
                    <DialogDescription>
                        Configure game rules and behavior
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="bankruptcy-toggle">Bankruptcy Detection</Label>
                                <p className="text-sm text-muted-foreground">
                                    Mark players as bankrupt when debt exceeds threshold
                                </p>
                            </div>
                            <Switch
                                id="bankruptcy-toggle"
                                checked={bankruptcyEnabled}
                                onCheckedChange={setBankruptcyEnabled}
                            />
                        </div>
                        {bankruptcyEnabled && (
                            <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                                <Label htmlFor="bankruptcy-threshold">Bankruptcy Threshold (£)</Label>
                                <CurrencyInput
                                    id="bankruptcy-threshold"
                                    value={threshold}
                                    onChange={setThreshold}
                                    placeholder="5000"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Players will be marked as bankrupt when their total debt reaches this amount
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 p-3 rounded-lg bg-muted/50">
                        <h4 className="text-sm font-medium">Interest Rates</h4>
                        <p className="text-xs text-muted-foreground">
                            Available rates: 5%, 10%, 15% per pass GO
                        </p>
                        <p className="text-xs text-muted-foreground">
                            These are the standard rates and cannot be customized
                        </p>
                    </div>

                    <div className="space-y-2 p-3 rounded-lg bg-muted/50">
                        <h4 className="text-sm font-medium">Currency</h4>
                        <p className="text-xs text-muted-foreground">
                            GBP (£) - British Pounds
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Based on UK Monopoly property values
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
