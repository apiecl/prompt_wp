<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package promptbook
 */

?>
<!doctype html>
<html <?php language_attributes(); ?> >
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">

	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?> >

	<?php if(is_home()):
		get_template_part( 'template-parts/landing-overlay' );
	endif;?>
	<div id="page" class="site hasmenu">
		<a class="skip-link screen-reader-text" href="#content"><?php esc_html_e( 'Skip to content', 'prompt' ); ?></a>

		<nav id="site-navigation" class="main-navigation">
					<a href="<?php bloginfo('home');?>">
						<img class="logo-menu-mobile" src="<?php echo get_stylesheet_directory_uri();?>/img/logo_celeste.svg" alt="<?php bloginfo( 'name' ); ?>">
					</a>
					<span class="menu-toggle" aria-controls="primary-menu" aria-expanded="false"><i class="fas fa-bars"></i></span>
					
					<h1 class="site-title d-none d-md-block"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><img src="<?php echo get_stylesheet_directory_uri();?>/img/logo_celeste.svg" alt="<?php bloginfo( 'name' ); ?>"></a></h1>

					<?php
					wp_nav_menu( array(
						'theme_location' 	=> 'menu-1',
						'menu_id'        	=> 'primary-menu',
						'container_class'	=> 'menu-principal-container'
					) );
					?>


		</nav>

		<div id="content" class="site-content">
