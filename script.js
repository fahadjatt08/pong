const canvas = document.getElementById("pongCanvas");
const context = canvas.getContext("2d");

// Responsive canvas size
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const paddleWidth = 10;
const paddleHeight = 100;
const playerPaddle = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 5
};
const aiPaddle = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 4
};
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 4,
    dx: 4,
    dy: 4
};
let playerScore = 0;
let aiScore = 0;
let gamePaused = false;

// Load sounds
const bgm = new Audio("bgm.mp3");
const hitSound = new Audio("hit.mp3");
const loseSound = new Audio("lose.mp3");

// Start background music
bgm.loop = true;

// Draw court lines
function drawCourtLines() {
    context.strokeStyle = "#fff";
    context.lineWidth = 2;

    // Draw center line
    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.stroke();

    // Draw horizontal lines
    context.beginPath();
    context.moveTo(0, canvas.height / 3);
    context.lineTo(canvas.width, canvas.height / 3);
    context.stroke();

    context.beginPath();
    context.moveTo(0, canvas.height * 2 / 3);
    context.lineTo(canvas.width, canvas.height * 2 / 3);
    context.stroke();
}

// Draw paddles
function drawPaddle(paddle) {
    context.fillStyle = "#fff";
    context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Draw ball
function drawBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = "#f5a623";
    context.fill();
    context.closePath();
}

// Move paddles
function movePaddles() {
    // Player paddle control
    if (upPressed && playerPaddle.y > 0) {
        playerPaddle.y -= playerPaddle.dy;
    }
    if (downPressed && playerPaddle.y < canvas.height - paddleHeight) {
        playerPaddle.y += playerPaddle.dy;
    }

    // AI paddle control
    if (ball.y < aiPaddle.y + paddleHeight / 2) {
        aiPaddle.y -= aiPaddle.dy;
    } else if (ball.y > aiPaddle.y + paddleHeight / 2) {
        aiPaddle.y += aiPaddle.dy;
    }
}

// Move ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (top/bottom)
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Paddle collision
    if (ball.x - ball.radius < playerPaddle.x + paddleWidth && 
        ball.y > playerPaddle.y && 
        ball.y < playerPaddle.y + paddleHeight) {
        ball.dx *= -1;
        hitSound.play();
        ball.speed += 0.2; // Increase speed after each hit
    }

    if (ball.x + ball.radius > aiPaddle.x && 
        ball.y > aiPaddle.y && 
        ball.y < aiPaddle.y + paddleHeight) {
        ball.dx *= -1;
        hitSound.play();
        ball.speed += 0.2; // Increase speed after each hit
    }

    // Left/right wall collision
    if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        loseSound.play();
        updateScore();
        resetBall();
    } else if (ball.x - ball.radius < 0) {
        aiScore++;
        loseSound.play();
        updateScore();
        resetBall();
    }
}

// Reset ball position and speed
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 4;
    ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Update the score display
function updateScore() {
    document.getElementById("playerScore").innerText = `Player: ${playerScore}`;
    document.getElementById("aiScore").innerText = `AI: ${aiScore}`;
}

// Handle key presses
let upPressed = false;
let downPressed = false;
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp") {
        upPressed = true;
    } else if (event.key === "ArrowDown") {
        downPressed = true;
    }
});
document.addEventListener("keyup", function(event) {
    if (event.key === "ArrowUp") {
        upPressed = false;
    } else if (event.key === "ArrowDown") {
        downPressed = false;
    }
});

// Pause button functionality
document.getElementById("pauseButton").addEventListener("click", function() {
    gamePaused = !gamePaused;
    if (gamePaused) {
        bgm.pause();
    } else {
        bgm.play();
    }
});

// Game loop
function gameLoop() {
    if (!gamePaused) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        drawCourtLines();
        drawPaddle(playerPaddle);
        drawPaddle(aiPaddle);
        drawBall();
        movePaddles();
        moveBall();
    }

    requestAnimationFrame(gameLoop);
}

// Start the game
document.getElementById("startButton").addEventListener("click", function() {
    document.getElementById("startScreen").style.display = "none";
    bgm.play(); // Start background music
    gameLoop();
});
function enableTouchControls() {
    const canvas = document.getElementById("pongCanvas");

    // Handle touch movement
    canvas.addEventListener("touchmove", function(event) {
        const touch = event.touches[0];
        const touchY = touch.clientY - canvas.getBoundingClientRect().top;
        
        // Move player's paddle based on touch position
        playerPaddle.y = touchY - playerPaddle.height / 2;
        
        // Ensure paddle stays within the canvas bounds
        if (playerPaddle.y < 0) {
            playerPaddle.y = 0;
        } else if (playerPaddle.y + playerPaddle.height > canvas.height) {
            playerPaddle.y = canvas.height - playerPaddle.height;
        }

        event.preventDefault(); // Prevent scrolling while playing
    });
}
// Enable touch controls after setting up the game
enableTouchControls();