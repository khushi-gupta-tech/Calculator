const display = document.getElementById("display");
const buttons = document.querySelectorAll("input[type='button']");

let justEvaluated = false;

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.value;  
    const action = button.dataset.action;

    if (action === "clear") {
      display.value = "0";
    } else if (action === "delete") {
      display.value = display.value.length > 1
        ? display.value.slice(0, -1)
        : "0";
    } else if (action === "calculate") {
      try {
        display.value = evaluateExpression(display.value);
        justEvaluated = true;
      } catch {
        justEvaluated = false;
      }
    } else {
        // when justEvaluated true 
      if (justEvaluated && /[0-9]/.test(value)) {
        display.value = value;
      }
      // Replace initial 0
      else if (display.value === "0" && /[0-9]/.test(value)) {
        display.value = value;
      }
      // Prevent two operators in a row
      else if (isOperator(value) && isOperator(display.value.slice(-1))) {
        display.value = display.value.slice(0, -1) + value;
      }
      // Normal append
      else {
        display.value += value;
      }

      justEvaluated = false;
    }
  });
});

function evaluateExpression(expr) {
  expr = expr.replace(/\b0+(\d+)/g, (_, num) => num); // Remove leading zeros
  if (/[^0-9+\-*/.()]/.test(expr)) throw new Error("Invalid character");

  while (isOperator(expr.slice(-1))) {
    expr = expr.slice(0, -1);
  }

  return Function(`'use strict'; return (${expr})`)();
}

function isOperator(char) {
  return ['+', '-', '*', '/'].includes(char);
}
