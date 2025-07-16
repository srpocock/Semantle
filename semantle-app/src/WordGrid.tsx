type GridProps = { words: string[], checkedWords: string[], onChecked: (word: string, checked: boolean) => void };
type WordCardProps = { word: string, checked: boolean, onChecked: (word: string, checked: boolean) => void };

function WordCard({ word, checked, onChecked }: WordCardProps) {
    return (
        <label className="word-tile" data-status="untested">
            <input type="checkbox" checked={checked} onChange={e => onChecked(word, e.target.checked)} />
            {word}
        </label>
    );
}

export default function WordGrid({ words, checkedWords, onChecked }: GridProps) {
    return (
        <>
            {words.map((word, index) => (
                <WordCard key={index} word={word} checked={checkedWords.includes(word)} onChecked={onChecked} />
            ))}
        </>
    );
}