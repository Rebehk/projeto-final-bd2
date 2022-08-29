const baseURL = 'http://localhost:3000'
let dispositivos = []


//fetch methods
function carregaDispositivos() {
    fetch(`${baseURL}/inicio`)
        .then(response => response.json())
        .then(json => {
            dispositivos = json
            console.log(dispositivos)
            renderizaNaTela()
        })
        .catch(err => false)
}

async function handleBuscaPorModelo(modelo) {
    try {
        const response = await fetch(`${baseURL}/busca/${modelo}`)
        const dispositivo = await response.json()

        return dispositivo ? dispositivo : false
    } catch (err) {
        return false
    }
}

function handleAdd(dispositivo) {
    fetch(`${baseURL}/add`, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dispositivo)
    }).then(response => {
        carregaDispositivos()
    })
        .catch(err => false)
}

function handleEdit(dispositivo) {
    fetch(`${baseURL}/atualiza`, {
        method: 'PUT',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dispositivo)
    }).then(response => carregaDispositivos())
        .catch(err => false)
}

function handleDelete(modelo) {
    fetch(`${baseURL}/deleta/${modelo}`, {
        method: 'DELETE',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => carregaDispositivos())
        .catch(err => false)
}

//modal methods
function renderizaNaTela() {
    const div = document.querySelector(".container")
    div.innerHTML = ''
    if (dispositivos.length) {
        dispositivos.forEach(dispositivo => {
            const {
                fotoLink,
                modelo,
                fabricante,
                preco,
                processador,
                memoriaInterna,
                memoriaRam
            } = dispositivo

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
                    <div class="btn-container">
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        Opções
                        </button>
                        <ul class="dropdown-menu">
                        </button></li>
                        <li><button class="btn-edit" onclick="handleSetModal('${modelo}', 'modalForm')" data-bs-toggle="modal" data-bs-target="#modalForm">
                        Editar
                    </button></li>
                        <li><button onclick="handleSetModal('${modelo}', 'delete')" class="btn-del" data-bs-toggle="modal" data-bs-target="#delete">
                        Excluir
                    </button></li>
                        </ul>
                        </div>
                        <button onclick="handleSetModal('${modelo}', 'user')" class="btn-like" data-bs-toggle="modal" data-bs-target="#user-like">
                        <img src="./assets/estrela.png" height ="35" width="40"/>
                    </button> 
                    </div>
                </div>
            </div>
        `
            div.innerHTML += html
        })
    }
    else {
        div.innerHTML = `
            <div class="card cards" style="width: 18rem;">
                <img src='./assets/image.jpg' class=" img-tam" alt="...">
                <div class="card-body">
                    <h5 class="card-title">Nenhum dispositivo cadastrado</h5>
                </div>
            </div>
        `
    }

}

function limparModalForm() {
    document.querySelector('#fotolink').value = ''
    document.querySelector('#fabricante').value = ''
    document.querySelector('#modelo').value = ''
    document.querySelector('#preco').value = ''
    document.querySelector('#processador').value = ''
    document.querySelector('#memoriaInterna').value = ''
    document.querySelector('#memoriaRam').value = ''
}

function buscaDispositivoModalForm() {
    return {
        fotoLink: document.querySelector('#fotolink').value,
        fabricante: document.querySelector('#fabricante').value,
        modelo: document.querySelector('#modelo').value,
        preco: document.querySelector('#preco').value,
        processador: document.querySelector('#processador').value,
        memoriaInterna: document.querySelector('#memoriaInterna').value,
        memoriaRam: document.querySelector('#memoriaRam').value
    }
}

function handleModal() {
    const modal = document.querySelector('#modalForm')
    const dispositivo = buscaDispositivoModalForm()

    if (modal.getAttribute('modelo') && dispositivo) {
        handleEdit(dispositivo)
        modal.removeAttribute('modelo')
    } else {
        handleAdd(dispositivo)
    }
}

function handleModalDelete() {
    const modal = document.querySelector('#delete')
    const modelo = modal.getAttribute('modelo')

    if (modelo) {
        handleDelete(modelo)
    }

    modal.removeAttribute('modelo')
}

async function handleModalSearch() {
    const searchInput = document.querySelector('#search-input')
    const searchModalBody = document.querySelector('.search-modal-body')

    const dispositivo = await handleBuscaPorModelo(searchInput.value)
    searchModalBody.innerHTML = ''
    if (dispositivo) {
        const {
            fotoLink,
            modelo,
            fabricante,
            preco,
            processador,
            memoriaInterna,
            memoriaRam
        } = dispositivo

        const html = `
            <div class="card cards" style="width: 18rem; margin:0 auto;">
                <img src=${fotoLink} class=" img-tam" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${modelo}</h5>
                    <p class="card-text">fabricante: ${fabricante}</p>
                    <p class="card-text">preço: ${preco}</p>
                    <p class="card-text">processador: ${processador}</p>
                    <p class="card-text">memoria interna: ${memoriaInterna}</p>
                    <p class="card-text">memoria ram: ${memoriaRam}</p>
                </div>
            </div>
        `
        searchModalBody.innerHTML = html
        searchInput.value = ''
    } else {
        const html = `
            <div class="card cards" style="width: 18rem; margin:0 auto;">
                <img src='./assets/nao-encontrado.jpg' class=" img-tam" alt="...">
                <div class="card-body">
                    <h5 class="card-title">Nenhum dispositivo encontrado</h5>
                </div>
            </div>
        `
        searchModalBody.innerHTML = html
        searchInput.value = ''
    }
}

function handleSetModal(modelo, idElem) {
    if (modelo && idElem) {
        document.querySelector(`#${idElem}`).setAttribute('modelo', modelo)
        const dispositivo = dispositivos.find(dispositivo => dispositivo.modelo === modelo)
        document.querySelector('#fotolink').value = dispositivo.fotoLink
        document.querySelector('#fabricante').value = dispositivo.fabricante
        document.querySelector('#modelo').value = dispositivo.modelo
        document.querySelector('#preco').value = dispositivo.preco
        document.querySelector('#processador').value = dispositivo.processador
        document.querySelector('#memoriaInterna').value = dispositivo.memoriaInterna
        document.querySelector('#memoriaRam').value = dispositivo.memoriaRam
    }
    else {
        const modalFrom = document.querySelector(`#modalForm`)

        if (modalFrom.getAttribute('modelo')) {
            modalFrom.removeAttribute('modelo')
        }

        limparModalForm()
    }
}

// neo4j 
function renderizaNaTelaFavorito(fav) {
    const div = document.querySelector(".container-pg2")
    for (let tam = 0; tam < array.length; tam++) {
        const { modelof } = fav
        console("passou pelo for ")

        div.innerHTML = ''
        if (dispositivos.length) {
            dispositivos.forEach(dispositivo => {
                console.log('forEach')
                const {
                    fotoLink,
                    modelo,
                    fabricante,
                    preco,
                    processador,
                    memoriaInterna,
                    memoriaRam
                } = dispositivo
                if (modelof == modelo) {
                    console(modelo, "passando pelo If")
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
                <div class="btn-container">
                <div class="btn-group" role="group">
                        <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        Opções
                        </button>
                        <ul class="dropdown-menu">
                        </button></li>
                        <li><button class="btn-edit" onclick="handleSetModal('${modelo}', 'modalForm')" data-bs-toggle="modal" data-bs-target="#modalForm">
                        Editar
                        </button></li>
                        <li><button onclick="handleSetModal('${modelo}', 'delete')" class="btn-del" data-bs-toggle="modal" data-bs-target="#delete">
                        Excluir
                        </button></li>
                        </ul>
                        </div>
                        <button onclick="handleSetModal('${modelo}', 'user')" class="btn-like" data-bs-toggle="modal" data-bs-target="#user-like">
                        <img src="./assets/estrela.png" height ="35" width="40"/>
                        </button> 
                    </div>
                    </div>
                    </div>
                    `
                    div.innerHTML += html
                }
            })

        }
        // else {
        //     div.innerHTML = `
        //     <div class="card cards" style="width: 18rem;">
        //             <div class="card-body">
        //             <h5 class="card-title">Nenhum dispositivo favoritado</h5>
        //         </div>
        //     </div>
        // `
        // }

    }
}

function handleAddUser(pessoa) {
    fetch(`${baseURL}/adicionar_pessoa`, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pessoa)
    }).then(response => {
        console.log()
    })
        .catch(err => false)
}

function listarDispositivosFavoritos() {
    let email = document.querySelector('#name').value
    let favoritado = []
    fetch(`${baseURL}/listar_dispositivos_favoritados_por/${email}`)
        .then(response => response.json())
        .then(fav => {
            favoritado = fav
            renderizaNaTelaFavorito()
            console.log(favoritado)

        })
        .catch(err => false)
}

// function buscarFavorito() {
//     let email = document.querySelector('#name').value
//     listarDispositivosFavoritos(email)
//     limparModalAddPessoa()
// }


// try {
//     const response = await fetch(`${baseURL}/busca/${modelo}`)
//     const dispositivo = await response.json()

//     return dispositivo ? dispositivo : false
// } catch (err) {
//     return false
// }



function favoritarDispositivo(like) {
    fetch(`${baseURL}/favoritar_dispositivo`, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(like)
    }).then(response => {
        console.log()
    })
        .catch(err => false)
}


function buscaPessoaModalForm() {
    return {
        nome: document.querySelector('#nome').value,
        email: document.querySelector('#email').value,

    }
}
function limparModalAddPessoa() {
    document.querySelector('#nome').value = ''
    document.querySelector('#name').value = ''
    document.querySelector('#email').value = ''
    document.querySelector('#email-exist').value = ''
    document.querySelector('#modelo-like1').value = ''


}



function handleModalAddUser() {
    let pessoa = buscaPessoaModalForm()
    handleAddUser(pessoa)
    limparModalAddPessoa()
}

// function buscarUsuario(usuario) {
//     fetch(`${baseURL}/busca/${usuario}`, {
//         method: 'POST',
//         headers: {
//             'accept': 'application/json',
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(like)
//     }).then(response => {
//         console.log()
//     })
//         .catch(err => false)

// }



function handleModalUser() {
    let like = {}
    like.email = document.querySelector('#email-exist').value
    like.modelo = document.querySelector('#modelo-like1').value
    console.log(like)
    favoritarDispositivo(like)
    limparModalAddPessoa()

} 
