<section id="timeline-main" class="timeline-section">
	<div class="container-fluid">
		<div class="row">
			<div class="col-md-12">
				<div id="timeline-embed"></div>
			</div>
		</div>
	</div>
</section>
<script>
	var timeline_options = {
		language: "es",
		initial_zoom: 5,
		timenav_height_min: 60,
		timenav_mobile_height_percentage: 35,
		script_path: "<?php echo get_template_directory_uri() . '/js/';?>"
	}
	var timeline_events = JSON.parse(prompt_hitos);
	window.timeline = new TL.Timeline('timeline-embed', timeline_events, timeline_options);	
</script>