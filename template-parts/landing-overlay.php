<div id="landing-overlay">
	<div class="content-top">

		<div class="wrapper">
			<div class="row">
				<div class="col-md-6">
					<h1 class="site-title">
						<img src="<?php echo get_stylesheet_directory_uri();?>/img/logo_negro.svg" alt="<?php bloginfo( 'name' ); ?>">
					</h1>

					<span class="comenzar d-none d-md-block">Comenzar</span>
				</div>
				<div class="col-md-6">
					<div class="description">
						<?php 
							$options = get_option( 'prompt_options', false );
							echo $options['prompt_maintoptext'];
						?>
					</div>		
				</div>	
			</div>
			<div class="row d-block d-md-none">
				<div class="col-12">
					<span class="comenzar">Comenzar</span>
				</div>
			</div>
		</div>
	</div>

	<?php get_template_part('template-parts/site-footer');?>
</div>