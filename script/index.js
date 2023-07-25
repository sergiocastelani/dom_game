import Collision from "./collision.js";

let allBridges = document.getElementsByClassName('bridge');
let allCannons = document.getElementsByClassName('cannon');
let allBalls = document.getElementsByClassName('ball');
let allRocks = document.getElementsByClassName('rock');
let chest = document.getElementById('chest');
let player = document.getElementById('player');
let gameArea = document.getElementById('gameArea');

const playerStartPosition = {x:player.offsetLeft, y:player.offsetTop};

//game state
let lastFrameTime = undefined;
let lastShootTime = performance.now();
player.currentPosition = undefined;

//

document.getElementById('startButton')
  .addEventListener('click', () =>  {
    allBridges = document.getElementsByClassName('bridge');
    allCannons = document.getElementsByClassName('cannon');
    allBalls = document.getElementsByClassName('ball');
    allRocks = document.getElementsByClassName('rock');
    chest = document.getElementById('chest');
    player = document.getElementById('player');
    gameArea = document.getElementById('gameArea');

    //always the top most element
    if (! player)
    {
      gameArea.innerHTML += '<img id="player" src="./images/player_stop.png"/>';
      player = document.getElementById('player');
    }
    else
      gameArea.appendChild(player);

    lastFrameTime = undefined;
    lastShootTime = performance.now();
    player.currentPosition = undefined;
      
    requestAnimationFrame(animationLoop);
  });


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
  if(chest && Collision.collide(player, chest, 10))
  {
    endGame('Parabéns!! Você venceu!');
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

  if (player.offsetLeft > gameArea.clientWidth)
  {
    endGame('Ao infinito e além... Tente novamente.');
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

    player.style.left = playerStartPosition.x + 'px';
    player.style.top = playerStartPosition.y + 'px';

    const ballsToRemove = [...allBalls];
    ballsToRemove.forEach(ball => ball.remove());

  }, 100);
}

