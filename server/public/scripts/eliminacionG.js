async function obtenerS_EG() {
  try {
    const respuesta = await fetch("/sistemas-de-ecuaciones/eliminacion-g/procesar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const svgg = await respuesta.json();

    const DivPadre = document.getElementById("divSVG");
    DivPadre.innerHTML = "";
    DivPadre.style.backgroundColor = "white";
    DivPadre.style.width = "100%";

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
    for (const despeje of svgg["resultados"]) {
      const newDiv = document.createElement("div");
      newDiv.id = "contenedorDespejesE";
      newDiv.innerHTML += `<p>Despejando la ecuacion: ${despeje["numDeEcu"]}</p>`;
      newDiv.innerHTML += despeje["ecuacionDesp"];
      newDiv.innerHTML += `<p>Variable ${despeje["numDeEcu"]} = ${despeje["resultV"]}</p>`;
      DivPadre.appendChild(newDiv);
    }

    DivPadre.style.height = "max-content";
  } catch (error) {
    console.error(error);
  }
}
