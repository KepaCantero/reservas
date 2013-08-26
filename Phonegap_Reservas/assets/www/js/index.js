var urlMenuItems;
var menuElegido;

//EVENTOS AL CARGARSE LAS PÁGINAS

$('#botonesPage').bind('pageinit', function(event) {
	
});


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

	//urlMenuItems = "http://kometa.pusku.com/form/getmenuitems.php";
	urlMenuItems = "http://kometa.pusku.com/form/getmenuitems.php" + "?tipomenu=" + menuElegido;
	
	$('#listaItems li').remove();

	$.getJSON(urlMenuItems, function(data) {
		
		var menuItems = data.items;		
		$.each(menuItems, function(index, menuItem) {
			$("#listaItems").append("<li>" +
		        "<a href=#>" + 
		        "<h1>" + menuItem.nombreItem + "</h1>" +
		        "<p>" + menuItem.descItem + "</p>" + 
		        "<h2>" + menuItem.precioItem + "</h2>" +
		        "</a>" + 
	        "</li>");
		});
		
		$("#listaItems").listview ();
	});
}