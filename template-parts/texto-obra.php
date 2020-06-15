<?php 
$term = get_term_by( 'slug', get_query_var( 'term' ), 'obra' );
$playtext = bit_get_play($term->term_id);
$fields = prompt_obra_metadata( $term->term_id );
$escenas = get_term_meta( $term->term_id, '_prompt_escenas', true );
?>




<div class="texto-dramatico">
	<div class="row fullrow">
		<div class="col-md-4 col-4">
			<div class="left-texto">
			<h4 class="minisection-title">Personajes</h4>
			<div class="personajes">
				<?php 
					$personajes = get_term_meta( $term->term_id, '_prompt_personajes', true);
					//var_dump($personajes);
					foreach($personajes as $personaje) {
						echo '<div class="personaje" data-personaje="' . $personaje['_prompt_nombrepersonaje'] . '">' . $personaje['_prompt_nombrepersonaje']. '</div>';
					}
				?>
			</div>
			<div id="texto-mini" class="texto-mini dragscroll transparent" data-sync="texto-full" name="textodramatico">
			<?php 
				foreach($playtext as $playlinesmall) {
					
					$subplaylines = explode("\n", $playlinesmall->texto);

					if($playlinesmall->escena != $escena):
						$escena = $playlinesmall->escena;
						//$escenas[] = $escena;
						echo '<span class="scene-marker" data-escena="' . $escena . '"></span>';
					endif;

					echo '<div class="textunit" ' . bit_dataline($playlinesmall) .'>';

					foreach($subplaylines as $subline) {
						$linewidth = strlen($subline) * 1.2;
						echo '<span data-size="' . $linewidth . '" style="width: ' . $linewidth . 'px;" class="line"></span>';
					}

					echo '</div>';
				}
			?>
			</div>
			</div>
		</div>
		<div class="col-md-8 col-8">
			<div class="text-zone">
			<div class="header-controls-right header-texto-dramatico">
				<h2><?php echo $term->name;?> / <?php echo prompt_format_date($fields['estreno'][0]);?></h2>
				<p>Historia y texto de <?php echo prompt_multifields($fields['dramaturgia'][0], ', ');?></p>
				
				<div class="escena-container">
				<div class="escena-rotation">
					<div class="escena-nav active">
						<select name="selectScene" id="selectScene" class="escena-nav-select">
						<?php foreach($escenas as $escena):?>
							<option value="#<?php echo sanitize_title( $escena);?>"><?php echo $escena;?></a>
						<?php endforeach;?>
						</select>
					</div>
				</div>

			</div>
			
		</div>
		<div class="texto-full transparent" name="textodramatico" id="texto-full" data-sync="texto-mini">
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
					echo '<div class="scene-row scene-marker" id="' . sanitize_title( $escena ) . '"><h3>' . $escena . '</h3></div>';

				endif;
				?>
						<?php if($media):?>
									<a href="#" class="trigger-media" data-plain-id="<?php echo $mediazoneid;?>" data-expand="#<?php echo $mediazoneid;?>" data-assoc="<?php echo $media;?>" title="Ver el material asociado a esta sección del texto.">
						<?php endif;?>
				<div class="playtext-row row" data-type="<?php echo $tipo;?>" data-hasmedia="<?php echo ($media != null ? 'true' : 'false');?>" data-escenaslug="<?php echo sanitize_title($playline->escena);?>" <?php echo bit_dataline($playline);?> >
					
								<div class="parlamento col-md-2">
									<?php echo($playline->parlamento ? '<span class="acot">' . $playline->parlamento . ': </span>': '');?>
								</div>					

								<div class="text-item  col-md-10 <?php echo ($tipo != null ? 'tipo-' . $tipo : '');?> <?php echo ($media != null ? ' hasmedia' : '');?> " <?php echo bit_dataline($playline);?> > <?php echo apply_filters('the_content', $playline->texto);?>
								
								</div>
						
								<?php if($media):?>
									<span class="mediashow"><i class="fas fa-plus"></i> <!-- <span class="badge badge-light"><?php echo $mediacount;?></span> --></span>
								<?php endif;?>

				</div>
				<?php if($media):?>
							</a>
						<?php endif;?>
				<div class="row media-zone" id="<?php echo $mediazoneid;?>">
					<!-- ajax loaded content-->
					<?php get_template_part('template-parts/loading');?>
				</div>	



				<?php
			}
			?>
		</div>
		</div>
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

