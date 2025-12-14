// ===== Canvas =====
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Вимикаємо розмиття PNG
ctx.imageSmoothingEnabled = false;

// Забороняємо скролл пробілом
window.addEventListener("keydown", function(e) {
    if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
    }
});

// ===== Завантаження PNG текстури дрона =====
const droneImg = new Image();
droneImg.src = "drone.png"; // правильне ім'я файла!

droneImg.onload = () => console.log("Дрон завантажився");
droneImg.onerror = () => console.log("Помилка: НЕ знайдено drone.png");

// ===== Звуки =====
const explosionSound = new Audio(
  "data:audio/wav;base64,UklGRpwAAABXQVZFZm10IBAAAAABAAEA... (скорочено)"
);

const tankImg = new Image();
tankImg.src = "tank.png";

tankImg.onload = () => console.log("Танк завантажився!");
tankImg.onerror = () => console.log("Помилка: НЕ знайдено tank.png");

const bikeImg = new Image();
bikeImg.src = "bike.png";

bikeImg.onload = () => console.log("Байк завантажився!");
bikeImg.onerror = () => console.log("Помилка: не знайдено bike.png");

const truckImg = new Image();
truckImg.src = "truck.png";

truckImg.onload = () => console.log("Трак завантажився!");
truckImg.onerror = () => console.log("Помилка: не знайдено truck.png");



// ===== Глобальні змінні =====
let drone, bombs, enemies, keys, score, gameOver, missedCount;

// ===== Ініціалізація гри =====
function initGame() {
  drone = {
    x: canvas.width / 2 - 100,
    y: canvas.height - 250,
    width: 90,
    height: 65,
    speed: 5
  };

  bombs = [];
  enemies = [];
  keys = {};
  score = 0;
  missedCount = 0;
  gameOver = false;

  restartBtn.style.display = "none";
}

initGame();

// ===== Обробка клавіш =====
document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
  if (e.code === "Space") dropBomb();
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

// ===== Скидання бомби =====
function dropBomb() {
  bombs.push({
    x: drone.x + drone.width * 0.47,
    y: drone.y + drone.height * 0.80,
    width: 12,
    height: 22,
    speed: 6
  });
}

// ===== Генерація ворога =====
function spawnEnemy() {
  const types = ["tank", "truck", "bike"];
  const type = types[Math.floor(Math.random() * types.length)];

  let size = 80;
  if (type === "bike") size = 35;
  if (type === "tank") size = 100;

  enemies.push({
    x: -size,
    y: canvas.height - 100,
    width: size,
    height: size * 0.6,
    speed: 2 + Math.random() * 2,
    type: type,
    exploding: false,
    explosionFrame: 0
  });
}

setInterval(() => {
  if (!gameOver) spawnEnemy();
}, 1200);

// ===== Перевірка зіткнення =====
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// ===== Анімація вибуху =====
function drawExplosion(enemy) {
  const frame = enemy.explosionFrame;
  const radius = frame * 4;

  ctx.beginPath();
  ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, radius, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, ${200 - frame * 10}, 0, ${1 - frame * 0.05})`;
  ctx.fill();

  enemy.explosionFrame++;

  if (enemy.explosionFrame > 20) {
    const index = enemies.indexOf(enemy);
    if (index !== -1) enemies.splice(index, 1);
  }
}

// ===== Рендер дрона =====
function drawDrone() {
  ctx.drawImage(droneImg, drone.x, drone.y, drone.width, drone.height);
}

// ===== Рендер ворогів =====
function drawEnemy(e) {
  if (e.exploding) {
    drawExplosion(e);
    return;
  }

 if (e.type === "tank") {
    ctx.drawImage(tankImg, e.x, e.y, e.width, e.height);
}

  if (e.type === "truck") {
    ctx.drawImage(truckImg, e.x, e.y, e.width, e.height);
  }

 if (e.type === "bike") {
    ctx.drawImage(bikeImg, e.x, e.y, e.width, e.height);
}

}

// ===== Оновлення гри =====
function update() {
  if (keys["KeyA"]) drone.x -= drone.speed;
  if (keys["KeyD"]) drone.x += drone.speed;
  if (keys["KeyW"]) drone.y -= drone.speed;
  if (keys["KeyS"]) drone.y += drone.speed;

  if (drone.x < 0) drone.x = 0;
  if (drone.x + drone.width > canvas.width) drone.x = canvas.width - drone.width;
  if (drone.y < 0) drone.y = 0;
  if (drone.y + drone.height > canvas.height - 130)
    drone.y = canvas.height - 130 - drone.height;

  bombs.forEach((b) => b.y += b.speed);
  bombs = bombs.filter((b) => b.y < canvas.height);

  enemies.forEach((e) => {
    e.x += e.speed;

    if (e.x > canvas.width && !e.exploding) {
      missedCount++;
      enemies.splice(enemies.indexOf(e), 1);
      if (missedCount >= 10) gameOver = true;
    }
  });

  bombs.forEach((bomb, bi) => {
    enemies.forEach((enemy, ei) => {
      if (!enemy.exploding && isColliding(bomb, enemy)) {
        bombs.splice(bi, 1);
        enemy.exploding = true;
        explosionSound.currentTime = 0;
        explosionSound.play();
        score++;
      }
    });
  });

  enemies.forEach((enemy) => {
    if (!enemy.exploding && isColliding(drone, enemy)) {
      gameOver = true;
    }
  });

  if (gameOver) restartBtn.style.display = "block";
}

// ===== Малювання всього =====
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#1e293b";
  ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

  drawDrone();

  ctx.fillStyle = "#e5e7eb";
  bombs.forEach((b) => ctx.fillRect(b.x, b.y, b.width, b.height));

  enemies.forEach((e) => drawEnemy(e));

  ctx.fillStyle = "#e5e7eb";
  ctx.font = "16px Arial";
  ctx.fillText("Знищено: " + score, 10, 20);
  ctx.fillText("Пропущено: " + missedCount + "/10", 10, 40);

  if (gameOver) {
    ctx.font = "32px Arial";
    ctx.fillText("Гру завершено", canvas.width / 2 - 110, canvas.height / 2);
  }
}

// ===== Основний цикл =====
function loop() {
  if (!gameOver) update();
  draw();
  requestAnimationFrame(loop);
}

loop();

// ===== Перезапуск гри =====
restartBtn.addEventListener("click", () => {
  initGame();
});

// ===== Кнопка примусового завершення гри =====
const endGameBtn = document.getElementById("endGameBtn");

endGameBtn.addEventListener("click", () => {
  // 1. Ставимо прапорець, що гра закінчена
  gameOver = true;
  
  // 2. Показуємо кнопку перезапуску, щоб можна було почати знову
  restartBtn.style.display = "block";
  
  // Примітка: Функція draw() автоматично намалює напис "Гру завершено" 
  // і поточну статистику (score), тому що вона викликається в loop() постійно.
});
