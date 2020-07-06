const canvas = document.getElementById("canvasId");

canvas.width = "1000";
canvas.height = "500";

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const topCanvas = canvas.offsetTop;

const ctx = canvas.getContext("2d");

const paddleWidth = 30;
const paddleHeight = 100;

let playerX = 70;
let playerY = canvasHeight / 2 - paddleHeight / 2;

let aiX = canvasWidth - 70 - paddleWidth;
let aiY = canvasHeight / 2 - paddleHeight / 2;

let ballSize = 20;
let ballX = canvasWidth / 2 - ballSize / 2;
let ballY = canvasHeight / 2 - ballSize / 2;

ballX = Math.floor(Math.random() * 10) + 495;
ballY = Math.floor(Math.random() * 10) + 250;

let ballSpeedX;
let ballSpeedY;

const random = Math.random() * 2;
console.log(random);

if (random > 0 && random < 0.5) {
  ballSpeedX = Math.floor(Math.random() * 3) + 7;
  ballSpeedY = Math.floor(Math.random() * 3) + 5;
} else if (random >= 0.5 && random < 1.0) {
  ballSpeedX = Math.floor(Math.random() * -3) - 7;
  ballSpeedY = Math.floor(Math.random() * -3) - 5;
} else if (random >= 1.0 && random < 1.5) {
  ballSpeedX = Math.floor(Math.random() * 3) + 7;
  ballSpeedY = Math.floor(Math.random() * -3) - 5;
} else {
  ballSpeedX = Math.floor(Math.random() * 3) - 7;
  ballSpeedY = Math.floor(Math.random() * 3) + 5;
}

let resultHum = 0;
let resultAi = 0;

let behindPaddle;

function board() {
  ctx.fillStyle = "#586785";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawMiddleLines() {
  let heightLine = 10;
  let widthLine = 10;
  ctx.fillStyle = "#999999";
  for (let i = 0; i < canvasHeight; i += 50) {
    ctx.fillRect(canvasWidth / 2 - 5, 10 + i, 10, 20);
  }
}

function drawPlayer() {
  ctx.fillStyle = "#448844";
  ctx.fillRect(playerX, playerY, paddleWidth, paddleHeight);
}

function movePaddleAi() {
  /*if (ballX >= canvasWidth / 2)
        if (ballY + ballSize > aiY + paddleHeight)
            aiY += 12;
        else if (ballY < aiY)
        aiY -= 12;
    else if (ballX <= canvasWidth / 2)
        if (ballY + ballSize > aiY + paddleHeight)
            aiY += 12;
        else if (ballY < aiY)
        aiY -= 12;*/

  if (ballX >= canvasWidth / 2) {
    if (ballY + ballSize > aiY + paddleHeight) aiY += 8;
    else if (ballY < aiY) aiY -= 8;
  } else if (ballX < canvasWidth / 2 && ballX >= 300) {
    if (aiY - canvasHeight / 2 < -9) aiY += 5;
    else if (aiY - canvasHeight / 2 >= 10) aiY -= 5;
    else {
      if (aiY - canvasHeight / 2 < -5) aiY += 2;
      else if (aiY - canvasHeight / 2 >= 0) aiY -= 2;
    }

    // wersja przesuwająca sie caly czas za pilka, jest ok
    //if (ballY + ballSize > aiY + paddleHeight) aiY += 6;
    //else if (ballY < aiY) aiY -= 6;
  }

  let middlePaddle = aiY + paddleHeight / 2;
  let middleBall = ballY + ballSize / 2;
}

function drawAi() {
  ctx.fillStyle = "#886644";
  ctx.fillRect(aiX, aiY, paddleWidth, paddleHeight);
}

function accelerateBall() {
  console.log("accelerate");
  // if (ballSpeedX > 0 && ballSpeedX < 16)
  if (ballSpeedX < 16) {
    ballSpeedX *= 1.011;
    ballSpeedY *= 1.007;
  }

  console.log("ballSpeed X =" + ballSpeedX + "  ballspeedY = " + ballSpeedY);
  //  if (ballSpeedX > -16 && ballSpeedY < 0)
  //  ballSpeedX *= 1.25;
}

function updateScoreHuman() {
  const humanResult = document.querySelector("h3");
  humanResult.textContent = `Player: ${++resultHum}`;

  //console.log(aiResult);
}

function updateScoreAi() {
  const aiResult = document.querySelector("h3:nth-child(2)");
  aiResult.textContent = `AI: ${++resultAi}`;
}

function drawBall() {
  behindPaddle = false;
  ctx.fillStyle = "#BBBBBB";
  ctx.fillRect(ballX, ballY, ballSize, ballSize);
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX <= playerX) {
    console.log("behind paddle human");
    behindPaddle = true;
    ballSpeedX = 0;
    ballSpeedY = 0;
    updateScoreAi();
  } else if (ballX + ballSize >= aiX + paddleWidth) {
    behindPaddle = true;
    ballSpeedX = 0;
    ballSpeedY = 0;
    updateScoreHuman();
    console.log("behind paddle ai");
  }

  if (ballY + 10 <= 0 || ballY + ballSize >= canvasHeight) {
    ballSpeedY = -ballSpeedY;
    accelerateBall();
  }

  if (!behindPaddle) {
    if (
      (ballX <= 0 + playerX + paddleWidth &&
        ballY + ballSize >= playerY &&
        ballY <= playerY + paddleHeight) ||
      (ballX + ballSize >= aiX &&
        ballY + ballSize >= aiY &&
        ballY <= aiY + paddleHeight)
    ) {
      ballSpeedX = -ballSpeedX;
      accelerateBall();
    }
  }
}

