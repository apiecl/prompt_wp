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