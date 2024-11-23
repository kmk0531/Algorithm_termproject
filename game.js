// Get button and canvas elements
const startButton = document.getElementById("startButton");
const gameCanvas = document.getElementById("gameCanvas");
const budgetDisplay = document.getElementById("budget");
const remainingBudgetDisplay = document.getElementById("remainingBudget");
const ctx = gameCanvas.getContext("2d");

// Game setup variables
let gameStarted = false;
let remainingBudget = 100;

const nodes = [
  {x: 100, y: 100},
  {x: 300, y: 200},
  {x: 500, y: 400}
];

const edges = [
  {from: 0, to: 1, cost: 10, selected: false},
  {from: 1, to: 2, cost: 20, selected: false},
  {from: 0, to: 2, cost: 25, selected: false}
];

// Function to initialize the game
function initializeGame() {
  // Hide the Start button and display the game canvas
  startButton.style.display = "none";
  gameCanvas.style.display = "block";
  budgetDisplay.style.display = "block";

  // Reset any game variables if necessary
  gameStarted = true;

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

function handleCanvasClick(event){
  if(!gameStarted) return;

  const rect = gameCanvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  edges.forEach((edge) =>{
    const fromNode = nodes[edge.from];
    const toNode = nodes[edge.to];

    const dist = Math.abs(
      (toNode.y - fromNode.y) * mouseX -
      (toNode.x - fromNode.x) * mouseY +
      toNode.x * fromNode.y -
      toNode.y * fromNode.x
    ) / Math.sqrt((toNode.y - fromNode.y) ** 2 + (toNode.x - fromNode.x) ** 2);

    if (dist < 10 && !edge.selected && remainingBudget >= edge.cost) {
      edge.selected = true; // Mark edge as selected
      remainingBudget -= edge.cost; // Deduct cost from budget
      remainingBudgetDisplay.textContent = remainingBudget; // Update budget display
      drawMap();
    }
    
  });
}

// Add event listener to the Start button
startButton.addEventListener("click", initializeGame);
gameCanvas.addEventListener("click", handleCanvasClick);