// Get button and canvas elements
const startButton = document.getElementById("startButton");
const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");

// Game setup variables
let gameStarted = false;

// Function to initialize the game
function initializeGame() {
  // Hide the Start button and display the game canvas
  startButton.style.display = "none";
  gameCanvas.style.display = "block";

  // Reset any game variables if necessary
  gameStarted = true;

  // Draw initial game elements
  drawMap();
}

// Function to draw the map and nodes (example setup)
function drawMap() {
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  // Draw example cities (nodes) and roads (edges)
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(100, 100, 10, 0, 2 * Math.PI);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(400, 300, 10, 0, 2 * Math.PI);
  ctx.fill();

  // Draw a road between the two cities
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100, 100);
  ctx.lineTo(400, 300);
  ctx.stroke();
}

// Add event listener to the Start button
startButton.addEventListener("click", initializeGame);