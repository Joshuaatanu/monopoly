'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import LZString from 'lz-string';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Share2, Copy, Download, Upload, Check } from 'lucide-react';
import { toast } from 'sonner';

interface GameShareProps {
    exportState: () => string;
    importState: (state: string) => boolean;
}

export function GameShare({ exportState, importState }: GameShareProps) {
    const [open, setOpen] = useState(false);
    const [importData, setImportData] = useState('');
    const [copied, setCopied] = useState(false);

    const compressedState = LZString.compressToEncodedURIComponent(exportState());
    const shareUrl = typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}?state=${compressedState}`
        : '';

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success('Share URL copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCopyJson = () => {
        navigator.clipboard.writeText(exportState());
        toast.success('Game data copied to clipboard!');
    };

    const handleDownload = () => {
        const blob = new Blob([exportState()], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `monopoly-game-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Game file downloaded!');
    };

    const handleImport = () => {
        try {
            // Try to parse as direct JSON first
            let dataToImport = importData.trim();

            // Check if it's a URL with state parameter
            if (dataToImport.includes('?state=')) {
                const url = new URL(dataToImport);
                const compressed = url.searchParams.get('state');
                if (compressed) {
                    dataToImport = LZString.decompressFromEncodedURIComponent(compressed) || '';
                }
            }

            const success = importState(dataToImport);
            if (success) {
                toast.success('Game data imported successfully!');
                setImportData('');
                setOpen(false);
            } else {
                toast.error('Failed to import game data');
            }
        } catch (e) {
            toast.error('Invalid game data format');
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target?.result as string;
                setImportData(content);
            };
            reader.readAsText(file);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Share2 className="h-5 w-5" />
                        Share Game
                    </DialogTitle>
                    <DialogDescription>
                        Share your game via QR code, link, or file.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="share" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="share">Share</TabsTrigger>
                        <TabsTrigger value="import">Import</TabsTrigger>
                    </TabsList>

                    <TabsContent value="share" className="space-y-4">
                        <div className="flex justify-center p-4 bg-white rounded-lg">
                            <QRCodeSVG
                                value={shareUrl}
                                size={200}
                                level="M"
                                includeMargin
                            />
                        </div>
                        <p className="text-sm text-center text-muted-foreground">
                            Scan this QR code to load the current game state
                        </p>
                        <div className="flex gap-2">
                            <Button className="flex-1" onClick={handleCopyUrl}>
                                {copied ? (
                                    <Check className="h-4 w-4 mr-2" />
                                ) : (
                                    <Copy className="h-4 w-4 mr-2" />
                                )}
                                {copied ? 'Copied!' : 'Copy Link'}
                            </Button>
                            <Button variant="outline" className="flex-1" onClick={handleDownload}>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                            </Button>
                        </div>
                        <Button variant="ghost" className="w-full text-sm" onClick={handleCopyJson}>
                            Copy raw JSON data
                        </Button>
                    </TabsContent>

                    <TabsContent value="import" className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Paste share URL or JSON data:</label>
                            <Textarea
                                placeholder="Paste URL or JSON here..."
                                value={importData}
                                onChange={(e) => setImportData(e.target.value)}
                                rows={4}
                            />
                        </div>
                        <div className="text-center text-sm text-muted-foreground">or</div>
                        <div className="flex justify-center">
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <Button variant="outline" asChild>
                                    <span>
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload File
                                    </span>
                                </Button>
                            </label>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleImport} disabled={!importData.trim()}>
                                Import Game
                            </Button>
                        </DialogFooter>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
