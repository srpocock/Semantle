
type WordRelatednessType = [string, string, number];

let _wordList: string[] = [];
const _wordRelatedness: WordRelatednessType[] = [];
const _winningPairs: WordRelatednessType[] = [];
let _isInitialised: boolean = false;

const RELATEDNESS_API: string = "https://api.conceptnet.io/relatedness?";

/**
 * Fetch the relatedness score between two words using the ConceptNet Numberbatch API.
 * @param word1 First word to compare
 * @param word2 Second word to compare
 * @returns Promise<number> - The relatedness score between the two words
 * @throws Error if the relatedness data is not found 
 */
async function _fetchRelatedness(word1: string, word2: string): Promise<number> {

    const url = `${RELATEDNESS_API}node1=/c/en/${word1}&node2=/c/en/${word2}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data !== undefined && data.value !== undefined) {
        return data.value;
    } else {
        throw new Error(`Relatedness data not found for words ${word1} and ${word2}`);
    }

}


async function _loadWords(): Promise<string[]> {

  try {
    const response = await fetch('/assets/words.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();

  } catch (error) {
    console.error("Could not fetch the words array:", error);
    return [];
  }

}


async function initialise(): Promise<void> {

    if (_isInitialised) return;

    const promises: Promise<void>[] = [];
    _wordList = await _loadWords();

    for (let i = 0; i < _wordList.length; i++) {
        for (let j = i + 1; j < _wordList.length; j++) {
            const promise = _fetchRelatedness(_wordList[i], _wordList[j])
                .then((relatednessScore) => {
                    _wordRelatedness.push([_wordList[i], _wordList[j], relatednessScore]);
                }).catch((error) => {
                    console.error(`Error fetching relatedness for ${_wordList[i]} and ${_wordList[j]}:`, error);
                });

            promises.push(promise);
        }
    }

    await Promise.all(promises);


    // Sort by relatedness score descending
    _wordRelatedness.sort((a, b) => b[2] - a[2]);

    // Construct sets of winning words
    const previouslyWinningPairs = new Set<string>();

    for (let i = 0; i < _wordRelatedness.length; i++) {
        if (!previouslyWinningPairs.has(_wordRelatedness[i][0]) && !previouslyWinningPairs.has(_wordRelatedness[i][1])) {
            _winningPairs.push(_wordRelatedness[i]);
            previouslyWinningPairs.add(_wordRelatedness[i][0]);
            previouslyWinningPairs.add(_wordRelatedness[i][1]);
        }
    }

    _isInitialised = true;
}

export default {
    get wordList(): string[] { 
        return _wordList 
    },
    // getRelatedness (word1: string, word2: string): number { return wordRelatedness[wordList.indexOf(word1)][wordList.indexOf(word2)]; },
    inCorrectPair (word: string, gameStep: number): boolean { return _winningPairs ? (_winningPairs[gameStep][0] === word || _winningPairs[gameStep][1] === word) : false; },
    initialise
};