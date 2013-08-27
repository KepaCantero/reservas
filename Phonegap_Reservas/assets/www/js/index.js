var urlMenuItems;
var menuElegido;

//EVENTOS AL CARGARSE LAS PÁGINAS

/*$('#listaPage').bind('pageload', function(event) {
	$("#listaItems").listview();
});*/


//LISTENERS DE COMPONENTES 

$('#botMenuDia').bind('vclick', function(event) {
	menuElegido = 1;
	getMenuItems();
	$.mobile.changePage ($("#listaPage"));
});

$('#botMenuEspecial').bind('vclick', function(event) {
	menuElegido = 2;
	getMenuItems();
	$.mobile.changePage ($("#listaPage"));
});

$('#botMenuCarta').bind('vclick', function(event) {
	menuElegido = 3;
	getMenuItems();
	$.mobile.changePage ($("#listaPage"));
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
			        /*"<a href=#>" +*/
			        "<img class='imagen' src='img/cordova.png'>" +
			        "<h1 class='txtnombre'>" + menuItem.nombreItem + "</h1>" +
			        "<p class='txtdesc'>" + menuItem.descItem + "</p>" +
			        "<h2 class='txtprecio'>" + menuItem.precioItem + " €" + "</h2>" +
			        /*"</a>" +*/
		        "</li>");
		});
		$("#listaItems").listview("refresh");
	});
}