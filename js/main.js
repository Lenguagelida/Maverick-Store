let contadorCarrito = 0;
let contadorFavoritos = 0;
let carrito = JSON.parse(localStorage.getItem("carrito")) ?? [];
cantidadPrecioNavbar();
let favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];
contadorFavoritosNavbar();
let maquetas = [];


//--ESQUEMA DE LOS ELEMENTOS A MOSTRAR EN LA PAGINA--
const maquetaCard = (maqueta) => {
	const card = `<div class="col">
					<div class="card h-100">
						<img src="${maqueta.image}" class="card-img-top" alt="image${maqueta.id}">
						<div class="card-body">
							<h4 class="card-title text-center">${maqueta.nombre}</h4>
							<p class="card-text text-center">${maqueta.marca}</p>
							<p class="card-text text-center">Escala: ${maqueta.escala}</p>
							<p class="card-text text-center fw-bolder">Precio: $${maqueta.precio}</p>
						</div>
							<a  id="agregar-carrito${maqueta.id}" class="btn btn-outline-primary m-1 fw-bolder"><i class="bi-cart-fill me-1"></i> Añadir al carrito</a>
							<a  id="agregar-favorito${maqueta.id}" class="btn btn-outline-secondary m-1 fw-bolder"><i class="bi bi-star-fill"></i> Agregar a favoritos</a>
						<div class="card-footer">
							<small class="text-success">Hay existencias</small>
						</div>
					</div>
				</div>`
	return card;
};

const verCarrito = (maqueta) => {
	const filaCarrito = `
	<tbody>
		<tr id="${maqueta.idFila}">
            <td>${maqueta.id}</td>
            <td>
                <img src="${maqueta.img}" style="width: 55px">
            </td>
			<td><input type="number" id="maqueta-cantidad${maqueta.id}" min="1" value="${maqueta.cantidad}"></td>
            <td id="maqueta-precio${maqueta.id}">$${maqueta.precio}</td>
            <td>
				<button id="eliminar${maqueta.idFila}" class="btn btn-outline-danger btn-sm">X</button>
            </td>
        </tr>
	</tbody>`;
	return filaCarrito;
};

const verMarcas = (marca) =>{
	const filaMarcas = `<li><a class="dropdown-item" onclick="btnFiltroMarca('${marca}')">${marca}</a></li>`
	return filaMarcas;
};

const verEscalas = (escala) =>{
	const filaEscala = `<li><a class="dropdown-item" onclick="btnFiltroEscala('${escala}')">${escala}</a></li>`
	return filaEscala;
};
//-----

// --FUNCIONES QUE IMPRIMEN LOS ELEMENTOS EN LA PAGINA--
const seccionCatalogo = (array) => {
	const nodoCatalogo = document.getElementById("seccion-catalogo");
	let catalogo = "";
	array.forEach((item) => {
		catalogo += maquetaCard(item);
	});
	nodoCatalogo.innerHTML = catalogo;
	dropdownMarcas();
	dropdownEscalas();
	btnAgregarCarrito(array);
	btnAgregaFavoritos(array);
    modalCarrito();
    modalFavoritos();
};
	// --LLAMAR AL ARCHIVO JSON--
	async function fetchCatalogo() {
		try{
			let response = await fetch('./js/maquetas.json');
			maquetas = await response.json();
			ordenCatalogo(maquetas);
			seccionCatalogo(maquetas);
		}catch (error) {
			console.log("error");
		}
	};
	fetchCatalogo(); 
	//-----

const modalCarrito = () => {
	const nodoCarrito = document.getElementById("cards-carrito");
	let seccionCarrito = "";
	carrito.forEach((maqueta) => {
		seccionCarrito += verCarrito(maqueta);
	});
	nodoCarrito.innerHTML = seccionCarrito;
	precioTotalModal();
	btnSumarCantidad();
	btnFinalizarCompra();
	btnVaciarCarrito();
	btnQuitarCarrito();
};
//-----

