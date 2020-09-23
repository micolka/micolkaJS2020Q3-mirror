class Calculator {
  constructor(currentOperand, previousOperand) {
    this.currentOperand = currentOperand;
    this.previousOperand = previousOperand;
    this.allClear();
    this.display();
  }

  allClear() {
    this.currentOperandText = '0';
    this.previousOperandText = '';
    this.operator = undefined;
  }

  deleteNumber() {
    if (this.currentOperandText === '0') return;
    this.currentOperandText = String(this.currentOperandText)
      .slice(0, this.currentOperandText.length - 1);
    if (this.currentOperandText === '') this.currentOperandText = '0';
  }

  inputNumbers(number) {
    if (this.currentOperandText.includes('.') && number === '.') return;
    if (this.currentOperandText === '0' && number === '0') {
      return;
    } else if (this.currentOperandText === '0' && number === '.') {
      this.currentOperandText = `${this.currentOperandText}${number}`;
    } else if (this.currentOperandText === '0' && number !== '0'){
      this.currentOperandText = number;
    } else {
      this.currentOperandText = `${this.currentOperandText}${number}`;
    }
  }

  inputOperation(operator) {
    if (this.operator) {
      this.previousOperandText = this.previousOperandText
      .slice(0, this.previousOperandText.length - 1);
      this.previousOperandText = `${this.previousOperandText}${operator}`;
    } else {
      this.previousOperandText = `${this.currentOperandText}${operator}`;
    }
    this.currentOperandText = '0';
    this.operator = operator;
  }

  display() {
    this.currentOperand.textContent = String(this.currentOperandText);
    this.previousOperand.textContent = String(this.previousOperandText);
  }

  calculate() {
    switch(this.operator) {
      case '+': this.currentOperandText = Number(this.currentOperandText) 
      + Number(this.previousOperandText.slice(0, this.previousOperandText.length - 1));
      break;
      case '-': this.currentOperandText = Number(this.previousOperandText
        .slice(0, this.previousOperandText.length - 1)) - Number(this.currentOperandText);
      break;
      case '*': this.currentOperandText = Number(this.currentOperandText) 
      * Number(this.previousOperandText.slice(0, this.previousOperandText.length - 1));
      break;
      case '÷': this.currentOperandText = Number(this.previousOperandText
        .slice(0, this.previousOperandText.length - 1)) / Number(this.currentOperandText);
      break;
      default: return;
    }
    this.previousOperandText = '';
    this.operator = undefined;
  }
}

let numberButtons = document.querySelectorAll("[data-number]");
let operationButtons = document.querySelectorAll("[data-operation]");
let delButton = document.querySelector("[data-delete]");
let acButton = document.querySelector("[data-all-clear]");
let equalsButton = document.querySelector("[data-equals]");
let currentOperand = document.querySelector("[data-current-operand]");
let previousOperand = document.querySelector("[data-previous-operand]");

let myCalc = new Calculator(currentOperand, previousOperand);


numberButtons.forEach((el) => {
  el.addEventListener("click", () => {
    myCalc.inputNumbers(el.textContent);
    myCalc.display();
  });
});

operationButtons.forEach((el) => {
  el.addEventListener("click", () => {
    myCalc.inputOperation(el.textContent);
    myCalc.display();
  });
});

delButton.addEventListener("click", () => {
  myCalc.deleteNumber();
  myCalc.display();
});

acButton.addEventListener("click", () => {
  myCalc.allClear();
  myCalc.display();
});

equalsButton.addEventListener("click", () => {
  myCalc.calculate();
  myCalc.display();
});