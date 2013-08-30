var url;
var hora;
var fecha;
/*Uso la variable "control" para que la página del formulario solo se cargue cuando se ha elegido una hora de la
lista desplegable. Esta variable coge valor 0 cuando se inicia la página de selección de fecha y hora y se vuelve
1 cuando se ha elegido una hora. 
Si no se hace así, el evento "change" se llama en cuanto se cargan los valores de la lista,
antes de seleccionar nada. Es una solución eficaz, eficiente e ingeniosa, típica del Code Gigolo.*/
var control;

//EVENTOS AL CARGARSE LAS PÁGINAS

$('#horasPage').bind('pageinit', function(event) {
	control = 0;
});

$('#reserva').bind('pageshow', function(event) {
	$("#formulario").validate({
	      rules: {
	         full_name: {
	             required: true, minlength: 5
	         }, 
	         email_addr_repeat: {
	        	 equalTo: email_addr
	         }
	     }     
	   });
	$('#time_dt').val(hora);
	$('#date_dt').val(fecha);
});


//LISTENERS DE COMPONENTES 

$('#formfecha').bind('change', function(event) {
	fecha = $("#formfecha").val();
	url = "http://kometa.pusku.com/form/gethoras.php" + "?fecha=" + fecha;
	getHoras();
});

$('#lista-horas').bind('change', function(event) {
	if (control == 1){
		hora = $("#lista-horas").val();
		$.mobile.changePage ($("#reserva"));
	}
});

$('#formulario').submit(function() { 
	if ($('#formulario').valid()){
		var request = $.ajax({
			url: 'http://kometa.pusku.com/form/insert.php',
			type: 'POST',
			data: { full_name: $("#full_name").val(),
			        email_addr: $("#email_addr").val(),
			        password: $("#password").val(),
			        arrival_dt: $("#date_dt").val(),
			        time_dt: $("#time_dt").val(),
			        personas: $("#personas").val() },
			success: function(obj){
				alert("Reserva realizada");
			},
			error: function(error) {
				alert(error);
			}
		});
	}
});

//FUNCIONES

function getHoras() {
	$.getJSON(url, function(data) {
		
		$('#lista-horas option').remove();
		var horas = data.items;
		$.each(horas, function(index, hora) {
			$("#lista-horas").append('<option value=' + hora.hora +
			'>' + hora.hora + 
			'</option>');
		});
		
		$("#lista-horas").trigger("change");
		control = 1;
		$("#lista-horas").selectmenu("open");
	});
}