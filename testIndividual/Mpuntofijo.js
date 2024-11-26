import { Equation, Expression } from "algebra.js";
import { derivative, evaluate, typeOf, round, simplify } from "mathjs";

function encontrarRaiz(expresion, valorInicial) {
  let error = 0;
  let valorP = valorInicial;
  let valor;
  do {
    valor = funcion(expresion, valorP);
    error = Math.abs((valor - valorP) / valor) * 100;
    valorP = valor;

    console.table({
      valorNuevo: valorP,
      resultado: valor,
      errorA: error,
    });
  } while (error > 3);
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

const valorI = -3;
let expresionInicial = "9x-5sin(x+3) - 5(3) = 0";
// let expresion = "(-(x^3)-6(x^2)-8)/12";
let expresion = "(5sin(x+3)+15)/9";

// const equacion = algebrajs.Equation;
// const exp = algebrajs.parse("y^2 - x");
// let eq = new equacion(exp, 0);
// let resultado = eq.solveFor(equacion);
// console.log(resultado);

// const equation = algebra.Equation;
// const exp = algebra.parse(expresion);
// const eq = new equation(exp, 0);
// const sol = eq.solveFor("x");

console.log("Funcion inicial: ", expresionInicial);

console.log("Funcion despejada propuesta: ", expresion);
let expresionDer = derivarFuncion(expresion).toString();

console.log("Funcion derivada: ", expresionDer);

verificarConvergencia(expresionDer, valorI);

// encontrarRaiz(expresion, valorI);
// funcion(expresion, -3);
// const expExpand = simplify(expresionInicial);
// console.log(expExpand.toString());

function verificarConvergencia(expresion, valor) {
  const res = funcion(expresion, valor);
  console.log(res);

  if (res >= -1 && res <= 1) {console.log("Coverge!")
    encontrarRaiz(expresion, valorI)
  };
}
