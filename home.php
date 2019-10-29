<?php
get_header();
?>

	<div id="primary" class="content-area container">
		<main id="main" class="site-main">

		<?php 
			get_template_part( 'template-parts/obras' );
			get_template_part( 'template-parts/timeline' );
		?>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php
//get_sidebar();
get_footer();
