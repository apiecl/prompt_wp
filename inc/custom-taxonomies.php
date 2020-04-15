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
		"show_admin_column" => true,
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
		"name" => __( "Áreas Teatrales", "prompt" ),
		"singular_name" => __( "Área teatral", "prompt" ),
		"menu_name" => __( "Áreas Teatrales", "prompt" ),
		"all_items" => __( "Todas las Áreas Teatrales", "prompt" ),
		"edit_item" => __( "Editar Área Teatral", "prompt" ),
		"view_item" => __( "Ver Área Teatral", "prompt" ),
		"update_item" => __( "Actualizar Área Teatral", "prompt" ),
		"add_new_item" => __( "Añadir nueva Área Teatral", "prompt" ),
		"new_item_name" => __( "Nombre de la nueva Área Teatral", "prompt" ),
		"parent_item" => __( "Área Teatral superior", "prompt" ),
		"parent_item_colon" => __( "Área Teatral superior:", "prompt" ),
		"search_items" => __( "Buscar Áreas Teatrales", "prompt" ),
		"popular_items" => __( "Áreas Teatrales populares", "prompt" ),
		"separate_items_with_commas" => __( "Separar Áreas Teatrales con comas", "prompt" ),
		"add_or_remove_items" => __( "Añadir o eliminar Áreas Teatrales", "prompt" ),
		"choose_from_most_used" => __( "Elegir Área Teatral más usada", "prompt" ),
		"not_found" => __( "No se encontraron Áreas Teatrales", "prompt" ),
		"no_terms" => __( "No hay Áreas Teatrales", "prompt" ),
		"items_list_navigation" => __( "Navegación de listado de Áreas Teatrales", "prompt" ),
		"items_list" => __( "Lista de Áreas Teatrales", "prompt" ),
	];

	$args = [
		"label" => __( "Áreas Teatrales", "prompt" ),
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

	// /**
	//  * Taxonomy: Dimensiones.
	//  */

	// $labels = [
	// 	"name" => __( "Dimensiones", "prompt" ),
	// 	"singular_name" => __( "Dimensión", "prompt" ),
	// 	"menu_name" => __( "Dimensiones", "prompt" ),
	// 	"all_items" => __( "Todas las Dimensiones", "prompt" ),
	// 	"edit_item" => __( "Editar Dimensión", "prompt" ),
	// 	"view_item" => __( "Ver Dimensión", "prompt" ),
	// 	"update_item" => __( "Actualizar el nombre de la Dimensión", "prompt" ),
	// 	"add_new_item" => __( "Añadir nueva Dimensión", "prompt" ),
	// 	"new_item_name" => __( "Nombre de la nueva Dimensión", "prompt" ),
	// 	"parent_item" => __( "Dimensión superior", "prompt" ),
	// 	"parent_item_colon" => __( "Dimensión superior:", "prompt" ),
	// 	"search_items" => __( "Buscar Dimensiones", "prompt" ),
	// 	"popular_items" => __( "Dimensiones populares", "prompt" ),
	// 	"separate_items_with_commas" => __( "Separar Dimensiones con comas", "prompt" ),
	// 	"add_or_remove_items" => __( "Añadir o quitar Dimensiones", "prompt" ),
	// 	"choose_from_most_used" => __( "Elegir entre las Dimensiones más usadas", "prompt" ),
	// 	"not_found" => __( "No se encontraron Dimensiones", "prompt" ),
	// 	"no_terms" => __( "No hay Dimensiones", "prompt" ),
	// 	"items_list_navigation" => __( "Navegación de listado de Dimensiones", "prompt" ),
	// 	"items_list" => __( "Lista de Dimensiones", "prompt" ),
	// ];

	// $args = [
	// 	"label" => __( "Dimensiones", "prompt" ),
	// 	"labels" => $labels,
	// 	"public" => true,
	// 	"publicly_queryable" => true,
	// 	"hierarchical" => true,
	// 	"show_ui" => true,
	// 	"show_in_menu" => true,
	// 	"show_in_nav_menus" => true,
	// 	"query_var" => true,
	// 	"rewrite" => [ 'slug' => 'dimensiones', 'with_front' => true, ],
	// 	"show_admin_column" => false,
	// 	"show_in_rest" => true,
	// 	"rest_base" => "dimensiones",
	// 	"rest_controller_class" => "WP_REST_Terms_Controller",
	// 	"show_in_quick_edit" => true,
	// 	];
	// register_taxonomy( "dimensiones", [ "post", "page", "attachment", "work_in_progress", "situaciones", "texto_obra", "objetos", "personas", "hitos" ], $args );

	/**
	 * Taxonomy: Roles.
	 */

	$labels = [
		"name" => __( "Roles Teatrales", "prompt" ),
		"singular_name" => __( "Rol teatral", "prompt" ),
		"menu_name" => __( "Roles Teatrales", "prompt" ),
		"all_items" => __( "Todos los Roles Teatrales", "prompt" ),
		"edit_item" => __( "Editar Rol Teatral", "prompt" ),
		"view_item" => __( "Ver Rol Teatral", "prompt" ),
		"update_item" => __( "Actualizar el nombre del Rol Teatral", "prompt" ),
		"add_new_item" => __( "Añadir nuevo Rol Teatral", "prompt" ),
		"new_item_name" => __( "Nombre del nuevo Rol Teatral", "prompt" ),
		"parent_item" => __( "Rol Teatral superior", "prompt" ),
		"parent_item_colon" => __( "Rol Teatral superior:", "prompt" ),
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
		"label" => __( "Roles Teatrales", "prompt" ),
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
		'name'                       => _x( 'Desarrollo Obra', 'Taxonomy General Name', 'prompt' ),
		'singular_name'              => _x( 'Desarrollo Obra', 'Taxonomy Singular Name', 'prompt' ),
		'menu_name'                  => __( 'Desarrollo obra', 'prompt' ),
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
		'show_in_rest'				 => true
	);
	register_taxonomy( 'desarrollo', array( 'post', 'attachment', ' personas', 'hitos' ), $args );

	$labels = array(
		'name'                       => _x( 'Espacial', 'Taxonomy General Name', 'prompt' ),
		'singular_name'              => _x( 'Espacial', 'Taxonomy Singular Name', 'prompt' ),
		'menu_name'                  => __( 'Espacial', 'prompt' ),
		'all_items'                  => __( 'Todos los Espacial', 'prompt' ),
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
		'name'                       => _x( 'Identidad & Educación', 'Taxonomy General Name', 'prompt' ),
		'singular_name'              => _x( 'Identidad & Educación', 'Taxonomy Singular Name', 'prompt' ),
		'menu_name'                  => __( 'Identidad & Educación', 'prompt' ),
		'all_items'                  => __( 'Todas las Identidad & Educación', 'prompt' ),
		'parent_item'                => __( 'Parent Item', 'prompt' ),
		'parent_item_colon'          => __( 'Parent Item:', 'prompt' ),
		'new_item_name'              => __( 'Nueva Identidad & Educación', 'prompt' ),
		'add_new_item'               => __( 'Añadir nueva Identidad & Educación', 'prompt' ),
		'edit_item'                  => __( 'Editar Identidad & Educación', 'prompt' ),
		'update_item'                => __( 'Actualizar Identidad & Educación', 'prompt' ),
		'view_item'                  => __( 'Ver Identidad & Educación', 'prompt' ),
		'separate_items_with_commas' => __( 'Separate items with commas', 'prompt' ),
		'add_or_remove_items'        => __( 'Add or remove items', 'prompt' ),
		'choose_from_most_used'      => __( 'Choose from the most used', 'prompt' ),
		'popular_items'              => __( 'Popular Items', 'prompt' ),
		'search_items'               => __( 'Buscar Identidad & Educación', 'prompt' ),
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
