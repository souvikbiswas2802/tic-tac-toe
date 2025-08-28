document.addEventListener('DOMContentLoaded', () => {
            const board = document.getElementById('board');
            const status = document.getElementById('status');
            const restartButton = document.getElementById('restart');
            const xScoreElement = document.getElementById('x-score');
            const oScoreElement = document.getElementById('o-score');
            const drawScoreElement = document.getElementById('draw-score');
            
            let currentPlayer = 'X';
            let gameActive = true;
            let gameState = ['', '', '', '', '', '', '', '', ''];
            let scores = { X: 0, O: 0, draws: 0 };
            
            const winningConditions = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
                [0, 4, 8], [2, 4, 6]             // diagonals
            ];
            
            const winningMessage = () => `Player <span class="player-turn player-${currentPlayer.toLowerCase()}">${currentPlayer}</span> wins!`;
            const drawMessage = () => `Game ended in a draw!`;
            const currentPlayerTurn = () => `Player <span class="player-turn player-${currentPlayer.toLowerCase()}">${currentPlayer}</span>'s turn`;
            
            status.innerHTML = currentPlayerTurn();
            
            function handleCellClick(clickedCellEvent) {
                const clickedCell = clickedCellEvent.target;
                const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));
                
                if (gameState[clickedCellIndex] !== '' || !gameActive) {
                    return;
                }
                
                handleCellPlayed(clickedCell, clickedCellIndex);
                handleResultValidation();
            }
            
            function handleCellPlayed(clickedCell, clickedCellIndex) {
                gameState[clickedCellIndex] = currentPlayer;
                clickedCell.textContent = currentPlayer;
                clickedCell.classList.add(currentPlayer.toLowerCase());
            }
            
            function handleResultValidation() {
                let roundWon = false;
                let winningCombo = [];
                
                for (let i = 0; i < winningConditions.length; i++) {
                    const [a, b, c] = winningConditions[i];
                    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                        roundWon = true;
                        winningCombo = winningConditions[i];
                        break;
                    }
                }
                
                if (roundWon) {
                    status.innerHTML = winningMessage();
                    gameActive = false;
                    
                    // Highlight winning cells
                    winningCombo.forEach(index => {
                        document.querySelector(`[data-cell-index="${index}"]`).classList.add('winning-cell');
                    });
                    
                    // Update score
                    scores[currentPlayer]++;
                    updateScoreboard();
                    return;
                }
                
                const roundDraw = !gameState.includes('');
                if (roundDraw) {
                    status.innerHTML = drawMessage();
                    gameActive = false;
                    scores.draws++;
                    updateScoreboard();
                    return;
                }
                
                // Switch player turns
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                status.innerHTML = currentPlayerTurn();
            }
            
            function updateScoreboard() {
                xScoreElement.textContent = scores.X;
                oScoreElement.textContent = scores.O;
                drawScoreElement.textContent = scores.draws;
            }
            
            function restartGame() {
                gameActive = true;
                currentPlayer = 'X';
                gameState = ['', '', '', '', '', '', '', '', ''];
                status.innerHTML = currentPlayerTurn();
                
                document.querySelectorAll('.cell').forEach(cell => {
                    cell.textContent = '';
                    cell.classList.remove('x', 'o', 'winning-cell');
                });
            }
            
            // Event listeners
            document.querySelectorAll('.cell').forEach(cell => {
                cell.addEventListener('click', handleCellClick);
            });
            
            restartButton.addEventListener('click', restartGame);
        });