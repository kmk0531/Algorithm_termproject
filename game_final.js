// Get button and canvas elements
const startButton = document.getElementById("startButton");
const howToPlayButton = document.getElementById("howToPlayButton");
const gameCanvas = document.getElementById("gameCanvas");
const budgetDisplay = document.getElementById("budget");
const remainingBudgetDisplay = document.getElementById("remainingBudget");
const ctx = gameCanvas.getContext("2d");
const restartButton = document.getElementById("restartButton");
const showPrimButton = document.getElementById("showPrimButton");
const showKruskalButton = document.getElementById("showKruskalButton");

// Game setup variables
let nodes = [];
let edges = [];
let gameStarted = false;
let remainingBudget = 100;
let currentLevel = 1;
let levelsCompleted = 0; // 완료된 레벨 수

function launchFireworks(x, y) {
  const particleCount = 100; // 파티클 수
  const particles = [];
  
  // 파티클 클래스 정의
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.speed = Math.random() * 4 + 1; // 속도
      this.angle = Math.random() * 2 * Math.PI; // 방향
      this.size = Math.random() * 3 + 1; // 크기
      this.life = 0; // 수명
      this.maxLife = Math.random() * 20 + 30; // 최대 수명
      this.color = `hsl(${Math.random() * 360}, 100%, 50%)`; // 랜덤 색상
      this.dx = Math.cos(this.angle) * this.speed;
      this.dy = Math.sin(this.angle) * this.speed;
    }

    // 파티클 업데이트
    update() {
      this.x += this.dx;
      this.y += this.dy;
      this.life++;
    }

    // 파티클 그리기
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 파티클 생성
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(x, y));
  }

  // 폭죽 애니메이션
  function animateFireworks() {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // 파티클 업데이트 및 그리기
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    // 파티클이 모두 사라지면 애니메이션 종료
    if (particles[0].life >= particles[0].maxLife) {
      particles.length = 0; // 모든 파티클 제거
    }

    // particles 배열에 남아있는 파티클이 있으면 계속 애니메이션을 진행
    if (particles.length > 0) {
      requestAnimationFrame(animateFireworks);
    }
  }

  // 애니메이션 시작
  animateFireworks();
}

function startFireworkSequence() {
  // 중앙, 좌측 위, 우측 하단, 우측 위, 좌측 하단 순서대로 폭죽을 발사
  const center = { x: gameCanvas.width / 2, y: gameCanvas.height / 2 }; // 중앙
  const topLeft = { x: 50, y: 50 }; // 좌측 위
  const bottomRight = { x: gameCanvas.width - 50, y: gameCanvas.height - 50 }; // 우측 하단
  const topRight = { x: gameCanvas.width - 50, y: 50 }; // 우측 위
  const bottomLeft = { x: 50, y: gameCanvas.height - 50 }; // 좌측 하단

  // 폭죽을 순차적으로 터뜨리기 위한 타이머 설정
  setTimeout(() => launchFireworks(center.x, center.y), 0); // 0초 후 중앙 폭죽
  setTimeout(() => launchFireworks(topLeft.x, topLeft.y), 500); // 0.5초 후 좌측 위
  setTimeout(() => launchFireworks(bottomRight.x, bottomRight.y), 800); // 0.8초 후 우측 하단
  setTimeout(() => launchFireworks(topRight.x, topRight.y), 1500); // 1.5초 후 우측 위
  setTimeout(() => launchFireworks(bottomLeft.x, bottomLeft.y), 2400); // 2.4초 후 좌측 하단
}
  


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
      { from: 0, to: 1, cost: 6, selected: false},   
      { from: 0, to: 2, cost: 12, selected: false},  
      { from: 1, to: 4, cost: 14, selected: false},  
      { from: 1, to: 2, cost: 5, selected: false},   
      { from: 1, to: 7, cost: 8, selected: false},
      { from: 2, to: 5, cost: 7, selected: false},
      { from: 2, to: 3, cost: 9, selected: false},
      { from: 4, to: 7, cost: 3, selected: false},   
      { from: 5, to: 7, cost: 10, selected: false},   
      { from: 5, to: 6, cost: 15, selected: false}   
    ];
    remainingBudget = 65;
  }
  remainingBudgetDisplay.textContent = remainingBudget;
  drawMap();
}

