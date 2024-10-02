let rows = 3;
let columns = 3;

let currTile;
let otherTile; //blank tile

let turns = 0;

// let imgOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
 let imgOrder = ["4", "2", "8", "5", "1", "6", "7", "9", "3"];

window.onload = function() {
    for (let r = 0; r < rows; r++) {
        for(let c = 0; c < columns; c++) {
            
            let tile = document.createElement("img"); //<img>
            tile.id = r.toString() + "-" + c.toString(); //There we define id for our <img>. To save the coordinates and to check that other tile are adjacent
            tile.src = "img/" + imgOrder.shift() + ".jpg"; // src = "..." in our <img>

            //DRAG FUNCTIONALITY
            

            document.getElementById("board").append(tile);
        }
    }
}