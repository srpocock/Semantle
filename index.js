"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const words = [
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
let wordRelatedness = [];
let mostRelatedWords;
let leastRelatedWords;
let checkedWordsCounter = 0;
let tiles = [];
let numberOfAttempts = 0;
var TileStatus;
(function (TileStatus) {
    TileStatus["Untested"] = "untested";
    TileStatus["Incorrect"] = "incorrect";
    TileStatus["Correct"] = "correct";
})(TileStatus || (TileStatus = {}));
/**
 * Fetch the relatedness score between two words using the ConceptNet Numberbatch API.
 * @param word1 First word to compare
 * @param word2 Second word to compare
 * @returns Promise<number> - The relatedness score between the two words
 * @throws Error if the relatedness data is not found
 */
function getRelatedness(word1, word2) {
    return __awaiter(this, void 0, void 0, function* () {
        const relatednessAPI = "https://api.conceptnet.io/relatedness?";
        const url = `${relatednessAPI}node1=/c/en/${word1}&node2=/c/en/${word2}`;
        const response = yield fetch(url);
        const data = yield response.json();
        if (data !== undefined && data.value !== undefined) {
            return data.value;
        }
        else {
            throw new Error("Relatedness data not found");
        }
    });
}
// Populate the wordRelatedness array with relatedness scores
function populateRelatedness() {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = [];
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
        yield Promise.all(promises);
    });
}
populateRelatedness().then(() => {
    const gameDiv = document.createElement("div");
    gameDiv.id = "game";
    document.body.appendChild(gameDiv);
    // Create word grid container
    const wordGrid = document.createElement("div");
    wordGrid.className = "word-grid";
    words.forEach(function (word) {
        const wordTile = createWordTile(word);
        wordGrid.appendChild(wordTile);
        tiles.push(wordTile);
    });
    gameDiv.appendChild(wordGrid);
    // Submit button
    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.disabled = true;
    gameDiv.appendChild(submitButton);
    const attemptsDiv = document.createElement("div");
    attemptsDiv.textContent = `Attempts: ${numberOfAttempts}`;
    gameDiv.appendChild(attemptsDiv);
    submitButton.addEventListener("click", function () {
        const checkedWords = getCheckedWords();
        if (mostRelatedWords.includes(words[checkedWords[0]])) {
            tiles[checkedWords[0]].setAttribute("data-status", TileStatus.Correct);
        }
        else {
            tiles[checkedWords[0]].setAttribute("data-status", TileStatus.Incorrect);
            tiles[checkedWords[0]].querySelector("input").checked = false;
            tiles[checkedWords[0]].querySelector("input").setAttribute("disabled", "");
        }
        console.log("tested first word", words[checkedWords[0]]);
        if (mostRelatedWords.includes(words[checkedWords[1]])) {
            tiles[checkedWords[1]].setAttribute("data-status", TileStatus.Correct);
        }
        else {
            tiles[checkedWords[1]].setAttribute("data-status", TileStatus.Incorrect);
            tiles[checkedWords[1]].querySelector("input").checked = false;
            tiles[checkedWords[1]].querySelector("input").setAttribute("disabled", "");
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
                tile.querySelector("input").setAttribute("disabled", "");
                tile.querySelector("input").checked = false;
                if (mostRelatedWords.includes(words[index])) {
                    tile.setAttribute("data-status", TileStatus.Correct);
                }
                else {
                    tile.setAttribute("data-status", TileStatus.Untested);
                }
            });
        }
    });
    function updateSubmitButtonState() {
        const checkedCount = getCheckedWords().filter(index => index !== -1).length;
        submitButton.disabled = checkedCount !== 2;
    }
    function createWordTile(word) {
        const tile = document.createElement("label");
        tile.className = "word-tile";
        tile.setAttribute("data-status", TileStatus.Untested);
        const input = document.createElement("input");
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
    function getCheckedWords() {
        return tiles.map((tile, index) => tile.querySelector("input").checked ? index : -1).filter(index => index !== -1);
    }
    console.log("Most related words:", mostRelatedWords);
    console.log("Least related words:", leastRelatedWords);
});
