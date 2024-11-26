import { simplify, parse, matrix, fraction } from "mathjs";
import mathjax from "mathjax-node";
import { writeFileSync } from "fs";
import { retornarOperMatrizSVG } from "./metodoKrilov.js";

export async function recibirSVG_MK(sistema) {
  const {
    matrizTOSERVER,
    matricesITOSERVER,
    matrizFinalTOSERVER,
    matrizAuxServer,
  } = await retornarOperMatrizSVG(sistema);
  const matriz = [];
  let matricesI = [];
  const matrizF = [];

  for (const proceso of matrizTOSERVER) {
    let auxMatriz = [];
    for (let fila = 0; fila < proceso["matrizSVG"].length; fila++) {
      let auxFilaM = [];
      for (let columna = 0; columna < proceso["matrizSVG"].length; columna++) {
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

  for (const proceso of matricesITOSERVER[0]["matrizSVG"]) {
    let auxMatriz = [];
    for (let fila = 0; fila < proceso.length; fila++) {
      let valor = proceso[fila];
      auxMatriz.push(
        valor.denominador == 1
          ? valor.numerador
          : fraction(valor.numerador, valor.denominador)
      );
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

    matricesI.push({
      resultadoMatrizSVG: resultadoMSVG.svg,
    });
  }

  for (const proceso of matrizFinalTOSERVER) {
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

    matrizF.push({
      resultadoMatrizSVG: resultadoMSVG.svg,
    });
  }

  // console.log(SVGs);

  return {
    matriz,
    matricesI,
    matrizF,
    matrizAuxServer,
  };
}
