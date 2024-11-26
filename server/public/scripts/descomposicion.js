const generarDescomposicionLU = document.getElementById(
  "generar-descomposicion-lu"
);

generarDescomposicionLU.addEventListener("click", async () => {
  if (tipoInputs.value == "ecuacionT") {
    obtenerEcuacionesCompletas();
  } else {
    obtenerValoresCasilla();
  }

  await procesarMetodoDLU();
});

async function procesarMetodoDLU() {
  try {
    const respuesta = await fetch(
      "/sistemas-de-ecuaciones/descomposicion-lu/procesar",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(valores),
      }
    );

    const svgg = await respuesta.json();

    const DivPadre = document.getElementById("divSVG");
    DivPadre.innerHTML = "";
    DivPadre.style.backgroundColor = "white";
    DivPadre.style.width = "100%";

    for (const proceso of svgg["matriz"]) {
      const newDiv = document.createElement("div");
      newDiv.id = "contenedorMatrizOper";
      const opeSVG = document.createElement("div");
      opeSVG.id = "operacionesSVG";
      const matrizSVG = document.createElement("div");
      matrizSVG.id = "matrizSistemaSVG";
      // for (const operacion of proceso["resultadoOpersSVG"]) {
      //   opeSVG.innerHTML += operacion;
      // }
      opeSVG.innerHTML = "<strong>Matriz inicial</strong>";
      matrizSVG.innerHTML = proceso["resultadoMatrizSVG"];
      newDiv.appendChild(opeSVG);
      newDiv.appendChild(matrizSVG);
      DivPadre.appendChild(newDiv);
    }

    for (const proceso of svgg["procesos"]) {
      const newDiv = document.createElement("div");
      newDiv.id = "contenedorMatrizOper";
      const opeSVG = document.createElement("div");
      opeSVG.id = "operacionesSVG";
      const matrizSVG = document.createElement("div");
      matrizSVG.id = "matrizSistemaSVG";
      for (const operacion of proceso["resultadoOpersSVG"]) {
        opeSVG.innerHTML += operacion;
      }
      matrizSVG.innerHTML = proceso["resultadoMatrizSVG"];
      newDiv.appendChild(opeSVG);
      newDiv.appendChild(matrizSVG);
      DivPadre.appendChild(newDiv);
    }

    for (const proceso of svgg["matrizN"]) {
      const newDiv = document.createElement("div");
      newDiv.id = "contenedorMatrizOper";
      const opeSVG = document.createElement("div");
      opeSVG.id = "operacionesSVG";
      const matrizSVG = document.createElement("div");
      matrizSVG.id = "matrizSistemaSVG";
      // for (const operacion of proceso["resultadoOpersSVG"]) {
      //   opeSVG.innerHTML += operacion;
      // }
      opeSVG.innerHTML = "<strong>Matriz N reemplazando</strong>";
      matrizSVG.innerHTML = proceso["resultadoMatrizSVG"];
      newDiv.appendChild(opeSVG);
      newDiv.appendChild(matrizSVG);
      DivPadre.appendChild(newDiv);
    }

    for (const despeje of svgg["resultadosN"]) {
      const newDiv = document.createElement("div");
      newDiv.id = "contenedorDespejesE";
      newDiv.innerHTML += `<strong>Despejando la fila: ${despeje["numDeEcu"]}</strong>`;
      newDiv.innerHTML += despeje["ecuacionDesp"];
      newDiv.innerHTML += `${despeje["resultV"]}`;
      DivPadre.appendChild(newDiv);
    }

    for (const proceso of svgg["matrizI"]) {
      const newDiv = document.createElement("div");
      newDiv.id = "contenedorMatrizOper";
      const opeSVG = document.createElement("div");
      opeSVG.id = "operacionesSVG";
      const matrizSVG = document.createElement("div");
      matrizSVG.id = "matrizSistemaSVG";
      // for (const operacion of proceso["resultadoOpersSVG"]) {
      //   opeSVG.innerHTML += operacion;
      // }
      opeSVG.innerHTML = "<strong>De vuelta con la matriz inicial</strong>";
      matrizSVG.innerHTML = proceso["resultadoMatrizSVG"];
      newDiv.appendChild(opeSVG);
      newDiv.appendChild(matrizSVG);
      DivPadre.appendChild(newDiv);
    }

    for (const despeje of svgg["resultadosI"]) {
      const newDiv = document.createElement("div");
      newDiv.id = "contenedorDespejesE";
      newDiv.innerHTML += `<strong>Despejando la ecuacion: ${despeje["numDeEcu"]}</strong>`;
      newDiv.innerHTML += despeje["ecuacionDesp"];
      newDiv.innerHTML += `${despeje["resultV"]}`;
      DivPadre.appendChild(newDiv);
    }

    DivPadre.style.height = "max-content";
  } catch (error) {
    console.error(error);
  }
}
