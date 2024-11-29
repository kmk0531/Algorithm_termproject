// Get button and canvas elements
const startButton = document.getElementById("startButton");
const gameCanvas = document.getElementById("gameCanvas");
const budgetDisplay = document.getElementById("budget");
const remainingBudgetDisplay = document.getElementById("remainingBudget");
const ctx = gameCanvas.getContext("2d");
const restartButton = document.getElementById("restartButton");

// Game setup variables
let nodes = [];
let edges = [];
let gameStarted = false;
let remainingBudget = 100;
let currentLevel = 1;

function setupLevel(level) {
  // Adjust the graph based on level
  if (level === 1) {
    nodes = [{x: 100, y: 100}, {x: 300, y: 200}, {x: 500, y: 400}];
    edges = [
      {from: 0, to: 1, cost: 10, selected: false},
      {from: 1, to: 2, cost: 20, selected: false},
      {from: 0, to: 2, cost: 25, selected: false}
    ];
    remainingBudget = 50;
  } else if (level === 2) {
    nodes = [{x: 100, y: 100}, {x: 200, y: 150}, {x: 400, y: 250}, {x: 500, y: 400}];
    edges = [
      {from: 0, to: 1, cost: 10, selected: false},
      {from: 1, to: 2, cost: 15, selected: false},
      {from: 2, to: 3, cost: 20, selected: false},
      {from: 0, to: 3, cost: 30, selected: false}
    ];
    remainingBudget = 60;
  } else if (level === 3) {
    nodes = [
      { x: 300, y: 100 }, // 노드 0
      { x: 250, y: 200 }, // 노드 1
      { x: 350, y: 200 }, // 노드 2
      { x: 450, y: 200 }, // 노드 3
      { x: 250, y: 300 }, // 노드 4
      { x: 350, y: 300 }, // 노드 5
      { x: 450, y: 300 }, // 노드 6
      { x: 300, y: 400 } // 노드 7
    ];
    edges = [
      { from: 0, to: 1, cost: 6, selected: false},   // 노드 1 → 노드 2
      { from: 0, to: 2, cost: 12, selected: false},  // 노드 1 → 노드 4
      { from: 1, to: 4, cost: 14, selected: false},   // 노드 2 → 노드 4
      { from: 1, to: 2, cost: 5, selected: false},   // 노드 2 → 노드 5
      { from: 1, to: 7, cost: 8, selected: false},
      { from: 2, to: 5, cost: 7, selected: false},
      { from: 2, to: 3, cost: 9, selected: false},
      { from: 4, to: 7, cost: 3, selected: false},   // 노드 4 → 노드 5
      { from: 5, to: 7, cost: 10, selected: false},   // 노드 5 → 노드 6
      { from: 5, to: 6, cost: 15, selected: false}   // 노드 5 → 노드 7
    ];
    remainingBudget = 80;
  }
  drawMap();
}

// Function to initialize the game
function initializeGame() {
  // Hide the Start button and display the game canvas
  startButton.style.display = "none";
  gameCanvas.style.display = "block";
  budgetDisplay.style.display = "block";
  restartButton.style.display = "block";

  // Reset any game variables if necessary
  gameStarted = true;
  setupLevel(currentLevel);
  // Draw initial game elements
  drawMap();
}

// Function to draw the map and nodes (example setup)
function drawMap() {
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  //Draw edges
  edges.forEach((edge)=>{
    const fromNode = nodes[edge.from];
    const toNode = nodes[edge.to];
    ctx.strokeStyle = edge.selected ? "green" : "black";
    ctx.lineWidth = edge.selected ? 3 : 1;
    ctx.beginPath();
    ctx.moveTo(fromNode.x, fromNode.y);
    ctx.lineTo(toNode.x, toNode.y);
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.fillText(`$${edge.cost}`, (fromNode.x + toNode.x) / 2, (fromNode.y + toNode.y) / 2);
  });

  //draw nodes
  nodes.forEach((node) =>{
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(node.x, node.y, 10, 0, 2 * Math.PI);
    ctx.fill();
  });
  
}

