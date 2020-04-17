jQuery(document).ready(function($) {
	console.log('init bitacora js');

	var textContainer = $('.texto-dramatico');
	var mediaid;
	var type;
	var personajes;
	var nextMedia;
	var prevMedia;
	
	

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

	$('#obras-link').on('click', function() {
		$('.obras-nav-wrapper').toggleClass('obra-0');
	});

	$('a.toggleTabs').on('click', function(e) {
		e.preventDefault();
		$('#obraTab').slideToggle();
	});

	if ($('[data-function="timeline"]').length) {
		window.timeline = new TL.Timeline('timeline-embed', timeline_events, timeline_options);
	}

	if($('[data-function="materiales-obra"]').length) {
		console.log('materiales');
		var playId = $(this).attr('data-play-id');
		var target = '#todos';
		enableAllMedia(playId, target);
	}

	$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
		if($(this).attr('data-function') == 'timeline') {
			window.timeline = new TL.Timeline('timeline-embed', timeline_events, timeline_options);
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

	$('#filterPersonajes').change(function() {
		
		if(personajes == null) {
			personajes = setPersonajes();
			console.log(personajes);
			
			for(var i = 0; i < personajes.length; i++) {
				$('.textPersonajes .col-md-12').append('<span class="typelabel personajelabel" data-filterpersonaje="' + personajes[i] + '">' + personajes[i] + '</span>');
			}
		}
		

		if(this.checked == true) {
			$('.maintext-col').removeClass('col-md-12').addClass('col-md-10');
			$('.col-personajes').removeClass('hidden');
			$('.row.textPersonajes').show();
		} else {
			$('.maintext-col').removeClass('col-md-10').addClass('col-md-12');
			$('.col-personajes').addClass('hidden');
			$('.playtext-row:hidden').show();
			$('.row.textPersonajes').hide();
		}
	});

	$('body').on('click', '.typelabel.personajelabel', function(e) {
		
		$('.playtext-row:hidden').show();

		if($(this).hasClass('active')) {
			$(this).removeClass('active');
		} else {
			var curpersonaje = $(this).attr('data-filterpersonaje');
			$('body .typelabel.personajelabel').removeClass('active');
			$(this).addClass('active');
			$('.playtext-row').not('[data-personajes~="' + curpersonaje + '"]').hide();
		}
	});

	$('body').on('click', '.media-item-wrapper', function(e) {
		mediaid = $(this).attr('data-mediaid');
		type = $(this).attr('data-type');
		$(this).addClass('activeMedia');
	})

	$('.modal-media-text').on('shown.bs.modal', function(e) {
		console.log(mediaid);

		var modal = $(this).attr('id');
		var ispage = $(this).attr('data-ispage');

		loadMediaInModal(mediaid, modal, ispage);

	});

	$('.prevMediaItem').on('click', function() {
		if(prevMedia.length) {
			console.log(prevMedia);
			mediaid = prevMedia.attr('data-mediaid');
			modal = $(this).attr('data-modal');
			ispage = $('#' + modal).attr('data-ispage');
			type = prevMedia.attr('data-type');

			$('.media-item-wrapper').removeClass('activeMedia');
			$('.media-item-wrapper[data-mediaid="' + mediaid + '"]').addClass('activeMedia');

			loadMediaInModal(mediaid, modal, ispage);
		}
	});

	$('.nextMediaItem').on('click', function() {
		if(nextMedia.length) {
			if(nextMedia.length) {
				console.log(nextMedia);
				mediaid = nextMedia.attr('data-mediaid');
				modal = $(this).attr('data-modal');
				ispage = $('#' + modal).attr('data-ispage');
				type = nextMedia.attr('data-type');

				$('.media-item-wrapper').removeClass('activeMedia');
				$('.media-item-wrapper[data-mediaid="' + mediaid + '"]').addClass('activeMedia');

				loadMediaInModal(mediaid, modal, ispage);
			}
		}
	});

	$('.modal-media-text').on('hide.bs.modal', function(e) {
		$('.media-item-wrapper').removeClass('activeMedia');
	});

	$('body').on('click', '.btn-taxfilter', function(e) {
		$('.btn-taxfilter').removeClass('active');
		$('body .terms-filter-zone').empty();

		if(!$(this).hasClass('active')) {

			$(this).addClass('active');
			$grid.isotope({
				filter: ""
			});
			
			
			var curtax = $(this).attr('data-tax');
			var availableTerms = [];
			$('.media-item-wrapper[data-' + curtax + ']').each(function(idx) {
				var parseTerms = $(this).attr('data-' + curtax);
				var arrayTerms = parseTerms.split(",");
				for(var i = 0; i < arrayTerms.length; i++) {
					arrayTerms[i] = arrayTerms[i].replace(/\s+/g, '');
					availableTerms.push(arrayTerms[i]);	
				}
			});

			availableTerms = unique(availableTerms);
			console.log(curtax, availableTerms);

			for(var i=0; i < availableTerms.length; i++) {
				var curterm = availableTerms[i];
				var curtermitem = prompt.taxinfo[curtax][curterm];

				$('body .terms-filter-zone').append('<button class="btn btn-term-filter" data-tax="' + curtax + '" data-term-filter="' + curtermitem.slug + '">' + curtermitem.name + '</button>');
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
				filter: '[data-' + curtax + '*="' + curterm + '"]'
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

	function setPersonajes() {
		var personajes = [];
		$('.text-item').each(function(idx) {
			var linePersonajes = $(this).attr('data-personajes').split(',');
			for(var i = 0; i < linePersonajes.length; i++) {
				if(linePersonajes[i].length > 0) {
					var cleanPersonaje = $.trim(linePersonajes[i]);
					personajes.push(cleanPersonaje);	
				}
			}
		});

		return unique(personajes);
	}

	function disableMedia( target ) {
		//$('#' + target).empty();
		console.log(target);
	}

	function loadMediaInModal(mediaid, modal, ispage) {
		
		nextMedia = $('.activeMedia').next('.media-item-wrapper');
		prevMedia = $('.activeMedia').prev('.media-item-wrapper');

		$.ajax({
			type: "post",
			url: prompt.ajaxurl,
			data: {
				action: "bit_ajax_get_media",
				mediaid: mediaid,
				type: type,
				ispage: ispage
			},
			error: function( response ) {
				console.log(response);
			},
			success: function( response ) {
				$( '#' + modal + ' .modal-body').empty().append(response);
				if(mediaitem !== null) {
					var itemInfo = $.parseJSON(mediaitem);
				}
			}
		})
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
				
					$('img.media-item-image').on('load', function() {
						this.style.opacity = 1;
					});

				var images = document.querySelectorAll('.media-item-image');
				lazyload(images);

				$grid = $('.mediaitems-gallery').isotope({
					itemSelector: '.media-item-wrapper',
					layoutMode: 'fitRows',
					stagger: 30
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
					itemSelector: '.media-item-wrappr',
					layoutMode: 'fitRows',
					stagger: 30
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