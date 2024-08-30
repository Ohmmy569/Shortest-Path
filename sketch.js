class Block {
  constructor(i, j, w_, h_, state, name) {
    this.row = j;
    this.col = i;
    this.x = i * w_;
    this.y = j * h_;
    this.w = w_;
    this.h = h_;
    this.state = state;
    this.name = name;
    if (name > 99) {
      this.TextX = i * w_ - 6;
    } else if (name > 9) {
      this.TextX = i * w_ - 3;
    } else {
      this.TextX = i * w_;
    }
  }

  show() {
    fill(color(0));

    if (this.state == "path") {
      //path

      fill(color(255));
      rect(this.x, this.y, this.w, this.h);
      fill(color(0));
      text(this.name, this.TextX + 15, this.y + 25);
    } else if (this.state == "start") {
      //start

      fill(color(91, 118, 252));
      rect(this.x, this.y, this.w, this.h);
      fill(color(0));
      text(this.name, this.TextX + 15, this.y + 25);
    } else if (this.state == "goal") {
      //end

      fill(color("red"));
      rect(this.x, this.y, this.w, this.h);
      fill(color(0));
      text(this.name, this.TextX + 15, this.y + 25);
    } else if (this.state == "wall") {
      //wall

      fill(color("gray"));
      rect(this.x, this.y, this.w, this.h);
      fill(color(0));
      text(this.name, this.TextX + 15, this.y + 25);
    } else if (this.state == "visited") {
      //visited

      fill(color(255, 244, 122));
      rect(this.x, this.y, this.w, this.h);
      fill(color(0));
      text(this.name, this.TextX + 15, this.y + 25);
    } else if (this.state == "TruePath") {
      //TruePath

      fill(color(91, 252, 121));
      rect(this.x, this.y, this.w, this.h);
      fill(color(0));
      text(this.name, this.TextX + 15, this.y + 25);
    }
  }
}

let rows = 16;
let cols = 29;
let blocks = [];
let w = 40;
let h = w;
let NodeType = "f";
let startI = -1;
let startJ = -1;
let goalI = -1;
let goalJ = -1;
let speed = 200;

function setup() {
  createCanvas(w * cols, w * rows);
  let name = 0;
  for (let i = 0; i < rows; i++) {
    blocks[i] = [];
    for (let j = 0; j < cols; j++) {
      blocks[i][j] = new Block(j, i, w, h, "path", name);
      name++;
    }
  }
}

function reset() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if(blocks[i][j].state == "visited" || blocks[i][j].state == "TruePath"){
        blocks[i][j].state = "path"
      }
    }
  }
}

function mousePressed() {
  let x = int(mouseY / w);
  let y = int(mouseX / h);
  if (blocks[x][y] == undefined) {
    return;
  }
  if (NodeType == "start") {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (blocks[i][j].state == NodeType) {
          blocks[i][j].state = "path";
        }
      }
    }
    blocks[x][y].state = NodeType;
  }
  if (NodeType == "goal") {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (blocks[i][j].state == NodeType) {
          blocks[i][j].state = "path";
        }
      }
    }
    blocks[x][y].state = NodeType;
  }
  if (NodeType == "wall") {
    blocks[x][y].state = NodeType;
  }
  if (NodeType == "path") {
    blocks[x][y].state = NodeType;
  }
}

function mouseDragged() {
  let x = int(mouseY / w);
  let y = int(mouseX / h);
  if (blocks[x][y] == undefined) {
  }
  if (NodeType == "wall") {
    blocks[x][y].state = NodeType;
  }
  if (NodeType == "path") {
    blocks[x][y].state = NodeType;
  }
}

function finding() {
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (blocks[i][j].state == "start") {
        startI = i;
        startJ = j;
      }
      if (blocks[i][j].state == "goal") {
        goalI = i;
        goalJ = j;
      }
    }
  }

  if(startI == -1 || startJ == -1 || goalI == -1 || goalJ == -1){
    alert("Your must place Start and Goal");
    return
  }

  let queue = [];
  let backtrack = [];
  let Nbacktrack = [];
  let IsmeetGoal = false;
  queue.push(blocks[startI][startJ]);

  function step() {
    if (queue.length == 0 || IsmeetGoal) {
      return;
    }
    let curr = queue.shift();
    if (curr.state != "start") {
      backtrack.push(curr);
      Nbacktrack.push(curr.name);
    }

    let left, top, right, bot;

    if (curr.col > 0) {
      left = blocks[curr.row][curr.col - 1];
    } else {
      left = undefined;
    }

    if (curr.row > 0) {
      top = blocks[curr.row - 1][curr.col];
    } else {
      top = undefined;
    }

    if (curr.col < blocks[0].length - 1) {
      right = blocks[curr.row][curr.col + 1];
    } else {
      right = undefined;
    }

    if (curr.row < blocks.length - 1) {
      bot = blocks[curr.row + 1][curr.col];
    } else {
      bot = undefined;
    }
    let direction = [left, top, right, bot];

    for (let neighbor of direction) {
      if (neighbor != undefined) {
        if (neighbor.state == "goal") {
          queue.push(neighbor);
          IsmeetGoal = true;
          break;
        } else if (neighbor.state == "path") {
          queue.push(neighbor);
          neighbor.state = "visited";
        }
      }
    }
    if (IsmeetGoal) {
      backtrack.reverse();
      Nbacktrack.reverse();
      let path = [];
      path.push(backtrack[0]);
      let current = 0;
      for (let i = 1; i < backtrack.length; i++) {
        let x = path[current];

        if (
          (x.row == backtrack[i].row && x.col - 1 == backtrack[i].col) ||
          (x.row - 1 == backtrack[i].row && x.col == backtrack[i].col) ||
          (x.row == backtrack[i].row && x.col + 1 == backtrack[i].col) ||
          (x.row + 1 == backtrack[i].row && x.col == backtrack[i].col)
        ) {
          path.push(backtrack[i]);
          current++;
        }
      }
      for (let f of path) {
        f.state = "TruePath";
      }
    }
    setTimeout(step, 1000 - speed)  ;
  }
  step();
}

function draw() {
  background(0);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      blocks[i][j].show();
    }
  }

  let select = document.getElementById("select");
  NodeType = select.value;
  rows = document.getElementById("rows").value;
  cols = document.getElementById("cols").value;
  speed = document.getElementById("speed").value  
}
