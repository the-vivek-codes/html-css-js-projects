const resultText = document.getElementById("resultText");
const winsEl = document.getElementById("wins");
const lossesEl = document.getElementById("losses");
const tiesEl = document.getElementById("ties");
const resetScore = document.getElementById("reset-score");

function updateScore() {
    winsEl.textContent = score.wins;
    lossesEl.textContent = score.losses;
    tiesEl.textContent = score.ties;
}
function getResult(user, computerChoice) {
    if (user === computerChoice) {
        score.ties++;
        return "TIE";
    }
    if ((user === "rock" && computerChoice === "scissor") || (user === "paper" && computerChoice === "rock") || (user === "scissor" && computerChoice === "paper")) {
        score.wins++;
        return "YOU WON";
    }
    score.losses++;
    return "YOU LOST";
}
function showResultAnimation() {
    resultText.classList.remove("show");
    setTimeout(() => {
        resultText.classList.add("show");
    }, 10);
}

let score = JSON.parse(localStorage.getItem("score"));
if (score === null) {
    score = {
        wins: 0,
        losses: 0,
        ties: 0
    };
}
updateScore();

const emojis = {
    rock: "👊",
    paper: "🖐️",
    scissor: "✌️"
}
const choices = document.querySelectorAll(".choice");
choices.forEach((choice) => {
    choice.addEventListener("click", () => {
        const user = choice.id;
        const options = ["rock", "paper", "scissor"];
        const computerChoice = options[Math.floor(Math.random() * 3)];

        const result = getResult(user, computerChoice);
        if (result === "YOU WON") resultText.style.backgroundColor = "#16a34a";
        else if (result === "YOU LOST") resultText.style.backgroundColor = "#dc2626";
        else resultText.style.backgroundColor = "#6b7280";
        resultText.innerHTML = `${result} <br> Your choice: ${emojis[user]} <br> Computer's choice: ${emojis[computerChoice]}`;
        showResultAnimation();

        updateScore();

        localStorage.setItem("score", JSON.stringify(score));
    });
});

resetScore.addEventListener("click", () => {
    score.wins = 0;
    score.losses = 0;
    score.ties = 0;
    updateScore();

    localStorage.removeItem("score");
    resultText.textContent = "Score Reset!";
    resultText.style.backgroundColor = "#2563eb";
    showResultAnimation();
});