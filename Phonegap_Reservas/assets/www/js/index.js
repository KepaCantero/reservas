var arrayCategorias = [];
var arrayMenus = [];
var urlMenuItems;
var urlItemsModificar;
var menuElegido;
var menuElegidoMod;
var modificarID;
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
		$.mobile.changePage ($("#modSelecPage"));
	});
	
	getCategorias();
	getMenus();
	
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
			cleanFormPlatos(); //Esto resetea el formulario tras hacer submit
			alert("Plato modificado");
			$.mobile.changePage ($("#listaModificarPage"));
		},
		error: function(error) {
			alert(error);
		}
	});
});


//FUNCIONES

function getMenuItems() {

	$.mobile.showPageLoadingMsg();

	//urlMenuItems = "http://kometa.pusku.com/form/getmenuitems.php" + "?tipomenu=" + menuElegido;
	urlMenuItems = "http://kometa.pusku.com/form/getmenuitems.php";

	$('#listaItems li').remove();
		
	//$.getJSON(urlMenuItems, function(data) {
	$.post(urlMenuItems, { tipomenu : menuElegido }, function(data, textStatus) {	
	
		var menuItems = data.items;		
		$.each(menuItems, function(index, menuItem) {
			$("#listaItems").append(
				"<li categoria='" + arrayCategorias[menuItem.categoriaID - 1] + 
					"' categoriaid='" + menuItem.categoriaID +
					"'>" +
			        "<a href=#>" +
			        "<img class='imagen' src='img/cordova.png'>" +
			        "<h1 style='white-space:normal; text-align: justify'>" + menuItem.nombreItem + "</h1>" +
			        "<p style='white-space:normal; text-align: justify'>" + menuItem.descItem + "</p>" +
			        "<h2 style='color:blue'>" + menuItem.precioItem + " €" + "</h2>" +
			        "</a>" +
		        "</li>");
		});
		
		$('#listaItems').children('li').bind('vclick', function(e) {
		/*Lo de restar categoriaid en el índice de menuItems es porque los autodividers
		 * suman 1 al index de los items. Esta solución funciona mientras la categoriaID
		 * de cada categoría siga el orden autonumérico (en este caso del 1 al 4,
		 * pero si estos valores cambiaran hay que buscar otra solución.
		 */
			cleanFormPlatos();
			$("#nombreDetalle").html("<div id='nombreDetalle'>" + menuItems[$(this).index() - $(this).attr('categoriaid')].nombreItem + "</div>");
			$("#descDetalle").html("<div id='descDetalle'>" + menuItems[$(this).index() - $(this).attr('categoriaid')].descItem + "</div>");
			$("#fotoDetalle").html("<div id='fotoDetalle'>" + "<img class='imgDetalle' src='img/cordova.png'>" + "</div>");
			$("#menuDetalle").html("<div id='menuDetalle'>" + arrayMenus[menuItems[$(this).index() - $(this).attr('categoriaid')].menuID - 1] + "</div>");
			$("#categoriaDetalle").html("<div id='categoriaDetalle'>" + arrayCategorias[menuItems[$(this).index() - $(this).attr('categoriaid')].categoriaID - 1]  + "</div>");
			$("#precioDetalle").html("<div id='precioDetalle'>" + "Precio:\n" + menuItems[$(this).index() - $(this).attr('categoriaid')].precioItem + " €" + "</div>");
			$.mobile.changePage ($("#detallePlatoPage"));
		});
		
		//$("#listaItems").listview("refresh");
		
		/*Lo siguiente hace que la lista tenga autodividers en función
		 * de la categoría de cada ítem.
		 */
		$("#listaItems").listview({
            autodividers: true,
            autodividersSelector: function (li) {
                var out = li.attr('categoria');
                return out;
            }
        }).listview('refresh');
        $.mobile.hidePageLoadingMsg();
	//});
	}, "json");
}


