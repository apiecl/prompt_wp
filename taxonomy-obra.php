<?php
	get_header();

	$term = get_term_by( 'slug', get_query_var( 'term' ), 'obra' );
	$fields = prompt_obra_metadata( $term->term_id );
	//var_dump($fields);
?>

	<div class="single-obra container">
		<div class="row">
			<div class="col-md-12">
				<h1><?php single_term_title();?></h1>

				<div class="intro-obra">
					
				</div>

				<div class="ficha-obra">
					
				</div>

			</div>
		</div>
	</div>


<?php
	get_footer();
?>