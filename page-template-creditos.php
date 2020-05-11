<?php
/**
* Template Name: Créditos
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
		the_post(); 
		?>

		
		<div class="single-obra-container-fluid container-fluid">
			<div class="wrapper">
				
				<div class="cabecera-obra">
					
					<?php get_template_part('template-parts/brand-header');?>

				</div>

				<div class="page-creditos container-fluid">
					<div class="row">
						<div class="col-md-12">
							<div class="tab-content" id="obraTabContent">
								
								<div class="tab-pane fade show active" id="el-teatro" role="tabpanel" arial-labelledby="info-tab">
									
									<div class="content">

										<div class="content-page">
											<h1 class="creditos-title"><?php the_title();?></h1>
											
											<?php the_content();?>

											<div class="row">
												<div class="col-md-3"><?php echo get_post_meta($post->ID, '_prompt_creditos_columna_1', true);?></div>
												<div class="col-md-3"><?php echo get_post_meta($post->ID, '_prompt_creditos_columna_2', true);?></div>
												<div class="col-md-3"><?php echo get_post_meta($post->ID, '_prompt_creditos_columna_3', true);?></div>
											</div>
										</div>

									</div>

								</div>

							</div>		
						</div>
					</div>
					
				</div>
			</div>
			<?php get_template_part('template-parts/site-footer');?>
		</div>


		<?php 
	endwhile;

endif;
?>



<?php
get_footer();
?>