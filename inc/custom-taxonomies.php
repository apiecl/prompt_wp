<?php

function cptui_register_my_taxes() {

	/**
	 * Taxonomy: Obras.
	 */

	$labels = array(
		"name" => __( "Obras", "twentynineteen" ),
		"singular_name" => __( "obra", "twentynineteen" ),
		"menu_name" => __( "Obras", "twentynineteen" ),
	);

	$args = array(
		"label" => __( "Obras", "twentynineteen" ),
		"labels" => $labels,
		"public" => true,
		"publicly_queryable" => true,
		"hierarchical" => false,
		"show_ui" => true,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"query_var" => true,
		"rewrite" => array( 'slug' => 'obra', 'with_front' => true, ),
		"show_admin_column" => false,
		"show_in_rest" => true,
		"rest_base" => "obra",
		"rest_controller_class" => "WP_REST_Terms_Controller",
		"show_in_quick_edit" => false,
		);
	register_taxonomy( "obra", array( "work_in_progress", "situaciones", "texto_obra", "objetos", "personas", "hitos" ), $args );
}
add_action( 'init', 'cptui_register_my_taxes' );