function checkVictory() {
  // Create an adjacency list for selected edges
  const adjacencyList = nodes.map(() => []); // Initialize adjacency list
  edges.forEach(edge => {
    if (edge.selected) {
      adjacencyList[edge.from].push(edge.to);
      adjacencyList[edge.to].push(edge.from);
    }
  });

  console.log("Adjacency List:", adjacencyList); // 디버깅용

  // Perform DFS to check connectivity
  const visited = new Array(nodes.length).fill(false);
  let connectedCount = 0;

  function dfs(node) {
    visited[node] = true;
    connectedCount++;
    adjacencyList[node].forEach(neighbor => {
      if (!visited[neighbor]) {
        dfs(neighbor);
      }
    });
  }

  dfs(0); // Start DFS from the first node

  console.log("Visited Nodes:", visited); // 디버깅용
  console.log("Connected Count:", connectedCount); // 디버깅용
  return connectedCount === nodes.length; // Check if all nodes are connected
}

function showVictoryMessage() {
  ctx.save();
  ctx.fillStyle = "green";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Level Complete!", gameCanvas.width / 2, gameCanvas.height / 2);
  ctx.restore();
}

function checkFailure(){
  //check if remaining budget is zero
  if(remainingBudget <= 0){
    alert("Game Over! You've run out of budget!");
    gameStarted = false;
    return true;
  }
  const hasAffordableEdges = edges.some(edge => !edge.selected && edge.cost <= remainingBudget);
  if (!hasAffordableEdges) {
    alert("Game Over! No more affordable roads.");
    gameStarted = false;
    restartButton.style.display = "block"; // Show restart button
    return true;
  }

  return false;
}

function handleCanvasClick(event) {
  if (!gameStarted) return;

  const rect = gameCanvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  console.log(`Mouse click position: (${mouseX}, ${mouseY})`);

  edges.forEach((edge, index) => {
    const fromNode = nodes[edge.from];
    const toNode = nodes[edge.to];

    console.log(`Edge ${index}: from (${fromNode.x}, ${fromNode.y}) to (${toNode.x}, ${toNode.y})`);

    let dist = 0;

    // 수평 엣지 처리 (y 좌표가 동일)
    if (fromNode.y === toNode.y) {
      dist = Math.abs(mouseY - fromNode.y);
    }
    // 수직 엣지 처리 (x 좌표가 동일)
    else if (fromNode.x === toNode.x) {
      dist = Math.abs(mouseX - fromNode.x);
    }
    // 일반적인 대각선 엣지 처리
    else {
      dist = Math.abs(
        (toNode.y - fromNode.y) * mouseX -
        (toNode.x - fromNode.x) * mouseY +
        toNode.x * fromNode.y -
        toNode.y * fromNode.x
      ) / Math.sqrt((toNode.y - fromNode.y) ** 2 + (toNode.x - fromNode.x) ** 2);
    }

    const withinBounds =
    mouseX >= Math.min(fromNode.x, toNode.x) - 10 &&
    mouseX <= Math.max(fromNode.x, toNode.x) + 10 &&
    mouseY >= Math.min(fromNode.y, toNode.y) - 20 &&
    mouseY <= Math.max(fromNode.y, toNode.y) + 20; // 허용 범위 확대

    console.log(`Edge ${index}: dist=${dist}, withinBounds=${withinBounds}`);

  // 클릭 조건 확인
  if (dist < 10 && withinBounds && !edge.selected && remainingBudget >= edge.cost) {
    edge.selected = true; // 엣지 선택
    remainingBudget -= edge.cost; // 예산 차감
    remainingBudgetDisplay.textContent = remainingBudget; // UI 업데이트
    drawMap(); // 맵 다시 그리기

    if (checkVictory()) {
      showVictoryMessage();
      setTimeout(() => {
        currentLevel++;
        if (currentLevel > 3) {
          alert("You've completed all levels!");
          gameStarted = false;
        } else {
          setupLevel(currentLevel);
        }
      }, 2000); // 2초 지연
    }
  }
});
}

// Add event listener to the Start button
startButton.addEventListener("click", initializeGame);
gameCanvas.addEventListener("click", handleCanvasClick);
restartButton.addEventListener("click", () => {
  // Reset game variables
  currentLevel = 1;
  gameStarted = false;
  startButton.style.display = "block";
  restartButton.style.display = "none";
  budgetDisplay.style.display = "none";
  initializeGame();
});