import { TileTransitionStatus } from "./Tile";
import { Attempt } from "./useGameState";
import { Position } from "./Tile";

export interface SavedGameState {
  date: string;
  data: { word: string; status: TileTransitionStatus }[];
  selectedWords: string[];
  attempts: Attempt[];
  positions: Position[];
  gameEnded: boolean;
  gameWon: boolean;
  autoSolveEnded: boolean;
}

const STORAGE_KEY = "boluxiones-game-state";

export function saveGameState(state: SavedGameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Failed to save game state to localStorage:", error);
  }
}

export function loadGameState(): SavedGameState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch (error) {
    console.warn("Failed to load game state from localStorage:", error);
    return null;
  }
}

export function clearGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear game state from localStorage:", error);
  }
}

export function getGameDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}
