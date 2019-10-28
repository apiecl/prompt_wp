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

function prompt_multifields( $fields, $separator ) {
	$fieldstring = '';
	if($fields):
		$size = count($fields);
			foreach($fields as $key=>$field):
				if($key == $size - 1):
					$fieldstring .= $field;
				else:
					$fieldstring .= $field . $separator;
				endif;
			endforeach;
	endif;
	return $fieldstring;
}