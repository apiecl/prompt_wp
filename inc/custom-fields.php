<?php

//add_action( 'cmb2_init', 'prompt_tax_add_metabox' );

add_filter('cmb2-taxonomy_meta_boxes', 'prompt_tax_add_metabox');

function prompt_tax_add_metabox( array $meta_boxes ) {

	$prefix = '_prompt_';

	$meta_boxes['fichaobra'] = array(
		'id'           => $prefix . 'fichaobra',
		'title'        => __( 'Ficha de la Obra', 'prompt' ),
		'object_types' => array( 'obra' ),
		'context'      => 'normal',
		'priority'     => 'default',
		'fields'	   => array(
			array(
				'name' => __( 'Imagen destacada', 'prompt' ),
				'id' => $prefix . 'imagen',
				'type' => 'file',
			),
			array(
				'name' => __( 'Fragmento de video de la obra (maximo 5 segs)', 'prompt' ),
				'id' => $prefix . 'video',
				'type' => 'file',
			),
			array(
				'name' => __( 'Estreno de la obra', 'prompt' ),
				'id' => $prefix . 'estreno',
				'type' => 'text_date',
			),
			array(
				'name' => __( 'Inicio de la temporada', 'prompt' ),
				'id' => $prefix . 'temporada_inicio',
				'type' => 'text_date',
			),
			array(
				'name' => __( 'Fin de la temporada', 'prompt' ),
				'id' => $prefix . 'temporada_fin',
				'type' => 'text_date',
			),
			array(
				'name' => __( 'Número de funciones', 'prompt' ),
				'id' => $prefix . 'funciones',
				'type' => 'text_small',
			),
			array(
				'name' => __( 'Número de temporadas', 'prompt' ),
				'id' => $prefix . 'temporadas',
				'type' => 'text_small',
			),
			array(
				'name' => __( 'Número total de funciones', 'prompt' ),
				'id' => $prefix . 'totalfunciones',
				'type' => 'text_small',
			),
			array(
				'name' => __( 'Duración estimada (en minutos)', 'prompt' ),
				'id' => $prefix . 'duracion',
				'type' => 'text_small',
			),
			array(
				'name' => __( 'Sala de presentación', 'prompt' ),
				'id' => $prefix . 'sala',
				'type' => 'text',
			),
			array(
				'name' => __( 'Reseña oficial', 'prompt' ),
				'id' => $prefix . 'review',
				'type' => 'wysiwyg',
			),
			array(
				'name' => __( 'Dirección', 'prompt' ),
				'id' => $prefix . 'direccion',
				'type' => 'text',
				'repeatable' => true,
			),
			array(
				'name' => __( 'Dramaturgia', 'prompt' ),
				'id' => $prefix . 'dramaturgia',
				'type' => 'text',
				'repeatable' => true,
			),
			array(
				'name' => __( 'Escenografía e Iluminación', 'prompt' ),
				'id' => $prefix . 'escenografia_iluminacion',
				'type' => 'text',
				'repeatable' => true,
			),
			array(
				'name' => __( 'Vestuario', 'prompt' ),
				'id' => $prefix . 'vestuario',
				'type' => 'text',
				'repeatable' => true,
			),
			array(
				'name' => __( 'Elenco', 'prompt' ),
				'id' => $prefix . 'elenco',
				'type' => 'text',
				'repeatable' => true,
			),
			array(
				'name' => __( 'Músicos', 'prompt' ),
				'id' => $prefix . 'musicos',
				'type' => 'text',
				'repeatable' => true,
			), 
			array(
				'name' => __( 'Asistente de dirección', 'prompt' ),
				'id' => $prefix . 'asistente',
				'type' => 'text',
				'repeatable' => true,
			),
			array(
				'name' => __( 'Dirección musical', 'prompt' ),
				'id' => $prefix . 'direccion_musical',
				'type' => 'text',
				'repeatable' => true,
			),
			array(
				'name' => __( 'Dirección coreográfica', 'prompt' ),
				'id' => $prefix . 'direccion_coreografica',
				'type' => 'text',
				'repeatable' => true,
			) 
		)
	);

	return $meta_boxes;

}

add_action( 'cmb2_init', 'cmb2_add_metabox_hitos' );

