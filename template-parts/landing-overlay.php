<div id="landing-overlay">
	<div class="content-top">

		<div class="wrapper">
			<h1 class="site-title">
					<img src="<?php echo get_stylesheet_directory_uri();?>/img/logo_negro.svg" alt="<?php bloginfo( 'name' ); ?>">
			</h1>

			<div class="description">
				<?php 
					$options = get_option( 'prompt_options', false );
					echo $options['prompt_maintoptext'];
				?>
			</div>

		</div>
	</div>

	<footer class="site-footer">
		<div class="site-info">
			<div class="row">
				<div class="col-8">
					<img src="<?php bloginfo('template_url');?>/img/logos_footer.svg" alt="">
				</div>
				<div class="col-4 footer-links-right">
					<a href="" class="creditos-link">Créditos</a>

					<div class="redes-links">
						<a href=""><i class="fab fa-facebook"></i></a>
						<a href=""><i class="fab fa-instagram"></i></a>
						<a href=""><i class="fab fa-twitter"></i></a>
					</div>
				</div>
			</div>			
		</div><!-- .site-info -->
	</footer>
</div>