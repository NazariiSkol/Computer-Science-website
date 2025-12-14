const demoDrone = document.getElementById("demoDrone");
const startBtn = document.getElementById("startAnimation");
const stopBtn = document.getElementById("stopAnimation");

// Змінні стану анімації
let position = 0;        // поточна позиція дрона по осі X
let direction = 1;       // напрямок руху: 1 - вправо, -1 - вліво
let animationId = null;  // ідентифікатор таймера setInterval

// Функція, що рухає дрон
function animateDrone() {
  // змінюємо позицію в залежності від напрямку
  position += 2 * direction;

  // якщо дрон дійшов до правого краю (умовно 260px) – розвертаємо
  if (position > 260) {
    direction = -1;
  }

  // якщо дійшов до лівого краю – розвертаємо вправо
  if (position < 0) {
    direction = 1;
  }

  // застосовуємо трансформацію до елемента (зміщуємо по X)
  demoDrone.style.transform = `translate( ${position}px, -50% )`;
}

// Обробник кнопки "Запустити патрулювання"
startBtn.addEventListener("click", () => {
  // якщо анімація ще не запущена
  if (animationId === null) {
    // запускаємо анімацію кожні 20 мілісекунд
    animationId = setInterval(animateDrone, 20);
  }
});

// Обробник кнопки "Зупинити"
stopBtn.addEventListener("click", () => {
  // якщо анімація була запущена
  if (animationId !== null) {
    clearInterval(animationId); // зупиняємо таймер
    animationId = null;         // скидаємо змінну
  }
});