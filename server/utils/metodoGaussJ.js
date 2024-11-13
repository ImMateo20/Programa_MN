import { isPositive, isNegative, isZero } from "mathjs";
import pkg from "colors";
import readline from "readline";

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

// let matriz;

async function preguntar() {
  let numEcuaciones = await obtenerRespuesta(
    "Cuantas ecuaciones ingresaras?:".bgBlue
  );
  numEcuaciones = parseInt(numEcuaciones);
  matriz = Array(numEcuaciones)
    .fill()
    .map(() => Array(numEcuaciones + 1).fill(0));

  for (let fila = 0; fila < numEcuaciones; fila++) {
    console.log(`Ecuacion ${fila + 1}:`.magenta);
    const ecuacion = await obtenerRespuesta("Ingresa tu ecuacion: ");
    const ecuacionArray = extraerCoeficientes(ecuacion);
    matriz[fila] = ecuacionArray;
    console.log("");
  }
}

function mostrarMatriz() {
  let matrizAMostrar = {};
  for (let fila = 0; fila < matriz.length; fila++) {
    let objetoEcuacion = {};
    for (let columna = 0; columna <= matriz.length; columna++) {
      objetoEcuacion[columna === matriz.length ? `v:` : `x${columna + 1}:`] =
        matriz[fila][columna].toTexto();
    }
    matrizAMostrar[`Ecuacion${fila + 1}:`] = objetoEcuacion;
  }
  console.table(matrizAMostrar);
  TOSERVER.push({
    operacionesSVG: operacionesAuxSERVER,
    matrizSVG: matriz.map((s) => [...s]),
  });
}

let parteMatriz = 1; //1 parte inferior izquierda, 2 parte superior derecha, 3 centros
let contador = 0;
let debemostrar = false;

let TOSERVER = [];
let operacionesAuxSERVER = [];

function iniciar() {
  for (let filaAux = 0; filaAux < matriz.length; filaAux++) {
    if (parteMatriz != 3) operacionesAuxSERVER = [];
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
          filaAux = -1;
          parteMatriz = 2;
          continue;
        }
      }

      if (parteMatriz == 2) {
        debemostrar = operacionHacer0(
          matriz[matriz.length - 1 - filaOrg],
          matriz[matriz.length - 1 - filaAux],
          matriz.length - 1 - filaAux,
          matriz.length - 1 - filaOrg
        );
        if (debemostrar) {
          contador++;
        }

        if (filaAux == matriz.length - 2) {
          filaAux = 0;
          parteMatriz = 3;
          if (contador > 0) {
            mostrarMatriz();
          }
          operacionesAuxSERVER = [];
          continue;
        }
      }
    }
    if (parteMatriz == 3) {
      debemostrar = operacionHacer1(matriz[filaAux], filaAux);
      if (filaAux == matriz.length - 1) mostrarMatriz();
      // if (debemostrar) mostrarMatriz();
    } else if (contador > 0) {
      mostrarMatriz();
      contador = 0;
    }
  }
}

function operacionHacer0(filaOriginal, filaAuxiliar, c, o) {
  if (filaOriginal[c].numerador == 0 || filaAuxiliar[c].numerador == 0)
    return false;
  let valorAMultiplicar = divisionFraccion(filaOriginal[c], filaAuxiliar[c]);
  valorAMultiplicar = multiplicarFraccion(valorAMultiplicar, new Fraccion(-1));
  let newFraccion = multiplicarFraccion(valorAMultiplicar, filaAuxiliar[c]);

  for (let columna = 0; columna < filaOriginal.length; columna++) {
    const valorFilaOrg = filaOriginal[columna];
    const valorFilaAux = filaAuxiliar[columna];

    newFraccion = multiplicarFraccion(valorAMultiplicar, valorFilaAux);

    filaOriginal[columna] = sumarFraccion(valorFilaOrg, newFraccion);
  }

  console.log("");
  const stringToShow = `F${o + 1} + (${valorAMultiplicar.toTexto()})F${c + 1}`;

  operacionesAuxSERVER.push(stringToShow);
  console.log(stringToShow.yellow);
  return true;
  // mostrarMatriz();
}

