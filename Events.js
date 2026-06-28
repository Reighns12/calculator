// =============================================
//  events.js — Person 3: Input & Event Handling
//  Group Calculator
//  Handles: button clicks, state, display updates
//  Depends on: operations.js (must load first)
// =============================================

// ---- Calculator State ----
const state = {
  currentInput: "",   // The number being typed right now
  operator: null,     // The pending operator (+, -, *, /)
  previousInput: "",  // The first operand stored after operator press
  expression: "",     // Full expression string shown above display
  justCalculated: false // Flag: did we just press = ?
};

// ---- DOM References ----
const resultDisplay   = document.getElementById("result");
const expressionDisplay = document.getElementById("expression");

// ---- Update Display ----
function updateDisplay(value) {
  resultDisplay.textContent = value;
  resultDisplay.classList.toggle("error", typeof value === "string" && value.startsWith("Error"));
}

function updateExpression(text) {
  expressionDisplay.textContent = text;
}

// ---- Handle Number / Decimal Button ----
function handleNumber(num) {
  // After = is pressed, start fresh
  if (state.justCalculated) {
    state.currentInput = "";
    state.justCalculated = false;
  }

  // Only one decimal point allowed
  if (num === "." && state.currentInput.includes(".")) return;

  // Prevent leading zeros (except "0.")
  if (num !== "." && state.currentInput === "0") {
    state.currentInput = num;
  } else {
    state.currentInput += num;
  }

  updateDisplay(state.currentInput || "0");
}

// ---- Handle Operator Button ----
function handleOperator(op) {
  if (state.currentInput === "" && state.previousInput === "") return;

  // If there's a pending operation and new input, chain it
  if (state.previousInput !== "" && state.currentInput !== "" && state.operator) {
    const chained = calculate(state.previousInput, state.operator, state.currentInput);
    if (typeof chained === "string") {
      updateDisplay(chained);
      updateExpression("");
      resetState();
      return;
    }
    state.previousInput = String(chained);
    updateDisplay(state.previousInput);
  } else if (state.currentInput !== "") {
    state.previousInput = state.currentInput;
  }

  state.operator    = op;
  state.currentInput = "";
  state.justCalculated = false;

  const symbol = opSymbol(op);
  state.expression = state.previousInput + " " + symbol;
  updateExpression(state.expression);
}

// ---- Handle Equals ----
function handleEquals() {
  if (state.previousInput === "" || state.currentInput === "" || !state.operator) return;

  const fullExpr = state.previousInput + " " + opSymbol(state.operator) + " " + state.currentInput;
  const result = calculate(state.previousInput, state.operator, state.currentInput);

  updateExpression(fullExpr + " =");
  updateDisplay(result);

  if (typeof result !== "string") {
    state.previousInput = String(result);
    state.currentInput  = "";
    state.operator      = null;
    state.justCalculated = true;
  } else {
    // Error — reset everything
    resetState();
  }
}

// ---- Handle Backspace ----
function handleBackspace() {
  if (state.justCalculated) {
    resetState();
    updateDisplay("0");
    updateExpression("");
    return;
  }
  state.currentInput = state.currentInput.slice(0, -1);
  updateDisplay(state.currentInput || "0");
}

// ---- Handle Clear (AC) ----
function handleClear() {
  resetState();
  updateDisplay("0");
  updateExpression("");
}

// ---- Reset Internal State ----
function resetState() {
  state.currentInput    = "";
  state.operator        = null;
  state.previousInput   = "";
  state.expression      = "";
  state.justCalculated  = false;
}

// ---- Operator Symbol Lookup ----
function opSymbol(op) {
  return { "+": "+", "-": "−", "*": "×", "/": "÷" }[op] || op;
}

// ---- Attach Button Event Listeners ----
document.addEventListener("DOMContentLoaded", () => {

  // Number & decimal buttons
  document.querySelectorAll(".btn-number").forEach(btn => {
    btn.addEventListener("click", () => handleNumber(btn.dataset.num));
  });

  // Operator buttons
  document.querySelectorAll(".btn-operator").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.dataset.op === "backspace") {
        handleBackspace();
      } else {
        handleOperator(btn.dataset.op);
      }
    });
  });

  // Equals
  document.getElementById("btn-equals").addEventListener("click", handleEquals);

  // Clear
  document.getElementById("btn-clear").addEventListener("click", handleClear);

  // ---- Keyboard Support ----
  document.addEventListener("keydown", (e) => {
    if (e.key >= "0" && e.key <= "9") handleNumber(e.key);
    else if (e.key === ".")            handleNumber(".");
    else if (e.key === "+")            handleOperator("+");
    else if (e.key === "-")            handleOperator("-");
    else if (e.key === "*")            handleOperator("*");
    else if (e.key === "/")          { e.preventDefault(); handleOperator("/"); }
    else if (e.key === "Enter" || e.key === "=") handleEquals();
    else if (e.key === "Backspace")    handleBackspace();
    else if (e.key === "Escape")       handleClear();
  });

});
