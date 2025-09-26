const choices = ["piedra", "papel", "tijera"];
const buttons = document.querySelectorAll("button[data-choice]");
const playerDisplay = document.getElementById("player-choice");
const computerDisplay = document.getElementById("computer-choice");
const outcomeDisplay = document.getElementById("outcome");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const playerChoice = button.dataset.choice;
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    const result = getResult(playerChoice, computerChoice);

    playerDisplay.textContent = `Tu elección: ${playerChoice}`;
    computerDisplay.textContent = `Computadora: ${computerChoice}`;
    outcomeDisplay.textContent = `Resultado: ${result}`;

    animateResult();
  });
});

function getResult(player, computer) {
  if (player === computer) return "¡Empate!";
  if (
    (player === "piedra" && computer === "tijera") ||
    (player === "papel" && computer === "piedra") ||
    (player === "tijera" && computer === "papel")
  ) {
    return "¡Ganaste!";
  }
  return "Perdiste...";
}

function animateResult() {
  outcomeDisplay.style.animation = "none";
  outcomeDisplay.offsetHeight; // Trigger reflow
  outcomeDisplay.style.animation = "fadeIn 0.5s ease";
}