//--FUNCIONES DE LOS DISTINTOS BOTONES PARA CARRITO--
const btnAgregarCarrito = (array) => {
	array.forEach((item) => {
		const idBotonCarrito = `agregar-carrito${item.id}`;
		const botonNodoAgregar = document.getElementById(idBotonCarrito);

		botonNodoAgregar.addEventListener("click", () => {
			const maquetaEnCarrito = {
				id: item.id,
				nombre: item.nombre,
				img: item.image,
				cantidad: 1,
				precio: item.precio,
				idFila: contadorCarrito,
			};
			contadorCarrito += 1;

			//Verifica si existe en el carrito
			const existe = carrito.some(maq => maq.id == item.id);
			console.log(existe);
			if(existe){
					Toastify({
						text: "Este producto ya esta en tu carrito",
						duration: 1500,
						gravity: 'bottom',
						position: 'right',
						style: {
							background: "linear-gradient(90deg, rgba(151,151,156,1) 0%, rgba(177,10,10,1) 13%, rgba(33,37,41,1) 85%)",
						},
					}).showToast();
			} else{
				carrito.push(maquetaEnCarrito); //Si no existe agrega al carrito
				localStorage.setItem("carrito", JSON.stringify(carrito));
				Toastify({
					text: "Agregaste al carrito: "+ item.nombre,
					duration: 1500,
					gravity: 'bottom',
					position: 'right',
					style: {
						background: "linear-gradient(90deg, rgba(151,151,156,1) 0%, rgba(33,37,41,1) 19%, rgba(33,37,41,1) 86%)",
					},
				}).showToast();
			};
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
					background: "linear-gradient(90deg, rgba(151,151,156,1) 0%, rgba(33,37,41,1) 19%, rgba(33,37,41,1) 86%)",
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
			title: "¿Estas seguro que deseas vaciar todo el carrito?",
			text: "Los precios no se guardaran y podrian recibir cambios",
			icon: "warning",
			showCancelButton: true,
			cancelButtonText: "No",
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "SI"
		}).then((result) => {
			if (result.isConfirmed) {
				carrito = []; //Vacia el carrito
				localStorage.setItem("carrito", JSON.stringify(carrito));
				modalCarrito();
				cantidadPrecioNavbar();
				Swal.fire("Carrito vacio");
			}
		});
	});
};

const btnFinalizarCompra = () => {
	const idBotonFinalizar = `finalizar-compra`;
	const botonNodoFinalizar = document.getElementById(idBotonFinalizar);

	botonNodoFinalizar.addEventListener("click", () => {
		Swal.fire({
			title: 'Compra Exitosa!',
			text: 'Gracias por confiar en nosotros',
			imageUrl: 'https://c.tenor.com/JXXy9Twl-SkAAAAM/thumbs-up-maverick.gif',
			imageWidth: 400,
			imageHeight: 300,
			imageAlt: 'Custom image',
			});
		carrito = []; //Vacia el carrito al finalizar la compra
		localStorage.setItem("carrito", JSON.stringify(carrito));
		modalCarrito();
		cantidadPrecioNavbar();
	});
};

const btnSumarCantidad = () => {
	carrito.forEach((maqueta)=>{
		const idInputCantidad = `maqueta-cantidad${maqueta.id}`
		const idPrecioUnidad =`maqueta-precio${maqueta.id}`
		const nodoPrecioUnidad = document.getElementById(idPrecioUnidad);
		const nodoInput = document.getElementById(idInputCantidad);
		nodoInput.addEventListener('change', (e) => {
			let cantidad = Number(e.target.value);
			let indice = maqueta.id -1;
			let precioOriginal = maquetas[indice].precio;//Busca el precio en el JSON del producto correspondiente
			let total = cantidad * precioOriginal;
			maqueta.cantidad = cantidad;
			maqueta.precio = total;
			nodoPrecioUnidad.textContent = "$"+ total;
			localStorage.setItem("carrito", JSON.stringify(carrito));
			precioTotalModal();
			cantidadPrecioNavbar();
		});
	});
};
//-----

