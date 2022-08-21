let contadorCarrito = 0;
let contadorFavoritos = 0;
let carrito = JSON.parse(localStorage.getItem("carrito")) ?? [];
cantidadPrecioNavbar();
let favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];
contadorFavoritosNavbar();

function maquetaCard(maqueta) {
	const card = `<div class="card col -3" style="width: 22rem;">
                    <img src="${maqueta.image}" class="card-img-top mt-1" alt="image${maqueta.id}">
                        <div class="card-body">
                            <h5 class="card-title">${maqueta.nombre}</h5>
                            <p class="card-text">${maqueta.marca}</p>
                            <p class="card-text">Escala: ${maqueta.escala}</p>
                            <p class="card-text">Precio: $${maqueta.precio}</p>
                            <div class="container d-flex justify-content-center">
                                <a  id="agregar-carrito${maqueta.id}" class="btn btn-primary">Agregar al carrito</a>
                                <a  id="agregar-favorito${maqueta.id}" class="btn btn-secondary">Agregar a favoritos</a>
                            </div>
                        </div>
                </div>`;
	return card;
}

const verCarrito = (maqueta) => {
	const filaCarrito = `<tr id="${maqueta.idFila}">
                            <td>${maqueta.id}</td>
                                <td>${maqueta.nombre}</td>
                                <td>
                                    <img src="${maqueta.img}" style="width: 55px">
                                </td>
                                <td>${maqueta.cantidad}</td>
                                <td>$${maqueta.precio}</td>
                                <td>
                                    <button id="eliminar${maqueta.idFila}" class="btn btn-outline-danger">X</button>
                            </td>
                        </tr>`;
	return filaCarrito;
};

const verMarcas = (marca) =>{
	const filaMarcas = `<li><a class="dropdown-item">${marca}</a></li>`
	return filaMarcas;
};

const verEscalas = (escala) =>{
	const filaEscala = `<li><a class="dropdown-item">${escala}</a></li>`
	return filaEscala;
};

const seccionCatalogo = async() => {
	const response = await fetch('/js/maquetas.json');
	const maquetas = await response.json();

	const nodoCatalogo = document.getElementById("seccion-catalogo");
	let catalogo = "";
	maquetas.forEach((maqueta) => {
		catalogo += maquetaCard(maqueta);
	});
	nodoCatalogo.innerHTML = catalogo;
	btnAgregarCarrito();
	btnAgregaFavoritos();
    modalCarrito();
    modalFavoritos();
};

const modalCarrito = () => {
	const nodoCarrito = document.getElementById("cards-carrito");
	let seccionCarrito = "";
	carrito.forEach((maqueta) => {
		seccionCarrito += verCarrito(maqueta);
	});
	nodoCarrito.innerHTML = seccionCarrito;
	btnVaciarCarrito();
	btnQuitarCarrito();
	
};

const btnAgregarCarrito = async () => {
	const response = await fetch('/js/maquetas.json');
	const maquetas = await response.json();

	maquetas.forEach((maqueta) => {
		const idBotonCarrito = `agregar-carrito${maqueta.id}`;
		const botonNodoAgregar = document.getElementById(idBotonCarrito);

		botonNodoAgregar.addEventListener("click", () => {
			const maquetaEnCarrito = {
				id: maqueta.id,
				nombre: maqueta.nombre,
				img: maqueta.image,
				cantidad: 1,
				precio: maqueta.precio,
				idFila: contadorCarrito,
			};
			contadorCarrito += 1;
			carrito.push(maquetaEnCarrito);
			localStorage.setItem("carrito", JSON.stringify(carrito));
            Toastify({
				text: "Agregaste al carrito: "+ maqueta.nombre,
				duration: 1000,
                gravity: 'bottom',
                position: 'right',
				style: {
					background: "radial-gradient(circle, rgba(151,151,156,1) 0%, rgba(105,105,107,1) 35%, rgba(56,58,59,1) 100%)",
				},
			}).showToast();
			console.log(carrito);
            modalCarrito();
            cantidadPrecioNavbar();
		});
	});
};

