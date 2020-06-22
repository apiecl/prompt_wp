<?php
get_header();

global $wp_query;

$term = get_term_by( 'slug', get_query_var( 'term' ), 'obra' );
$fields = prompt_obra_metadata( $term->term_id );
$tab = $wp_query->query_vars['tab'];
$baseurl = get_term_link($term->term_id, 'obra');
$yearplay = prompt_format_date($fields['estreno'][0], '%Y');
?>

<div class="single-obra-container-fluid container-fluid content-header" >
	<div class="wrapper">
		
		<div class="cabecera-obra">
			<div class="left">
				<?php get_template_part('template-parts/brand-header');?>
				
				<div class="text">
					<h3 class="header-obra-title">Obra</h3>
					<h1 class="play-title"><?php single_term_title();?> / <?php echo $yearplay;?></h1>
				</div>
			</div>

			<nav class="nav nav-pills nav-justified" id="obraTab" role="tablist">
				<a id="info-tab" href="<?php echo $baseurl;?>" class="nav-item nav-link <?php echo ( is_null($tab) ? 'active' : '');?>">Ficha artística</a>
				<a id="timeline-tab" href="<?php echo $baseurl . 'linea-de-tiempo';?>" class="nav-item nav-link <?php echo ($tab == 'linea-de-tiempo' ? 'active' : '');?>">Línea de Tiempo</a>
				<a id="texto-tab" href="<?php echo $baseurl . 'texto-dramatico';?>" class="nav-item nav-link <?php echo ($tab == 'texto-dramatico' ? 'active' : '');?>">Texto dramático</a>
				<a id="materiales-tab" href="<?php echo $baseurl . 'galeria';?>" class="nav-item nav-link last <?php echo ($tab == 'galeria' ? 'active' : '');?>">Galería</a>
			</nav>
		</div>

		

		
		


		<div class="single-obra container-fluid">
			
			<div class="row">
				<div class="col-md-12">
					
					
					<div class="tab-content" id="obraTabContent">
						<div class="tab-pane fade show active" id="mainTab" role="tabpanel" aria-labelledby="info-tab">

							<div class="ficha-obra <?php echo $tab;?>">
								<?php switch($tab) {
									case('linea-de-tiempo'):
									get_template_part( 'template-parts/timeline-obra' );
									break;
									case('galeria'):
									get_template_part( 'template-parts/materiales-obra' );
									break;
									case('texto-dramatico'):
									get_template_part( 'template-parts/texto-obra' );
									break;
									default:
									get_template_part( 'template-parts/ficha-obra' );
									break;
								}
								?>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>


<?php
get_footer();
?>