<?php 
$term = get_term_by( 'slug', get_query_var( 'term' ), 'obra' );
$playtext = bit_get_media($term->term_id);
foreach( $playtext as $playline ) {
	$media = $playline->ids_asoc;
	$item = bit_get_resource($playline->mediaid, $term->slug);

	//echo $media;
	echo '<div class="text-item" data-assoc="' . $media . '"><img src="' . $item . '" alt=""></div>';
}
?>