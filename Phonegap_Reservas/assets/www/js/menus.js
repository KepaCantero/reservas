var arrayCategorias = [];
var arrayMenus = [];
var jsonMenus;
var jsonCategorias;
var jsonMenuItems = [];

var urlMenuItems;
var urlItemsModificar;
var menuElegido;
var menuElegidoMod;
var modificarID;
var urlCategorias = "http://kometa.pusku.com/form/getcategorias.php";
var urlMenus = "http://kometa.pusku.com/form/getmenus.php";


/////////////////////////////////////////
//BEGIN EVENTOS AL CARGARSE LAS PÁGINAS//
/////////////////////////////////////////

document.addEventListener("deviceready", function(){ 
	if (arrayMenus.length == 0 & arrayCategorias.length == 0) {
		getCategorias();
		getMenus();
	}
});


/* Estos preventDefault y unbind sirven para que los botones no propaguen
 * sus clicks a los botones que salen debajo al cambiar de página. Hay
 * que meter el bind en el pageshow para que el listener vuelva a crearse
 * cada vez que se muestra el botón.
 */
$('#menusPage').bind('pageshow', function(event) {
		
	$('#botElegirMenus').bind('vclick', function(event) {
		event.preventDefault(); 
		event.stopImmediatePropagation(); 
		$('#botElegirMenus').unbind('vclick');
		$.mobile.changePage ($("#menuSelecPage"));
	});
	
	$('#botCrearPlatos').bind('vclick', function(event) {
		event.preventDefault(); 
		event.stopImmediatePropagation(); 
		$('#botCrearPlatos').unbind('vclick');
		$.mobile.changePage ($("#crearPlatosPage"));
	});
	
	$('#botModificarPlatos').bind('vclick', function(event) {
		event.preventDefault(); 
		event.stopImmediatePropagation(); 
		$('#botModificarPlatos').unbind('vclick');
		$.mobile.changePage ($("#modSelecPage"));
	});	
});


$('#menuSelecPage').bind('pageshow', function(event) {
	$('#botMenuDia').bind('vclick', function(event) {
		event.preventDefault(); 
		event.stopImmediatePropagation(); 
		$('#botMenuDia').unbind('vclick');
		menuElegido = 1;
		$.mobile.changePage ($("#menuListaPage"));
	});
	
	$('#botMenuEspecial').bind('vclick', function(event) {
		event.preventDefault(); 
		event.stopImmediatePropagation(); 
		$('#botMenuEspecial').unbind('vclick');
		menuElegido = 2;
		$.mobile.changePage ($("#menuListaPage"));
	});
	
	$('#botMenuCarta').bind('vclick', function(event) {
		event.preventDefault(); 
		event.stopImmediatePropagation(); 
		$('#botMenuCarta').unbind('vclick');
		menuElegido = 3;
		$.mobile.changePage ($("#menuListaPage"));
	});	
});


$('#modSelecPage').bind('pageshow', function(event) {
	$('#botMenuDiaMod').bind('vclick', function(event) {
		event.preventDefault(); 
		event.stopImmediatePropagation(); 
		$('#botMenuDiaMod').unbind('vclick');
		menuElegidoMod = 1;
		$.mobile.changePage ($("#listaModificarPage"));
	});
	
	$('#botMenuEspecialMod').bind('vclick', function(event) {
		event.preventDefault(); 
		event.stopImmediatePropagation(); 
		$('#botMenuEspecialMod').unbind('vclick');
		menuElegidoMod = 2;
		$.mobile.changePage ($("#listaModificarPage"));
	});
	
	$('#botMenuCartaMod').bind('vclick', function(event) {
		event.preventDefault(); 
		event.stopImmediatePropagation(); 
		$('#botMenuCartaMod').unbind('vclick');
		menuElegidoMod = 3;
		$.mobile.changePage ($("#listaModificarPage"));
	});	
});


$('#crearPlatosPage').bind('pagebeforeshow', function(event) {
	$('#inputDescPlato').elastic();
	validateFormMenus();
	if ( $('#submitPlato').hasClass('ui-btn-hidden') ) {
		$('#submitPlato').button('disable');
	}
});

