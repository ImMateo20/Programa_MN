import pkg from "colors";
import readline from "readline";
import { evaluate, typeOf, isNegative, isPositive, round } from "mathjs";
import algebra, { Fraction } from "algebra.js";

function limpiarConsole() {
  return process.stdout.write("\x1b[2J\x1b[3J\x1b[H");
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function obtenerRespuesta(pregunta) {
  return new Promise((resultado) => {
    rl.question(pregunta, resultado);
  });
}

class Fraccion {
  constructor(numerador, denominador = 1) {
    this.numerador = numerador;
    this.denominador = denominador;
    this.simplificar();
  }

  toTexto() {
    return this.denominador === 1
      ? ` ${this.numerador} `
      : ` ${this.numerador}/${this.denominador} `;
  }

  toNumero() {
    return this.denominador === 1
      ? this.numerador
      : this.numerador / this.denominador;
  }

  simplificar() {
    const mcd = this.calcularMCD(this.numerador, this.denominador);
    this.numerador = this.numerador / mcd;
    this.denominador = this.denominador / mcd;
    if (this.denominador < 0) {
      this.numerador = -this.numerador;
      this.denominador = -this.denominador;
    }
  }

  calcularMCD(a, b) {
    while (b !== 0) {
      let temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }
}

let matriz;
let matrizAuxiliar;

async function preguntar() {
  let numEcuaciones = await obtenerRespuesta(
    "Cuantas ecuaciones ingresaras?:".bgBlue
  );
  numEcuaciones = parseInt(numEcuaciones);
  matriz = Array(numEcuaciones)
    .fill()
    .map(() => Array(numEcuaciones + 1).fill(0));
  matrizAuxiliar = Array(numEcuaciones)
    .fill()
    .map(() => Array(numEcuaciones + 1).fill(0));

  for (let fila = 0; fila < numEcuaciones; fila++) {
    console.log(`Ecuacion ${fila + 1}:`.magenta);
    const ecuacion = await obtenerRespuesta("Ingresa tu ecuacion: ");
    const ecuacionArray = extraerCoeficientes(ecuacion);
    matriz[fila] = ecuacionArray;
    console.log("");
  }

  inicializarMatrizAuxiliar();
}

function inicializarMatrizAuxiliar() {
  for (let fila = 0; fila < matriz.length; fila++) {
    for (let columna = 0; columna <= matriz.length; columna++) {
      if (fila == columna) {
        matrizAuxiliar[fila][columna] = new Fraccion(1);
      } else if (columna == matriz.length) {
        matrizAuxiliar[fila][columna] = matriz[fila][columna];
      } else {
        matrizAuxiliar[fila][columna] = new Fraccion(0);
      }
    }
  }
}

function mostrarMatriz(matr) {
  let matrizAMostrar = {};
  for (let fila = 0; fila < matriz.length; fila++) {
    let objetoEcuacion = {};
    for (let columna = 0; columna <= matriz.length; columna++) {
      objetoEcuacion[columna === matriz.length ? `v:` : `x${columna + 1}:`] =
        matr[fila][columna].toTexto();
    }
    matrizAMostrar[`Ecuacion${fila + 1}:`] = objetoEcuacion;
  }
  console.table(matrizAMostrar);
}

function mostrarMatrizSinIgualdad(matr) {
  let matrizAMostrar = {};
  for (let fila = 0; fila < matriz.length; fila++) {
    let objetoEcuacion = {};
    for (let columna = 0; columna < matriz.length; columna++) {
      objetoEcuacion[columna === matriz.length ? `v:` : `x${columna + 1}:`] =
        matr[fila][columna].toTexto();
    }
    matrizAMostrar[`Ecuacion${fila + 1}:`] = objetoEcuacion;
  }
  console.table(matrizAMostrar);
}

let parteMatriz = 1; //1 parte inferior izquierda, 2 parte superior derecha, 3 centros
let contador = 0;
let debemostrar = false;
function iniciar() {
  for (let filaAux = 0; filaAux < matriz.length; filaAux++) {
    for (let filaOrg = filaAux + 1; filaOrg < matriz.length; filaOrg++) {
      if (parteMatriz == 1) {
        debemostrar = operacionHacer0(
          matriz[filaOrg],
          matriz[filaAux],
          filaAux,
          filaOrg
        );

        if (debemostrar) {
          contador++;
        }
        if (filaAux == matriz.length - 2) {
          filaAux = matriz.length - 1;
          parteMatriz = 2;
          mostrarMatrizSinIgualdad(matriz);
          continue;
        }
      }
    }
    if (parteMatriz == 2) {
      operacionDespejarAUX(0);
      traspasarIgualdades();
      operacionDespejar(filaAux);
      return;
      // if (debemostrar) mostrarMatriz();
    } else if (contador > 0) {
      mostrarMatrizSinIgualdad(matriz);
      contador = 0;
    }
  }
}

const operacionesAMultiplicar0 = [];

function operacionHacer0(filaOriginal, filaAuxiliar, c, o) {
  if (filaOriginal[c].numerador == 0 || filaAuxiliar[c].numerador == 0)
    return false;
  let valorAMultiplicar = divisionFraccion(filaOriginal[c], filaAuxiliar[c]);
  matrizAuxiliar[o][c] = valorAMultiplicar;
  operacionesAMultiplicar0.push(valorAMultiplicar);
  valorAMultiplicar = multiplicarFraccion(valorAMultiplicar, new Fraccion(-1));

  let newFraccion = multiplicarFraccion(valorAMultiplicar, filaAuxiliar[c]);

  for (let columna = 0; columna < filaOriginal.length; columna++) {
    const valorFilaOrg = filaOriginal[columna];
    const valorFilaAux = filaAuxiliar[columna];

    newFraccion = multiplicarFraccion(valorAMultiplicar, valorFilaAux);

    filaOriginal[columna] = sumarFraccion(valorFilaOrg, newFraccion);
  }

  console.log("");
  console.log(
    `Fila ${o + 1} + (${valorAMultiplicar.toTexto()}) Fila ${c + 1}`.yellow
  );
  return true;
  // mostrarMatriz();
}

function operacionDespejar(c) {
  if (c >= 0) despejarEcuacion(c);
}

function despejarEcuacion(indice) {
  for (let index = indice + 1; index < matriz.length; index++) {
    matriz[indice][index] = multiplicarFraccion(
      matriz[indice][index],
      matriz[index][matriz.length]
    );
  }

  let stringFun = "(" + matriz[indice][indice].toTexto() + ")x";
  for (let index = indice + 1; index < matriz.length; index++) {
    stringFun += "+(" + matriz[indice][index].toTexto() + ")";
  }
  // matriz[indice][matriz.length] = funcion(stringFun, "x");

  const equation = algebra.Equation;
  const exp = algebra.parse(stringFun);
  const eq = new equation(
    exp,
    new Fraction(
      matriz[indice][matriz.length].numerador,
      matriz[indice][matriz.length].denominador
    )
  );
  const sol = eq.solveFor("x");

  console.log(
    `Despejando en la ecuacion ${indice + 1}: ${stringFun} = ` +
      matriz[indice][matriz.length].toTexto()
  );

  matriz[indice][matriz.length] = new Fraccion(sol.numer, sol.denom);

  console.log(
    `Resultado ecuacion ${indice + 1} = ` +
      matriz[indice][matriz.length].toTexto()
  );

  const indiceFila = indice - 1;
  if (indiceFila >= 0) despejarEcuacion(indiceFila);
}

function sumarFraccion(fraccion1, fraccion2) {
  const nuevoNumerador =
    fraccion1.numerador * fraccion2.denominador +
    fraccion1.denominador * fraccion2.numerador;
  const nuevoDenominador = fraccion1.denominador * fraccion2.denominador;
  return new Fraccion(nuevoNumerador, nuevoDenominador);
}

function restarFraccion(fraccion1, fraccion2) {
  const nuevoNumerador =
    fraccion1.numerador * fraccion2.denominador -
    fraccion1.denominador * fraccion2.numerador;
  const nuevoDenominador = fraccion1.denominador * fraccion2.denominador;
  return new Fraccion(nuevoNumerador, nuevoDenominador);
}

function multiplicarFraccion(fraccion1, fraccion2) {
  const nuevoNumerador = fraccion1.numerador * fraccion2.numerador;
  const nuevoDenominador = fraccion1.denominador * fraccion2.denominador;
  return new Fraccion(nuevoNumerador, nuevoDenominador);
}

function divisionFraccion(fraccion1, fraccion2) {
  if (fraccion2.numerador == 0) return new Fraccion(0);
  const nuevoNumerador = fraccion1.numerador * fraccion2.denominador;
  const nuevoDenominador = fraccion1.denominador * fraccion2.numerador;
  return new Fraccion(nuevoNumerador, nuevoDenominador);
}

function obtenerResiduo(fraccion1, fraccion2) {
  const division = divisionFraccion(fraccion1, fraccion2);
  const entero = Math.floor(division.numerador / division.denominador);
  return restarFraccion(
    fraccion1,
    new Fraccion(entero * fraccion2.numerador, fraccion2.denominador)
  );
}

function mostrarResultados() {
  for (let fila = 0; fila < matriz.length; fila++) {
    console.log(
      `x${fila + 1}: ${matriz[fila][
        matriz.length
      ].toTexto()}  y en decimal: ${matriz[fila][matriz.length].toNumero()}`
        .bgRed
    );
  }
  console.log("");
}

function extraerFraccion(coeficiente) {
  // Si el coeficiente contiene '/', lo dividimos y calculamos la fracción
  if (coeficiente.includes("/")) {
    const [numerator, denominator] = coeficiente.split("/");
    return new Fraccion(parseInt(numerator), parseInt(denominator));
  }
  // Si no es fracción, solo convertimos a número
  return new Fraccion(parseInt(coeficiente));
}

function extraerCoeficientes(equation) {
  // Elimina los espacios en blanco
  equation = equation.replace(/\s+/g, "");

  // Divide la ecuación en las dos partes (antes y después del '=')
  const [ladoIzquierdo, ladoDerecho] = equation.split("=");

  // Expresión regular para extraer coeficientes y variables
  const regex = /([+-]?(\d+\/\d+|\d*\.?\d+)?)([a-zA-Z]\w*)/g;
  let match;
  let coeficientes = [];

  // Extraer coeficientes de la parte izquierda de la ecuación
  while ((match = regex.exec(ladoIzquierdo)) !== null) {
    let coeficiente = match[1]; // Captura el coeficiente

    // Si no hay un coeficiente explícito, se asume que es 1 o -1
    if (!coeficiente || coeficiente === "+" || coeficiente === "-") {
      coeficiente = coeficiente === "-" ? "-1" : "1"; // Si es '-', -1, de lo contrario, 1
    }

    // Procesar el coeficiente usando la función extraerFraccion
    coeficientes.push(extraerFraccion(coeficiente));
  }

  // Agregar el valor después del '=' al array
  coeficientes.push(new Fraccion(parseInt(ladoDerecho))); // Convierte el valor de la derecha en número

  return coeficientes;
}

limpiarConsole();
await preguntar();
console.log(matrizAuxiliar.length);
console.log("Matriz inicial:".bgMagenta);
mostrarMatriz(matriz);
console.log("Matriz Auxiliar:".bgMagenta);
mostrarMatriz(matrizAuxiliar);
await obtenerRespuesta("PRESIONA ENTER PARA CONTINUAR");
limpiarConsole();
console.log("Matriz original:".bgMagenta);
mostrarMatriz(matriz);
console.log("Procesos:".bgMagenta);
iniciar();
console.log("Resultados:".bgBlue);
mostrarResultados();
// operacionesAMultiplicar0.forEach((oper) => {
//   console.log(oper);
// });

rl.close();

function operacionDespejarAUX(c) {
  console.log("Matriz N:".bgMagenta);
  mostrarMatriz(matrizAuxiliar);
  console.log("Matriz AUX despejada: ");
  if (c < matrizAuxiliar.length) despejarEcuacionAUX(c);
  // mostrarMatriz();
}

function despejarEcuacionAUX(indice) {
  for (let index = 0; index < indice; index++) {
    matrizAuxiliar[indice][index] = multiplicarFraccion(
      matrizAuxiliar[indice][index],
      matrizAuxiliar[index][matrizAuxiliar.length]
    );
  }

  let stringFun = " ";
  for (let index = 0; index < indice; index++) {
    stringFun += "(" + matrizAuxiliar[indice][index].toTexto() + ")+";
  }
  stringFun += "(" + matrizAuxiliar[indice][indice].toTexto() + ")x";
  // matriz[indice][matriz.length] = funcion(stringFun, "x");

  const equation = algebra.Equation;
  const exp = algebra.parse(stringFun);
  const eq = new equation(
    exp,
    new Fraction(
      matrizAuxiliar[indice][matrizAuxiliar.length].numerador,
      matrizAuxiliar[indice][matrizAuxiliar.length].denominador
    )
  );
  const sol = eq.solveFor("x");

  console.log(
    `Despejando en la ecuacion ${indice + 1}: ${stringFun} = ` +
      matrizAuxiliar[indice][matrizAuxiliar.length].toTexto()
  );

  matrizAuxiliar[indice][matrizAuxiliar.length] = new Fraccion(
    sol.numer,
    sol.denom
  );

  console.log(
    `Resultado ecuacion ${indice + 1} = ` +
      matrizAuxiliar[indice][matrizAuxiliar.length].toTexto()
  );

  const indiceFila = indice + 1;
  if (indiceFila < matrizAuxiliar.length) {
    despejarEcuacionAUX(indiceFila);
  }
}

function traspasarIgualdades() {
  for (let i = 0; i < matriz.length; i++) {
    matriz[i][matriz.length] = matrizAuxiliar[i][matriz.length];
  }

  console.log("Nueva igualacion de matriz original: ".bgMagenta );
  mostrarMatriz(matriz);
}
