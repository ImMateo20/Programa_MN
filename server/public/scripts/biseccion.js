//FUNCIONES PARA EL APARTADO DE METODO DE BISECCION

let inputLimiteInferior;
let inputLimiteSuperior;

function verificarLimInf() {
  inputLimiteInferior = document.getElementById("limiteInferiorBiseccion");
  inputLimiteSuperior = document.getElementById("limiteSuperiorBiseccion");
  let limInf = parseInt(inputLimiteInferior.value);
  let limSup = parseInt(inputLimiteSuperior.value);
  limInf = limInf > 10 ? 10 : limInf < -10 ? -10 : limInf;
  inputLimiteInferior.value =
    limInf >= limSup ? (limSup === -10 ? limInf : limSup - 1) : limInf;
  // inputLimiteSuperior.value = limInf === -10 ? limInf + 1 : limSup;
}

function verificarLimSup() {
  inputLimiteInferior = document.getElementById("limiteInferiorBiseccion");
  inputLimiteSuperior = document.getElementById("limiteSuperiorBiseccion");
  let limInf = parseInt(inputLimiteInferior.value);
  let limSup = parseInt(inputLimiteSuperior.value);
  limSup = limSup > 10 ? 10 : limSup < -10 ? -10 : limSup;
  inputLimiteSuperior.value =
    limSup <= limInf ? (limInf === 10 ? limSup : limInf + 1) : limSup;
  // inputLimiteInferior.value = limSup === 10 ? limSup - 1 : limInf;
}

function generarMetodoB() {
  inputLimiteInferior = document.getElementById("limiteInferiorBiseccion");
  inputLimiteSuperior = document.getElementById("limiteSuperiorBiseccion");
  const funcionBiseccion = document.getElementById("funcionMetodoB");
  const camposVacios =
    (inputLimiteInferior.value == "" && inputLimiteSuperior.value != "") ||
    (inputLimiteSuperior.value == "" && inputLimiteInferior.value != "");

  if (!funcionBiseccion) {
    alert("Debes ingresar primero una funcion");
    return;
  }

  /*   console.log(inputLimiteInferior.value);
  console.log(inputLimiteSuperior.value);
  console.log(camposVacios); */

  if (camposVacios) {
    alert("Limites incompletos");
    return;
  }

  obtenerLimites();
}

function obtenerLimites() {
  const formBiseccion = document.getElementById("idFormLimites");
  if (!formBiseccion) {
    console.error("Error al obtener el formulario");
    return;
  }

  const datosDelForm = new FormData(formBiseccion);
  const limites = {};

  limites["expresion"] = document.getElementById("funcionMetodoB").textContent;
  datosDelForm.forEach((limite, nombreLim) => {
    limites[nombreLim] = limite;
  });

  // console.log(limites)

  procesarYEnviarForm(limites);
}

async function procesarYEnviarForm(limites) {
  try {
    const respuesta = await fetch("/procesar-biseccion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(limites),
    });

    if (!respuesta.ok) {
      console.error("Error al hacer la peticion al servidor");
    }

    ////////////////////////////////////////

    

    //////////////////////////////////
  } catch (error) {
    console.error("Error al procesar y enviar formulario");
  }
}
