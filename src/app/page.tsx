'use client';

import { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/use-game-state';
import { Player, InterestRate } from '@/types';
import { PlayerCard } from '@/components/player-card';
import { LoanForm } from '@/components/loan-form';
import { LoanTable } from '@/components/loan-table';
import { GameStats } from '@/components/game-stats';
import { AddPlayerDialog } from '@/components/add-player-dialog';
import { TurnTracker } from '@/components/turn-tracker';
import { PropertyManager } from '@/components/property-manager';
import { GameShare } from '@/components/game-share';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RotateCcw, Home, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import LZString from 'lz-string';

export default function HomePage() {
  const {
    players,
    loans,
    properties,
    totalPassedGo,
    bankruptcyThreshold,
    isLoaded,
    addPlayer,
    removePlayer,
    updatePlayerNotes,
    updatePlayerAvatar,
    createLoan,
    payOffLoan,
    passGo,
    nextTurn,
    setCurrentTurn,
    addProperty,
    removeProperty,
    toggleMortgage,
    getUnmortgageCost,
    getPlayerLoans,
    getPlayerProperties,
    getPlayer,
    getPlayerDebt,
    isPlayerBankrupt,
    getPlayerOverDebtLimit,
    getLoanEvents,
    getLoanCollateral,
    getAvailableCollateralProperties,
    getTotalDebt,
    getTotalInterest,
    getActiveLoansCount,
    resetGame,
    exportState,
    importState,
  } = useGameState();

  const [loanFormPlayer, setLoanFormPlayer] = useState<Player | null>(null);
  const [selectedPlayerForProperties, setSelectedPlayerForProperties] = useState<string | null>(null);

  // Check URL for shared state on load
  useEffect(() => {
    if (typeof window !== 'undefined' && isLoaded) {
      const params = new URLSearchParams(window.location.search);
      const stateParam = params.get('state');
      if (stateParam) {
        const decompressed = LZString.decompressFromEncodedURIComponent(stateParam);
        if (decompressed) {
          const success = importState(decompressed);
          if (success) {
            toast.success('Game loaded from shared link!');
            // Clear URL params
            window.history.replaceState({}, '', window.location.pathname);
          }
        }
      }
    }
  }, [isLoaded, importState]);

  const handlePassGo = (playerId: string) => {
    const player = getPlayer(playerId);
    const playerLoans = getPlayerLoans(playerId).filter((l) => !l.isPaidOff);
    passGo(playerId);
    toast.success(`${player?.name} passed GO!`, {
      description: `Interest added to ${playerLoans.length} loan(s)`,
    });
  };

  const handleCreateLoan = (playerId: string, amount: number, interestRate: InterestRate, collateralPropertyId?: string) => {
    createLoan(playerId, amount, interestRate, collateralPropertyId);
    const player = getPlayer(playerId);
    const collateralText = collateralPropertyId ? ' (secured)' : '';
    toast.success(`Loan created for ${player?.name}${collateralText}`, {
      description: `£${amount.toLocaleString()} at ${interestRate}% interest per GO`,
    });
  };

  const handlePayOff = (loanId: string, amount: number) => {
    payOffLoan(loanId, amount);
    toast.success('Payment received', {
      description: `£${amount.toLocaleString()} paid off`,
    });
  };

  const handleResetGame = () => {
    if (confirm('Are you sure you want to reset the game? All data will be lost.')) {
      resetGame();
      toast.success('Game reset', {
        description: 'All players and loans have been cleared',
      });
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="animate-pulse text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏦</span>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  Monopoly Loan Tracker
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  Track loans, mortgages & interest
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <GameShare exportState={exportState} importState={importState} />
              <AddPlayerDialog onAddPlayer={addPlayer} />
              <Button variant="outline" size="icon" onClick={handleResetGame} title="Reset Game">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 sm:py-8 space-y-6">
        {/* Turn Tracker */}
        {players.length > 0 && (
          <TurnTracker
            players={players}
            onNextTurn={nextTurn}
            onSetTurn={setCurrentTurn}
          />
        )}

        {/* Stats Section */}
        <GameStats
          totalDebt={getTotalDebt()}
          totalInterest={getTotalInterest()}
          activeLoansCount={getActiveLoansCount()}
          totalPassedGo={totalPassedGo}
        />

        {/* Players Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>👥</span> Players
          </h2>
          {players.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
              No players yet. Click &quot;Add Player&quot; to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {players.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  loans={getPlayerLoans(player.id)}
                  onRemove={() => removePlayer(player.id)}
                  onCreateLoan={() => setLoanFormPlayer(player)}
                  onPassGo={() => handlePassGo(player.id)}
                  onUpdateNotes={(notes) => updatePlayerNotes(player.id, notes)}
                  onUpdateAvatar={(avatar) => updatePlayerAvatar(player.id, avatar)}
                  isOverDebtLimit={getPlayerOverDebtLimit(player.id)}
                  isBankrupt={isPlayerBankrupt(player.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Tabs for Loans and Properties */}
        <Tabs defaultValue="loans" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="loans" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Loans
            </TabsTrigger>
            <TabsTrigger value="properties" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Properties
            </TabsTrigger>
          </TabsList>

          <TabsContent value="loans" className="mt-4">
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>📋</span> All Loans
              </h2>
              <LoanTable
                loans={loans}
                getPlayer={getPlayer}
                getLoanEvents={getLoanEvents}
                getLoanCollateral={getLoanCollateral}
                onPayOff={handlePayOff}
              />
            </section>
          </TabsContent>

          <TabsContent value="properties" className="mt-4">
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>🏠</span> Properties & Mortgages
              </h2>
              {players.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                  Add players first to manage their properties.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {players.map((player) => (
                    <PropertyManager
                      key={player.id}
                      player={player}
                      properties={getPlayerProperties(player.id)}
                      onAddProperty={(name, value, templateId, colorHex) => addProperty(player.id, name, value, templateId, colorHex)}
                      onRemoveProperty={removeProperty}
                      onToggleMortgage={toggleMortgage}
                      getUnmortgageCost={getUnmortgageCost}
                    />
                  ))}
                </div>
              )}
            </section>
          </TabsContent>
        </Tabs>
      </main>

      {/* Loan Form Dialog */}
      <LoanForm
        player={loanFormPlayer}
        open={!!loanFormPlayer}
        onOpenChange={(open) => !open && setLoanFormPlayer(null)}
        onSubmit={handleCreateLoan}
        currentDebt={loanFormPlayer ? getPlayerDebt(loanFormPlayer.id) : 0}
        debtLimit={loanFormPlayer?.debtLimit || 0}
        availableCollateral={loanFormPlayer ? getAvailableCollateralProperties(loanFormPlayer.id) : []}
      />

      {/* Footer */}
      <footer className="border-t border-white/10 py-4 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Monopoly Loan Tracker • All data saved locally • Share via QR code
        </div>
      </footer>
    </div>
  );
}
