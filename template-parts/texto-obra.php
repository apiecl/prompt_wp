<?php 
$term = get_term_by( 'slug', get_query_var( 'term' ), 'obra' );
$playtext = bit_get_play($term->term_id);
$fields = prompt_obra_metadata( $term->term_id );
?>

<div class="row header-texto-dramatico">
	<div class="col-md-12">
		<h2><?php echo $term->name;?> / <?php echo prompt_format_date($fields['estreno'][0]);?></h2>
		<p>Historia y texto de <?php echo prompt_multifields($fields['dramaturgia'][0], ', ');?></p>
	</div>
</div>

<div class="utils hidden">
	
	<div class="row">
		<div class="col-md-12"> 
			<div class="info-texto">
				<p>Aquí puedes leer todo el texto de la obra. Los párrafos con el ícono <i class="fas fa-images"></i> tienen fotos, videos, musica o documentos asociados.</p>
			</div>
		</div>
	</div>
	

	<div class="row escenas">
		<div class="col-md-12">
			<?php 
			$escenas = get_term_meta( $term->term_id, '_prompt_escenas', true );
			foreach($escenas as $escena) {
				?>
				<span class="typelabel label-escena" data-escena="<?php echo $escena;?>"><?php echo $escena;?></span>
				<?php
			}
			?>
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
	<div class="row textParlamentos">
		<div class="col-md-12">
			<!-- Ajax con los parlamentos -->
		</div>
	</div>
</div>



<div class="texto-dramatico">
	<div class="row">
		<div class="col-md-11 col-11">
			<?php
			$escena = '';
			$escenas = [];
			foreach( $playtext as $playline ) {
		//var_dump($playline);
				$tipo = sanitize_title( $playline->tipo);
				$media = $playline->ids_asoc;
				$mediacount = count(explode(', ', $media));
				$mediazoneid = uniqid();
		//echo $media;

				if($playline->escena != $escena):
					$escena = $playline->escena;
					$escenas[] = $escena;
					echo '<div class="row scene-row scene-marker" id="' . sanitize_title( $escena ) . '"><div class="col-11"><h3>' . $escena . '</h3></div></div>';

				endif;
				?>
				<div class="row playtext-row" data-type="<?php echo $tipo;?>" data-hasmedia="<?php echo ($media != null ? 'true' : 'false');?>" <?php echo bit_dataline($playline);?> >
					
					<div class="col-11">

						<div class="row">
							<div class="col-md-12 maintext-col">
								<div class="text-item  <?php echo ($tipo != null ? 'tipo-' . $tipo : '');?> <?php echo ($media != null ? ' hasmedia' : '');?> " <?php echo bit_dataline($playline);?> ><?php echo($playline->parlamento ? '<span class="acot">' . $playline->parlamento . ': </span>': '');?><?php echo $playline->texto;?>
								<?php if($media):?>
									<a href="#" class="trigger-media" data-plain-id="<?php echo $mediazoneid;?>" data-expand="#<?php echo $mediazoneid;?>" data-assoc="<?php echo $media;?>" title="Ver el material asociado a esta sección del texto.">
										<i class="fas fa-images"></i> <span class="badge badge-light"><?php echo $mediacount;?></span>
									</a>
								<?php endif;?>
								</div>
							</div>
						</div>
					</div>

				</div>
				<div class="row full-row media-zone" id="<?php echo $mediazoneid;?>">
					<!-- ajax loaded content-->
					<?php get_template_part('template-parts/loading');?>
				</div>	



				<?php
			}
			?>
		</div>
		
		
	</div>

	<div class="modal fade modal-media-text" tabindex="-1" role="dialog" id="modal-media-text-materiales" aria-hidden="true">
		<div class="modal-dialog modal-xl" role="document">
			<div class="modal-content">
				<div class="modal-header">
					
					<span type="button" class="close" data-dismiss="modal" aria-label="Close">
						<i class="fas fa-times"></i>
					</span>
				</div>
				<div class="modal-body">
					<!-- Content here -->
					<?php get_template_part('template-parts/loading');?>
				</div>
			</div>
		</div>
	</div>

</div>

<span class="bordered-blue"></span>

<div class="escena-container">
			<div class="escena-rotation">
				<div class="escena-wrapper">
					<span class="escenalabel">
						<!-- Aca se carga la escena en scroll -->
					</span>
				</div>
				<div class="escena-nav">
					<h5>Ir a escena</h5>
					<select name="selectScene" id="selectScene" class="escena-nav-select">
					<?php foreach($escenas as $escena):?>
						<option value="#<?php echo sanitize_title( $escena);?>"><?php echo $escena;?></a>
					<?php endforeach;?>
					</select>
				</div>
			</div>
		</div>