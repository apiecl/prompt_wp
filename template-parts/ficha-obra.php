<?php 
$term = get_term_by( 'slug', get_query_var( 'term' ), 'obra' );
$fields = prompt_obra_metadata( $term->term_id );
?>
	
	<h1>Ficha artística</h1>

	<div class="row">
		<dl class="col-md-3 col-7">
			
			<div class="mini-time">
				<dt class="important">Fecha de estreno</dt>
				<dd class="important"><?php echo prompt_format_date($fields['estreno'][0]);?></dd>
				
				<dt>Inicio de la temporada</dt>
				<dd><?php echo prompt_format_date($fields['temporada_inicio'][0]);?></dd>
				
				<dt>Sala de presentación</dt> 
				<dd><?php echo $fields['sala'][0];?></dd>
				
				<dt>N° de funciones</dt>
				<dd><?php echo $fields['funciones'][0];?></dd>
					
				<dt>Duración de la obra</dt>
				<dd><?php echo $fields['duracion'][0];?> minutos</dd>
				
				<dt class="important">Fin de la temporada</dt>
				<dd class="important"><?php echo prompt_format_date($fields['temporada_fin'][0]);?></dd>
			</div>

		</dl>

		<dl class="col-md-3 col-5">

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

	</div>

	<div class="row">
									<div class="intro-obra col-md-8 col-7">
										<header class="ficha-title">
											<h2>Reseña</h2>
										</header>
										<?php echo $fields['review'][0];?>
									</div>
									<dl class="col-md-4 col-5">
										<header class="ficha-title">
											<h2>Elenco</h2>
										</header> 
										<dd class="strong-dd elenco"><?php echo prompt_multifields($fields['elenco'][0], ' <br> ');?></dd>
									</dl>
								</div>