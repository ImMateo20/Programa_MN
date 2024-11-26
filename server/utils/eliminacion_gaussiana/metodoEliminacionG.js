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

function funcion(expresion, x) {
  //METODO PARA HACER LA EVALUACION DE LA EXPRESION Y RETORNAR EL RESULTADO
  expresion = expresion.replace(/x/g, `(${x})`);

  try {
    const valor = evaluate(expresion);
    //   console.log(valor);
    return typeOf(valor) != "Complex" && Number.isFinite(valor)
      ? new Fraccion(math.fraction(valor).n, math.fraction(valor).d)
      : NaN;
  } catch (error) {
    console.error("Error en la evaluacion de la expresion: ", error);
    return NaN;
  }
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

  if (operacionesAuxSERVER.length !== 0) {
    procesosTOSERVER.push({
      operacionesSVG: operacionesAuxSERVER,
      matrizSVG: matriz.map((s) => [...s]),
    });
  }
}

let parteMatriz = 1; //1 parte inferior izquierda, 2 parte superior derecha, 3 centros
let contador = 0;
let debemostrar = false;

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
          filaAux = matriz.length - 1;
          parteMatriz = 2;
          mostrarMatriz();
          operacionesAuxSERVER = [];
          continue;
        }
      }
    }
    if (parteMatriz == 2) {
      operacionDespejar(filaAux);
      return;
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

  if(matriz[indice][indice].toNumero() == 0) {
    return} 

  let stringFun = "(" + matriz[indice][indice].toTexto() + `)x${indice + 1}`;
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
  const sol = eq.solveFor(`x${indice + 1}`);

  const nDeEcuacion = indice + 1;
  const ecuacionDespejada =
    `${stringFun} = ` + matriz[indice][matriz.length].toTexto();

  console.log(`Despejando en la ecuacion ${nDeEcuacion}: ${ecuacionDespejada}`);

  matriz[indice][matriz.length] = new Fraccion(sol.numer, sol.denom);

  const resultadoDespeje = matriz[indice][matriz.length].toTexto();

  console.log(`Resultado ecuacion ${nDeEcuacion} = ` + resultadoDespeje);

  despejesTOSERVER.push({
    numEcuacion: nDeEcuacion,
    ecuacionD: ecuacionDespejada,
    resultado: `x${nDeEcuacion} = ${resultadoDespeje}`,
    xxx: `${resultadoDespeje}`
  });

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
      `x${fila + 1}: ${matriz[fila][matriz.length].toTexto()}  y en decimal x${
        fila + 1
      }: ${matriz[fila][matriz.length].toNumero()}`.bgRed
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
mostrarResultados(); */
rl.close();

let matriz;
let matrizTOSERVER = [];
let procesosTOSERVER = [];
let operacionesAuxSERVER = [];
let despejesTOSERVER = [];

// const equation = algebra.Equation;
// const exp = algebra.parse("(2)x+(-7)");
// const eq = new equation(exp, -5);
// const sol = eq.solveFor("x");

// console.log(sol);

export function retornarOperMatrizSVG(sistema) {
  parteMatriz = 1; //1 parte inferior izquierda, 2 parte superior derecha, 3 centros
  contador = 0;
  debemostrar = false;
  matrizTOSERVER = [];
  procesosTOSERVER = [];
  despejesTOSERVER = [];
  matriz = Array(sistema.ecuaciones.length)
    .fill()
    .map(() => Array(sistema.ecuaciones.length + 1).fill(0));

  if (sistema.tipo == "completas") {
    sistema.ecuaciones.forEach((ecuacion, index) => {
      const ecuacionArray = extraerCoeficientes(ecuacion);
      matriz[index] = ecuacionArray;
      console.table(ecuacionArray);
    });
  } else if (sistema.tipo == "casillas") {
    sistema.ecuaciones.forEach((ecuacion, i) => {
      ecuacion.forEach((celda, j) => {
        matriz[i][j] = new Fraccion(parseInt(celda));
      });
    });
  }

  matrizTOSERVER.push({
    matrizSVG: matriz.map((s) => [...s]),
  });
  console.log("Procesos:".bgMagenta);
  iniciar();
  console.log("Resultados:".bgBlue);
  mostrarResultados();
  console.log("LONUEVO");
  console.table(procesosTOSERVER);
  matriz = [];
  return {
    matrizTOSERVER,
    procesosTOSERVER,
    despejesTOSERVER,
  };
}
