(function() {
      "use strict";

      // ----- DOM refs -----
      const playerScoreEl = document.getElementById('playerScore');
      const computerScoreEl = document.getElementById('computerScore');
      const playerChoiceIcon = document.getElementById('playerChoiceIcon');
      const computerChoiceIcon = document.getElementById('computerChoiceIcon');
      const resultMessage = document.getElementById('resultMessage');
      const resetBtn = document.getElementById('resetBtn');
      const choiceBtns = document.querySelectorAll('.choice-btn');

      // ----- Game state -----
      let playerScore = 0;
      let computerScore = 0;
      const WIN_SCORE = 5;          // play until someone reaches 5
      let gameActive = true;        // becomes false when someone wins

      // ----- Helper: computer random move -----
      function getComputerMove() {
        const moves = ['rock', 'paper', 'scissors'];
        const randomIndex = Math.floor(Math.random() * moves.length);
        return moves[randomIndex];
      }

      // ----- Helper: get emoji for move -----
      function getEmoji(move) {
        if (move === 'rock') return '🪨';
        if (move === 'paper') return '📄';
        if (move === 'scissors') return '✂️';
        return '❓';
      }

      // ----- Core: determine winner -----
      function getRoundResult(player, computer) {
        if (player === computer) return 'draw';

        const winConditions = {
          rock: 'scissors',
          paper: 'rock',
          scissors: 'paper'
        };

        return winConditions[player] === computer ? 'player' : 'computer';
      }

      // ----- Update UI (scores, icons, result) -----
      function updateUI(playerMove, computerMove, result, message) {
        // update icons
        playerChoiceIcon.textContent = getEmoji(playerMove);
        computerChoiceIcon.textContent = getEmoji(computerMove);

        // update scores
        playerScoreEl.textContent = playerScore;
        computerScoreEl.textContent = computerScore;

        // show result message
        resultMessage.innerHTML = message;
      }

      // ----- handle game over (win condition) -----
      function checkGameOver() {
        if (playerScore >= WIN_SCORE) {
          gameActive = false;
          resultMessage.innerHTML = `🏆 <strong>You win the game!</strong> 🎉`;
          return true;
        } else if (computerScore >= WIN_SCORE) {
          gameActive = false;
          resultMessage.innerHTML = `💻 <strong>Computer wins the game!</strong> 🤖`;
          return true;
        }
        return false;
      }

      // ----- Process a round -----
      function playRound(playerMove) {
        // if game is over, don't process moves (but allow reset)
        if (!gameActive) {
          resultMessage.innerHTML = `⛔ Game finished · press "New game"`;
          return;
        }

        // computer move
        const computerMove = getComputerMove();

        // determine winner
        const result = getRoundResult(playerMove, computerMove);

        // update scores based on result
        let message = '';
        if (result === 'player') {
          playerScore++;
          message = `✅ You win! ${getEmoji(playerMove)} beats ${getEmoji(computerMove)}`;
        } else if (result === 'computer') {
          computerScore++;
          message = `❌ Computer wins! ${getEmoji(computerMove)} beats ${getEmoji(playerMove)}`;
        } else {
          message = `⚖️ It's a draw! both chose ${getEmoji(playerMove)}`;
        }

        // update UI with icons & scores
        updateUI(playerMove, computerMove, result, message);

        // check if game is over (win condition)
        const gameEnded = checkGameOver();

        // if game ended, we already set message to win/lose, but keep icons
        if (gameEnded) {
          // we override result message with game over text (already set inside checkGameOver)
          // but we want to keep icons, so we just reapply icons (already done)
          // small extra: if game ended, we disable further moves (gameActive = false)
          // but we also want to show the winning message with style
          // we already set message inside checkGameOver, but we must keep icons.
          // we call updateUI again to keep icons and show the game-over message.
          // but we don't want to override the game-over message, so we just set it.
          // we also want to keep the icons that are already shown.
          // The updateUI call above already set icons correctly.
          // But the game-over message from checkGameOver is more important.
          // We can manually set the message after checkGameOver.
          // Actually checkGameOver sets resultMessage.innerHTML directly.
          // We need to ensure icons stay, so we call updateUI again with same moves.
          // To avoid flicker, we just call updateUI with same params, but message will be overwritten.
          // So better: we set the message after checkGameOver, but keep icons.
          // Let's do: updateUI again with same moves, but set the game-over message.
          // But checkGameOver already set resultMessage. We'll just keep it.
          // However, we need icons to be correct, which they are.
          // We'll just preserve.
          // final touch: ensure that icons are correct.
          // already done.
        }
      }

      // ----- Reset game -----
      function resetGame() {
        // reset scores
        playerScore = 0;
        computerScore = 0;
        gameActive = true;

        // reset UI
        playerScoreEl.textContent = '0';
        computerScoreEl.textContent = '0';
        playerChoiceIcon.textContent = '✋';
        computerChoiceIcon.textContent = '🤖';
        resultMessage.innerHTML = `🔄 <span>fresh start · pick a move</span>`;
      }

      // ----- Event listeners for move buttons -----
      choiceBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
          const move = this.dataset.move;
          if (!move) return;
          // if game is not active, we can still show a message but not process
          if (!gameActive) {
            resultMessage.innerHTML = `⏳ Game over — press "New game" to play again`;
            return;
          }
          playRound(move);
        });
      });

      // ----- Reset button -----
      resetBtn.addEventListener('click', resetGame);

      // ----- initial setup (optional) -----
      // set default message and icons
      resetGame();

      // additional: keyboard support or extra polish
      // small enhancement: if user clicks reset during game over, works fine.

      // Expose some state to console for debugging (optional)
      window.__rps = {
        playerScore: () => playerScore,
        computerScore: () => computerScore,
        reset: resetGame
      };
    })();