// Function to initialize the game
function initializeGame() {
  // Hide the Start button and display the game canvas
  startButton.style.display = "none";
  gameCanvas.style.display = "block";
  budgetDisplay.style.display = "block";
  restartButton.style.display = "block";
  showPrimButton.style.display = "block";
  showKruskalButton.style.display = "block";

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
    ctx.fillStyle = node.color || "blue";
    ctx.beginPath();
    ctx.arc(node.x, node.y, 10, 0, 2 * Math.PI);
    ctx.fill();
  });
  
}

function checkVictory() {
  // 예산이 음수일 경우 승리 메시지 방지
  if (remainingBudget < 0) {
    return false; // 게임 오버 처리로 단계 넘어가지 않도록 방지
  }

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

   // 레벨 완료된 갯수 증가
   levelsCompleted++;

     // 모든 레벨을 클리어한 경우 폭죽 터지게
  if (levelsCompleted === 3) {
    startFireworkSequence(); // 폭죽 효과 시작
  }
}

// 실패 처리
function checkFailure() {
  // 예산이 음수일 경우 게임 오버 처리
  if (remainingBudget < 0) {
    // 게임 오버 팝업 표시
    alert("Game Over! You've run out of budget!");
    gameStarted = false;
    // 실패한 레벨을 그대로 재시작
    setTimeout(() => {
      setupLevel(currentLevel); // 현재 레벨로 재시작
      remainingBudgetDisplay.textContent = remainingBudget; // 예산 업데이트
      gameStarted = true; // 게임 시작
      drawMap(); // 맵 다시 그리기
    }, 1000); // 1초 후 재시작
    // 레벨 완료된 갯수 감소
   levelsCompleted--;
  }

  // 예산 내에서 선택할 수 있는 엣지가 없을 경우 게임 오버 처리
  const hasAffordableEdges = edges.some(edge => !edge.selected && edge.cost <= remainingBudget);
  if (!hasAffordableEdges) {
    // 게임 오버 팝업 표시
    alert("Game Over! No more affordable roads.");
    gameStarted = false;
    // 실패한 레벨을 그대로 재시작
    setTimeout(() => {
      setupLevel(currentLevel); // 현재 레벨로 재시작
      remainingBudgetDisplay.textContent = remainingBudget; // 예산 업데이트
      gameStarted = true; // 게임 시작
      drawMap(); // 맵 다시 그리기
    }, 1000); // 1초 후 재시작
    // 레벨 완료된 갯수 감소
   levelsCompleted--;
  }
}

