<?php
get_header();

$term = get_term_by( 'slug', get_query_var( 'term' ), 'obra' );
$fields = prompt_obra_metadata( $term->term_id );
?>

<div class="single-obra container">
	<div class="row">
		<div class="col-md-12">
			<h1 class="play-title"><?php single_term_title();?></h1>
			<img src="<?php echo $fields['imagen'][0];?>" alt="<?php single_term_title();?>">
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<nav class="nav nav-pills nav-justified" id="obraTab" role="tablist">
				<a aria-selected="true" id="info-tab" data-toggle="tab" href="#info" class="nav-item nav-link active">Información</a>
				<a aria-selected="false" id="texto-tab" data-toggle="tab" href="#texto" class="nav-item nav-link">Texto</a>
				<!-- <a aria-selected="false" id="materiales-tab" data-toggle="tab" href="#materiales" class="nav-item nav-link">Materiales</a> -->
			</nav>
			
			<div class="tab-content" id="obraTabContent">
				<div class="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">
						
						<div class="ficha-obra">
						
						<?php get_template_part( 'template-parts/ficha-obra' );?>

						<div class="intro-obra">
							<h2>Reseña</h2>
							<?php echo $fields['review'][0];?>
						</div>
		
					

						<?php get_template_part( 'template-parts/timeline-obra' );?>
						
						</div>

				</div>
				<div class="tab-pane fade" id="texto" role="tabpanel" aria-labelledby="texto-tab">
					<div class="ficha-obra">
						<?php get_template_part( 'template-parts/texto-obra');?>
					</div>
				</div>

			</div>


		</div>
	</div>
</div>


<?php
get_footer();
?>