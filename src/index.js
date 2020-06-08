// constants
const nodeSize = '20px';
const nodeGap = '5px';
// parameters
const worldSize = 2;
const speed = 1;

function idx(row, col) {
  return col * worldSize + row;
}

function applyWorldStyles(node) {
  node.style.display = 'grid';
  node.style.gridTemplateColumns = `repeat(${worldSize}, ${nodeSize})`;
  node.style.gridTemplateRows = `repeat(${worldSize}, ${nodeSize})`;
  node.style.gap = nodeGap;
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
  const worldGrid = [];
  const worldNode = document.querySelector('#world');
  applyWorldStyles(worldNode);
  // create board
  for (let i = 0; i < worldSize; i += 1) {
    for (let j = 0; j < worldSize; j += 1) {
      const gridNode = document.createElement('div');
      gridNode.classList.add('node');
      gridNode.classList.add(`row-${i}`);
      gridNode.classList.add(`col-${j}`);
      gridNode.classList.add(`idx-${idx(i, j)}`);

      worldGrid[idx(i, j)] = {
        row: i,
        col: j,
        idx: idx(i, j),
        node: gridNode,
      };

      worldNode.appendChild(gridNode);
      console.log(gridNode);
    }
  }
  // set up initial conditions of the world
  // - at some point attach click handler for play/pause button

  // loop until no activity possible
}

init();
