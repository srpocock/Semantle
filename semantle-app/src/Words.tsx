const wordList: string[] = [
  "cactus",
  "umbrella",
  "galaxy",
  "whistle",
  "marble",
  "justice",
  "keyboard",
  "avalanche",
  "lighthouse"
];

type WordRelatednessType = [string, string, number];

const wordRelatedness: WordRelatednessType[] = [];
const winningPairs: WordRelatednessType[] = [];

/**
 * Fetch the relatedness score between two words using the ConceptNet Numberbatch API.
 * @param word1 First word to compare
 * @param word2 Second word to compare
 * @returns Promise<number> - The relatedness score between the two words
 * @throws Error if the relatedness data is not found 
 */
async function _getRelatednessAPI(word1: string, word2: string): Promise<number> {
    const relatednessAPI: string = "https://api.conceptnet.io/relatedness?";
    const url = `${relatednessAPI}node1=/c/en/${word1}&node2=/c/en/${word2}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data !== undefined && data.value !== undefined) {
        return data.value;
    } else {
        throw new Error("Relatedness data not found");
    }
}

// This function must be called before using Words.relatedness, mostRelated, or leastRelated
async function initialise(): Promise<void> {
    const promises: Promise<void>[] = [];

    for (let i = 0; i < wordList.length; i++) {
        for (let j = i + 1; j < wordList.length; j++) {
            const index = (i * (2 * wordList.length - i - 1)) / 2 + (j - i - 1);
            const promise = _getRelatednessAPI(wordList[i], wordList[j])
                .then((relatedness) => {
                    wordRelatedness[index] = [wordList[i], wordList[j], relatedness];
                }).catch((error) => {
                    console.error(`Error fetching relatedness for ${wordList[0]} and ${wordList[1]}:`, error);
                });

            promises.push(promise);
        }
    }

    await Promise.all(promises);

    //wordRelatedness.forEach((pair) => console.log(`Relatedness between ${pair[0]} and ${pair[1]}: ${pair[2]}`));

     // Sort by relatedness score descending
    wordRelatedness.sort((a, b) => b[2] - a[2]);

    // Construct sets of winning words
    const previouslyWinningPairs = new Set<string>();

    for (let i = 0; i < wordRelatedness.length; i++) {
        if (!previouslyWinningPairs.has(wordRelatedness[i][0]) && !previouslyWinningPairs.has(wordRelatedness[i][1])) {
            winningPairs.push(wordRelatedness[i]);
            previouslyWinningPairs.add(wordRelatedness[i][0]);
            previouslyWinningPairs.add(wordRelatedness[i][1]);
        }
    }

    previouslyWinningPairs.clear();
    console.log("Winning pairs:", winningPairs);
}

export default {
    wordList,
    // getRelatedness (word1: string, word2: string): number { return wordRelatedness[wordList.indexOf(word1)][wordList.indexOf(word2)]; },
    inCorrectPair (word: string, gameStep: number): boolean { return winningPairs ? (winningPairs[gameStep][0] === word || winningPairs[gameStep][1] === word) : false; },
    initialise
};