const playBoard = document.querySelector('#playBoard');
const gameInterface = document.querySelector('#gameInterface');
const gridSizeModal = document.querySelector('#gridSizeModal');
const resultModal = document.querySelector('#resultModal');
const resultMsg = document.querySelector('#resultMsg');

let eatingAudio = new Audio('./assets/audio/eating.wav');
let collisionAudio = new Audio('./assets/audio/collision.wav');

let gridBoard = 30;
let moveSpeed = 150;
let foodX, foodY;
let directionX = 0, directionY = 0;
let snakeBody = [
    {
        x: 5,
        y: 5
    }
];
let eatenFoodCount = 0;
let interval;


const foodRandomPosition = function () {
    foodX = Math.floor(Math.random() * gridBoard) + 1;
    foodY = Math.floor(Math.random() * gridBoard) + 1;

    snakeBody.forEach( snake => {
        if (snake.x == foodX && snake.y == foodY) {
            foodRandomPosition();
        }
    })
}

const movePlayer = function (e) {

    if (e.key == 'ArrowDown' && directionY == 0) {
        directionX = 0;
        directionY = 1;
    }
    else if (e.key == 'ArrowUp' && directionY == 0) {
        directionX = 0;
        directionY = -1;
    }
    else if (e.key == 'ArrowRight' && directionX == 0) {
        directionX = 1;
        directionY = 0;
    }
    else if (e.key == 'ArrowLeft' && directionX == 0) {
        directionX = -1;
        directionY = 0;
    }

    //game();
}

const isEating = function () {
    // check if eat food
    if (snakeBody[0].x === foodX && snakeBody[0].y === foodY) {

        eatingAudio.load();
        eatingAudio.play();

        eatenFoodCount++;

        // increase snake speed
        let newMoveSpeed = moveSpeed - (moveSpeed * eatenFoodCount / 100);
        clearInterval(interval);
        interval = setInterval(game, newMoveSpeed);

        foodRandomPosition();

        snakeBody.push({
            x: snakeBody[0].x,
            y: snakeBody[0].y
        })

        displayScore();
    }
}

const displayGame = function () {
    let tmpSnakeBody = [];

    snakeBody.forEach(snake => {
        tmpSnakeBody.push({
            x: snake.x,
            y: snake.y,
        });
    });

    // print food
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    snakeBody[0].x += directionX;
    snakeBody[0].y += directionY;

    for (let i = 1; i < snakeBody.length; i++) {
        snakeBody[i] = tmpSnakeBody[i - 1];
    }

    // print snake
    snakeBody.forEach((snake, i) => {
        html += `<div class="snake" style="grid-area: ${snake.y} / ${snake.x}"></div>`;
    });


    // display
    playBoard.innerHTML = html;
}

const displayScore = function () {
    document.getElementById('score').innerHTML = eatenFoodCount;
}

const restart = function () {
    directionX = 0, directionY = 0;
    eatenFoodCount = 0;
    snakeBody = [
        {
            x: 5,
            y: 5
        }
    ];
    foodRandomPosition();
    displayScore();
}

const pauseGame = function () {
    directionX = 0;
    directionY = 0;
    clearInterval(interval);
}

const checkCollision = function () {
    let collision = false;

    if (Math.abs(snakeBody[0].x) == gridBoard + 1
        || Math.abs(snakeBody[0].y) == gridBoard + 1
        || Math.abs(snakeBody[0].x) == 0
        || Math.abs(snakeBody[0].y) == 0) {
        collision = true;
    }

    snakeBody.forEach((snake, i) => {
        if (i > 0) {
            if (snakeBody[0].x == snake.x && snakeBody[0].y == snake.y) {
                collision = true;
            }
        }
    });

    if (collision) {
        gameInterface.style.display = 'none';
        resultModal.style.display = 'block';
        resultMsg.innerText = `Hai totalizzato ${eatenFoodCount} punti!`
        collisionAudio.play();
        pauseGame();
    }
}

const setGrid = function (number) {
    gridBoard = number;
    playBoard.style.gridTemplate = `repeat(${gridBoard}, 1fr) / repeat(${gridBoard}, 1fr)`;
    start();
}

const game = function () {
    isEating();
    displayGame();
    checkCollision();
}

const start = function () {
    gameInterface.style.display = 'block';
    gridSizeModal.style.display = 'none'
    foodRandomPosition();
    game();
    clearInterval(interval);
    interval = setInterval(game, moveSpeed);
}

document.addEventListener("keydown", movePlayer);