type GameStatusProps = { attemptsLeft: number };

export default function GameStatus( {attemptsLeft}: GameStatusProps) {
    return (
        <div className="game-status">
            <div>Guess which two words are semantically most closely related!</div>
            <div>Attempts remaining: {attemptsLeft}</div>
        </div>
    )
}