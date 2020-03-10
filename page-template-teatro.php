<?php
/**
* Template Name: Teatro UC
* 
**/
?>

<?php
get_header();
?>
<?php
if ( have_posts() ) :

	/* Start the Loop */
	while ( have_posts() ) :
		the_post(); ?>


		<div class="single-obra container">
			<div class="row">
				<div class="col-md-12">
					<h1 class="play-title"><?php the_title();?></h1>
					<?php if(has_post_thumbnail()):
								the_post_thumbnail('full');
						endif;?>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12">
					<nav class="nav nav-pills nav-justified" id="obraTab" role="tablist">
						<a aria-selected="true" id="info-tab" data-toggle="tab" href="#info" class="nav-item nav-link active">Ficha</a>
						<a aria-selected="false" id="timeline-tab" data-toggle="tab" href="#timeline" data-function="timeline" class="nav-item nav-link">Línea de Tiempo</a>
						<a aria-selected="false" id="materiales-tab" data-toggle="tab" href="#materiales" data-function="materiales" class="nav-item nav-link">Materiales</a>
					</nav>

					<div class="tab-content" id="obraTabContent">
						<div class="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">

							<div class="ficha-obra">

							<?php the_content();?>

							</div>

						</div>

						<div class="tab-pane fade" id="timeline" role="tabpanel" aria-labelledby="timeline-tab">
							<div class="ficha-obra">
								<?php get_template_part( 'template-parts/timeline' );?>
							</div>
						</div>

						<div class="tab-pane fade" id="materiales" role="tabpanel" aria-labelledby="materiales-tab">
							<div class="ficha-obra">
								<?php get_template_part( 'template-parts/materiales-teatro' );?>
							</div>
						</div>

					</div>


				</div>
			</div>
		</div>



		<?php 
	endwhile;

endif;
?>



<?php
get_footer();
?>