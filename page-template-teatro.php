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

		
		<div class="single-obra-container-fluid container-fluid">
			<div class="wrapper">
				<a href="#" class="toggleTabs"><i class="fas fa-bars"></i></a>

				<nav class="nav nav-pills nav-justified" id="obraTab" role="tablist">
					<a aria-selected="true" id="elteatro-tab" data-toggle="tab" href="#el-teatro" class="nav-item nav-link active">El teatro</a>
					<a aria-selected="false" id="timeline-tab" data-toggle="tab" href="#timeline" data-function="timeline" class="nav-item nav-link">Línea de Tiempo</a>
					<a aria-selected="false" id="materiales-tab" data-toggle="tab" href="#materiales" data-function="materialesTeatro" class="nav-item nav-link" data-contentTarget="#materialesTabsContent" data-page-id="<?php echo $post->ID;?>">Materiales</a>
				</nav>

				<div class="imagen-obra">
					<?php 
					$imageid = get_post_thumbnail_id($post->ID);
					$imagesrc = wp_get_attachment_image_src( $imageid, 'full', false );
					?>
					<h1 class="play-title"><?php the_title();?></h1>
					<div class="imagen" style="background-image: url(<?php echo $imagesrc[0];?>)"></div>
				</div>

				<div class="single-obra container">
					<div class="row">
						<div class="col-md-12">
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
										
										<div class="intro-teatro">
											<?php the_content();?>
										</div>
									</div>

								</div>

								<div class="tab-pane fade" id="timeline" role="tabpanel" aria-labelledby="timeline-tab">
									<div class="ficha-obra">
										<?php get_template_part( 'template-parts/timeline' );?>
									</div>
								</div>

								<div class="tab-pane fade" id="materiales" role="tabpanel" aria-labelledby="timeline-tab">
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