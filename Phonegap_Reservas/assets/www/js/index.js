var hora;
var fecha;
var urlHoras;
var urlMesas;
var horaElegida = false;
var blackdates = [];
var reseteoParcial = false;
var blackdatesPuestas = false; //Controla cuándo deben buscarse las blackdates y abrir el calendario

//EVENTOS AL CARGARSE LAS PÃƒï¿½GINAS

//Implementación de fastclick
window.addEventListener('load', function() { 
	FastClick.attach(document.body); 
}, false);

//Esto hace que se muestre el spinner de carga durante todas las operaciones ajax
$(document).delegate('#reservaPage', 'pagecreate', function () { 
	}).ajaxStart(function () { 
		//$.mobile.showPageLoadingMsg(); 
		$.mobile.loading('show');
	}).ajaxComplete(function () { 
		//$.mobile.hidePageLoadingMsg();
		$.mobile.loading('hide'); 
});


$('#reservaPage').bind('pagebeforeshow', function(event) {
	if (blackdatesPuestas == false){
		blackdatesPuestas = true;
		setBlackDates(); //Carga las blackdates y abre el calendario
	}
});


$('#reservaPage').bind('pageshow', function(event) {
	/*Con este if solo se resetea del todo la página si se ha introducido el registro
	 * en la base de datos. Esto es para conseguir que si se ha pulsado el botón de
	 * submit y hay un error de validación, el botón vuelva a su estilo normal.
	 * La pega de esto es que al cargar la página de reseteo y volverse a cargar esta,
	 * se produce un montón de parpadeo. La otra opción es que el botón se quede azul.
	 */	 
	if (reseteoParcial == false){
		validateFormReservas();
		$("#boxHora").hide();
		$("#boxMesa").hide();
		$("#boxNombre").hide();
		$("#boxEmail").hide();
		$("#boxTelefono").hide();
		$("#botonReservar").button('disable');
	} else {
		reseteoParcial = false;
	}
	
	
	/*Digan lo que digan los ejemplos por ahÃƒÂ­, lo que va en el segundo parÃƒÂ©ntesis debe ser "mobile-datebox"
	y no solo "datebox". Esto se debe a un cambio introducido en JQuery Mobile 1.2 o algo asÃƒÂ­.*/
	/*var fechas = ["2013-08-10",'2013-08-20', '2013-08-30'];
	$('#fecha').data('mobile-datebox').options.blackDates = fechas;*/
	
	//Esta lÃƒÂ­nea la proponÃƒÂ­a el creador del DateBox para optimizar el rendimiento:
	//$('#fecha').data('mobile-datebox').options.blackDates = $(element).data('datebox')._fixArray(fechas);
	
	//setColours();
		
});


/*Esta pequeña chapuza la hago para que el botón de submit se resetee tras enviar
 * la info. He probado sin éxito un montón de sistemas con los que se supone que
 * debería funcionar.
 */
$('#resetPage').bind('pagebeforeshow', function(event) {
	/*$.mobile.changePage ($("#reservaPage"), { 
		reverse: false, 
		changeHash: false 
	});*/
	history.back();
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
	if ( $("#mesa").is(':visible') ) {
		$('#mesa option').remove();
		$("#mesa").append('<option data-placeholder="true">Mesa</option>');
		$("#mesa").trigger('change');
	}
	$("#boxHora").show();
});


$('#hora').bind('change', function(event) {
	if (horaElegida == true){
		fecha = $("#fecha").val();
		hora = parseInt($("#hora").val());
		getMesas();
		$("#boxMesa").show();
	}
});


$('#mesa').bind('change', function(event) {
	if ( $('#mesa').val().length < 4 ) { //Comprueba que hay una selección y el valor no es el placeholder
		$('#boxNombre').show();
		$('#nombre').focus(); //Este comando funciona en iOS pero no en Android.		
	}
});

$('#nombre').bind('keyup', function(event) {
	if ($('#nombre').val().length > 1 ){
		if ( $('#nombre').valid() ) {
			$('#boxEmail').show();
		}
	}
}); 

