import { useEffect, useState } from 'react';
import GameStatus from './GameStatus';
import WordGrid from './WordGrid';
import GameActions from './GameActions';
import Words from './Words';
import { GameState, type GameStateType } from './GameState';

await Words.initialise();



export default function Game () {

    const [checkedWords, setCheckedWords] = useState<string[]>([]);
    const [gameState, setGameState] = useState<GameStateType>(GameState.Playing);
    const [attemptsLeft, setAttemptsLeft] = useState(3);

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
        if (Words.mostRelated && Words.getRelatedness(checkedWords[0], checkedWords[1]) >= Words.mostRelated[2]) {
            setGameState(GameState.Won);
            return;
        }

        setAttemptsLeft(prev => prev - 1);

        if( attemptsLeft <= 1) {
            setGameState(GameState.Lost);
            return;
        }
    }

    useEffect(() => console.log(`Game state changed to: ${gameState}`), [gameState]);

    return (
        <section className="game">
            <GameStatus attemptsLeft={attemptsLeft}/>
            <WordGrid gameState={gameState} words={Words.wordList} checkedWords={checkedWords} onChecked={handleCheck} />
            <GameActions numCheckedWords={checkedWords.length} onSubmit={handleSubmit} />
        </section>
    )

}