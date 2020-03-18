jQuery(document).ready(function($) {
	console.log('init bitacora js');

	var textContainer = $('.texto-dramatico');
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

	$('body').on('click', '.btn-taxfilter', function(e) {
		$('.btn-taxfilter').removeClass('active');
		$('body .terms-filter-zone').empty();

		if(!$(this).hasClass('active')) {

			$(this).addClass('active');
			$grid.isotope({
				filter: ""
			});
			
			console.log('show taxfilter');
			var curtax = $(this).attr('data-tax');
			var availableTerms = [];
			$('.media-item[data-' + curtax + ']').each(function(idx) {
				var parseTerms = $(this).attr('data-' + curtax);
				var arrayTerms = parseTerms.split(",");
				for(var i = 0; i < arrayTerms.length; i++) {
					availableTerms.push(arrayTerms[i]);	
				}
			});

			availableTerms = unique(availableTerms);
			console.log(availableTerms);

			for(var i=0; i < availableTerms.length; i++) {
				console.log(availableTerms[i]);
				var curterms = prompt.taxinfo[curtax][availableTerms[i]];
				$('body .terms-filter-zone').append('<button class="btn btn-term-filter" data-tax="' + curtax + '" data-term-filter="' + curterms.slug + '">' + curterms.name + '</button>');
			};
		}
		
	});

	$('body').on('click', '.btn-term-filter', function(e) {
		$('body .btn-term-filter').removeClass('active');
		//console.log('click filter');
		if($(this).hasClass('active')) {
			
			$(this).removeClass('active');
			$grid.isotope({
				filter: ''
			});	

		} else {

			$('body .btn-term-filter').removeClass('active');

			var curtax = $(this).attr('data-tax');
			var curterm = $(this).attr('data-term-filter');
			console.log(curtax, curterm);
			$grid.isotope({
				filter: '[data-' + curtax + '="' + curterm + '"]'
			});
			$(this).addClass('active');
			
		}
		
	});

	$('body').on('click', '.btn-materialtype', function(e) {
		console.log('im clicking');
		if($(this).hasClass('active')) {

			$grid.isotope({
				filter: ''
			});

			$(this).removeClass('active');

		} else {
			
			console.log($grid);

			var type = $(this).attr('data-type');
			$grid.isotope({
				filter: '[data-type="' + type + '"]'
			});
			$(this).addClass('active');
			$('body .btn-materialtype').removeClass('active');

		}
	});

	$('body').on('change', '.showfilter input', function(e) {

		var target = $('.' + $(this).attr('data-target'));
		var other = $('.showfilter input').not($(this));
		var othertarget = $('.' + other.attr('data-target'));

		$grid.isotope({
				filter: ''
			});


		if($(this).prop('checked') == true) {
			target.removeClass('hidden');
			other.prop('checked', false);
			othertarget.addClass('hidden');
		} else {
			target.addClass('hidden');
		}
		

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
				$grid = $('.mediaitems-gallery').isotope({
					itemSelector: '.media-item',
					layoutMode: 'fitRows'
				});
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
				$grid = $('.mediaitems-gallery').isotope({
					itemSelector: '.media-item',
					layoutMode: 'fitRows'
				});
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

function unique(array){
	return array.filter(function(el, index, arr) {
		return index == arr.indexOf(el);
	});
}

});