const btnQuitarCarrito = () => {
	carrito.forEach((maqueta) => {
		const idBotonQuitar = `eliminar${maqueta.idFila}`;
		const botonNodoQuitar = document.getElementById(idBotonQuitar);

		botonNodoQuitar.addEventListener("click", () => {
			const indice = carrito.findIndex(
				(item) => item.idFila == maqueta.idFila
			);
			console.log(indice);
			carrito.splice(indice, 1);
			localStorage.setItem("carrito", JSON.stringify(carrito));
			Toastify({
				text: "Eliminaste del carrito: "+ maqueta.nombre,
				duration: 1000,
                gravity: 'bottom',
                position: 'right',
				style: {
					background: "radial-gradient(circle, rgba(151,151,156,1) 0%, rgba(105,105,107,1) 35%, rgba(56,58,59,1) 100%)",
				},
			}).showToast();
			modalCarrito();
			cantidadPrecioNavbar();
		});
	});
};

const btnVaciarCarrito = () => {
	const idBotonVaciar = `vaciar-carrito`;
	const botonNodoVaciar = document.getElementById(idBotonVaciar);

	botonNodoVaciar.addEventListener("click", () => {
		Swal.fire({
			title: "¿Estas seguro que deseas vaciar el carrito?",
			text: "Los precios no se guardaran y podrian recibir cambios",
			icon: "warning",
			showCancelButton: true,
			cancelButtonText: "Cerrar",
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "SI",
		}).then((result) => {
			if (result.isConfirmed) {
				carrito = [];
				localStorage.setItem("carrito", JSON.stringify(carrito));
				modalCarrito();
				cantidadPrecioNavbar();
				Swal.fire("Carrito vacio");
			}
		});
	});
};

function cantidadPrecioNavbar(){
	const totalPrecio = carrito.reduce((acumulador, maqueta) => acumulador + maqueta.precio, 0);
	document.getElementById("total-carrito").innerHTML = carrito.length + "- Total: $" + totalPrecio;
};


const dropdownMarcas = () => {
	fetch('/js/maquetas.json')
		.then((response) => response.json())
		.then(maquetas => {
			const marcasMaquetas = maquetas.map(({marca}) => marca);
			const unicasMarcas = marcasMaquetas.filter((marca, indice, marcasMaquetas) =>{
				return indice == marcasMaquetas.indexOf(marca)
			});
			// console.log(unicasMarcas);
			unicasMarcas.sort();
			const nodoDropdown = document.getElementById("marcasDropdown");
			let filtroMarca = "";
			unicasMarcas.forEach((marca) => {
				filtroMarca += verMarcas(marca);
				});
			nodoDropdown.innerHTML = filtroMarca;
	});
};

const dropdownEscalas = () => {
	fetch('/js/maquetas.json')
		.then((response) => response.json())
		.then(maquetas => {
			const escalasMaquetas = maquetas.map(({escala}) => escala);
			const unicasEscalas = escalasMaquetas.filter((escala, indice, escalasMaquetas)=>{
				return indice == escalasMaquetas.indexOf(escala);
			});
			// console.log(unicasEscalas);
			unicasEscalas.sort();
            const nodoDropdown = document.getElementById("escalaDropdown");
            let filtroEscala = "";
            unicasEscalas.forEach((escala) => {
				filtroEscala += verEscalas(escala);
			});
			nodoDropdown.innerHTML = filtroEscala;
		});
};



//FUNCIONES PARA FAVORITOS:
const verFavoritos = (maqueta) => {
	const filaFavoritos = `<tr id="${maqueta.favIdFila}">
                                <td>${maqueta.favId}</td>
                                <td>${maqueta.favNombre}</td>
                                <td>
                                    <img src="${maqueta.favImg}" style="width: 55px">
                                </td>
                                <td>$${maqueta.favPrecio}</td>
                                <td>
                                    <button id="eliminar-${maqueta.favIdFila}" class="btn btn-outline-danger">X</button>
                            </td>
                        </tr>`;
	return filaFavoritos;
};

