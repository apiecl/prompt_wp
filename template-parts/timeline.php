<section id="timeline-main" class="timeline-section with-home-section-divider">
	<div class="container-fluid">
		<div class="row">
			<h2 class="section-title">Línea de tiempo Teatro UC</h2>
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
	var timeline_events = JSON.parse(prompt_hitos);
	window.timeline = new TL.Timeline('timeline-embed', timeline_events, timeline_options);	
</script>