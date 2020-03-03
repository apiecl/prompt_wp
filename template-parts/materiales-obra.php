<?php 
$term = get_term_by( 'slug', get_query_var( 'term' ), 'obra' );
$playtext = bit_get_play($term->term_id);
?>

<h2 class="standard-title">
	Materiales por tipo

	<?php 
		$fotos = bit_get_mediatype($term->term_id, 'fotografia');
	?>
	
	<h3 class="standard-title">Fotografías</h3>

	<div class="bit-gallery">
		<?php foreach($fotos as $foto):?>
			
			<div class="image-wrap">
				<?php echo bit_get_image($foto);?>
			</div>
		<?php endforeach;?>
	</div>
</h2>