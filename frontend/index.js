import { backend } from 'declarations/backend';

const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const equalsBtn = document.getElementById('equals');
const clearBtn = document.getElementById('clear');
const loading = document.getElementById('loading');

let currentValue = '';
let operator = '';
let firstOperand = null;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value');
        if (value === '+' || value === '-' || value === '*' || value === '/') {
            if (firstOperand === null) {
                firstOperand = parseFloat(currentValue);
                operator = value;
                currentValue = '';
            }
        } else {
            currentValue += value;
        }
        display.value = currentValue;
    });
});

clearBtn.addEventListener('click', () => {
    currentValue = '';
    operator = '';
    firstOperand = null;
    display.value = '';
});

equalsBtn.addEventListener('click', async () => {
    if (firstOperand !== null && operator && currentValue) {
        const secondOperand = parseFloat(currentValue);
        loading.style.display = 'block';
        try {
            let result;
            switch (operator) {
                case '+':
                    result = await backend.add(firstOperand, secondOperand);
                    break;
                case '-':
                    result = await backend.subtract(firstOperand, secondOperand);
                    break;
                case '*':
                    result = await backend.multiply(firstOperand, secondOperand);
                    break;
                case '/':
                    result = await backend.divide(firstOperand, secondOperand);
                    break;
            }
            display.value = result.toString();
            currentValue = result.toString();
            firstOperand = null;
            operator = '';
        } catch (error) {
            console.error('Error:', error);
            display.value = 'Error';
        } finally {
            loading.style.display = 'none';
        }
    }
});
