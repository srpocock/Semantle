// GameState enum
const GameState = {
    Playing: "playing",
    Lost: "lost",
    Won: "won"
} as const
type GameStateType = typeof GameState[keyof typeof GameState];

export { GameState, type GameStateType };