function handleCanvasClick(event) {
  if (!gameStarted) return;

  const rect = gameCanvas.getBoundingClientRect();
  const mouseX = (event.clientX - rect.left) * (gameCanvas.width / rect.width); //캔버스 위치에 맞춰 마우스 위치 계산
  const mouseY = (event.clientY - rect.top) * (gameCanvas.height / rect.height);

  console.log(`Mouse Position: (${mouseX}, ${mouseY})`); //디버깅용
  console.log(`Canvas Position: left=${rect.left}, top=${rect.top}`); //디버깅용

  edges.forEach((edge, index) => {
    const fromNode = nodes[edge.from];
    const toNode = nodes[edge.to];

    let dist = 0;

    if (fromNode.y === toNode.y) { //수평 엣지 처리
      dist = Math.abs(mouseY - fromNode.y);
    } else if (fromNode.x === toNode.x) { //수직 엣지 처리
      dist = Math.abs(mouseX - fromNode.x);
    } else { //대각선 엣지 처리
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
      mouseY <= Math.max(fromNode.y, toNode.y) + 20; //마우스 오차범위 설정

    console.log(`Edge ${index}: dist=${dist}, withinBounds=${withinBounds}`); //디버깅용

    if (dist < 15 && withinBounds && !edge.selected && remainingBudget >= edge.cost) { //엣지 클릭 판정 충족했다면
      edge.selected = true;
      remainingBudget -= edge.cost;
      remainingBudgetDisplay.textContent = remainingBudget;
      drawMap();
    }
  });
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
  else checkFailure();
}
  

function primMST(nodes, edges) {
  const mstEdges = []; // MST에 포함된 엣지
  const visited = new Set(); // MST에 포함된 노드
  const edgeQueue = []; // 선택 가능한 엣지들

  // 시작 노드 선택 (노드 0)
  visited.add(0);

  // 초기 엣지 추가
  edges.forEach(edge => {
    if (edge.from === 0 || edge.to === 0) {
      edgeQueue.push(edge);
    }
  });

  while (mstEdges.length < nodes.length - 1) {
    // 가장 작은 비용의 엣지 선택
    edgeQueue.sort((a, b) => a.cost - b.cost);
    const smallestEdge = edgeQueue.shift();

    // 이미 방문한 노드 간의 엣지라면 건너뜀
    if (visited.has(smallestEdge.from) && visited.has(smallestEdge.to)) {
      continue;
    }

    // MST에 엣지 추가
    mstEdges.push(smallestEdge);

    // 새로 방문한 노드를 MST에 추가
    const newNode = visited.has(smallestEdge.from) ? smallestEdge.to : smallestEdge.from;
    visited.add(newNode);

    // 새 노드와 연결된 엣지들을 큐에 추가
    edges.forEach(edge => {
      if (!visited.has(edge.from) || !visited.has(edge.to)) {
        if (edge.from === newNode || edge.to === newNode) {
          edgeQueue.push(edge);
        }
      }
    });
  }

  return mstEdges;
}

function animateMST(mstEdges) {
  let index = 0;

  function drawNextEdge() {
    if (index < mstEdges.length) {
      const edge = mstEdges[index];
      const fromNode = nodes[edge.from];
      const toNode = nodes[edge.to];

      // 엣지 그리기
      ctx.strokeStyle = "blue"; // MST 엣지는 파란색
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.stroke();

      index++;

      // 다음 엣지를 일정 시간 후 그리기
      setTimeout(drawNextEdge, 500); // 500ms 간격
    }
  }

  // 첫 엣지 그리기 시작
  drawNextEdge();
}

//사이클 감지용 find, union 함수
function find(parent, node) {
  if (parent[node] !== node) {
    parent[node] = find(parent, parent[node]); // 경로 압축
  }
  return parent[node];
}

function union(parent, rank, node1, node2) {
  const root1 = find(parent, node1);
  const root2 = find(parent, node2);

  if (root1 !== root2) {
    if (rank[root1] > rank[root2]) {
      parent[root2] = root1;
    } else if (rank[root1] < rank[root2]) {
      parent[root1] = root2;
    } else {
      parent[root2] = root1;
      rank[root1]++;
    }
  }
}

function kruskalMST(nodes, edges) {
  const mstEdges = []; // MST에 포함된 엣지
  const parent = []; // 부모 배열
  const rank = []; // 트리 높이 배열

  // 초기화
  for (let i = 0; i < nodes.length; i++) {
    parent[i] = i; // 각 노드는 자기 자신을 부모로 가짐
    rank[i] = 0;   // 초기 트리 높이는 0
  }

  // 엣지 비용 기준으로 정렬
  const sortedEdges = edges.slice().sort((a, b) => a.cost - b.cost);

  for (const edge of sortedEdges) {
    if (find(parent, edge.from) !== find(parent, edge.to)) {
      mstEdges.push(edge); // MST에 추가
      union(parent, rank, edge.from, edge.to); // 노드 병합
    }

    // MST가 완성되면 종료
    if (mstEdges.length === nodes.length - 1) {
      break;
    }
  }

  return mstEdges;
}

function animateKruskalMST(mstEdges) {
  let index = 0;

  function drawNextEdge() {
    if (index < mstEdges.length) {
      const edge = mstEdges[index];
      const fromNode = nodes[edge.from];
      const toNode = nodes[edge.to];

      ctx.strokeStyle = "purple";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.stroke();

      index++;
      setTimeout(drawNextEdge, 500); // 500ms 간격으로 엣지 추가
    }
  }

  drawNextEdge(); // 첫 엣지 그리기 시작
}

// Add event listener to the Start button
startButton.addEventListener("click", initializeGame);
howToPlayButton.addEventListener("click", () => {
  const container = document.getElementById("howToPlayContainer");
  if (container.style.display === "none") {
    container.style.display = "block"; // 설명 보이기
  } else {
    container.style.display = "none"; // 설명 숨기기
  }
});
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
showPrimButton.addEventListener("click", () => {
  const mstEdges = primMST(nodes, edges); // Prim MST 계산
  drawMap(); // 기존 맵 다시 그리기
  animateMST(mstEdges); // 최적 경로 표시
});
showKruskalButton.addEventListener("click", () =>{
  const mstEdges = kruskalMST(nodes, edges); // Kruskal MST 계산
  drawMap(); // 기존 맵 초기화
  animateKruskalMST(mstEdges); // Kruskal MST 애니메이션 표시
});