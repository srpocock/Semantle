import './styles/WordGrid.css'
import { useRef, useEffect } from 'react'
import { GameState, type GameStateType } from './GameState';
import { WordState, type WordStateType, type WordStatesType } from './WordState';

type GridProps = { gameState: GameStateType, words: string[], checkedWords: string[], testedWords: WordStatesType, onChecked: (word: string, checked: boolean) => void };
type WordCardProps = { word: string, enabled: boolean, checked: boolean, testedState: WordStateType, onChecked: (word: string, checked: boolean) => void };

function WordCard({ word, enabled, checked, testedState, onChecked }: WordCardProps) {

    let mouseDown = false;
    const wordTileRef = useRef<HTMLDivElement>(null);

    function handleMouseMove (event: React.MouseEvent<HTMLLabelElement>) {
        if(!mouseDown && enabled) {
            const rect = event.currentTarget.getBoundingClientRect();
            const x = (event.clientX - (rect.left + rect.width / 2));
            const y = event.clientY - (rect.top + rect.height / 2);
            const z = 250;

            const dist = Math.sqrt(x * x + y * y);
            const planeAngle = Math.atan2(-y, x);
            const cardAngle = Math.atan2(dist, z);

            if (wordTileRef.current) {    
                wordTileRef.current.style.transform = `rotate3d(${Math.sin(planeAngle)}, ${Math.cos(planeAngle)}, 0, ${cardAngle}rad) translateZ(0px)`;
                const startColour = checked ? 110 : 250;
                const colourScale = startColour - dist/5;
                wordTileRef.current.style.background = `linear-gradient(${-(planeAngle - Math.PI/2)}rad, rgb(${startColour}, ${startColour}, ${startColour}), rgb(${colourScale}, ${colourScale}, ${colourScale}))`;
            }
        }
    }

    function handleMouseDown () {
        mouseDown = true;
        if (wordTileRef.current && enabled) {
            wordTileRef.current.style.transition = '0s';
            wordTileRef.current.style.transform = `rotate3d(0, 0, 0, 0) translateZ(-55px)`;
            wordTileRef.current.style.removeProperty('transition');
        }
    }

    function handleMouseUp (event: React.MouseEvent<HTMLLabelElement>) {
        mouseDown = false;
        handleMouseMove(event);
    }

    function handleMouseLeave () {
        mouseDown = false;
        if (wordTileRef.current) {
            wordTileRef.current.removeAttribute('style');
        }
    }

    useEffect(() => {
        if (wordTileRef.current) {
            wordTileRef.current.removeAttribute('style');
        }
    }, [checked]);

    return (
        <label className="word-tile-container" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
            <div ref={wordTileRef} className="word-tile" data-status={testedState}>
                <input type="checkbox" checked={checked} disabled={!enabled} onChange={e => onChecked(word, e.target.checked)} />
                {word}
            </div>
        </label>
    );
}

export default function WordGrid({ gameState, words, checkedWords, testedWords, onChecked }: GridProps) {
    return (
        <fieldset className="word-grid">
            {words.map((word, index) => (
                <WordCard 
                key={index} 
                word={word} 
                enabled={gameState === GameState.Playing && ( checkedWords.length < 2 || checkedWords.includes(word) )} 
                checked={checkedWords.includes(word)}
                testedState={testedWords[word] || WordState.Untested}
                onChecked={onChecked} />
            ))}
        </fieldset>
    );
}