//--CONTADORES PARA LA PAGINA Y EL MODAL DEL CARRITO--
const precioTotalModal = () => {
	const totalPrecio = carrito.reduce((acumulador, maqueta) => acumulador + maqueta.precio, 0);
	document.getElementById("subtotal").innerText = "Subtotal: $" + totalPrecio;
};

function cantidadPrecioNavbar(){
	const totalPrecio = carrito.reduce((acumulador, maqueta) => acumulador + maqueta.precio, 0);
	const totalCantidad = carrito.reduce((acumulador, maqueta) => acumulador + maqueta.cantidad, 0);
	document.getElementById("total-carrito").innerHTML = totalCantidad + "- Total: $" + totalPrecio;
};
//-----

//--FILTROS DE LOS PRODUCTOS--
const dropdownMarcas = () => {
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
};

const dropdownEscalas = () => {
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
};

const btnFiltroMarca = (marca) =>{
	const maquetasFitradas = maquetas.filter((maqueta) => maqueta.marca === marca);
	// console.log(maquetasFitradas);
	ordenCatalogo(maquetasFitradas);
	seccionCatalogo(maquetasFitradas);
};

const btnFiltroEscala = (escala) =>{
	const maquetasFitradas = maquetas.filter((maqueta) => maqueta.escala === escala);
	// console.log(maquetasFitradas);
	ordenCatalogo(maquetasFitradas);
	seccionCatalogo(maquetasFitradas);
};

const ordenCatalogo = (array) =>{
	const alfabetico = document.getElementById('alfabetico');
	const precioAscendente = document.getElementById('precio-ascendente');
	const precioDescendente = document.getElementById('precio-descendente');

	alfabetico.addEventListener('click', () =>{
		array.sort((a,b) =>{
			if (a.nombre < b.nombre) return -1;
			if (a.nombre > b.nombre) return 1;
			return 0;
		});
		// console.log(array);
		seccionCatalogo(array);
	});

	precioAscendente.addEventListener('click', () =>{
		array.sort((a,b) =>{
			if (a.precio < b.precio) return -1;
			if (a.precio > b.precio) return 1;
			return 0;
		});
		// console.log(array);
		seccionCatalogo(array);
	});

	precioDescendente.addEventListener('click', () =>{
		array.sort((a,b) =>{
			if (a.precio < b.precio) return 1;
			if (a.precio > b.precio) return -1;
			return 0;
		});
		// console.log(array);
		seccionCatalogo(array);
	});
};
//-----

// CODIGO PARA LA FUNCIONALIDAD DE FAVORITOS

//--ESQUEMA DEL MODAL DE FAVORITOS--
const verFavoritos = (maqueta) => {
	const filaFavoritos = `<tr id="${maqueta.favIdFila}">
                                <td>${maqueta.favId}</td>
                                <td class="inline-block text-truncate" style="max-width: 40px;">${maqueta.favNombre}</td>
                                <td>
                                    <img src="${maqueta.favImg}" style="width: 55px">
                                </td>
                                <td>$${maqueta.favPrecio}</td>
                                <td>
									<button id="eliminar-${maqueta.favIdFila}" class="btn btn-sm btn-outline-danger">X</button>
								</td>
								<td>
									<button id="agregar-${maqueta.favId}" class="btn btn-sm btn-outline-primary"> carrito </button>
								</td>
							</tr>`;
	return filaFavoritos;
};
//-----

// --FUNCIONES QUE IMPRIMEN LOS ELEMENTOS EN LA PAGINA--
const modalFavoritos = () => {
	const nodoFavoritos = document.getElementById("cards-favoritos");
	let seccionFavoritos = "";
	favoritos.forEach((maqueta) => {
		seccionFavoritos += verFavoritos(maqueta);
	});
	nodoFavoritos.innerHTML = seccionFavoritos;
	btnQuitarFavorito();
	btnAgregarCarritoFavoritos();
	};
//-----

