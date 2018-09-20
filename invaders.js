var currentcanvas = document.getElementById('gameCanvas');
var currentcanvasctx = currentcanvas.getContext('2d');
var backbody = document.body.cloneNode("gameCanvas");
var backbuffer = backbody.children.gameCanvas
var canvasctx = backbuffer.getContext('2d');
var start = null;
var lastBullet = null;
var alienLastBullet = null;
var planet = {
  image: document.getElementById("saturn"),
  x: 150,
  y: 750
}
var button = document.createElement("Button");
var alienmove = document.getElementById('alienmove');
var alienshoot = document.getElementById('alienshoot');
var playershoot = document.getElementById('playershoot');
var backgroundimg = [
  'mars.png',
  'jupiter.png',
  'moon.png',
  'pluto.png',
  'saturn.png',
  'asteroid.png',
  'comet.png'
]
var stars = [];
var shipX = 300;
var shipY = 650;
var minY = 500;
var bullets = [];
var alienBullets = [];
var aliens = [];
var alienX = 0;
var alienXChange = -.02;
var speed = 1;
var alienY = 50;
var alienNewY = 50;
var alienArm = 0;
var armChange = -.01;
var canvasX = 500;
var canvasY = 700;
var currentInput = {
  space: false,
  left: false,
  right: false,
  up: false,
  down: false
}
var score = 0;
var lives = 3;
var play = true;
var gameover = false;
var restart = false;
function drawAlien1up(x,y) {
  canvasctx.fillStyle = '#BBBBFF';
  canvasctx.strokeStyle = '#000066'
  canvasctx.beginPath();
  canvasctx.arc(x, y, 10, 0, Math.PI, true);
  canvasctx.lineTo(x-10, y+5);
  canvasctx.lineTo(x-15, y+ 5 + alienArm);
  canvasctx.lineTo(x-15, y+ 8 + alienArm);
  canvasctx.lineTo(x-10, y+8);
  canvasctx.lineTo(x-10, y+9);
  canvasctx.lineTo(x+10, y+9);
  canvasctx.lineTo(x+10, y+8);
  canvasctx.lineTo(x+15, y + 8 + alienArm);
  canvasctx.lineTo(x+15, y + 5 + alienArm);
  canvasctx.lineTo(x+10, y+5);
  canvasctx.closePath();
  canvasctx.fill();
  canvasctx.stroke();
  canvasctx.fillStyle = '#000000';
  canvasctx.fillRect(x-5, y - (alienArm * 0.2), 3,3);
  canvasctx.fillRect(x+2, y - (alienArm * 0.2), 3,3);
}

function drawShip(x,y) {
  canvasctx.beginPath();
  canvasctx.moveTo(x,y);
  canvasctx.lineTo((x+10),(y+24));
  canvasctx.lineTo(x,(y+18));
  canvasctx.lineTo((x-10),(y+24));
  canvasctx.fill();
}

function drawBullet(x,y) {
  canvasctx.fillStyle = 'white';
  canvasctx.beginPath();
  canvasctx.moveTo(shipX,shipY);
  canvasctx.lineTo((shipX+10),(shipY+24));
  canvasctx.lineTo(shipX,(shipY+18));
  canvasctx.lineTo((shipX-10),(shipY+24));
  canvasctx.fill();
}

function pause() {
  play = !(play);
  if (restart) {
    window.location.reload(false);
  }
  else if (gameover) {
    restart = true;
    GameOverButton();
  }
  else if (play) {
    pauseButton();
    window.requestAnimationFrame(loop);
    button.blur();
  } else {
    playButton();
  }
}

function pauseButton() {
  button.style.fontSize = "12px";
  button.style.border = "1px solid white";
  button.style.backgroundColor = "black";
  button.style.color = "white";
  button.style.position = "absolute";
  button.style.left = (currentcanvas.getBoundingClientRect().x + canvasX - 30) + "px";
  button.style.top = (currentcanvas.getBoundingClientRect().y + 15) + "px";
  button.textContent = "I I";
}
function GameOverButton() {
  button.style.fontSize = "25px";
  button.style.border = "1px solid white";
  button.style.backgroundColor = "aqua";
  button.style.color = "white";
  button.style.position = "absolute";
  button.style.left = (currentcanvas.getBoundingClientRect().x + (canvasX/2) - 50) + "px";
  button.style.top = (currentcanvas.getBoundingClientRect().y + (canvasY/2) - 15) + "px";
  button.textContent = "Restart";
}

