let rows = 3; // Початково 3x3
let columns = 3;

let currTile;
let otherTile; // blank tile
let turns = 0;
let imgOrder = [];
let gameStarted = false;

// Функція для створення порядку картинок
function generateImgOrder(size) {
    imgOrder = Array.from({ length: size * size }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
}

// Функція для ініціалізації гри
function initGame() {
    generateImgOrder(rows); // Генеруємо порядок картинок для відповідного розміру
    let board = document.getElementById("board");
    board.innerHTML = ""; // Очищаємо дошку

    for (let r = 0; r < rows; r++) {
        for(let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "img/" + imgOrder.shift() + ".jpg"; // Використовуємо рандомний порядок зображень

            // DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            board.append(tile);
        }
    }

    turns = 0; // Скидаємо лічильник ходів
    document.getElementById("turnCount").innerText = turns;
    gameStarted = true; // Встановлюємо, що гра почалась
    saveGameState(); // Зберігаємо початковий стан гри
}

// Функція для дострокового завершення гри
function endGameEarly() {
    if (!gameStarted) return;
    savePlayerResult();
    gameStarted = false;
}

// Функція для зміни рівня складності
function changeDifficulty(level) {
    switch(level) {
        case 1:
            rows = 3;
            columns = 3;
            break;
        case 2:
            rows = 4;
            columns = 4;
            break;
        case 3:
            rows = 5;
            columns = 5;
            break;
    }
    initGame();
}

// Оголошення функцій для drag-and-drop
function dragStart() {
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
    otherTile = this;
}

function dragEnd() {
    if (!otherTile.src.includes("3.jpg")) {
        return;
    }
    let currCoords = currTile.id.split("-");
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = r == r2 && c2 == c - 1;
    let moveRight = r == r2 && c2 == c + 1;
    let moveUp = c == c2 && r2 == r - 1;
    let moveDown = c == c2 && r2 == r + 1;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown; 

    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;

        currTile.src = otherImg;
        otherTile.src = currImg;

        turns++;
        saveGameState();
        document.getElementById("turnCount").innerText = turns;
        console.log("Tiles swapped, turns: " + turns);
    }
}

// Збереження та завантаження стану гри
function saveGameState() {
    let boardState = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            boardState.push(tile.src);
        }
    }
    localStorage.setItem("boardState", JSON.stringify(boardState));
    localStorage.setItem("turns", turns);
    console.log("Game state saved!");
}

function loadGameState() {
    let savedBoardState = JSON.parse(localStorage.getItem("boardState"));
    if (savedBoardState) {
        turns = parseInt(localStorage.getItem("turns")) || 0;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                tile.src = savedBoardState.shift();
            }
        }
        document.getElementById("turnCount").innerText = turns;
        console.log("Game state loaded!");
    }
}

function savePlayerResult() {
    let playerName = prompt("Enter your name to save the result:");
    if (!playerName) return;

    let results = JSON.parse(localStorage.getItem("results")) || [];
    results.push({ name: playerName, turns: turns });
    localStorage.setItem("results", JSON.stringify(results));

    displayResults();
}

function displayResults() {
    let results = JSON.parse(localStorage.getItem("results")) || [];
    let resultsTable = document.getElementById("resultsTable");
    resultsTable.innerHTML = "<tr><th>Name</th><th>Number of turns</th></tr>";

    results.forEach(result => {
        let row = `<tr><td>${result.name}</td><td>${result.turns}</td></tr>`;
        resultsTable.innerHTML += row;
    });
}

window.onload = function() {
    initGame();
    displayResults();
}
