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
				
				<?php //get_template_part( 'template-parts/nav-page-teatro' );?>

				<div class="page-creditos container-fluid">
					<div class="row">
						<div class="col-md-4">
							<div class="tab-content" id="obraTabContent">
								
								<div class="tab-pane fade show active" id="el-teatro" role="tabpanel" arial-labelledby="info-tab">
									
									<div class="content">

										<h1><?php the_title();?></h1>

										<div class="content-page">
											<?php the_content();?>
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

<?php get_template_part('template-parts/site-footer');?>

<?php
get_footer();
?>