function playButton() {
  button.style.fontSize = "25px";
  button.style.border = "1px solid white";
  button.style.backgroundColor = "aqua";
  button.style.color = "white";
  button.style.position = "absolute";
  button.style.left = (currentcanvas.getBoundingClientRect().x + (canvasX/2) - 50) + "px";
  button.style.top = (currentcanvas.getBoundingClientRect().y + (canvasY/2) - 15) + "px";
  button.textContent = "Continue";
}

function resetAliens() {
  for (i=0; i < 8; i++) {
    aliens[i] = i*60 + 50;
  }
  speed = 1;
  alienX = 0;
  alienY = -30;
  alienNewY = -30;
}

function handleKeydown(event) {
  switch(event.key) {
    case ' ':
      currentInput.space = true;
      break;
    case 'ArrowLeft':
    case 'a':
      currentInput.left = true;
      break;
    case 'ArrowRight':
    case 'd':
      currentInput.right = true;
      break;
    case 'ArrowUp':
    case 'w':
      currentInput.up = true;
      break;
    case 'ArrowDown':
    case 's':
      currentInput.down = true;
      break;
  }
}
window.addEventListener('keydown', handleKeydown);

function handleKeyup(event) {
  switch(event.key) {
    case ' ':
      currentInput.space = false;
      break;
    case 'ArrowLeft':
    case 'a':
      currentInput.left = false;
      break;
    case 'ArrowRight':
    case 'd':
      currentInput.right = false;
      break;
    case 'ArrowUp':
    case 'w':
      currentInput.up = false;
      break;
    case 'ArrowDown':
    case 's':
      currentInput.down = false;
      break;
  }
}
window.addEventListener('keyup', handleKeyup);

function update(elapsedTime, elapsedBullet, elapsedAlienBullet, timestamp) {

  alienArm += armChange * elapsedTime;
  if (Math.abs(alienArm) > 5 ) {
    armChange = 0 - armChange;
  }

  if (elapsedAlienBullet > 200) {
    alienfire = Math.random();
    if (alienfire + (0.01 * speed) > 0.95) {
      alienfire = Math.random() * aliens.length;
      nx = aliens[(Math.floor(alienfire))] + alienX;
      newBullet = [nx,alienY];
      alienBullets.push(newBullet);
      if (alienshoot.paused) {
          alienshoot.play();
      }else{
          alienshoot.currentTime = 0
      }
    }
    alienLastBullet = timestamp;
  }
  alienX += alienXChange * elapsedTime * speed;
  if (alienY < alienNewY) {alienY += elapsedTime * 0.05};
  if (aliens[0] + alienX < 15 || aliens[aliens.length - 1] + alienX > 485) {
    alienXChange = 0 - alienXChange;
    alienNewY +=20;
    //alienmove.play();
  }
  if (planet.y > canvasY) {
    planet.y = 0 - canvasY;
    planet.x = Math.floor(Math.random() * canvasX) - (0.4 * canvasX);
    planet.image.src = 'img/' + backgroundimg[(Math.floor(Math.random() * backgroundimg.length))];
  } else {
    planet.y += 0.08 * elapsedTime;
  }
  if(currentInput.left) {
    shipX -= 0.2 * elapsedTime;
  }
  if(currentInput.space && elapsedBullet > 500) {
    var newBullet = [shipX,shipY];
    bullets.push(newBullet);
    lastBullet = timestamp;
    if (playershoot.paused) {
        playershoot.play();
    }else{
        playershoot.currentTime = 0
    }
  }
  if(currentInput.right) {
    shipX += 0.2 * elapsedTime;
  }
  if(currentInput.up) {
    shipY -= 0.2 * elapsedTime;
  }
  if(currentInput.down) {
    shipY += 0.2 * elapsedTime;
  }
  var tempbullets = [];
  while (bullets.length) {
    var bullet = bullets.pop();
    bullet[1] -= .5 * elapsedTime;
    if (alienY - bullet[1] > -9 && alienY - bullet[1] < 10) {
      for (i = 0; i < aliens.length; i++) {
        if (Math.abs(aliens[i] + alienX - bullet[0]) < 15) {
          aliens.splice(i,1);
          i--;
          speed *=1.5;
          score += 25 * (Math.floor(speed / 5) + 1);
        }
        else {
          tempbullets.push(bullet);
        }
      }
    }
    else if (bullet[1] > 0) {
      tempbullets.push(bullet);
    }
  }
  if (alienY > canvasY - 30) {
    gameover = true;
  }
  bullets = tempbullets;
  tempbullets = [];
  while (alienBullets.length) {
    var bullet = alienBullets.pop();
    bullet[1] += .5 * elapsedTime;
    if (Math.abs(bullet[0] - shipX) < 10 && Math.abs(bullet[1] - (shipY + 12)) < 12) {
      lives --;
      if (lives < 1) {
        gameover = true;
      }
    }
    else if (bullet[1] < canvasY) {
      tempbullets.push(bullet);
    }
  }
  alienBullets = tempbullets;
  for (i=0; i<25; i++) {
    stars[i][1] += 0.05 * elapsedTime;
    if (stars[i][1] > canvasY) {
      stars[i][1] = 0 - (2 * (stars[i][2]));
      stars[i][0] = Math.floor((Math.random() * 500)) + 1;
    }
  }

  shipX = Math.max(shipX, 10);
  shipX = Math.min(shipX, canvasX - 10);
  shipY = Math.max(shipY, minY);
  shipY = Math.min(shipY, (canvasY - 30));

  if (gameover) {
    pause();
  }
}