$('#modificarPlatosPage').bind('pagebeforeshow', function(event) {
	$('#inputDescPlatoMod').elastic();
	//validateFormMenusMod(); //Esta llamada debe hacerse antes de introducir datos en el formulario, así que está dentro de la función listItemsModificar().
});

$('#modificarPlatosPage').bind('pageshow', function(event) {
	$('#formMenusMod').valid();
});

$('#menuListaPage').bind('pagebeforeshow', function(event) {
	getMenuItems();
});


$('#listaModificarPage').bind('pagebeforeshow', function(event) {
	getItemsModificar();
});

///////////////////////////////////////
//END EVENTOS AL CARGARSE LAS PÁGINAS//
///////////////////////////////////////


///////////////////
//BEGIN LISTENERS//
/////////////////// 

/*CREAR PLATOS*/

$('#formMenus :input').bind('keyup', function(event) {
	$(event.currentTarget).valid(); //Esto valida los text inputs uno a uno.
	//Y esto valida todo el formulario solo cuando ya se ha metido info en todos los elementos del formulario.
	if ($('#inputNombrePlato').val().length > 0 && $('#inputDescPlato').val().length > 0 && $('#inputPrecioPlato').val().length > 0 && $('#inputCategoriaPlato').val().length < 4 && $('#inputMenuPlato').val().length < 4 ){
		if ( $('#formMenus').valid() ) {
			if ( $('#submitPlato').hasClass('ui-btn-hidden') ) {
				$('#submitPlato').button('enable');
			}
		} else {
			if ( $('#submitPlato').hasClass('ui-btn-hidden') ) {
				$('#submitPlato').button('disable');
			}
		}
	} else {
		if ( $('#submitPlato').hasClass('ui-btn-hidden') ) {
			$('#submitPlato').button('disable');
		}
	}
});

$('#inputCategoriaPlato').bind('change', function(event) {
	if ( $('#inputCategoriaPlato').val().length < 4 ) {
		$('#inputCategoriaPlato').valid(); //Esto valida los text inputs uno a uno.
		//Y esto valida todo el formulario solo cuando ya se ha metido info en todos los elementos del formulario.
		if ($('#inputNombrePlato').val().length > 0 && $('#inputDescPlato').val().length > 0 && $('#inputPrecioPlato').val().length > 0 && $('#inputCategoriaPlato').val().length < 4 && $('#inputMenuPlato').val().length < 4 ){
			if ( $('#formMenus').valid() ) {
				if ( $('#submitPlato').hasClass('ui-btn-hidden') ) {
					$('#submitPlato').button('enable');
				}
			} else {
				if ( $('#submitPlato').hasClass('ui-btn-hidden') ) {
					$('#submitPlato').button('disable');
				}
			}
		} else {
			if ( $('#submitPlato').hasClass('ui-btn-hidden') ) {
				$('#submitPlato').button('disable');
			}
		}
	}
});

$('#inputMenuPlato').bind('change', function(event) {
	if ( $('#inputMenuPlato').val().length < 4 ) {
		$('#inputMenuPlato').valid(); //Esto valida los text inputs uno a uno.
		//Y esto valida todo el formulario solo cuando ya se ha metido info en todos los elementos del formulario.
		if ($('#inputNombrePlato').val().length > 0 && $('#inputDescPlato').val().length > 0 && $('#inputPrecioPlato').val().length > 0 && $('#inputCategoriaPlato').val().length < 4 && $('#inputMenuPlato').val().length < 4 ){
			if ( $('#formMenus').valid() ) {
				if ( $('#submitPlato').hasClass('ui-btn-hidden') ) {
					$('#submitPlato').button('enable');
				}
			} else {
				if ( $('#submitPlato').hasClass('ui-btn-hidden') ) {
					$('#submitPlato').button('disable');
				}
			}
		} else {
			if ( $('#submitPlato').hasClass('ui-btn-hidden') ) {
				$('#submitPlato').button('disable');
			}
		}
	}
});

