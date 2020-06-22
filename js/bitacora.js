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
	

	$('#landing-overlay .content-top').on('click', function() {
		$('#landing-overlay').fadeOut();
	});

	// var totalHeight = $('body').innerHeight();
	// var navBarHeight = $('#site-navigation').innerHeight();
	// var footerHeight = $('.site-footer').innerHeight();
	// var mobileTotalHeight = totalHeight - navBarHeight - footerHeight;
	// console.log(navBarHeight, totalHeight);
	// $('#landing-overlay').css({height: mobileTotalHeight});
	// $('#landing-overlay .content-top').css({height: mobileTotalHeight});

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


	$('body').on('click', '.media-item-wrapper', function(e) {
		mediaid = $(this).attr('data-mediaid');
		type = $(this).attr('data-type');
		
		if($('body').hasClass('texto-dramatico')) {
			$('.media-item-wrapper').removeClass('activeMedia');
			loadMediaInContainer($(this).attr('data-mediaid'), 'content-current-material', type, false);
		}

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