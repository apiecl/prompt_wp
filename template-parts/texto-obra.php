<?php 
$term = get_term_by( 'slug', get_query_var( 'term' ), 'obra' );
$playtext = bit_get_play($term->term_id);
 ?>

<div class="texto-dramatico">
		<?php
		foreach( $playtext as $playline ) {
			$tipo = sanitize_title( $playline->tipo);
			$media = $playline->ids_asoc;
			$mediazoneid = uniqid();
			//echo $media;
			?>
			<div class="row">
				<div class="col-1">
					<?php if($media):?>
						<a href="#" class="btn btn-primary trigger-media" data-plain-id="<?php echo $mediazoneid;?>" data-expand="#<?php echo $mediazoneid;?>" data-assoc="<?php echo $media;?>" title="Ver el material asociado a esta sección del texto.">
							<i class="fas fa-images"></i>
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