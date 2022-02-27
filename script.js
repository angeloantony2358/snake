var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var scorep = document.getElementById('score');

var restartP = document.getElementById('restart');
restartP.style.display = 'none';

var audio = new Audio('crunch.wav');
var volume = 1;
var unmute = document.getElementById('speaker');
       
// Initial snake position.
var snake = [ { x: 240, y: 200 }, { x: 220, y: 200 }, { x: 200, y: 200 }, { x: 180, y: 200 }, { x: 160, y: 200 } ];// Well that was a stupid mistake.


// Plots a single segment of the snake on the canvas.
function drawSnakePart(snakePart) {
    ctx.fillStyle = 'white';
    ctx.strokestyle = 'white';
    ctx.fillRect(snakePart.x, snakePart.y, 20, 20);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}


// Plots the snake on the canvas.
function drawSnake() {
    snake.forEach(drawSnakePart);
}

drawSnake();

// Params controlling snake and food.
let foodx;
let foody;
let changingDirection = false;
let dx = 20;
let dy = 0;
let score = 0;


// Moves the snake on the screen by editting the snake array.
function moveSnake() {
    let head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    
    const hasEaten = snake[0].x === foodx && snake[0].y === foody;

    if (hasEaten) {
        score += 1;
        scorep.innerHTML = 'SCORE ' + score.toString();
        unfade(scorep);
        generateFood();
        if (volume === 1) {
            audio.play();
        }
    } else {
        snake.pop();
    }
}


function clearCanvas() {
    //  Select the colour to fill the drawing
    ctx.fillStyle = 'black';
    ctx.strokestyle = "white";
    // Draw a "filled" rectangle to cover the entire canvas
    ctx.fillRect(0, 0, canvas.width, canvas.height);   
    ctx.strokeRect(0, 0, canvas.width, canvas.height); 
}


function changeDirection(event) {

    const goUp = dy === -20;
    const goDown = dy === 20;
    const goRight = dx === 20;
    const goLeft = dx === -20;

    if (changingDirection) return;
    changingDirection = true;

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
    snake.forEach(function hasSnakeEatenFood(part) {
        const hasEaten = part.x == foodx && part.y == foody;
        if (hasEaten) drawFood();
    });
}


function drawFood() {
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
        console.log(dx);
    }
}


function main() { 
    if (gameEnded()) {
        unfade(restartP);
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
        unfade(menuText);
    } else {
        menuButton.classList.remove('open');
        menuOpen = false;
        fade(menuText);
    }
});


//Fade magic for the text items.
function fade(element) {
    var op = 1;
    var timer = setInterval(function () {
        if (op <= 0.1) {
            clearInterval(timer);
            element.style.display = 'none'
        }
        element.style.opacity = op;
        op -= op * 0.1;
    }, 10);
}


function unfade(element) {
    var op = 0.1;
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = op;
        op += op * 0.1;
    }, 10);
}
