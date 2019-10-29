<section id="timeline-main">
	<div class="row">
		<div class="col-md-12">
			<div id="timeline-embed"></div>
		</div>
	</div>
</section>
<script>
	var timeline_events = JSON.parse(prompt_hitos);
	window.timeline = new TL.Timeline('timeline-embed', timeline_events);	
</script>