'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Player,
    Loan,
    LoanEvent,
    Property,
    GameState,
    InterestRate,
    MonopolyPiece,
    PLAYER_COLORS,
    MONOPOLY_PIECES,
} from '@/types';

const STORAGE_KEY = 'monopoly-loan-tracker';

const generateId = () => Math.random().toString(36).substring(2, 9);

const getInitialState = (): GameState => ({
    players: [],
    loans: [],
    loanEvents: [],
    properties: [],
    totalPassedGo: 0,
    bankruptcyThreshold: 5000, // Default threshold
});

export function useGameState() {
    const [gameState, setGameState] = useState<GameState>(getInitialState);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Convert date strings back to Date objects
                parsed.loans = (parsed.loans || []).map((loan: Loan) => ({
                    ...loan,
                    createdAt: new Date(loan.createdAt),
                    interestRate: loan.interestRate || 10, // Default for old data
                }));
                parsed.loanEvents = (parsed.loanEvents || []).map((event: LoanEvent) => ({
                    ...event,
                    timestamp: new Date(event.timestamp),
                }));
                parsed.properties = (parsed.properties || []).map((prop: Property) => ({
                    ...prop,
                    mortgagedAt: prop.mortgagedAt ? new Date(prop.mortgagedAt) : undefined,
                }));
                // Migrate old players without new fields
                parsed.players = (parsed.players || []).map((player: Player, index: number) => ({
                    ...player,
                    avatar: player.avatar || MONOPOLY_PIECES[index % MONOPOLY_PIECES.length].piece,
                    notes: player.notes || '',
                    debtLimit: player.debtLimit ?? 0,
                    isCurrentTurn: player.isCurrentTurn ?? false,
                }));
                setGameState({
                    ...getInitialState(),
                    ...parsed,
                });
            } catch (e) {
                console.error('Failed to parse stored game state:', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage on state change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
        }
    }, [gameState, isLoaded]);

    // Add a loan event
    const addLoanEvent = useCallback((loanId: string, type: LoanEvent['type'], amount: number, description: string) => {
        const event: LoanEvent = {
            id: generateId(),
            loanId,
            type,
            amount,
            timestamp: new Date(),
            description,
        };
        setGameState((prev) => ({
            ...prev,
            loanEvents: [...prev.loanEvents, event],
        }));
        return event;
    }, []);

    // Player management
    const addPlayer = useCallback((name: string, avatar?: MonopolyPiece) => {
        setGameState((prev) => {
            const colorIndex = prev.players.length % PLAYER_COLORS.length;
            const avatarPiece = avatar || MONOPOLY_PIECES[prev.players.length % MONOPOLY_PIECES.length].piece;
            const newPlayer: Player = {
                id: generateId(),
                name,
                color: PLAYER_COLORS[colorIndex],
                avatar: avatarPiece,
                notes: '',
                debtLimit: 0,
                isCurrentTurn: prev.players.length === 0, // First player starts
            };
            return {
                ...prev,
                players: [...prev.players, newPlayer],
            };
        });
    }, []);

    const removePlayer = useCallback((playerId: string) => {
        setGameState((prev) => ({
            ...prev,
            players: prev.players.filter((p) => p.id !== playerId),
            loans: prev.loans.filter((l) => l.playerId !== playerId),
            properties: prev.properties.filter((p) => p.playerId !== playerId),
        }));
    }, []);

    const updatePlayerNotes = useCallback((playerId: string, notes: string) => {
        setGameState((prev) => ({
            ...prev,
            players: prev.players.map((p) =>
                p.id === playerId ? { ...p, notes } : p
            ),
        }));
    }, []);

    const updatePlayerDebtLimit = useCallback((playerId: string, debtLimit: number) => {
        setGameState((prev) => ({
            ...prev,
            players: prev.players.map((p) =>
                p.id === playerId ? { ...p, debtLimit } : p
            ),
        }));
    }, []);

    const updatePlayerAvatar = useCallback((playerId: string, avatar: MonopolyPiece) => {
        setGameState((prev) => ({
            ...prev,
            players: prev.players.map((p) =>
                p.id === playerId ? { ...p, avatar } : p
            ),
        }));
    }, []);

    // Turn management
    const nextTurn = useCallback(() => {
        setGameState((prev) => {
            const currentIndex = prev.players.findIndex((p) => p.isCurrentTurn);
            const nextIndex = (currentIndex + 1) % prev.players.length;
            return {
                ...prev,
                players: prev.players.map((p, i) => ({
                    ...p,
                    isCurrentTurn: i === nextIndex,
                })),
            };
        });
    }, []);

    const setCurrentTurn = useCallback((playerId: string) => {
        setGameState((prev) => ({
            ...prev,
            players: prev.players.map((p) => ({
                ...p,
                isCurrentTurn: p.id === playerId,
            })),
        }));
    }, []);

    // Loan management
    const createLoan = useCallback((playerId: string, amount: number, interestRate: InterestRate = 10) => {
        const loanId = generateId();
        setGameState((prev) => {
            const player = prev.players.find((p) => p.id === playerId);
            const newLoan: Loan = {
                id: loanId,
                playerId,
                initialAmount: amount,
                currentAmount: amount,
                interestRate,
                createdAt: new Date(),
                passedGoCount: 0,
                isPaidOff: false,
            };
            const event: LoanEvent = {
                id: generateId(),
                loanId,
                type: 'created',
                amount,
                timestamp: new Date(),
                description: `Loan created for ${player?.name} at ${interestRate}% interest`,
            };
            return {
                ...prev,
                loans: [...prev.loans, newLoan],
                loanEvents: [...prev.loanEvents, event],
            };
        });
    }, []);

    const payOffLoan = useCallback((loanId: string, amount: number) => {
        setGameState((prev) => {
            const loan = prev.loans.find((l) => l.id === loanId);
            const player = prev.players.find((p) => p.id === loan?.playerId);
            const event: LoanEvent = {
                id: generateId(),
                loanId,
                type: 'payment',
                amount,
                timestamp: new Date(),
                description: `${player?.name} paid $${amount.toLocaleString()}`,
            };
            return {
                ...prev,
                loans: prev.loans.map((l) => {
                    if (l.id !== loanId) return l;
                    const newAmount = Math.max(0, l.currentAmount - amount);
                    return {
                        ...l,
                        currentAmount: Math.round(newAmount * 100) / 100,
                        isPaidOff: newAmount === 0,
                    };
                }),
                loanEvents: [...prev.loanEvents, event],
            };
        });
    }, []);

    const passGo = useCallback((playerId: string) => {
        setGameState((prev) => {
            const player = prev.players.find((p) => p.id === playerId);
            const playerLoans = prev.loans.filter((l) => l.playerId === playerId && !l.isPaidOff);

            const newEvents: LoanEvent[] = playerLoans.map((loan) => {
                const interest = loan.currentAmount * (loan.interestRate / 100);
                return {
                    id: generateId(),
                    loanId: loan.id,
                    type: 'interest' as const,
                    amount: interest,
                    timestamp: new Date(),
                    description: `${player?.name} passed GO - ${loan.interestRate}% interest added`,
                };
            });

            return {
                ...prev,
                totalPassedGo: prev.totalPassedGo + 1,
                loans: prev.loans.map((loan) => {
                    if (loan.playerId !== playerId || loan.isPaidOff) return loan;
                    const interest = loan.currentAmount * (loan.interestRate / 100);
                    return {
                        ...loan,
                        currentAmount: Math.round((loan.currentAmount + interest) * 100) / 100,
                        passedGoCount: loan.passedGoCount + 1,
                    };
                }),
                loanEvents: [...prev.loanEvents, ...newEvents],
            };
        });
    }, []);

    // Property management
    const addProperty = useCallback((playerId: string, name: string, value: number) => {
        setGameState((prev) => {
            const newProperty: Property = {
                id: generateId(),
                playerId,
                name,
                value,
                isMortgaged: false,
            };
            return {
                ...prev,
                properties: [...prev.properties, newProperty],
            };
        });
    }, []);

    const removeProperty = useCallback((propertyId: string) => {
        setGameState((prev) => ({
            ...prev,
            properties: prev.properties.filter((p) => p.id !== propertyId),
        }));
    }, []);

    const toggleMortgage = useCallback((propertyId: string) => {
        setGameState((prev) => ({
            ...prev,
            properties: prev.properties.map((p) => {
                if (p.id !== propertyId) return p;
                return {
                    ...p,
                    isMortgaged: !p.isMortgaged,
                    mortgagedAt: !p.isMortgaged ? new Date() : undefined,
                };
            }),
        }));
    }, []);

    // Getters
    const getPlayerLoans = useCallback(
        (playerId: string) => gameState.loans.filter((l) => l.playerId === playerId),
        [gameState.loans]
    );

    const getPlayerProperties = useCallback(
        (playerId: string) => gameState.properties.filter((p) => p.playerId === playerId),
        [gameState.properties]
    );

    const getPlayer = useCallback(
        (playerId: string) => gameState.players.find((p) => p.id === playerId),
        [gameState.players]
    );

    const getCurrentPlayer = useCallback(
        () => gameState.players.find((p) => p.isCurrentTurn),
        [gameState.players]
    );

    const getLoanEvents = useCallback(
        (loanId: string) => gameState.loanEvents.filter((e) => e.loanId === loanId),
        [gameState.loanEvents]
    );

    const getPlayerDebt = useCallback(
        (playerId: string) => {
            return gameState.loans
                .filter((l) => l.playerId === playerId && !l.isPaidOff)
                .reduce((sum, l) => sum + l.currentAmount, 0);
        },
        [gameState.loans]
    );

    const isPlayerBankrupt = useCallback(
        (playerId: string) => {
            if (gameState.bankruptcyThreshold === 0) return false;
            return getPlayerDebt(playerId) >= gameState.bankruptcyThreshold;
        },
        [gameState.bankruptcyThreshold, getPlayerDebt]
    );

    const getPlayerOverDebtLimit = useCallback(
        (playerId: string) => {
            const player = getPlayer(playerId);
            if (!player || player.debtLimit === 0) return false;
            return getPlayerDebt(playerId) > player.debtLimit;
        },
        [getPlayer, getPlayerDebt]
    );

    const getTotalDebt = useCallback(
        () => gameState.loans.filter((l) => !l.isPaidOff).reduce((sum, l) => sum + l.currentAmount, 0),
        [gameState.loans]
    );

    const getTotalInterest = useCallback(
        () => gameState.loans.reduce((sum, l) => sum + (l.currentAmount - l.initialAmount), 0),
        [gameState.loans]
    );

    const getActiveLoansCount = useCallback(
        () => gameState.loans.filter((l) => !l.isPaidOff).length,
        [gameState.loans]
    );

    const getUnmortgageCost = useCallback(
        (propertyId: string) => {
            const property = gameState.properties.find((p) => p.id === propertyId);
            if (!property) return 0;
            return Math.round(property.value * 1.1); // 10% fee
        },
        [gameState.properties]
    );

    // Settings
    const setBankruptcyThreshold = useCallback((threshold: number) => {
        setGameState((prev) => ({
            ...prev,
            bankruptcyThreshold: threshold,
        }));
    }, []);

    // Reset
    const resetGame = useCallback(() => {
        setGameState(getInitialState());
    }, []);

    // Export/Import for sharing
    const exportState = useCallback(() => {
        return JSON.stringify(gameState);
    }, [gameState]);

    const importState = useCallback((stateJson: string) => {
        try {
            const parsed = JSON.parse(stateJson);
            // Re-hydrate dates
            parsed.loans = (parsed.loans || []).map((loan: Loan) => ({
                ...loan,
                createdAt: new Date(loan.createdAt),
            }));
            parsed.loanEvents = (parsed.loanEvents || []).map((event: LoanEvent) => ({
                ...event,
                timestamp: new Date(event.timestamp),
            }));
            parsed.properties = (parsed.properties || []).map((prop: Property) => ({
                ...prop,
                mortgagedAt: prop.mortgagedAt ? new Date(prop.mortgagedAt) : undefined,
            }));
            setGameState(parsed);
            return true;
        } catch (e) {
            console.error('Failed to import state:', e);
            return false;
        }
    }, []);

    return {
        ...gameState,
        isLoaded,
        // Player actions
        addPlayer,
        removePlayer,
        updatePlayerNotes,
        updatePlayerDebtLimit,
        updatePlayerAvatar,
        // Turn actions
        nextTurn,
        setCurrentTurn,
        getCurrentPlayer,
        // Loan actions
        createLoan,
        payOffLoan,
        passGo,
        // Property actions
        addProperty,
        removeProperty,
        toggleMortgage,
        getUnmortgageCost,
        // Getters
        getPlayerLoans,
        getPlayerProperties,
        getPlayer,
        getLoanEvents,
        getPlayerDebt,
        isPlayerBankrupt,
        getPlayerOverDebtLimit,
        getTotalDebt,
        getTotalInterest,
        getActiveLoansCount,
        // Settings
        setBankruptcyThreshold,
        // Game
        resetGame,
        exportState,
        importState,
    };
}
