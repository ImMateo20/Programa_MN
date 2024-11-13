import { simplify, parse, matrix, fraction } from "mathjs";
import mathjax from "mathjax-node";
import { writeFileSync } from "fs";
import { retornarOperMatrizSVG } from "./metodoGaussJ.js";

mathjax.config({
  MathJax: {
    SVG: {
      font: "TeX",
    },
  },
});
mathjax.start();

export async function recibirSVG_GJ() {
  const recibido = retornarOperMatrizSVG();
  const SVGs = [];

  for (const objeto of recibido) {
    let auxOpers = await Promise.all(
      objeto["operacionesSVG"].map(async (operacion) => {
        let auxOperSVG = await mathjax.typeset({
          math: operacion,
          format: "TeX",
          svg: true,
        });
        return auxOperSVG.svg;
      })
    );

    let auxMatriz = [];
    for (let fila = 0; fila < objeto["matrizSVG"].length; fila++) {
      let auxFilaM = [];
      for (let columna = 0; columna <= objeto["matrizSVG"].length; columna++) {
        let valor = objeto["matrizSVG"][fila][columna];
        auxFilaM.push(
          valor.denominador == 1
            ? valor.numerador
            : fraction(valor.numerador, valor.denominador)
        );
      }
      auxMatriz.push(auxFilaM);
    }
    let auxMatrizPreSVG = matrix(auxMatriz);
    let auxLatexM = parse(auxMatrizPreSVG.toString()).toTex({
      parenthesis: "auto",
      implicit: "hide",
    });
    let resultadoMSVG = await mathjax.typeset({
      math: auxLatexM,
      format: "TeX",
      svg: true,
    });

    SVGs.push({
      resultadoOpersSVG: auxOpers,
      resultadoMatrizSVG: resultadoMSVG.svg,
    });
  }

//   console.log(SVGs);

  return {
    resultado: SVGs,
  };
}
