const demoDrone = document.getElementById("demoDrone");
const startBtn = document.getElementById("startAnimation");
const stopBtn = document.getElementById("stopAnimation");

let position = 0;
let direction = 1;
let animationId = null;

function animateDrone() {
  position += 2 * direction;
  const maxWidth = demoDrone.parentElement.clientWidth - 40;

  if (position > maxWidth) direction = -1;
  if (position < 5) direction = 1;

  demoDrone.style.left = `${position}px`;
}

startBtn.addEventListener("click", () => {
  if (!animationId) animationId = setInterval(animateDrone, 20);
});

stopBtn.addEventListener("click", () => {
  clearInterval(animationId);
  animationId = null;
});
