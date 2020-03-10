	<?php 
		$fotos = bit_get_mediatype($term->term_id, 'fotografia');
		$videos = bit_get_mediatype($term->term_id, 'video');
		$documentos = bit_get_mediatype($term->term_id, 'documento');
		$audios = bit_get_mediatype($term->term_id, 'audio');
		$bocetos = bit_get_mediatype($term->term_id, 'boceto-3d');
		$papelerias = bit_get_mediatype($term->term_id, 'papeleria');
	?>
	
	<h3 class="standard-title">Fotografías</h3>

	<div class="bit-gallery">
		<?php foreach($fotos as $foto):?>
			
			<div class="image-wrap">
				<?php echo bit_get_image($foto);?>
			</div>
		<?php endforeach;?>
	</div>

	<h3 class="standard-title">Videos</h3>

	<div class="bit-videogallery">
		<ul class="videonav">
		<?php foreach($videos as $video):
			$video_obj = bit_get_video($video);?>
			<li><?php echo $video_obj->post_title;?></li>
		<?php endforeach;?>
		</ul>
		
		<div class="videoplay">
			<!-- load video on action-->
		</div>

	</div>

	<h3 class="standard-title">
		Documentos
	</h3>

	<ul class="docs">
		<?php foreach($documentos as $documento):?>
			<li><?php echo bit_get_documento($documento);?></li>
		<?php endforeach;?>
	</ul>

	<h3 class="standard-title">Audio</h3>

	<?php foreach($audios as $audio):?>
		<div class="audio-item">
			<?php echo bit_get_audio($audio);?>
		</div>
	<?php endforeach;?>

	<h3 class="standard-title">Bocetos</h3>

	<?php foreach($bocetos as $boceto):?>
		<?php echo bit_get_image($boceto);?>
	<?php endforeach;?>

	<h3 class="standard-title">Papeleria</h3>
	<?php foreach($papelerias as $papeleria):?>
		<?php echo bit_get_documento($papeleria);?>
	<?php endforeach;?>