$('#email').bind('keyup', function(event) {
	if ($('#email').val().length > 1 ){
		if ( $('#email').valid() ) {
			$('#boxTelefono').show();
		}
	}
}); 


$(':input').bind('keyup', function(event) {
	$(event.currentTarget).valid(); //Esto valida los text inputs uno a uno.
	//Y esto valida todo el formulario solo cuando ya se ha metido info en los tres text inputs.
	if ($('#nombre').val().length > 1 && $('#email').val().length > 1 && $('#telefono').val().length > 1 ){
		if ( $('#formReserva').valid() ) {
			$("#botonReservar").button('enable');
		}
	}
}); 

/*$('#fecha').bind('datebox', function (e, pressed) {
	setColours();
});
	
$('.ui-datebox-gridplus, .ui-datebox-gridminus').bind('click', function(){
     setColours();
});*/


//$('#formReserva').submit(function() {
$('#botonReservar').bind('vclick', function(event) { 
	//loadingSpinner('on');
	if ( $('#formReserva').valid() ){
		var request = $.ajax({
			beforeSend: function() { $.mobile.showPageLoadingMsg(); }, 
			complete: function() { $.mobile.hidePageLoadingMsg(); },
			url: 'http://kometa.pusku.com/form/insert.php',
			type: 'POST',
			data: { nombre: $("#nombre").val(),
			        fecha: $("#fecha").val(),
			        mesa: $("#mesa").val(),
			        hora: $("#hora").val(),
			        email: $("#email").val(),
			        telefono: $("#telefono").val()
			       },
			success: function(obj){
				if (obj == ""){
					alert("Reserva realizada");
					addToCalendar();
					cleanFormReservas();
					blackdatesPuestas = false; //Esto hace que tras el reinicio se esatablezcan las blackdates y se abra el calendario
					//loadingSpinner('off');
				} else {
					alert(obj); //Esto muestra los errores de validación en PHP, es solo para desarrollo
					reseteoParcial = true;
					$.mobile.changePage ($("#resetPage"), { 
						reverse: false, 
						changeHash: false 
					});
					//loadingSpinner('off');
				}
			},
			error: function(error) {
				alert(error);
				reseteoParcial = true;
				$.mobile.changePage ($("#resetPage"), { 
					reverse: false, 
					changeHash: false 
				});
				//loadingSpinner('off');
			}
		});
	} else {
		reseteoParcial = true;
		$.mobile.changePage ($("#resetPage"), { 
			reverse: false, 
			changeHash: false 
		});
		//loadingSpinner('off');
	}	
});

 
//FUNCIONES

function getHoras() {
	urlHoras = "http://kometa.pusku.com/form/gethoras.php";
	$("#hora").val("");
	$.post(urlHoras, { fecha : fecha }, function(data, textStatus) {	
		$('#hora option').remove();
		var elementoHora = $("#hora");
		elementoHora.append('<option data-placeholder="true">Hora</option>');
		var horas = data.items;		
		var list = "";
		$.each(horas, function(index, hora) {
			/*$("#hora").append('<option value=' + hora.horaID +
			'>' + hora.hora + 
			'</option>');*/
			list += '<option value=' + hora.horaID +
				'>' + hora.hora + 
				'</option>';
		});		
		elementoHora.append(list);
		elementoHora.trigger("change");
		elementoHora.selectmenu("open");
		horaElegida = true;
	}, "json");
}


