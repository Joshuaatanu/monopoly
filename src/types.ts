// Player avatars - classic Monopoly pieces
export type MonopolyPiece = 'car' | 'dog' | 'hat' | 'ship' | 'thimble' | 'boot' | 'wheelbarrow' | 'cat';

export const MONOPOLY_PIECES: { piece: MonopolyPiece; emoji: string; label: string }[] = [
  { piece: 'car', emoji: '🚗', label: 'Car' },
  { piece: 'dog', emoji: '🐕', label: 'Dog' },
  { piece: 'hat', emoji: '🎩', label: 'Top Hat' },
  { piece: 'ship', emoji: '🚢', label: 'Battleship' },
  { piece: 'thimble', emoji: '🧵', label: 'Thimble' },
  { piece: 'boot', emoji: '👢', label: 'Boot' },
  { piece: 'wheelbarrow', emoji: '🛒', label: 'Wheelbarrow' },
  { piece: 'cat', emoji: '🐱', label: 'Cat' },
];

export interface Player {
  id: string;
  name: string;
  color: string;
  avatar: MonopolyPiece;
  notes: string;
  debtLimit: number; // 0 = no limit
  isCurrentTurn: boolean;
}

export type InterestRate = 5 | 10 | 15;

export interface Loan {
  id: string;
  playerId: string;
  initialAmount: number;
  currentAmount: number;
  interestRate: InterestRate;
  createdAt: Date;
  passedGoCount: number;
  isPaidOff: boolean;
}

export type LoanEventType = 'created' | 'interest' | 'payment';

export interface LoanEvent {
  id: string;
  loanId: string;
  type: LoanEventType;
  amount: number;
  timestamp: Date;
  description: string;
}

export interface Property {
  id: string;
  playerId: string;
  name: string;
  value: number;
  isMortgaged: boolean;
  mortgagedAt?: Date;
}

export interface GameState {
  players: Player[];
  loans: Loan[];
  loanEvents: LoanEvent[];
  properties: Property[];
  totalPassedGo: number;
  bankruptcyThreshold: number; // Default to 0 (disabled)
}

export const PLAYER_COLORS = [
  '#ef4444', // red
  '#3b82f6', // blue
  '#22c55e', // green
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
];
