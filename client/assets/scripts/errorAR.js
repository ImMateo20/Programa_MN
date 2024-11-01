//FUNCIONES PARA EL APARTADO DE ERROR ABSOLUTO Y RELATIVO

async function obtenerValoresEAR() {
  const valorVerdadero = document.getElementById("idValorVerdadero").value;
  const valorAproximado = document.getElementById("idValorAproximado").value;
  const errorAbsoluto = document.getElementById("idErrorAbsoluto");
  const errorRelativo = document.getElementById("idErrorRelativo");

  if (valorVerdadero === "" || valorAproximado === "") {
    console.log("Los valores estan vacios");
    return;
  }

  try {
    const result = await fetch("/operar_error_AyR", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        valorVerdadero,
        valorAproximado,
      }),
    });

    if (!result.ok) {
      console.error("Hubo un error al obtener la respuesta");
      return;
    }

    const valoresE = await result.json();

    errorAbsoluto.value = valoresE.errorAbsoluto;
    errorRelativo.value = valoresE.errorRelativo;
  } catch (error) {
    console.error("Error al hacer la peticion: ", error);
  }
}
