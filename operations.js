// =============================================
//  operations.js — Person 2: Math Operations
//  Group Calculator
//  Handles: add, subtract, multiply, divide
// =============================================

/**
 * Adds two numbers.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function add(a, b) {
  return a + b;
}

/**
 * Subtracts b from a.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function subtract(a, b) {
  return a - b;
}

/**
 * Multiplies two numbers.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function multiply(a, b) {
  return a * b;
}

/**
 * Divides a by b.
 * Returns an error string if b is zero — handled visually by events.js.
 * @param {number} a
 * @param {number} b
 * @returns {number|string}
 */
function divide(a, b) {
  if (b === 0) {
    return "Error: ÷ by 0";
  }
  return a / b;
}

/**
 * Master calculate function.
 * Takes two numbers and an operator string (+, -, *, /)
 * and routes to the correct operation.
 *
 * @param {number} a  - First operand
 * @param {string} op - Operator: '+' | '-' | '*' | '/'
 * @param {number} b  - Second operand
 * @returns {number|string}
 */
function calculate(a, op, b) {
  const numA = parseFloat(a);
  const numB = parseFloat(b);

  if (isNaN(numA) || isNaN(numB)) {
    return "Error: Invalid input";
  }

  let result;

  switch (op) {
    case "+":
      result = add(numA, numB);
      break;
    case "-":
      result = subtract(numA, numB);
      break;
    case "*":
      result = multiply(numA, numB);
      break;
    case "/":
      result = divide(numA, numB);
      break;
    default:
      return "Error: Unknown operator";
  }

  // Round floating-point precision issues (e.g. 0.1 + 0.2)
  if (typeof result === "number") {
    result = parseFloat(result.toPrecision(12));
  }

  return result;
}