function getItemsModificar() {

	//urlItemsModificar = "http://kometa.pusku.com/form/getitemsmodificar.php" + "?tipomenumod=" + menuElegidoMod;
	urlItemsModificar = "http://kometa.pusku.com/form/getitemsmodificar.php";

	$('#listaItemsModificar li').remove();
	
	//$.getJSON(urlItemsModificar, function(data) {
	$.post(urlItemsModificar, { tipomenumod : menuElegidoMod }, function(data, textStatus) {
	
		var itemsModificar = data.items;		
		$.each(itemsModificar, function(index, itemModificar) {
			$("#listaItemsModificar").append(
				"<li categoria='" + arrayCategorias[itemModificar.categoriaID - 1] + 
					"' categoriaid='" + itemModificar.categoriaID + 
					"'>" +
			        "<a href=#>" +
			        "<img class='imagen' src='img/cordova.png'>" +
			        "<h1 style='white-space:normal; text-align: justify'>" + itemModificar.nombreItem + "</h1>" +
			        "<p style='white-space:normal; text-align: justify'>" + itemModificar.descItem + "</p>" +
			        "<h2 style='color:blue'>" + itemModificar.precioItem + " €" + "</h2>" +
			        "</a>" +
		        "</li>");
		});
		//Esto pasa los valores del item pinchado al formulario de 
		//modificación de plato.
		$('#listaItemsModificar').children('li').bind('vclick', function(e) { 
			cleanFormPlatos();
			$("#inputNombrePlatoMod").val(itemsModificar[$(this).index() - $(this).attr('categoriaid')].nombreItem);
			$("#inputDescPlatoMod").val(itemsModificar[$(this).index() - $(this).attr('categoriaid')].descItem);
			$("#inputPrecioPlatoMod").val(itemsModificar[$(this).index() - $(this).attr('categoriaid')].precioItem);
			$("#inputCategoriaPlatoMod").val(itemsModificar[$(this).index() - $(this).attr('categoriaid')].categoriaID);
			$("#inputMenuPlatoMod").val(itemsModificar[$(this).index() - $(this).attr('categoriaid')].menuID);
			modificarID = itemsModificar[$(this).index() - $(this).attr('categoriaid')].menuItemID;
		//Esto devuelve a la página de elegir los platos a modificar sin
		//guardar en la historia la página de modificación, así al dar
		//hacia atrás lleva a la página de inicio	
			$.mobile.changePage ($("#modificarPlatosPage"), { 
				reverse: false, 
				changeHash: false 
			}); 
		});
		
		//$("#listaItemsModificar").listview("refresh");
		$("#listaItemsModificar").listview({
            autodividers: true,
            autodividersSelector: function (li) {
                var out = li.attr('categoria');
                return out;
            }
        }).listview('refresh');
	//});
	}, "json");
}


function getCategorias() {
	
	$.post(urlCategorias, null, function(data, textStatus) { 
		//data contiene el JSON
		//textStatus contiene el status: success, error, etc. 
		//El segundo parámetro (el que es null) es la info que se le pasa al post 
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
			arrayCategorias[index] = categoria.nombreCategoria;
		});
		$("#inputCategoriaPlato").trigger("change");
		$("#inputCategoriaPlatoMod").trigger("change");
	}, "json");
	
	/*$.getJSON(urlCategorias, function(data) {		
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
			arrayCategorias[index] = categoria.nombreCategoria;
		});
		$("#inputCategoriaPlato").trigger("change");
		$("#inputCategoriaPlatoMod").trigger("change");
	});*/
}


function getMenus() {
	
	$.post(urlMenus, null, function(data, textStatus) {
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
			arrayMenus[index] = menu.nombreMenu;
		});
		$("#inputMenuPlato").trigger("change");
		$("#inputMenuPlatoMod").trigger("change");
	}, "json");
	
	
	/*$.getJSON(urlMenus, function(data) {		
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
			arrayMenus[index] = menu.nombreMenu;
		});
		$("#inputMenuPlato").trigger("change");
		$("#inputMenuPlatoMod").trigger("change");
	});*/
}


function cleanFormPlatos(){
	$("#inputNombrePlato").val("");
	$("#inputDescPlato").val("");
	$("#inputPrecioPlato").val("");
	$("#inputNombrePlatoMod").val("");
	$("#inputDescPlatoMod").val("");
	$("#inputPrecioPlatoMod").val("");
	getCategorias();
	getMenus();
}
