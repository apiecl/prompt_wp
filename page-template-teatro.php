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
		the_post(); 
		?>

		
		<div class="single-obra-container-fluid container-fluid">
			<div class="wrapper">
				<?php get_template_part( 'template-parts/nav-page-teatro' );?>

				<div class="single-obra container">
					<div class="row">
						<div class="col-md-4">
							<div class="tab-content" id="obraTabContent">
								
								<div class="tab-pane fade show active" id="el-teatro" role="tabpanel" arial-labelledby="info-tab">
									<div class="ficha-obra">
										<div class="info-ficha-teatro">
											<?php 
											$fundacion = get_post_meta($post->ID, '_prompt_fundacion', true);
											$primera_obra = get_post_meta($post->ID, '_prompt_primera_obra', true);
											$primer_director = get_post_meta($post->ID, '_prompt_primer_director', true);
											$locaciones = get_post_meta($post->ID, '_prompt_locaciones', true);
											?>

											<dl class="ficha-teatro">
												<dt class="important">Fundación:</dt>
												<dd class="important"><?php echo $fundacion;?></dd>

												<dt>Primera obra:</dt>
												<dd><?php echo $primera_obra;?></dd>

												<dt>Primer director:</dt>
												<dd><?php echo $primer_director;?></dd>

												<dt>Locaciones del teatro:</dt>
												<dd><?php echo $locaciones;?></dd>
											</dl>

										</div>
										
										
									</div>

								</div>

							</div>		
						</div>
						<div class="col-md-8">
							<p></p>
							<p></p>
							<div class="intro-teatro">
								<?php the_content();?>
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