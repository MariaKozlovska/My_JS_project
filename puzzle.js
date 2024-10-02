let rows = 3;
let columns = 3;

let currTile;
let otherTile; // blank tile

let turns = 0;

let imgOrder = ["4", "2", "8", "5", "1", "6", "7", "9", "3"];

window.onload = function() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            
            let tile = document.createElement("img"); // <img>
            tile.id = r.toString() + "-" + c.toString(); // Define id for the tile
            tile.src = "img/" + imgOrder.shift() + ".jpg"; // Set the src of the image

            // DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart); // Start dragging
            tile.addEventListener("dragover", dragOver); // While dragging over
            tile.addEventListener("dragenter", dragEnter); // Enter another tile
            tile.addEventListener("dragleave", dragLeave); // Leave the tile
            tile.addEventListener("drop", dragDrop); // Drop onto another tile
            tile.addEventListener("dragend", dragEnd); // End dragging

            document.getElementById("board").append(tile);

            console.log(tile.src); // Logging the image source for debugging
        }
    }
}

// Оголошення функцій для drag-and-drop
function dragStart() {
    console.log("Drag Start");
    currTile = this; // Save the current tile being dragged
}

function dragOver(e) {
    e.preventDefault(); // Prevent default behavior to allow drop
}

function dragEnter(e) {
    e.preventDefault(); // Prevent default behavior
}

function dragLeave() {
    console.log("Drag Leave");
}

function dragDrop() {
    otherTile = this; // Save the tile being dropped onto
    console.log("Dropped");
}

function dragEnd() {
    // Ensure otherTile exists and has the correct image
    if (!otherTile || !otherTile.src.includes("3.jpg")) {
        return;
    }
    
    let currCoords = currTile.id.split("-"); //"0-0" -> ["0", "0"]
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    // Check if tiles are adjacent
    let moveLeft = r == r2 && c2 == c - 1;
    let moveRight = r == r2 && c2 == c + 1;
    let moveUp = c == c2 && r2 == r - 1;
    let moveDown = c == c2 && r2 == r + 1;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown; 

    if (isAdjacent) {
        // Swap the tiles
        let currImg = currTile.src;
        let otherImg = otherTile.src;

        currTile.src = otherImg;
        otherTile.src = currImg;

        turns += 1;
        document.getElementById("turns").innerText = turns;

        console.log("Tiles swapped");
    } else {
        console.log("Tiles are not adjacent");
    }
}
