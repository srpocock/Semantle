const words: string[] = [
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
let wordRelatedness: number[][] = [];
let mostRelatedWords: [string, string, number];
let leastRelatedWords: [string, string, number];

let checkedWordsCounter: number = 0;
let tiles: HTMLLabelElement[] = [];

let numberOfAttempts = 0;

enum TileStatus {
    Untested = "untested",
    Incorrect = "incorrect",
    Correct = "correct"
}

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

// Populate the wordRelatedness array with relatedness scores
async function populateRelatedness(): Promise<void> {
    const promises: Promise<void>[] = [];

    words.forEach(function (word1, index1) {
        wordRelatedness[index1] = [];
        wordRelatedness[index1][index1] = 1;

        words.forEach(function (word2, index2) {
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

populateRelatedness().then(() => {

    const gameDiv: HTMLDivElement = document.createElement("div");
    gameDiv.id = "game";
    document.body.appendChild(gameDiv);

    // Create word grid container
    const wordGrid: HTMLDivElement = document.createElement("div");
    wordGrid.className = "word-grid";

    words.forEach(function (word) {
        const wordTile: HTMLLabelElement = createWordTile(word);
        wordGrid.appendChild(wordTile);
        tiles.push(wordTile);
    });

    gameDiv.appendChild(wordGrid);

    // Submit button
    const submitButton: HTMLButtonElement = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.disabled = true;

    gameDiv.appendChild(submitButton);

    const attemptsDiv: HTMLDivElement = document.createElement("div");
    attemptsDiv.textContent = `Attempts: ${numberOfAttempts}`;
    gameDiv.appendChild(attemptsDiv);

    submitButton.addEventListener("click", function () {

        const checkedWords = getCheckedWords();

        if (mostRelatedWords.includes(words[checkedWords[0]])) {
            tiles[checkedWords[0]].setAttribute("data-status", TileStatus.Correct);
        } else {
            tiles[checkedWords[0]].setAttribute("data-status", TileStatus.Incorrect);
            tiles[checkedWords[0]].querySelector("input")!.checked = false;
            tiles[checkedWords[0]].querySelector("input")!.setAttribute("disabled", "");
        }

        console.log("tested first word", words[checkedWords[0]]);

        if (mostRelatedWords.includes(words[checkedWords[1]])) {
            tiles[checkedWords[1]].setAttribute("data-status", TileStatus.Correct);
        } else {
            tiles[checkedWords[1]].setAttribute("data-status", TileStatus.Incorrect);
            tiles[checkedWords[1]].querySelector("input")!.checked = false;
            tiles[checkedWords[1]].querySelector("input")!.setAttribute("disabled", "");
        }

        console.log("tested second word", words[checkedWords[1]]);

        updateSubmitButtonState();

        if (mostRelatedWords.includes(words[checkedWords[0]]) && mostRelatedWords.includes(words[checkedWords[1]])) {
            alert(`Congratulations! You found the most related words: ${mostRelatedWords[0]} and ${mostRelatedWords[1]} with a score of ${mostRelatedWords[2]}`);
        }

        numberOfAttempts++;
        attemptsDiv.textContent = `Attempts: ${numberOfAttempts}`;

        if (numberOfAttempts >= 3) {
            alert(`Game over! You have used all your attempts. The most related words were: ${mostRelatedWords[0]} and ${mostRelatedWords[1]} with a score of ${mostRelatedWords[2]}`);
            submitButton.disabled = true;
            tiles.forEach((tile, index) => {
                tile.querySelector("input")!.setAttribute("disabled", "");
                tile.querySelector("input")!.checked = false;
                if (mostRelatedWords.includes(words[index])) {
                    tile.setAttribute("data-status", TileStatus.Correct);
                } else {
                    tile.setAttribute("data-status", TileStatus.Untested);
                }
            });
        }
    });

    function updateSubmitButtonState(): void {
        const checkedCount = getCheckedWords().filter(index => index !== -1).length;
        submitButton.disabled = checkedCount !== 2;
    }


    function createWordTile(word: string): HTMLLabelElement {
        const tile: HTMLLabelElement = document.createElement("label");
        tile.className = "word-tile";
        tile.setAttribute("data-status", TileStatus.Untested);

        const input: HTMLInputElement = document.createElement("input");
        input.type = "checkbox";

        input.addEventListener("click", function (event) {
            if (checkedWordsCounter >= 2 && !input.checked) {
                event.preventDefault();
                input.checked = false; // Prevent checking if already two words are selected;
            }
        });

        input.addEventListener("change", function () {
            updateSubmitButtonState();
        });

        tile.textContent = word;
        tile.appendChild(input);

        return tile;
    }

    function getCheckedWords(): number[] {
        return tiles.map((tile, index) => tile.querySelector("input")!.checked ? index : -1).filter(index => index !== -1);
    }

    console.log("Most related words:", mostRelatedWords);
    console.log("Least related words:", leastRelatedWords);

});
