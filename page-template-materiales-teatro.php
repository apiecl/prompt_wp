<?php
/**
* Template Name: Materiales Teatro UC
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

		
		<div class="single-obra-container-fluid container-fluid">
			<div class="wrapper">
				
				<?php get_template_part( 'template-parts/nav-page-teatro' );?>

				<div class="single-obra container-fluid">
					<div class="row">
						<div class="col-md-12">
							<div class="tab-content" id="obraTabContent">
								
								<div class="tab-pane fade show active" id="materiales" role="tabpanel" aria-labelledby="timeline-tab">
									<div class="ficha-obra">
										<?php get_template_part( 'template-parts/materiales-teatro' );?>
									</div>
								</div>

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