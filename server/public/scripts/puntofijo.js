const expre = document.getElementById("expresion");
const exprep = document.getElementById("expresionp");
const valorp = document.getElementById("valorp");

document
  .getElementById("boton-procesar-puntofijo")
  .addEventListener("click", async () => {
    try {
      const respuesta = await fetch("/metodo-punto-fijo/procesar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expre: expre.value,
          exprep: exprep.value,
          valorp: valorp.value,
        }),
      });

      console.log("joa");

      const json = await respuesta.json();

      const div = document.getElementById("datos-metodo-pf");
      div.innerHTML = " ";
      const tabl = document.createElement("table");
      const listaH = document.createElement("tr");
      listaH.innerHTML = `
      <th>Valor nuevo</th>
      <th>Resultado</th>
      <th>Error</th>
      `;
      tabl.appendChild(listaH);

      for (const element of json["TOSERVER"]) {
        const listaH = document.createElement("tr");
        listaH.innerHTML = `
        <td>${element["valorNuevo"]}</td>
        <td>${element["resultado"]}</td>
        <td>${element["errorA"]}%</td>
        `;
        tabl.appendChild(listaH);
      }

      div.appendChild(tabl);

      console.log(json);
    } catch (error) {}
  });