function render() {
  canvasctx.clearRect(0, 0, currentcanvas.width, currentcanvas.height);
  canvasctx.fillStyle = 'white';
  for (i=0; i<25; i++) {
    canvasctx.beginPath();
    canvasctx.arc(stars[i][0],stars[i][1],stars[i][2], 0, Math.PI * 2, true);
    canvasctx.fill();
  }
  canvasctx.drawImage(planet.image,planet.x, planet.y);
  canvasctx.fillStyle = 'red';
  drawShip(shipX,shipY);
  canvasctx.fillStyle = 'white';
  for (i = 0; i < bullets.length; i++)  {
    canvasctx.fillRect(bullets[i][0], bullets[i][1], 4, 4);
  }

  for (i=0; i < aliens.length; i++) {
    drawAlien1up(aliens[i] + alienX,alienY);
  }
  canvasctx.fillStyle = 'white';
  for (i = 0; i < alienBullets.length; i++)  {
    canvasctx.fillRect(alienBullets[i][0], alienBullets[i][1], 4, 4);
  }
  for (i = 0; i < lives; i++) {
    drawShip((canvasX - 50 - (i * 30)), 10);
  }
  canvasctx.fillStyle = 'white';
  canvasctx.font = '20px sans-serif';
  canvasctx.fillText('Score: ' + score, 10, 30);
  if (aliens.length < 1) {
    resetAliens();
  }
}

function loop(timestamp) {
  if(!start) start = timestamp;
  var elapsedTime = Math.min(timestamp - start,60);
  if(!lastBullet) lastBullet = timestamp;
  var elapsedBullet = timestamp - lastBullet;
  if(!alienLastBullet) alienLastBullet = timestamp;
  var elapsedAlienBullet = timestamp - alienLastBullet;
  start = timestamp;
  update(elapsedTime, elapsedBullet, elapsedAlienBullet, timestamp,);
  render();
  currentcanvasctx.clearRect(0,0,currentcanvas.width, currentcanvas.height);
  currentcanvasctx.drawImage(backbuffer, 0, 0);

  if (play) {
    window.requestAnimationFrame(loop);
  }
}

for (i=0; i < 25; i++) {
  var star = [(Math.floor((Math.random() * canvasX) + 1)),(Math.floor((Math.random() * canvasY) + 1)),(Math.floor((Math.random() * 5) + 1))]
  stars.push(star);
}
resetAliens();
pauseButton();
button.addEventListener('click', function(event) {
    event.preventDefault();
    pause();
  });
document.body.appendChild(button);
window.requestAnimationFrame(loop);
