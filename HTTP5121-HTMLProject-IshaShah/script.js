// DOM Elements
var startPage = document.getElementById("start-page"); 
var startButton = document.getElementById("start-button"); 
var gamePage = document.getElementById("game-page"); 
var board = document.getElementById("board"); 
var turnDisplay = document.getElementById("turn"); 
var winnerPopup = document.getElementById("winner-popup"); 
var popupTitle = document.getElementById("popup-title"); 
var popupRestart = document.getElementById("popup-restart"); 
var popupHome = document.getElementById("popup-home"); 
var homeButton = document.getElementById("home-button"); 
var confettiContainer = document.getElementById("confetti"); 

// Game State Variables
var currentPlayer = "X"; 
var boardState = Array(9).fill(null);
var gameActive = true;

// Event listener to start the game
startButton.addEventListener("click", function () {
    startPage.classList.remove("active"); 
    gamePage.classList.add("active"); 
    initializeBoard();
});

// Event listener to return to the home page
homeButton.addEventListener("click", goHome);

// Function to initialize the game board
function initializeBoard() {
    board.innerHTML = ""; 
    boardState = Array(9).fill(null); 
    gameActive = true; 
    currentPlayer = "X"; 
    turnDisplay.textContent = "Player 1's Turn (X)"; 
    winnerPopup.classList.remove("active"); 
    clearConfetti();

    // Create 9 cells for the board
    for (var i = 0; i < 9; i++) {
        var cell = document.createElement("div");
        cell.classList.add("cell"); // Add CSS class for styling
        cell.dataset.index = i; // Assign a data attribute for indexing
        cell.addEventListener("click", handleCellClick); // Add click event listener
        board.appendChild(cell); // Append the cell to the board
    }
}

// Function to handle a player's cell click
function handleCellClick(e) {
    if (!gameActive) return; // Ignore clicks if the game is over

    var cell = e.target;
    var index = cell.dataset.index;

    if (boardState[index]) return; // Prevent overwriting a taken cell

    // Generate a multiplication question for the player's turn
    var questionData = generateQuestion();
    var question = questionData.question;
    var answer = questionData.answer;
    var userAnswer = prompt("Answer this to play your turn: " + question);

    // If the user's answer is correct
    if (parseInt(userAnswer) === answer) {
        boardState[index] = currentPlayer; 
        cell.textContent = currentPlayer; 
        cell.classList.add("taken", currentPlayer); // Add styling for a taken cell

        // Check if the current player has won
        if (checkWin()) {
            gameActive = false; // Deactivate the game
            showWinner(currentPlayer + " Wins!"); // Display winner message
            triggerConfetti(); // Trigger confetti animation
            return;
        }

        // Check if the game is a draw (no more empty cells)
        if (!boardState.includes(null)) {
            gameActive = false; // Deactivate the game
            showWinner("It's a Draw!"); // Display draw message
            triggerConfetti(); // Trigger confetti animation
            return;
        }

        // Switch to the next player
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        turnDisplay.textContent = "Player " + (currentPlayer === "X" ? "1" : "2") + "'s Turn (" + currentPlayer + ")"; 
    } else {
        // If the user's answer is incorrect
        cell.classList.add("wrong-answer"); 
        setTimeout(function () {
            cell.classList.remove("wrong-answer");
        }, 1000); 

        // Notify the player and switch turns
        setTimeout(function () {
            alert("Wrong answer! You missed your turn."); 
            currentPlayer = currentPlayer === "X" ? "O" : "X"; 
            turnDisplay.textContent = "Player " + (currentPlayer === "X" ? "1" : "2") + "'s Turn (" + currentPlayer + ")"; 
        }, 200);
    }
}

// Function to generate a random multiplication question
function generateQuestion() {
    var num1 = Math.floor(Math.random() * 10) + 1; 
    var num2 = Math.floor(Math.random() * 10) + 1;
    return { question: num1 + " × " + num2, answer: num1 * num2 }; 
}

// Function to check if there is a winning combination
function checkWin() {
    var winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6] 
    ];
    return winningCombos.some(function (combo) {
        var a = combo[0], b = combo[1], c = combo[2];
        return boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c];
    });
}

// Function to display the winner or draw message
function showWinner(message) {
    popupTitle.textContent = message; 
    winnerPopup.classList.add("active"); 
}

// Function to return to the home page
function goHome() {
    winnerPopup.classList.remove("active"); 
    gamePage.classList.remove("active"); 
    startPage.classList.add("active"); 
    clearConfetti();
}

// Function to trigger confetti animation for celebration
function triggerConfetti() {
    confettiContainer.innerHTML = ""; 
    for (var i = 0; i < 150; i++) {
        var confettiPiece = document.createElement("div");
        confettiPiece.classList.add("confetti-piece"); 
        confettiPiece.style.left = Math.random() * 100 + "%"; 
        confettiPiece.style.backgroundColor = "hsl(" + (Math.random() * 360) + ", 100%, 70%)"; 
        confettiPiece.style.animationDelay = Math.random() * 2 + "s"; 
        confettiPiece.style.transform = "rotate(" + (Math.random() * 360) + "deg)"; 
        confettiPiece.style.animationDuration = (Math.random() * 2 + 2) + "s"; 
        confettiContainer.appendChild(confettiPiece); 
    }
}
// Function to clear all confetti
function clearConfetti() {
    confettiContainer.innerHTML = ""; 
}
// Event listeners for popup buttons
popupRestart.addEventListener("click", initializeBoard); 
popupHome.addEventListener("click", goHome); 
