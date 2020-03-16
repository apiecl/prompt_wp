<?php 
$term = get_term_by( 'slug', get_query_var( 'term' ), 'obra' );
$playtext = bit_get_play($term->term_id);
?>

<h2 class="standard-title">
	Historia y patrimonio en imágenes y multimedia
</h2>

<div id="materialesTabsContent">
	<!-- contenido -->
</div>

<div class="modal fade modal-media-text" tabindex="-1" role="dialog" id="modal-media-text-materiales" aria-hidden="true" data-ispage="true">
		<div class="modal-dialog modal-xl" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title"><!-- Title here --></h1>
					<span type="button" class="close" data-dismiss="modal" aria-label="Close">
						<i class="fas fa-times"></i>
					</span>
				</div>
				<div class="modal-body">
					<!-- Content here -->
				</div>
       	<div class="modal-footer">
        	<button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
    	</div>
			</div>
		</div>
	</div>