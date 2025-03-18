"use strict";

// Definir el tipo del valor actual del input
let current = 0;

// Función para sumar el valor al input y formatear como moneda
function addAmount(amount) {
    const amountInput = document.getElementById('valueInput');
    const newAmount = amount //current + amount;

    const numberf = new Intl.NumberFormat('es-ES', {
        style: 'decimal',
        minimumFractionDigits: 2,
    }).format(newAmount);

    amountInput.value = `$${numberf}`;
    current = newAmount;
}

// Función para limpiar el valor del input
function clearAmount() {
    const amountInput = document.getElementById('valueInput');
    amountInput.value = '';
    current = 0;
}

// Función para obtener el valor actual
function getCurrentAmount() {
    const amountInput = document.getElementById('valueInput');
    return amountInput.value;
}
