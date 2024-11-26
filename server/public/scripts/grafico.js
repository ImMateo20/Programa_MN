//FUNCIONES PARA EL APARTADO DEL MÉTODO GRAFICADORA

const input = document.getElementById("inputExpresion");
function concatenarExpresion(expresion) {
  input.value += expresion;
}

let stateSen = true;
let stateCos = true;
let stateTan = true;

function segundoPiso() {
  const botonSen = document.getElementById("botonSen");
  const botonCos = document.getElementById("botonCos");
  const botonTan = document.getElementById("botonTan");

  botonSen.setAttribute(
    "onclick",
    stateSen ? `concatenarExpresion("asin")` : `concatenarExpresion("sin")`
  );
  stateSen = !stateSen;
  botonSen.textContent = stateSen ? "sen" : "asen";

  botonCos.setAttribute(
    "onclick",
    stateCos ? `concatenarExpresion("acos")` : `concatenarExpresion("cos")`
  );
  stateCos = !stateCos;
  botonCos.textContent = stateCos ? "cos" : "acos";

  botonTan.setAttribute(
    "onclick",
    stateTan ? `concatenarExpresion("atan")` : `concatenarExpresion("tan")`
  );
  stateTan = !stateTan;
  botonTan.textContent = stateTan ? "tan" : "atan";
}

function eliminarUCaracter() {
  input.value = input.value.slice(0, -1);
}

function limpiarInput() {
  input.value = "";
}

async function obtenerExpresionForm() {
  const formBiseccion = document.getElementById("divFormBiseccion");
  const formData = document.getElementById("formGrafica");
  const contenedorGrafica = document.getElementById("image_grafica");

  if (!formData) {
    console.error("Error al obtener el input");
    return;
  }
  if (!contenedorGrafica) {
    console.error("No existe el contenedor de la grafica");
    return;
  }

  const fData = new FormData(formData);

  const inputs = {};

  fData.forEach((valor, llave) => {
    inputs[llave] = valor;
  });

  if (formBiseccion) {
    console.log(inputs["expresion"]);
    const formLim = document.getElementById("idFormLimites");
    const funcionMB = document.getElementById("funcionMetodoB");

    if (funcionMB) {
      funcionMB.innerHTML = `${inputs["expresion"]}`;
    } else {
      formLim.innerHTML =
        `<p><b>f(x) = <span id="funcionMetodoB">${inputs["expresion"]}</span></b></p>` +
        formLim.innerHTML;
    }
  }
  procesarGrafica(inputs);
}

async function procesarGrafica(inputs) {
  try {
    const response = await fetch("/metodo-grafico/procesar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputs),
    });

    // console.log(response.status);

    if (!response.ok) {
      console.log("Hubo un error");
    }

    const grafica = await response.blob();
    // console.log(grafica.size);

    const newImg = document.getElementById("imagenGrafica");
    try {
      objectURL = URL.createObjectURL(grafica);
    } catch (error) {
      console.error("Error al crear la URL del objeto:", error);
    }

    // contenedorGrafica.innerHTML = '';
    newImg.src = objectURL;
    // newImg.style.width = "100%";
    // newImg.style.height = "100%";
    // console.log("Image src:", newImg.src);
    // contenedorGrafica.appendChild(newImg);
    // console.log(newImg.src);
    document.getElementById("inputExpresion").value = "";
  } catch (error) {
    console.error("Error: ", error);
  }
}

let scale = 1;
function hacerZoom() {
  const image = document.getElementById("imagenGrafica");
  scale = scale > 4 ? scale : scale + 0.1;

  image.style.transform = `scale(${scale})`;
}

function quitarZoom() {
  const image = document.getElementById("imagenGrafica");
  scale = Math.max(1, scale - 0.1);
  image.style.transform = `scale(${scale})`;
}

