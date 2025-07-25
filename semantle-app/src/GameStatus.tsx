import { GameState, type GameStateType } from './GameState';

export default function GameStatus( { gameState }: { gameState: GameStateType }) {
    
    switch (gameState) {
        case GameState.Playing:
            return (
            <div className="game-status">
                <div>Guess which two words are semantically most closely related!</div>
            </div>
            )
        case GameState.Lost:
            return (
            <div className="game-status">
                <div>You lost, sorry! Try again next time.</div>
            </div>
            )
        case GameState.Won:
            return (
            <div className="game-status">
                <div>Congratulations, you won!</div>
            </div>
        )
    }
}