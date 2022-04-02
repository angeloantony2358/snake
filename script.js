const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scorep = document.getElementById('score');

// This is the restart button
var restartP = document.getElementById('restart');
restartP.style.display = 'none';

const audio = new Audio('crunch.wav');
const volume = 1;
var unmute = document.getElementById('speaker');
       
// Initial snake position.
var snake = [ { x: 240, y: 200 }, { x: 220, y: 200 }, { x: 200, y: 200 }, { x: 180, y: 200 }, { x: 160, y: 200 } ];// Well that was a stupid mistake.

// This function draws the entire snake.
function drawSnake() {
    for (const item of snake) {
        ctx.fillStyle = 'white';
        ctx.fillRect(item.x, item.y, 20, 20);
    }
}

var foodx;
var foody;
var changingDirection = false;
var dx = 20;
var dy = 0;
var score = 0;
scorep.innerHTML = 'SCORE 0'; // Initialising score 0

// Moves the snake on the screen by editting the snake array.
function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    const hasEaten = snake[0].x === foodx && snake[0].y === foody;

    if (hasEaten) {
        score += 1;
        scorep.innerHTML = 'SCORE ' + score;
        generateFood();
        if (volume === 1) {
            audio.play();
        }
    } else {
        snake.pop(); // That is, the snake didn't find food.
    }
}

// This is to clear the old snake before drawing a new snake.
function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function changeDirection(event) {
    // To check which direction the snake is already moving.
    const goUp = dy === -20;
    const goDown = dy === 20;
    const goRight = dx === 20;
    const goLeft = dx === -20;

    if (changingDirection) return;
    changingDirection = true;
    // This is to make sure stupid things don't happen.
    if (event.key === 'ArrowUp' && !goDown) {
        dx = 0;
        dy = -20;
    }
    if (event.key === 'ArrowDown' && !goUp) {
        dx = 0;
        dy = 20;
    }
    if (event.key === 'ArrowRight' && !goLeft) {
        dx = 20;
        dy = 0;
    }
    if (event.key === 'ArrowLeft' && !goRight) {
        dx = -20;
        dy = 0;
    }
}

function randomFood(min, max) {
    var number =  Math.round((Math.random() * (max - min) + min) / 20) * 20;
    return number;
}

function generateFood() {
    foodx = randomFood(0, canvas.width - 20);
    foody = randomFood(0, canvas.height - 40);
    const head = snake[0];
    if (head.x == foodx && head.y == foody) {
        drawFood();
    }
}

function drawFood() { // This function is for drawing the food for the first time.
    ctx.fillStyle = "red";
    ctx.fillRect(foodx, foody, 20 ,20);
}

function gameEnded() {
    for(let i = 4; i< snake.length; i++) {
        const hasCollided = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if (hasCollided)
            return true;
    }
    const hitLeftBorder = snake[0].x < 0;
    const hitRightBorder = snake[0].x > canvas.width - 20;
    const hitTopBorder = snake[0].y < 0;
    const hitBottomBorder = snake[0].y > canvas.height - 10;
    return hitLeftBorder || hitRightBorder || hitTopBorder || hitBottomBorder     
}

//Function to restart the game.
function restart(e) {
    if (e.keyCode === 32 && gameEnded()) {
        snake = [ { x: 240, y: 200 }, { x: 220, y: 200 }, { x: 200, y: 200 }, { x: 180, y: 200 }, { x: 160, y: 200 } ];
        dx = 20;
        dy = 0;
        score = 0;
        scorep.innerHTML = 'SCORE 0'
        restartP.style.display = 'none';
        main();
    }
}

function main() { 
    if (gameEnded()) {
        restartP.style.display = 'block';
        return;
    }
    changingDirection = false;
    setTimeout(function onTick() 
   { 
     clearCanvas();
     moveSnake();
     console.log('moved');  
     drawSnake();
     drawFood();
     // Call main again
     main();
   }, 100)
}

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    // true for mobile device
    alert('This page is only supported on desktop browser.')
  } else{
    // false for not mobile device
    main();
    generateFood();   
}


// Event listeners for keydown.
document.addEventListener("keydown",restart);
document.addEventListener("keydown",changeDirection);

//STYLINGS APART FROM THE GAME MECHANICS
const menuButton = document.querySelector('.menu-button');
const menuText = document.querySelector('.menu-list');


let menuOpen = false;
menuButton.addEventListener('click', () => {
    if (!menuOpen) {
        menuButton.classList.add('open');
        menuOpen = true;
        menuText.style.display = 'block';
    } else {
        menuButton.classList.remove('open');
        menuOpen = false;
        menuText.style.display = 'none';
    }
});