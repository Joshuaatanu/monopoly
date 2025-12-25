import { renderHook, act } from '@testing-library/react';
import { useGameState } from '../use-game-state';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useGameState', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('Player Management', () => {
    it('should add a player with default values', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      expect(result.current.players).toHaveLength(1);
      expect(result.current.players[0]).toMatchObject({
        name: 'Alice',
        notes: '',
        debtLimit: 0,
        isCurrentTurn: true,
      });
    });

    it('should assign unique colors to players', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
        result.current.addPlayer('Bob');
        result.current.addPlayer('Charlie');
      });

      expect(result.current.players[0].color).not.toBe(result.current.players[1].color);
      expect(result.current.players[1].color).not.toBe(result.current.players[2].color);
    });

    it('should remove a player and their associated data', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.createLoan(playerId, 1000);
        result.current.addProperty(playerId, 'Park Place', 350);
      });

      act(() => {
        result.current.removePlayer(playerId);
      });

      expect(result.current.players).toHaveLength(0);
      expect(result.current.loans).toHaveLength(0);
      expect(result.current.properties).toHaveLength(0);
    });

    it('should update player notes', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.updatePlayerNotes(playerId, 'Has houses on Boardwalk');
      });

      expect(result.current.players[0].notes).toBe('Has houses on Boardwalk');
    });

    it('should update player debt limit', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.updatePlayerDebtLimit(playerId, 5000);
      });

      expect(result.current.players[0].debtLimit).toBe(5000);
    });

    it('should update player avatar', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.updatePlayerAvatar(playerId, 'hat');
      });

      expect(result.current.players[0].avatar).toBe('hat');
    });
  });

  describe('Turn Management', () => {
    it('should set first player as current turn', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
        result.current.addPlayer('Bob');
      });

      expect(result.current.players[0].isCurrentTurn).toBe(true);
      expect(result.current.players[1].isCurrentTurn).toBe(false);
    });

    it('should advance to next turn', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
        result.current.addPlayer('Bob');
        result.current.addPlayer('Charlie');
      });

      act(() => {
        result.current.nextTurn();
      });

      expect(result.current.players[0].isCurrentTurn).toBe(false);
      expect(result.current.players[1].isCurrentTurn).toBe(true);
      expect(result.current.players[2].isCurrentTurn).toBe(false);
    });

    it('should wrap turn to first player', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
        result.current.addPlayer('Bob');
      });

      act(() => {
        result.current.nextTurn();
        result.current.nextTurn();
      });

      expect(result.current.players[0].isCurrentTurn).toBe(true);
      expect(result.current.players[1].isCurrentTurn).toBe(false);
    });

    it('should set specific player turn', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
        result.current.addPlayer('Bob');
        result.current.addPlayer('Charlie');
      });

      const bobId = result.current.players[1].id;

      act(() => {
        result.current.setCurrentTurn(bobId);
      });

      expect(result.current.players[1].isCurrentTurn).toBe(true);
      expect(result.current.players[0].isCurrentTurn).toBe(false);
      expect(result.current.players[2].isCurrentTurn).toBe(false);
    });

    it('should get current player', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
        result.current.addPlayer('Bob');
      });

      const current = result.current.getCurrentPlayer();
      expect(current?.name).toBe('Alice');
    });
  });

  describe('Loan Management', () => {
    it('should create a loan with default 10% interest', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.createLoan(playerId, 1000);
      });

      expect(result.current.loans).toHaveLength(1);
      expect(result.current.loans[0]).toMatchObject({
        playerId,
        initialAmount: 1000,
        currentAmount: 1000,
        interestRate: 10,
        passedGoCount: 0,
        isPaidOff: false,
      });
    });

    it('should create a loan with custom interest rate', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.createLoan(playerId, 1000, 15);
      });

      expect(result.current.loans[0].interestRate).toBe(15);
    });

    it('should create a loan with collateral', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.addProperty(playerId, 'Park Place', 350);
      });

      const propertyId = result.current.properties[0].id;

      act(() => {
        result.current.createLoan(playerId, 1000, 10, propertyId);
      });

      expect(result.current.loans[0].collateralPropertyId).toBe(propertyId);
    });

    it('should create loan event when loan is created', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.createLoan(playerId, 1000, 10);
      });

      expect(result.current.loanEvents).toHaveLength(1);
      expect(result.current.loanEvents[0].type).toBe('created');
      expect(result.current.loanEvents[0].amount).toBe(1000);
    });

    it('should pay off loan partially', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.createLoan(playerId, 1000);
      });

      const loanId = result.current.loans[0].id;

      act(() => {
        result.current.payOffLoan(loanId, 400);
      });

      expect(result.current.loans[0].currentAmount).toBe(600);
      expect(result.current.loans[0].isPaidOff).toBe(false);
    });

    it('should pay off loan completely', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.createLoan(playerId, 1000);
      });

      const loanId = result.current.loans[0].id;

      act(() => {
        result.current.payOffLoan(loanId, 1000);
      });

      expect(result.current.loans[0].currentAmount).toBe(0);
      expect(result.current.loans[0].isPaidOff).toBe(true);
    });

    it('should create payment event when loan is paid', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.createLoan(playerId, 1000);
      });

      const loanId = result.current.loans[0].id;

      act(() => {
        result.current.payOffLoan(loanId, 400);
      });

      const paymentEvents = result.current.loanEvents.filter((e) => e.type === 'payment');
      expect(paymentEvents).toHaveLength(1);
      expect(paymentEvents[0].amount).toBe(400);
    });

    it('should add interest when passing GO', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.createLoan(playerId, 1000, 10);
      });

      act(() => {
        result.current.passGo(playerId);
      });

      expect(result.current.loans[0].currentAmount).toBe(1100);
      expect(result.current.loans[0].passedGoCount).toBe(1);
    });

    it('should compound interest correctly', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.createLoan(playerId, 1000, 10);
      });

      act(() => {
        result.current.passGo(playerId);
        result.current.passGo(playerId);
      });

      // First pass: 1000 * 1.1 = 1100
      // Second pass: 1100 * 1.1 = 1210
      expect(result.current.loans[0].currentAmount).toBe(1210);
      expect(result.current.loans[0].passedGoCount).toBe(2);
    });

    it('should not add interest to paid off loans', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.createLoan(playerId, 1000, 10);
      });

      const loanId = result.current.loans[0].id;

      act(() => {
        result.current.payOffLoan(loanId, 1000);
        result.current.passGo(playerId);
      });

      expect(result.current.loans[0].currentAmount).toBe(0);
      expect(result.current.loans[0].passedGoCount).toBe(0);
    });

    it('should create interest event when passing GO', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.createLoan(playerId, 1000, 10);
      });

      act(() => {
        result.current.passGo(playerId);
      });

      const interestEvents = result.current.loanEvents.filter((e) => e.type === 'interest');
      expect(interestEvents).toHaveLength(1);
      expect(interestEvents[0].amount).toBe(100);
    });

    it('should increment total passed GO count', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
        result.current.addPlayer('Bob');
      });

      const aliceId = result.current.players[0].id;
      const bobId = result.current.players[1].id;

      act(() => {
        result.current.passGo(aliceId);
        result.current.passGo(bobId);
        result.current.passGo(aliceId);
      });

      expect(result.current.totalPassedGo).toBe(3);
    });
  });

  describe('Property Management', () => {
    it('should add a property', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.addProperty(playerId, 'Park Place', 350);
      });

      expect(result.current.properties).toHaveLength(1);
      expect(result.current.properties[0]).toMatchObject({
        playerId,
        name: 'Park Place',
        value: 350,
        isMortgaged: false,
      });
    });

    it('should add a property with template and color', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.addProperty(playerId, 'Park Place', 350, 'park-place', '#0000FF');
      });

      expect(result.current.properties[0].templateId).toBe('park-place');
      expect(result.current.properties[0].colorHex).toBe('#0000FF');
    });

    it('should remove a property', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.addProperty(playerId, 'Park Place', 350);
      });

      const propertyId = result.current.properties[0].id;

      act(() => {
        result.current.removeProperty(propertyId);
      });

      expect(result.current.properties).toHaveLength(0);
    });

    it('should mortgage a property', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.addProperty(playerId, 'Park Place', 350);
      });

      const propertyId = result.current.properties[0].id;

      act(() => {
        result.current.toggleMortgage(propertyId);
      });

      expect(result.current.properties[0].isMortgaged).toBe(true);
      expect(result.current.properties[0].mortgagedAt).toBeInstanceOf(Date);
    });

    it('should unmortgage a property', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.addProperty(playerId, 'Park Place', 350);
      });

      const propertyId = result.current.properties[0].id;

      act(() => {
        result.current.toggleMortgage(propertyId);
        result.current.toggleMortgage(propertyId);
      });

      expect(result.current.properties[0].isMortgaged).toBe(false);
      expect(result.current.properties[0].mortgagedAt).toBeUndefined();
    });

    it('should calculate unmortgage cost with 10% fee', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.addProperty(playerId, 'Park Place', 350);
      });

      const propertyId = result.current.properties[0].id;
      const cost = result.current.getUnmortgageCost(propertyId);

      expect(cost).toBe(385); // 350 * 1.1
    });
  });

  describe('Getters and Calculations', () => {
    it('should get player loans', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
        result.current.addPlayer('Bob');
      });

      const aliceId = result.current.players[0].id;
      const bobId = result.current.players[1].id;

      act(() => {
        result.current.createLoan(aliceId, 1000);
        result.current.createLoan(aliceId, 500);
        result.current.createLoan(bobId, 750);
      });

      const aliceLoans = result.current.getPlayerLoans(aliceId);
      expect(aliceLoans).toHaveLength(2);
    });

    it('should get player properties', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
        result.current.addPlayer('Bob');
      });

      const aliceId = result.current.players[0].id;
      const bobId = result.current.players[1].id;

      act(() => {
        result.current.addProperty(aliceId, 'Park Place', 350);
        result.current.addProperty(aliceId, 'Boardwalk', 400);
        result.current.addProperty(bobId, 'Mayfair', 400);
      });

      const aliceProperties = result.current.getPlayerProperties(aliceId);
      expect(aliceProperties).toHaveLength(2);
    });

    it('should calculate player total debt', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.createLoan(playerId, 1000);
        result.current.createLoan(playerId, 500);
      });

      const debt = result.current.getPlayerDebt(playerId);
      expect(debt).toBe(1500);
    });

    it('should not include paid off loans in debt calculation', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.createLoan(playerId, 1000);
        result.current.createLoan(playerId, 500);
      });

      const firstLoanId = result.current.loans[0].id;

      act(() => {
        result.current.payOffLoan(firstLoanId, 1000);
      });

      const debt = result.current.getPlayerDebt(playerId);
      expect(debt).toBe(500);
    });

    it('should detect bankruptcy when threshold is set', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.setBankruptcyThreshold(1000);
        result.current.createLoan(playerId, 1500);
      });

      expect(result.current.isPlayerBankrupt(playerId)).toBe(true);
    });

    it('should not detect bankruptcy when threshold is 0', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.setBankruptcyThreshold(0);
        result.current.createLoan(playerId, 999999);
      });

      expect(result.current.isPlayerBankrupt(playerId)).toBe(false);
    });

    it('should detect when player is over debt limit', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.updatePlayerDebtLimit(playerId, 1000);
        result.current.createLoan(playerId, 1500);
      });

      expect(result.current.getPlayerOverDebtLimit(playerId)).toBe(true);
    });

    it('should calculate total debt across all players', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
        result.current.addPlayer('Bob');
      });

      const aliceId = result.current.players[0].id;
      const bobId = result.current.players[1].id;

      act(() => {
        result.current.createLoan(aliceId, 1000);
        result.current.createLoan(bobId, 500);
      });

      expect(result.current.getTotalDebt()).toBe(1500);
    });

    it('should calculate total interest accrued', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.createLoan(playerId, 1000, 10);
        result.current.passGo(playerId);
      });

      expect(result.current.getTotalInterest()).toBe(100);
    });

    it('should count active loans', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.createLoan(playerId, 1000);
        result.current.createLoan(playerId, 500);
        result.current.createLoan(playerId, 250);
      });

      const firstLoanId = result.current.loans[0].id;

      act(() => {
        result.current.payOffLoan(firstLoanId, 1000);
      });

      expect(result.current.getActiveLoansCount()).toBe(2);
    });

    it('should get loan events for specific loan', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.createLoan(playerId, 1000);
      });

      const loanId = result.current.loans[0].id;

      act(() => {
        result.current.passGo(playerId);
        result.current.payOffLoan(loanId, 200);
      });

      const events = result.current.getLoanEvents(loanId);
      expect(events).toHaveLength(3); // created, interest, payment
    });
  });

  describe('Collateral Management', () => {
    it('should get loan collateral', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.addProperty(playerId, 'Park Place', 350);
      });

      const propertyId = result.current.properties[0].id;

      act(() => {
        result.current.createLoan(playerId, 1000, 10, propertyId);
      });

      const loanId = result.current.loans[0].id;
      const collateral = result.current.getLoanCollateral(loanId);

      expect(collateral?.name).toBe('Park Place');
    });

    it('should get properties used as collateral', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.addProperty(playerId, 'Park Place', 350);
        result.current.addProperty(playerId, 'Boardwalk', 400);
      });

      const prop1Id = result.current.properties[0].id;
      const prop2Id = result.current.properties[1].id;

      act(() => {
        result.current.createLoan(playerId, 1000, 10, prop1Id);
        result.current.createLoan(playerId, 500, 10, prop2Id);
      });

      const collateralProps = result.current.getPropertiesUsedAsCollateral();
      expect(collateralProps).toHaveLength(2);
    });

    it('should not include paid off loan collateral', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.addProperty(playerId, 'Park Place', 350);
      });

      const propertyId = result.current.properties[0].id;

      act(() => {
        result.current.createLoan(playerId, 1000, 10, propertyId);
      });

      const loanId = result.current.loans[0].id;

      act(() => {
        result.current.payOffLoan(loanId, 1000);
      });

      const collateralProps = result.current.getPropertiesUsedAsCollateral();
      expect(collateralProps).toHaveLength(0);
    });

    it('should get available collateral properties', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.addProperty(playerId, 'Park Place', 350);
        result.current.addProperty(playerId, 'Boardwalk', 400);
        result.current.addProperty(playerId, 'Mayfair', 400);
      });

      const prop1Id = result.current.properties[0].id;

      act(() => {
        result.current.createLoan(playerId, 1000, 10, prop1Id);
      });

      const available = result.current.getAvailableCollateralProperties(playerId);
      expect(available).toHaveLength(2);
    });

    it('should not include mortgaged properties as available collateral', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.addProperty(playerId, 'Park Place', 350);
        result.current.addProperty(playerId, 'Boardwalk', 400);
      });

      const prop1Id = result.current.properties[0].id;

      act(() => {
        result.current.toggleMortgage(prop1Id);
      });

      const available = result.current.getAvailableCollateralProperties(playerId);
      expect(available).toHaveLength(1);
      expect(available[0].name).toBe('Boardwalk');
    });
  });

  describe('State Management', () => {
    it('should reset game state', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.createLoan(playerId, 1000);
      });

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.players).toHaveLength(0);
      expect(result.current.loans).toHaveLength(0);
      expect(result.current.totalPassedGo).toBe(0);
    });

    it('should export and import state', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.addPlayer('Alice');
      });

      const playerId = result.current.players[0].id;

      act(() => {
        result.current.createLoan(playerId, 1000);
      });

      const exported = result.current.exportState();

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.players).toHaveLength(0);

      act(() => {
        result.current.importState(exported);
      });

      expect(result.current.players).toHaveLength(1);
      expect(result.current.players[0].name).toBe('Alice');
      expect(result.current.loans).toHaveLength(1);
      expect(result.current.loans[0].currentAmount).toBe(1000);
    });

    it('should return false for invalid import', () => {
      const { result } = renderHook(() => useGameState());

      let success: boolean = false;
      act(() => {
        success = result.current.importState('invalid json');
      });

      expect(success).toBe(false);
    });
  });
});
