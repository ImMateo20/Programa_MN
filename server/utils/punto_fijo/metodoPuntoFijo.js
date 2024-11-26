import { Equation, Expression } from "algebra.js";
import { derivative, evaluate, typeOf, round, simplify } from "mathjs";

function encontrarRaiz(expresion, valorInicial) {
  let error = 0;
  let valorP = valorInicial;
  let valor;
  do {
    valor = funcion(expresion, valorP);
    error = Math.abs((valor - valorP) / valor) * 100;

    TOSERVER.push({
      valorNuevo: valorP,
      resultado: valor,
      errorA: error,
    });
    console.table({
      valorNuevo: valorP,
      resultado: valor,
      errorA: error,
    });
    valorP = valor;
  } while (error > 0.05);
}

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

function derivarFuncion(expresion) {
  return derivative(expresion, "x");
}

function despejarVariable(expresion, variable) {
  let sides = expresion.split("=");
  let left = new Expression(sides[0].trim());
  let right = sides[1] ? new Expression(sides[1].trim()) : new Expression(0);

  let eq = new Equation(left, right);

  let solved = eq.solveFor(variable);

  return `${variable} = ${solved.toString()}`;
}

const valortI = -3;
let expresionInictial = "9x-5sin(x+3) - 5(3) = 0";
let expresiont = "(5sin(x+3)+15)/9";

let TOSERVER = [];
let datosTOSERVER = [];

export async function obtenerValoresPF(
  expresion,
  expresionPropuesta,
  valorInicial
) {
  limpiarConsole();
  TOSERVER = [];
  datosTOSERVER = [];
  console.log("Funcion inicial: ", expresion);

  console.log("Funcion propuesta despejada: ", expresionPropuesta);
  let expresionDer = derivarFuncion(expresionPropuesta).toString();

  console.log("Funcion derivada: ", expresionDer);

  console.log("Valor inicial: ", valorInicial);

  datosTOSERVER.push({
    funcion: expresion,
    propuesta: expresionPropuesta,
    derivada: expresionDer,
    valor: valorInicial,
  });

  return verificarConvergencia(
    expresionDer,
    expresionPropuesta,
    parseFloat(valorInicial)
  );

  // encontrarRaiz(expresion, valorI);
  // funcion(expresion, -3);
  // const expExpand = simplify(expresionInicial);
  // console.log(expExpand.toString());
}

function verificarConvergencia(expresion, exp, valor) {
  const res = funcion(expresion, valor);
  console.log(res);

  if (!(res >= -1 && res <= 1)) {
    return {
      error: "No converge",
    };
  }

  console.log("Coverge!");
  encontrarRaiz(exp, valor);
  return {
    datosTOSERVER,
    TOSERVER,
  };
}

function limpiarConsole() {
  return process.stdout.write("\x1b[2J\x1b[3J\x1b[H");
}
