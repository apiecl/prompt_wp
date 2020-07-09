<?php
/**
 * promptbook functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package promptbook
 */

define( 'PROMPT_VERSION', '1.0.5');

if ( ! function_exists( 'prompt_setup' ) ) :
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which
	 * runs before the init hook. The init hook is too late for some features, such
	 * as indicating support for post thumbnails.
	 */
	function prompt_setup() {
		/*
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 * If you're building a theme based on promptbook, use a find and replace
		 * to change 'prompt' to the name of your theme in all the template files.
		 */
		load_theme_textdomain( 'prompt', get_template_directory() . '/languages' );

		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );

		// This theme uses wp_nav_menu() in one location.
		register_nav_menus( array(
			'menu-1' => esc_html__( 'Primary', 'prompt' ),
		) );

		/*
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support( 'html5', array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
		) );

		// Set up the WordPress core custom background feature.
		add_theme_support( 'custom-background', apply_filters( 'prompt_custom_background_args', array(
			'default-color' => 'ffffff',
			'default-image' => '',
		) ) );

		// Add theme support for selective refresh for widgets.
		add_theme_support( 'customize-selective-refresh-widgets' );

		/**
		 * Add support for core custom logo.
		 *
		 * @link https://codex.wordpress.org/Theme_Logo
		 */
		add_theme_support( 'custom-logo', array(
			'height'      => 250,
			'width'       => 250,
			'flex-width'  => true,
			'flex-height' => true,
		) );
	}
