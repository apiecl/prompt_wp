<?php
get_header();
?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main">
			
			<section id="obras-link" class="container-fluid">
				<?php 
					$obras = get_terms( array(
						'taxonomy' => 'obra',
						'hide_empty' => false
					));

					if($obras) {
						foreach($obras as $obra) {
							$fields = prompt_obra_metadata( $obra->term_id );
							?>
								
								<div class="obra-container">
									<div class="obra-content">
										<div class="left">
											<h1><?php echo $obra->name;?></h1>
											<span class="date"><?php echo $fields['estreno'][0];?></span>
										</div>
										<div class="right">
											<ul>
												<li>
													Ficha técnica
												</li>
												<li>
													Línea de tiempo
												</li>
												<li>
													Texto dramático
												</li>
												<li>
													Materiales
												</li>
											</ul>
										</div>
									</div>
									<div class="obra-image" style="background-image: url(<?php echo $fields['imagen'][0];?>);">
									</div>
									
								</div>
				
							<?php
						}
					}
				?>	
			</section>			
			
			<?php 

				$args = array(
					'post_type'=> 'page',
					'numberposts' => 1,
					'meta_key'	=> '_wp_page_template',
					'meta_value' => 'page-template-teatro.php'
				);
				$teatropage = get_posts($args);
				$teatropage = current($teatropage);
				$pageimg = get_post_thumbnail_id($teatropage->ID);
				$pageimgsrc = wp_get_attachment_image_src( $pageimg, 'large', false );
			?>

			<section id="teatro-link" class="container-fluid">
				<div class="obra-container">
					<div class="obra-content">
						<h1><a href="<?php echo get_permalink($teatropage->ID);?>"><?php echo $teatropage->post_title;?>
							<div class="lines">
							<span></span>
							<span></span>
							<span class="short"></span>
							</a>
						</div>

						</h1>

					</div>
					<div class="obra-image" style="background-image: url(<?php echo $pageimgsrc[0];?>"></div>
				</div>
			</section>
		<?php 
			//get_template_part( 'template-parts/obras' );
			//get_template_part( 'template-parts/timeline' );
		?>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php
//get_sidebar();
get_footer();
