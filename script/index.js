import Collision from "./collision.js";

const allBridges = document.getElementsByClassName('bridge');
const allCannons = document.getElementsByClassName('cannon');
const allBalls = document.getElementsByClassName('ball');
const allRocks = document.getElementsByClassName('rock');
const chest = document.getElementById('chest');
const player = document.getElementById('player');
const gameArea = document.getElementById('gameArea');

let lastFrameTime = undefined;

function animationLoop(timestamp)
{
  if (lastFrameTime === undefined)
  {
    lastFrameTime = timestamp;
    player.src = "./images/player.gif"
  }

  const deltaTime = timestamp - lastFrameTime;
  lastFrameTime = timestamp;

  //spawns
  shootCannon(timestamp);

  //movements
  movePlayer(deltaTime);

  moveBalls(deltaTime);
  removeOldBalls();

  //collisions
  player.remove();
  gameArea.appendChild(player);
  
  if(Collision.collide(player, chest, 10))
  {
    endGame('Parabéns!! Vocé venceu!');
    return;
  }

  if (!Collision.collideAny([player], allBridges, 21))
  {
    endGame('Ops!! Caiu na água.');
    return;
  }

  if (Collision.collideAny([player], allRocks, 20, 10))
  {
    endGame('Rachou a cuca na pedra. Tente novamente.');
    return;
  }

  if (Collision.collideAny([player], allBalls, 10, 0))
  {
    endGame('Uii!! Esse canhão machuca.');
    return;
  }

  requestAnimationFrame(animationLoop);
}

function movePlayer(deltaTime)
{
  const speed = 100; //px/s

  if (player.currentPosition === undefined)
    player.currentPosition = player.offsetLeft;

  player.currentPosition += speed * deltaTime / 1000;
  player.style.left = player.currentPosition + 'px';
}

function moveBalls(deltaTime)
{
  const speed = 200; //px/s

  for(const ball of allBalls)
  {
    if (ball.currentPosition === undefined)
      ball.currentPosition = ball.offsetTop;

    ball.currentPosition += speed * deltaTime / 1000;
    ball.style.top = ball.currentPosition + 'px';
  }
}

function removeOldBalls()
{
  const ballsToRemove = [];

  for(const ball of allBalls)
  {
    if (ball.currentPosition > gameArea.clientHeight || Collision.collideAny([ball], allRocks, 0, 10))
      ballsToRemove.push(ball);
  }

  ballsToRemove.forEach(ball => ball.remove());  
}

let lastShootTime = performance.now();
function shootCannon(timestamp)
{
  const cannonInterval = 600; //ms

  if(lastShootTime + cannonInterval < timestamp)
  {
    lastShootTime = timestamp;

    for(const cannon of allCannons)
    {
      let template = document.createElement('template');
      template.innerHTML = '<img class="ball" src="./images/ball.png"/>';
      let ball = template.content.firstChild;
      ball.style.top = cannon.offsetTop + 50 + 'px';
      ball.style.left = cannon.offsetLeft + 11 + 'px';
      gameArea.appendChild(ball);
    }

  }
}

function endGame(message)
{
  player.src = "./images/player_stop.png";
  setTimeout(() => {
    alert(message);
    history.go(0);
  }, 100);
}

document.getElementById('startButton')
  .addEventListener('click', () =>  requestAnimationFrame(animationLoop));

