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

//EVENTOS AL CARGARSE LAS PÁGINAS

//Esto hace que se muestre el spinner de carga durante todas las operaciones ajax
$(document).delegate(':jqmData(role="page")', 'pagecreate', function () {
	}).ajaxStart(function () { 
		$.mobile.loading('show');
	}).ajaxComplete(function () { 
		$.mobile.loading('hide'); 
});

document.addEventListener("deviceready", function(){ 
	if (arrayMenus.length == 0 & arrayCategorias.length == 0) {
		getCategorias();
		getMenus();
	}
});

//Implementación de fastclick
window.addEventListener('load', function() { 
	FastClick.attach(document.body); 
}, false);


/* Estos preventDefault y unbind sirven para que los botones no propaguen
 * sus clicks a los botones que salen debajo al cambiar de página. Hay
 * que meter el bind en el pageshow para que el listener vuelva a crearse
 * cada vez que se muestra el botón.
 */
$('#inicioPage').bind('pageshow', function(event) {
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


$('#modificarPlatosPage').bind('pageshow', function(event) {
	$('#inputCategoriaPlatoMod').bind('vclick', function(event) {
		event.preventDefault(); 
		event.stopImmediatePropagation(); 
		$('#inputMenuPlatoMod').unbind('vclick');
	});
	
	$('#inputCategoriaPlatoMod').bind('vclick', function(event) {
		event.preventDefault(); 
		event.stopImmediatePropagation(); 
		$('#inputMenuPlatoMod').unbind('vclick');
	});
});


$('#menuListaPage').bind('pagebeforeshow', function(event) {
	getMenuItems();
});


$('#listaModificarPage').bind('pagebeforeshow', function(event) {
	getItemsModificar();
});


//LISTENERS DE BOTONES SUBMIT 

$('#submitPlato').bind('vclick', function(event) {
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
			alert("Plato añadido");
		},
		error: function(error) {
			alert(error);
		}
	});
});


$('#submitPlatoMod').bind('vclick', function(event) {
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
			alert("Plato modificado");
			cleanFormPlatos(); //Esto resetea el formulario tras hacer submit
		},
		error: function(error) {
			alert(error);
		}
	});
});


//FUNCIONES

function getMenuItems() {

	urlMenuItems = "http://kometa.pusku.com/form/getmenuitems.php";

	try {
		jsonMenuItems[menuElegido] = 
			JSON.parse(localStorage.getItem("jsonMenuItems" + menuElegido));
	} catch(e){
	}
	
	$('#listaItems li').remove();
	
	if (jsonMenuItems[menuElegido] != null) {
		listMenuItems(jsonMenuItems[menuElegido]);
	}
		
	$.post(urlMenuItems, { tipomenu : menuElegido }, function(data, textStatus) {	
		if (JSON.stringify(data.items) !== JSON.stringify(jsonMenuItems[menuElegido]) ){
			localStorage.setItem("jsonMenuItems" + menuElegido, JSON.stringify(data.items));
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
		        "<a href=#>" +
		        "<img class='imagen' src='img/cordova.png'>" +
		        "<h1 style='white-space:normal; text-align: justify'>" + menuItem.nombreItem + "</h1>" +
		        "<p style='white-space:normal; text-align: justify'>" + menuItem.descItem + "</p>" +
		        "<h2 style='color:blue'>" + menuItem.precioItem + " €" + "</h2>" +
		        "</a>" +
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
		$("#fotoDetalle").html("<div id='fotoDetalle'>" + "<img src='img/cordova.png'>" + "</div>");
		$("#menuDetalle").html("<div id='menuDetalle'>" + arrayMenus[json[$(this).index() - $(this).attr('categoriaid')].menuID - 1] + "</div>");
		$("#categoriaDetalle").html("<div id='categoriaDetalle'>" + arrayCategorias[json[$(this).index() - $(this).attr('categoriaid')].categoriaID - 1]  + "</div>");
		$("#precioDetalle").html("<div id='precioDetalle'>" + "Precio:\n" + json[$(this).index() - $(this).attr('categoriaid')].precioItem + " €" + "</div>");
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

	$('#listaItemsModificar li').remove();
	
	if (jsonMenuItems[menuElegidoMod] != null) {
		listItemsModificar(jsonMenuItems[menuElegidoMod]);
	}
		
	$.post(urlItemsModificar, { tipomenumod : menuElegidoMod }, function(data, textStatus) {	
		if (JSON.stringify(data.items) !== JSON.stringify(jsonMenuItems[menuElegidoMod]) ){
			localStorage.setItem("jsonMenuItems" + menuElegidoMod, JSON.stringify(data.items));
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
		        "<a href=#>" +
		        "<img class='imagen' src='img/cordova.png'>" +
		        "<h1 style='white-space:normal; text-align: justify'>" + itemModificar.nombreItem + "</h1>" +
		        "<p style='white-space:normal; text-align: justify'>" + itemModificar.descItem + "</p>" +
		        "<h2 style='color:blue'>" + itemModificar.precioItem + " €" + "</h2>" +
		        "</a>" +
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
		cleanFormPlatos();
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
	$("#inputNombrePlato").val("");
	$("#inputDescPlato").val("");
	$("#inputPrecioPlato").val("");
	$("#inputNombrePlatoMod").val("");
	$("#inputDescPlatoMod").val("");
	$("#inputPrecioPlatoMod").val("");
	var elInputCategoriaPlato = $("#inputCategoriaPlato");
	var elInputCategoriaPlatoMod = $("#inputCategoriaPlatoMod");
	var elInputMenuPlato = $("#inputMenuPlato");
	var elInputMenuPlatoMod = $("#inputMenuPlatoMod");
	elInputCategoriaPlato.val(-1);
	elInputCategoriaPlatoMod.val(-1);
	elInputMenuPlato.val(-1);
	elInputMenuPlatoMod.val(-1);
	elInputCategoriaPlato.trigger("change");
	elInputCategoriaPlatoMod.trigger("change");
	elInputMenuPlato.trigger("change");
	elInputMenuPlatoMod.trigger("change");
}