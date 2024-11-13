async function obtenerS_GJ() {
  try {
    const respuesta = await fetch(
      "/sistemas-de-ecuaciones/gauss-jordan/procesar",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );

    const svgg = await respuesta.json();

    const DivPadre = document.getElementById("divSVG");
    DivPadre.innerHTML = "";
    DivPadre.style.backgroundColor = "white";
    DivPadre.style.width = "100%";

    for (const resultado of svgg["resultado"]) {
      const newDiv = document.createElement("div");
      newDiv.id = "contenedorMatrizOper";
      const opeSVG = document.createElement("div");
      opeSVG.id = "operacionesSVG";
      const matrizSVG = document.createElement("div");
      matrizSVG.id = "matrizSistemaSVG";
      for (const operacion of resultado["resultadoOpersSVG"]) {
        opeSVG.innerHTML += operacion;
      }
      matrizSVG.innerHTML = resultado["resultadoMatrizSVG"];
      newDiv.appendChild(opeSVG);
      newDiv.appendChild(matrizSVG);
      DivPadre.appendChild(newDiv);
    }
    DivPadre.style.height = "max-content";
  } catch (error) {
    console.error(error);
  }
}
