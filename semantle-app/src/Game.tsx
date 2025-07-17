import {useState} from 'react';
import GameStatus from './GameStatus';
import WordGrid from './WordGrid';
import GameActions from './GameActions';
import Words from './Words';

await Words.initialise();

const GameState = {
    Playing: "playing",
    Lost: "lost",
    Won: "won"
} as const

export default function Game () {

    const [checkedWords, setCheckedWords] = useState<string[]>([]);
    const [gameState, setGameState] = useState<string>(GameState.Playing);

    function handleCheck (word: string, checked: boolean) {
        // Make sure only a maximum of 2 words are checked
        if (checked && checkedWords.length >= 2) {
            return;
        }
        setCheckedWords(prev =>
            checked ? [...prev, word] : prev.filter(w => w !== word)
        );

    };

    function handleSubmit () {

    }

    return (
        <section className="game">
            <GameStatus />
            <WordGrid words={Words.wordList} checkedWords={checkedWords} onChecked={handleCheck} />
            <GameActions onSubmit={handleSubmit} />
        </section>
    )

}