//Create the renderer

let keyboard = function (keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function (event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function (event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener("keydown", key.downHandler.bind(key), false);
  window.addEventListener("keyup", key.upHandler.bind(key), false);
  return key;
};

const Container = PIXI.Container,
  autoDetectRenderer = PIXI.autoDetectRenderer,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  TextureCache = PIXI.utils.TextureCache,
  Graphics = PIXI.Graphics,
  Text = PIXI.Text,
  Texture = PIXI.Texture,
  Sprite = PIXI.Sprite;

//Create a container object called the `stage`

let scopeWidth = window.innerWidth;
let scopeHeight = window.innerHeight;
var stage = new Container(),
  renderer = autoDetectRenderer(scopeWidth, scopeHeight, {antialias: true, transparent: false, resolution: 1});

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

let snakeEl = 20;

let snakeWidth = Math.floor(scopeWidth / snakeEl);
let snakeHeight = Math.floor(scopeHeight / snakeEl);
let snakeLength = 10;
let state;
let direction = true;
let snakeContainer;
let snakeVx = 0;
let snakeVy = 0;

let warpStore = [];
let snakeStore = [];
let eatStore = [];

let warpContainer;
let eatContainer;
let scoreContainer;
let lostContainer;
let stopContainer;

let eatNum = 4;
let sumScore = 0;
let eatScore = 10;

let message;

let initSnakeStore = function () {
  snakeStore = Array.from({length: snakeLength}, function (n, i) {
    return [Math.floor((snakeWidth - snakeLength) / 2 + i) * snakeEl, Math.floor(snakeHeight / 2) * snakeEl];
  });
};

let initSnakeWarp = function () {
  let poi = [];
  poi.push([0, 0]);
  poi.push([0, snakeHeight * snakeEl]);
  poi.push([snakeWidth * snakeEl, snakeHeight * snakeEl]);
  poi.push([snakeWidth * snakeEl, 0]);
  warpStore.push([poi[0], poi[1]]);
  warpStore.push([poi[1], poi[2]]);
  warpStore.push([poi[2], poi[3]]);
  warpStore.push([poi[3], poi[0]]);
};

let snakeHeader = function (_snakeStore, direction) {
  return direction ? {
    start: _snakeStore[0],
    end: _snakeStore[1]
  } : {
    start: _snakeStore[_snakeStore.length - 1],
    end: _snakeStore[_snakeStore.length - 2]
  };
};

let snakeGraphics = function (_snakeStore, direction) {
  let lines = [];
  let vy;
  let vx;
  let i = 0;
  let _cP = {start: [], end: []};
  _cP.start = _snakeStore[i];
  i++;
  _cP.end = _snakeStore[i];
  i++;
  vy = _cP.end[1] - _cP.start[1];
  vx = _cP.end[0] - _cP.start[0];
  i++;
  while (i < _snakeStore.length) {
    if (_snakeStore[i][0] - _cP.end[0] != vx || _snakeStore[i][1] - _cP.end[1] != vy) {
      lines.push(_cP);
      _cP = {start: _cP.end, end: _snakeStore[i]};
      vy = _cP.end[1] - _cP.start[1];
      vx = _cP.end[0] - _cP.start[0];
    } else {
      _cP.end = _snakeStore[i];
    }
    i++;
  }
  lines.push(_cP);
  return {
    lines: lines,
    header: snakeHeader(_snakeStore, direction)
  };
};

let drawSnakeBody = function (snakeContainer, _snakeGraphics) {

  _snakeGraphics.lines.forEach(function (n) {
    let snakeSprite = new Graphics();
    snakeSprite.lineStyle(snakeEl, 0xccff99, 1);
    snakeSprite.moveTo(n.start[0], n.start[1]);
    snakeSprite.lineTo(n.end[0], n.end[1]);
    snakeContainer.addChild(snakeSprite);
  });
};

let drawSnakeHeader = function (snakeContainer, _snakeGraphics) {
  let snakeSprite = new Graphics();
  snakeSprite.lineStyle(snakeEl, 0xFF00000, 1);
  snakeSprite.moveTo(_snakeGraphics.header.start[0], _snakeGraphics.header.start[1]);
  snakeSprite.lineTo(_snakeGraphics.header.end[0], _snakeGraphics.header.end[1]);
  snakeContainer.addChild(snakeSprite);
};

let drawSnake = function () {
  if (snakeContainer) {
    stage.removeChild(snakeContainer);
    snakeContainer = null;
  }
  snakeContainer = new Container();
  let _snakeGraphics = snakeGraphics(snakeStore, direction);
  drawSnakeBody(snakeContainer, _snakeGraphics);
  drawSnakeHeader(snakeContainer, _snakeGraphics);
  stage.addChild(snakeContainer);
};

let drawWarp = function () {
  warpContainer = new Container();

  warpStore.forEach(function (n) {
    let warpSprite = new Graphics();
    warpSprite.lineStyle(10, 0xccff99, 1);
    warpSprite.moveTo(n[0][0], n[0][1]);
    warpSprite.lineTo(n[1][0], n[1][1]);
    warpContainer.addChild(warpSprite);
  });

  stage.addChild(warpContainer);
};

let drawSnakeScore = function () {
  if (scoreContainer) {
    stage.removeChild(scoreContainer);
    scoreContainer = null;
  }
  scoreContainer = new Container();
  message = new Text("Score : " + sumScore, {fontSize: '32px', fill: "white"});
  message.anchor.set(0.5, 0.5);
  message.position.set(snakeWidth / 2 * snakeEl, snakeEl + 20);
  scoreContainer.addChild(message);
  stage.addChild(scoreContainer);
};

let drawEat = function () {
  if (eatContainer) {
    stage.removeChild(eatContainer);
    eatContainer = null;
  }
  eatContainer = new Container();
  eatStore.forEach(function (n) {
    let eatSprite = new Graphics();
    eatSprite.lineStyle(1, 0xccff99, 1);
    eatSprite.beginFill(0xFF9933);
    eatSprite.drawRect(n[0] - snakeEl / 2, n[1] - snakeEl / 2, snakeEl, snakeEl);
    eatSprite.endFill();
    eatContainer.addChild(eatSprite);
  });
  stage.addChild(eatContainer);
};

let putEat = function () {
  while (eatStore.length < eatNum) {
    let added = false;
    do {
      let x = Math.floor((Math.random() * 0.8 + 0.1) * snakeWidth);
      let y = Math.floor((Math.random() * 0.8 + 0.1) * snakeHeight);
      let newEat = [x * snakeEl, y * snakeEl];

      if (!eatStore.findIndex(x => x[0] == newEat[0] && x[1] == newEat[1]) > -1 && !snakeStore.findIndex(x => x[0] == newEat[0] && x[1] == newEat[1]) > -1) {
        eatStore.push(newEat);
        added = true;
      }
    } while (!added);
  }
};

let delEat = function (eat) {
  let index = eatStore.findIndex(x => x[0] == eat[0] && x[1] == eat[1]);
  eatStore.splice(index, 1);
};

let setUp = function () {
  loadState();
  if (snakeStore.length == 0) {
    initSnakeStore();
  }
  initSnakeWarp();
  drawWarp();
  drawSnakeScore();
  drawSnake();
  putEat();
  drawEat();
  drawStop();
  //Capture the keyboard arrow keys

  var left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);

  //Left arrow key `press` method
  left.press = function () {

    //Change the cat's velocity when the key is pressed
    snakeVx = -snakeEl;
    snakeVy = 0;
  };

  //Left arrow key `release` method
  left.release = function () {

    //If the left arrow has been released, and the right arrow isn't down,
    //and the cat isn't moving vertically:
    //Stop the cat
    if (!right.isDown && snakeVy === 0) {
      // snakeVx = 0;
    }
  };

  //Up
  up.press = function () {
    snakeVy = -snakeEl;
    snakeVx = 0;
  };
  up.release = function () {
    if (!down.isDown && snakeVx === 0) {
      // snakeVy = 0;
    }
  };

  //Right
  right.press = function () {
    snakeVx = snakeEl;
    snakeVy = 0;
  };
  right.release = function () {
    if (!left.isDown && snakeVy === 0) {
      // snakeVx = 0;
    }
  };

  //Down
  down.press = function () {
    snakeVy = snakeEl;
    snakeVx = 0;
  };
  down.release = function () {
    if (!up.isDown && snakeVx === 0) {
      // snakeVy = 0;
    }
  };

  //Set the game state
  state = play;
  gameLoop();
};

let hitLost = function (snakeNext) {
  if (snakeNext[0] == 0 || snakeNext[0] == snakeWidth * snakeEl) {
    return true;
  }
  if (snakeNext[1] == 0 || snakeNext[1] == snakeHeight * snakeEl) {
    return true;
  }
  return snakeStore.findIndex(x => x[0] == snakeNext[0] && x[1] == snakeNext[1]) > -1;
};

let eatHit = function (snakeNext) {
  if (eatStore.findIndex(x => x[0] == snakeNext[0] && x[1] == snakeNext[1]) > -1) {
    return snakeNext;
  }
  let l = eatStore.length;
  let _r = null;
  while (l > 0) {
    l--;
    if (snakeStore.findIndex(x => x[0] == eatStore[l][0] && x[1] == eatStore[l][1]) > -1) {
      _r = eatStore[l];
      break;
    }
  }
  return _r;
};

let drawStop = function () {
  if (stopContainer) {
    stage.removeChild(stopContainer);
    stopContainer = null;
  }
  stopContainer = new Container();
  let text = new Text('按上、下、左、右键开始', {
    fontSize: '32px', fill: "white"
  });
  text.anchor.set(0.5, 0.5);
  text.position.set(snakeWidth * snakeEl / 2, snakeHeight * snakeEl / 4);
  stopContainer.addChild(text);
  stage.addChild(stopContainer)
};

let clearStop = function () {
  if (stopContainer) {
    stage.removeChild(stopContainer);
    stopContainer = null;
  }
};

let play = function () {
  //Use the cat's velocity to make it move

  if (!snakeVx && !snakeVy) {
    return;
  }

  let _snakeHeader = snakeHeader(snakeStore, direction);
  let _snakeVx = _snakeHeader.start[0] - _snakeHeader.end[0];
  let _snakeVy = _snakeHeader.start[1] - _snakeHeader.end[1];

  if (_snakeVx == snakeVx == 0 && _snakeVy == -snakeVy || _snakeVy == snakeVy == 0 && _snakeVx == -snakeVx) {
    drawStop();
    return;
  } else {
    clearStop();
  }

  let snakeNext = [_snakeHeader.start[0] + snakeVx, _snakeHeader.start[1] + snakeVy];
  if (hitLost(snakeNext)) {
    return lost();
  }
  let _eatHit = eatHit(snakeNext);
  if (_eatHit) {
    snakeLength++;
    if (direction) {
      snakeStore.splice(0, 0, snakeNext);
    } else {
      snakeStore.push(_eatHit);
    }
    sumScore += eatScore;
    delEat(_eatHit);
    putEat();
  } else {
    if (direction) {
      snakeStore.splice(0, 0, snakeNext);
      snakeStore.splice(snakeLength, 1);
    } else {
      snakeStore.splice(0, 1);
      snakeStore.push(snakeNext);
    }
  }
  drawSnake();
  drawEat();
  drawSnakeScore();
  //check for a collision between the cat and the box
};

let delLost = function () {
  if (lostContainer) {
    stage.removeChild(lostContainer);
    lostContainer = null
  }
};

let restSnake = function () {
  delLost();
  snakeVx = 0;
  snakeVy = 0;
  snakeLength = 10;
  sumScore = 0;
  eatStore.splice(0, eatScore.length);
  snakeStore.splice(0, snakeStore.length);
  initSnakeStore();
  drawSnakeScore();
  drawSnake();
  putEat();
  drawEat();
  state = play;
};


let loadState = function () {

  try {
    let _sumScore;
    let _eatStore;
    let _snakeStore;
    let _snakeLength;
    console.log(localStorage.getItem('snakeStore'));
    if (localStorage.getItem('sumScore')) {
      _sumScore = parseInt(localStorage.getItem('sumScore'));
    }
    if (localStorage.getItem('snakeLength')) {
      _snakeLength = parseInt(localStorage.getItem('snakeLength'));
    }
    if (localStorage.getItem('eatStore')) {
      _eatStore = JSON.parse(localStorage.getItem('eatStore'));
    }
    if (localStorage.getItem('snakeStore')) {
      _snakeStore = JSON.parse(localStorage.getItem('snakeStore'));
    }
    if (_snakeLength) {
      sumScore = _sumScore;
      snakeLength = _snakeLength;
      eatStore = _eatStore;
      snakeStore = _snakeStore;
    }
  } catch (e) {
    localStorage.clear()
  }
};

let saveState = function () {
  localStorage.setItem('sumScore', sumScore);
  localStorage.setItem('snakeLength', snakeLength);
  localStorage.setItem('eatStore', JSON.stringify(eatStore));
  localStorage.setItem('snakeStore', JSON.stringify(snakeStore));
};

let drawLost = function () {
  if (lostContainer) {
    stage.removeChild(lostContainer);
    lostContainer = null
  }
  lostContainer = new Container();
  let message = new Text("LOST !", {fontSize: '64px', fill: "white"});
  message.anchor.set(0.5, 0.5);
  message.position.set(snakeWidth / 2 * snakeEl, snakeHeight / 2 * snakeEl);
  lostContainer.addChild(message);
  let restBtn = new Graphics();
  restBtn.beginFill(0x00ff00);
  restBtn.drawRect(snakeWidth / 2 * snakeEl - 60, snakeHeight / 2 * snakeEl + 64, 120, 40);
  restBtn.endFill();
  restBtn.interactive = true;
  restBtn.buttonMode = true;
  restBtn.accessible = true;
  restBtn.mousedown =restBtn.click = function () {
    restSnake();
  };
  lostContainer.addChild(restBtn);
  message = new Text("重新开始");
  message.anchor.set(0.5, 0.5);
  message.position.set(snakeWidth / 2 * snakeEl, snakeHeight / 2 * snakeEl + 64 + 20);
  lostContainer.addChild(message);

  stage.addChild(lostContainer);
};

let lost = function () {
  state = function () {
  };
  drawLost();
  drawStop();
};

//Tell the `renderer` to `render` the `stage`

// renderer.view.style.border = "1px dashed black";

let timeStep = 0;

let gameLoop = function () {

  //Loop this function at 60 frames per second
  requestAnimationFrame(gameLoop);
  timeStep++;
  if (timeStep % 5 == 0) {
    state();
  }
  saveState();
  //Render the stage to see the animation
  renderer.render(stage);
};

setUp();
