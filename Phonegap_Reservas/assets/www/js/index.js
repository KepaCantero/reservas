var hora;
var fecha;
var urlHoras;
var urlMesas;
var horaElegida = false;
var blackdates = [];
var reseteoParcial = false;

//EVENTOS AL CARGARSE LAS PÃ�GINAS

$('#reservaPage').bind('pagebeforeshow', function(event) {
	setBlackDates();	
});


$('#reservaPage').bind('pageshow', function(event) {
	/*Con este if solo se resetea del todo la p�gina si se ha introducido el registro
	 * en la base de datos. Esto es para conseguir que si se ha pulsado el bot�n de
	 * submit y hay un error de validaci�n, el bot�n vuelva a su estilo normal.
	 * La pega de esto es que al cargar la p�gina de reseteo y volverse a cargar esta,
	 * se produce un mont�n de parpadeo. La otra opci�n es que el bot�n se quede azul.
	 */	 
	if (reseteoParcial == false){
		validateFormReservas();
		$("#hora").selectmenu('disable');
		$("#mesa").selectmenu('disable');
		$("#nombre").textinput('disable');
		$("#email").textinput('disable');
	} else {
		reseteoParcial = false;
	}
	
	
	/*Digan lo que digan los ejemplos por ahÃ­, lo que va en el segundo parÃ©ntesis debe ser "mobile-datebox"
	y no solo "datebox". Esto se debe a un cambio introducido en JQuery Mobile 1.2 o algo asÃ­.*/
	/*var fechas = ["2013-08-10",'2013-08-20', '2013-08-30'];
	$('#fecha').data('mobile-datebox').options.blackDates = fechas;*/
	
	//Esta lÃ­nea la proponÃ­a el creador del DateBox para optimizar el rendimiento:
	//$('#fecha').data('mobile-datebox').options.blackDates = $(element).data('datebox')._fixArray(fechas);
	
	//setColours();
		
});


/*Esta peque�a chapuza la hago para que el bot�n de submit se resetee tras enviar
 * la info. He probado sin �xito un mont�n de sistemas con los que se supone que
 * deber�a funcionar.
 */
$('#resetPage').bind('pagebeforeshow', function(event) {
	$.mobile.changePage ($("#reservaPage"), { 
		reverse: false, 
		changeHash: false 
	});
});


//LISTENERS DE COMPONENTES 

/*Estos tres listeners evitan que el select de mesas se despligue indebidamente (horaElegida solo es true tras 
	seleccionar una fecha)*/
$('#fecha').bind('vclick', function(event) {
	horaElegida = false;
});


$('#hora').bind('vclick', function(event) {
	horaElegida = false;
});


$('#mesa').bind('vclick', function(event) {
	horaElegida = false;
}); 


$('#fecha').bind('change', function(event) {
	fecha = $("#fecha").val();
	getHoras();
	$("#hora").selectmenu('enable');
});


$('#hora').bind('change', function(event) {
	if (horaElegida == true){
		fecha = $("#fecha").val();
		hora = parseInt($("#hora").val());
		getMesas();
		$("#mesa").selectmenu('enable');
	}
});


$('#mesa').bind('change', function(event) {	
	$('#nombre').textinput('enable');
	$('#nombre').focus(); //Este comando funciona en iOS pero no en Android.
});

$('#nombre').bind('change', function(event) {	
	$('#email').textinput('enable');
	$('#email').focus(); //Este comando funciona en iOS pero no en Android.
});


/*$('#fecha').bind('datebox', function (e, pressed) {
	setColours();
});
	
$('.ui-datebox-gridplus, .ui-datebox-gridminus').bind('click', function(){
     setColours();
});*/


//$('#formReserva').submit(function() {
$('#botonReservar').bind('vclick', function(event) { 
	if ( $('#formReserva').valid() ){
		var request = $.ajax({
			url: 'http://kometa.pusku.com/form/insert.php',
			type: 'POST',
			data: { nombre: $("#nombre").val(),
			        fecha: $("#fecha").val(),
			        mesa: $("#mesa").val(),
			        hora: $("#hora").val(),
			        email: $("#email").val()
			       },
			success: function(obj){
				if (obj == ""){
					alert("Reserva realizada");
					addToCalendar();
					cleanFormReservas();
				} else {
					alert(obj); //Esto muestra los errores de validaci�n en PHP, es solo para desarrollo
				}
			},
			error: function(error) {
				alert(error);
				reseteoParcial = true;
				$.mobile.changePage ($("#resetPage"), { 
					reverse: false, 
					changeHash: false 
				});
			}
		});
	} else {
		reseteoParcial = true;
		$.mobile.changePage ($("#resetPage"), { 
			reverse: false, 
			changeHash: false 
		});
	}	
});

 
//FUNCIONES

function getHoras() {
	//urlHoras = "http://kometa.pusku.com/form/gethoras.php" + "?fecha=" + fecha;
	urlHoras = "http://kometa.pusku.com/form/gethoras.php";
	//$.getJSON(urlHoras, function(data) {
	$.post(urlHoras, { fecha : fecha }, function(data, textStatus) {	
		$('#hora option').remove();
		$("#hora").append('<option data-placeholder="true">Hora</option>');
		var horas = data.items;		
		$.each(horas, function(index, hora) {
			$("#hora").append('<option value=' + hora.horaID +
			'>' + hora.hora + 
			'</option>');
		});
		
		$("#hora").trigger("change");
		$("#hora").selectmenu("open");
		horaElegida = true;
	//});
	}, "json");
}