endif;
add_action( 'after_setup_theme', 'prompt_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function prompt_content_width() {
	// This variable is intended to be overruled from themes.
	// Open WPCS issue: {@link https://github.com/WordPress-Coding-Standards/WordPress-Coding-Standards/issues/1043}.
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
	$GLOBALS['content_width'] = apply_filters( 'prompt_content_width', 640 );
}
add_action( 'after_setup_theme', 'prompt_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function prompt_widgets_init() {
	register_sidebar( array(
		'name'          => esc_html__( 'Sidebar', 'prompt' ),
		'id'            => 'sidebar-1',
		'description'   => esc_html__( 'Add widgets here.', 'prompt' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );
}
add_action( 'widgets_init', 'prompt_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function prompt_scripts() {
	global $wp_query, $post;

	wp_enqueue_style( 'prompt-style', get_stylesheet_uri(), array(), PROMPT_VERSION );
	
	// wp_enqueue_script('bitacora-functions', get_template_directory_uri() . '/js/bitacora-functions.js', array('jquery'), PROMPT_VERSION, false);
	
	// wp_enqueue_script('bitacora', get_template_directory_uri() . '/js/bitacora.js', array('jquery', 'bootstrap', 'masonry', 'lazyload', 'audiovis'), PROMPT_VERSION, false);

	// wp_enqueue_script( 'prompt-navigation', get_template_directory_uri() . '/js/navigation.js', array(), PROMPT_VERSION, true );

	// //wp_enqueue_script( 'visible', get_template_directory_uri() . '/js/jquery.visible.min.js', array('jquery'), PROMPT_VERSION, true );

	// wp_enqueue_script( 'prompt-skip-link-focus-fix', get_template_directory_uri() . '/js/skip-link-focus-fix.js', array(), '20151215', true );

	// wp_enqueue_script( 'bootstrap', get_template_directory_uri() . '/js/bootstrap.min.js', array('jquery', 'popper'), '4.0', false );

	// wp_enqueue_script( 'popper', get_template_directory_uri() . '/js/popper.min.js' , array(), false, false );

	// wp_enqueue_script('masonry', get_template_directory_uri() . '/js/masonry.pkgd.min.js', array('jquery', 'imagesLoaded'), '4.2.2', false);

	// wp_enqueue_script('audiovis', get_template_directory_uri() . '/js/audio_vis.js', array('jquery'), '1.2.2', false);

	// wp_enqueue_script('imagesLoaded',  get_template_directory_uri() . '/js/imagesloaded.pkgd.min.js', array(), 'last', false);

	// wp_enqueue_script('lazyload', get_template_directory_uri() . '/js/lazyload.js', array('jquery'), '1.9.1', false);

	// wp_enqueue_script('isotope', get_template_directory_uri() . '/js/isotope.pkgd.min.js', array('jquery', 'bitacora'), '2.1.1', false);

	// wp_enqueue_script('uaparser', get_template_directory_uri() . '/js/ua-parser.min.js', array('jquery'), '0.7.2.1', false);

	//wp_enqueue_script('syncscroll', get_template_directory_uri() . '/js/syncscroll.js', array(), '0.0.3', false);

	//wp_enqueue_script('dragscroll', get_template_directory_uri() . '/js/dragscroll.js', array(), '0.0.3', false);

	//wp_enqueue_script('simplebar', 'https://cdn.jsdelivr.net/npm/simplebar@latest/dist/simplebar.min.js', array(), '5.0.0', false);
	
	wp_enqueue_script('bitacora', get_template_directory_uri() . '/dist/bitacora.js', array('jquery'), PROMPT_VERSION, false);


	$taxonomies = get_taxonomies(array(), 'objects');
	$taxinfo = [];
	$taxobjects = [];

	foreach($taxonomies as $taxonomy) {
		if($taxonomy->name != 'obra'):
			$terms = get_terms(array('taxonomy' => $taxonomy->name, 'hide_empty'=> false));
			$termdata = [];
			$taxobjects[$taxonomy->name] = $taxonomy->label; 
			
			foreach($terms as $term) {
				$termdata[$term->slug] = $term;  
			}

			$taxinfo[$taxonomy->name] =  $termdata;

		endif;

	}


	wp_localize_script( 'bitacora', 'prompt', array(
		'ajaxurl' => admin_url('admin-ajax.php'),
		'taxinfo' => $taxinfo,
		'taxlabels'	=> $taxobjects,
		'resturl'	=> get_bloginfo('url') . '/wp-json/textodramatico/v1/mediaitem/',
		'nonce'	  		=> wp_create_nonce( 'wp_rest' )
	)
);		


	$tab = isset($wp_query->query_vars['tab']) ? $wp_query->query_vars['tab'] : null; 

	
		
			if( $tab == 'texto-dramatico'):
				//wp_enqueue_script('scrollbars', get_template_directory_uri() . '/js/jquery.overlayScrollbars.min.js', array(), '0.0.3', false);
				//wp_enqueue_script('bitacora-texto', get_template_directory_uri() . '/js/bitacora-texto-dramatico.js', array('jquery', 'bootstrap', 'masonry', 'lazyload', 'audiovis', 'scrollbars', 'inview', 'uaparser'), PROMPT_VERSION, false);
				//wp_enqueue_script('inview', get_template_directory_uri() . '/js/in-view.min.js', array(), '0.6.1', false);
				//wp_enqueue_script('waypoints', get_template_directory_uri() . '/js/jquery.waypoints.min.js', array(), '1.1.0', false);
			
			elseif($tab == 'linea-de-tiempo' || is_page_template('page-template-timeline-teatro.php')):

				//wp_enqueue_script( 'timelinejs', get_template_directory_uri() . '/js/timeline.js', array(), '3.6.5', false );
				wp_enqueue_style( 'timeline', get_template_directory_uri() . '/TL.Timeline.css', array(), '3.6.5', 'screen' );

				wp_localize_script( 'bitacora', 'prompt_hitos', get_main_timeline_events() );

				//Localiza la info de una obra en Json
				if(is_tax( 'obra' )):
					$args = array(
						'taxonomy' => 'obra',
						'hide_empty' => false,
					);
					$obras = get_terms( $args );
					if($obras):
						foreach($obras as $obra):
							$obraslugjs = prompt_obraslugjs($obra->slug);
							wp_localize_script( 'bitacora', 'prompt_hitos_' . $obraslugjs , get_main_timeline_events($obra->slug) );
						endforeach;
					endif;
				endif;
			endif;
			
}

add_action( 'wp_enqueue_scripts', 'prompt_scripts' );



function prompt_head() {
	?>
	<script src="https://kit.fontawesome.com/14643ca681.js" crossorigin="anonymous"></script>
	<?php
}

add_action( 'wp_head', 'prompt_head', 10, 0 );

// REMOVE WP EMOJI
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');

remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
remove_action( 'admin_print_styles', 'print_emoji_styles' );

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
if ( defined( 'JETPACK__VERSION' ) ) {
	require get_template_directory() . '/inc/jetpack.php';
}

/**
 * Load Custom Fields
 */
require get_template_directory() . '/inc/custom-fields.php';

/**
 * Load Custom Content
 */

require get_template_directory() . '/inc/custom-content.php';

/**
 * Load Custom Taxonomies
 */

require get_template_directory() . '/inc/custom-taxonomies.php';


/**
 * Ajax Functions
 */

require get_template_directory() . '/inc/ajax-functions.php';
