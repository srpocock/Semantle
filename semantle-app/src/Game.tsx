import { useEffect, useState } from 'react';
import GameStatus from './GameStatus';
import WordGrid from './WordGrid';
import SubmissionPanel from './SubmissionPanel';
import Words from './Words';
import { GameState, type GameStateType } from './GameState';
import { WordState, type WordStatesType } from './WordState';

await Words.initialise();

export default function Game () {

    const [checkedWords, setCheckedWords] = useState<string[]>([]);
    const [testedWords, setTestedWords] = useState<WordStatesType>({});
    const [gameState, setGameState] = useState<GameStateType>(GameState.Playing);
    const [attemptsRemaining, setAttemptsRemaining] = useState(3);

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

        if (Words.mostRelated) {

            // If both words are the most related pair, the player wins
            if (Words.inMostRelated(checkedWords[0]) && Words.inMostRelated(checkedWords[1])) {
                setGameState(GameState.Won);
                return;
            }

            // Since the game is not won, set the states of the checked words appropriately
            const checkedWordStates: WordStatesType = {};
            checkedWords.forEach((word) => 
                Words.inMostRelated(word) ? checkedWordStates[word] = WordState.Correct : checkedWordStates[word] = WordState.Incorrect
            );

            setTestedWords((prev) => ({
                ...prev,
                ...checkedWordStates
            }));

            setCheckedWords([]);

            setAttemptsRemaining(prev => prev - 1);

            if( attemptsRemaining <= 1) {
                setGameState(GameState.Lost);
                return;
            }
        }
    }

    useEffect(() => console.log(`Game state changed to: ${gameState}`), [gameState]);

    return (
        <section className="game">
            <h1>Semantle</h1>
            <GameStatus attemptsLeft={attemptsRemaining}/>
            <WordGrid gameState={gameState} words={Words.wordList} checkedWords={checkedWords} testedWords={testedWords} onChecked={handleCheck} />
            <SubmissionPanel gameState={gameState} numCheckedWords={checkedWords.length} attemptsRemaining={attemptsRemaining} onSubmit={handleSubmit} />
        </section>
    )

}