$('#submitPlato').bind('vclick', function(event) {
	if ( $('#formMenus').valid() ) {
		var request = $.ajax({
			url: 'http://kometa.pusku.com/form/insertplato.php',
			type: 'POST',
			data: { nombre: $("#inputNombrePlato").val(),
			        descripcion: $("#inputDescPlato").val(),
			        precio: $("#inputPrecioPlato").val(),
			        categoria: $("#inputCategoriaPlato").val(),
			        menu: $("#inputMenuPlato").val() },
			success: function(obj){
				cleanFormPlatos(); //Esto resetea el formulario tras hacer submit
			},
			error: function(error) {
				alert(error);
			}
		});
	} else {
		alert("Hay errores en los datos introducidos");
	}
});

/*MODIFICAR PLATOS*/

$('#formMenusMod :input').bind('keyup', function(event) {
	$(event.currentTarget).valid(); //Esto valida los text inputs uno a uno.
	//Y esto valida todo el formulario solo cuando ya se ha metido info en todos los elementos del formulario.
	if ($('#inputNombrePlatoMod').val().length > 0 && $('#inputDescPlatoMod').val().length > 0 && $('#inputPrecioPlatoMod').val().length > 0 && $('#inputCategoriaPlatoMod').val().length < 4 && $('#inputMenuPlatoMod').val().length < 4 ){
		if ( $('#formMenusMod').valid() ) {
			if ( $('#submitPlatoMod').hasClass('ui-btn-hidden') ) {
				$('#submitPlatoMod').button('enable');
			}
		} else {
			if ( $('#submitPlatoMod').hasClass('ui-btn-hidden') ) {
				$('#submitPlatoMod').button('disable');
			}
		}
	} else {
		if ( $('#submitPlatoMod').hasClass('ui-btn-hidden') ) {
			$('#submitPlatoMod').button('disable');
		}
	}
});

$('#inputCategoriaPlatoMod').bind('change', function(event) {
	if ( $('#inputCategoriaPlatoMod').val().length < 4 ) {
		$('#inputCategoriaPlatoMod').valid(); //Esto valida los text inputs uno a uno.
		//Y esto valida todo el formulario solo cuando ya se ha metido info en todos los elementos del formulario.
		if ($('#inputNombrePlatoMod').val().length > 0 && $('#inputDescPlatoMod').val().length > 0 && $('#inputPrecioPlatoMod').val().length > 0 && $('#inputCategoriaPlatoMod').val().length < 4 && $('#inputMenuPlatoMod').val().length < 4 ){
			if ( $('#formMenusMod').valid() ) {
				if ( $('#submitPlatoMod').hasClass('ui-btn-hidden') ) {
					$('#submitPlatoMod').button('enable');
				}
			} else {
				if ( $('#submitPlatoMod').hasClass('ui-btn-hidden') ) {
					$('#submitPlatoMod').button('disable');
				}
			}
		} else {
			if ( $('#submitPlatoMod').hasClass('ui-btn-hidden') ) {
				$('#submitPlatoMod').button('disable');
			}
		}
	}
});

$('#inputMenuPlatoMod').bind('change', function(event) {
	if ( $('#inputMenuPlatoMod').val().length < 4 ) {
		$('#inputMenuPlatoMod').valid(); //Esto valida los text inputs uno a uno.
		//Y esto valida todo el formulario solo cuando ya se ha metido info en todos los elementos del formulario.
		if ($('#inputNombrePlatoMod').val().length > 0 && $('#inputDescPlatoMod').val().length > 0 && $('#inputPrecioPlatoMod').val().length > 0 && $('#inputCategoriaPlatoMod').val().length < 4 && $('#inputMenuPlatoMod').val().length < 4 ){
			if ( $('#formMenusMod').valid() ) {
				if ( $('#submitPlatoMod').hasClass('ui-btn-hidden') ) {
					$('#submitPlatoMod').button('enable');
				}
			} else {
				if ( $('#submitPlatoMod').hasClass('ui-btn-hidden') ) {
					$('#submitPlatoMod').button('disable');
				}
			}
		} else {
			if ( $('#submitPlatoMod').hasClass('ui-btn-hidden') ) {
				$('#submitPlatoMod').button('disable');
			}
		}
	}
});

