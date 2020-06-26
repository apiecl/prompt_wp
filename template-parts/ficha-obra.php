<?php 
$term = get_term_by( 'slug', get_query_var( 'term' ), 'obra' );
$fields = prompt_obra_metadata( $term->term_id );
$ficha_col_1 = get_term_meta( $term->term_id, '_prompt_ficha_col_1', false );
$ficha_col_2 = get_term_meta( $term->term_id, '_prompt_ficha_col_2', false );
$ficha_col_3 = get_term_meta( $term->term_id, '_prompt_ficha_col_3', false );
?>

<div class="row datos-obra">
	<dl class="col-md-3 col-12">

		<div class="mini-time">
			<?php echo apply_filters('the_content', $ficha_col_1[0]);?>
		</div>

	</dl>

	<dl class="col-md-2 col-12">
		<?php echo apply_filters('the_content', $ficha_col_2[0]);?>
	</dl>

	<dl class="col-md-4 col-12">
		<?php echo apply_filters('the_content', $ficha_col_3[0]);?>
	</dl>

	<dl class="intro-obra col-md-3 col-12">
		<header class="ficha-title">
			<h2>Reseña</h2>
		</header>
		<?php echo $fields['review'][0];?>
	</dl>

</div>

<div class="row datos-obra">
	
</div>