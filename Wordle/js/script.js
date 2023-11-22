// Array of words to choose a secret word from
const dictionary = ['earth', 'plane', 'crane', 'prank', 'house', 'audio', 'truck', 'paint', 'green', 'brown', 'black', 'radio', 'flash', 'pizza', 'dizzy', 'crazy', 'faith'];

// Initial game state
const state = {
  secret: dictionary[Math.floor(Math.random() * dictionary.length)], // Randomly choose a word from the dictionary
  grid: Array(6).fill().map(() => Array(5).fill('')), // Two-dimensional grid for the letters
  currentRow: 0, // The current row in the grid where the next letter is going to be typed
  currentCol: 0, // The current column in the grid where the next letter is going to be typed
};

// Function to draw the grid on the HTML container
function drawGrid(container) {
  const grid = document.createElement('div');
  grid.className = 'grid';

  // Loop to create rows and columns in the grid
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 5; j++) {
      drawBox(grid, i, j); // coding in line 38 
    }
  }

  container.appendChild(grid);
}

// Function to update the grid based on the current state
function updateGrid() {
  for (let i = 0; i < state.grid.length; i++) {
    for (let j = 0; j < state.grid[i].length; j++) {
      const box = document.getElementById(`box${i}${j}`);
      box.textContent = state.grid[i][j];
    }
  }
}

// Function to draw a box with a letter in it
function drawBox(container, row, col, letter = '') {
  const box = document.createElement('div');
  box.className = 'box';
  box.textContent = letter;
  box.id = `box${row}${col}`;

  container.appendChild(box);
  return box;
}


// Function to register keyboard events
function registerKeyboardEvents() {
  document.body.onkeydown = (e) => {
    const key = e.key;
    if (key === 'Enter') {
      if (state.currentCol === 5) {
        const word = getCurrentWord();
        if (isWordValid(word)) {
          revealWord(word); // coding in line 108
          state.currentRow++;
          state.currentCol = 0;
        } else {
          alert('Not a valid word.');
        }
      }
    }
    if (key === 'Backspace') {
      removeLetter(); // coding in line 168
    }
    if (isLetter(key)) { // coding in line 156
      addLetter(key); // coding in line 161
    }

    updateGrid();
  };
}

// Function to get the current word in the grid
function getCurrentWord() {
  return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}

// Function to check if a word is valid
function isWordValid(word) {
  return dictionary.includes(word);
}

// Function to get the number of occurrences of a letter in a word
function getNumOfOccurrencesInWord(word, letter) {
  let result = 0;
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      result++;
    }
  }
  return result;
}

// Function to get the position of the occurrence of a letter in a word
function getPositionOfOccurrence(word, letter, position) {
  let result = 0;
  for (let i = 0; i <= position; i++) {
    if (word[i] === letter) {
      result++;
    }
  }
  return result;
}

// Function to reveal the word and update the grid with animations
function revealWord(guess) {
  const row = state.currentRow;
  const animation_duration = 500; // ms

  for (let i = 0; i < 5; i++) {
    const box = document.getElementById(`box${row}${i}`);
    const letter = box.textContent;
    const numOfOccurrencesSecret = getNumOfOccurrencesInWord(
      state.secret,
      letter
    );
    const numOfOccurrencesGuess = getNumOfOccurrencesInWord(guess, letter);
    const letterPosition = getPositionOfOccurrence(guess, letter, i);

    setTimeout(() => {
      if (
        numOfOccurrencesGuess > numOfOccurrencesSecret &&
        letterPosition > numOfOccurrencesSecret
      ) {
        box.classList.add('empty');
      } else {
        if (letter === state.secret[i]) {
          box.classList.add('right');
        } else if (state.secret.includes(letter)) {
          box.classList.add('wrong');
        } else {
          box.classList.add('empty');
        }
      }
    }, ((i + 1) * animation_duration) / 2);

    box.classList.add('animated');
    box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
  }

  const isWinner = state.secret === guess;
  const isGameOver = state.currentRow === 5;

  setTimeout(() => {
    if (isWinner) {
      alert('Congratulations!');
    } else if (isGameOver) {
      alert(`Better luck next time! The word was ${state.secret}.`);
    }
  }, 3 * animation_duration);
}

// Function to check if a key is a letter
function isLetter(key) {
  return key.length === 1 && key.match(/[a-z]/i);
}

// Function to add a letter to the grid
function addLetter(letter) {
  if (state.currentCol === 5) return;
  state.grid[state.currentRow][state.currentCol] = letter;
  state.currentCol++;
}

// Function to remove a letter from the grid
function removeLetter() {
  if (state.currentCol === 0) return;
  state.grid[state.currentRow][state.currentCol - 1] = '';
  state.currentCol--;
}

// Function to show instructions when the game starts
function showInstructions() {
  alert("Welcome to Wordle!\n\nHere's how to play:\n\n1. Guess a five-letter word.\n2. Press Enter to submit your guess.\n3. Green boxes indicate correct letters in the correct position.\n4. Yellow boxes indicate correct letters in the wrong position.\n5. Gray boxes indicate incorrect letters.\n6. You have 6 attempts to guess the secret word.\n\nClick OK to start playing!");
}

// Hint button 
function showHint() {
  const hintTitle = "Hint!!!";
  const hintContent = "Blue and green from space.";

  // pop-up with hint info
  const hintMessage = `${hintTitle}\n\n${hintContent}`;
  alert(hintMessage);
}

// Function to initialize the game
function startup() {
  showInstructions(); // Display instructions when the game starts
  const game = document.getElementById('game');
  drawGrid(game);
  registerKeyboardEvents();
}

// Start the game
startup();
