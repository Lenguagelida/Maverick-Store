const carrito = JSON.parse(localStorage.getItem('carrito')) ?? []; // "(??)" Si el array de carrito es null o undefined que muestre vacio.
document.getElementById('contador-carrito').innerHTML = carrito.length; //Asi mostramos la cantidad de productos del carrito cuando actualizamos la pagina.
const favoritos = JSON.parse(localStorage.getItem('favoritos')) ??[];
document.getElementById('contador-favoritos').innerHTML = favoritos.length;


//Productos:
const maquetas =[
    {id:001, nombre: 'F-16F Fighting Falcon Block 60', marca:'Hasegawa', escala:"1/72", precio:15000, image:'./assets/cards/f16d fighting falcon.jpg'},
    {id:002, nombre: 'F-18D Hornet Night Attack', marca:'Hasegawa', escala:"1/48", precio:19000, image:'./assets/cards/f18d hornet night attack.jpg'},
    {id:003, nombre: 'F-14A Tomcat Atlantic Fleet Squadrons', marca:'Hasegawa', escala:"1/72", precio:20000, image:'./assets/cards/f14a tomcat Atlantic fleet squadrons.jpg'},
    {id:004, nombre: 'Messerschmitt Me262A ISS1', marca:'Hasegawa', escala:"1/32", precio:23000, image:'./assets/cards/me262a iss1.jpg'},
];

//Cosntruccion de cards:
function cardsContructor() {
    maquetas.forEach((maqueta) => {
        const IdBotonCarrito = `agregar-carrito${maqueta.id}`;
        const IdBotonFavorito = `agregar-favorito${maqueta.id}`;
        document.getElementById('seccion-catalogo').innerHTML +=
                        `<div class="card col -3" style="width: 22rem;">
                            <img src="${maqueta.image}" class="card-img-top mt-1" alt="image${maqueta.id}">
                            <div class="card-body">
                                <h5 class="card-title">${maqueta.nombre}</h5>
                                <p class="card-text">${maqueta.marca}</p>
                                <p class="card-text">Escala: ${maqueta.escala}</p>
                                <p class="card-text">Precio: $${maqueta.precio}</p>
                                <div class="container d-flex justify-content-center">
                                    <a  id="${IdBotonCarrito}" class="btn btn-primary">Agregar al carrito</a>
                                    <a  id="${IdBotonFavorito}" class="btn btn-danger">Agregar a favoritos</a>
                                </div>
                            </div>
                        </div>`
    });
}
cardsContructor();

//

//Agregar al carrito:
maquetas.forEach((maqueta) => {
    const IdBotonCarrito = `agregar-carrito${maqueta.id}`;
    document.getElementById(IdBotonCarrito).addEventListener('click', () => {
        carrito.push(maqueta);
        document.getElementById('contador-carrito').innerHTML = carrito.length;
        localStorage.setItem('carrito', JSON.stringify(carrito));
        // console.log(carrito);
    });
});

//

//Agregar a favoritos:
maquetas.forEach((maqueta) => {
    const IdBotonFavorito = `agregar-favorito${maqueta.id}`;
    document.getElementById(IdBotonFavorito).addEventListener('click', () => {
        favoritos.push(maqueta);
        document.getElementById('contador-favoritos').innerHTML = favoritos.length;
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        console.log(favoritos);
    });
});

//Mostrar carrito en modal:
function cardsCarrito(){
    document.getElementById('cards-carrito').innerHTML = "";
    carrito.forEach((maqueta) => {
        const idBotonEliminar = `btn-eliminar${maqueta.id}`;
        const idElementoCarrito = `elementoCarrito${maqueta.id}`;
        document.getElementById('cards-carrito').innerHTML +=
        `<tr id="${idElementoCarrito}">
            <td>${maqueta.id}</td>
                <td>${maqueta.nombre}</td>
                <td>
                    <img src="${maqueta.image}" style="width: 75px">
                </td>
                <td>${maqueta.precio}</td>
                <td>
                    <button id="${idBotonEliminar}">X</button>
            </td>
        </tr>`
    });
    borrarElementoCarrito();
    actualizarCarrito();
};