function cmb2_add_metabox_hitos() {

	$prefix = '_prompt_';

	$cmb = new_cmb2_box( array(
		'id'           => $prefix . 'hitos',
		'title'        => __( 'Información hito', 'promptbook' ),
		'object_types' => array( 'hitos' ),
		'context'      => 'normal',
		'priority'     => 'high',
	) );

	$cmb->add_field( array(
		'name' => __( 'Fecha Inicio', 'promptbook' ),
		'id' => $prefix . 'inicio',
		'type' => 'text_date',
		'attributes' => array(
						'data-datepicker' => json_encode(array(
												'yearRange' => '-100:+0'
											))
						)
	) );

	$cmb->add_field( array(
		'name' => __( 'Fecha Fin', 'promptbook' ),
		'id' => $prefix . 'fin',
		'type' => 'text_date',
		'attributes' => array(
						'data-datepicker' => json_encode(array(
												'yearRange' => '-100:+0'
											))
						),
		'desc' => __( 'opcional si es que se pone una fecha de fin el evento queda marcado como un período', 'promptbook' ),
	) );

	$cmb->add_field( array(
		'name' => __( 'Mostrar', 'cmb2' ),
		'id' => $prefix . 'datetype',
		'type' => 'radio',
		'options' => array(
			'full' => __( 'fecha completa', 'cmb2' ),
			'year' => __( 'solo año', 'cmb2' ),
		),
	) );

	$cmb->add_field( array(
		'name' => __('Enlace', 'promptbook'),
		'id' => $prefix . 'enlace',
		'type' => 'text_url',
		'desc' => __( 'opcional enlace externo a información sobre el evento', 'promptbook' ),
	) );

	$cmb->add_field( array(
		'name'		=> 'Principal',
		'id'		=> $prefix . 'esprincipal',
		'type'		=> 'checkbox',
		'desc'		=> 'Marcar si quieres que este evento esté en la línea de tiempo del Teatro'
	));



}

function prompt_media_fields( ) {
	
	$prefix ='_bit_';

	$cmb = new_cmb2_box( array(
		'id'           => $prefix . 'infomedia',
		'title'        => __( 'Información extra media', 'promptbook' ),
		'object_types' => array( 'attachment' ),
		'context'      => 'normal',
		'priority'     => 'high',
	) );

	$cmb->add_field( array(
		'name'		=> 'ID',
		'id'		=> $prefix . 'mediaid',
		'type'		=> 'text',
		'desc'		=> 'Id para relacionarlo con el texto dramático'
	));

	$cmb->add_field( array(
		'name'		=> 'Categoria',
		'id'		=> $prefix . 'categoria',
		'type'		=> 'text',
		'desc'		=> 'Id para relacionarlo con el texto dramático'
	));

	$cmb->add_field( array(
		'name'		=> 'Descripción sintética',
		'id'		=> $prefix . 'descripcion_sintetica',
		'type'		=> 'text',
		'desc'		=> 'Id para relacionarlo con el texto dramático'
	));


	$cmb->add_field( array(
		'name'		=> 'Descripción detallada',
		'id'		=> $prefix . 'descripcion_detallada',
		'type'		=> 'textarea',
		'desc'		=> 'Id para relacionarlo con el texto dramático'
	));


	$cmb->add_field( array(
		'name'		=> 'Fuente',
		'id'		=> $prefix . 'fuente',
		'type'		=> 'text',
		'desc'		=> 'Id para relacionarlo con el texto dramático'
	));

	$cmb->add_field( array(
		'name'		=> 'Tipo de material',
		'id'		=> $prefix . 'tipomaterial',
		'type'		=> 'text',
		'desc'		=> 'Id para relacionarlo con el texto dramático'
	));


	$cmb->add_field( array(
		'name'		=> 'Ingreso',
		'id'		=> $prefix . 'ingreso',
		'type'		=> 'text',
		'desc'		=> 'Id para relacionarlo con el texto dramático'
	));

	$cmb->add_field( array(
		'name'		=> 'Procesamiento',
		'id'		=> $prefix . 'procesamiento',
		'type'		=> 'text',
		'desc'		=> 'Id para relacionarlo con el texto dramático'
	));

	$cmb->add_field( array(
		'name'		=> 'Obra asociada',
		'id'		=> $prefix . 'play_asoc',
		'type'		=> 'text',
		'desc'		=> 'ID de obra asociada'
	));

	$cmb->add_field( array(
		'name'		=> 'Obra asociada',
		'id'		=> $prefix . 'fechatext',
		'type'		=> 'text',
		'desc'		=> 'Fecha'
	));
}

add_filter('cmb2_init', 'prompt_media_fields');

