import './styles/SubmissionPanel.css';
import { GameState, type GameStateType } from './GameState';

type SubmissionPanelProps = { gameState: GameStateType, numCheckedWords: number, attemptsRemaining: number, onSubmit: () => void };

export default function SubmissionPanel({ gameState, numCheckedWords, attemptsRemaining, onSubmit }: SubmissionPanelProps) {    
    return (
        <div className="submission-panel">
            <div className="attempts-panel">
                <div>Attempts:</div>
                <span className="sr-only">{attemptsRemaining} attempts remaining</span>
                <div className="attempt-bubbles-container" data-attempts-remaining={attemptsRemaining}>
                    <div className="attempt-bubble"></div>
                    <div className="attempt-bubble"></div>
                    <div className="attempt-bubble"></div>
                </div>
            </div>
            <button className="submit-button" disabled={numCheckedWords !== 2 || gameState !== GameState.Playing} onClick={onSubmit} >Submit</button>
        </div>
    )
}