$('#submitPlatoMod').bind('vclick', function(event) {
	if ( $('#formMenusMod').valid() ) {
		var request = $.ajax({
			url: 'http://kometa.pusku.com/form/modificarplato.php',
			type: 'POST',
			data: { nombre: $("#inputNombrePlatoMod").val(),
			        descripcion: $("#inputDescPlatoMod").val(),
			        precio: $("#inputPrecioPlatoMod").val(),
			        categoria: $("#inputCategoriaPlatoMod").val(),
			        menu: $("#inputMenuPlatoMod").val(),
			        id: modificarID },
			success: function(obj){
				history.back();
				cleanFormPlatosMod(); //Esto resetea el formulario tras hacer submit
			},
			error: function(error) {
				alert(error);
			}
		});
	} else {
		alert("Hay errores en los datos introducidos");
	}
});

/////////////////
//END LISTENERS//
///////////////// 


///////////////////
//BEGIN FUNCIONES//
///////////////////

function getMenuItems() {

	urlMenuItems = "http://kometa.pusku.com/form/getmenuitems.php";

	try {
		jsonMenuItems[menuElegido] = 
			JSON.parse(localStorage.getItem("jsonMenuItems" + menuElegido));
	} catch(e){
	}
	
	if (jsonMenuItems[menuElegido] != null) {
		$('#listaItems li').remove();
		listMenuItems(jsonMenuItems[menuElegido]);
	}
		
	$.post(urlMenuItems, { tipomenu : menuElegido }, function(data, textStatus) {	
		if (JSON.stringify(data.items) !== JSON.stringify(jsonMenuItems[menuElegido]) ){
			localStorage.setItem("jsonMenuItems" + menuElegido, JSON.stringify(data.items));
			$('#listaItems li').remove();
			listMenuItems(data.items);
		}
	}, "json");
}

function listMenuItems(json){
	var list = "";	
	$.each(json, function(index, menuItem) {
		list +=
			"<li categoria='" + arrayCategorias[menuItem.categoriaID - 1] + 
				"' categoriaid='" + menuItem.categoriaID +
				"'>" +
		        //"<a href=#>" +
		        "<img src='img/cordova.png'>" +
		        "<h1 style='white-space:normal; text-align: justify'>" + menuItem.nombreItem + "</h1>" +
		        "<p style='white-space:normal; text-align: justify'>" + menuItem.descItem + "</p>" +
		        "<h2 style='color:#e95d0f'>" + menuItem.precioItem + " €" + "</h2>" +
		        //"</a>" +
	        "</li>";
	});
	var elListaItems = $('#listaItems');
	elListaItems.append(list);
	elListaItems.children('li').bind('vclick', function(e) {
	/*Lo de restar categoriaid en el índice de menuItems es porque los autodividers
	 * suman 1 al index de los items. Esta solución funciona mientras la categoriaID
	 * de cada categoría siga el orden autonumérico (en este caso del 1 al 4,
	 * pero si estos valores cambiaran hay que buscar otra solución.
	 */
		e.preventDefault(); 
		e.stopImmediatePropagation(); 
		$('#listaItems').children('li').unbind('vclick');
		cleanFormPlatos();
		$("#nombreDetalle").html("<div id='nombreDetalle'>" + json[$(this).index() - $(this).attr('categoriaid')].nombreItem + "</div>");
		$("#descDetalle").html("<div id='descDetalle'>" + json[$(this).index() - $(this).attr('categoriaid')].descItem + "</div>");
		$("#contenedorFoto").html("<div id='contenedorFoto'>" + "<img src='img/cordova.png'>" + "</div>");
		$("#menuDetalle").html("<div id='menuDetalle'>" + arrayMenus[json[$(this).index() - $(this).attr('categoriaid')].menuID - 1] + "</div>");
		$("#categoriaDetalle").html("<div id='categoriaDetalle'>" + arrayCategorias[json[$(this).index() - $(this).attr('categoriaid')].categoriaID - 1]  + "</div>");
		$("#precioDetalle").html("<div id='precioDetalle'>" + "<span style='color:black'>Precio:</span><br/><span style='font-size:1.3em'>" + json[$(this).index() - $(this).attr('categoriaid')].precioItem + " €" + "</div>");
		$.mobile.changePage ($("#detallePlatoPage"));
	});

	/*Lo siguiente hace que la lista tenga autodividers en función
	 * de la categoría de cada ítem.
	 */
	elListaItems.listview({
        autodividers: true,
        autodividersSelector: function (li) {
            var out = li.attr('categoria');
            return out;
        }
    }).listview('refresh');
}


