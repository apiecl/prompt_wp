jQuery(document).ready(function($) {
	console.log('init bitacora js');

	var textContainer = $('.texto-dramatico');
	var $grid = $('body .bit-gallery').masonry();

	$('.trigger-media').on('click', function(event) {
		event.preventDefault();
		var el = $(this);
		var target = el.attr('data-expand');
		var targetel = $(target);
		if(targetel.hasClass('active')) {
			targetel.slideUp();
			$(this).removeClass('active');
			targetel.removeClass('active').empty();
			disableMedia(targetel);
		} else {
			$('.media-zone.active').removeClass('active').hide();
			$('.trigger-media').removeClass('active');
			targetel.slideDown();
			targetel.addClass('active');
			$(this).addClass('active');
			enableMedia($(this).attr('data-assoc'), $(this).attr('data-plain-id'));
		}
	});

	$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
		if($(this).attr('data-function') == 'timeline') {
			window.timeline = new TL.Timeline('timeline-embed', timeline_events, timeline_options);
		} else if($(this).attr('data-function') == 'materiales') {
			//activate first tab on materiales
			var playId = $('#materialesTabs li a.active').attr('data-play-id');
			var tabAction = $('#materialesTabs li a.active').attr('data-getType');
			var target = $('#materialesTabs li a.active').attr('href');

			getMedia(playId, tabAction, target);

		} else if($(this).attr('data-function') == 'getMedia') {
			//activate render contents
			var playId = $(this).attr('data-play-id');
			var tabAction = $(this).attr('data-getType');
			var target = $(this).attr('href');

			getMedia(playId, tabAction, target);
			$grid.masonry('layout');
		}
	});

	$('#enableType').change(function() {
		var textLegend = $('.textlegend');
		animateCSS('.textlegend', 'fadeIn');
		if(this.checked == true) {
			textContainer.addClass('withTypes');
			textLegend.addClass('active');
		} else {
			textContainer.removeClass('withTypes');
			textLegend.removeClass('active');
			
		}
	});

	$('#onlyMedia').change(function() {
		if(this.checked == true) {
			textContainer.addClass('onlyMedia');
		} else {
			textContainer.removeClass('onlyMedia');
		}
	});

	// $grid.imagesLoaded().progress(function() {
	// 	$grid.masonry('layout');
	// });

	function disableMedia( target ) {
		console.log(target);
	}

	function enableMedia( media, target ) {
		var carouselID = '#mediacarousel-' + target;
		console.log(carouselID);
		$.ajax({
			type: "post",
			url: prompt.ajaxurl,
			data: {
				action: "bit_render_mediazone",
				params: media,
				id: target
			},
			error: function( response ) {
				console.log(response);
			},
			success:function(response) {
				console.log(response);
				$('#' + target).append(response);
				var slider = tns({
					container: carouselID,
					items: 1,
					nav: true,
					navPosition: 'bottom',
					controlsText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>' ],
					center: true
				});
			}
		});
	}

	function getMedia( playid, type, target ) {
		console.log(type);
		if(!$(target).hasClass('contentloaded')) {
			$.ajax({
				type: "post",
				url: prompt.ajaxurl,
				data: {
					action: 'bit_get_media',
					playid: playid,
					getType: type
				},
				error: function( response ) {
					console.log(response);
				},
				success: function( response ) {
					$(target).append(response);
					$(target).addClass('contentloaded');
					if(type == 'gallery' || type == 'bocetos') {
							var $grid = $('body .bit-gallery').masonry();
							$grid.imagesLoaded().progress(function() {
							$grid.masonry('layout');
							});
					}
				}
			});
		}
	}

	function animateCSS(element, animationName, callback) {
		const node = document.querySelector(element)
		node.classList.add('animated', animationName)

		function handleAnimationEnd() {
			node.classList.remove('animated', animationName)
			node.removeEventListener('animationend', handleAnimationEnd)

			if (typeof callback === 'function') callback()
		}

	node.addEventListener('animationend', handleAnimationEnd)
}

});