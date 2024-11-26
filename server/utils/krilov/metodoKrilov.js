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

async function preguntar() {
  let numEcuaciones = await obtenerRespuesta(
    "Cuantas ecuaciones ingresaras?:".bgBlue
  );
  numEcuaciones = parseInt(numEcuaciones);
  matriz = Array(numEcuaciones)
    .fill()
    .map(() => Array(numEcuaciones).fill(0));
  matrizIgualdad = Array(numEcuaciones);
  matrizFinal = Array(numEcuaciones)
    .fill()
    .map(() => Array(numEcuaciones + 1).fill(0));

  for (let fila = 0; fila < numEcuaciones; fila++) {
    console.log(`Fila ${fila + 1}:`.magenta);
    for (let columna = 0; columna < numEcuaciones; columna++) {
      const valor = await obtenerRespuesta("Ingresa tu valor: ");
      matriz[fila][columna] = new Fraccion(valor);
      console.log("");
    }
  }

  for (let fila = 0; fila < numEcuaciones; fila++) {
    const valor = await obtenerRespuesta(
      `Ingresa tu valor propuesto para la fila ${fila + 1}: `.bgGreen
    );
    matrizIgualdad[fila] = new Fraccion(valor);
    console.log("");
  }
  matricesIgualdades.push(matrizIgualdad);
}

function mostrarMatriz() {
  let matrizAMostrar = {};
  for (let fila = 0; fila < matriz.length; fila++) {
    let objetoEcuacion = {};
    for (let columna = 0; columna < matriz.length; columna++) {
      objetoEcuacion[columna === matriz.length ? `v:` : `x${columna + 1}:`] =
        matriz[fila][columna].toTexto();
    }
    matrizAMostrar[`Ecuacion${fila + 1}:`] = objetoEcuacion;
  }
  console.table(matrizAMostrar);

  matrizAMostrar = {};
  for (let fila = 0; fila < matriz.length; fila++) {
    matrizAMostrar[`Fila ${fila + 1}:`] = matrizIgualdad[fila].toTexto();
  }
  console.table(matrizAMostrar);
}

function mostrarMatrizCon(matr) {
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

function multiplicarMatriz() {
  let aux = [];
  for (let fila = 0; fila < matriz.length; fila++) {
    let suma = new Fraccion(0);
    for (let columna = 0; columna < matriz.length; columna++) {
      suma = sumarFraccion(
        suma,
        multiplicarFraccion(matriz[fila][columna], matrizIgualdad[columna])
      );
    }
    aux.push(suma);
  }
  matrizIgualdad = aux;
  matricesIgualdades.push(matrizIgualdad);
}

function crearMatrizFinal() {
  for (
    let igualdad = matricesIgualdades.length - 2;
    igualdad >= 0;
    igualdad--
  ) {
    for (let fila = 0; fila < matrizFinal.length; fila++) {
      matrizFinal[fila][matricesIgualdades.length - 2 - igualdad] =
        matricesIgualdades[igualdad][fila];
    }
  }

  for (let fila = 0; fila < matrizFinal.length; fila++) {
    matrizFinal[fila][matricesIgualdades.length - 1] =
      matricesIgualdades[matricesIgualdades.length - 1][fila];
  }

  multiplicarUltimaColumna();
}

function multiplicarUltimaColumna() {
  for (let i = 0; i < matrizFinal.length; i++) {
    matrizFinal[i][matrizFinal.length] = multiplicarFraccion(
      matrizFinal[i][matrizFinal.length],
      new Fraccion(-1)
    );
  }
}

function sumarFraccion(fraccion1, fraccion2) {
  const nuevoNumerador =
    fraccion1.numerador * fraccion2.denominador +
    fraccion1.denominador * fraccion2.numerador;
  const nuevoDenominador = fraccion1.denominador * fraccion2.denominador;
  return new Fraccion(nuevoNumerador, nuevoDenominador);
}

function multiplicarFraccion(fraccion1, fraccion2) {
  const nuevoNumerador = fraccion1.numerador * fraccion2.numerador;
  const nuevoDenominador = fraccion1.denominador * fraccion2.denominador;
  return new Fraccion(nuevoNumerador, nuevoDenominador);
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
  // coeficientes.push(new Fraccion(parseInt(ladoDerecho))); // Convierte el valor de la derecha en número

  return coeficientes;
}

function paraGuardarEnElServer() {
  matrizFinal.forEach((fila, i) => {
    fila.forEach((columna, j) => {
      matrizAuxServer[i][j] = columna.toNumero();
    });
  });
}

rl.close();

let matriz = [];
let matrizIgualdad = [];
let matricesIgualdades = [];
let matrizFinal = [];
let matrizTOSERVER = [];
let matricesITOSERVER = [];
let matrizFinalTOSERVER = [];
let matrizAuxServer = [];

export function retornarOperMatrizSVG(sistema) {
  matrizTOSERVER = [];
  matricesITOSERVER = [];
  matrizFinalTOSERVER = [];
  matrizAuxServer = [];

  matriz = Array(sistema.ecuaciones.length)
    .fill()
    .map(() => Array(sistema.ecuaciones.length + 1).fill(0));
  matrizIgualdad = Array(sistema.ecuaciones.length);
  matrizFinal = Array(sistema.ecuaciones.length)
    .fill()
    .map(() => Array(sistema.ecuaciones.length + 1).fill(0));
  matrizAuxServer = Array(sistema.ecuaciones.length)
    .fill()
    .map(() => Array(sistema.ecuaciones.length + 1).fill(0));

  if (sistema.tipo == "casillas") {
    for (let i = 0; i < sistema.ecuaciones.length; i++) {
      for (let j = 0; j < sistema.ecuaciones.length; j++) {
        matriz[i][j] = new Fraccion(parseInt(sistema.ecuaciones[i][j]));
      }
    }

    for (let i = 0; i < sistema.ecuaciones.length; i++) {
      matrizIgualdad[i] = new Fraccion(
        parseInt(sistema.ecuaciones[i][sistema.ecuaciones.length])
      );
    }
    matricesIgualdades.push(matrizIgualdad);
  }

  matrizTOSERVER.push({
    matrizSVG: matriz.map((s) => [...s]),
  });
  console.log("Procesos:".bgMagenta);
  mostrarMatriz();
  for (let i = 0; i < sistema.ecuaciones.length; i++) {
    multiplicarMatriz();
  }
  crearMatrizFinal();

  matricesITOSERVER.push({
    matrizSVG: matricesIgualdades.map((s) => [...s]),
  });

  matrizFinalTOSERVER.push({
    matrizSVG: matrizFinal.map((s) => [...s]),
  });

  paraGuardarEnElServer();

  matriz = [];
  matrizIgualdad = [];
  matricesIgualdades = [];
  matrizFinal = [];

  // console.log(matrizAuxServer);

  return {
    matrizTOSERVER,
    matricesITOSERVER,
    matrizFinalTOSERVER,
    matrizAuxServer,
  };
}
