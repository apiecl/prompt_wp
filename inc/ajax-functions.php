<?php 
// Custom ajax calls

function get_main_timeline_events() {
	$json = [];
	$json['events'] = [];
	$args = array(
		'post_type' 	=> 'hitos',
		'numberposts' 	=> -1,
	);
	$hitos = get_posts($args);

	if($hitos):
		foreach($hitos as $hito):

			$yearonly = get_post_meta($hito->ID, '_prompt_datetype', true ) == 'year' ? true : false;
			$start_date_field 	= get_post_meta( $hito->ID, '_prompt_inicio', true );
			$end_date_field 	= get_post_meta( $hito->ID, '_prompt_fin', true );
			$media_field		= get_the_post_thumbnail_url( $hito->ID, 'medium' );

			$start_date 		= parse_field_date_for_json( $start_date_field, $yearonly );
			
			if($end_date_field):
				$end_date 			= parse_field_date_for_json( $end_date_field, $yearonly );
			endif;

			$event = array(
				'text' => array(
							'headline' 	=> $hito->post_title,
							'text'		=> apply_filters( 'post_content', $hito->post_content )
							),
				'start_date' => $start_date
			);
			//Main fields
			

			//Optional fields

			if($end_date):
				$event['end_date'] = $end_date;
			endif;


			if($media_field):
				$event['media']['url'] = $media_field;
			endif;	

			array_push($json['events'], $event);			
			
		endforeach;
	endif;

	return json_encode($json);
}

function parse_field_date_for_json( $datestring, $yearonly = false ) {
	$date_processed = new DateTime($datestring);
	
	if($yearonly == true):
		$date_sorted 	= array(
							'year' 	=> $date_processed->format('Y'),
							);
	else:
		$date_sorted 	= array(
								'year' 	=> $date_processed->format('Y'),
								'month'	=> $date_processed->format('m'),
								'day'	=> $date_processed->format('d')
							);
	endif;

	return $date_sorted;
}