function verCarrito(){
    document.getElementById("btn-carrito").addEventListener("click",() => {
        cardsCarrito();
    });
};
    //Borrar elemento del carrito: 
function borrarElementoCarrito(){
    carrito.forEach((maqueta) => {
        const idBotonEliminar = `btn-eliminar${maqueta.id}`;
        const idElementoCarrito = `elementoCarrito${maqueta.id}`;
        document.getElementById(idBotonEliminar).addEventListener('click', () => {
            let carritoActual = JSON.parse(localStorage.getItem("carrito"));
            let nuevoCarrito = carritoActual.filter(el => el.id != maqueta.id);
            localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
            document.getElementById(idElementoCarrito).remove();
        });
    });
};

verCarrito();
//

// Mostrar favoritos en modal:
function cardsFavoritos(){
    document.getElementById('cards-favoritos').innerHTML = "";
    favoritos.forEach((maqueta) => {
        const idBotonEliminar = `btn-eliminarFavorito${maqueta.id}`;
        const idElementoFavoritos = `elementoFavorito${maqueta.id}`;
        document.getElementById('cards-favoritos').innerHTML +=
        `<tr id="${idElementoFavoritos}">
            <td>${maqueta.nombre}</td>
                <td>
                    <img src="${maqueta.image}" style="width: 75px">
                </td>
                <td>${maqueta.precio}</td>
                <td>
                    <button id="${idBotonEliminar}">X</button>
                </td>
                <td>
                    <button>
                        <i class="bi bi-cart-plus-fill"></i>
                    </button>
                </td>
        </tr>`
    });
    borrarElementoFavoritos();
    actualizarFavoritos();
};

function verFavoritos(){
    document.getElementById("btn-favoritos").addEventListener("click",() => {
        cardsFavoritos();
    });
};
    //Borrar elemento de favoritos: 
function borrarElementoFavoritos(){
    favoritos.forEach((maqueta) => {
        const idBotonEliminar = `btn-eliminarFavorito${maqueta.id}`;
        const idElementoFavoritos = `elementoFavorito${maqueta.id}`;
        document.getElementById(idBotonEliminar).addEventListener('click', () => {
            let favoritosActual = JSON.parse(localStorage.getItem("favoritos"));
            let nuevoFavoritos = favoritosActual.filter(el => el.id != maqueta.id);
            localStorage.setItem("favoritos", JSON.stringify(nuevoFavoritos));
            document.getElementById(idElementoFavoritos).remove();
        });
    });
};

verFavoritos();
//

//Actualizar página para contadores:
function actualizarCarrito(){
    document.getElementById('cierraModalCart').addEventListener('click',()=>{
        location.reload();
    });
};

function actualizarFavoritos(){
    document.getElementById('cierraModalFav').addEventListener('click',()=>{
        location.reload();
    });
};
//

//Filtar por escala:
function filtrarPorEscala(escala) {
    document.getElementById('seccion-catalogo').innerHTML= "";
    const maquetasFiltradas = maquetas.filter((maqueta) => maqueta.escala == escala);

    maquetasFiltradas.forEach((maqueta) => {
        const IdBotonCarrito = `agregar-carrito${maqueta.id}`;
        const IdBotonFavorito = `agregar-favorito${maqueta.id}`;
        document.getElementById('seccion-catalogo').innerHTML +=
                        `<div class="card col -3" style="width: 22rem;">
                            <img src="${maqueta.image}" class="card-img-top mt-1" alt="image${maqueta.id}">
                            <div class="card-body">
                                <h5 class="card-title">${maqueta.nombre}</h5>
                                <p class="card-text">${maqueta.marca}</p>
                                <p class="card-text">Escala: ${maqueta.escala}</p>
                                <p class="card-text">Precio: $${maqueta.precio}</p>
                                <div class="container d-flex justify-content-center">
                                    <a  id="${IdBotonCarrito}" class="btn btn-primary">Agregar al carrito</a>
                                    <a  id="${IdBotonFavorito}" class="btn btn-danger">Agregar a favoritos</a>
                                </div>
                            </div>
                        </div>`
    });
}
//
