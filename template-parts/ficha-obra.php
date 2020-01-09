<?php 
$term = get_term_by( 'slug', get_query_var( 'term' ), 'obra' );
$fields = prompt_obra_metadata( $term->term_id );
?>
<div class="ficha-obra">
	<div class="row">
		<dl class="col-md-3">

			<dt>Fecha de estreno</dt>
			<dd><?php echo prompt_format_date($fields['estreno'][0]);?></dd>

			<dt>Inicio de la temporada</dt>
			<dd><?php echo prompt_format_date($fields['temporada_inicio'][0]);?></dd>

			<dt>Fin de la temporada</dt>
			<dd><?php echo prompt_format_date($fields['temporada_fin'][0]);?></dd>

		</dl>

		<dl class="col-md-3">

			<dt>Dirección</dt> 
			<dd><?php echo prompt_multifields($fields['direccion'][0], ', ');?></dd>

			<dt>Dramaturgia</dt> 
			<dd><?php echo prompt_multifields($fields['dramaturgia'][0], ', ');?></dd>

			<dt>Asistente de Dirección</dt> 
			<dd><?php echo prompt_multifields($fields['asistente'][0], ', ');?></dd>

			<dt>Dirección musical</dt> 
			<dd><?php echo prompt_multifields($fields['direccion_musical'][0], ', ');?></dd>

			<dt>Dirección coreográfica</dt> 
			<dd><?php echo prompt_multifields($fields['direccion_coreografica'][0], ', ');?></dd>

			<dt>Escenografía e Iluminación</dt> 
			<dd><?php echo prompt_multifields($fields['escenografia_iluminacion'][0], ', ');?></dd>

			<dt>Vestuario</dt> 
			<dd><?php echo prompt_multifields($fields['vestuario'][0], ', ');?></dd>

		</dl>

		<dl class="col-md-3">
			<dt>Elenco</dt> 
			<dd><?php echo prompt_multifields($fields['elenco'][0], ' <br> ');?></dd>
		</dl>

		<dl class="col-md-3">
			<dt>Sala de presentación</dt> 
			<dd><?php echo $fields['sala'][0];?></dd>

			<dt>Número de funciones</dt>
			<dd><?php echo $fields['funciones'][0];?></dd>
	
			<dt>Duración de la obra</dt>
			<dd><?php echo $fields['duracion'][0];?> minutos</dd>
		</dl>

	</div>
</div>