import { simplify, parse, matrix, fraction } from "mathjs";
import mathjax from "mathjax-node";
import { writeFileSync } from "fs";

mathjax.config({
  MathJax: {
    SVG: {
      font: "TeX",
    },
  },
});
mathjax.start();

/* const expresion = "f(x)=(x^2)-2";
// const evaluated = simplify(expresion).toString();
const latexExpresion = parse(expresion).toTex();
console.log(latexExpresion)
mathjax.typeset(
  {
    math: latexExpresion,
    format: "TeX",
    svg: true,
  },
  function (dato) {
    if (!dato.errors) {
      writeFileSync("output.svg", dato.svg);
      console.log("Imagen generada en output.svg");
    } else {
      console.error("Error al procesar la expresión:", dato.errors);
    }
  }
);
 */

const matrizA = matrix([
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]);

const latexA = parse(matrizA.toString()).toTex({
  parenthesis: "auto",
  implicit: "hide",
});

mathjax.typeset(
  {
    math: latexA,
    format: "TeX",
    svg: true,
  },
  function (dato) {
    writeFileSync("2do.svg", dato.svg);
    console.log("Imagen Guardada");
  }
);