function prompt_roles_fields( array $meta_boxes ) {
	$prefix = '_prompt_';

	$meta_boxes['tareasbox'] = array(
		'id'           => $prefix . '_roles_fields',
		'title'        => __( 'Información extra rol', 'itrend' ),
		'object_types' => array( 'rol' ),
		'context'      => 'normal',
		'priority'     => 'default',
		'fields'	   => array(
			array(
				'name'	=> __('Dimensión', 'prompt'),
				'type'	=> 'taxonomy_select',
				'id'	=> $prefix . 'dimension',
				'taxonomy'	=> 'dimensiones'
			),
			array(
				'name'	=> __('Interno - Externo', 'prompt'),
				'type'	=> 'select',
				'id'	=> $prefix . 'internoexterno',
				'show_option_none' => true,
				'options'	=> array(
								'interno' => 'Interno',
								'externo' => 'Externo'
								)
			)
		)
	);

	return $meta_boxes;
}

add_filter('cmb2-taxonomy_meta_boxes', 'prompt_roles_fields');


add_action( 'cmb2_init', 'prompt_teatrouc_add_metabox' );

function prompt_teatrouc_add_metabox() {

	$prefix = '_prompt_';

	$cmb = new_cmb2_box( array(
		'id'           => $prefix . 'teatrouc',
		'title'        => __( 'Datos', 'prompt' ),
		'object_types' => array( 'page' ),
		'show_on'	   => array('key' => 'page_template', 'value' => 'page-template-teatro.php'),
		'context'      => 'normal',
		'priority'     => 'high',
	) );

	$cmb->add_field( array(
		'name' => __( 'Fundación', 'prompt' ),
		'id' => $prefix . 'fundacion',
		'type' => 'text',
	) );

	$cmb->add_field( array(
		'name' => __( 'Primera obra', 'prompt' ),
		'id' => $prefix . 'primera_obra',
		'type' => 'text',
	) );

	$cmb->add_field( array(
		'name' => __( 'Primer director', 'prompt' ),
		'id' => $prefix . 'primer_director',
		'type' => 'text',
	) );

	$cmb->add_field( array(
		'name' => __( 'Locaciones del Teatro', 'prompt' ),
		'id' => $prefix . 'locaciones',
		'type' => 'text',
	) );

}

/**
 * This snippet has been updated to reflect the official supporting of options pages by CMB2
 * in version 2.2.5.
 *
 * If you are using the old version of the options-page registration,
 * it is recommended you swtich to this method.
 */
add_action( 'cmb2_admin_init', 'prompt_register_theme_options_metabox' );
/**
 * Hook in and register a metabox to handle a theme options page and adds a menu item.
 */
function prompt_register_theme_options_metabox() {

	/**
	 * Registers options page menu item and form.
	 */
	$cmb_options = new_cmb2_box( array(
		'id'           => 'prompt_option_metabox',
		'title'        => esc_html__( 'Opciones del sitio', 'prompt' ),
		'object_types' => array( 'options-page' ),

		/*
		 * The following parameters are specific to the options-page box
		 * Several of these parameters are passed along to add_menu_page()/add_submenu_page().
		 */

		'option_key'      => 'prompt_options', // The option key and admin menu page slug.
		// 'icon_url'        => 'dashicons-palmtree', // Menu icon. Only applicable if 'parent_slug' is left empty.
		// 'menu_title'      => esc_html__( 'Options', 'prompt' ), // Falls back to 'title' (above).
		// 'parent_slug'     => 'edit.php?post_type=actor', // Make options page a submenu item of the themes menu.
		// 'capability'      => 'manage_options', // Cap required to view options-page.
		// 'position'        => 1, // Menu position. Only applicable if 'parent_slug' is left empty.
		// 'admin_menu_hook' => 'network_admin_menu', // 'network_admin_menu' to add network-level options page.
		// 'display_cb'      => false, // Override the options-page form output (CMB2_Hookup::options_page_output()).
		// 'save_button'     => esc_html__( 'Save Theme Options', 'prompt' ), // The text for the options-page save button. Defaults to 'Save'.
	) );

	/*
	 * Options fields ids only need
	 * to be unique within this box.
	 * Prefix is not needed.
	 */

	$cmb_options->add_field( array(
		'name' => __( 'Texto de presentación general (que sale al principio de la página)', 'prompt' ),
		'desc' => __( 'Texto', 'prompt' ),
		'id'   => 'prompt_maintoptext',
		'type' => 'textarea',
	) );

	$cmb_options->add_field( array(
		'name' => __( 'Texto de cabecera para sección de obras', 'prompt' ),
		'desc' => __( 'Texto', 'prompt' ),
		'id'   => 'prompt_obrastoptext',
		'type' => 'textarea',
	) );


	$cmb_options->add_field( array(
		'name' => __( 'Texto de cabecera para sección del teatro', 'prompt' ),
		'desc' => __( 'Texto', 'prompt' ),
		'id'   => 'prompt_teatrotoptext',
		'type' => 'textarea',
	) );

	

}