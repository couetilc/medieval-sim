// functions prefixed with "create" modify data
//                    with "draw" modify the DOM


// constants
const nodeSize = '20px';
const nodeGap = '5px';
// parameters
const worldSize = 2;
const speed = 1;
// tracking
let characterCount = 0;

const allCharacters = ['wench', 'swain', 'baby'];

function shuffle(arr) {
  var temp, j, i = arr.length;
  while (--i) {
    j = ~~(Math.random() * (i + 1));
    temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  return arr;
}

function createGrid(size) {
  const grid = [];
  for (let i = 0; i < size; i += 1) {
    for (let j = 0; j < size; j += 1) {
      const gridNode = document.createElement('div');

      gridNode.classList.add('node');
      gridNode.classList.add(`row-${i}`);
      gridNode.classList.add(`col-${j}`);
      gridNode.classList.add(`idx-${idx(i, j)}`);

      grid[idx(i, j)] = {
        row: i,
        col: j,
        idx: idx(i, j),
        node: gridNode,
      };
    }
  }
  return grid;
}

function drawGrid(grid, size, atNode) {
  for (let i = 0; i < size; i += 1) {
    for (let j = 0; j < size; j += 1) {
      // console.log('(%o,%o) => %o', i, j, grid[idx(i, j)]);
      atNode.appendChild(grid[idx(i, j)].node);
      // console.log(grid[idx(i, j)].node);
    }
  }
}

function clearGrid(atNode) {
  while (atNode.firstChild) {
    atNode.removeChild(atNode.firstChild);
  }
}

// grid: the worldGrid
// grid: the next worldGrid
// row, col: the swain's current location in the worldGrid
// @returns the change in number of characters
function moveSwain(grid, nextGrid, row, col) {
  // run through possible directions to move in random order
  const directions = shuffle([0, 1, 2, 3]);
  let nextDir = 4;
  while (nextDir) {
    nextDir -= 1;
    const { row: nextRow, col: nextCol } = nextLoc(row, col, directions[nextDir]);
    if (!isOccupied(grid, nextRow, nextCol, ['baby', 'swain']) && isInGrid(nextRow, nextCol)) {
      // move
      console.log(`swain moved to (${nextRow}, ${nextCol})`);
      nextGrid[idx(nextRow, nextCol)].node.classList.add('swain');
      break;
    }
  }
  if (nextDir === 0) {
    // did not find a new location
    console.log(`swain died at (${row}, ${col})`);
    characterCount -= 1;
  }
}

// grid: the worldGrid
// grid: the next worldGrid
// row, col: the swain's current location in the worldGrid
function moveWench(grid, nextGrid, row, col) {
  // run through possible directions to move in random order
  const directions = shuffle([0, 1, 2, 3]);
  let nextDir = 4;
  while (nextDir) {
    nextDir -= 1;
    const { row: nextRow, col: nextCol } = nextLoc(row, col, directions[nextDir]);
    if (!isOccupied(grid, nextRow, nextCol, ['baby', 'wench']) && isInGrid(nextRow, nextCol)) {
      // move
      console.log(`wench moved to (${nextRow}, ${nextCol})`);
      nextGrid[idx(nextRow, nextCol)].node.classList.add('wench');
      break;
    }
  }
  if (nextDir === 0) {
    // did not find a new location
    console.log(`wench died at (${row}, ${col})`);
    characterCount -= 1;
  }
  return 0;
}

function createBaby(worldGrid, nextGrid, row, col) {
  nextGrid[idx(row, col)].node.classList.add('baby');
  console.log(`baby born at (${row}, ${col})`); 
  characterCount += 1;
  // swain and wench step to different grid nodes (but not one containing a baby)
  // if they cannot step to a new node, they die
  worldGrid[idx(row, col)].node.classList.remove('swain', 'wench');
  characterCount -= 2; // parents die
}

function getNextGrid(worldGrid, worldSize) {
  const nextGrid = createGrid(worldSize);
  worldGrid.forEach(gridItem => {
    const { node, row, col } = gridItem;
    // if is swain and wench, make a baby
    if (node.classList.contains('swain') && node.classList.contains('wench')) {
      // make a baby at the current grid node
      createBaby(worldGrid, nextGrid, row, col);
    }
    // if is swain, take a step
    else if (node.classList.contains('swain')) {
      // if it cannot step to a new node, it dies
      node.classList.remove('swain');
      moveSwain(worldGrid, nextGrid, row, col);
    }
    // if is wench, take a step
    else if (node.classList.contains('wench')) {
      // if it cannot step to a new node, it dies
      moveWench(worldGrid, nextGrid, row, col);
    }
    // if is baby, turn into swain or wench
    else if (node.classList.contains('baby')) {
      characterCount -= 1; // baby dies without parents
      console.log(`baby dies at (${row}, ${col})`); 
    }
    // if is nothing, ignore
    else {
    }
  });
  return nextGrid;
}

function idx(row, col) {
  return col * worldSize + row;
}

function applyWorldStyles(node) {
  node.style.display = 'grid';
  node.style.gridTemplateColumns = `repeat(${worldSize}, ${nodeSize})`;
  node.style.gridTemplateRows = `repeat(${worldSize}, ${nodeSize})`;
  node.style.gap = nodeGap;
}

function isOccupied(grid, row, col, characters = allCharacters) {
  if (!isInGrid(row, col)) { return false; }
  const nodeContains = (className) => grid[idx(row, col)].node.classList.contains(className);
  // console.info('isOccuppied(%o, %o, %o) = %o', row, col, characters, characters.some(nodeContains));
  return characters.some(nodeContains);
}

function isInGrid(row, col) {
  // console.log('isInGrid(%o, %o) = %o', row, col, row >= 0 && row < worldSize && col >= 0 && col < worldSize);
  return row >= 0 && row < worldSize &&
    col >= 0 && col < worldSize;
}

// just 4 directions => 0: North, 1: East, 2: South, 3: West
function nextLoc(row, col, dir) {
  if (dir === 0) {
    return { row: row - 1, col };
  }
  if (dir === 1) {
    return { row, col: col + 1 };
  }
  if (dir === 2) {
    return { row: row + 1, col };
  }
  if (dir === 3) {
    return { row, col: col - 1 };
  }
  throw new Error('invalid direction', dir);
}

// How about at the start: (Experiment #1)
//  2 types of creatures = ['swain', 'wench'];
//  when they meet at the same square, some probability to create a baby.
//  that baby will be either a swain or a wench born at the square.
//    - the baby's first move is to be created
//  swains and wenchs will move about randomly.
//    - after meeting at the same square, they must move to different squares
//    - they each take one step at a time
//  every creature's step will be calculated before the board is re-drawn

// Moving about by event emitter (Experiment #2)
//  First: 1 type of creature = ['swain'];
//    - swain will make a step of distance 1 every 1s
//    - steps are animated by setTimeout and event emitter
//  Then: 2 types of creatures = ['swain', 'knight'];
//    - swain will make a step of distance 1 every 1s
//    - knight will make a step of distance 3 every 1.5s

function init() {
  const worldNode = document.querySelector('#world');
  applyWorldStyles(worldNode);

  // create and draw the simulation grid
  let worldGrid = createGrid(worldSize);
  drawGrid(worldGrid, worldSize, worldNode);

  // set up initial conditions of the world
  worldGrid[0].node.classList.add('swain');
  worldGrid[3].node.classList.add('wench');
  characterCount += 2;
  // - at some point attach click handler for play/pause button
  let stepCount = 0;
  let iid;
  // loop until no activity possible (setInterval?)
  iid = setInterval(() => {
    console.log('\n[Step %o] (#char=%o)', stepCount++, characterCount);
    //    - calculate next moves
    worldGrid = getNextGrid(worldGrid, worldSize);
    //    - execute next moves
    clearGrid(worldNode);
    drawGrid(worldGrid, worldSize, worldNode);
    // if no characters left, no more moves are made
    if (characterCount === 0) { clearInterval(iid); }
  }, 1000);
}

init();
