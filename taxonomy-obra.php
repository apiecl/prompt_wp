<?php
get_header();

$term = get_term_by( 'slug', get_query_var( 'term' ), 'obra' );
$fields = prompt_obra_metadata( $term->term_id );
?>

<div class="single-obra-container-fluid container-fluid" >
	<div class="wrapper">
		
		<a href="#" class="toggleTabs"><i class="fas fa-bars"></i></a>

		<nav class="nav nav-pills nav-justified" id="obraTab" role="tablist">
			<a aria-selected="true" id="info-tab" data-toggle="tab" href="#info" class="nav-item nav-link active">Ficha</a>
			<a aria-selected="false" id="texto-tab" data-toggle="tab" href="#texto" class="nav-item nav-link">Texto</a>
			<a aria-selected="false" id="timeline-tab" data-toggle="tab" href="#timeline" data-function="timeline" class="nav-item nav-link">Línea de Tiempo</a>
			<a aria-selected="false" id="materiales-tab" data-toggle="tab" href="#materiales" data-function="materiales" class="nav-item nav-link">Materiales</a>
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
						<div class="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">

							<div class="ficha-obra">
								
								<h1>Ficha técnica</h1>

								<?php get_template_part( 'template-parts/ficha-obra' );?>
								
								<div class="row">
									<div class="intro-obra col-md-8 col-7">
										<header class="ficha-title">
											<h2>Reseña</h2>
										</header>
										<?php echo $fields['review'][0];?>
									</div>
									<dl class="col-md-4 col-5">
										<header class="ficha-title">
											<h2>Elenco</h2>
										</header> 
										<dd class="strong-dd elenco"><?php echo prompt_multifields($fields['elenco'][0], ' <br> ');?></dd>
									</dl>
								</div>
								

								
							</div>

						</div>
						<div class="tab-pane fade" id="texto" role="tabpanel" aria-labelledby="texto-tab">
							<div class="ficha-obra">
								<?php get_template_part( 'template-parts/texto-obra');?>
							</div>
						</div>

						<div class="tab-pane fade" id="timeline" role="tabpanel" aria-labelledby="timeline-tab">
							<div class="ficha-obra">
								<?php get_template_part( 'template-parts/timeline-obra' );?>
							</div>
						</div>

						<div class="tab-pane fade" id="materiales" role="tabpanel" aria-labelledby="materiales-tab">
							<div class="ficha-obra">
								<?php get_template_part( 'template-parts/materiales-obra' );?>
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