function getItemsModificar() {
	
	urlItemsModificar = "http://kometa.pusku.com/form/getitemsmodificar.php";

	try {
		jsonMenuItems[menuElegidoMod] = 
			JSON.parse(localStorage.getItem("jsonMenuItems" + menuElegidoMod));
	} catch(e){
	}
	
	if (jsonMenuItems[menuElegidoMod] != null) {
		$('#listaItemsModificar li').remove();
		listItemsModificar(jsonMenuItems[menuElegidoMod]);
	}
		
	$.post(urlItemsModificar, { tipomenumod : menuElegidoMod }, function(data, textStatus) {	
		if (JSON.stringify(data.items) !== JSON.stringify(jsonMenuItems[menuElegidoMod]) ){
			localStorage.setItem("jsonMenuItems" + menuElegidoMod, JSON.stringify(data.items));
			$('#listaItemsModificar li').remove();
			listItemsModificar(data.items);
		}
	}, "json");
}

function listItemsModificar(json){
	var list = "";	
	$.each(json, function(index, itemModificar) {
		list +=
			"<li categoria='" + arrayCategorias[itemModificar.categoriaID - 1] + 
				"' categoriaid='" + itemModificar.categoriaID + 
				"'>" +
		        //"<a href=#>" +
		        "<img src='img/cordova.png'>" +
		        "<h1 style='white-space:normal; text-align: justify'>" + itemModificar.nombreItem + "</h1>" +
		        "<p style='white-space:normal; text-align: justify'>" + itemModificar.descItem + "</p>" +
		        "<h2 style='color:#e95d0f'>" + itemModificar.precioItem + " €" + "</h2>" +
		        //"</a>" +
	        "</li>";
	});
	
	var elListaItemsModificar = $("#listaItemsModificar");
	elListaItemsModificar.append(list);
	
	//Esto pasa los valores del item pinchado al formulario de 
	//modificación de plato.
	$('#listaItemsModificar').children('li').bind('vclick', function(e) { 
		e.preventDefault(); 
		e.stopImmediatePropagation(); 
		$('#listaItemsModificar').children('li').unbind('vclick');
		cleanFormPlatosMod();
		validateFormMenusMod();
		$("#inputNombrePlatoMod").val(json[$(this).index() - $(this).attr('categoriaid')].nombreItem);
		$("#inputDescPlatoMod").val(json[$(this).index() - $(this).attr('categoriaid')].descItem);
		$("#inputPrecioPlatoMod").val(json[$(this).index() - $(this).attr('categoriaid')].precioItem);
		$("#inputCategoriaPlatoMod").val(json[$(this).index() - $(this).attr('categoriaid')].categoriaID);
		$("#inputCategoriaPlatoMod").trigger("change");
		$("#inputMenuPlatoMod").val(json[$(this).index() - $(this).attr('categoriaid')].menuID);
		$("#inputMenuPlatoMod").trigger("change");
		modificarID = json[$(this).index() - $(this).attr('categoriaid')].menuItemID;

		$.mobile.changePage ($("#modificarPlatosPage"));
		 
	});
	
	elListaItemsModificar.listview({
        autodividers: true,
        autodividersSelector: function (li) {
            var out = li.attr('categoria');
            return out;
        }
    }).listview('refresh');
}


