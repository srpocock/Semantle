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
    const [gameStep, setGameStep] = useState(0);

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

        if (Words.wordList) {
            
            console.log("Here");


            const checkedWordStates: WordStatesType = {};
            checkedWords.forEach((word) => 
                Words.inCorrectPair(word, gameStep) ? checkedWordStates[word] = WordState.Correct : checkedWordStates[word] = WordState.Incorrect
            );

            setTestedWords((prev) => ({
                ...prev,
                ...checkedWordStates
            }));

            setCheckedWords([]);

            if (Words.inCorrectPair(checkedWords[0], gameStep) && Words.inCorrectPair(checkedWords[1], gameStep)) {
                console.log("Correct, game step:", gameStep);

                checkedWords.forEach((word) => checkedWordStates[word] = WordState.Flipped);
                setTestedWords((prev) => ({
                    ...prev,
                    ...checkedWordStates
                }));
                // setGameState(GameState.Won);
                setGameStep((prev) => prev + 1);
                setCheckedWords([]);

                setTestedWords((prev) => (
                    {
                        ...Object.fromEntries(Object.entries(prev).filter(([_key, value]) => value === WordState.Flipped)),
                        ...checkedWordStates
                    }));
            } else {
                setAttemptsRemaining((prev) => prev - 1);
            }
            
            if( attemptsRemaining <= 1) {
                setGameState(GameState.Lost);
            }
        }
    }

    useEffect(() => console.log(`Game state changed to: ${gameState}`), [gameState]);

    return (
        <section className="game">
            <h1>Semantle</h1>
            <GameStatus/>
            <WordGrid gameState={gameState} words={Words.wordList} checkedWords={checkedWords} testedWords={testedWords} onChecked={handleCheck} />
            <SubmissionPanel gameState={gameState} numCheckedWords={checkedWords.length} attemptsRemaining={attemptsRemaining} onSubmit={handleSubmit} />
        </section>
    )

}