function movePaddle(event) {
  canvas.addEventListener("keypress", function (event) {
    if (event.keyCode == "38") {
      // up arrow
      playerY += 10;
      console.log("klawup");
    } else if (event.keyCode == "40") {
      // down arrow
      playerY -= 10;
      console.log("klawdown");
    }
  });
}

canvas.addEventListener("mousemove", movePaddleByMouse);

function movePaddleByMouse(event) {
  playerY = event.clientY - topCanvas - paddleHeight / 2;

  if (playerY < 0) playerY = 0;
  else if (playerY + paddleHeight > canvasHeight)
    playerY = canvasHeight - paddleHeight;
}

function resetGame() {
  /*let playerX = 70;
    let playerY = canvasHeight / 2 - paddleHeight / 2;

    let aiX = canvasWidth - 70 - paddleWidth;
    let aiY = canvasHeight / 2 - paddleHeight / 2;

    let ballSize = 20;
    let ballX = canvasWidth / 2 - ballSize / 2;
    let ballY = canvasHeight / 2 - ballSize / 2;
    let ballSpeedX = 10;
    let ballSpeedY = 10;

    let resultHum = 0;
    let resultAi = 0;
    behindPaddle = false;*/
  resetButton.style.cursor = "none";
  nextGameButton.style.cursor = "none";
  nextGameButton.classList.toggle("green");
  resetButton.classList.toggle("red");
  location = location;
}

function nextGame() {
  ballX = Math.floor(Math.random() * 10) + 495;
  ballY = Math.floor(Math.random() * 10) + 250;
  const random = Math.random() * 2;
  if (random > 0 && random < 0.5) {
    ballSpeedX = Math.floor(Math.random() * 3) + 7;
    ballSpeedY = Math.floor(Math.random() * 3) + 5;
  } else if (random >= 0.5 && random < 1.0) {
    ballSpeedX = Math.floor(Math.random() * -3) - 7;
    ballSpeedY = Math.floor(Math.random() * -3) - 5;
  } else if (random >= 1.0 && random < 1.5) {
    ballSpeedX = Math.floor(Math.random() * 3) + 7;
    ballSpeedY = Math.floor(Math.random() * -3) - 5;
  } else {
    ballSpeedX = Math.floor(Math.random() * 3) - 7;
    ballSpeedY = Math.floor(Math.random() * 3) + 5;
  }

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  behindPaddle = false;
  resetButton.style.cursor = "none";
  nextGameButton.style.cursor = "none";
  nextGameButton.classList.toggle("green");
  resetButton.classList.toggle("red");
  refreshAnimation();
}

const resetButton = document.querySelector("h3:nth-child(4)");
const nextGameButton = document.querySelector("h3:nth-child(3)");

resetButton.addEventListener("click", resetGame);
console.log(resetButton);

nextGameButton.addEventListener("click", nextGame);
console.log(nextGameButton);

function refreshAnimation() {
  if (!behindPaddle) {
    board();
    drawMiddleLines();
    drawPlayer();
    drawAi();
    drawBall();
    movePaddle();
    movePaddleAi();
  } else {
    resetButton.style.cursor = "pointer";
    nextGameButton.style.cursor = "pointer";
    nextGameButton.classList.add("green");
    resetButton.classList.add("red");
    clearInterval(refreshAnimation);
  }
}

setInterval(refreshAnimation, 1000 / 60);