function getCategorias() {
	
	try {
		jsonCategorias = JSON.parse(localStorage.getItem("jsonCategorias"));
		//alert(jsonCategorias[2].nombreCategoria);
	} catch(e){
	}
	
	$('#inputCategoriaPlato option').remove();
	$('#inputCategoriaPlatoMod option').remove();
	
	if (jsonCategorias != null) {
		listCategorias(jsonCategorias);
	}
	
	$.post(urlCategorias, null, function(data, textStatus) { 
		//data contiene el JSON
		//textStatus contiene el status: success, error, etc. 
		//El segundo parámetro (el que es null) es la info que se le pasa al post 
		
		if (JSON.stringify(data.items) !== JSON.stringify(jsonCategorias) ){
			localStorage.setItem("jsonCategorias", JSON.stringify(data.items));
			listCategorias(data.items);
		}
	}, "json");
}

function listCategorias(json) {
	var elInputCategoriaPlato = $("#inputCategoriaPlato");
	elInputCategoriaPlato.append('<option data-placeholder="true">Categoría</option>');
	var elInputCategoriaPlatoMod = $("#inputCategoriaPlatoMod");
	elInputCategoriaPlatoMod.append('<option data-placeholder="true">Categoría</option>');
	var list = "";
	var listMod = "";
	$.each(json, function(index, categoria) {
		list +=
			'<option value=' + categoria.categoriaID +
			'>' + categoria.nombreCategoria + 
			'</option>';
		listMod +=
			'<option value=' + categoria.categoriaID +
			'>' + categoria.nombreCategoria + 
			'</option>';
		arrayCategorias[index] = categoria.nombreCategoria;
	});
	elInputCategoriaPlato.append(list);
	elInputCategoriaPlatoMod.append(listMod);
	elInputCategoriaPlato.trigger("change");
	elInputCategoriaPlatoMod.trigger("change");
}


function getMenus() {
	try {
		jsonMenus = JSON.parse(localStorage.getItem("jsonMenus"));
	} catch(e){
	}
	
	$('#inputMenuPlato option').remove();
	$('#inputMenuPlatoMod option').remove();
	
	if (jsonMenus != null) {
		listMenus(jsonMenus);
	}
	
	$.post(urlMenus, null, function(data, textStatus) {
		//Compara si el json ya guardado no es igual al recibido
		if (JSON.stringify(data.items) !== JSON.stringify(jsonMenus) ){
			localStorage.setItem("jsonMenus", JSON.stringify(data.items));
			listMenus(data.items);
		}
	}, "json");
}

function listMenus(json){
	var elInputMenuPlato = $("#inputMenuPlato");
	elInputMenuPlato.append('<option data-placeholder="true">Menú</option>');
	var elInputMenuPlatoMod = $("#inputMenuPlatoMod");
	elInputMenuPlatoMod.append('<option data-placeholder="true">Menú</option>');
	var list = "";
	var listMod = "";	
	$.each(json, function(index, menu) {
		list +=
			'<option value=' + menu.menuID +
			'>' + menu.nombreMenu + 
			'</option>';
		listMod +=
			'<option value=' + menu.menuID +
			'>' + menu.nombreMenu + 
			'</option>';
		arrayMenus[index] = menu.nombreMenu;
	});
	elInputMenuPlato.append(list);
	elInputMenuPlatoMod.append(listMod);
	elInputMenuPlato.trigger("change");
	elInputMenuPlatoMod.trigger("change");
}


function cleanFormPlatos(){
	var elInputNombrePlato = $("#inputNombrePlato");
	elInputNombrePlato.val("");
	elInputNombrePlato.removeClass('valid');
	elInputNombrePlato.removeClass('error');
	
	var elInputDescPlato = $("#inputDescPlato");
	elInputDescPlato.val("");
	elInputDescPlato.removeClass('valid');
	elInputDescPlato.removeClass('error');
	elInputDescPlato.css("height", "3em");
	
	var elInputPrecioPlato = $("#inputPrecioPlato");
	elInputPrecioPlato.val("");
	elInputPrecioPlato.removeClass('valid');
	elInputPrecioPlato.removeClass('error');
	
	getMenus();
	
	getCategorias();
	
	if ( $('#submitPlato').hasClass('ui-btn-hidden') ) {
		$('#submitPlato').button('disable');
	}
}

