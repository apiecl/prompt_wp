jQuery(document).ready(function($) {
	console.log('init bitacora js');

	var textContainer = $('.texto-dramatico');
	var mediaid;
	var type;
	var personajes;
	var nextMedia;
	var prevMedia;
	var didScroll;
	var lastScrollTop = 0;
	var delta = 5;
	var navBarHeight = $('.site-header').outerHeight();
	var curscene;
	var curtax;
	var curterm;
	var curtype;
	var taxfilter ='';
	var typefilter = '';
	

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

	$('#landing-overlay .content-top').on('click', function() {
		$('#landing-overlay').fadeOut();
	});

	if($('.texto-dramatico').length) {
		var escenaLabel = $('.escenalabel');
		var firstLine = $('.playtext-row').first().attr('data-escena');
		
		escenaLabel.empty().append(firstLine);
		
		$(function(){
			$(window).scroll(function(){    	
				var scrollTop = $(document).scrollTop() + ($(window).height() / 2);
				var positions = [];

				$('.playtext-row').each(function(){
	        	  //console.log($(this).position().top);
	        	  //$(this).removeClass("active");
	        	  positions.push({position:$(this).position().top, element: $(this)});
	        	});

				var getClosest = closest(positions,scrollTop);
				var dataEscena = getClosest.attr('data-escena');
				if(dataEscena.length) {
					escenaLabel.empty().append(dataEscena);	
				}
				//console.log(getClosest.attr('data-escena'));
				//getClosest.addClass("active");
			});

			function closest(array, number) {
				var num = 0;
				for (var i = array.length - 1; i >= 0; i--) {
					if(Math.abs(number - array[i].position) < Math.abs(number - array[num].position)){
						num = i;
					}
				}
				return array[num].element;
			}

		});

	}

	$('body').on('change','#selectScene', function(e) {
		var selected = $('option:selected', this).attr('value');
		document.querySelector(selected).scrollIntoView({
			behavior: 'smooth'
		});
	});

	$(window).scroll(function(event) {
		didScroll = true;
	});

	setInterval(function() {
		if(didScroll) {
			hasScrolled();
			didScroll = false;
		}
	});

	function hasScrolled() {
		var st = $(this).scrollTop();

		if(Math.abs(lastScrollTop-st) <= delta)
			return;

		if(st > lastScrollTop && st > navBarHeight) {
			$('.site-header').removeClass('nav-down').addClass('nav-up');
			$('.main-navigation').addClass('affix');
			$('.escena-nav').addClass('scrolled');
		} else {
			if(st + $(window).height() < $(document).height()) {
				$('.site-header').removeClass('nav-up').addClass('nav-down');
				$('.main-navigation').removeClass('affix');
				$('.escena-nav').removeClass('scrolled');
			}
		}
		lastScrollTop = st;
	}

	//$('.teatro-item-presentation, .obra-item-presentation').hide();

	$('.collapse-menu-home').on('click', function() {
		$( $(this).attr('data-target') ).addClass('collapsed');
		//$('.obra-item-presentation').fadeIn();
	});


	$('.menu-toggle').on('click', function() {
		var nav = $('.main-navigation')
		nav.toggleClass('active');
		$('.brand-header').toggleClass('active');
		if(nav.hasClass('active')) {
			$(this).empty().html('<i class="fas fa-times"></i>');
		} else {
			$(this).empty().html('<i class="fas fa-bars"></i>');	
		}
		
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

	if($('#obraTab[data-function="materiales-teatro"]').length) {
		console.log('mediapageTeatro')
		var func = $('#obraTab[data-function="materiales-teatro"]');
		var pageId = func.attr('data-page-id');
		var target = func.attr('data-target');
		enableMediaPage(pageId, target);
	}

	if($('#obraTab[data-function="timeline-teatro"]').length) {
		var func = $('#obraTab[data-function="timeline-teatro"]');
		var pageId = func.attr('data-page-id');
		var target = func.attr('data-target');
		if(timeline_events) {
			window.timeline = new TL.Timeline(target, timeline_events, timeline_options);
		}
	}

	// $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
	// 	if($(this).attr('data-function') == 'timeline') {
	// 		window.timeline = new TL.Timeline('timeline-embed', timeline_events, timeline_options);
	// 	} else if($(this).attr('data-function') == 'materialesTeatro') {
	// 		var pageId = $(this).attr('data-page-id');
	// 		var target = $(this).attr('data-contentTarget');
	// 		enableMediaPage(pageId, target);
	// 	}
	// });

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

		// if(this.checked == true) {
		// 	$('.maintext-col').removeClass('col-md-12').addClass('col-md-10');
		// 	$('.col-personajes').removeClass('hidden');
		// 	$('.row.textPersonajes').show();
		// } else {
		// 	$('.maintext-col').removeClass('col-md-10').addClass('col-md-12');
		// 	$('.col-personajes').addClass('hidden');
		// 	$('.playtext-row:hidden').show();
		// 	$('.row.textPersonajes').hide();
		// }
	});

	if($('.texto-dramatico').length) {
		var parlamentos = setPersonajes('data-parlamento');
		console.log(parlamentos);
		personajes = setPersonajes('data-personajes');
		//console.log(personajes);

		for(var i = 0; i < personajes.length; i++) {
			$('.textPersonajes .col-md-12').append('<span class="typelabel personajelabel" data-filterpersonaje="' + personajes[i] + '">' + personajes[i] + '</span>');
		}

		for(var i = 0; i < parlamentos.length; i++) {
			$('.textParlamentos .col-md-12').append('<span class="typelabel parlamentolabel" data-filterparlamento="' + parlamentos[i] + '">' + parlamentos[i] + '</span>')
		}
	}
	

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

		var navMedia = loadMediaInModal(mediaid, modal, ispage, type);
		nextMedia = navMedia[0];
		prevMedia = navMedia[1];

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

			var navMedia = loadMediaInModal(mediaid, modal, ispage, type);
			nextMedia = navMedia[0];
			prevMedia = navMedia[1];
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

				var navMedia = loadMediaInModal(mediaid, modal, ispage, type);
				nextMedia = navMedia[0];
				prevMedia = navMedia[1];
			}
		}
	});

	$('.modal-media-text').on('hide.bs.modal', function(e) {
		$('.media-item-wrapper').removeClass('activeMedia');
	});

	$('body').on('click', '.btn-taxfilter', function(e) {
		
		$('body .terms-filter-zone').empty();

		if(!$(this).hasClass('active')) {
			//Si no está activo resetea el filtro y construye el dropdown
			curtax = $(this).attr('data-tax');

			$('.btn-taxfilter').removeClass('selected');

			$('.btn-taxfilter[data-tax="' + curtax +'"]').addClass('selected');

			var target = $('body .terms-filter-zone[data-for=' + curtax + ']');

			$('.btn-taxfilter').removeClass('active');
			$(this).addClass('active');
			
			curfilter = '';

			$grid.isotope({
				filter: curfilter
			});

			showCurrentFilterInfo(curtax, curterm, curtype, iso.filteredItems.length);
			
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
			

			for(var i=0; i < availableTerms.length; i++) {
				curterm = availableTerms[i];
				var curtermitem = prompt.taxinfo[curtax][curterm];

				target.append('<a href="#" class="dropdown-item dropdown-filter" data-tax="' + curtax + '" data-term-filter="' + curtermitem.slug + '">' + curtermitem.name + '</a>');
			};
		} else {
			$('.btn-taxfilter').removeClass('active');
			target.empty();
		}
		
	});

	$('body').on('click', '.dropdown-filter', function(e) {
		$('body .btn-term-filter').removeClass('active');
		e.preventDefault();
		
		$('body .btn-taxfilter').removeClass('active');
		$('body .terms-filter-zone').empty();

		if($(this).hasClass('active')) {
			
			curfilter = ''

			$(this).removeClass('active');
			$grid.isotope({
				filter: curfilter
			});


			showCurrentFilterInfo(curtax, curterm, curtype, iso.filteredItems.length);

		} else {

			$('body .dropdown-filter').removeClass('active');

			curtax = $(this).attr('data-tax');
			curterm = $(this).attr('data-term-filter');
			var curtermitem = prompt.taxinfo[curtax][curterm]
			taxfilter = '[data-' + curtax + '*="' + curterm + '"]';

			$grid.isotope({
				filter: taxfilter + typefilter
			});
			$(this).addClass('active');

			showCurrentFilterInfo(curtax, curterm, curtype, iso.filteredItems.length);
		}
		
	});

	$('body').on('click', '.btn-materialtype', function(e) {
		
		if($(this).hasClass('active')) {

			curfilter = '';
			curtype = '';

			$grid.isotope({
				filter: curfilter
			});


			$(this).removeClass('active');

			showCurrentFilterInfo(curtax, curterm, curtype, iso.filteredItems.length);


		} else {
			

			curtype = $(this).attr('data-type');
			typefilter = '[data-type="' + curtype + '"]';


			$grid.isotope({
				filter: taxfilter + typefilter
			});

			$('body .btn-materialtype').removeClass('active');
			$(this).addClass('active');
			
			
			
			showCurrentFilterInfo(curtax, curterm, curtype, iso.filteredItems.length);
			

		}
	});

	$('body').on('change', '.showfilter input', function(e) {

		var target = $('.' + $(this).attr('data-target'));
		var other = $('.showfilter input').not($(this));
		var othertarget = $('.' + other.attr('data-target'));

		$grid.isotope({
			filter: ''
		});

		showCurrentFilterInfo(curtax, curterm, curtype, iso.filteredItems.length);


		if($(this).prop('checked') == true) {
			target.removeClass('hidden');
			other.prop('checked', false);
			othertarget.addClass('hidden');
		} else {
			target.addClass('hidden');
		}
		

	});

});