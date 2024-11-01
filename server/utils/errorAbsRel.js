export function obtenerErrorAyR(valorV, valorA) {
  //METODO PARA OBTENER EL ERROR ABSOLUTO Y RELATIVO, Y REGRESARLO PARA SER ENVIADO COMO JSON
  const errorAbsoluto = parseFloat(valorV) - parseFloat(valorA);
  const errorRelativo = errorAbsoluto / parseFloat(valorV);

  // console.log(errorAbsoluto);
  // console.log(errorRelativo);

  return {
    errorAbsoluto: errorAbsoluto,
    errorRelativo: errorRelativo,
  };
}
