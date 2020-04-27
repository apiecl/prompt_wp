<?php
/**
 * Functions which enhance the theme by hooking into WordPress
 *
 * @package promptbook
 */

/**
 * Adds custom classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 * @return array
 */
function prompt_body_classes( $classes ) {
	// Adds a class of hfeed to non-singular pages.
	if ( ! is_singular() ) {
		$classes[] = 'hfeed';
	}

	// Adds a class of no-sidebar when there is no sidebar present.
	if ( ! is_active_sidebar( 'sidebar-1' ) ) {
		$classes[] = 'no-sidebar';
	}

	return $classes;
}
add_filter( 'body_class', 'prompt_body_classes' );

/**
 * Add a pingback url auto-discovery header for single posts, pages, or attachments.
 */
function prompt_pingback_header() {
	if ( is_singular() && pings_open() ) {
		printf( '<link rel="pingback" href="%s">', esc_url( get_bloginfo( 'pingback_url' ) ) );
	}
}
add_action( 'wp_head', 'prompt_pingback_header' );

function prompt_format_date($datestring, $format = '%e %B de %Y') {
	setlocale(LC_TIME, 'es_ES');
	$newdate = strftime($format,  strtotime($datestring));

	return $newdate;
}

function prompt_cycle_fields( $fields, $title ) {
	$cycled_fields = array();

	foreach($fields as $field) {
		$cycled_fields[] = '<div class="prompt_cycle_fields">' . $field[0] . '</div>';
	}

	return implode('', $cycled_fields);
}

/**
 * Obra metadata
 */
function prompt_obra_metadata( $obraid ) {
	$prefix = '_prompt_';
	$field_data = [];
	$fields = [
				'imagen',
				'video',
				'estreno',
				'temporada_inicio',
				'temporada_fin',
				'funciones',
				'duracion',
				'sala',
				'review',
				'direccion',
				'dramaturgia',
				'escenografia_iluminacion',
				'vestuario',
				'elenco',
				'musicos',
				'asistente',
				'direccion_musical',
				'direccion_coreografica'
			];

	foreach($fields as $field) {
		if(get_term_meta($obraid, $prefix . $field)):
			$field_data[$field] = get_term_meta($obraid, $prefix . $field);
		endif;
	}

	return $field_data;
}

function prompt_multifields( $fields, $separator, $wrapper = false ) {
	$fieldstring = '';
	if($fields && is_array($fields) ):
		$size = count($fields);
			foreach($fields as $key=>$field):
				if($wrapper) {
					$field = '<span class="field">' . $field . '</span>';
				}

				if($key == $size - 1):
					$fieldstring .= $field;
				else:
					$fieldstring .= $field . $separator;
				endif;
			endforeach;
	endif;
	return $fieldstring;
}

function prompt_obraslugjs($slug) {
	return str_replace('-', '_', $slug);
}

function prompt_rewrite_tag() {
	add_rewrite_tag( '%tab%', '([^&]+)');
}

add_action( 'init', 'prompt_rewrite_tag', 10, 0 );

function prompt_cpt_generating_rule($wp_rewrite) {
    $rules = array();
    $terms = get_terms( array(
        'taxonomy' => 'obra',
        'hide_empty' => false,
    ) );
   
    $post_type = 'resources_post_type';

    foreach ($terms as $term) {    
                
        $rules['obra/' . $term->slug . '/([^/]*)$'] = 'index.php?obra=' . $term->slug . '&tab=$matches[1]';
        
    }

    // merge with global rules
    $wp_rewrite->rules = $rules + $wp_rewrite->rules;
}
add_filter('generate_rewrite_rules', 'prompt_cpt_generating_rule');

function prompt_override_audio( $html, $attr, $content, $instance) {
		
	$output = '<div class="prompt-audio-player" id="audio-' . $instance.'">';

	$output .= '<canvas width="100%" height="200" id="audio-vis-canvas"></canvas>';
	$output .= '<audio class="audio-vis-element" src="' .$attr['src']. '" controls> Tu navegador no permite audio. </audio>';
	$output .= '</div>';


	return $output;
}

add_filter( 'wp_audio_shortcode_override', 'prompt_override_audio', 10, 4 );