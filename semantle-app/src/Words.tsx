const wordList: string[] = [
  "umbrella",
  "marble",
  "astronaut",
  "cactus",
  "recipe",
  "giraffe",
  "pencil",
  "echo",
  "drum"
];

const wordRelatedness: number[][] = [];
let mostRelatedWords: [string, string, number] | undefined;
let leastRelatedWords: [string, string, number] | undefined;

/**
 * Fetch the relatedness score between two words using the ConceptNet Numberbatch API.
 * @param word1 First word to compare
 * @param word2 Second word to compare
 * @returns Promise<number> - The relatedness score between the two words
 * @throws Error if the relatedness data is not found 
 */
async function getRelatedness(word1: string, word2: string): Promise<number> {
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

    wordList.forEach(function (word1, index1) {
        wordRelatedness[index1] = [];
        wordRelatedness[index1][index1] = 1;

        wordList.forEach(function (word2, index2) {
            if (index1 < index2) {
                const promise = getRelatedness(word1, word2)
                    .then((relatedness) => {
                        wordRelatedness[index1][index2] = relatedness;
                        wordRelatedness[index2][index1] = relatedness;

                        if (mostRelatedWords === undefined || relatedness > mostRelatedWords[2]) {
                            mostRelatedWords = [word1, word2, relatedness];
                        }

                        if (leastRelatedWords === undefined || relatedness < leastRelatedWords[2]) {
                            leastRelatedWords = [word1, word2, relatedness];
                        }
                    })
                    .catch((error) => {
                        console.error(`Error fetching relatedness for ${word1} and ${word2}:`, error);
                    });

                promises.push(promise);
            }
        });
    });

    // Wait for all getRelatedness calls to complete
    await Promise.all(promises);
}

export default {
    wordList,
    get relatedness() { return wordRelatedness; },
    get mostRelated() { return mostRelatedWords; },
    get leastRelated() { return leastRelatedWords; },
    initialise
};