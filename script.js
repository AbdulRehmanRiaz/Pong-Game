// Initialize canvas
var gameCanvas = document.getElementById("canvas");
var context = gameCanvas.getContext("2d");

var beginButton = document.getElementById("start-btn");
var pauseButton = document.getElementById("pause-btn");
var restartButton = document.getElementById("restart-btn");
var animationRequestId;
var isGameRunning = false;

beginButton.addEventListener("click", function() {
  if (!isGameRunning) {
    isGameRunning = true;
    gameLoop();
  }
});

pauseButton.addEventListener("click", function() {
  isGameRunning = false;
  cancelAnimationFrame(animationRequestId);
});

restartButton.addEventListener("click", function() {
  document.location.reload();
});

addEventListener("load", (event) => {
  renderGameObjects();
});

// Define ball properties
var ballDiameter = 10;
var ballPositionX = gameCanvas.width / 2;
var ballPositionY = gameCanvas.height / 2;
var ballSpeedHorizontal = 5;
var ballSpeedVertical = 5;

// Define paddle properties
var paddleHeightValue = 80;
var paddleWidthValue = 10;
var leftPaddleTop = gameCanvas.height / 2 - paddleHeightValue / 2;
var rightPaddleTop = gameCanvas.height / 2 - paddleHeightValue / 2;
var paddleMoveSpeed = 10;

// Define score properties
var leftPlayerPoints = 0;
var rightPlayerPoints = 0;
var maxPointsToWin = 10;

// Listen for keyboard events
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

// Handle key press
var upArrowPressed = false;
var downArrowPressed = false;
let wKeyPressed = false;
let sKeyPressed = false;

function handleKeyDown(e) {
  if (e.key === "ArrowUp") {
    upArrowPressed = true;
  } else if (e.key === "ArrowDown") {
    downArrowPressed = true;
  } else if (e.key === "w") {
    wKeyPressed = true;
  } else if (e.key === "s") {
    sKeyPressed = true;
  }
}

function handleKeyUp(e) {
  if (e.key === "ArrowUp") {
    upArrowPressed = false;
  } else if (e.key === "ArrowDown") {
    downArrowPressed = false;
  } else if (e.key === "w") {
    wKeyPressed = false;
  } else if (e.key === "s") {
    sKeyPressed = false;
  }
}

// Update game state
function updateGameState() {
  // Move paddles
  if (upArrowPressed && rightPaddleTop > 0) {
    rightPaddleTop -= paddleMoveSpeed;
  } else if (downArrowPressed && rightPaddleTop + paddleHeightValue < gameCanvas.height) {
    rightPaddleTop += paddleMoveSpeed;
  }

  // Move right paddle based on "w" and "s" keys
  if (wKeyPressed && leftPaddleTop > 0) {
    leftPaddleTop -= paddleMoveSpeed;
  } else if (sKeyPressed && leftPaddleTop + paddleHeightValue < gameCanvas.height) {
    leftPaddleTop += paddleMoveSpeed;
  }

 
  // Move right paddle automatically based on ball position or comment it for second player to play
if (ballPositionY > rightPaddleTop + paddleHeightValue / 2) {
  rightPaddleTop += paddleMoveSpeed;
} else if (ballPositionY < rightPaddleTop + paddleHeightValue / 2) {
  rightPaddleTop -= paddleMoveSpeed;
}


  // Move ball
  ballPositionX += ballSpeedHorizontal;
  ballPositionY += ballSpeedVertical;

  // Check ball collisions with canvas boundaries
  if (ballPositionY - ballDiameter < 0 || ballPositionY + ballDiameter > gameCanvas.height) {
    ballSpeedVertical = -ballSpeedVertical;
  }

  // Check ball collisions with left paddle
  if (
    ballPositionX - ballDiameter < paddleWidthValue &&
    ballPositionY > leftPaddleTop &&
    ballPositionY < leftPaddleTop + paddleHeightValue
  ) {
    ballSpeedHorizontal = -ballSpeedHorizontal;
  }

  // Check ball collisions with right paddle
  if (
    ballPositionX + ballDiameter > gameCanvas.width - paddleWidthValue &&
    ballPositionY > rightPaddleTop &&
    ballPositionY < rightPaddleTop + paddleHeightValue
  ) {
    ballSpeedHorizontal = -ballSpeedHorizontal;
  }

  // Check if ball goes out of bounds on left or right side of canvas
  if (ballPositionX < 0) {
    rightPlayerPoints++;
    resetBallPosition();
  } else if (ballPositionX > gameCanvas.width) {
    leftPlayerPoints++;
    resetBallPosition();
  }

  // Check if a player has won
  if (leftPlayerPoints === maxPointsToWin) {
    displayWinMessage("Left player");
  } else if (rightPlayerPoints === maxPointsToWin) {
    displayWinMessage("Right player");
  }
}

function displayWinMessage(player) {
  var message = "Congratulations! " + player + " wins!";
  $('#message').text(message);
  $('#message-modal').modal('show');
  resetBallPosition();
}

// Reset ball to center of screen
function resetBallPosition() {
  ballPositionX = gameCanvas.width / 2;
  ballPositionY = gameCanvas.height / 2;
  ballSpeedHorizontal = -ballSpeedHorizontal;
  ballSpeedVertical = Math.random() * 10 - 5;
}

// Draw objects on canvas
function renderGameObjects() {
  // Clear canvas
  context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  context.fillStyle = "#FFF";
  context.font = "16px Arial";

  context.beginPath();
  context.moveTo(gameCanvas.width / 2, 0);
  context.lineTo(gameCanvas.width / 2, gameCanvas.height);
  context.strokeStyle = "#FFF";
  context.stroke();
  context.closePath();

  // Draw ball
  context.beginPath();
  context.arc(ballPositionX, ballPositionY, ballDiameter / 2, 0, Math.PI * 2);
  context.fillStyle = "#FFf";
  context.fill();
  context.closePath();

  // Draw left paddle
  context.fillStyle = "#FFA500";
  context.fillRect(0, leftPaddleTop, paddleWidthValue, paddleHeightValue);

  // Draw right paddle
  context.fillStyle = "#0000FF";
  context.fillRect(gameCanvas.width - paddleWidthValue, rightPaddleTop, paddleWidthValue, paddleHeightValue);

  // Draw scores
  context.fillStyle = "#FFF";
  context.fillText("Score: " + leftPlayerPoints, 10, 20);
  context.fillText("Score: " + rightPlayerPoints, gameCanvas.width - 70, 20);
}

// Game loop
function gameLoop() {
  updateGameState();
  renderGameObjects();
  animationRequestId = requestAnimationFrame(gameLoop);
}

$('#message-modal-close').on('click', function() {
  document.location.reload();
});