function operacionHacer1(fila, c) {
  if (fila[c].numerador / fila[c].denominador == 1) return false;
  const fraccionADividir = divisionFraccion(new Fraccion(1), fila[c]);
  for (let columna = 0; columna < fila.length; columna++) {
    fila[columna] = multiplicarFraccion(fila[columna], fraccionADividir);
  }
  console.log("");
  const stringToShow = `F${c + 1} (${fraccionADividir.toTexto()})`;
  operacionesAuxSERVER.push(stringToShow);
  console.log(stringToShow.yellow);
  return true;
  // mostrarMatriz();
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
/* await preguntar();
console.log("Matriz inicial:".bgMagenta);
mostrarMatriz();
await obtenerRespuesta("PRESIONA ENTER PARA CONTINUAR");
limpiarConsole();
console.log("Matriz original:".bgMagenta);
mostrarMatriz();
console.log("Procesos:".bgMagenta);
iniciar();
console.log("Resultados:".bgBlue);
mostrarResultados();
console.log("LONUEVO");
console.table(TOSERVER);*/
rl.close();

let matriz;

export function retornarOperMatrizSVG() {
  parteMatriz = 1; //1 parte inferior izquierda, 2 parte superior derecha, 3 centros
  contador = 0;
  debemostrar = false;
  TOSERVER = [];
  matriz = Array(6)
    .fill()
    .map(() => Array(7).fill(0));
  matriz[0][0] = new Fraccion(5);
  matriz[0][1] = new Fraccion(-2);
  matriz[0][2] = new Fraccion(5);
  matriz[0][3] = new Fraccion(-5);
  matriz[0][4] = new Fraccion(6);
  matriz[0][5] = new Fraccion(-8);
  matriz[0][6] = new Fraccion(-9);
  matriz[1][0] = new Fraccion(-6);
  matriz[1][1] = new Fraccion(6);
  matriz[1][2] = new Fraccion(-3);
  matriz[1][3] = new Fraccion(1);
  matriz[1][4] = new Fraccion(4);
  matriz[1][5] = new Fraccion(-8);
  matriz[1][6] = new Fraccion(-5);
  matriz[2][0] = new Fraccion(-5);
  matriz[2][1] = new Fraccion(5);
  matriz[2][2] = new Fraccion(-7);
  matriz[2][3] = new Fraccion(3);
  matriz[2][4] = new Fraccion(-4);
  matriz[2][5] = new Fraccion(3);
  matriz[2][6] = new Fraccion(21);
  matriz[3][0] = new Fraccion(-1);
  matriz[3][1] = new Fraccion(-4);
  matriz[3][2] = new Fraccion(-9);
  matriz[3][3] = new Fraccion(6);
  matriz[3][4] = new Fraccion(9);
  matriz[3][5] = new Fraccion(5);
  matriz[3][6] = new Fraccion(26);
  matriz[4][0] = new Fraccion(7);
  matriz[4][1] = new Fraccion(5);
  matriz[4][2] = new Fraccion(-8);
  matriz[4][3] = new Fraccion(-4);
  matriz[4][4] = new Fraccion(7);
  matriz[4][5] = new Fraccion(-6);
  matriz[4][6] = new Fraccion(65);
  matriz[5][0] = new Fraccion(4);
  matriz[5][1] = new Fraccion(-1);
  matriz[5][2] = new Fraccion(-3);
  matriz[5][3] = new Fraccion(5);
  matriz[5][4] = new Fraccion(-3);
  matriz[5][5] = new Fraccion(-5);
  matriz[5][6] = new Fraccion(149);

  console.log("Procesos:".bgMagenta);
  iniciar();
  console.log("Resultados:".bgBlue);
  mostrarResultados();
  console.log("LONUEVO");
  console.table(TOSERVER);
  return TOSERVER;
}