function cleanFormPlatosMod(){
	var elInputNombrePlatoMod = $("#inputNombrePlatoMod");
	elInputNombrePlatoMod.val("");
	elInputNombrePlatoMod.removeClass('valid');
	elInputNombrePlatoMod.removeClass('error');
	
	var elInputDescPlatoMod = $("#inputDescPlatoMod");
	elInputDescPlatoMod.val("");
	elInputDescPlatoMod.removeClass('valid');
	elInputDescPlatoMod.removeClass('error');
	elInputDescPlatoMod.css("height", "3em");
	
	var elInputPrecioPlatoMod = $("#inputPrecioPlatoMod");
	elInputPrecioPlatoMod.val("");
	elInputPrecioPlatoMod.removeClass('valid');
	elInputPrecioPlatoMod.removeClass('error');
	
	getMenus();
	
	getCategorias();
	
	//$('#submitPlatoMod').button(disable');
}

function validateFormMenus(){
	var validatorMenus = $('#formMenus').validate({
		submitHandler: function(form) { //Esto evita el problema de que al dar al botón "ir" en el teclado active el submit por defecto. Ahora lo activa, pero no hace nada.
		},
		rules: {
			inputNombrePlato: {
				required: true,
				minlength: 5,
				maxlength: 80
			},
			inputDescPlato: {
				required: true,
				minlength: 10,
				maxlength: 250
			},
			inputPrecioPlato: {
				required: true,
				number: true
			},
			inputCategoriaPlato: {
				required: true,
				number: true
			},
			inputMenuPlato: {
				required: true,
				number: true				
			}
		},
		messages: {
			inputNombrePlato: {
				required: "Este campo es obligatorio",
				minlength: "Introduce al menos 5 caracteres",
				maxlength: "Introduce un máximo de 80 caracteres"
			},
			inputDescPlato: {
				required: "Este campo es obligatorio",
				minlength: "Introduce al menos 10 caracteres",
				maxlength: "Introduce un máximo de 250 caracteres"
			},
			inputPrecioPlato: {
				required: "Este campo es obligatorio",
				number: "Introduce un precio válido"
			},
			inputCategoriaPlato: {
				required: "Este campo es obligatorio",
				number: "Elige una categoría"
			},
			inputMenuPlato: {
				required: "Este campo es obligatorio",
				number: "Elige un menú"
			}
		}
	});
	
	validatorMenus.resetForm();
}

function validateFormMenusMod() {
	var validatorMenusMod = $('#formMenusMod').validate({
		submitHandler: function(form) { //Esto evita el problema de que al dar al botón "ir" en el teclado active el submit por defecto. Ahora lo activa, pero no hace nada.
		},
		rules: {
			inputNombrePlatoMod: {
				required: true,
				minlength: 5,
				maxlength: 80
			},
			inputDescPlatoMod: {
				required: true,
				minlength: 10,
				maxlength: 250
			},
			inputPrecioPlatoMod: {
				required: true,
				number: true
			},
			inputCategoriaPlatoMod: {
				required: true,
				number: true
			},
			inputMenuPlatoMod: {
				required: true,
				number: true				
			}
		},
		messages: {
			inputNombrePlatoMod: {
				required: "Este campo es obligatorio",
				minlength: "Introduce al menos 5 caracteres",
				maxlength: "Introduce un máximo de 80 caracteres"
			},
			inputDescPlatoMod: {
				required: "Este campo es obligatorio",
				minlength: "Introduce al menos 10 caracteres",
				maxlength: "Introduce un máximo de 250 caracteres"
			},
			inputPrecioPlatoMod: {
				required: "Este campo es obligatorio",
				number: "Introduce un precio válido"
			},
			inputCategoriaPlatoMod: {
				required: "Este campo es obligatorio",
				number: "Elige una categoría"
			},
			inputMenuPlatoMod: {
				required: "Este campo es obligatorio",
				number: "Elige un menú"
			}
		}
	});
	
	validatorMenusMod.resetForm();
}