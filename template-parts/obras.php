<?php
	$obras = get_terms( array(
						'taxonomy' => 'obra',
						'hide_empty' => false
					));

if($obras):
	foreach($obras as $obra):
		$fields = prompt_obra_metadata($obra->term_id);
	?>

		<div class="obra obra-item" id="<?php echo $obra->slug;?>">
			<div class="imagen-obra">
				<video autoplay="true" loop="true" src="<?php echo $fields['video'][0];?>"></video>
			</div>

			<div class="info-obra">
				<h1 class="titulo-obra"><?php echo $obra->name;?></h1>	
				<span class="date">Estrenada el <?php echo $fields['estreno'][0];?></span>
				<span class="director">Dirigida por <?php echo prompt_multifields(['direccion'][0], ', ');?></span>
			</div>
			
			<ul class="accesos-obra">
				<li><a href="" title="Texto dramático"><i class="fas fa-scroll"></i> Texto dramático</a></li>
				<li><a href="" title="Proceso"><i class="fas fa-cogs"></i> Proceso</a></li>
				<li><a href="" title="Fragmentos"><i class="fas fa-cheese"></i> Fragmentos</a> </li>
				<li><a href="" title="Situaciones"><i class="fas fa-shoe-prints"></i> Situaciones</a></li>
				<li><a href="" title="Personas"><i class="fas fa-people-carry"></i> Personas</a></li>
			</ul>
		</div>

	<?php 
	endforeach;
endif;
?>