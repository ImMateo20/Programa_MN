async function obtenerS() {
  try {
    const respuesta = await fetch("/procesar_eliminacion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const svgg = await respuesta.json();
    const newDiv = document.getElementById("divSVG");
    const opeSVG = document.getElementById("operacionesSVG");
    const matrizSVG = document.getElementById("matrizSistemaSVG");
    const igualdadSVG = document.getElementById("matrizIgualdadSVG");
    newDiv.style.backgroundColor = "white";
    // newDiv.style.width = "200px";
    opeSVG.innerHTML += svgg["r1"];
    opeSVG.innerHTML += svgg["r2"];
    matrizSVG.innerHTML += svgg["r3"];
    igualdadSVG.innerHTML += svgg["r4"];
  } catch (error) {
    console.error(error);
  }
}
