<section id="obras">
	<div class="container">	
		<div class="row d-flex align-items-stretch">
			<?php
			$obras = get_terms( array(
				'taxonomy' => 'obra',
				'hide_empty' => false
			));

			if($obras):
				foreach($obras as $obra):
					$fields = prompt_obra_metadata($obra->term_id);
					?>
					<div class="col-md-10">
						<div class="obra obra-item" id="<?php echo $obra->slug;?>">
							<div class="imagen-obra">
								<video autoplay="true" loop="true" src="<?php echo $fields['video'][0];?>"></video>
							</div>

							<div class="info-obra">
								
									<h1 class="titulo-obra">
										<a href="<?php echo get_term_link( $obra->term_id, 'obra' );?>">
											<?php echo $obra->name;?>
										</a>
									</h1>
									<span class="date">Estrenada el <?php echo prompt_format_date($fields['estreno'][0]);?></span>
									<span class="director">Dirigida por <?php echo prompt_multifields($fields['direccion'][0], ', ');?> | 
									Escrita por <?php echo prompt_multifields($fields['dramaturgia'][0], ', ');?></span>					
								</div>
								
			<!-- <ul class="accesos-obra">
				<li><a href="" title="Texto dramático"><i class="fas fa-scroll"></i> Texto dramático</a></li>
				<li><a href="" title="Proceso"><i class="fas fa-cogs"></i> Proceso</a></li>
				<li><a href="" title="Fragmentos"><i class="fas fa-cheese"></i> Fragmentos</a> </li>
				<li><a href="" title="Situaciones"><i class="fas fa-shoe-prints"></i> Situaciones</a></li>
				<li><a href="" title="Personas"><i class="fas fa-people-carry"></i> Personas</a></li>
			</ul> -->
		</div>
	</div>
	<?php 
endforeach;
endif;
?>

</div>
</div>
</section>