<?php
get_header();
	$options = get_option( 'prompt_options', false );
		$descobras = $options['prompt_obrastoptext'];
		$descteatro = $options['prompt_teatrotoptext'];
		?>
		<div id="primary" class="content-area">
			<main id="main" class="site-main home">

				<section id="obras-link" class="container-fluid" data-action="show" data-toggle="obra-item-presentation">
					<div class="obras-nav-wrapper">

						<?php get_template_part('template-parts/brand-header');?>

						<?php 
						$obras = get_terms( array(
							'taxonomy' => 'obra',
							'hide_empty' => false
						));

						if($obras) { ?>
							<div class="obra-container obra-item-presentation">
								<div class="obra-content">
									<div class="obra-content-wrap">

										<div class="obra-preheader">
											<h1>Obras</h1>
											<div class="section-desc">
												<?php echo $descobras;?>
											</div>
										</div>

										<div class="obras-slider">
											<div class="splide">
											<div class="splide__track">
											<div class="splide__list">
												<?php
												foreach($obras as $obra) {
													$fields = prompt_obra_metadata( $obra->term_id );
													$baseurl = get_term_link( $obra->term_id, 'obra' );
													$yearplay = prompt_format_date($fields['estreno'][0], '%Y');
													$image = wp_get_attachment_image_src($fields['imagen_id'][0], 'large');
													?>
																<div class="splide__slide">
																	<div class="o-item">
																		<div class="o-img" style="background-image: url(<?php echo $image[0];?>);">
																		</div>
																		<div class="o-content">
																			<h2 class="obra-title"><a href="<?php echo $baseurl;?>"><?php echo $obra->name;?> / <?php echo $yearplay;?></a></h2>

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
																					<a href="<?php echo $baseurl;?>galeria">Galería</a>
																				</li>
																			</ul>
																		</div>
																	</div>
																</div>
																<?php
						}//endforeach obras

						?>
				</div><!-- splide track -->
				</div><!-- splide list -->
				</div><!-- splide -->
				</div><!-- obras slider -->
			</div><!-- obras content wrap -->
		</div>
	</div>
	<?php
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
						<div class="obra-container teatro-item-presentation">
							<div class="obra-content">
								<div class="obra-content-wrap">
									<div class="obra-preheader">
										<h1>Teatro UC histórico</h1>
										<div class="section-desc">
											<?php echo $descteatro;?>
										</div>
									</div>

									<ul class="menu-teatro-home">
										<li><a href="<?php echo get_permalink($teatropage->ID);?>">Resumen histórico</a></li>
				<?php 
				foreach($childs as $child):?>

					<li><a href="<?php echo get_permalink($child->ID);?>"><?php echo $child->post_title;?></a></li>

		<?php endforeach;
		?>
	</ul>	
</div>


</div>
<div class="teatro-image" style="background-image: url(<?php echo $pageimgsrc[0];?>"></div>
</div>
</div>
</section>
</main><!-- #main -->
</div><!-- #primary -->
<?php
get_footer();