function getMesas() {
	urlMesas = "http://kometa.pusku.com/form/getmesas.php";
	$("#mesa").val("");
	$.post(urlMesas, { fecha : fecha, hora : hora }, function(data, textStatus) {
		$('#mesa option').remove();
		var elementoMesa = $("#mesa");
		elementoMesa.append('<option data-placeholder="true">Mesa</option>');
		var mesas = data.items;
		var list = "";		
		$.each(mesas, function(index, mesa) {
			/*$("#mesa").append('<option value=' + mesa.mesaID +
			'>' + mesa.comensales + 
			'</option>');*/
			list += '<option value=' + mesa.mesaID +
				'>' + mesa.comensales + 
				'</option>';
		});
		elementoMesa.append(list);
		elementoMesa.trigger("change");
		elementoMesa.selectmenu("open");
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
	//loadingSpinner('on');
	var urlBlackDates = "http://kometa.pusku.com/form/getblackdates-miguel.php";
	//$.getJSON(urlBlackDates, function(data) {
	$.post(urlBlackDates, null, function(data, textStatus) {		
		var datos = data.items;		
		$.each(datos, function(index, dato) {
			blackdates[index] = dato.fecha;
		});
		
		/*Estas son las opciones que he podido estilar. La pega de los highDates 
		y highDatesAlt es que puede pincharse en ellos. Hay que conseguir estilar 
		mejor los blackdates (en el CSS)*/
		
		//$('#fecha').data('mobile-datebox').options.highDates = blackdates;
		//$('#fecha').data('mobile-datebox').options.highDatesAlt = blackdates;
		$('#fecha').data('mobile-datebox').options.blackDates = blackdates;
		
		$('#fecha').datebox('open'); //Abre el datebox tras cargar las blackdates
		//loadingSpinner('off');
	//});
	}, "json");
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
	$("#mesa").append("<option data-placeholder='true'>Elige el número de comensales</option>");
	$('#mesa').trigger("change");
		//Resetea el input del nombre
	$("#nombre").val("");
	$("#nombre").removeClass('valid'); //Así se quita el borde verde tras resetear
	$("#nombre").removeClass('error'); //Lo mismo pero para el estilo de error (por si acaso)
		//Resetea el input del email
	$("#email").val("");
	$("#email").removeClass('valid'); //Así se quita el borde verde tras resetear
	$("#email").removeClass('error'); //Lo mismo pero para el estilo de error (por si acaso)
		//Resetea el input del teléfono
	$("#telefono").val("");
	$("#telefono").removeClass('valid'); //Así se quita el borde verde tras resetear
	$("#telefono").removeClass('error'); //Lo mismo pero para el estilo de error (por si acaso)
		//Deshabilita las select lists
	/*$("#hora").selectmenu('disable');
	$("#mesa").selectmenu('disable');*/
	
	//Esto manda a resetPage, una página en blanco, que inmediatamente devuelve a
	//reservaPage. Es el único modo de resetear el estilo del botón.
	$.mobile.changePage ($("#resetPage"), { 
		reverse: false, 
		changeHash: false 
	});
}


function validateFormReservas(){
	
	$.validator.addMethod("textOnly", 
		function(value, element) {
			return /^([a-zA-Z]+)$/.test(value); //Solo letras
		}, "Introduce solo letras mayúsculas o minúsculas."
	);
	
	var validator = $('#formReserva').validate({
		submitHandler: function(form) { //Esto evita el problema de que al dar al botón "ir" en el teclado active el submit por defecto. Ahora lo activa, pero no hace nada.
		},
		rules: {
			fecha: {
				required: true
			},
			hora: {
				required: true,
				number: true
			},
			mesa: {
				required: true,
				number: true
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
			}, 
			telefono: {
				required: true,
				minlength: 7,
				maxlength: 11,
				number: true				
			}
		},
		messages: {
			fecha: {
				required: "Este campo es obligatorio"
			},
			hora: {
				required: "Este campo es obligatorio",
				number: "Elige una hora"
			},
			mesa: {
				required: "Este campo es obligatorio",
				number: "Elige una mesa"
			},
			nombre: {
				required: "Este campo es obligatorio",
				minlength: "Introduce al menos 5 caracteres",
				maxlength: "Introduce un máximo de 30 caracteres"
			},
			email: {
				required: "Este campo es obligatorio",
				minlength: "Introduce al menos 5 caracteres",
				maxlength: "Introduce un máximo de 50 caracteres",
				email: "Introduce un email correcto"
			},
			telefono: {
				required: "Este campo es obligatorio",
				minlength: "Introduce al menos 7 números",
				maxlength: "Introduce un máximo de 11 números",
				number: "Introduce solo números"				
			}
		}
	});
	
	validator.resetForm();
}