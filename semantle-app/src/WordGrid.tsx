import './styles/WordGrid.css'
import { GameState, type GameStateType } from './GameState';

type GridProps = { gameState: GameStateType, words: string[], checkedWords: string[], onChecked: (word: string, checked: boolean) => void };
type WordCardProps = { word: string, enabled: boolean, checked: boolean, onChecked: (word: string, checked: boolean) => void };

function WordCard({ word, enabled, checked, onChecked }: WordCardProps) {

    

    return (
        <div className="word-tile-container">
            <label className="word-tile" data-status="untested">
                <input type="checkbox" checked={checked} disabled={!enabled} onChange={e => onChecked(word, e.target.checked)} />
                {word}
            </label>
        </div>
    );
}

export default function WordGrid({ gameState, words, checkedWords, onChecked }: GridProps) {
    return (
        <fieldset className="word-grid">
            {words.map((word, index) => (
                <WordCard key={index} word={word} enabled={gameState === GameState.Playing} checked={checkedWords.includes(word)} onChecked={onChecked} />
            ))}
        </fieldset>
    );
}