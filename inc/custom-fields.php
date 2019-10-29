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



}