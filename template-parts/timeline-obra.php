<?php 
	global $wp_query;
	$term = 'prompt_hitos_' . prompt_obraslugjs($wp_query->query_vars['obra']);
	
?>

<section id="timeline-obra" class="timeline-section" data-function="timeline">
		<div class="row">
			<div class="col-md-12">
				<div id="timeline-embed">
					<?php get_template_part('template-parts/loading');?>
				</div>
			</div>
		</div>
</section>
<script>
	var timeline_options = {
		language: "es"
	}
	var timeline_events = JSON.parse(<?php echo $term;?>);
</script>