function getMesas() {
	//urlMesas = "http://kometa.pusku.com/form/getmesas.php" + "?fecha=" + fecha + "&hora=" + hora;
	urlMesas = "http://kometa.pusku.com/form/getmesas.php";
	//$.getJSON(urlMesas, function(data) {
	$.post(urlMesas, { fecha : fecha, hora : hora }, function(data, textStatus) {
		$('#mesa option').remove();
		$("#mesa").append('<option data-placeholder="true">Mesa</option>');
		var mesas = data.items;		
		$.each(mesas, function(index, mesa) {
			
			$("#mesa").append('<option value=' + mesa.mesaID +
			'>' + mesa.comensales + 
			'</option>');
		});
		$('#mesa').trigger("change");
		$('#mesa').selectmenu("open");
	//});
	}, "json");
}

 
/*function setColours(){
			
	//var festivos = new Array(2,10,15,25 );
	var fulldays = new Array(4,13,18,28 );
	var urlFestivos = "http://kometa.pusku.com/form/getblackdates-kepa.php";
		
	$.getJSON(urlFestivos, function(data) {		
		var datos = data.items;		
		var festivos = new Array();
		$.each(datos, function(index, dato) {
			festivos[index] = parseInt(dato.dias);
		});
		
		var cycle = ["ui-btn-up-verde", "ui-btn-up-rojo"];
		$('.ui-datebox-griddate').each(function () {
			$(this).data("ui-btn-cycle", cycle); 
			var data= $(this).data();
			if (jQuery.inArray(data["date"], festivos) > -1){ 
				$(this).data("ui-btn-cycle", cycle);
	 	  		this.className = this.className.replace(/ui-btn-up-./, cycle[0]);
	 	  	}
			if (jQuery.inArray(data["date"], fulldays) > -1) { 
			 	$(this).data("ui-btn-cycle", cycle);
		  		this.className = this.className.replace(/ui-btn-up-./, cycle[1]);
		  	}
		});
	}); 
}*/


function setBlackDates(){
	var urlBlackDates = "http://kometa.pusku.com/form/getblackdates-miguel.php";
	//$.getJSON(urlBlackDates, function(data) {
	$.post(urlBlackDates, null, function(data, textStatus) {		
		var datos = data.items;		
		$.each(datos, function(index, dato) {
			blackdates[index] = dato.fecha;
		});
	//});
	}, "json");
	
	/*Estas son las opciones que he podido estilar. La pega de los highDates y highDatesAlt es que puede 
	pincharse en ellos. Hay que conseguir estilar mejor los blackdates (en el CSS)*/
	
	//$('#fecha').data('mobile-datebox').options.highDates = blackdates;
	//$('#fecha').data('mobile-datebox').options.highDatesAlt = blackdates;
	$('#fecha').data('mobile-datebox').options.blackDates = blackdates;
}


function addToCalendar() {
	//var nombre= $("#nombre").val();
    var fecha= $("#fecha").val();
    var mesa= $("#mesa").val();
    var hora= $("#hora").val(); 
	window.MainActivity.addEventToCalendarString(fecha,hora,mesa);
}


function cleanFormReservas(){
		//Resetea el selector de fecha
	$("#fecha").val("");
		//Resetea la select list "hora"
	$('#hora option').remove();
	$("#hora").append("<option data-placeholder='true'>Elige una hora</option>");
	$('#hora').trigger("change");
	horaElegida = false;
		//Resetea la select list "mesa"
	$('#mesa option').remove();
	$("#mesa").append("<option data-placeholder='true'>Elige el n�mero de comensales</option>");
	$('#mesa').trigger("change");
		//Resetea el input del nombre
	$("#nombre").val("");
	$("#nombre").removeClass('valid'); //As� se quita el borde verde tras resetear
	$("#nombre").removeClass('error'); //Lo mismo pero para el estilo de error (por si acaso)
		//Resetea el input del email
	$("#email").val("");
	$("#email").removeClass('valid'); //As� se quita el borde verde tras resetear
	$("#email").removeClass('error'); //Lo mismo pero para el estilo de error (por si acaso)
		//Deshabilita las select lists
	$("#hora").selectmenu('disable');
	$("#mesa").selectmenu('disable');
	
	//Esto manda a resetPage, una p�gina en blanco, que inmediatamente devuelve a
	//reservaPage. Es el �nico modo de resetear el estilo del bot�n.
	$.mobile.changePage ($("#resetPage"), { 
		reverse: false, 
		changeHash: false 
	});
}


function validateFormReservas(){
	
	$.validator.addMethod("textOnly", 
		function(value, element) {
			return /^([a-zA-Z]+)$/.test(value); //Solo letras
		}, "Introduce solo letras may�sculas o min�sculas."
	);
	
	var validator = $('#formReserva').validate({
		rules: {
			fecha: {
				required: true
			},
			nombre: {
				required: true,
				minlength: 5,
				maxlength: 30,
				textOnly: true
			},
			email: {
				required: true,
				minlength: 5,
				maxlength: 50,
				email: true
			}
		},
		messages: {
			fecha: {
				required: "Este campo es obligatorio"
			},
			nombre: {
				required: "Este campo es obligatorio",
				minlength: "Introduce al menos 5 caracteres",
				maxlength: "Introduce un m�ximo de 30 caracteres"
			},
			email: {
				required: "Este campo es obligatorio",
				minlength: "Introduce al menos 5 caracteres",
				maxlength: "Introduce un m�ximo de 50 caracteres",
				email: "Introduce un email correcto"
			}
		}
	});
	
	validator.resetForm();
}