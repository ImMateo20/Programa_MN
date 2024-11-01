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

export async function recibirSVGM() {
  const SVGs = [];

  // const latexA = `f(x)=(x^2)-2\\newline5x`;
  const primeraF = "F1 + (-5)F2";
  const segundaF = "5x-2";
  //  const evaluated = simplify(expresion).toString();
  // const latexA = parse(expresion).toTex();
  // console.log(latexExpresion)
  // mathjax.typeset(
  //   {
  //     math: latexExpresion,
  //     format: "TeX",
  //     svg: true,
  //   },
  //   function (dato) {
  //     if (!dato.errors) {
  //       writeFileSync("output.svg", dato.svg);
  //       console.log("Imagen generada en output.svg");
  //     } else {
  //       console.error("Error al procesar la expresión:", dato.errors);
  //     }
  //   }
  // );

  const matrizA = matrix([
    [1, 2, fraction(2,2)],
    [4, 5, 6],
    [7, 8, 9],
  ]);
  const matrizB = matrix([[1], [4], [7]]);

  const latexA = parse(matrizA.toString()).toTex({
    parenthesis: "auto",
    implicit: "hide",
  });
  const latexB = parse(matrizB.toString()).toTex({
    parenthesis: "auto",
    implicit: "hide",
  });

  const r1 = await mathjax.typeset({
    math: primeraF,
    format: "TeX",
    svg: true,
  });
  const r2 = await mathjax.typeset({
    math: segundaF,
    format: "TeX",
    svg: true,
  });
  const r3 = await mathjax.typeset({
    math: latexA,
    format: "TeX",
    svg: true,
  });
  const r4 = await mathjax.typeset({
    math: latexB,
    format: "TeX",
    svg: true,
  });

  // console.log(r.svg);
  return {
    r1:r1.svg,
    r2:r2.svg,
    r3:r3.svg,
    r4:r4.svg
  };
}
