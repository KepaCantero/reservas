var hora;
var fecha;
var urlHoras;
var urlMesas;
var horaElegida = false;

//EVENTOS AL CARGARSE LAS PÃ�GINAS

$('#reserva').bind('pagebeforeshow', function(event) {
	setBlackDates();
});

$('#reserva').bind('pageshow', function(event) {
	$("#formulario").validate({
	      rules: {
	         nombre: {
	             required: true, minlength: 5
	         }/*, 
	         email_addr_repeat: {
	        	 equalTo: email_addr
	         }*/
	     }     
	});
	
	/*Digan lo que digan los ejemplos por ahÃ­, lo que va en el segundo parÃ©ntesis debe ser "mobile-datebox"
	y no solo "datebox". Esto se debe a un cambio introducido en JQuery Mobile 1.2 o algo asÃ­.*/
	/*var fechas = ["2013-08-10",'2013-08-20', '2013-08-30'];
	$('#fecha').data('mobile-datebox').options.blackDates = fechas;*/
	
	//Esta lÃ­nea la proponÃ­a el creador del DateBox para optimizar el rendimiento:
	//$('#fecha').data('mobile-datebox').options.blackDates = $(element).data('datebox')._fixArray(fechas);
	
	//setColours();
		
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
	urlHoras = "http://kometa.pusku.com/form/gethoras.php" + "?fecha=" + fecha;
	getHoras();
});

$('#hora').bind('change', function(event) {
	if (horaElegida == true){
		fecha = $("#fecha").val();
		hora = parseInt($("#hora").val());
		urlMesas = "http://kometa.pusku.com/form/getmesas.php" + "?fecha=" + fecha + "&hora=" + hora;
		getMesas();
		
	}
});

/*$('#fecha').bind('datebox', function (e, pressed) {
	setColours();
});
	
$('.ui-datebox-gridplus, .ui-datebox-gridminus').bind('click', function(){
     setColours();
});*/

//$('#formulario').submit(function() {
$('#botonReservar').bind('vclick', function(event) { 
	if ($('#formulario').valid()){
		var request = $.ajax({
			url: 'http://kometa.pusku.com/form/insert.php',
			type: 'POST',
			data: { nombre: $("#nombre").val(),
			        fecha: $("#fecha").val(),
			        mesa: $("#mesa").val(),
			        hora: $("#hora").val() },
			success: function(obj){
				alert("Reserva realizada");
				AddToCalendar();
			},
			error: function(error) {
				alert(error);
			}
		});
	}
});

 
//FUNCIONES

function getHoras() {
	$.getJSON(urlHoras, function(data) {
		
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
	});
}

function getMesas() {
	
	
	$.getJSON(urlMesas, function(data) {
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
	});
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
	url = "http://kometa.pusku.com/form/getblackdates-miguel.php";
	var blackdates = new Array();
	$.getJSON(url, function(data) {		
		var datos = data.items;		
		$.each(datos, function(index, dato) {
			blackdates[index] = dato.fecha;
		});
	});
	
	/*Estas son las opciones que he podido estilar. La pega de los highDates y highDatesAlt es que puede 
	pincharse en ellos. Hay que conseguir estilar mejor los blackdates (en el CSS)*/
	
	//$('#fecha').data('mobile-datebox').options.highDates = blackdates;
	//$('#fecha').data('mobile-datebox').options.highDatesAlt = blackdates;
	$('#fecha').data('mobile-datebox').options.blackDates = blackdates;
}


function AddToCalendar() {
	
	//var nombre= $("#nombre").val();
    var fecha= $("#fecha").val();
    var mesa= $("#mesa").val();
    var hora= $("#hora").val(); 
	window.MainActivity.addEventToCalendarString(fecha,hora,mesa);
    }


