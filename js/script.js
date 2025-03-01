//----------------------------
// GameBoard Module
//----------------------------
const GameBoard = (function(){
    //create an array of 9 empty cells
    let board = Array(9).fill("");

    //set cells
    function setCell(index, marker){
        if (board[index] === ""){
            board[index] = marker;
            return true;
        }
        return false;
    }
    // get specifc cell
    function getCell(){
        return board[index];
    }
    //function to reset the board (start a new game)
    function reset(){
        board = Array(9).fill("");
    }
    //function to get the entire board
    function getBoard(){
        return board;
    }

    return {setCell, getCell, reset, getBoard}

    console.log(setCell);
console.log(getCell);
console.log(reset);
console.log(getBoard);
})();



// -------------------------
// Player Factory
// -------------------------
function createPlayer(name, marker){
    return {name, marker};
}

// -------------------------
// GameController Module
// -------------------------
const GameController = (function(){
    let players = [];
    let currentPlayerIndex = 0;
    let gameOver = false;

    //winning combos
    const winningCombos = [
        [0, 1, 2], // Top row
        [3, 4, 5], // Middle row
        [6, 7, 8], // Bottom row
        [0, 3, 6], // Left column
        [1, 4, 7], // Middle column
        [2, 5, 8], // Right column
        [0, 4, 8], // Diagonal from top-left to bottom-right
        [2, 4, 6]  // Diagonal from top-right to bottom-left
    ];

    //start(or restart)
    function startGame(){
        players = [
            createPlayer('Player1', 'X'),
            createPlayer('Player2', 'O')
        ];

        currentPlayerIndex = 0;
        gameOver = false;
        GameBoard.reset();
        DisplayController.renderBoard();
        DisplayController.updateStatus(players[currentPlayerIndex].name + "'s turn");
    }

    function playTurn(index){
        if(gameOver){
            return;
        }

        if(GameBoard.getBoard()[index] !== ""){
            return;
        }

        //place the current players marker on the board
        GameBoard.setCell(index, players[currentPlayerIndex].marker);
        DisplayController.renderBoard();

        //check if this move wins the game
        if(checkWinner(players[currentPlayerIndex].marker)){
            DisplayController.updateStatus(players[currentPlayerIndex].name + " wins!");
            gameOver = true;
            return;
        }

        //check if its a tie
        if (!GameBoard.getBoard().includes("")){
            DisplayController.updateStatus("Its a tie!");
            gameOver = true;
            return;
        }

        //switch turns if it's "X", then switch to "O" and vice versa
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        DisplayController.updateStatus(players[currentPlayerIndex].name + "'s turn");
    }

    // check if the current marker meets any winning condition
    function checkWinner(marker){
        return winningCombos.some(combo => {
            return combo.every(index => GameBoard.getBoard()[index] === marker);
        });
    }

    return { startGame, playTurn};
})();

// -------------------------
// DisplayController Module
// -------------------------
const DisplayController = (function(){
    //select the cells, status display, and restart button fromo the DOM
    const cells = document.querySelectorAll('.cell');
    const statusDiv = document.querySelector('.game-status');
    const restartBtn = document.querySelector('.restart-button');

    //init event listeners on cells and the restart btn
    function init(){
        cells.forEach(cell => cell.addEventListener("click", handleCellClick));
        restartBtn.addEventListener('click', GameController.startGame);
    }

    //when a cell is clicked, determine its index and pass it to the game logic
    function handleCellClick(e){
        const index = e.target.getAttribute('data-index');
        GameController.playTurn(index);
    }

    //render the board on the webpage based on the state of Gameboard
    function renderBoard(){
        const board = GameBoard.getBoard();
        cells.forEach((cell, index) =>{
            cell.textContent = board[index];
        });
    }

    //update the status message which players turn or game outcome

    function updateStatus(message){
        statusDiv.textContent = message;
    }

    return {init, renderBoard, updateStatus};
})();


// -------------------------
// Initialize the Application
// -------------------------

document.addEventListener('DOMContentLoaded', function(){
    DisplayController.init();
    GameController.startGame();

});