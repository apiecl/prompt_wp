<?php 
$term = get_term_by( 'slug', get_query_var( 'term' ), 'obra' );
$playtext = bit_get_play($term->term_id);
?>

<h2 class="standard-title">
	Materiales por tipo
</h2>

<ul class="nav nav-pills materiales-obra" id="materialesTabs" role="tablist" data-play-id="<?php echo $term->term_id;?>">
	<li class="nav-item">
		<a href="#fotografias" class="nav-link active" data-toggle="tab" id="fotografiasTab" data-function="getMedia" data-getType="gallery" data-play-id="<?php echo $term->term_id;?>">Fotos</a>
	</li>
	<li class="nav-item">
		<a href="#videos" class="nav-link" data-toggle="tab" id="videosTab" data-function="getMedia" data-getType="videos" data-play-id="<?php echo $term->term_id;?>">Videos</a>
	</li>
	<li class="nav-item">
		<a href="#audios" id="audiosTab" class="nav-link" data-toggle="tab" data-function="getMedia" data-getType="audios" data-play-id="<?php echo $term->term_id;?>">Audios</a>
	</li>
	<li class="nav-item">
		<a href="#documentos" class="nav-link" data-toggle="tab" id="documentosTab" data-function="getMedia" data-getType="documentos" data-play-id="<?php echo $term->term_id;?>">Documentos</a>
	</li>
	<li class="nav-item">
		<a href="#bocetos" class="nav-link" data-toggle="tab" id="bocetosTab" data-function="getMedia" data-getType="bocetos" data-play-id="<?php echo $term->term_id;?>">Bocetos</a>
	</li>
	<li class="nav-item">
		<a href="#papeleria" class="nav-link" data-toggle="tab" id="paeleriaTab" data-function="getMedia" data-getType="papeleria" data-play-id="<?php echo $term->term_id;?>">Papeleria</a>
	</li>
</ul>

<div class="tab-content" id="materialesTabsContent">
	<div class="tab-pane fade show active" id="fotografias" role="tabpanel" aria-labelledby="fotografiasTab" >
		<!-- ajax loaded content -->
	</div>

	<div class="tab-pane fade show" id="videos" role="tabpanel" aria-labelledby="videosTab">
		<!-- ajax loaded content -->
	</div>


	<div class="tab-pane fade show" id="documentos" role="tabpanel" aria-labelledby="documentosTab">
		<!-- ajax loaded content -->
	</div>


	<div class="tab-pane fade show" id="audios" role="tabpanel" aria-labelledby="audiosTab">
		<!-- ajax loaded content -->
	</div>


	<div class="tab-pane fade show" id="bocetos" role="tabpanel" aria-labelledby="bocetosTab">
		<!-- ajax loaded content -->
	</div>


	<div class="tab-pane fade show" id="papeleria" role="tabpanel" aria-labelledby="papeleriaTab">
		<!-- ajax loaded content -->
	</div>



</div>

<h2 class="standard-title">Materiales por área</h2>