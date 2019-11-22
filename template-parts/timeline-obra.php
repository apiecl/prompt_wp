<?php 
	global $wp_query;
	$term = 'prompt_hitos_' . prompt_obraslugjs($wp_query->query_vars['obra']);
	
?>

<section id="timeline-obra">
	<div class="container">
		<div class="row">
			<h2>Línea de tiempo</h2>
		</div>
		<div class="row">
			<div class="col-md-12">
				<div id="timeline-embed"></div>
			</div>
		</div>
	</div>
</section>
<script>
	var timeline_options = {
		language: "es"
	}
	var timeline_events = JSON.parse(<?php echo $term;?>);
	window.timeline = new TL.Timeline('timeline-embed', timeline_events, timeline_options);	
</script>