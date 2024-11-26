const generarEliminacionGauss = document.getElementById(
  "generar-eliminacion-gaussiana"
);

generarEliminacionGauss.addEventListener("click", async () => {
  if (tipoInputs.value == "ecuacionT") {
    obtenerEcuacionesCompletas();
  } else {
    obtenerValoresCasilla();
  }

  await procesarMetodoEG();
});

async function procesarMetodoEG() {
  try {
    const respuesta = await fetch(
      "/sistemas-de-ecuaciones/eliminacion-g/procesar",
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

    let i = 1;
    let lambda = `&lambda;${svgg["resultados"].length}+`;
    for (const despeje of svgg["resultados"]) {
      const newDiv = document.createElement("div");
      newDiv.id = "contenedorDespejesE";
      newDiv.innerHTML += `<strong>Despejando la ecuacion: ${despeje["numDeEcu"]}</strong>`;
      newDiv.innerHTML += despeje["ecuacionDesp"];
      newDiv.innerHTML += `${despeje["resultV"]}`;

      if (i < svgg["resultados"].length) {
        lambda += `(${despeje["xxx"]})&lambda;${svgg["resultados"].length-i}+`;
      } else {
        lambda += `(${despeje["xxx"]}) = 0`;
      }
      i++;
      DivPadre.appendChild(newDiv);
    }

    const lam = document.createElement("h4");
    lam.innerHTML = lambda;
    DivPadre.appendChild(lam);

    DivPadre.style.height = "max-content";
  } catch (error) {
    console.error(error);
  }
}
