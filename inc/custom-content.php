<?php

function cptui_register_my_cpts() {

	/**
	 * Post Type: WIPs (Work in Progress).
	 */

	$labels = array(
		"name" => __( "WIPs (Work in Progress)", "twentynineteen" ),
		"singular_name" => __( "WIP", "twentynineteen" ),
		"menu_name" => __( "WIPs ( Work in Progress)", "twentynineteen" ),
	);

	$args = array(
		"label" => __( "WIPs (Work in Progress)", "twentynineteen" ),
		"labels" => $labels,
		"description" => "Work in progress de la obra. (imágenes, videos, etc)",
		"public" => true,
		"publicly_queryable" => true,
		"show_ui" => true,
		"delete_with_user" => false,
		"show_in_rest" => true,
		"rest_base" => "",
		"rest_controller_class" => "WP_REST_Posts_Controller",
		"has_archive" => false,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"exclude_from_search" => false,
		"capability_type" => "post",
		"map_meta_cap" => true,
		"hierarchical" => false,
		"rewrite" => array( "slug" => "work_in_progress", "with_front" => true ),
		"query_var" => true,
		"supports" => array( "title", "editor", "thumbnail", "excerpt", "custom-fields" ),
	);

	register_post_type( "work_in_progress", $args );

	/**
	 * Post Type: Situaciones.
	 */

	$labels = array(
		"name" => __( "Situaciones", "twentynineteen" ),
		"singular_name" => __( "Situación", "twentynineteen" ),
		"menu_name" => __( "Situaciones", "twentynineteen" ),
	);

	$args = array(
		"label" => __( "Situaciones", "twentynineteen" ),
		"labels" => $labels,
		"description" => "Humor y situaciones",
		"public" => true,
		"publicly_queryable" => true,
		"show_ui" => true,
		"delete_with_user" => false,
		"show_in_rest" => true,
		"rest_base" => "",
		"rest_controller_class" => "WP_REST_Posts_Controller",
		"has_archive" => false,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"exclude_from_search" => false,
		"capability_type" => "post",
		"map_meta_cap" => true,
		"hierarchical" => false,
		"rewrite" => array( "slug" => "situaciones", "with_front" => true ),
		"query_var" => true,
		"supports" => array( "title", "editor", "thumbnail", "excerpt", "custom-fields" ),
	);

	register_post_type( "situaciones", $args );

	/**
	 * Post Type: Textos de las obras.
	 */

	$labels = array(
		"name" => __( "Textos de las obras", "twentynineteen" ),
		"singular_name" => __( "Texto de la obra", "twentynineteen" ),
		"menu_name" => __( "Texto de las Obras", "twentynineteen" ),
	);

	$args = array(
		"label" => __( "Textos de las obras", "twentynineteen" ),
		"labels" => $labels,
		"description" => "Texto dramático íntegro de una obra",
		"public" => true,
		"publicly_queryable" => true,
		"show_ui" => true,
		"delete_with_user" => false,
		"show_in_rest" => true,
		"rest_base" => "",
		"rest_controller_class" => "WP_REST_Posts_Controller",
		"has_archive" => false,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"exclude_from_search" => false,
		"capability_type" => "post",
		"map_meta_cap" => true,
		"hierarchical" => false,
		"rewrite" => array( "slug" => "texto_obra", "with_front" => true ),
		"query_var" => true,
		"supports" => array( "title", "custom-fields" ),
	);

	register_post_type( "texto_obra", $args );

	/**
	 * Post Type: Objetos.
	 */

	$labels = array(
		"name" => __( "Objetos", "twentynineteen" ),
		"singular_name" => __( "Objeto", "twentynineteen" ),
	);

	$args = array(
		"label" => __( "Objetos", "twentynineteen" ),
		"labels" => $labels,
		"description" => "Objetos históricos o relevantes de una obra ",
		"public" => true,
		"publicly_queryable" => true,
		"show_ui" => true,
		"delete_with_user" => false,
		"show_in_rest" => true,
		"rest_base" => "",
		"rest_controller_class" => "WP_REST_Posts_Controller",
		"has_archive" => false,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"exclude_from_search" => false,
		"capability_type" => "post",
		"map_meta_cap" => true,
		"hierarchical" => false,
		"rewrite" => array( "slug" => "objetos", "with_front" => true ),
		"query_var" => true,
		"supports" => array( "title", "editor", "thumbnail", "custom-fields" ),
	);

	register_post_type( "objetos", $args );

	/**
	 * Post Type: Personas.
	 */

	$labels = array(
		"name" => __( "Personas", "twentynineteen" ),
		"singular_name" => __( "Persona", "twentynineteen" ),
	);

	$args = array(
		"label" => __( "Personas", "twentynineteen" ),
		"labels" => $labels,
		"description" => "Contenidos sobre las personas involucradas y los oficios vivos",
		"public" => true,
		"publicly_queryable" => true,
		"show_ui" => true,
		"delete_with_user" => false,
		"show_in_rest" => true,
		"rest_base" => "",
		"rest_controller_class" => "WP_REST_Posts_Controller",
		"has_archive" => false,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"exclude_from_search" => false,
		"capability_type" => "post",
		"map_meta_cap" => true,
		"hierarchical" => false,
		"rewrite" => array( "slug" => "personas", "with_front" => true ),
		"query_var" => true,
		"supports" => array( "title", "editor", "thumbnail", "custom-fields" ),
	);

	register_post_type( "personas", $args );
}

add_action( 'init', 'cptui_register_my_cpts' );
