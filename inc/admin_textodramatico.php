<?php
//Metaboxes y funciones para texto dramatico


add_action( 'cmb2_init', 'prompt_textodramatico_metabox' );

function prompt_textodramatico_metabox() {

	$prefix = '_texto_dramatico_';

	$cmb_group = new_cmb2_box( array(
		'id'           => 'prompt_textodramaticometabox',
		'title'        => __( 'Repeating Field Group', 'cmb2' ),
		'object_types' => array( 'texto_obra', ),
		'show_in_rest' => WP_REST_Server::ALLMETHODS,
	) );

	$obra    	= get_the_terms( $_GET['post'], 'obra' );
	$obraid 	= $obra[0]->term_id;

	$group_field_id = $cmb_group->add_field(array(
		'id'		  => 'prompt_textodramatico_data',
		'type'		  => 'group',
		'before_group'	=> prompt_displayplaytable($obraid),
		'options'	  => array(
			'group_title'	=> 'Unidad {#}',
			'add_button'	=> 'Nueva unidad',
			'remove_button'	=> 'Eliminar unidad',
			'sortable'		=> false
		)
	));

	$cmb_group->add_group_field($group_field_id, array(
		'name' => __( 'id', 'prompt' ),
		'id' => 'id',
		'type' => 'text_small',
	) );

	$cmb_group->add_group_field($group_field_id, array(
		'name' => __( 'Unidad de acción ', 'prompt' ),
		'id' => 'unidad',
		'type' => 'text_small',
	) );

	$cmb_group->add_group_field($group_field_id, array(
		'name' => __( 'IDs materiales asociados', 'prompt' ),
		'id' => 'ids_asoc',
		'type' => 'text_small',
	) );

	$cmb_group->add_group_field($group_field_id, array(
		'name' => __( 'Escena o parte a la que pertenece', 'prompt' ),
		'id' => 'escena',
		'type' => 'text_small',
	) );

	$cmb_group->add_group_field($group_field_id, array(
		'name' => __( 'Parlamento / qué personaje habla ', 'prompt' ),
		'id' => 'parlamento',
		'type' => 'text_small',
	) );

	$cmb_group->add_group_field($group_field_id, array(
		'name' => __( 'Texto', 'prompt' ),
		'id' => 'texto',
		'type' => 'textarea',
	) );

	$cmb_group->add_group_field($group_field_id, array(
		'name'	=> __('Tipo de unidad de acción', 'prompt'),
		'id' => 'tipo',
		'type' => 'text_small',
	) );

	$cmb_group->add_group_field($group_field_id, array(
		'name' => __( 'Personajes que están en escena', 'prompt' ),
		'id' => 'personajes',
		'type' => 'text',
	) );

}


add_filter( 'cmb2_override_prompt_textodramatico_data_meta_value', 'prompt_textodramatico_data_override_meta_value', 10, 4 );


function prompt_displayplaytable($playid) {
	
	$output = '';
	
	if($playid && function_exists('bit_get_play_array')) {
				
	$texto = bit_get_play_array($playid);		
			
	$output = 
	'<table class="wp-list-table widefat fixed striped table-view-list media">
		<thead>
			<tr>
				<th>Ids asociados</th>
				<th>Escena</th>
				<th>Parlamento</th>
				<th>Tipo</th>
				<th>Texto</th>
				<th>Personajes</th>
			</tr>

		</thead>
		';
	
	foreach($texto as $textline) {
		$output .= '<tr><td>' . $textline['ids_asoc']. ' </td><td>' . $textline['escena']. ' </td><td>' . $textline['parlamento']. ' </td><td>' . $textline['tipo']. ' </td><td>' . $textline['texto']. ' </td><td>' . $textline['personajes']. ' </td></tr>';
	}

	$output .= '</table>';

	};

	return $output;
}

function prompt_textodramatico_data_override_meta_value( $data, $object_id, $args, $field ) {

	
	return get_option('prompt_textodramatico_data', array());
}

add_filter( 'cmb2_override_prompt_textodramatico_data_meta_save', 'prompt_textodramatico_data_override_meta_save', 10, 4 );
function prompt_textodramatico_data_override_meta_save( $override, $args, $field_args, $field ) {

	// Here, we're storing the data to the options table, but you can store to any data source here.
	// If to a custom table, you can use the $args['id'] as the reference id.
	
	$updated = update_option( 'prompt_textodramatico_data', $args['value'] );
	return !! $updated;
}

add_filter( 'cmb2_override_prompt_textodramatico_data_meta_remove', 'prompt_textodramatico_data_override_meta_remove', 10, 4 );
function yourprefix_group_alt_data_demo_override_meta_remove( $override, $args, $field_args, $field ) {

	// Here, we're removing from the options table, but you can query to remove from any data source here.
	// If from a custom table, you can use the $args['id'] to query against.
	// (If we do "delete_option", then our default value will be re-applied, which isn't desired.)
	$updated = update_option( 'prompt_textodramatico_data', array() );
	return !! $updated;
}

add_action( 'cmb2_init', 'prompt_add_metabox_csv' );
function prompt_add_metabox_csv() {

	$prefix = '_prompt_';

	$cmb = new_cmb2_box( array(
		'id'           => $prefix . 'promptcsv',
		'title'        => __( 'Archivo CSV con tabla del texto dramático', 'prompt' ),
		'object_types' => array( 'texto_obra' ),
		'context'      => 'normal',
		'priority'     => 'default',
	) );

	$cmb->add_field( array(
		'name' => __( 'Archivo CSV', 'prompt' ),
		'id' => $prefix . 'playcsv',
		'type' => 'file',
		'after_row' => '<p class="alignright"><div class="infoarea"></div><button data-action="prompt_process_csv" class="button button-primary button-large">Procesar archivo CSV</button></p>',
		'desc' => __( 'Archivo CSV generado desde Google Drive con las siguientes columnas: id', 'unidad', 'ids_asoc', 'escena', 'parlamento', 'texto', 'tipo', 'personajes', 'prompt' ),
	) );

	$cmb->add_field( array(
		'name' => __( 'Confirmar reemplazo de tabla de texto', 'prompt' ),
		'id' => $prefix . 'confirm_overwrite',
		'type' => 'checkbox',
	) );

}

function prompt_process_csv() {
	//Open file

	//Process file

	//Put file in DB
}

// add_filter( 'cmb2_override__prompt_playcsv_meta_save', 'prompt_textodramatico_playcsv_meta_save', 10, 4 );
// function prompt_textodramatico_playcsv_meta_save( $override, $args, $field_args, $field ) {

// 	// Here, we're storing the data to the options table, but you can store to any data source here.
// 	// If to a custom table, you can use the $args['id'] as the reference id.
	
// 	$updated = update_option( 'prompt_textodramatico_data', $args['value'] );
// 	var_dump($field->data_to_save['_prompt_playcsv']);
// 	return !! $updated;
// }