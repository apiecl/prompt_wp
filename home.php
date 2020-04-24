<?php
get_header();
?>
	<div id="primary" class="content-area">
		<main id="main" class="site-main home">
			
			<section id="obras-link" class="container-fluid" data-action="show" data-toggle="obra-item-presentation">
				<div class="obras-nav-wrapper">
				<div class="obra-container menu-obras collapse-menu-home" data-target=".obras-nav-wrapper">
					<div class="obra-content">
						<div class="left">
							<h1>Obras</h1>
							<div class="section-desc">
								Navega por los hitos de uno de los teatros universitarios con más trayectoria de Chile. 
							</div>
						</div>
					</div>
				</div>

				<?php 
					$obras = get_terms( array(
						'taxonomy' => 'obra',
						'hide_empty' => false
					));

					if($obras) {
						foreach($obras as $obra) {
							$fields = prompt_obra_metadata( $obra->term_id );
							$baseurl = get_term_link( $obra->term_id, 'obra' );
							$yearplay = prompt_format_date($fields['estreno'][0], '%Y');
							?>
								
								<div class="obra-container obra-item-presentation">
									<div class="obra-content">
										<div class="obra-content-wrap">
											<h3 class="header-obra-title">Obras</h3>
											<h1><a href="<?php echo $baseurl;?>"><?php echo $obra->name;?> / <?php echo $yearplay;?></a></h1>
											
											<ul>
												<li>
													<a href="<?php echo $baseurl;?>">Ficha artística</a>
												</li>
												<li>
													<a href="<?php echo $baseurl;?>linea-de-tiempo">Línea de tiempo</a>
												</li>
												<li>
													<a href="<?php echo $baseurl;?>texto-dramatico">Texto dramático</a>
												</li>
												<li>
													<a href="<?php echo $baseurl;?>materiales">Materiales</a>
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
				</div>
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

				$childs = get_children( array(
					'post_type' => 'page',
					'post_parent' => $teatropage->ID
				) );

			?>

			<section id="teatro-link" class="container-fluid">
				<div class="teatro-nav-wrapper">
					<div class="obra-container menu-obras menu-teatrouc collapse-menu-home" data-action="show" data-target=".teatro-nav-wrapper">
						<div class="obra-content">
							<div class="left">
								<h1>Teatro UC histórico</h1>
								<div class="section-desc">
									Conoce la trastienda de una obra de teatro. Este es un viaje por el proceso creativo y artístico de nuestros montajes. 
								</div>
							</div>
						</div>
					</div>

					<div class="obra-container teatro-item-presentation">
						<div class="obra-content">
							<div class="obra-content-wrap">
								<h1><a href="<?php echo get_permalink($teatropage->ID);?>"><?php echo $teatropage->post_title;?></a></h1>
								<ul>
										<li><a href="<?php echo get_permalink($teatropage->ID);?>">Resumen histórico</a></li>
									<?php 
										foreach($childs as $child):?>
										
											<li><a href="<?php echo get_permalink($child->ID);?>"><?php echo $child->post_title;?></a></li>

										<?php endforeach;
									?>
								</ul>	
							</div>
							
							
						</div>
						<div class="obra-image" style="background-image: url(<?php echo $pageimgsrc[0];?>"></div>
					</div>
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
