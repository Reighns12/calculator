// =============================================
//  events.js — Person 3: Input & Event Handling
//  Group Calculator
//  Handles: button clicks, state, display updates
//  Depends on: operations.js (must load first)
// =============================================

// ---- Calculator State ----
const state = {
  currentInput: "0",   // Start with "0" not empty
  operator: null,
  previousInput: "",
  expression: "",
  justCalculated: false
};

// ---- DOM References ----
const resultDisplay = document.getElementById("result");
const expressionDisplay = document.getElementById("expression");

// ---- Update Display ----
function updateDisplay(value) {
  // Always show at least "0"
  const displayValue = value || "0";
  resultDisplay.textContent = displayValue;
  
  // Add error styling if needed
  if (typeof displayValue === "string" && displayValue.includes("Error")) {
    resultDisplay.style.color = "#ff6b6b";
  } else {
    resultDisplay.style.color = "";
  }
}

function updateExpression(text) {
  expressionDisplay.textContent = text || "";
}

// ---- Handle Number / Decimal Button ----
function handleNumber(num) {
  console.log("Number pressed:", num); // Debug log
  
  // If we just calculated, start fresh
  if (state.justCalculated) {
    state.currentInput = "0";
    state.justCalculated = false;
  }

  // If current input is "0" and we're not adding a decimal, replace it
  if (state.currentInput === "0" && num !== ".") {
    state.currentInput = num;
  } else {
    // Only one decimal point allowed
    if (num === "." && state.currentInput.includes(".")) {
      return;
    }
    state.currentInput += num;
  }

  // Update the display
  updateDisplay(state.currentInput);
  console.log("Current input:", state.currentInput);
}

// ---- Handle Operator Button ----
function handleOperator(op) {
  console.log("Operator pressed:", op);
  
  // If no current input and no previous input, ignore
  if (state.currentInput === "0" && state.previousInput === "") return;

  // If we just calculated, use the result as the first operand
  if (state.justCalculated) {
    state.previousInput = state.currentInput;
    state.justCalculated = false;
  }

  // If there's a pending operation and new input, chain it
  if (state.previousInput !== "" && state.currentInput !== "0" && state.operator) {
    const chained = calculate(state.previousInput, state.operator, state.currentInput);
    if (typeof chained === "string") {
      updateDisplay(chained);
      updateExpression("");
      resetState();
      return;
    }
    state.previousInput = String(chained);
    updateDisplay(state.previousInput);
  } else if (state.currentInput !== "0") {
    state.previousInput = state.currentInput;
  } else if (state.previousInput === "") {
    state.previousInput = "0";
  }

  state.operator = op;
  state.currentInput = "0";
  state.justCalculated = false;

  const symbol = getOperatorSymbol(op);
  state.expression = state.previousInput + " " + symbol;
  updateExpression(state.expression);
}

// ---- Handle Equals ----
function handleEquals() {
  console.log("Equals pressed");
  
  if (state.previousInput === "" || state.currentInput === "0" || !state.operator) {
    return;
  }

  const fullExpr = state.previousInput + " " + getOperatorSymbol(state.operator) + " " + state.currentInput;
  const result = calculate(state.previousInput, state.operator, state.currentInput);

  updateExpression(fullExpr + " =");
  updateDisplay(result);

  if (typeof result !== "string") {
    state.previousInput = String(result);
    state.currentInput = "0";
    state.operator = null;
    state.justCalculated = true;
  } else {
    // Error - reset
    resetState();
    updateDisplay("0");
    updateExpression("");
  }
}

// ---- Handle Backspace ----
function handleBackspace() {
  console.log("Backspace pressed");
  
  if (state.justCalculated) {
    resetState();
    updateDisplay("0");
    updateExpression("");
    return;
  }
  
  if (state.currentInput.length <= 1) {
    state.currentInput = "0";
  } else {
    state.currentInput = state.currentInput.slice(0, -1);
  }
  
  updateDisplay(state.currentInput);
}

// ---- Handle Clear ----
function handleClear() {
  console.log("Clear pressed");
  resetState();
  updateDisplay("0");
  updateExpression("");
}

// ---- Reset ----
function resetState() {
  state.currentInput = "0";
  state.operator = null;
  state.previousInput = "";
  state.expression = "";
  state.justCalculated = false;
}

// ---- Helper: Get Operator Symbol ----
function getOperatorSymbol(op) {
  const symbols = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷"
  };
  return symbols[op] || op;
}

// ---- Initialize Event Listeners ----
document.addEventListener("DOMContentLoaded", function() {
  console.log("Calculator initialized!");
  
  // Number buttons
  document.querySelectorAll(".btn-number").forEach(btn => {
    btn.addEventListener("click", function(e) {
      const num = this.dataset.num;
      console.log("Number button clicked:", num);
      handleNumber(num);
    });
  });

  // Operator buttons
  document.querySelectorAll(".btn-operator").forEach(btn => {
    btn.addEventListener("click", function() {
      const op = this.dataset.op;
      if (op === "backspace") {
        handleBackspace();
      } else {
        handleOperator(op);
      }
    });
  });

  // Equals button
  document.getElementById("btn-equals").addEventListener("click", handleEquals);

  // Clear button
  document.getElementById("btn-clear").addEventListener("click", handleClear);

  // Keyboard support
  document.addEventListener("keydown", function(e) {
    const key = e.key;
    
    // Prevent default for calculator keys
    if (["0","1","2","3","4","5","6","7","8","9",".","+","-","*","/","Enter","=","Backspace","Escape"].includes(key)) {
      e.preventDefault();
    }

    if (key >= "0" && key <= "9") handleNumber(key);
    else if (key === ".") handleNumber(".");
    else if (key === "+") handleOperator("+");
    else if (key === "-") handleOperator("-");
    else if (key === "*") handleOperator("*");
    else if (key === "/") handleOperator("/");
    else if (key === "Enter" || key === "=") handleEquals();
    else if (key === "Backspace") handleBackspace();
    else if (key === "Escape") handleClear();
  });

  // Initial display
  updateDisplay("0");
  updateExpression("");
  console.log("Ready!");
});
