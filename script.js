document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    
    const PLAYER = 'X';
    const COMPUTER = 'O';
    let currentPlayer = PLAYER;
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        if (gameState[clickedCellIndex] !== '' || !gameActive || currentPlayer !== PLAYER) {
            return;
        }
        
        makeMove(clickedCell, clickedCellIndex, PLAYER);
        
        if (gameActive) {
            currentPlayer = COMPUTER;
            status.textContent = "Computer thinking...";
            
            setTimeout(() => {
                if (gameActive) {
                    computerMove();
                }
            }, 500);
        }
    }
    
    function makeMove(cell, index, player) {
        gameState[index] = player;
        cell.textContent = player;
        cell.classList.add(player.toLowerCase());
        checkResult();
    }
    
    function computerMove() {
        if (!gameActive) return;
        
        // Only try to win 50% of the time when possible
        let bestMove = -1;
        if (Math.random() < 0.5) {
            bestMove = findWinningMove(COMPUTER);
        }
        
        // Only block player 30% of the time when possible
        if (bestMove === -1 && Math.random() < 0.3) {
            bestMove = findWinningMove(PLAYER);
        }
        
        // Otherwise make a random move (easier for player)
        if (bestMove === -1) {
            bestMove = getRandomMove();
        }
        
        // Sometimes make a "mistake" (5% chance) even when there's a better move
        if (bestMove !== -1 && Math.random() < 0.05) {
            bestMove = getRandomMove();
        }
        
        if (bestMove !== -1) {
            const cell = document.querySelector(`.cell[data-index="${bestMove}"]`);
            makeMove(cell, bestMove, COMPUTER);
            currentPlayer = PLAYER;
            if (gameActive) {
                status.textContent = "Your turn (X)";
            }
        }
    }
    
    function findWinningMove(player) {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameState[a] === player && gameState[b] === player && gameState[c] === '') return c;
            if (gameState[a] === player && gameState[c] === player && gameState[b] === '') return b;
            if (gameState[b] === player && gameState[c] === player && gameState[a] === '') return a;
        }
        return -1;
    }
    
    function getRandomMove() {
        const availableMoves = gameState
            .map((cell, index) => cell === '' ? index : null)
            .filter(val => val !== null);
        
        return availableMoves.length > 0 ? 
            availableMoves[Math.floor(Math.random() * availableMoves.length)] : -1;
    }
    
    function checkResult() {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                const winner = gameState[a] === PLAYER ? 'You' : 'Computer';
                status.textContent = `${winner} win${gameState[a] === PLAYER ? '' : 's'}!`;
                gameActive = false;
                return;
            }
        }
        
        if (!gameState.includes('')) {
            status.textContent = "Game ended in a draw!";
            gameActive = false;
            return;
        }
    }
    
    function resetGame() {
        currentPlayer = PLAYER;
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        status.textContent = "Your turn (X)";
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });
    }
    
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', resetGame);
});