<?php 
$term = get_term_by( 'slug', get_query_var( 'term' ), 'obra' );
$playtext = bit_get_media($term->term_id);
foreach( $playtext as $playline ) {
	$media = $playline->ids_asoc;
	//echo $media;
	echo '<div class="text-item" data-assoc="' . $media . '">' . $playline->mediaid . ':' . $playline->tipo_material . '</div>';
}
?>