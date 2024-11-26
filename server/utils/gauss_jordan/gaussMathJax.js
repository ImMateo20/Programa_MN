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

export async function recibirSVG_GJ(sistema) {
  const { matrizTOSERVER, TOSERVER } = retornarOperMatrizSVG(sistema);
  const matriz = [];
  const SVGs = [];

  for (const proceso of matrizTOSERVER) {
    let auxMatriz = [];
    for (let fila = 0; fila < proceso["matrizSVG"].length; fila++) {
      let auxFilaM = [];
      for (let columna = 0; columna <= proceso["matrizSVG"].length; columna++) {
        let valor = proceso["matrizSVG"][fila][columna];
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

    matriz.push({
      resultadoMatrizSVG: resultadoMSVG.svg,
    });
  }

  for (const objeto of TOSERVER) {
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
    matriz,
    resultado: SVGs,
  };
}
