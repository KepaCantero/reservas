var urlMenuItems;
var urlItemsModificar;
var menuElegido;
var urlCategorias = "http://kometa.pusku.com/form/getcategorias.php";
var urlMenus = "http://kometa.pusku.com/form/getmenus.php";

//EVENTOS AL CARGARSE LAS PÁGINAS

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
		$.mobile.changePage ($("#listaModificarPage"));
	});
	
	getCategorias();
	getMenus();
	
});


$('#crearPlatosPage').bind('pageshow', function(event) {
	/*getCategorias();
	getMenus();*/
});


$('#menuListaPage').bind('pagebeforeshow', function(event) {
	getMenuItems();
});


$('#listaModificarPage').bind('pagebeforeshow', function(event) {
	getItemsModificar();
});


//LISTENERS DE COMPONENTES 

$('#botMenuDia').bind('vclick', function(event) {
	menuElegido = 1;
	//getMenuItems();
	$.mobile.changePage ($("#menuListaPage"));
});


$('#botMenuEspecial').bind('vclick', function(event) {
	menuElegido = 2;
	//getMenuItems();
	$.mobile.changePage ($("#menuListaPage"));
});


$('#botMenuCarta').bind('vclick', function(event) {
	menuElegido = 3;
	//getMenuItems();
	$.mobile.changePage ($("#menuListaPage"));
});


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


//FUNCIONES

function getMenuItems() {

	urlMenuItems = "http://kometa.pusku.com/form/getmenuitems.php" + "?tipomenu=" + menuElegido;

	$('#listaItems li').remove();
	
	$.getJSON(urlMenuItems, function(data) {
		
		var menuItems = data.items;		
		$.each(menuItems, function(index, menuItem) {
			$("#listaItems").append(
				"<li>" +
			        "<a href=#>" +
			        "<img class='imagen' src='img/cordova.png'>" +
			        "<h1 class='txtnombre'>" + menuItem.nombreItem + "</h1>" +
			        "<p class='txtdesc'>" + menuItem.descItem + "</p>" +
			        "<h2 class='txtprecio'>" + menuItem.precioItem + " €" + "</h2>" +
			        "</a>" +
		        "</li>");
		});
		$("#listaItems").listview("refresh");
	});
}


function getItemsModificar() {

	urlItemsModificar = "http://kometa.pusku.com/form/getitemsmodificar.php";

	$('#listaItemsModificar li').remove();
	
	$.getJSON(urlItemsModificar, function(data) {
		
		var itemsModificar = data.items;		
		$.each(itemsModificar, function(index, itemModificar) {
			$("#listaItemsModificar").append(
				"<li menu='" + itemModificar.menuID + "'>" +
			        "<a href=#>" +
			        "<img class='imagen' src='img/cordova.png'>" +
			        "<h1 class='txtnombre'>" + itemModificar.nombreItem + "</h1>" +
			        "<p class='txtdesc'>" + itemModificar.descItem + "</p>" +
			        "<h2 class='txtprecio'>" + itemModificar.precioItem + " €" + "</h2>" +
			        "</a>" +
		        "</li>");
		});
		//Esto pasa los valores del item pinchado al formulario de 
		//modificación de plato.
		$('#listaItemsModificar').children('li').bind('vclick', function(e) { 
			$("#inputNombrePlatoMod").val(itemsModificar[$(this).index()].nombreItem);
			$("#inputDescPlatoMod").val(itemsModificar[$(this).index()].descItem);
			$("#inputPrecioPlatoMod").val(itemsModificar[$(this).index()].precioItem);
			$("#inputCategoriaPlatoMod").val(itemsModificar[$(this).index()].categoriaID);
			$("#inputMenuPlatoMod").val(itemsModificar[$(this).index()].menuID);
			$.mobile.changePage ($("#modificarPlatosPage")); 
		});
		
		$("#listaItemsModificar").listview("refresh");
		/*Lo siguiente hace que la lista tenga autodividers en función
		 * del menú de cada ítem. El problema es que los items 
		 * no se ordenan.
		 */
		/*$("#listaItemsModificar").listview({
            autodividers: true,
            autodividersSelector: function (li) {
                var out = li.attr('menu');
                return out;
            }
        }).listview('refresh');*/
	});
}


function getCategorias() {
	$.getJSON(urlCategorias, function(data) {
		
		$('#inputCategoriaPlato option').remove();
		$("#inputCategoriaPlato").append('<option data-placeholder="true">Categoría</option>');
		var categorias = data.items;		
		$.each(categorias, function(index, categoria) {
			$("#inputCategoriaPlato").append('<option value=' + categoria.categoriaID +
			'>' + categoria.nombreCategoria + 
			'</option>');
			$("#inputCategoriaPlatoMod").append('<option value=' + categoria.categoriaID +
			'>' + categoria.nombreCategoria + 
			'</option>');
		});
		$("#inputCategoriaPlato").trigger("change");
	});
}


function getMenus() {
	$.getJSON(urlMenus, function(data) {
		
		$('#inputMenuPlato option').remove();
		$("#inputMenuPlato").append('<option data-placeholder="true">Menú</option>');
		var menus = data.items;		
		$.each(menus, function(index, menu) {
			$("#inputMenuPlato").append('<option value=' + menu.menuID +
			'>' + menu.nombreMenu + 
			'</option>');
			$("#inputMenuPlatoMod").append('<option value=' + menu.menuID +
			'>' + menu.nombreMenu + 
			'</option>');
		});
		$("#inputMenuPlato").trigger("change");
	});
}


function cleanFormPlatos(){
	$("#inputNombrePlato").val("");
	$("#inputDescPlato").val("");
	$("#inputPrecioPlato").val("");
	getCategorias();
	getMenus();
}
