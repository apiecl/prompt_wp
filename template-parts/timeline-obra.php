<?php 
	global $wp_query;
	$term = 'prompt_hitos_' . prompt_obraslugjs($wp_query->query_vars['obra']);
	
?>

<section id="timeline-obra" class="timeline-section">
		<div class="row">
			<div class="col-md-12">
				<h2>Línea de tiempo</h2>
			</div>
		</div>
		<div class="row">
			<div class="col-md-12">
				<div id="timeline-embed"></div>
			</div>
		</div>
</section>
<script>
	var timeline_options = {
		language: "es"
	}
	var timeline_events = JSON.parse(<?php echo $term;?>);
</script>