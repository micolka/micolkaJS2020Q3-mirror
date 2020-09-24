class Calculator {
  constructor(currentOperand, previousOperand) {
    this.currentOperand = currentOperand;
    this.previousOperand = previousOperand;
    this.allClear();
    this.display();
  }

  allClear() {
    this.currentOperandValue = '0';
    this.previousOperandValue = '';
    this.operator = undefined;
    this.isCalculated = false;
  }

  deleteNumber() {
    if (this.currentOperandValue === '0') return;
    this.currentOperandValue = String(this.currentOperandValue)
      .slice(0, this.currentOperandValue.length - 1);
    if (this.currentOperandValue === '') this.currentOperandValue = '0';
  }

  inputNumbers(number) {
    if (this.isCalculated) {
      this.isCalculated = false;
      this.currentOperandValue = '';
    }
    if (this.currentOperandValue.includes('.') && number === '.') return;
    if (this.currentOperandValue === '0' && number === '0') {
      return;
    } else if (this.currentOperandValue === '0' && number === '.') {
      this.currentOperandValue = `${this.currentOperandValue}${number}`;
    } else if (this.currentOperandValue === '0' && number !== '0'){
      this.currentOperandValue = number;
    } else {
      this.currentOperandValue = `${this.currentOperandValue}${number}`;
    }
  }

  inputOperation(operator) {
    if (this.operator) {
      this.calculate();
      this.previousOperandValue = this.currentOperandValue;
    } 
    this.previousOperandValue = `${this.currentOperandValue}${operator}`;
    this.currentOperandValue = '0';
    this.operator = operator;
  }

  display() {
    this.currentOperand.textContent = String(this.currentOperandValue);
    this.previousOperand.textContent = String(this.previousOperandValue);
  }

  calculate() {
    switch(this.operator) {
      case '+': this.currentOperandValue = Number(this.currentOperandValue) 
      + Number(this.previousOperandValue.slice(0, this.previousOperandValue.length - 1));
      break;
      case '-': this.currentOperandValue = Number(this.previousOperandValue
        .slice(0, this.previousOperandValue.length - 1)) - Number(this.currentOperandValue);
      break;
      case '*': this.currentOperandValue = Number(this.currentOperandValue) 
      * Number(this.previousOperandValue.slice(0, this.previousOperandValue.length - 1));
      break;
      case '÷': this.currentOperandValue = Number(this.previousOperandValue
        .slice(0, this.previousOperandValue.length - 1)) / Number(this.currentOperandValue);
      break;
      default: return;
    }
    this.currentOperandValue = Math.floor(this.currentOperandValue * 1e15) / 1e15;
    this.previousOperandValue = '';
    this.operator = undefined;
    this.isCalculated = true;
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