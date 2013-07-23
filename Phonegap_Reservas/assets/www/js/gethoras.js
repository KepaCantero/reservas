var url;
var hora;

/*$('#horasPage').bind('pageinit', function(event) {
	var fecha = "2012-12-13";
	url = "http://kometa.pusku.com/form/gethoras.php" + "?fecha=" + fecha;
	getHoras();
});*/

$('#formfecha').bind('change', function(event) {
	var fecha = $("#formfecha").val();
	url = "http://kometa.pusku.com/form/gethoras.php" + "?fecha=" + fecha;
	getHoras();
});

$('#lista-horas').bind('change', function(event) {
	hora = $("#lista-horas").val();
	$.mobile.changePage ($("#reserva"));
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
	//$('#time_dt').val(hora);
});

$('#formulario').submit(function() { 
	if ($('#formulario').valid()){
		var request = $.ajax({
			url: 'http://kometa.pusku.com/form/insert.php',
			type: 'POST',
			data: { full_name: $("#full_name").val(),
			        email_addr: $("#email_addr").val(),
			        password: $("#password").val(),
			        arrival_dt: $("#arrival_dt").val(),
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
		$("#lista-horas").selectmenu("open");
	});
}