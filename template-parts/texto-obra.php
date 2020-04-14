<?php 
$term = get_term_by( 'slug', get_query_var( 'term' ), 'obra' );
$playtext = bit_get_play($term->term_id);
$fields = prompt_obra_metadata( $term->term_id );
?>

<div class="row header-texto-dramatico">
	<div class="col-md-12">
		<h1>Texto dramático</h1>
		<h2><?php echo $term->name;?> / <?php echo prompt_format_date($fields['estreno'][0]);?></h2>
		<p>Historia y texto de <?php echo prompt_multifields($fields['dramaturgia'][0], ', ');?></p>
	</div>
</div>

<div class="utils">
	
	<div class="row">
		<div class="col-md-12"> 
			<div class="info-texto">
				<p>Aquí puedes leer todo el texto de la obra. Los párrafos con el ícono <i class="fas fa-images"></i> tienen fotos, videos, musica o documentos asociados.</p>
			</div>
		</div>
	</div>
	

	<div class="row">
		<div class="col-md-4">
			<div class="custom-control custom-switch">
				<input type="checkbox" class="custom-control-input" id="enableType">
				<label class="custom-control-label" for="enableType">Tipos de acción</label>
			</div>
		</div>
		<div class="col-md-4">
			<div class="custom-control custom-switch">
				<input type="checkbox" class="custom-control-input" id="onlyMedia">
				<label class="custom-control-label" for="onlyMedia">Sólo materiales asociados</label>
			</div>
		</div>
		<div class="col-md-4">
			<div class="custom-control custom-switch">
				<input type="checkbox" class="custom-control-input" id="filterPersonajes">
				<label class="custom-control-label" for="filterPersonajes">Filtrar personajes</label>
			</div>
		</div>
	</div>
	
	<div class="row textlegend">
		<div class="col-md-12">
			<span class="typelabel acotacion"><i class="fas fa-quote-left"></i> Acotación</span>
			<span class="typelabel descripcion"><i class="fas fa-scroll"></i> Descripción</span>
			<span class="typelabel cancion"><i class="fas fa-music"></i> Canción</span>
			<span class="typelabel dialogo"><i class="fas fa-comments"></i> Diálogo</span>
			<span class="typelabel monologo"><i class="fas fa-comment-dots"></i> Monólogo</span>
			<span class="typelabel letra"><i class="fas fa-font"></i> Letra</span>
		</div>
	</div>

	<div class="row textPersonajes">
		<div class="col-md-12">
			<!-- Ajax acá van los personajes -->
		</div>
	</div>
</div>

<div class="texto-dramatico">
	<?php
	foreach( $playtext as $playline ) {
		$tipo = sanitize_title( $playline->tipo);
		$media = $playline->ids_asoc;
		$mediacount = count(explode(', ', $media));
		$mediazoneid = uniqid();
		//echo $media;
		?>
		<div class="row playtext-row" data-type="<?php echo $tipo;?>" data-hasmedia="<?php echo ($media != null ? 'true' : 'false');?>" data-personajes="<?php echo $playline->personajes;?>">
			<div class="col-1">
				<?php if($media):?>
					<a href="#" class="btn btn-light trigger-media" data-plain-id="<?php echo $mediazoneid;?>" data-expand="#<?php echo $mediazoneid;?>" data-assoc="<?php echo $media;?>" title="Ver el material asociado a esta sección del texto.">
						<i class="fas fa-images"></i> <span class="badge badge-light"><?php echo $mediacount;?></span>
					</a>
				<?php endif;?>
			</div>
			<div class="col-11">
				
				<div class="row">
					<div class="col-md-12 maintext-col">
						<div class="text-item  <?php echo ($tipo != null ? 'tipo-' . $tipo : '');?> <?php echo ($media != null ? ' hasmedia' : '');?> " data-tipo="<?php echo $tipo;?>" data-personajes="<?php echo $playline->personajes;?>" data-assoc="<?php echo $media;?>"><?php echo $playline->texto;?></div>	
					</div>
					<div class="col-md-2 col-personajes hidden">
						<?php 
						if($playline->personajes) {
							$personajesline = explode(',', $playline->personajes);
							?>
							<div class="personajes">
								<?php 
								foreach($personajesline as $personaje) {
									echo '<p>' . $personaje . '</p>';
								}
								?>	
							</div>
							<?php 
						}
						?>
					</div>
				</div>
			</div>

		</div>
		<div class="row full-row media-zone" id="<?php echo $mediazoneid;?>">
			<!-- ajax loaded content-->
		</div>	
		<?php
	}
	?>

	<div class="modal fade modal-media-text" tabindex="-1" role="dialog" id="modal-media-text" aria-hidden="true">
		<div class="modal-dialog modal-xl" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title"><!-- Title here --></h1>
					<span type="button" class="close" data-dismiss="modal" aria-label="Close">
						<i class="fas fa-times"></i>
					</span>
				</div>
				<div class="modal-body">
					<!-- Content here -->
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
				</div>
			</div>
		</div>
	</div>

</div>
