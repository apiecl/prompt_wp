<?php
/**
* Template Name: Teatro UC
* 
**/
?>

<?php
get_header();
?>


		
		<div class="single-obra-container-fluid container-fluid">
			<div class="wrapper">
				<?php get_template_part( 'template-parts/nav-404' );?>

				<div class="single-obra container-fluid">
					<div class="row">
						<div class="col-md-4">
							<div class="tab-content" id="obraTabContent">
								
								<div class="tab-pane fade show active" id="el-teatro" role="tabpanel" arial-labelledby="info-tab">
									<div class="ficha-obra">
									<h1 style="margin-bottom: 36px;">Contenido no encontrado</h1>
									
									<p><a href="<?php bloginfo('url');?>">Volver al inicio</a></p>

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
get_footer();
?>