//-- FUNCIONES DE LOS BOTONES DEL MODAL DE FAVORITOS --
const btnAgregaFavoritos = (arrayCatalogo) => {
	arrayCatalogo.forEach((item) => {
		const idAgregaFavorito = `agregar-favorito${item.id}`;
		const botonNodoFavoritos = document.getElementById(idAgregaFavorito);

		botonNodoFavoritos.addEventListener("click", () => {
			const maquetaEnFavoritos = {
				favId: item.id,
				favNombre: item.nombre,
				favImg: item.image,
				favPrecio: item.precio,
				favIdFila: contadorFavoritos,
			};

			//Verifica si existe en favoritos
			const existe = favoritos.some(maq => maq.favId == maquetaEnFavoritos.favId);
			if(existe){
				Toastify({
					text: "Este producto ya esta en tu lista de favoritos",
					duration: 1500,
					gravity: 'bottom',
					position: 'right',
					style: {
						background: "linear-gradient(90deg, rgba(151,151,156,1) 0%, rgba(177,10,10,1) 13%, rgba(33,37,41,1) 85%)",
					},
				}).showToast();
			} else{
				contadorFavoritos += 1;
				favoritos.push(maquetaEnFavoritos)//Si no existe en favoritos agrega el producto a la lista
				localStorage.setItem("favoritos", JSON.stringify(favoritos));
            Toastify({
				text: "Agregaste a tus favoritos: "+ item.nombre,
				duration: 1500,
                gravity: 'bottom',
                position: 'right',
				style: {
					background: "linear-gradient(90deg, rgba(151,151,156,1) 0%, rgba(33,37,41,1) 19%, rgba(33,37,41,1) 86%)",
				},
			}).showToast();
			};

			modalFavoritos();
            contadorFavoritosNavbar();
			// console.log(favoritos);
		});
	});
};

const btnAgregarCarritoFavoritos = () =>{
	favoritos.forEach((maqueta) => {
		const idBotonAgregarCarrito = `agregar-${maqueta.favId}`;
		const botonNodoAgregarCarrito = document.getElementById(idBotonAgregarCarrito);

		botonNodoAgregarCarrito.addEventListener('click', () => {
			const maquetaEnCarrito = {
				id: maqueta.favId,
				nombre: maqueta.favNombre,
				img: maqueta.favImg,
				cantidad: 1,
				precio: maqueta.favPrecio,
				idFila: contadorCarrito,
			};
			contadorCarrito += 1;

			//Verifica si existe en el carrito
			const existe = carrito.some(maq => maq.id == maqueta.favId);
			console.log(existe);
			if(existe){
				Toastify({
					text: "Este producto ya esta en tu carrito",
					duration: 1500,
					gravity: 'bottom',
					position: 'right',
					style: {
						background: "linear-gradient(90deg, rgba(151,151,156,1) 0%, rgba(177,10,10,1) 13%, rgba(33,37,41,1) 85%)",
					},
				}).showToast();
			} else{
				carrito.push(maquetaEnCarrito); //Agrega el item al carrito
				localStorage.setItem("carrito", JSON.stringify(carrito));
				Toastify({
					text: "Agregaste al carrito: "+ maqueta.favNombre,
					duration: 1000,
					gravity: 'bottom',
					position: 'right',
					style: {
						background: "#212529",
					},
				}).showToast();
			};			
			// console.log(carrito);
			modalCarrito();
            cantidadPrecioNavbar();
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
			// console.log(indice);
			favoritos.splice(indice, 1); //Elimina el item de la lista de favoritos
			localStorage.setItem("favoritos", JSON.stringify(favoritos));
            Toastify({
				text: "Eliminaste de favoritos: "+ maqueta.favNombre,
				duration: 1000,
                gravity: 'bottom',
                position: 'right',
				style: {
					background: "#212529",
				},
			}).showToast();
			modalFavoritos();
            contadorFavoritosNavbar();
		});
	});
};
//-----

//--CONTADOR DE FAVORITOS PARA LA PAGINA--
function contadorFavoritosNavbar(){
	document.getElementById("contador-favoritos").innerHTML = favoritos.length;
};
//-----