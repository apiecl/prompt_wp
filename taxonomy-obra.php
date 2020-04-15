<?php
get_header();

global $wp_query;

$term = get_term_by( 'slug', get_query_var( 'term' ), 'obra' );
$fields = prompt_obra_metadata( $term->term_id );
$tab = $wp_query->query_vars['tab'];
$baseurl = get_term_link($term->term_id, 'obra');
?>

<div class="single-obra-container-fluid container-fluid" >
	<div class="wrapper">
		
		<a href="#" class="toggleTabs"><i class="fas fa-bars"></i></a>

		<nav class="nav nav-pills nav-justified" id="obraTab" role="tablist">
			<a id="info-tab" href="<?php echo $baseurl;?>" class="nav-item nav-link <?php echo ( is_null($tab) ? 'active' : '');?>">Ficha</a>
			<a id="texto-tab" href="<?php echo $baseurl . 'texto-dramatico';?>" class="nav-item nav-link <?php echo ($tab == 'texto-dramatico' ? 'active' : '');?>">Texto</a>
			<a id="timeline-tab" href="<?php echo $baseurl . 'linea-de-tiempo';?>" class="nav-item nav-link <?php echo ($tab == 'linea-de-tiempo' ? 'active' : '');?>">Línea de Tiempo</a>
			<a id="materiales-tab" href="<?php echo $baseurl . 'materiales';?>" class="nav-item nav-link <?php echo ($tab == null ? 'materiales' : '');?>">Materiales</a>
		</nav>

		<div class="imagen-obra">
			<h1 class="play-title"><?php single_term_title();?></h1>
			<div class="imagen" style="background-image: url(<?php echo $fields['imagen'][0];?>);">
			</div>
		</div>
		


		<div class="single-obra container">
			
			<div class="row">
				<div class="col-md-12">
					
					
					<div class="tab-content" id="obraTabContent">
						<div class="tab-pane fade show active" id="mainTab" role="tabpanel" aria-labelledby="info-tab">

							<div class="ficha-obra">
								<?php switch($tab) {
									case('linea-de-tiempo'):
									get_template_part( 'template-parts/timeline-obra' );
									break;
									case('materiales'):
									get_template_part( 'template-parts/materiales-obra' );
									break;
									case('texto-dramatico'):
									get_template_part( 'template-parts/texto-obra' );
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