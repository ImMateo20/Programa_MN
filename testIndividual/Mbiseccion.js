/* "canvas": "^2.11.2",
"chart.js": "^3.9.1",
"mathjax-node": "^1.3.0", */

import {
  evaluate,
  typeOf,
  isNegative,
  isPositive,
  round,
  isUndefined,
} from "mathjs";
import algebra, { Equation, Fraction } from "algebra.js";
import colors from "colors";
import readline from "readline";

function funcion(expresion, x) {
  //METODO PARA HACER LA EVALUACION DE LA EXPRESION Y RETORNAR EL RESULTADO
  expresion = expresion.replace(/x/g, `(${x})`);

  try {
    const valor = evaluate(expresion);
    //   console.log(valor);
    return typeOf(valor) != "Complex" && Number.isFinite(valor)
      ? round(valor, 5)
      : NaN;
  } catch (error) {
    console.error("Error en la evaluacion de la expresion: ", error);
    return NaN;
  }
}

let contador = 0;

function obtenerValores(expresion) {
  //METODO PARA OBTENER LOS VALORES DE RANGO DE LA RAIZ DE LA FUNCION
  let valoresFX = [];
  let pilaAux = [];
  let mismosValores = [0, 0];
  let x = 5;
  let valorInicial = funcion(expresion, x);
  pilaAux.push(valorInicial);
  let xxxxx = true;

  const equation = algebra.Equation;

  const exp = algebra.parse(expresion);
  const eq = new equation(exp, 0);
  const sol = eq.solveFor("x");
  const solNeg = new equation(exp, new Fraction(-1, 100000000));
  const negativos = solNeg.solveFor("x");
  /*   console.log("Raices: ", sol);
  console.log("Negativos: ", negativos); */

  if (!isUndefined(sol)) {
    if (sol.length < 2 && negativos.length == 0) {
      const solucion = sol.toString();
      const toInt = parseFloat(solucion);
      /* console.log(solucion)
    console.log(toInt) */
      return [
        {
          x: toInt + 1,
          y: funcion(expresion, toInt + 1),
        },
        {
          x: toInt - 1,
          y: funcion(expresion, toInt - 1),
        },
      ];
    }
  }

  console.log(" ");

  let aumento = 1;
  let contadorDecimal = 1;
  // let verdad = sol.length == 0 || typeOf(sol);

  console.log("x: ", x, ", y: ", valorInicial);
  while (valoresFX.length < 2) {
    let valorSacado = pilaAux.pop();
    valoresFX.push({ x: x, y: valorSacado });

    let oldX = x;

    let siguienteEsMayor =
      Math.abs(funcion(expresion, x + aumento)) > Math.abs(valorSacado) &&
      (oldX == 0 && oldX > x + aumento ? oldX + aumento : oldX) < x + aumento &&
      xxxxx;
    let sumaIgual0 = funcion(expresion, x + aumento) == 0;
    let restaIgual0 = funcion(expresion, x - aumento) == 0;

    xxxxx = siguienteEsMayor;

    x = siguienteEsMayor
      ? restaIgual0
        ? x - aumento * 2
        : x - aumento
      : sumaIgual0
      ? x + aumento * 2
      : x + aumento;
    x = round(x, contadorDecimal);

    // console.log("Valor de X: ", x);

    let newValor = funcion(expresion, x);
    pilaAux.push(newValor);
    console.log("x: ", x, "y: ", newValor);

    if (mismosValores.includes(x) && mismosValores.includes(oldX)) {
      console.log("Valor antiguo: ", oldX, "Valor nuevo: ", x);
      aumento = round(aumento / 10, contadorDecimal);
      contadorDecimal++;
      // console.log("Aumento: ", aumento);

      if (contadorDecimal > 4) {
        valoresFX.push({
          x: x - 2000 * aumento,
          y: funcion(expresion, x - 2000 * aumento),
        });
        break;
      }
    }

    mismosValores.pop();
    mismosValores.pop();
    mismosValores.push(x);
    mismosValores.push(oldX);

    let agregar =
      (isNegative(valorSacado) && isPositive(newValor)) ||
      (isPositive(valorSacado) && isNegative(newValor));

    if (agregar) {
      valoresFX.push({ x: x, y: newValor });
    } else {
      valoresFX.pop();
    }

    // contador++;
    // if (contador == 70) break;
  }

  return valoresFX;
}

