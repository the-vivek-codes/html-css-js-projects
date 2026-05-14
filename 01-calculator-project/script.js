const display = document.querySelector(".display");
const screen = document.getElementById("screen");
const buttons = document.querySelectorAll(".btn");
const historyPopup = document.getElementById("historyPopup");
const historyList = document.getElementById("historyList");
const clearHistory = document.getElementById("clearHistory");
let history = [];
let expression = "";
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        if (expression.length >= 50 && button.id !== "allClear" && button.id !== "backspace") {
            return;
        }
        if (button.id === "history") {
            historyPopup.style.display = "block";
            historyList.innerHTML = "";
            history.forEach((item) => {
                const li = document.createElement("li");
                li.innerText = item;
                historyList.appendChild(li);
            });
            return;
        }
        if (button.id === "allClear") {
            expression = "";
        }
        else if (button.id === "backspace") {
            expression = expression.slice(0,-1);
        }
        else if (button.id === "equals") {
            try {
                if (expression === "") return;
                const originalExpression = expression;
                expression = parseFloat(eval(expression).toFixed(10)).toString();
                history.unshift(
                    `${originalExpression} = ${expression}`
                );
                if (history.length > 10) history.pop();
            }
            catch (error) {
                expression = "Error";
            }
        }
        else if (button.id === "division") addOperator("/");
        else if (button.id === "prod") addOperator("*");
        else if (button.id === "sub") addOperator("-");
        else if (button.id === "add") addOperator("+");

        else if (button.id === "decimal") {
            const parts = expression.split(/[\+\-\*\/]/);
            const currentNumber = parts[parts.length - 1];
            if (currentNumber.includes(".")) return;
            expression += ".";
        }
        
        else expression += button.innerText;     //Numbers

        screen.innerText = expression;
        display.scrollTop = display.scrollHeight;
    });
});

function addOperator(operator) {
    const lastChar = expression[expression.length - 1];
    if (lastChar === "+" || lastChar === "-" || lastChar === "*" || lastChar === "/") return;
    if (expression === "") return;
    expression += operator;
    screen.innerText  = expression;
}

clearHistory.addEventListener("click", () => {
    history = [];
    historyList.innerHTML = "";
});

document.addEventListener("click", (event) => {
    if (!historyPopup.contains(event.target) && event.target.id !=="history") {
        historyPopup.style.display = "none";
    }
});
