import './styles/GameActions.css';
import { GameState, type GameStateType } from './GameState';

type GameActionProps = { gameState: GameStateType, numCheckedWords: number, onSubmit: () => void };

export default function GameActions({ gameState, numCheckedWords, onSubmit }: GameActionProps) {
    return (
        <div>
            <button className="submit-button" disabled={numCheckedWords !== 2 || gameState !== GameState.Playing} onClick={onSubmit} >Submit</button>
        </div>
    )
}