import { WordState, type WordStateType } from './WordState';
import './styles/Colours.css';

/*
* Utility functions to retrieve CSS variable colours in HSL format. 
* We use HSL so that it's easy to tweak lightness with 3d word tiles
*/

function getCssVarHSL(name: string): [number, number, number] {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    // Match hsl(h, s%, l%)
    const match = value.match(/hsl\(\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)%?,\s*(\d+(?:\.\d+)?)%?\)/i);
    if (!match) throw new Error(`Invalid HSL value for ${name}: ${value}`);
    return [Number(match[1]), Number(match[2]), Number(match[3])];
}

const colours = {
    // Word tile colours
    wordTileUntestedUnchecked: getCssVarHSL('--word-tile-untested-unchecked'),
    wordTileUntestedChecked: getCssVarHSL('--word-tile-untested-checked'),
    wordTileIncorrectUnchecked: getCssVarHSL('--word-tile-incorrect-unchecked'),
    wordTileIncorrectChecked: getCssVarHSL('--word-tile-incorrect-checked'),
    wordTileCorrectUnchecked: getCssVarHSL('--word-tile-correct-unchecked'),
    wordTileCorrectChecked: getCssVarHSL('--word-tile-correct-checked')
};

function tileStateColours (wordState: WordStateType, checked: boolean): [number, number, number] {
    switch (wordState) {
        case WordState.Untested:
            return checked ? colours.wordTileUntestedChecked : colours.wordTileUntestedUnchecked;
        case WordState.Incorrect:
            return checked ? colours.wordTileIncorrectChecked : colours.wordTileIncorrectUnchecked;
        case WordState.Correct:
            return checked ? colours.wordTileCorrectChecked : colours.wordTileCorrectUnchecked;
        default:
            return colours.wordTileUntestedUnchecked; // Fallback
    }
};

export { colours, tileStateColours };