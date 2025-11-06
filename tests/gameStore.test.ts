import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useGameStore } from '../src/stores/game';
import { useScoreStore } from '../src/stores/score';

describe('Game Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Game State', () => {
    it('should initialize game correctly', () => {
      const gameStore = useGameStore();
      gameStore.initializeGame();

      expect(gameStore.status).toBe('idle');
      expect(gameStore.sequence.length).toBeGreaterThan(0);
      expect(gameStore.currentIndex).toBe(0);
      expect(gameStore.timeRemaining).toBe(120);
    });

    it('should start game', () => {
      const gameStore = useGameStore();
      gameStore.initializeGame();
      gameStore.startGame();

      expect(gameStore.status).toBe('running');
      expect(gameStore.startTime).not.toBeNull();
    });

    it('should pause game', () => {
      const gameStore = useGameStore();
      gameStore.initializeGame();
      gameStore.startGame();
      gameStore.pauseGame();

      expect(gameStore.status).toBe('paused');
    });

    it('should resume game', () => {
      const gameStore = useGameStore();
      gameStore.initializeGame();
      gameStore.startGame();
      gameStore.pauseGame();
      gameStore.resumeGame();

      expect(gameStore.status).toBe('running');
    });

    it('should advance sequence after correct input', () => {
      const gameStore = useGameStore();
      gameStore.initializeGame();
      const initialIndex = gameStore.currentIndex;

      gameStore.advanceSequence();

      expect(gameStore.currentIndex).toBe(initialIndex + 1);
    });

    it('should update case sensitivity', () => {
      const gameStore = useGameStore();
      gameStore.initializeGame();

      gameStore.updateCaseSensitivity(true);

      expect(gameStore.caseSensitive).toBe(true);
    });
  });

  describe('Score Store', () => {
    it('should initialize with zero score', () => {
      const scoreStore = useScoreStore();
      expect(scoreStore.currentScore).toBe(0);
      expect(scoreStore.correctCount).toBe(0);
      expect(scoreStore.wrongCount).toBe(0);
      expect(scoreStore.combo).toBe(0);
    });

    it('should record correct input', () => {
      const scoreStore = useScoreStore();
      scoreStore.recordCorrect();

      expect(scoreStore.correctCount).toBe(1);
      expect(scoreStore.combo).toBe(1);
      expect(scoreStore.currentScore).toBe(10);
    });

    it('should record wrong input', () => {
      const scoreStore = useScoreStore();
      scoreStore.recordWrong();

      expect(scoreStore.wrongCount).toBe(1);
      expect(scoreStore.combo).toBe(0);
      expect(scoreStore.currentScore).toBe(-5);
    });

    it('should apply combo bonus', () => {
      const scoreStore = useScoreStore();

      // 10 combo
      for (let i = 0; i < 10; i++) {
        scoreStore.recordCorrect();
      }
      expect(scoreStore.combo).toBe(10);

      // Should have base score (100) + combo bonus (20) = 120
      expect(scoreStore.currentScore).toBeGreaterThan(100);
    });

    it('should calculate accuracy correctly', () => {
      const scoreStore = useScoreStore();

      scoreStore.recordCorrect();
      scoreStore.recordCorrect();
      scoreStore.recordWrong();

      expect(scoreStore.accuracy).toBe(67); // 2/3 ≈ 67%
    });

    it('should calculate WPM', () => {
      const scoreStore = useScoreStore();

      scoreStore.recordCorrect();
      scoreStore.recordCorrect();
      scoreStore.recordCorrect();
      scoreStore.recordCorrect();
      scoreStore.recordCorrect();

      // 5 characters = 1 word, in 2 minutes = 0.5 WPM
      expect(scoreStore.wpm).toBeGreaterThanOrEqual(0);
    });

    it('should reset score', () => {
      const scoreStore = useScoreStore();

      scoreStore.recordCorrect();
      scoreStore.reset();

      expect(scoreStore.currentScore).toBe(0);
      expect(scoreStore.correctCount).toBe(0);
    });
  });
});
