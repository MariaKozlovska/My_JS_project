let rows = 3;
let columns = 3;
let currTile;
let otherTile;
let turns = 0;
let imgOrder = [];
let gameStarted = false;

// Массив зображень для кожного рівня (1.jpg, 2.jpg,... для 1 рівня, 10.jpg, 11.jpg,... для 2 рівня і т.д.)
const imagesByLevel = {
    1: Array.from({ length: 9 }, (_, i) => `${i + 1}.jpg`),  // 1-9.jpg для рівня 1
    2: Array.from({ length: 16 }, (_, i) => `${i + 10}.jpg`), // 10-25.jpg для рівня 2
    3: Array.from({ length: 25 }, (_, i) => `${i + 26}.jpg`)  // 26-50.jpg для рівня 3
};

// Функція створення порядку картинок для конкретного рівня
function generateImgOrder(level) {
    const images = [...imagesByLevel[level]];
    return images.sort(() => Math.random() - 0.5);
}

// Функція для ініціалізації гри
function initGame() {
    imgOrder = generateImgOrder(getLevel()); // Генеруємо порядок картинок для відповідного рівня
    let board = document.getElementById("board");
    board.innerHTML = ""; // Очищуємо дошку

    let tileSize = 240 / rows; // Динамічний розмір плиток, залежить від розміру поля

    board.style.width = `${tileSize * rows}px`;
    board.style.height = `${tileSize * rows}px`;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            if (r === rows +  1 && c === columns - 1) {
                tile.src = ""; // Остання плитка буде порожньою
            } else {
                tile.src = `img/${imgOrder.shift()}`; // Використовуємо відповідні зображення для кожного рівня
            }

            tile.style.width = `${tileSize - 2}px`;
            tile.style.height = `${tileSize - 2}px`;

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

    turns = 0;
    document.getElementById("turnCount").innerText = turns;
    gameStarted = true;
    saveGameState();
}

// Функція для отримання поточного рівня (кількість рядів визначає рівень)
function getLevel() {
    if (rows === 3) {
        return 1; // 3x3
    } else if (rows === 4) {
        return 2; // 4x4
    } else if (rows === 5) {
        return 3; // 5x5
    }
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
    initGame(); // Перезавантажуємо гру з новими параметрами
}

// Drag-and-drop функції
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
    if(!otherTile.src.includes("3.jpg", "12.jpg", "23.jpg")) {
        return;
    }
    // Перевіряємо, чи інша плитка є "пустою" (останньою)
    // if (otherTile.src === "") {

        let currCoords = currTile.id.split("-"); //"0-0" -> ["0", "0"]
        let r = parseInt(currCoords[0]);
        let c = parseInt(currCoords[1]);

        let otherCoords = otherTile.id.split("-");
        let r2 = parseInt(otherCoords[0]);
        let c2 = parseInt(otherCoords[1]);

         // Перевіряємо, чи плитки розташовані поруч
        let moveLeft = r == r2 && c2 == c - 1;
        let moveRight = r == r2 && c2 == c + 1;
       
        let moveUp = c == c2 && r2 == r - 1;
        let moveDown = c == c2 && r2 == r + 1;

        // let isAdjacent = (r == r2 && Math.abs(c - c2) == 1) || (c == c2 && Math.abs(r - r2) == 1);
        let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

        if (isAdjacent) {
            let currImg = currTile.src;
            let otherImg = otherTile.src;

            currTile.src = otherImg;
            otherTile.src = currImg;
            
            // otherTile.src = currTile.src;
            // currTile.src = "";

            turns++;
            document.getElementById("turnCount").innerText = turns;
            saveGameState();
        }
    }
// }

// Функція для збереження стану гри
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
}

// Функція для завантаження стану гри
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
    }
}

// Функція для дострокового завершення гри
function endGameEarly() {
    if (!gameStarted) return;
    savePlayerResult();
    gameStarted = false;
}

// Функція для збереження результатів гравця
function savePlayerResult() {
    let playerName = prompt("Enter your name to save the result:");
    if (!playerName) return;

    let results = JSON.parse(localStorage.getItem("results")) || [];
    results.push({ name: playerName, turns: turns });
    localStorage.setItem("results", JSON.stringify(results));

    displayResults();
}

// Функція для відображення результатів
function displayResults() {
    let results = JSON.parse(localStorage.getItem("results")) || [];
    let resultsTable = document.getElementById("resultsTable");
    // resultsTable.innerHTML = "<tr><th>Name</th><th>Number of turns</th></tr>";

    results.forEach(result => {
        let row = `<tr><td>${result.name}</td><td>${result.turns}</td></tr>`;
        resultsTable.innerHTML += row;
    });
}

// Завантаження при відкритті сторінки
window.onload = function() {
    initGame();
    displayResults();
};
