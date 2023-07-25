import Collision from "./collision.js";
import { getRotationAngle, rotateVector } from "./vectors.js";

let allBridges = document.getElementsByClassName('bridge');
let allCannons = document.getElementsByClassName('cannon');
let allBalls = document.getElementsByClassName('ball');
let allRocks = document.getElementsByClassName('rock');
let chest = document.getElementById('chest');
let player = document.getElementById('player');
let gameArea = document.getElementById('gameArea');

const playerStartPosition = {x:player.offsetLeft, y:player.offsetTop};

//game state
let running = false;
let lastFrameTime = undefined;
let lastShootTime = performance.now();
player.currentPosition = undefined;

//

document.getElementById('startButton')
  .addEventListener('click', () =>  {
    if (running)
      return;

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
    running = true;
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
    endGame('You made it!! Congratulations!');
    return;
  }

  if (!Collision.collideAny([player], allBridges, 21))
  {
    endGame('Oops!! You fell into the water.');
    return;
  }

  if (Collision.collideAny([player], allRocks, 20, 10))
  {
    endGame('You cracked your head on the stone. Try again.');
    return;
  }

  if (Collision.collideAny([player], allBalls, 10, 0))
  {
    endGame('Ugh!! This cannon hurts.');
    return;
  }

  if (player.offsetLeft > gameArea.clientWidth)
  {
    endGame('To infinity and beyond... Try again.');
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
      ball.currentPosition = [ball.offsetLeft, ball.offsetTop];

    let displacement = speed * deltaTime / 1000;
    ball.currentPosition[0] += ball.direction[0] * displacement;
    ball.currentPosition[1] += ball.direction[1] * displacement;
    ball.style.left = ball.currentPosition[0] + 'px';
    ball.style.top = ball.currentPosition[1] + 'px';
  }
}

function removeOldBalls()
{
  const ballsToRemove = [];

  for(const ball of allBalls)
  {
    if (!Collision.collide(ball, gameArea) || Collision.collideAny([ball], allRocks, 0, 10))
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
      let angle = getRotationAngle(cannon);
      let direction = rotateVector([0, -1], angle);
      direction[1] *= -1;

      let template = document.createElement('template');
      template.innerHTML = '<img class="ball" src="./images/ball.png" width="26px" height="26px"/>';
      let ball = template.content.firstChild;
      gameArea.appendChild(ball);

      ball.direction = direction;

      const centralize = [(cannon.clientWidth - ball.clientWidth)/2, (cannon.clientHeight - ball.clientHeight)/2];
      const offsetY = cannon.clientHeight/2 + ball.clientHeight/2;
      const rotatedOffset = rotateVector([0, -offsetY], angle);
      rotatedOffset[1] *= -1;
      ball.style.left = cannon.offsetLeft + centralize[0] + rotatedOffset[0] + 'px';
      ball.style.top = cannon.offsetTop + centralize[1] + rotatedOffset[1] + 'px';

    }
  }
}

function endGame(message)
{
  player.src = "./images/player_stop.png";

  setTimeout(() => {
    alert(message);
    running = false;

    player.style.left = playerStartPosition.x + 'px';
    player.style.top = playerStartPosition.y + 'px';

    const ballsToRemove = [...allBalls];
    ballsToRemove.forEach(ball => ball.remove());

  }, 100);
}