function obtenerXp(Xa, Xb) {
  let Xp = (Xa + Xb) / 2;
  return Xp;
}

function procesarValores(expresion) {
  let valores = obtenerValores(expresion);
  if (valores.length < 1) {
    return;
  }
  obtenerError(expresion, valores);
}

function obtenerError(expresion, valores) {
  // limpiarConsole();
  console.table({
    a: valores[0],
    b: valores[1],
  });
  console.log(`ITERACION #${contador + 1}`.bgGreen);
  contador++;
  let Xa = valores[0]["x"];
  let Xb = valores[1]["x"];
  let Xp = round(obtenerXp(Xa, Xb), 5);
  console.log("Xa: ", Xa);
  console.log("Xb: ", Xb);
  console.log("Xp: ", Xp);
  let fXa = round(funcion(expresion, Xa), 5);
  let fXb = round(funcion(expresion, Xb), 5);
  let fXp = round(funcion(expresion, Xp), 5);
  console.log("fXa: ", fXa);
  console.log("fXb: ", fXb);
  console.log("fXp: ", fXp);
  let fXa_fXp = round(fXa * fXp, 5);
  let fXb_fXp = round(fXb * fXp, 5);
  console.log("fXa*fXp: ", fXa_fXp);
  console.log("fXb*fXp: ", fXb_fXp);
  console.log(" ");

  ciclar(expresion, Xa, Xb, Xp, fXa_fXp, fXb_fXp);
}

function ciclar(expresion, Xa, Xb, Xp, fXa_fXp, fXb_fXp) {
  console.log(`ITERACION #${contador + 1}`.bgGreen);
  contador++;

  Xa = fXa_fXp > 0 ? Xp : Xa;
  console.log(`El nuevo valor de Xa es: ${Xa}`.cyan);
  if (fXa_fXp < 0) {
    Xb = fXb_fXp > 0 ? Xp : Xb;
  }
  console.log(`El nuevo valor de Xb es: ${Xb}`.magenta);
  let newXp = round(obtenerXp(Xa, Xb), 5);
  console.log(`Viejo Xp: ${Xp}`.red);
  console.log(`Nuevo Xp: ${newXp}`.blue);

  if (newXp == 0) {
    let Ea = 0;
    console.log("ErrorA: ", Ea, "%");
    return;
  }

  let fXa = round(funcion(expresion, Xa), 5);
  let fXb = round(funcion(expresion, Xb), 5);
  let fXp = round(funcion(expresion, newXp), 5);
  console.log("fXa: ", fXa);
  console.log("fXb: ", fXb);
  console.log(`fXp:  ${fXp}`.rainbow);
  fXa_fXp = round(fXa * fXp, 5);
  fXb_fXp = round(fXb * fXp, 5);
  console.log("fXa*fXp: ", fXa_fXp);
  console.log("fXb*fXp: ", fXb_fXp);

  let Ea = Math.abs(round(((newXp - Xp) / newXp) * 100, 5));
  console.log("ErrorA: ", Ea, "%");

  if (Ea < 5) return;

  console.log(" ");

  ciclar(expresion, Xa, Xb, newXp, fXa_fXp, fXb_fXp);
}

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

async function iniciarMetodo(expresion) {
  let valoress = [];

  limpiarConsole();

  const ingresarLim = await obtenerRespuesta(
    "Quieres ingresar los limites de la funcion?\nIngrese 's', en caso contrario solo presione Enter: "
  );

  if (ingresarLim === "s") {
    const limiteInferior = parseFloat(
      await obtenerRespuesta("Limite inferior: ")
    );
    const limiteSuperior = parseFloat(
      await obtenerRespuesta("Limite superior: ")
    );
    valoress = [
      {
        x: limiteInferior,
        y: funcion(expresion, limiteInferior),
      },
      {
        x: limiteSuperior,
        y: funcion(expresion, limiteSuperior),
      },
    ];
    console.log("\nFuncion: ", expresion);
    obtenerError(expresion, valoress);
  } else {
    expr = await obtenerRespuesta("Ingrese su ecuacion: ")
    console.log("\nFuncion: ", expresion);
    procesarValores(expresion);
  }
}

let expr = "x^3+x^2+21x-3";
limpiarConsole();
console.log(expr);
await iniciarMetodo(expr);
// procesarValores(expr);
rl.close();
