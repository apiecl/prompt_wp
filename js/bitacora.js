jQuery(document).ready(function($) {
	console.log('init bitacora js');

	var textContainer = $('.texto-dramatico');
	var $grid = $('body .bit-gallery').masonry();
	var mediaid = null;
	var type = null;

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
			var playId = $(this).attr('data-play-id');
			var target = '#todos';

			enableAllMedia(playId, target);

		} else if($(this).attr('data-function') == 'getMedia') {
			//activate render contents
			var playId = $(this).attr('data-play-id');
			var tabAction = $(this).attr('data-getType');
			var target = $(this).attr('href');

			getMedia(playId, tabAction, target);
			$grid.masonry('layout');
		} else if($(this).attr('data-function') == 'enableAllMedia') {

			var playId = $(this).attr('data-play-id');
			var target = $(this).attr('href');

			enableAllMedia(playId, target);
		} else if($(this).attr('data-function') == 'materialesTeatro') {
			var pageId = $(this).attr('data-page-id');
			var target = $(this).attr('data-contentTarget');
			enableMediaPage(pageId, target);
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

	$('body').on('click', '.media-item', function(e) {
		mediaid = $(this).attr('data-mediaid');
		type = $(this).attr('data-type');
	})

	$('.modal-media-text').on('shown.bs.modal', function(e) {
		console.log(mediaid);
		var thisModal = $(this).attr('id');
		$.ajax({
			type: "post",
			url: prompt.ajaxurl,
			data: {
				action: "bit_ajax_get_media",
				mediaid: mediaid,
				type: type,
				ispage: $(this).attr('data-ispage')
			},
			error: function( response ) {
				console.log(response);
			},
			success: function( response ) {
				$( '#' + thisModal + ' .modal-body').empty().append(response);
				if(mediaitem !== null) {
					var itemInfo = $.parseJSON(mediaitem);
					console.log(itemInfo);
					$( '#' + thisModal + " .modal-header .modal-title").empty().append(itemInfo.post_title);
					}
			}
		})
	});

	// $grid.imagesLoaded().progress(function() {
	// 	$grid.masonry('layout');
	// });

	function disableMedia( target ) {
		//$('#' + target).empty();
		console.log(target);
	}

	function enableMedia( mediaids, targetid ) {
		$.ajax({
			type: "post",
			url: prompt.ajaxurl,
			data: {
				action: "bit_get_mediazone",
				params: mediaids,
				id: targetid
			},
			error: function( response ) {
				console.log(response);
			},
			success:function(response) {
				console.log(targetid);
				$('#' + targetid).empty().append(response);
			}
		});
	}

	function enableAllMedia( playid, target ) {
		$.ajax({
			type: "post",
			url: prompt.ajaxurl,
			data: {
				action: "bit_get_all_mediazone",
				playid: playid,
				all: true
			},
			error: function( response ) {
				console.log('error', response);
			},
			success:function(response) {
				console.log(target);
				$(target).empty().append(response);
			}
		});
	}

	function enableMediaPage( pageid, target) {
		console.log('calling media page');
		$.ajax({
			type: "post",
			url: prompt.ajaxurl,
			data: {
				action: "bit_get_mediapage",
				pageid: pageid
			},
			error: function( response ) {
				console.log( 'error', response);
			},
			success: function( response ) {
				$(target).empty().append(response);
			}
		});
	}

	function getMedia( playid, type, target ) {
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