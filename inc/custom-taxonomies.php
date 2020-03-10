<?php

function cptui_register_my_taxes() {

	/**
	 * Taxonomy: Obras.
	 */

	$labels = [
		"name" => __( "Obras", "prompt" ),
		"singular_name" => __( "obra", "prompt" ),
		"menu_name" => __( "Obras", "prompt" ),
	];

	$args = [
		"label" => __( "Obras", "prompt" ),
		"labels" => $labels,
		"public" => true,
		"publicly_queryable" => true,
		"hierarchical" => true,
		"show_ui" => true,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"query_var" => true,
		"rewrite" => [ 'slug' => 'obra', 'with_front' => true, ],
		"show_admin_column" => false,
		"show_in_rest" => true,
		"rest_base" => "obra",
		"rest_controller_class" => "WP_REST_Terms_Controller",
		"show_in_quick_edit" => false,
		];
	register_taxonomy( "obra", [ "work_in_progress", "situaciones", "texto_obra", "objetos", "personas", "hitos", "attachment" ], $args );

	/**
	 * Taxonomy: Áreas.
	 */

	$labels = [
		"name" => __( "Áreas", "prompt" ),
		"singular_name" => __( "Área", "prompt" ),
		"menu_name" => __( "Áreas", "prompt" ),
		"all_items" => __( "Todas las Áreas", "prompt" ),
		"edit_item" => __( "Editar Área", "prompt" ),
		"view_item" => __( "Ver Área", "prompt" ),
		"update_item" => __( "Actualizar Área", "prompt" ),
		"add_new_item" => __( "Añadir nueva Área", "prompt" ),
		"new_item_name" => __( "Nombre de la nueva Área", "prompt" ),
		"parent_item" => __( "Área superior", "prompt" ),
		"parent_item_colon" => __( "Área superior:", "prompt" ),
		"search_items" => __( "Buscar Áreas", "prompt" ),
		"popular_items" => __( "Áreas populares", "prompt" ),
		"separate_items_with_commas" => __( "Separar Áreas con comas", "prompt" ),
		"add_or_remove_items" => __( "Añadir o eliminar Áreas", "prompt" ),
		"choose_from_most_used" => __( "Elegir Área más usada", "prompt" ),
		"not_found" => __( "No se encontraron Áreas", "prompt" ),
		"no_terms" => __( "No hay Áreas", "prompt" ),
		"items_list_navigation" => __( "Navegación de listado de Áreas", "prompt" ),
		"items_list" => __( "Lista de Áreas", "prompt" ),
	];

	$args = [
		"label" => __( "Áreas", "prompt" ),
		"labels" => $labels,
		"public" => true,
		"publicly_queryable" => true,
		"hierarchical" => true,
		"show_ui" => true,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"query_var" => true,
		"rewrite" => [ 'slug' => 'area', 'with_front' => true, ],
		"show_admin_column" => true,
		"show_in_rest" => true,
		"rest_base" => "area",
		"rest_controller_class" => "WP_REST_Terms_Controller",
		"show_in_quick_edit" => true,
		];
	register_taxonomy( "area", [ "post", "page", "attachment", "work_in_progress", "situaciones", "texto_obra", "objetos", "personas", "hitos" ], $args );

	/**
	 * Taxonomy: Dimensiones.
	 */

	$labels = [
		"name" => __( "Dimensiones", "prompt" ),
		"singular_name" => __( "Dimensión", "prompt" ),
		"menu_name" => __( "Dimensiones", "prompt" ),
		"all_items" => __( "Todas las Dimensiones", "prompt" ),
		"edit_item" => __( "Editar Dimensión", "prompt" ),
		"view_item" => __( "Ver Dimensión", "prompt" ),
		"update_item" => __( "Actualizar el nombre de la Dimensión", "prompt" ),
		"add_new_item" => __( "Añadir nueva Dimensión", "prompt" ),
		"new_item_name" => __( "Nombre de la nueva Dimensión", "prompt" ),
		"parent_item" => __( "Dimensión superior", "prompt" ),
		"parent_item_colon" => __( "Dimensión superior:", "prompt" ),
		"search_items" => __( "Buscar Dimensiones", "prompt" ),
		"popular_items" => __( "Dimensiones populares", "prompt" ),
		"separate_items_with_commas" => __( "Separar Dimensiones con comas", "prompt" ),
		"add_or_remove_items" => __( "Añadir o quitar Dimensiones", "prompt" ),
		"choose_from_most_used" => __( "Elegir entre las Dimensiones más usadas", "prompt" ),
		"not_found" => __( "No se encontraron Dimensiones", "prompt" ),
		"no_terms" => __( "No hay Dimensiones", "prompt" ),
		"items_list_navigation" => __( "Navegación de listado de Dimensiones", "prompt" ),
		"items_list" => __( "Lista de Dimensiones", "prompt" ),
	];

	$args = [
		"label" => __( "Dimensiones", "prompt" ),
		"labels" => $labels,
		"public" => true,
		"publicly_queryable" => true,
		"hierarchical" => true,
		"show_ui" => true,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"query_var" => true,
		"rewrite" => [ 'slug' => 'dimensiones', 'with_front' => true, ],
		"show_admin_column" => false,
		"show_in_rest" => true,
		"rest_base" => "dimensiones",
		"rest_controller_class" => "WP_REST_Terms_Controller",
		"show_in_quick_edit" => true,
		];
	register_taxonomy( "dimensiones", [ "post", "page", "attachment", "work_in_progress", "situaciones", "texto_obra", "objetos", "personas", "hitos" ], $args );

	/**
	 * Taxonomy: Roles.
	 */

	$labels = [
		"name" => __( "Roles", "prompt" ),
		"singular_name" => __( "Rol", "prompt" ),
		"menu_name" => __( "Roles", "prompt" ),
		"all_items" => __( "Todos los Roles", "prompt" ),
		"edit_item" => __( "Editar Rol", "prompt" ),
		"view_item" => __( "Ver Rol", "prompt" ),
		"update_item" => __( "Actualizar el nombre del Rol", "prompt" ),
		"add_new_item" => __( "Añadir nuevo Rol", "prompt" ),
		"new_item_name" => __( "Nombre del nuevo Rol", "prompt" ),
		"parent_item" => __( "Rol superior", "prompt" ),
		"parent_item_colon" => __( "Rol superior:", "prompt" ),
		"search_items" => __( "Buscar Roles", "prompt" ),
		"popular_items" => __( "Roles populares", "prompt" ),
		"separate_items_with_commas" => __( "Separar roles con comas", "prompt" ),
		"add_or_remove_items" => __( "Añadir o quitar Roles", "prompt" ),
		"choose_from_most_used" => __( "Elegir entre los Roles más usados", "prompt" ),
		"not_found" => __( "No se encontraron Roles", "prompt" ),
		"no_terms" => __( "No hay Roles", "prompt" ),
		"items_list_navigation" => __( "Navegación de lista de Roles", "prompt" ),
		"items_list" => __( "Lista de Roles", "prompt" ),
	];

	$args = [
		"label" => __( "Roles", "prompt" ),
		"labels" => $labels,
		"public" => true,
		"publicly_queryable" => true,
		"hierarchical" => true,
		"show_ui" => true,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"query_var" => true,
		"rewrite" => [ 'slug' => 'rol', 'with_front' => true, ],
		"show_admin_column" => true,
		"show_in_rest" => true,
		"rest_base" => "rol",
		"rest_controller_class" => "WP_REST_Terms_Controller",
		"show_in_quick_edit" => true,
		];
	register_taxonomy( "rol", [ "personas", "attachment" ], $args );

	// Register Custom Taxonomy

	$labels = array(
		'name'                       => _x( 'Desarrollo Obras', 'Taxonomy General Name', 'prompt' ),
		'singular_name'              => _x( 'Desarrollo Obras', 'Taxonomy Singular Name', 'prompt' ),
		'menu_name'                  => __( 'Desarrollo obras', 'prompt' ),
		'all_items'                  => __( 'Todas las etapas', 'prompt' ),
		'parent_item'                => __( 'Parent Item', 'prompt' ),
		'parent_item_colon'          => __( 'Parent Item:', 'prompt' ),
		'new_item_name'              => __( 'Nueva etapa', 'prompt' ),
		'add_new_item'               => __( 'Añadir nueva Etapa', 'prompt' ),
		'edit_item'                  => __( 'Editar Etapa', 'prompt' ),
		'update_item'                => __( 'Actualizar Etapas', 'prompt' ),
		'view_item'                  => __( 'Ver Etapa', 'prompt' ),
		'separate_items_with_commas' => __( 'Separate items with commas', 'prompt' ),
		'add_or_remove_items'        => __( 'Add or remove items', 'prompt' ),
		'choose_from_most_used'      => __( 'Choose from the most used', 'prompt' ),
		'popular_items'              => __( 'Popular Items', 'prompt' ),
		'search_items'               => __( 'Buscar Etapas', 'prompt' ),
		'not_found'                  => __( 'Not Found', 'prompt' ),
		'no_terms'                   => __( 'No items', 'prompt' ),
		'items_list'                 => __( 'Items list', 'prompt' ),
		'items_list_navigation'      => __( 'Items list navigation', 'prompt' ),
	);
	$args = array(
		'labels'                     => $labels,
		'hierarchical'               => true,
		'public'                     => true,
		'show_ui'                    => true,
		'show_admin_column'          => true,
		'show_in_nav_menus'          => true,
		'show_tagcloud'              => true,
	);
	register_taxonomy( 'desarrollo', array( 'post', 'attachment', ' personas' ), $args );

	$labels = array(
		'name'                       => _x( 'Espacial Obras', 'Taxonomy General Name', 'prompt' ),
		'singular_name'              => _x( 'Espacial Obras', 'Taxonomy Singular Name', 'prompt' ),
		'menu_name'                  => __( 'Espacial', 'prompt' ),
		'all_items'                  => __( 'Todos los Espacios', 'prompt' ),
		'parent_item'                => __( 'Parent Item', 'prompt' ),
		'parent_item_colon'          => __( 'Parent Item:', 'prompt' ),
		'new_item_name'              => __( 'Nuevo Espacio', 'prompt' ),
		'add_new_item'               => __( 'Añadir nuevo Espacio', 'prompt' ),
		'edit_item'                  => __( 'Editar Espacio', 'prompt' ),
		'update_item'                => __( 'Actualizar Espacio', 'prompt' ),
		'view_item'                  => __( 'Ver Espacio', 'prompt' ),
		'separate_items_with_commas' => __( 'Separate items with commas', 'prompt' ),
		'add_or_remove_items'        => __( 'Add or remove items', 'prompt' ),
		'choose_from_most_used'      => __( 'Choose from the most used', 'prompt' ),
		'popular_items'              => __( 'Popular Items', 'prompt' ),
		'search_items'               => __( 'Buscar Espacios', 'prompt' ),
		'not_found'                  => __( 'Not Found', 'prompt' ),
		'no_terms'                   => __( 'No items', 'prompt' ),
		'items_list'                 => __( 'Items list', 'prompt' ),
		'items_list_navigation'      => __( 'Items list navigation', 'prompt' ),
	);
	$args = array(
		'labels'                     => $labels,
		'hierarchical'               => true,
		'public'                     => true,
		'show_ui'                    => true,
		'show_admin_column'          => true,
		'show_in_nav_menus'          => true,
		'show_tagcloud'              => true,
	);
	register_taxonomy( 'espacial_obras', array( 'post', 'attachment', ' personas' ), $args );

	// Register Custom Taxonomy

	$labels = array(
		'name'                       => _x( 'Identidad / Educación', 'Taxonomy General Name', 'prompt' ),
		'singular_name'              => _x( 'Identidad / Educación', 'Taxonomy Singular Name', 'prompt' ),
		'menu_name'                  => __( 'Identidad - Educación', 'prompt' ),
		'all_items'                  => __( 'Todas las Identidades - Educación', 'prompt' ),
		'parent_item'                => __( 'Parent Item', 'prompt' ),
		'parent_item_colon'          => __( 'Parent Item:', 'prompt' ),
		'new_item_name'              => __( 'Nueva Identidad / Educación', 'prompt' ),
		'add_new_item'               => __( 'Añadir nueva Identidad / Educación', 'prompt' ),
		'edit_item'                  => __( 'Editar Identidad / Educación', 'prompt' ),
		'update_item'                => __( 'Actualizar Identidad / Educación', 'prompt' ),
		'view_item'                  => __( 'Ver Identidad / Educación', 'prompt' ),
		'separate_items_with_commas' => __( 'Separate items with commas', 'prompt' ),
		'add_or_remove_items'        => __( 'Add or remove items', 'prompt' ),
		'choose_from_most_used'      => __( 'Choose from the most used', 'prompt' ),
		'popular_items'              => __( 'Popular Items', 'prompt' ),
		'search_items'               => __( 'Buscar Identidad / Educación', 'prompt' ),
		'not_found'                  => __( 'Not Found', 'prompt' ),
		'no_terms'                   => __( 'No items', 'prompt' ),
		'items_list'                 => __( 'Items list', 'prompt' ),
		'items_list_navigation'      => __( 'Items list navigation', 'prompt' ),
	);
	$args = array(
		'labels'                     => $labels,
		'hierarchical'               => true,
		'public'                     => true,
		'show_ui'                    => true,
		'show_admin_column'          => true,
		'show_in_nav_menus'          => true,
		'show_tagcloud'              => true,
	);
	register_taxonomy( 'identidad_educacion', array( 'post', 'attachment', ' personas' ), $args );

}

add_action( 'init', 'cptui_register_my_taxes' );