const modalFavoritos = () => {
	const nodoFavoritos = document.getElementById("cards-favoritos");
	let seccionFavoritos = "";
	favoritos.forEach((maqueta) => {
		seccionFavoritos += verFavoritos(maqueta);
	});
	nodoFavoritos.innerHTML = seccionFavoritos;
	btnQuitarFavorito();
};

const btnAgregaFavoritos = async () => {
	const response = await fetch('/js/maquetas.json');
	const maquetas = await response.json();

	maquetas.forEach((maqueta) => {
		const idAgregaFavorito = `agregar-favorito${maqueta.id}`;
		const botonNodoFavoritos = document.getElementById(idAgregaFavorito);

		botonNodoFavoritos.addEventListener("click", () => {
			const maquetaEnFavoritos = {
				favId: maqueta.id,
				favNombre: maqueta.nombre,
				favImg: maqueta.image,
				favPrecio: maqueta.precio,
				favIdFila: contadorFavoritos,
			};
			contadorFavoritos += 1;
			favoritos.push(maquetaEnFavoritos);
			localStorage.setItem("favoritos", JSON.stringify(favoritos));
            Toastify({
				text: "Agregaste a tus favoritos: "+ maqueta.nombre,
				duration: 1000,
                gravity: 'bottom',
                position: 'right',
				style: {
					background: "radial-gradient(circle, rgba(151,151,156,1) 0%, rgba(105,105,107,1) 35%, rgba(56,58,59,1) 100%)",
				},
			}).showToast();
			modalFavoritos();
            contadorFavoritosNavbar();
			console.log(favoritos);
		});
	});
};

const btnQuitarFavorito = () => {
	favoritos.forEach((maqueta) => {
		const idBotonQuitarFav = `eliminar-${maqueta.favIdFila}`;
		const botonNodoQuitarFav = document.getElementById(idBotonQuitarFav);

		botonNodoQuitarFav.addEventListener("click", () => {
			const indice = favoritos.findIndex(
				(item) => item.favIdFila == maqueta.favIdFila
			);
			console.log(indice);
			favoritos.splice(indice, 1);
			localStorage.setItem("favoritos", JSON.stringify(favoritos));
            Toastify({
				text: "Eliminaste de favoritos: "+ maqueta.favNombre,
				duration: 1000,
                gravity: 'bottom',
                position: 'right',
				style: {
					background: "radial-gradient(circle, rgba(151,151,156,1) 0%, rgba(105,105,107,1) 35%, rgba(56,58,59,1) 100%)",
				},
			}).showToast();
			modalFavoritos();
            contadorFavoritosNavbar();
		});
	});
};

function contadorFavoritosNavbar(){
	document.getElementById("contador-favoritos").innerHTML = favoritos.length;
};

//Inicializar la página:
seccionCatalogo();
dropdownMarcas();
dropdownEscalas();
//

// //Filtar por escala:
// function filtrarPorEscala(escala) {
//     document.getElementById('seccion-catalogo').innerHTML= "";
//     const maquetasFiltradas = maquetas.filter((maqueta) => maqueta.escala == escala);

//     maquetasFiltradas.forEach((maqueta) => {
//         const IdBotonCarrito = `agregar-carrito${maqueta.id}`;
//         const IdBotonFavorito = `agregar-favorito${maqueta.id}`;
//         document.getElementById('seccion-catalogo').innerHTML +=
//                         `<div class="card col -3" style="width: 22rem;">
//                             <img src="${maqueta.image}" class="card-img-top mt-1" alt="image${maqueta.id}">
//                             <div class="card-body">
//                                 <h5 class="card-title">${maqueta.nombre}</h5>
//                                 <p class="card-text">${maqueta.marca}</p>
//                                 <p class="card-text">Escala: ${maqueta.escala}</p>
//                                 <p class="card-text">Precio: $${maqueta.precio}</p>
//                                 <div class="container d-flex justify-content-center">
//                                     <a  id="${IdBotonCarrito}" class="btn btn-primary">Agregar al carrito</a>
//                                     <a  id="${IdBotonFavorito}" class="btn btn-danger">Agregar a favoritos</a>
//                                 </div>
//                             </div>
//                         </div>`
//     });
// }
// //
