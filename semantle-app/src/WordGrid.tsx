import './styles/WordGrid.css'
import { useRef, useEffect, useState, useCallback } from 'react'
import { GameState, type GameStateType } from './GameState';
import { WordState, type WordStateType, type WordStatesType } from './WordState';
import { tileStateColours } from './Colours';

type GridProps = { gameState: GameStateType, words: string[], checkedWords: string[], testedWords: WordStatesType, onChecked: (word: string, checked: boolean) => void };
type WordCardProps = { word: string, enabled: boolean, checked: boolean, testedState: WordStateType, onChecked: (word: string, checked: boolean) => void };

function WordCard({ word, enabled, checked, testedState, onChecked }: WordCardProps) {
    const [pressed, setPressed] = useState(false);
    const wordTileRef = useRef<HTMLDivElement>(null);
    const wordTileFrontRef = useRef<HTMLDivElement>(null);
    const mousePosition = useRef<{ x: number | null, y: number | null }>({ x: null, y: null });

    const setCardRotationAndColour = useCallback((x: number, y: number, z: number) => {
        const dist = Math.sqrt(x * x + y * y);
        const planeAngle = Math.atan2(-y, x);
        const cardAngle = Math.atan2(dist, z);

        if (wordTileRef.current) {
            wordTileRef.current.style.transform = `rotate3d(${Math.sin(planeAngle)}, ${Math.cos(planeAngle)}, 0, ${cardAngle}rad) translateZ(0px)`;
        }
        if (wordTileFrontRef.current) {
            const startColour = tileStateColours(testedState, checked);
            const colourScale = [
                startColour[0],
                startColour[1],
                startColour[2] - dist / 5
            ];
            wordTileFrontRef.current.style.background = `linear-gradient(${-(planeAngle - Math.PI / 2)}rad, hsl(${startColour[0]}, ${startColour[1]}%, ${startColour[2]}%), hsl(${colourScale[0]}, ${colourScale[1]}%, ${colourScale[2]}%))`;
        }
    }, [testedState, checked]);

    function handleMouseMove(event: React.MouseEvent<HTMLLabelElement>) {
        if (enabled) {
            const rect = event.currentTarget.getBoundingClientRect();
            mousePosition.current.x = event.clientX - (rect.left + rect.width / 2);
            mousePosition.current.y = event.clientY - (rect.top + rect.height / 2);
            const z = 250;

            setCardRotationAndColour(mousePosition.current.x, mousePosition.current.y, z);
        }
    }

    function handleMouseDown() {
        if (enabled) {
            setPressed(true);
        }
    }

    function handleMouseUp() {
        if (enabled) {
            setPressed(false);
        }
    }

    function handleMouseLeave() {
        if (wordTileRef.current) {
            wordTileRef.current.removeAttribute('style');
        }
        
        if (wordTileFrontRef.current) {
            wordTileFrontRef.current.removeAttribute('style');
        }

        mousePosition.current.x = null;
        mousePosition.current.y = null;
    
    }

    useEffect(() => {
        if (wordTileRef.current) {
            wordTileRef.current.removeAttribute('style');
        }

        if (wordTileFrontRef.current) {
            wordTileFrontRef.current.removeAttribute('style');
        }

        if (mousePosition.current.x !== null && mousePosition.current.y !== null) {
            setCardRotationAndColour(mousePosition.current.x, mousePosition.current.y, 250);
        }
    }, [checked, setCardRotationAndColour]);

    return (
        <label className="word-tile-container" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
            <div ref={wordTileRef} className="word-tile" data-status={testedState} style={{ scale: pressed ? '0.9' : '1' }}>
                <div ref={wordTileFrontRef} className="word-tile-front">
                    <input type="checkbox" checked={checked} disabled={!enabled} onChange={e => onChecked(word, e.target.checked)} />
                    {word}
                </div>
                <div className="word-tile-back"></div>
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
                    enabled={testedWords[word] !== WordState.Flipped && gameState === GameState.Playing && (checkedWords.length < 2 || checkedWords.includes(word))}
                    checked={checkedWords.includes(word)}
                    testedState={testedWords[word] || WordState.Untested}
                    onChecked={onChecked} />
            ))}
        </fieldset>
    );
}