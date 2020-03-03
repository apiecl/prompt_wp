<?php 
$term = get_term_by( 'slug', get_query_var( 'term' ), 'obra' );
$playtext = bit_get_play($term->term_id);
?>

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
	</div>
	
	<div class="row textlegend">
		<div class="col-md-12">
			<span class="typelabel acotacion">Acotación</span>
			<span class="typelabel descripcion">Descripción</span>
			<span class="typelabel cancion">Canción</span>
			<span class="typelabel dialogo">Diálogo</span>
			<span class="typelabel monologo">Monólogo</span>
			<span class="typelabel letra">Letra</span>
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
		<div class="row playtext-row" data-type="<?php echo $tipo;?>" data-hasmedia="<?php echo ($media != null ? 'true' : 'false');?>">
			<div class="col-1">
				<?php if($media):?>
					<a href="#" class="btn btn-light trigger-media" data-plain-id="<?php echo $mediazoneid;?>" data-expand="#<?php echo $mediazoneid;?>" data-assoc="<?php echo $media;?>" title="Ver el material asociado a esta sección del texto.">
						<i class="fas fa-images"></i> <span class="badge badge-light"><?php echo $mediacount;?></span>
					</a>
				<?php endif;?>
			</div>
			<div class="col-11">

				<div class="text-item  <?php echo ($tipo != null ? 'tipo-' . $tipo : '');?> <?php echo ($media != null ? ' hasmedia' : '');?> " data-tipo="<?php echo $tipo;?>" data-personajes="<?php echo $playline->personajes;?>" data-assoc="<?php echo $media;?>"><?php echo $playline->texto;?></div>



			</div>

		</div>
		<div class="row full-row media-zone" id="<?php echo $mediazoneid;?>">
			<div class="col-md-12">
				<!-- ajax loaded content-->
			</div>
		</div>	
		<?php
	}
	?>
</div>