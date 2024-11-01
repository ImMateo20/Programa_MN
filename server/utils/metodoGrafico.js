// const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import fs from "fs";
import { FunctionNode, evaluate, min, size, typeOf } from "mathjs";
import readline from "readline";

export const crearGrafica = async (expresion) => {
  //METODO PARA GENERAR LA GRAFICA EN BASE A LA EXPRESION ENVIADA DESDE EL FORMULARIO DEL NAVEGADOR
  const width = 2000;
  const height = 2000;

  // const rl = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout,
  // });

  // async function obtenerRespuesta(pregunta) {
  //   return new Promise((resultado) => {
  //     rl.question(pregunta, resultado);
  //   });
  // }

  const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width,
    height,
    backgroundColour: "white",
  });

  const valoresX = [];
  let valoresY = [];

  // const expresion = await obtenerRespuesta("Ingresa tu funcion matematica: ");

  for (let x = -10; x <= 10; x += 0.5) {
    valoresX.push(x.toFixed(1));
    valoresY.push(funcion(expresion, x));
  }

  // rl.close();

  const data = {
    labels: valoresX,
    datasets: [
      {
        label: `f(x) = ${expresion}`,
        data: valoresY,
        borderColor: "blue",
        borderWidth: 9,
        fill: false,
      },
    ],
  };

  const valoresYFiltrados = valoresY.filter((valor) => !isNaN(valor));

  let maxValorAbsoluto = Math.max(
    ...valoresYFiltrados,
    Math.abs(Math.min(...valoresYFiltrados))
  );

  if (new Set(valoresYFiltrados).size === 1) {
    maxValorAbsoluto += 1;
  }

  // console.log("Valor:",maxValorAbsoluto);

  // valoresY.forEach(e => {
  //   console.log(e)
  // })

  const configuracion = {
    type: "line",
    data: data,
    options: {
      scales: {
        x: {
          grid: {
            color: "#000",
            borderColor: "#000",
          },

          title: {
            display: true,
            text: "x",
            color: "black",
            font: {
              size: 70,
            },
          },
          ticks: {
            color: "black",
            font: {
              size: 50,
            },
          },
        },
        y: {
          grid: {
            color: "#000",
            borderColor: "#000",
          },
          title: {
            display: true,
            text: "y",
            color: "black",
            font: {
              size: 70,
            },
          },
          ticks: {
            callback: function (value, index, values) {
              return Math.abs(value) > 10000 ? value.toExponential(2) : value;
            },
            color: "black",
            font: {
              size: 50,
            },
          },
          min: -maxValorAbsoluto,
          max: maxValorAbsoluto,
        },
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            color: "black",
            font: {
              size: 80,
            },
          },
        },
        title: {
          display: true,
          text: `Metodo gráfico para funciones`,
          color: "black",
          font: {
            size: 80,
          },
        },
      },
    },
  };

  try {
    const buffer = await chartJSNodeCanvas.renderToBuffer(configuracion);

    console.log("Grafico procesado y generado con exito");
    return buffer;
    // fs.writeFileSync("Grafico.jpg", buffer);
  } catch (err) {
    console.error("Error generando el grafico: ", err);
  }
};

function funcion(expresion, x) {
  //METODO PARA HACER LA EVALUACION DE LA EXPRESION Y RETORNAR EL RESULTADO
  expresion = expresion.replace(/x/g, `(${x})`);

  try {
    const valor = evaluate(expresion);
    console.log(valor);
    return typeOf(valor) != "Complex" && Number.isFinite(valor)
      ? valor.toFixed(2)
      : NaN;
  } catch (error) {
    console.error("Error en la evaluacion de la expresion: ", error);
    return NaN;
  }
}

/*
  a)  1 / (x^2)
  b)  1 / (x^3)
  c)  5(x^2) + 2 - 2x
  d)  2(x^2) + 2
  e)  (x + 2)^2
  f)  (x + 2)^3
  g)  x + 2
  h)  x - 2
  i)  4(x^2) - 5x
  j)  e^(2x) - 5x
  k)  sen(x) - x + 10
  */
