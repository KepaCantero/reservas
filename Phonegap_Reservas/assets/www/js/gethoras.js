var horas;
var url;

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

$('#lista-horas').bind('data', function(event) {
	var hora = $("#lista-horas").val();
	$.mobile.changePage ($("#reserva"));
	$('#time_dt').val(hora);
});

function getHoras() {
	$.getJSON(url, function(data) {
		
		$('#lista-horas option').remove();
		horas = data.items;
		$.each(horas, function(index, hora) {
			$("#lista-horas").append('<option value=' + index +
			'>' + hora.hora + 
			'</option>');
		});
		
		$("#lista-horas").trigger("change");
		$("#lista-horas").selectmenu("open");
	});
}