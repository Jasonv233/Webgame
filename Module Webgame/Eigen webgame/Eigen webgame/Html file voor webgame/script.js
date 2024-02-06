let gameStarted = false;
let timerDisplay;
let pauseButton;
let resetButton;
let timerInterval;

function showOptions() {
    const startButton = document.getElementById('startButton');
    const options = document.getElementById('options');
    startButton.style.display = 'none';
    options.style.display = 'block';
}

function startGame(cardCount) {
    gameStarted = true;
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('options').style.display = 'none';

    if (timerDisplay) {
        timerDisplay.remove();
    }
    if (pauseButton) {
        pauseButton.remove();
    }
    if (resetButton) {
        resetButton.remove();
    }

    timerDisplay = document.createElement('div');
    timerDisplay.id = 'timer';

   
    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'controlsContainer';
    controlsContainer.style.display = 'flex';
    controlsContainer.style.justifyContent = 'space-between';
    controlsContainer.style.alignItems = 'center';
    controlsContainer.style.marginTop = '10px';


   
    pauseButton = createButton('Pause', pauseGame);
    controlsContainer.appendChild(pauseButton);

    controlsContainer.appendChild(timerDisplay);

    resetButton = createButton('Reset', resetGame);
    resetButton.style.marginLeft = 'auto';
    controlsContainer.appendChild(resetButton);

   
    document.body.appendChild(controlsContainer);

    initializeGame(cardCount);
}

function createButton(text, onClick) {
    const button = document.createElement('button');
    button.innerText = text;
    button.onclick = onClick;
    return button;
}

let gameStart = false;
let gamePaused = false;

function generateRandomColors() {
    const colors = [
        '#ff6666', '#ffcc66', '#66cc66', '#6666cc',
        '#cc66cc', '#cccc66', '#66cccc', '#999999',
        '#ff9999', '#ffeb99', '#99ff99', '#9999ff'
    ];
    return [...colors, ...colors].sort(() => Math.random() - 0.5);
}

function initializeGame(cardCount) {
    let colors = generateRandomColors().slice(0, cardCount);
    let selectedCards = [];
    let moves = 0;
    let correctMatches = 0;

    function startTimer() {
        let seconds = 0;
        let minutes = 0;
        setInterval(function () {
            if (gameStarted){
                if (!gamePaused) {
                    seconds++;
                    if (seconds === 60) {
                        seconds = 0;
                        minutes++;
                    }
                    updateTimerDisplay(minutes, seconds);
                }
            } else {
                seconds = 0;
                minutes = 0;
            }

        }, 1000);
    }

    function updateTimerDisplay(minutes, seconds) {
        const timerDisplay = document.getElementById('timer');
        timerDisplay.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function handleClick(index) {
        if (selectedCards.length < 2 && !gamePaused) {
            selectedCards.push({ index, color: colors[index] });
            document.getElementById(`card_${index}`).style.backgroundColor = colors[index];

            if (selectedCards.length === 2) {
                setTimeout(checkMatch, 1000);
            }
        }
    }

    function checkMatch() {
        const [card1, card2] = selectedCards;
        if (card1.color === card2.color) {
            document.getElementById(`card_${card1.index}`).style.backgroundColor = '#90ee90';
            document.getElementById(`card_${card2.index}`).style.backgroundColor = '#90ee90';
            correctMatches++;

            if (correctMatches === cardCount / 2) {
                setTimeout(() => {
                    alert('Congratulations! You won the game!');
                    resetGame();
                }, 500);
            }
        } else {
            document.getElementById(`card_${card1.index}`).style.backgroundColor = '#080202';
            document.getElementById(`card_${card2.index}`).style.backgroundColor = '#080202';
        }

        selectedCards = [];
        moves++;

        if (moves === cardCount && correctMatches < cardCount / 2) {
            alert('Game over! You did not match all pairs. Please try again.');
            resetGame();
        }
    }

    function resetGame() {
        selectedCards = [];
        moves = 0;
        correctMatches = 0;
        gameStarted = false;
        gamePaused = false;
        document.getElementById('startButton').style.display = 'block';
        document.getElementById('options').style.display = 'none';
        document.getElementById('timer').innerText = '00:00';

        colors = generateRandomColors().slice(0, cardCount);

        for (let i = 0; i < cardCount; i++) {
            document.getElementById(`card_${i}`).style.backgroundColor = '#f0f0f0';
        }
    }

    startTimer();

    const board = document.getElementById('board');
    for (let i = 0; i < cardCount; i++) {
        const card = document.createElement('div');
        card.id = `card_${i}`;
        card.className = 'card';
        card.addEventListener('click', () => handleClick(i));
        board.appendChild(card);
    }
}

function pauseGame() {
    gamePaused = !gamePaused;
}

function resetGame() {
    if (gameStarted) {
        alert('Game reset!');
        document.getElementById('board').innerHTML = '';
        var controlsContainer = document.getElementById('controlsContainer').remove();
        gameStarted = false;
        gamePaused = false;
        showOptions();
    
    }
}