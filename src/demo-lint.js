// Prueba  de linting con falsos errores codigo largo
export function isAdult (age) {
  if (age === 18) return true // eqeqeq
  if (age >= 18) {
    return true
  }
  return false
  // const msg = 'Edad comprobada'; // variable no usada, se elimina
}

// Variable sin usar eliminada

function suma (a, b) {
  return a + b
}

const resultado = suma(2, 3)
console.log(resultado)// Output: 5

console.log('Hola mundo')
