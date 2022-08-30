const baseURL = 'http://localhost:3000'
let dispositivos = []


//fetch methods
function carregaDispositivosFav() {
    fetch(`${baseURL}/inicio`)
        .then(response => response.json())
        .then(json => {
            dispositivos = json
            console.log(dispositivos)

        })
        .catch(err => false)
}

function buscar() {
    let modelos = []
    let email = document.querySelector('#name').value

    fetch(`${baseURL}/listar_dispositivos_favoritados_por/${email}`, {
        method: "GET",
        headers: { "Content-type": "application/json;charset=UTF-8" }
    })
        .then(response => response.json())
        .then(json => {
            modelos = json
            renderizaNaTela(modelos)
        })
        .catch(err => console.log(err))

}

function bucarId(modelos) {
    const {
        modelo
    } = modelos
    return modelo
}
function bucarId2(dispositivos) {
    const {
        modelo
    } = dispositivos
    return modelo
}


function renderizaNaTela(modelos) {
    let arrayFav = []
    modelos.forEach(modelos => {
        let modeloId = bucarId(modelos)
        let modeloId2
        dispositivos.forEach(dispositivos => {
            modeloId2 = bucarId2(dispositivos)

            if (modeloId == modeloId2) {

                arrayFav.push(dispositivos)
            }
        })

    })
    console.log(arrayFav)
    renderizarFavoritos(arrayFav)
}

function renderizarFavoritos(arrayFav) {
    const div = document.querySelector(".container-pg2")
    div.innerHTML = ''

    arrayFav.forEach(arrayFav => {
        const {
            fotoLink,
            modelo,
            fabricante,
            preco,
            processador,
            memoriaInterna,
            memoriaRam
        } = arrayFav

        const html = `
            <div class="card cards" style="width: 18rem;">
                <div class="img-div">
                <img src=${fotoLink} class=" img-tam" alt="...">
                </div>
                <div class="card-body">
                    <h5 class="card-title txt-cent">${modelo}</h5>
                    <p class="card-text">fabricante: ${fabricante}</p>
                    <p class="card-text">preço: ${preco}</p>
                    <p class="card-text">processador: ${processador}</p>
                    <p class="card-text">memoria interna: ${memoriaInterna}</p>
                    <p class="card-text">memoria ram: ${memoriaRam}</p>
                    
                </div>
            </div>
        `
        div.innerHTML += html
    })
}