const contenedorGeneradorInputs = document.getElementById(
  "div-generador-de-input"
);
const inputNumEcu = document.getElementById("num-de-ecuaciones");
const tipoInputs = document.getElementById("selected-ecuacion");
let valores;

inputNumEcu.addEventListener("input", () => {
  if (parseInt(inputNumEcu.value) > 6) {
    inputNumEcu.value = 6;
  } else if (parseInt(inputNumEcu.value) < 2) {
    inputNumEcu.value = 2;
  }
  if (tipoInputs.value == "ecuacionT") {
    agregarInputEcuC();
  } else if (tipoInputs.value == "valoresT") {
    agregarInputValC();
  }
});

tipoInputs.addEventListener("change", () => {
  if (tipoInputs.value == "ecuacionT") {
    agregarInputEcuC();
  } else if (tipoInputs.value == "valoresT") {
    agregarInputValC();
  }
});

function agregarInputEcuC() {
  contenedorGeneradorInputs.innerHTML = "";
  for (let i = 1; i <= parseInt(inputNumEcu.value); i++) {
    const newLabel = document.createElement("label");
    const newInput = document.createElement("input");
    newLabel.for = `input-ecuacion-${i}-name`;
    newLabel.textContent = `Ecuacion ${i}: `;
    newInput.placeholder = `Ej: 2x1 + 3x2 + 8x3 = 2`;
    newInput.type = "text";
    newInput.id = `input-ecuacion-${i}`;
    newInput.name = `input-ecuacion-${i}-name`;
    contenedorGeneradorInputs.appendChild(newLabel);
    contenedorGeneradorInputs.appendChild(newInput);
  }
}

function agregarInputValC() {
  const index = parseInt(inputNumEcu.value);
  contenedorGeneradorInputs.innerHTML = "";
  for (let i = 1; i <= index; i++) {
    const newDiv = document.createElement("div");
    const newP = document.createElement("p");
    newP.textContent = `Ecuacion ${i}:`;
    for (let j = 1; j <= index; j++) {
      const newLabel = document.createElement("label");
      const newInput = document.createElement("input");
      newLabel.for = `input-${i}${j}-name`;
      newLabel.textContent = `x${j}`;
      newInput.placeholder = `2 o -5`;
      newInput.type = "number";
      newInput.id = `input-${i}${j}`;
      newInput.name = `input-${i}${j}-name`;
      newDiv.appendChild(newInput);
      newDiv.appendChild(newLabel);
    }
    const newLabel = document.createElement("label");
    const newInput = document.createElement("input");
    newLabel.for = `input-${index}${index}-name`;
    newLabel.textContent = ` = `;
    newInput.placeholder = `2 o -5`;
    newInput.type = "number";
    newInput.id = `input-${index}${index}`;
    newInput.name = `input-${index}${index}-name`;
    newDiv.appendChild(newLabel);
    newDiv.appendChild(newInput);

    contenedorGeneradorInputs.appendChild(newDiv);
  }
}

function obtenerValoresCasilla() {
  const divs = contenedorGeneradorInputs.querySelectorAll("div");
  valores = Array.from(divs).map((div) => {
    const inputs = div.querySelectorAll("input");
    return Array.from(inputs).map((input) => parseInt(input.value) || 0);
  });
  valores = {
    tipo: "casillas",
    ecuaciones: valores,
  };
}

function obtenerEcuacionesCompletas() {
  const inputs = contenedorGeneradorInputs.querySelectorAll("input");
  valores = Array.from(inputs).map((input) => {
    if (input.value == "") {
      string = "0x+".repeat(parseInt(inputNumEcu.value) - 1);
      string += "0x=0";
      return string;
    }
    return input.value;
  });
  valores = {
    tipo: "completas",
    ecuaciones: valores,
  };
}

const generarMetodoGauss = document.getElementById("generar-metodo-gauss");

generarMetodoGauss.addEventListener("click", async () => {
  if (tipoInputs.value == "ecuacionT") {
    obtenerEcuacionesCompletas();
  } else {
    obtenerValoresCasilla();
  }

  await procesarMetodoGJ();
});

async function procesarMetodoGJ() {
  try {
    const respuesta = await fetch(
      "/sistemas-de-ecuaciones/gauss-jordan/procesar",
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
