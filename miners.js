var board = [];
var rows = 8;
var columns = 8;
var totalTiles = rows * columns;

var minesCount = Math.floor(Math.random() * 63);
var minesLocation = [];

var tilesClicked = 0;
var tilesFlagged = 0;
var flagEnabled = false;

var gameOver = false;

window.onload = function () {
    startGame();
    playBombSound();
}

function playBombSound() {
    var bombSound = document.getElementById("bomb-sound");
    bombSound.play();
}

function playGameOverSound() {
    var gameOverSound = document.getElementById("game-over-sound");
    gameOverSound.play();
}

function setMines() {
    let minesLeft = minesCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    setMines();

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
}


function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray   ";
    }
    else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;
    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
            tilesFlagged += 1;
        }
        else if (tile.innerText == "🚩") {
            tile.innerText = "";
            tilesFlagged -= 1;
        }
        document.getElementById("tiles-flagged").innerText = tilesFlagged;
        return;
    }

    if (minesLocation.includes(tile.id)) {  
        gameOver = true;
        document.body.style.backgroundColor = "red"; 
        revealMines();
        setTimeout(function () {
            playGameOverSound();  
            alert("Game Over");
        }, 1);
        return;
    }
    let coords = tile.id.split("-"); // "0-0" -> ["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);

    unclickedTiles = totalTiles - tilesClicked;
    console.log("totalTiles: " + totalTiles);
    console.log("tilesClicked: " + tilesClicked);
    console.log("unclickedTiles: " + unclickedTiles);
    
    if (tilesClicked === rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
        document.body.style.backgroundColor = "green";
        setTimeout(function () {
            playWinSound();     
            alert("Win!");
        }, 1);
        return;
    }
}

function playWinSound() {
    var winSound = document.getElementById("win-sound");
    winSound.play();
}


function revealMines() {
    playGameOverSound();  // Play game over sound
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}


function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    //top 3
    minesFound += checkTile(r-1, c-1);      //top left
    minesFound += checkTile(r-1, c);        //top 
    minesFound += checkTile(r-1, c+1);      //top right

    //left and right
    minesFound += checkTile(r, c-1);        //left
    minesFound += checkTile(r, c+1);        //right

    //bottom 3
    minesFound += checkTile(r+1, c-1);      //bottom left
    minesFound += checkTile(r+1, c);        //bottom 
    minesFound += checkTile(r+1, c+1);      //bottom right

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        //top 3
        checkMine(r-1, c-1);    //top left
        checkMine(r-1, c);      //top
        checkMine(r-1, c+1);    //top right

        //left and right
        checkMine(r, c-1);      //left
        checkMine(r, c+1);      //right

        //bottom 3
        checkMine(r+1, c-1);    //bottom left
        checkMine(r+1, c);      //bottom
        checkMine(r+1, c+1);    //bottom right
    }
}
 
function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}