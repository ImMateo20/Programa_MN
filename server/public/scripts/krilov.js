const generarMetodoKrilov = document.getElementById("generar-metodo-krilov");

generarMetodoKrilov.addEventListener("click", async () => {
  if (tipoInputs.value == "ecuacionT") {
    obtenerEcuacionesCompletas();
  } else {
    obtenerValoresCasilla();
  }
  try {
    const respuesta = await fetch("/sistemas-de-ecuaciones/krilov/procesar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(valores),
    });

    const svgg = await respuesta.json();

    const DivPadre = document.getElementById("divSVGIgualdad");
    DivPadre.innerHTML = "";
    DivPadre.style.backgroundColor = "white";
    DivPadre.style.width = "100%";
    let auxM;

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
      matrizSVG.innerHTML += svgg["matricesI"][0]["resultadoMatrizSVG"];
      auxM = proceso["resultadoMatrizSVG"];
      newDiv.appendChild(opeSVG);
      newDiv.appendChild(matrizSVG);
      DivPadre.appendChild(newDiv);
    }

    for (let i = 0; i < svgg["matricesI"].length - 1; i++) {
      const newDiv = document.createElement("div");
      newDiv.id = "contenedorMatrizOperIgualdad";
      // const opeSVG = document.createElement("div");
      // opeSVG.id = "operacionesSVG";
      const matrizSVG = document.createElement("div");
      matrizSVG.id = "matrizSistemaSVGIgualdad";
      // for (const operacion of proceso["resultadoOpersSVG"]) {
      //   opeSVG.innerHTML += operacion;
      // }
      // opeSVG.innerHTML = "<strong>Matriz inicial</strong>";
      matrizSVG.innerHTML = auxM;
      matrizSVG.innerHTML += svgg["matricesI"][i]["resultadoMatrizSVG"];
      matrizSVG.innerHTML += `<span>=</span>`;
      matrizSVG.innerHTML += svgg["matricesI"][i + 1]["resultadoMatrizSVG"];
      // newDiv.appendChild(opeSVG);
      newDiv.appendChild(matrizSVG);
      DivPadre.appendChild(newDiv);
    }

    for (const proceso of svgg["matrizF"]) {
      const newDiv = document.createElement("div");
      newDiv.id = "contenedorMatrizOper";
      const opeSVG = document.createElement("div");
      opeSVG.id = "operacionesSVG";
      const matrizSVG = document.createElement("div");
      matrizSVG.id = "matrizSistemaSVG";
      // for (const operacion of proceso["resultadoOpersSVG"]) {
      //   opeSVG.innerHTML += operacion;
      // }
      opeSVG.innerHTML = "<strong>Matriz final</strong>";
      matrizSVG.innerHTML = proceso["resultadoMatrizSVG"];
      newDiv.appendChild(opeSVG);
      newDiv.appendChild(matrizSVG);
      DivPadre.appendChild(newDiv);
    }

    for (const element of svgg["matrizAuxServer"]) {
      console.log(element);
    }

    valores = {
      tipo: "casillas",
      ecuaciones: svgg["matrizAuxServer"],
    };

    DivPadre.style.height = "max-content";
  } catch (error) {
    console.error(error);
  }
});

const generargj = document.getElementById("generargj");
const generareg = document.getElementById("generareg");
const generardlu = document.getElementById("generardlu");

generargj.addEventListener("click", () => {
  procesarMetodoGJ();
});
generareg.addEventListener("click", () => {
  procesarMetodoEG();
});
generardlu.addEventListener("click", () => {
  procesarMetodoDLU();
});
