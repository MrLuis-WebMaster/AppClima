const container = document.querySelector(".container");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

window.addEventListener("load", ()=>{
    formulario.addEventListener("submit", buscarClima)
})

function buscarClima (e) {
    e.preventDefault();

    //Validar
    const ciudad = document.querySelector("#ciudad").value;
    const pais = document.querySelector("#pais").value;

    if (ciudad === "" || pais === "") {
        mostrarError("Todos los campos son obligatorios");
        return;
    }


    //Consultar API

    ConsultarAPI(ciudad,pais);

}
function ConsultarAPI (ciudad,pais){
    const appID = "80b61f0dbfdcb9d6dc23a8ab643bb55e";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}`;
    console.log(url);
    spinner();
    fetch(url) 
        .then( resultado => resultado.json())
        .then( datos => {
            LimpiarHTML();
            if (datos.cod === "404") {
                mostrarError("Ciudad no encontrada");
                return;
            }

            //imprime en el html

            mostrarClima(datos);
        })
}

function mostrarClima (datos) {

    const {name, main: {temp, temp_max, temp_min}} = datos;

    const temperatura = KelvinGrados(temp);
    const Max = KelvinGrados(temp_max);
    const Min = KelvinGrados(temp_min);

    const actual = document.createElement("p");
    const resultadoDiv = document.createElement("div");

    const nombreCiudad = document.createElement("p");
    nombreCiudad.textContent = `Clima de ${name}`;
    nombreCiudad.classList.add("font-bold","text-2xl")

    const temperaturaMax = document.createElement("p");
    temperaturaMax.innerHTML = `Max: ${Max} &#8451;`;
    temperaturaMax.classList.add("text-xl");

    const temperaturaMin = document.createElement("p");
    temperaturaMin.innerHTML = `Min: ${Min} &#8451;`;
    temperaturaMin.classList.add("text-xl");

    actual.classList.add("font-bold","text-6xl");
    actual.innerHTML = `${temperatura} &#8451;`;
    
    resultadoDiv.classList.add("text-center","text-white");
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(temperaturaMax);
    resultadoDiv.appendChild(temperaturaMin);
    
    resultado.appendChild(resultadoDiv);

    console.log(temp)
}

const KelvinGrados = grados => parseInt(grados-273.15);

function mostrarError(mensaje) {
    const alerta = document.querySelector(".bg-red-100");
    if(!alerta) {
        const alerta = document.createElement("div");
        alerta.classList.add("bg-red-100","border-red-400","text-red-700","px-4","py-3","rounded", 
        "max-w-md","mx-auto","mt-6","text-center");
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block">${mensaje}</span>
        `;
        container.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }

}

function LimpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function spinner () {
    LimpiarHTML();
    const div = document.createElement("div");
    div.classList.add("spinner");
    div.innerHTML = `
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
    `;
    resultado.appendChild(div);
}