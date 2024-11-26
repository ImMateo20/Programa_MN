import { simplify, parse, matrix, fraction } from "mathjs";
import mathjax from "mathjax-node";
import { writeFileSync } from "fs";
import { retornarOperMatrizSVG } from "./metodoDesLU.js";


export async function recibirSVG_DLU(sistema) {
  const {
    matrizTOSERVER,
    procesosTOSERVER,
    matrizNTOSERVER,
    despejesNTOSERVER,
    matrizInicialTOSERVER,
    despejesInicialTOSERVER,
  } = retornarOperMatrizSVG(sistema);

  const matriz = [];
  const procesos = [];
  const matrizN = [];
  const resultadosN = [];
  const matrizI = [];
  const resultadosI = [];

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

  for (const proceso of procesosTOSERVER) {
    let auxOpers = await Promise.all(
      proceso["operacionesSVG"].map(async (operacion) => {
        let auxOperSVG = await mathjax.typeset({
          math: operacion,
          format: "TeX",
          svg: true,
        });
        return auxOperSVG.svg;
      })
    );

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

    procesos.push({
      resultadoOpersSVG: auxOpers,
      resultadoMatrizSVG: resultadoMSVG.svg,
    });
  }

  for (const proceso of matrizNTOSERVER) {
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

    matrizN.push({
      resultadoMatrizSVG: resultadoMSVG.svg,
    });
  }

  for (const ecuacion of despejesNTOSERVER) {
    let ecuacionDesp = await mathjax.typeset({
      math: ecuacion["ecuacionD"],
      format: "TeX",
      svg: true,
    });
    let resultadoV = await mathjax.typeset({
      math: ecuacion["resultado"],
      format: "TeX",
      svg: true,
    });

    resultadosN.push({
      numDeEcu: ecuacion["numEcuacion"],
      ecuacionDesp: ecuacionDesp.svg,
      resultV: resultadoV.svg,
      xxx: ecuacion["xxx"]
    });
  }

  for (const proceso of matrizInicialTOSERVER) {
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

    matrizI.push({
      resultadoMatrizSVG: resultadoMSVG.svg,
    });
  }

  for (const ecuacion of despejesInicialTOSERVER) {
    let ecuacionDesp = await mathjax.typeset({
      math: ecuacion["ecuacionD"],
      format: "TeX",
      svg: true,
    });
    let resultadoV = await mathjax.typeset({
      math: ecuacion["resultado"],
      format: "TeX",
      svg: true,
    });

    resultadosI.push({
      numDeEcu: ecuacion["numEcuacion"],
      ecuacionDesp: ecuacionDesp.svg,
      resultV: resultadoV.svg,
    });
  }

  //   console.log(SVGs);

  return {
    matriz,
    procesos,
    matrizN,
    resultadosN,
    matrizI,
    resultadosI,
  };
}
