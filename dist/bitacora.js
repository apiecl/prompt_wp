/* * 
 * audio visualizer with html5 audio element
 *
 * v0.1.0
 * 
 * licenced under the MIT license
 * 
 * see my related repos:
 * - HTML5_Audio_Visualizer https://github.com/wayou/HTML5_Audio_Visualizer
 * - 3D_Audio_Spectrum_VIsualizer https://github.com/wayou/3D_Audio_Spectrum_VIsualizer
 * - selected https://github.com/wayou/selected
 * - MeowmeowPlayer https://github.com/wayou/MeowmeowPlayer
 * 
 * reference: http://www.patrick-wied.at/blog/how-to-create-audio-visualizations-with-javascript-html
 */

window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

var audioVisStart = function(audio, colors) {
    var ctx = new AudioContext();
    var analyser = ctx.createAnalyser();
    var audioSrc = ctx.createMediaElementSource(audio);
    // we have to connect the MediaElementSource with the analyser 
    audioSrc.connect(analyser);
    analyser.connect(ctx.destination);
    // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
    // analyser.fftSize = 64;
    // frequencyBinCount tells you how many values you'll receive from the analyser
    var frequencyData = new Uint8Array(analyser.frequencyBinCount);

    // we're ready to receive some data!
    var canvas = document.getElementById('audio-vis-canvas'),
        cwidth = canvas.width,
        cheight = canvas.height - 2,
        meterWidth = 10, //width of the meters in the spectrum
        gap = 2, //gap between meters
        capHeight = 2,
        capStyle = '#fff',
        meterNum = 800 / (10 + 2), //count of the meters
        capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
    ctx = canvas.getContext('2d'),
    gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(1, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(0, colors[2]);
    // loop
    function renderFrame() {
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var step = Math.round(array.length / meterNum); //sample limited data from the total array
        ctx.clearRect(0, 0, cwidth, cheight);
        for (var i = 0; i < meterNum; i++) {
            var value = array[i * step];
            if (capYPositionArray.length < Math.round(meterNum)) {
                capYPositionArray.push(value);
            };
            ctx.fillStyle = capStyle;
            //draw the cap, with transition effect
            if (value < capYPositionArray[i]) {
                ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
            } else {
                ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
                capYPositionArray[i] = value;
            };
            ctx.fillStyle = gradient; //set the filllStyle to gradient for a better look
            ctx.fillRect(i * 12 /*meterWidth+gap*/ , cheight - value + capHeight, meterWidth, cheight); //the meter
        }
        requestAnimationFrame(renderFrame);
    }
    renderFrame();
    // audio.play();
};

function setPersonajes(dataAttr) {
	var personajes = [];
	jQuery('.text-item').each(function(idx) {
		var linePersonajes = jQuery(this).attr(dataAttr).split(',');
		for(var i = 0; i < linePersonajes.length; i++) {
			if(linePersonajes[i].length > 0) {
				var cleanPersonaje = jQuery.trim(linePersonajes[i]);
				personajes.push(cleanPersonaje);	
			}
		}
	});

	return unique(personajes);
}

function disableMedia( target ) {
		//jQuery('#' + target).empty();
		console.log(target);
	}

	function loadMediaInModal(wpid, modal, ispage, type) {
		
		var nextMedia = jQuery('.activeMedia').next('.media-item-wrapper.filtered');
		var prevMedia = jQuery('.activeMedia').prev('.media-item-wrapper.filtered');
		var modalBody = jQuery( '#' + modal + ' .modal-body');

		modalBody.append('<div class="loadingZone"><i class="fas fa-spin fa-slash fa-2x"></i> Cargando</div>');

		jQuery.ajax({
			type: "post",
			url: prompt.ajaxurl,
			data: {
				action: "bit_ajax_get_media",
				wpid: wpid,
				type: type,
				ispage: ispage
			},
			error: function( response ) {
				console.log(response);
			},
			success: function( response ) {
				modalBody.empty().append(response);
				if(mediaitem !== null) {
					if(type == 'audio') {
						jQuery('audio').on('play', function(){
							console.log('start');
							var audio = this;
							audioVisStart(this, ['#006CFF', '#006CFF', '#006CFF']);
						});

					}
					var itemInfo = jQuery.parseJSON(mediaitem);
				}
			}
		});

		return [nextMedia, prevMedia];
	}

	function loadMediaInContainer(wpid, container, type, ispage) {
		
		var nextMedia = jQuery('.activeMedia').next('.media-item-wrapper');
		var prevMedia = jQuery('.activeMedia').prev('.media-item-wrapper');
		var container = jQuery( '#' + container);
		jQuery('img, video', container).attr('src', '');
		container.empty().append('<div class="loadingZone"><i class="fas fa-spin fa-slash fa-2x"></i> Cargando</div>');

		const headers = new Headers({
			'Content-Type': 'application/json',
            'X-WP-Nonce': prompt.nonce
		});

		var restUrl = prompt.resturl + wpid;

		fetch(restUrl, {
			method: 'get',
			headers: headers,
			credentials: 'same-origin'
		})
		.then(function( response ) {
			return response.json();
		})
		.then(function( json ) {
			console.log(json);
			renderMediaResponse(json, container);
			if(type == 'audio') {
				jQuery('audio').on('play', function(){
							console.log('start');
							var audio = this;
							audioVisStart(this, ['#006CFF', '#006CFF', '#006CFF']);
						});
			}
		});

		// jQuery.ajax({
		// 	type: "post",
		// 	url: prompt.ajaxurl,
		// 	dataType: 'json',
		// 	data: {
		// 		action: "bit_ajax_get_media_in_text",
		// 		wpid: wpid,
		// 		type: type,
		// 		ispage: ispage
		// 	},
		// 	error: function( response ) {
		// 		console.log(response);
		// 	},
		// 	success: function( data ) {
		// 		console.log(data);
		// 		renderMediaResponse(data, container);
		// 	}
		// });

		return [nextMedia, prevMedia];
	}

	function renderMediaResponse(data, container) {
		var html = '';

		html += '<div class="row" id="singlemedia-' + data.id + '">';
		html += '<div class="col-md-8 media-container-left">';

		if(data.type == 'image') {
			html += '<img src="' + data.mediaurl + '" alt="' + data.title + '" />';
		}
		else if(data.type == 'video') {
			//html += '<div class="wp-video"><video class="wp-video-shortcode" data-src="' + data.mediaurl + '"></video></div>';
			html += data.embedcode;
		}
		else if(data.type == 'pdf') {
			html += '<a class="documento-download" href="' + data.mediaurl + '"><i class="fas fa-download"></i> Descargar documento (.pdf)</a>';
		}
		else if(data.type == 'audio') {
			//html += '<audio data-src="' + data.mediaurl +'"></audio>';
			html += data.embedcode;
		}

		html += '</div><!-- media-container-left -->';
		html += '<div class="col-md-4 info-container-right">';
		html += '<h1 class="modal-title">' + data.title + '</h1>';
		html += '<div class="mediainfotable">';

		if(data.fecha.length > 0) {
			html += '<div class="mediainforow fecha">' + data.fecha + '</div>';
		}

		if(data.content.length > 0) {
			html += '<div class="mediainforow content">' + data.content + '</div>';
		}

		if(data.fuente.length > 0) {
			html += '<div class="mediainforow fuente"><span class="label">Fuente: </span> ' + data.fuente + '</div>';
		}


		if(data.taxinfo !== undefined) {
			html += '<div class="item-taxinfo">';

			for(tax in data.taxinfo) {
				html += '<div class="terminfo">';
				html += '<span class="taxlabel">' + data.taxinfo[tax].label + ':</span>';

				for(var j = 0; j < data.taxinfo[tax].terms.length; j++) {

					html += '<span class="termlabel">' + data.taxinfo[tax].terms[j].name + '</span>';
				}

				html += '</div>';

			}

			html += '</div> <!-- item-taxinfo -->';
		}


		html += '</div><!-- mediainfotable -->';
		html += '</div><!-- info-container-right -->';
		html += '</div><!-- row -->';

		container.empty().append(html);

	}

	function enableMedia( mediaids, targetid ) {
		console.log('BIT Function: enableMedia');
		var format = 'default';

		if(targetid == 'modal-media-text-lista-materiales') {
			format = 'intext';
		}

		jQuery.ajax({
			type: "post",
			url: prompt.ajaxurl,
			data: {
				action: "bit_get_mediazone",
				params: mediaids,
				id: targetid,
				format: format
			},
			error: function( response ) {
				console.log(response);
			},
			success:function(response) {
				console.log(targetid);
				jQuery('#' + targetid + ' .list-materials').empty().append(response);

				jQuery('img.media-item-image').on('load', function() {
					this.style.opacity = 1;
				});
				
				var images = document.querySelectorAll('.media-item-image');
				lazyload(images);
				jQuery('body .media-item-wrapper:first').click();

			}
		});
	}

	function enableAllMedia( playid, target ) {
		console.log(playid);
		jQuery.ajax({
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
				jQuery(target).empty().append(response);
				
				jQuery('img.media-item-image').on('load', function() {
					this.style.opacity = 1;
				});

				var images = document.querySelectorAll('.media-item-image');
				lazyload(images);

				$grid = jQuery('.mediaitems-gallery').isotope({
					itemSelector: '.media-item-wrapper',
					layoutMode: 'fitRows',
					transitionDuration: 100
				});

				$grid.on('arrangeComplete', function( event, filteredItems) {
					console.log('arrangecomplete');
					jQuery('.filtered').removeClass('filtered');
					var items = $grid.isotope('getFilteredItemElements');
					console.log(items.length);
					jQuery(items).addClass('filtered');
				});

				iso = $grid.data('isotope');

				showCurrentFilterInfo(undefined, undefined, undefined, iso.filteredItems.length);
			}
		});
	}

	function enableMediaPage( pageid, target) {
		console.log('calling media page', pageid);
		jQuery.ajax({
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
				jQuery('#' + target).empty().append(response);

				jQuery('img.media-item-image').on('load', function() {
					this.style.opacity = 1;
				});

				var images = document.querySelectorAll('.media-item-image');
				lazyload(images);

				$grid = jQuery('.mediaitems-gallery').isotope({
					itemSelector: '.media-item-wrapper',
					layoutMode: 'fitRows',
					stagger: 30
				});

				iso = $grid.data('isotope');
				showCurrentFilterInfo(undefined, undefined, undefined, iso.filteredItems.length);
			}
		});
	}

	function getMedia( playid, type, target ) {
		if(!jQuery(target).hasClass('contentloaded')) {
			jQuery.ajax({
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
					jQuery(target).append(response);
					jQuery(target).addClass('contentloaded');
				}
			});
		}
	}

	function showCurrentFilterInfo(tax, term, type, itemNumber) {
		console.log(tax, term, type);
		var filterInfo = jQuery('.currentfilterinfo');
		jQuery('.btn.clearfilters').hide();
		if(tax !== undefined && term !== undefined) {
			var taxlabel = prompt.taxlabels[tax];
			var termlabel = prompt.taxinfo[tax][term];

			if(termlabel !== undefined) {
				if(type !== undefined) {
					filterInfo.empty().append('<p><strong>' + itemNumber + ' items.</strong> En ' + taxlabel + ' <i class="fas fa-caret-right"></i> ' + termlabel.name + '. Tipo: ' + type + '</p>');		
				} else {
					filterInfo.empty().append('<p><strong>' + itemNumber + ' items.</strong> En ' + taxlabel + ' <i class="fas fa-caret-right"></i> ' + termlabel.name + '</p>');	
				}
				
			}
			jQuery('.btn.clearfilters').show();
			
		} else if( type !== undefined) {

			filterInfo.empty().append('<p><strong>' + itemNumber + ' items.</strong>  Tipo: ' + type +'</p>');
			jQuery('.btn.clearfilters').show();

		} else {
			
			filterInfo.empty().append('<p><strong>' + itemNumber + ' items.</strong> </p>');

		}
		// var taxlabel = prompt.taxlabels[curtax];
		// var termlabel = prompt.taxinfo[curtax][curterm][name];
		
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

function trunc(text, max) {
	return text.substr(0, max -1) + (text.length > max ? '&hellip;' : '');
}
jQuery(document).ready(function($) {
	if($('body').hasClass('texto-dramatico')) {

	//var escenaLabel = $('.escenalabel');
	var playtextRow = $('.playtext-row');
	var instanceFull;
	var instanceMini;
	var visibleIds = [];
	var prevScroll = 0;
	var activeId;
	var activeMaterials;
	var activeText = '';
	var activeParlamento;

	//inView.offset({top: 200});

	$('.texto-mini, .texto-full').addClass('transparent');
	$('#texto-full .playtext-row:first').addClass('active');

	const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
	const navh = $('#site-navigation').outerHeight();
	const headerTxt = $('.header-texto-dramatico').outerHeight();
	const personajesHeight = $('.personajes-section').outerHeight();

	const ua = $.ua.device;
	//console.log(ua.type);

	if(ua.type == 'mobile') {
		var headerHeight = 68 + navh;
		var scrollSpeed = 0;
	} else {
		var headerHeight = 128;
		var scrollSpeed = 300;
	}

	const usableSpace = vh - headerHeight;
	const spaceLeft = usableSpace - personajesHeight;
	const spaceRight = usableSpace - headerTxt;
	
	$('.ficha-obra.texto-dramatico .texto-full').css({ height: spaceRight + 'px'});
	$('.texto-mini').css({height: spaceLeft + 'px'});

	var customScroll = $('.texto-mini, .texto-full').overlayScrollbars({
		autoUpdate: true,
		overflowBehavior: {
			x: 'hidden',
			y: 'scroll'
		},
		callbacks: {
			onInitialized: function() {
				this.sleep();
				$('.texto-mini, .texto-full').removeClass('transparent');
				wrapper = document.querySelector('.os-viewport'), 
				wrapperBox = wrapper.getBoundingClientRect();

				if($(this.getElements().target).attr('id') == 'texto-full') {
					instanceFull = this;
				} else {
					instanceMini = this;
				}
				this.update();
			}
		}
	});

	function scrollOtherInstance(thisInstance, otherInstance) {
		var scrollY = thisInstance.scroll().ratio.y * 100;
		otherInstance.scroll({x:0, y: scrollY + '%'});
		thisInstance.scroll({x:0, y: scrollY + '%'});
	}

	function updateMaterialZone(materialesIds) {
		var matZone = $('.materiales-left');
		if(materialesIds !== undefined && materialesIds.length > 0) {
			activeMaterials = materialesIds;	
			matZone.empty().addClass('withMat').append('<p><span class="multimedia"><i class="fas fa-photo-video"></i> <i class="fas fa-headphones"></i></span> Materiales disponibles</p>');
		} else {
			matZone.empty().removeClass('withMat');
		}
		
	}

	function positionButtonMateriales(x, y) {
		$('.materiales-left').css({left: x, top: y});
	}

	function updatePersonaje(activeParlamento) {
		$('.personajes .personaje').removeClass('active');
		$('.personajes .personaje[data-personaje="' + activeParlamento + '"]').addClass('active');
	}

	instanceFull.options({
		className: 'os-theme-none',
		callbacks: {
			onScrollStart: function() {
				$('#texto-mini .textunit').removeClass('onfield');
				$('.playtext-row').removeClass('active');
			},
			onScroll: function() {
				//instanceMini.sleep();
				//instanceMini.update();
			},
			onScrollStop: function() {
				var ratio = instanceFull.scroll().ratio.y;

				if(ratio < 1) {

					$('.playtext-row').removeClass('active');
					inView.offset(vh - spaceRight + 32);
					//console.log();
					//inView.threshold(0.2);
					var visibleRows = inView('.playtext-row').check();
					//console.log(visibleRows);
					var current = $(visibleRows.current[0]);
					current.addClass('active');
					var topset = false;
					var offsets = [];
					var viewportOffset = current[0].getBoundingClientRect();
					updateMaterialZone(current.attr('data-ids_asoc'));
					updatePersonaje(current.attr('data-parlamento'));
					positionButtonMateriales(viewportOffset.left, viewportOffset.top);
					activeId = current.attr('data-id');
					
					if(viewportOffset.y < vh - spaceRight) {
						instanceFull.scroll(current, scrollSpeed);
						//console.log(current[0].getBoundingClientRect(), vh-spaceRight);
					}

				}
				
			}
		}
	});


	instanceMini.options({
		className: 'os-theme-prompt',
		callbacks: {
			onScrollStart: function() {
				instanceFull.update();
			},
			onScroll: function() {
				instanceFull.sleep();
				scrollOtherInstance(this, instanceFull);
				instanceFull.update();
			},
			onScrollStop: function() {
				instanceFull.update();
			}
		}
	});

	inView('#texto-full .scene-row.scene-marker').on('enter', function(el) {
		var activeScene = $(el).attr('id');
		$('#selectScene').val('#' + activeScene);
	});

	// inView('.playtext-row').on('enter', function(el) {	
	// 	visibleIds.push($(el).attr('data-id'));
	// });

	// inView('.playtext-row').on('exit', function(el) {
	// 	var index = visibleIds.indexOf($(el).attr('data-id'));
	// 	if(index > -1) {
	// 		visibleIds.splice(index, 1);
	// 	}
	// });

	
	//console.log(instanceFull);

	$('body').on('change','#selectScene', function(e) {
		var selected = $('option:selected', this).attr('value');
		//var element = document.querySelector(selected);
		//var top = element.offsetTop;

		instanceFull.scroll($(selected));
		
		//$('.texto-full').addClass('smooth');

		$('.escena-nav').removeClass('active');
	});

	$('.textunit').on('click', function(e) {
		var id = $(this).attr('data-id');
		var selected = $('#texto-full .playtext-row[data-id="' + id + '"]');
		selected.addClass('selected active');
		instanceFull.scroll(selected, 500, 'linear');
	});



	// $('.playtext-row').on('hover', function() {
	// 	var curId = $(this).attr('data-id');
	// 	var dataParlamento = $(this).attr('data-parlamento');

	// 	$('.personajes .personaje').removeClass('active');
	// 	$('.personajes .personaje[data-personaje="' + dataParlamento + '"]').addClass('active');

	// 	$('.playtext-row').removeClass('selected');
	// 	//$('.textunit[data-id="' + curId + '"]').addClass('selected');

	// });

	$('.playtext-row').on('click', function() {
		
		$('.playtext-row.active').removeClass('active');
		$(this).addClass('active');
		updateMaterialZone($(this).attr('data-ids_asoc'));
		activeText = $('.text-item', this).text();
		
		activeParlamento = $(this).attr('data-parlamento');

		
		updatePersonaje(activeParlamento);

		if($(this).attr('data-hasmedia') == "true") {
			
			var viewportOffset = this.getBoundingClientRect();
			positionButtonMateriales(viewportOffset.left, viewportOffset.top);
			
		}
	});

	// $('.trigger-media').on('click', function(event) {
	// 	event.preventDefault();
	// 	var el = $(this);
	// 	var target = el.attr('data-expand');
	// 	var targetel = $(target);
	// 	if(targetel.hasClass('active')) {
	// 		//targetel.slideUp();
	// 		$(this).removeClass('active');
	// 		targetel.removeClass('active').empty();
	// 		disableMedia(targetel);
	// 	} else {
	// 		$('.media-zone.active').removeClass('active');
	// 		$('.trigger-media').removeClass('active');
	// 		//targetel.slideDown();
	// 		targetel.addClass('active');
	// 		$(this).addClass('active');
	// 		enableMedia($(this).attr('data-assoc'), $(this).attr('data-plain-id'));
	// 	}
	// });

	$('.materiales-left').on('click', function(event) {
		//event.preventDefault();
		//console.log('materiales-left');
	});

	$('.modal-media-list-text').on('hide.bs.modal', function(e) {
		$('#content-current-material').empty();
		$('.list-materials').empty();
		$('.curText').empty();
	});

	$('.modal-media-list-text').on('shown.bs.modal', function(e) {
		//console.log(activeMaterials);
		
		var curtext = $('.curText');
		curtext.empty();

			if(activeText.length > 1) {
				var shortText = trunc(activeText, 90);
				curtext.append('<span class="acot">' + activeParlamento + ':</span> ' + shortText);
			}
		enableMedia(activeMaterials, 'modal-media-text-lista-materiales');
		// var modal = $(this).attr('id');
		// var ispage = $(this).attr('data-ispage');

		// var navMedia = loadMediaInModal(mediaid, modal, ispage, type);
		// nextMedia = navMedia[0];
		// prevMedia = navMedia[1];

	});

}//End check texto dramatico

	});


jQuery(document).ready(function($) {
	console.log('init bitacora js');

	var textContainer = $('.texto-dramatico');
	var mediaid;
	var wpid;
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
	

	const vh = window.innerHeight; //Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
	const navh = $('#site-navigation').outerHeight();
	const ua = $.ua.device;
	//console.log(ua.type);
	
	var footerHeight = $('.site-footer').outerHeight();

	if(ua.type == 'mobile') {
		var headerHeight = 68 + navh;
		var scrollSpeed = 0;
		var homeHeight = vh - navh + 20;
	} else {
		var headerHeight = 128;
		var scrollSpeed = 300;
		var homeHeight = vh;
	}

	var avHeight = vh - headerHeight;
	

	$('#timeline-embed').css({ height: avHeight + 'px'});

	$('#landing-overlay').css({ height: homeHeight + 'px' });
	$('#landing-overlay .content-top').css({ height: (homeHeight - footerHeight) + 'px' });

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

	if(ua.type == 'mobile') {
		$('#obraTab a.nav-item.active').addClass('current');
	
			$('.nextTopMenu').on('click', function() {
				var current = $('#obraTab a.nav-item.current');
				var next = current.next('a');

				if(next.length > 0) {
					console.log(next);
					current.removeClass('current');
					next.addClass('current');
				}
			});

			$('.prevTopMenu').on('click', function() {
				var current = $('#obraTab a.nav-item.current');
				var prev = current.prev('a');

				if(prev.length > 0) {
					console.log(prev);
					current.removeClass('current');
					prev.addClass('current');
				}
			});

	}




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

	if($('div[data-function="materiales-obra"]').length) {
		//console.log('materiales');
		var playId = $('div[data-function="materiales-obra"]').attr('data-play-id');
		var target = '#todos';
		enableAllMedia(playId, target);
	}

	if($('#obraTab[data-function="materiales-teatro"]').length) {
		//console.log('mediapageTeatro')
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
		wpid =	$(this).attr('data-wpid');
		type = $(this).attr('data-type');
		
		if($('body').hasClass('texto-dramatico')) {
			$('.media-item-wrapper').removeClass('activeMedia');
			$('#content-current-material').empty();
			loadMediaInContainer(wpid, 'content-current-material', type, false);
		}

		$(this).addClass('activeMedia');
	})

	$('.modal-media-text').on('shown.bs.modal', function(e) {
		//console.log(mediaid);

		var modal = $(this).attr('id');
		var ispage = $(this).attr('data-ispage');
		$('.modal-body', this).empty();
		var navMedia = loadMediaInModal(mediaid, modal, ispage, type);
		nextMedia = navMedia[0];
		prevMedia = navMedia[1];

	});

	$('.modal-media-text').on('hide.bs.modal', function(e) {
		$('.modal-body', this).empty();
	});

	$('.prevMediaItem').on('click', function() {
		if(prevMedia.length) {
			//console.log(prevMedia);
			mediaid = prevMedia.attr('data-wpid');
			modal = $(this).attr('data-modal');
			ispage = $('#' + modal).attr('data-ispage');
			type = prevMedia.attr('data-type');

			$('.media-item-wrapper').removeClass('activeMedia');
			$('.media-item-wrapper[data-wpid="' + wpid + '"]').addClass('activeMedia');

			var navMedia = loadMediaInModal(wpid, modal, ispage, type);
			nextMedia = navMedia[0];
			prevMedia = navMedia[1];
		}
	});

	$('.nextMediaItem').on('click', function() {
		if(nextMedia.length) {
			if(nextMedia.length) {
				//console.log(nextMedia);
				wpid = nextMedia.attr('data-wpid');
				modal = $(this).attr('data-modal');
				ispage = $('#' + modal).attr('data-ispage');
				type = nextMedia.attr('data-type');

				$('.media-item-wrapper').removeClass('activeMedia');
				$('.media-item-wrapper[data-wpid="' + wpid + '"]').addClass('activeMedia');

				var navMedia = loadMediaInModal(wpid, modal, ispage, type);
				nextMedia = navMedia[0];
				prevMedia = navMedia[1];
			}
		}
	});

	$('.modal-media-text').on('hide.bs.modal', function(e) {
		$('.media-item-wrapper').removeClass('activeMedia');
	});

	$('body').on('click', '.btn.clearfilters', function(e) {
		console.log('cleaning');
		$grid.isotope({
			filter: ''
		});
		$('.btn-taxfilter').removeClass('selected');
		showCurrentFilterInfo(undefined, undefined, undefined, iso.filteredItems.length);

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
/*!
  * Bootstrap v4.3.1 (https://getbootstrap.com/)
  * Copyright 2011-2019 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
  */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("jquery"),require("popper.js")):"function"==typeof define&&define.amd?define(["exports","jquery","popper.js"],e):e((t=t||self).bootstrap={},t.jQuery,t.Popper)}(this,function(t,g,u){"use strict";function i(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function s(t,e,n){return e&&i(t.prototype,e),n&&i(t,n),t}function l(o){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{},e=Object.keys(r);"function"==typeof Object.getOwnPropertySymbols&&(e=e.concat(Object.getOwnPropertySymbols(r).filter(function(t){return Object.getOwnPropertyDescriptor(r,t).enumerable}))),e.forEach(function(t){var e,n,i;e=o,i=r[n=t],n in e?Object.defineProperty(e,n,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[n]=i})}return o}g=g&&g.hasOwnProperty("default")?g.default:g,u=u&&u.hasOwnProperty("default")?u.default:u;var e="transitionend";function n(t){var e=this,n=!1;return g(this).one(_.TRANSITION_END,function(){n=!0}),setTimeout(function(){n||_.triggerTransitionEnd(e)},t),this}var _={TRANSITION_END:"bsTransitionEnd",getUID:function(t){for(;t+=~~(1e6*Math.random()),document.getElementById(t););return t},getSelectorFromElement:function(t){var e=t.getAttribute("data-target");if(!e||"#"===e){var n=t.getAttribute("href");e=n&&"#"!==n?n.trim():""}try{return document.querySelector(e)?e:null}catch(t){return null}},getTransitionDurationFromElement:function(t){if(!t)return 0;var e=g(t).css("transition-duration"),n=g(t).css("transition-delay"),i=parseFloat(e),o=parseFloat(n);return i||o?(e=e.split(",")[0],n=n.split(",")[0],1e3*(parseFloat(e)+parseFloat(n))):0},reflow:function(t){return t.offsetHeight},triggerTransitionEnd:function(t){g(t).trigger(e)},supportsTransitionEnd:function(){return Boolean(e)},isElement:function(t){return(t[0]||t).nodeType},typeCheckConfig:function(t,e,n){for(var i in n)if(Object.prototype.hasOwnProperty.call(n,i)){var o=n[i],r=e[i],s=r&&_.isElement(r)?"element":(a=r,{}.toString.call(a).match(/\s([a-z]+)/i)[1].toLowerCase());if(!new RegExp(o).test(s))throw new Error(t.toUpperCase()+': Option "'+i+'" provided type "'+s+'" but expected type "'+o+'".')}var a},findShadowRoot:function(t){if(!document.documentElement.attachShadow)return null;if("function"!=typeof t.getRootNode)return t instanceof ShadowRoot?t:t.parentNode?_.findShadowRoot(t.parentNode):null;var e=t.getRootNode();return e instanceof ShadowRoot?e:null}};g.fn.emulateTransitionEnd=n,g.event.special[_.TRANSITION_END]={bindType:e,delegateType:e,handle:function(t){if(g(t.target).is(this))return t.handleObj.handler.apply(this,arguments)}};var o="alert",r="bs.alert",a="."+r,c=g.fn[o],h={CLOSE:"close"+a,CLOSED:"closed"+a,CLICK_DATA_API:"click"+a+".data-api"},f="alert",d="fade",m="show",p=function(){function i(t){this._element=t}var t=i.prototype;return t.close=function(t){var e=this._element;t&&(e=this._getRootElement(t)),this._triggerCloseEvent(e).isDefaultPrevented()||this._removeElement(e)},t.dispose=function(){g.removeData(this._element,r),this._element=null},t._getRootElement=function(t){var e=_.getSelectorFromElement(t),n=!1;return e&&(n=document.querySelector(e)),n||(n=g(t).closest("."+f)[0]),n},t._triggerCloseEvent=function(t){var e=g.Event(h.CLOSE);return g(t).trigger(e),e},t._removeElement=function(e){var n=this;if(g(e).removeClass(m),g(e).hasClass(d)){var t=_.getTransitionDurationFromElement(e);g(e).one(_.TRANSITION_END,function(t){return n._destroyElement(e,t)}).emulateTransitionEnd(t)}else this._destroyElement(e)},t._destroyElement=function(t){g(t).detach().trigger(h.CLOSED).remove()},i._jQueryInterface=function(n){return this.each(function(){var t=g(this),e=t.data(r);e||(e=new i(this),t.data(r,e)),"close"===n&&e[n](this)})},i._handleDismiss=function(e){return function(t){t&&t.preventDefault(),e.close(this)}},s(i,null,[{key:"VERSION",get:function(){return"4.3.1"}}]),i}();g(document).on(h.CLICK_DATA_API,'[data-dismiss="alert"]',p._handleDismiss(new p)),g.fn[o]=p._jQueryInterface,g.fn[o].Constructor=p,g.fn[o].noConflict=function(){return g.fn[o]=c,p._jQueryInterface};var v="button",y="bs.button",E="."+y,C=".data-api",T=g.fn[v],S="active",b="btn",I="focus",D='[data-toggle^="button"]',w='[data-toggle="buttons"]',A='input:not([type="hidden"])',N=".active",O=".btn",k={CLICK_DATA_API:"click"+E+C,FOCUS_BLUR_DATA_API:"focus"+E+C+" blur"+E+C},P=function(){function n(t){this._element=t}var t=n.prototype;return t.toggle=function(){var t=!0,e=!0,n=g(this._element).closest(w)[0];if(n){var i=this._element.querySelector(A);if(i){if("radio"===i.type)if(i.checked&&this._element.classList.contains(S))t=!1;else{var o=n.querySelector(N);o&&g(o).removeClass(S)}if(t){if(i.hasAttribute("disabled")||n.hasAttribute("disabled")||i.classList.contains("disabled")||n.classList.contains("disabled"))return;i.checked=!this._element.classList.contains(S),g(i).trigger("change")}i.focus(),e=!1}}e&&this._element.setAttribute("aria-pressed",!this._element.classList.contains(S)),t&&g(this._element).toggleClass(S)},t.dispose=function(){g.removeData(this._element,y),this._element=null},n._jQueryInterface=function(e){return this.each(function(){var t=g(this).data(y);t||(t=new n(this),g(this).data(y,t)),"toggle"===e&&t[e]()})},s(n,null,[{key:"VERSION",get:function(){return"4.3.1"}}]),n}();g(document).on(k.CLICK_DATA_API,D,function(t){t.preventDefault();var e=t.target;g(e).hasClass(b)||(e=g(e).closest(O)),P._jQueryInterface.call(g(e),"toggle")}).on(k.FOCUS_BLUR_DATA_API,D,function(t){var e=g(t.target).closest(O)[0];g(e).toggleClass(I,/^focus(in)?$/.test(t.type))}),g.fn[v]=P._jQueryInterface,g.fn[v].Constructor=P,g.fn[v].noConflict=function(){return g.fn[v]=T,P._jQueryInterface};var L="carousel",j="bs.carousel",H="."+j,R=".data-api",x=g.fn[L],F={interval:5e3,keyboard:!0,slide:!1,pause:"hover",wrap:!0,touch:!0},U={interval:"(number|boolean)",keyboard:"boolean",slide:"(boolean|string)",pause:"(string|boolean)",wrap:"boolean",touch:"boolean"},W="next",q="prev",M="left",K="right",Q={SLIDE:"slide"+H,SLID:"slid"+H,KEYDOWN:"keydown"+H,MOUSEENTER:"mouseenter"+H,MOUSELEAVE:"mouseleave"+H,TOUCHSTART:"touchstart"+H,TOUCHMOVE:"touchmove"+H,TOUCHEND:"touchend"+H,POINTERDOWN:"pointerdown"+H,POINTERUP:"pointerup"+H,DRAG_START:"dragstart"+H,LOAD_DATA_API:"load"+H+R,CLICK_DATA_API:"click"+H+R},B="carousel",V="active",Y="slide",z="carousel-item-right",X="carousel-item-left",$="carousel-item-next",G="carousel-item-prev",J="pointer-event",Z=".active",tt=".active.carousel-item",et=".carousel-item",nt=".carousel-item img",it=".carousel-item-next, .carousel-item-prev",ot=".carousel-indicators",rt="[data-slide], [data-slide-to]",st='[data-ride="carousel"]',at={TOUCH:"touch",PEN:"pen"},lt=function(){function r(t,e){this._items=null,this._interval=null,this._activeElement=null,this._isPaused=!1,this._isSliding=!1,this.touchTimeout=null,this.touchStartX=0,this.touchDeltaX=0,this._config=this._getConfig(e),this._element=t,this._indicatorsElement=this._element.querySelector(ot),this._touchSupported="ontouchstart"in document.documentElement||0<navigator.maxTouchPoints,this._pointerEvent=Boolean(window.PointerEvent||window.MSPointerEvent),this._addEventListeners()}var t=r.prototype;return t.next=function(){this._isSliding||this._slide(W)},t.nextWhenVisible=function(){!document.hidden&&g(this._element).is(":visible")&&"hidden"!==g(this._element).css("visibility")&&this.next()},t.prev=function(){this._isSliding||this._slide(q)},t.pause=function(t){t||(this._isPaused=!0),this._element.querySelector(it)&&(_.triggerTransitionEnd(this._element),this.cycle(!0)),clearInterval(this._interval),this._interval=null},t.cycle=function(t){t||(this._isPaused=!1),this._interval&&(clearInterval(this._interval),this._interval=null),this._config.interval&&!this._isPaused&&(this._interval=setInterval((document.visibilityState?this.nextWhenVisible:this.next).bind(this),this._config.interval))},t.to=function(t){var e=this;this._activeElement=this._element.querySelector(tt);var n=this._getItemIndex(this._activeElement);if(!(t>this._items.length-1||t<0))if(this._isSliding)g(this._element).one(Q.SLID,function(){return e.to(t)});else{if(n===t)return this.pause(),void this.cycle();var i=n<t?W:q;this._slide(i,this._items[t])}},t.dispose=function(){g(this._element).off(H),g.removeData(this._element,j),this._items=null,this._config=null,this._element=null,this._interval=null,this._isPaused=null,this._isSliding=null,this._activeElement=null,this._indicatorsElement=null},t._getConfig=function(t){return t=l({},F,t),_.typeCheckConfig(L,t,U),t},t._handleSwipe=function(){var t=Math.abs(this.touchDeltaX);if(!(t<=40)){var e=t/this.touchDeltaX;0<e&&this.prev(),e<0&&this.next()}},t._addEventListeners=function(){var e=this;this._config.keyboard&&g(this._element).on(Q.KEYDOWN,function(t){return e._keydown(t)}),"hover"===this._config.pause&&g(this._element).on(Q.MOUSEENTER,function(t){return e.pause(t)}).on(Q.MOUSELEAVE,function(t){return e.cycle(t)}),this._config.touch&&this._addTouchEventListeners()},t._addTouchEventListeners=function(){var n=this;if(this._touchSupported){var e=function(t){n._pointerEvent&&at[t.originalEvent.pointerType.toUpperCase()]?n.touchStartX=t.originalEvent.clientX:n._pointerEvent||(n.touchStartX=t.originalEvent.touches[0].clientX)},i=function(t){n._pointerEvent&&at[t.originalEvent.pointerType.toUpperCase()]&&(n.touchDeltaX=t.originalEvent.clientX-n.touchStartX),n._handleSwipe(),"hover"===n._config.pause&&(n.pause(),n.touchTimeout&&clearTimeout(n.touchTimeout),n.touchTimeout=setTimeout(function(t){return n.cycle(t)},500+n._config.interval))};g(this._element.querySelectorAll(nt)).on(Q.DRAG_START,function(t){return t.preventDefault()}),this._pointerEvent?(g(this._element).on(Q.POINTERDOWN,function(t){return e(t)}),g(this._element).on(Q.POINTERUP,function(t){return i(t)}),this._element.classList.add(J)):(g(this._element).on(Q.TOUCHSTART,function(t){return e(t)}),g(this._element).on(Q.TOUCHMOVE,function(t){var e;(e=t).originalEvent.touches&&1<e.originalEvent.touches.length?n.touchDeltaX=0:n.touchDeltaX=e.originalEvent.touches[0].clientX-n.touchStartX}),g(this._element).on(Q.TOUCHEND,function(t){return i(t)}))}},t._keydown=function(t){if(!/input|textarea/i.test(t.target.tagName))switch(t.which){case 37:t.preventDefault(),this.prev();break;case 39:t.preventDefault(),this.next()}},t._getItemIndex=function(t){return this._items=t&&t.parentNode?[].slice.call(t.parentNode.querySelectorAll(et)):[],this._items.indexOf(t)},t._getItemByDirection=function(t,e){var n=t===W,i=t===q,o=this._getItemIndex(e),r=this._items.length-1;if((i&&0===o||n&&o===r)&&!this._config.wrap)return e;var s=(o+(t===q?-1:1))%this._items.length;return-1===s?this._items[this._items.length-1]:this._items[s]},t._triggerSlideEvent=function(t,e){var n=this._getItemIndex(t),i=this._getItemIndex(this._element.querySelector(tt)),o=g.Event(Q.SLIDE,{relatedTarget:t,direction:e,from:i,to:n});return g(this._element).trigger(o),o},t._setActiveIndicatorElement=function(t){if(this._indicatorsElement){var e=[].slice.call(this._indicatorsElement.querySelectorAll(Z));g(e).removeClass(V);var n=this._indicatorsElement.children[this._getItemIndex(t)];n&&g(n).addClass(V)}},t._slide=function(t,e){var n,i,o,r=this,s=this._element.querySelector(tt),a=this._getItemIndex(s),l=e||s&&this._getItemByDirection(t,s),c=this._getItemIndex(l),h=Boolean(this._interval);if(o=t===W?(n=X,i=$,M):(n=z,i=G,K),l&&g(l).hasClass(V))this._isSliding=!1;else if(!this._triggerSlideEvent(l,o).isDefaultPrevented()&&s&&l){this._isSliding=!0,h&&this.pause(),this._setActiveIndicatorElement(l);var u=g.Event(Q.SLID,{relatedTarget:l,direction:o,from:a,to:c});if(g(this._element).hasClass(Y)){g(l).addClass(i),_.reflow(l),g(s).addClass(n),g(l).addClass(n);var f=parseInt(l.getAttribute("data-interval"),10);this._config.interval=f?(this._config.defaultInterval=this._config.defaultInterval||this._config.interval,f):this._config.defaultInterval||this._config.interval;var d=_.getTransitionDurationFromElement(s);g(s).one(_.TRANSITION_END,function(){g(l).removeClass(n+" "+i).addClass(V),g(s).removeClass(V+" "+i+" "+n),r._isSliding=!1,setTimeout(function(){return g(r._element).trigger(u)},0)}).emulateTransitionEnd(d)}else g(s).removeClass(V),g(l).addClass(V),this._isSliding=!1,g(this._element).trigger(u);h&&this.cycle()}},r._jQueryInterface=function(i){return this.each(function(){var t=g(this).data(j),e=l({},F,g(this).data());"object"==typeof i&&(e=l({},e,i));var n="string"==typeof i?i:e.slide;if(t||(t=new r(this,e),g(this).data(j,t)),"number"==typeof i)t.to(i);else if("string"==typeof n){if("undefined"==typeof t[n])throw new TypeError('No method named "'+n+'"');t[n]()}else e.interval&&e.ride&&(t.pause(),t.cycle())})},r._dataApiClickHandler=function(t){var e=_.getSelectorFromElement(this);if(e){var n=g(e)[0];if(n&&g(n).hasClass(B)){var i=l({},g(n).data(),g(this).data()),o=this.getAttribute("data-slide-to");o&&(i.interval=!1),r._jQueryInterface.call(g(n),i),o&&g(n).data(j).to(o),t.preventDefault()}}},s(r,null,[{key:"VERSION",get:function(){return"4.3.1"}},{key:"Default",get:function(){return F}}]),r}();g(document).on(Q.CLICK_DATA_API,rt,lt._dataApiClickHandler),g(window).on(Q.LOAD_DATA_API,function(){for(var t=[].slice.call(document.querySelectorAll(st)),e=0,n=t.length;e<n;e++){var i=g(t[e]);lt._jQueryInterface.call(i,i.data())}}),g.fn[L]=lt._jQueryInterface,g.fn[L].Constructor=lt,g.fn[L].noConflict=function(){return g.fn[L]=x,lt._jQueryInterface};var ct="collapse",ht="bs.collapse",ut="."+ht,ft=g.fn[ct],dt={toggle:!0,parent:""},gt={toggle:"boolean",parent:"(string|element)"},_t={SHOW:"show"+ut,SHOWN:"shown"+ut,HIDE:"hide"+ut,HIDDEN:"hidden"+ut,CLICK_DATA_API:"click"+ut+".data-api"},mt="show",pt="collapse",vt="collapsing",yt="collapsed",Et="width",Ct="height",Tt=".show, .collapsing",St='[data-toggle="collapse"]',bt=function(){function a(e,t){this._isTransitioning=!1,this._element=e,this._config=this._getConfig(t),this._triggerArray=[].slice.call(document.querySelectorAll('[data-toggle="collapse"][href="#'+e.id+'"],[data-toggle="collapse"][data-target="#'+e.id+'"]'));for(var n=[].slice.call(document.querySelectorAll(St)),i=0,o=n.length;i<o;i++){var r=n[i],s=_.getSelectorFromElement(r),a=[].slice.call(document.querySelectorAll(s)).filter(function(t){return t===e});null!==s&&0<a.length&&(this._selector=s,this._triggerArray.push(r))}this._parent=this._config.parent?this._getParent():null,this._config.parent||this._addAriaAndCollapsedClass(this._element,this._triggerArray),this._config.toggle&&this.toggle()}var t=a.prototype;return t.toggle=function(){g(this._element).hasClass(mt)?this.hide():this.show()},t.show=function(){var t,e,n=this;if(!this._isTransitioning&&!g(this._element).hasClass(mt)&&(this._parent&&0===(t=[].slice.call(this._parent.querySelectorAll(Tt)).filter(function(t){return"string"==typeof n._config.parent?t.getAttribute("data-parent")===n._config.parent:t.classList.contains(pt)})).length&&(t=null),!(t&&(e=g(t).not(this._selector).data(ht))&&e._isTransitioning))){var i=g.Event(_t.SHOW);if(g(this._element).trigger(i),!i.isDefaultPrevented()){t&&(a._jQueryInterface.call(g(t).not(this._selector),"hide"),e||g(t).data(ht,null));var o=this._getDimension();g(this._element).removeClass(pt).addClass(vt),this._element.style[o]=0,this._triggerArray.length&&g(this._triggerArray).removeClass(yt).attr("aria-expanded",!0),this.setTransitioning(!0);var r="scroll"+(o[0].toUpperCase()+o.slice(1)),s=_.getTransitionDurationFromElement(this._element);g(this._element).one(_.TRANSITION_END,function(){g(n._element).removeClass(vt).addClass(pt).addClass(mt),n._element.style[o]="",n.setTransitioning(!1),g(n._element).trigger(_t.SHOWN)}).emulateTransitionEnd(s),this._element.style[o]=this._element[r]+"px"}}},t.hide=function(){var t=this;if(!this._isTransitioning&&g(this._element).hasClass(mt)){var e=g.Event(_t.HIDE);if(g(this._element).trigger(e),!e.isDefaultPrevented()){var n=this._getDimension();this._element.style[n]=this._element.getBoundingClientRect()[n]+"px",_.reflow(this._element),g(this._element).addClass(vt).removeClass(pt).removeClass(mt);var i=this._triggerArray.length;if(0<i)for(var o=0;o<i;o++){var r=this._triggerArray[o],s=_.getSelectorFromElement(r);if(null!==s)g([].slice.call(document.querySelectorAll(s))).hasClass(mt)||g(r).addClass(yt).attr("aria-expanded",!1)}this.setTransitioning(!0);this._element.style[n]="";var a=_.getTransitionDurationFromElement(this._element);g(this._element).one(_.TRANSITION_END,function(){t.setTransitioning(!1),g(t._element).removeClass(vt).addClass(pt).trigger(_t.HIDDEN)}).emulateTransitionEnd(a)}}},t.setTransitioning=function(t){this._isTransitioning=t},t.dispose=function(){g.removeData(this._element,ht),this._config=null,this._parent=null,this._element=null,this._triggerArray=null,this._isTransitioning=null},t._getConfig=function(t){return(t=l({},dt,t)).toggle=Boolean(t.toggle),_.typeCheckConfig(ct,t,gt),t},t._getDimension=function(){return g(this._element).hasClass(Et)?Et:Ct},t._getParent=function(){var t,n=this;_.isElement(this._config.parent)?(t=this._config.parent,"undefined"!=typeof this._config.parent.jquery&&(t=this._config.parent[0])):t=document.querySelector(this._config.parent);var e='[data-toggle="collapse"][data-parent="'+this._config.parent+'"]',i=[].slice.call(t.querySelectorAll(e));return g(i).each(function(t,e){n._addAriaAndCollapsedClass(a._getTargetFromElement(e),[e])}),t},t._addAriaAndCollapsedClass=function(t,e){var n=g(t).hasClass(mt);e.length&&g(e).toggleClass(yt,!n).attr("aria-expanded",n)},a._getTargetFromElement=function(t){var e=_.getSelectorFromElement(t);return e?document.querySelector(e):null},a._jQueryInterface=function(i){return this.each(function(){var t=g(this),e=t.data(ht),n=l({},dt,t.data(),"object"==typeof i&&i?i:{});if(!e&&n.toggle&&/show|hide/.test(i)&&(n.toggle=!1),e||(e=new a(this,n),t.data(ht,e)),"string"==typeof i){if("undefined"==typeof e[i])throw new TypeError('No method named "'+i+'"');e[i]()}})},s(a,null,[{key:"VERSION",get:function(){return"4.3.1"}},{key:"Default",get:function(){return dt}}]),a}();g(document).on(_t.CLICK_DATA_API,St,function(t){"A"===t.currentTarget.tagName&&t.preventDefault();var n=g(this),e=_.getSelectorFromElement(this),i=[].slice.call(document.querySelectorAll(e));g(i).each(function(){var t=g(this),e=t.data(ht)?"toggle":n.data();bt._jQueryInterface.call(t,e)})}),g.fn[ct]=bt._jQueryInterface,g.fn[ct].Constructor=bt,g.fn[ct].noConflict=function(){return g.fn[ct]=ft,bt._jQueryInterface};var It="dropdown",Dt="bs.dropdown",wt="."+Dt,At=".data-api",Nt=g.fn[It],Ot=new RegExp("38|40|27"),kt={HIDE:"hide"+wt,HIDDEN:"hidden"+wt,SHOW:"show"+wt,SHOWN:"shown"+wt,CLICK:"click"+wt,CLICK_DATA_API:"click"+wt+At,KEYDOWN_DATA_API:"keydown"+wt+At,KEYUP_DATA_API:"keyup"+wt+At},Pt="disabled",Lt="show",jt="dropup",Ht="dropright",Rt="dropleft",xt="dropdown-menu-right",Ft="position-static",Ut='[data-toggle="dropdown"]',Wt=".dropdown form",qt=".dropdown-menu",Mt=".navbar-nav",Kt=".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)",Qt="top-start",Bt="top-end",Vt="bottom-start",Yt="bottom-end",zt="right-start",Xt="left-start",$t={offset:0,flip:!0,boundary:"scrollParent",reference:"toggle",display:"dynamic"},Gt={offset:"(number|string|function)",flip:"boolean",boundary:"(string|element)",reference:"(string|element)",display:"string"},Jt=function(){function c(t,e){this._element=t,this._popper=null,this._config=this._getConfig(e),this._menu=this._getMenuElement(),this._inNavbar=this._detectNavbar(),this._addEventListeners()}var t=c.prototype;return t.toggle=function(){if(!this._element.disabled&&!g(this._element).hasClass(Pt)){var t=c._getParentFromElement(this._element),e=g(this._menu).hasClass(Lt);if(c._clearMenus(),!e){var n={relatedTarget:this._element},i=g.Event(kt.SHOW,n);if(g(t).trigger(i),!i.isDefaultPrevented()){if(!this._inNavbar){if("undefined"==typeof u)throw new TypeError("Bootstrap's dropdowns require Popper.js (https://popper.js.org/)");var o=this._element;"parent"===this._config.reference?o=t:_.isElement(this._config.reference)&&(o=this._config.reference,"undefined"!=typeof this._config.reference.jquery&&(o=this._config.reference[0])),"scrollParent"!==this._config.boundary&&g(t).addClass(Ft),this._popper=new u(o,this._menu,this._getPopperConfig())}"ontouchstart"in document.documentElement&&0===g(t).closest(Mt).length&&g(document.body).children().on("mouseover",null,g.noop),this._element.focus(),this._element.setAttribute("aria-expanded",!0),g(this._menu).toggleClass(Lt),g(t).toggleClass(Lt).trigger(g.Event(kt.SHOWN,n))}}}},t.show=function(){if(!(this._element.disabled||g(this._element).hasClass(Pt)||g(this._menu).hasClass(Lt))){var t={relatedTarget:this._element},e=g.Event(kt.SHOW,t),n=c._getParentFromElement(this._element);g(n).trigger(e),e.isDefaultPrevented()||(g(this._menu).toggleClass(Lt),g(n).toggleClass(Lt).trigger(g.Event(kt.SHOWN,t)))}},t.hide=function(){if(!this._element.disabled&&!g(this._element).hasClass(Pt)&&g(this._menu).hasClass(Lt)){var t={relatedTarget:this._element},e=g.Event(kt.HIDE,t),n=c._getParentFromElement(this._element);g(n).trigger(e),e.isDefaultPrevented()||(g(this._menu).toggleClass(Lt),g(n).toggleClass(Lt).trigger(g.Event(kt.HIDDEN,t)))}},t.dispose=function(){g.removeData(this._element,Dt),g(this._element).off(wt),this._element=null,(this._menu=null)!==this._popper&&(this._popper.destroy(),this._popper=null)},t.update=function(){this._inNavbar=this._detectNavbar(),null!==this._popper&&this._popper.scheduleUpdate()},t._addEventListeners=function(){var e=this;g(this._element).on(kt.CLICK,function(t){t.preventDefault(),t.stopPropagation(),e.toggle()})},t._getConfig=function(t){return t=l({},this.constructor.Default,g(this._element).data(),t),_.typeCheckConfig(It,t,this.constructor.DefaultType),t},t._getMenuElement=function(){if(!this._menu){var t=c._getParentFromElement(this._element);t&&(this._menu=t.querySelector(qt))}return this._menu},t._getPlacement=function(){var t=g(this._element.parentNode),e=Vt;return t.hasClass(jt)?(e=Qt,g(this._menu).hasClass(xt)&&(e=Bt)):t.hasClass(Ht)?e=zt:t.hasClass(Rt)?e=Xt:g(this._menu).hasClass(xt)&&(e=Yt),e},t._detectNavbar=function(){return 0<g(this._element).closest(".navbar").length},t._getOffset=function(){var e=this,t={};return"function"==typeof this._config.offset?t.fn=function(t){return t.offsets=l({},t.offsets,e._config.offset(t.offsets,e._element)||{}),t}:t.offset=this._config.offset,t},t._getPopperConfig=function(){var t={placement:this._getPlacement(),modifiers:{offset:this._getOffset(),flip:{enabled:this._config.flip},preventOverflow:{boundariesElement:this._config.boundary}}};return"static"===this._config.display&&(t.modifiers.applyStyle={enabled:!1}),t},c._jQueryInterface=function(e){return this.each(function(){var t=g(this).data(Dt);if(t||(t=new c(this,"object"==typeof e?e:null),g(this).data(Dt,t)),"string"==typeof e){if("undefined"==typeof t[e])throw new TypeError('No method named "'+e+'"');t[e]()}})},c._clearMenus=function(t){if(!t||3!==t.which&&("keyup"!==t.type||9===t.which))for(var e=[].slice.call(document.querySelectorAll(Ut)),n=0,i=e.length;n<i;n++){var o=c._getParentFromElement(e[n]),r=g(e[n]).data(Dt),s={relatedTarget:e[n]};if(t&&"click"===t.type&&(s.clickEvent=t),r){var a=r._menu;if(g(o).hasClass(Lt)&&!(t&&("click"===t.type&&/input|textarea/i.test(t.target.tagName)||"keyup"===t.type&&9===t.which)&&g.contains(o,t.target))){var l=g.Event(kt.HIDE,s);g(o).trigger(l),l.isDefaultPrevented()||("ontouchstart"in document.documentElement&&g(document.body).children().off("mouseover",null,g.noop),e[n].setAttribute("aria-expanded","false"),g(a).removeClass(Lt),g(o).removeClass(Lt).trigger(g.Event(kt.HIDDEN,s)))}}}},c._getParentFromElement=function(t){var e,n=_.getSelectorFromElement(t);return n&&(e=document.querySelector(n)),e||t.parentNode},c._dataApiKeydownHandler=function(t){if((/input|textarea/i.test(t.target.tagName)?!(32===t.which||27!==t.which&&(40!==t.which&&38!==t.which||g(t.target).closest(qt).length)):Ot.test(t.which))&&(t.preventDefault(),t.stopPropagation(),!this.disabled&&!g(this).hasClass(Pt))){var e=c._getParentFromElement(this),n=g(e).hasClass(Lt);if(n&&(!n||27!==t.which&&32!==t.which)){var i=[].slice.call(e.querySelectorAll(Kt));if(0!==i.length){var o=i.indexOf(t.target);38===t.which&&0<o&&o--,40===t.which&&o<i.length-1&&o++,o<0&&(o=0),i[o].focus()}}else{if(27===t.which){var r=e.querySelector(Ut);g(r).trigger("focus")}g(this).trigger("click")}}},s(c,null,[{key:"VERSION",get:function(){return"4.3.1"}},{key:"Default",get:function(){return $t}},{key:"DefaultType",get:function(){return Gt}}]),c}();g(document).on(kt.KEYDOWN_DATA_API,Ut,Jt._dataApiKeydownHandler).on(kt.KEYDOWN_DATA_API,qt,Jt._dataApiKeydownHandler).on(kt.CLICK_DATA_API+" "+kt.KEYUP_DATA_API,Jt._clearMenus).on(kt.CLICK_DATA_API,Ut,function(t){t.preventDefault(),t.stopPropagation(),Jt._jQueryInterface.call(g(this),"toggle")}).on(kt.CLICK_DATA_API,Wt,function(t){t.stopPropagation()}),g.fn[It]=Jt._jQueryInterface,g.fn[It].Constructor=Jt,g.fn[It].noConflict=function(){return g.fn[It]=Nt,Jt._jQueryInterface};var Zt="modal",te="bs.modal",ee="."+te,ne=g.fn[Zt],ie={backdrop:!0,keyboard:!0,focus:!0,show:!0},oe={backdrop:"(boolean|string)",keyboard:"boolean",focus:"boolean",show:"boolean"},re={HIDE:"hide"+ee,HIDDEN:"hidden"+ee,SHOW:"show"+ee,SHOWN:"shown"+ee,FOCUSIN:"focusin"+ee,RESIZE:"resize"+ee,CLICK_DISMISS:"click.dismiss"+ee,KEYDOWN_DISMISS:"keydown.dismiss"+ee,MOUSEUP_DISMISS:"mouseup.dismiss"+ee,MOUSEDOWN_DISMISS:"mousedown.dismiss"+ee,CLICK_DATA_API:"click"+ee+".data-api"},se="modal-dialog-scrollable",ae="modal-scrollbar-measure",le="modal-backdrop",ce="modal-open",he="fade",ue="show",fe=".modal-dialog",de=".modal-body",ge='[data-toggle="modal"]',_e='[data-dismiss="modal"]',me=".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",pe=".sticky-top",ve=function(){function o(t,e){this._config=this._getConfig(e),this._element=t,this._dialog=t.querySelector(fe),this._backdrop=null,this._isShown=!1,this._isBodyOverflowing=!1,this._ignoreBackdropClick=!1,this._isTransitioning=!1,this._scrollbarWidth=0}var t=o.prototype;return t.toggle=function(t){return this._isShown?this.hide():this.show(t)},t.show=function(t){var e=this;if(!this._isShown&&!this._isTransitioning){g(this._element).hasClass(he)&&(this._isTransitioning=!0);var n=g.Event(re.SHOW,{relatedTarget:t});g(this._element).trigger(n),this._isShown||n.isDefaultPrevented()||(this._isShown=!0,this._checkScrollbar(),this._setScrollbar(),this._adjustDialog(),this._setEscapeEvent(),this._setResizeEvent(),g(this._element).on(re.CLICK_DISMISS,_e,function(t){return e.hide(t)}),g(this._dialog).on(re.MOUSEDOWN_DISMISS,function(){g(e._element).one(re.MOUSEUP_DISMISS,function(t){g(t.target).is(e._element)&&(e._ignoreBackdropClick=!0)})}),this._showBackdrop(function(){return e._showElement(t)}))}},t.hide=function(t){var e=this;if(t&&t.preventDefault(),this._isShown&&!this._isTransitioning){var n=g.Event(re.HIDE);if(g(this._element).trigger(n),this._isShown&&!n.isDefaultPrevented()){this._isShown=!1;var i=g(this._element).hasClass(he);if(i&&(this._isTransitioning=!0),this._setEscapeEvent(),this._setResizeEvent(),g(document).off(re.FOCUSIN),g(this._element).removeClass(ue),g(this._element).off(re.CLICK_DISMISS),g(this._dialog).off(re.MOUSEDOWN_DISMISS),i){var o=_.getTransitionDurationFromElement(this._element);g(this._element).one(_.TRANSITION_END,function(t){return e._hideModal(t)}).emulateTransitionEnd(o)}else this._hideModal()}}},t.dispose=function(){[window,this._element,this._dialog].forEach(function(t){return g(t).off(ee)}),g(document).off(re.FOCUSIN),g.removeData(this._element,te),this._config=null,this._element=null,this._dialog=null,this._backdrop=null,this._isShown=null,this._isBodyOverflowing=null,this._ignoreBackdropClick=null,this._isTransitioning=null,this._scrollbarWidth=null},t.handleUpdate=function(){this._adjustDialog()},t._getConfig=function(t){return t=l({},ie,t),_.typeCheckConfig(Zt,t,oe),t},t._showElement=function(t){var e=this,n=g(this._element).hasClass(he);this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE||document.body.appendChild(this._element),this._element.style.display="block",this._element.removeAttribute("aria-hidden"),this._element.setAttribute("aria-modal",!0),g(this._dialog).hasClass(se)?this._dialog.querySelector(de).scrollTop=0:this._element.scrollTop=0,n&&_.reflow(this._element),g(this._element).addClass(ue),this._config.focus&&this._enforceFocus();var i=g.Event(re.SHOWN,{relatedTarget:t}),o=function(){e._config.focus&&e._element.focus(),e._isTransitioning=!1,g(e._element).trigger(i)};if(n){var r=_.getTransitionDurationFromElement(this._dialog);g(this._dialog).one(_.TRANSITION_END,o).emulateTransitionEnd(r)}else o()},t._enforceFocus=function(){var e=this;g(document).off(re.FOCUSIN).on(re.FOCUSIN,function(t){document!==t.target&&e._element!==t.target&&0===g(e._element).has(t.target).length&&e._element.focus()})},t._setEscapeEvent=function(){var e=this;this._isShown&&this._config.keyboard?g(this._element).on(re.KEYDOWN_DISMISS,function(t){27===t.which&&(t.preventDefault(),e.hide())}):this._isShown||g(this._element).off(re.KEYDOWN_DISMISS)},t._setResizeEvent=function(){var e=this;this._isShown?g(window).on(re.RESIZE,function(t){return e.handleUpdate(t)}):g(window).off(re.RESIZE)},t._hideModal=function(){var t=this;this._element.style.display="none",this._element.setAttribute("aria-hidden",!0),this._element.removeAttribute("aria-modal"),this._isTransitioning=!1,this._showBackdrop(function(){g(document.body).removeClass(ce),t._resetAdjustments(),t._resetScrollbar(),g(t._element).trigger(re.HIDDEN)})},t._removeBackdrop=function(){this._backdrop&&(g(this._backdrop).remove(),this._backdrop=null)},t._showBackdrop=function(t){var e=this,n=g(this._element).hasClass(he)?he:"";if(this._isShown&&this._config.backdrop){if(this._backdrop=document.createElement("div"),this._backdrop.className=le,n&&this._backdrop.classList.add(n),g(this._backdrop).appendTo(document.body),g(this._element).on(re.CLICK_DISMISS,function(t){e._ignoreBackdropClick?e._ignoreBackdropClick=!1:t.target===t.currentTarget&&("static"===e._config.backdrop?e._element.focus():e.hide())}),n&&_.reflow(this._backdrop),g(this._backdrop).addClass(ue),!t)return;if(!n)return void t();var i=_.getTransitionDurationFromElement(this._backdrop);g(this._backdrop).one(_.TRANSITION_END,t).emulateTransitionEnd(i)}else if(!this._isShown&&this._backdrop){g(this._backdrop).removeClass(ue);var o=function(){e._removeBackdrop(),t&&t()};if(g(this._element).hasClass(he)){var r=_.getTransitionDurationFromElement(this._backdrop);g(this._backdrop).one(_.TRANSITION_END,o).emulateTransitionEnd(r)}else o()}else t&&t()},t._adjustDialog=function(){var t=this._element.scrollHeight>document.documentElement.clientHeight;!this._isBodyOverflowing&&t&&(this._element.style.paddingLeft=this._scrollbarWidth+"px"),this._isBodyOverflowing&&!t&&(this._element.style.paddingRight=this._scrollbarWidth+"px")},t._resetAdjustments=function(){this._element.style.paddingLeft="",this._element.style.paddingRight=""},t._checkScrollbar=function(){var t=document.body.getBoundingClientRect();this._isBodyOverflowing=t.left+t.right<window.innerWidth,this._scrollbarWidth=this._getScrollbarWidth()},t._setScrollbar=function(){var o=this;if(this._isBodyOverflowing){var t=[].slice.call(document.querySelectorAll(me)),e=[].slice.call(document.querySelectorAll(pe));g(t).each(function(t,e){var n=e.style.paddingRight,i=g(e).css("padding-right");g(e).data("padding-right",n).css("padding-right",parseFloat(i)+o._scrollbarWidth+"px")}),g(e).each(function(t,e){var n=e.style.marginRight,i=g(e).css("margin-right");g(e).data("margin-right",n).css("margin-right",parseFloat(i)-o._scrollbarWidth+"px")});var n=document.body.style.paddingRight,i=g(document.body).css("padding-right");g(document.body).data("padding-right",n).css("padding-right",parseFloat(i)+this._scrollbarWidth+"px")}g(document.body).addClass(ce)},t._resetScrollbar=function(){var t=[].slice.call(document.querySelectorAll(me));g(t).each(function(t,e){var n=g(e).data("padding-right");g(e).removeData("padding-right"),e.style.paddingRight=n||""});var e=[].slice.call(document.querySelectorAll(""+pe));g(e).each(function(t,e){var n=g(e).data("margin-right");"undefined"!=typeof n&&g(e).css("margin-right",n).removeData("margin-right")});var n=g(document.body).data("padding-right");g(document.body).removeData("padding-right"),document.body.style.paddingRight=n||""},t._getScrollbarWidth=function(){var t=document.createElement("div");t.className=ae,document.body.appendChild(t);var e=t.getBoundingClientRect().width-t.clientWidth;return document.body.removeChild(t),e},o._jQueryInterface=function(n,i){return this.each(function(){var t=g(this).data(te),e=l({},ie,g(this).data(),"object"==typeof n&&n?n:{});if(t||(t=new o(this,e),g(this).data(te,t)),"string"==typeof n){if("undefined"==typeof t[n])throw new TypeError('No method named "'+n+'"');t[n](i)}else e.show&&t.show(i)})},s(o,null,[{key:"VERSION",get:function(){return"4.3.1"}},{key:"Default",get:function(){return ie}}]),o}();g(document).on(re.CLICK_DATA_API,ge,function(t){var e,n=this,i=_.getSelectorFromElement(this);i&&(e=document.querySelector(i));var o=g(e).data(te)?"toggle":l({},g(e).data(),g(this).data());"A"!==this.tagName&&"AREA"!==this.tagName||t.preventDefault();var r=g(e).one(re.SHOW,function(t){t.isDefaultPrevented()||r.one(re.HIDDEN,function(){g(n).is(":visible")&&n.focus()})});ve._jQueryInterface.call(g(e),o,this)}),g.fn[Zt]=ve._jQueryInterface,g.fn[Zt].Constructor=ve,g.fn[Zt].noConflict=function(){return g.fn[Zt]=ne,ve._jQueryInterface};var ye=["background","cite","href","itemtype","longdesc","poster","src","xlink:href"],Ee={"*":["class","dir","id","lang","role",/^aria-[\w-]*$/i],a:["target","href","title","rel"],area:[],b:[],br:[],col:[],code:[],div:[],em:[],hr:[],h1:[],h2:[],h3:[],h4:[],h5:[],h6:[],i:[],img:["src","alt","title","width","height"],li:[],ol:[],p:[],pre:[],s:[],small:[],span:[],sub:[],sup:[],strong:[],u:[],ul:[]},Ce=/^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi,Te=/^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;function Se(t,s,e){if(0===t.length)return t;if(e&&"function"==typeof e)return e(t);for(var n=(new window.DOMParser).parseFromString(t,"text/html"),a=Object.keys(s),l=[].slice.call(n.body.querySelectorAll("*")),i=function(t,e){var n=l[t],i=n.nodeName.toLowerCase();if(-1===a.indexOf(n.nodeName.toLowerCase()))return n.parentNode.removeChild(n),"continue";var o=[].slice.call(n.attributes),r=[].concat(s["*"]||[],s[i]||[]);o.forEach(function(t){(function(t,e){var n=t.nodeName.toLowerCase();if(-1!==e.indexOf(n))return-1===ye.indexOf(n)||Boolean(t.nodeValue.match(Ce)||t.nodeValue.match(Te));for(var i=e.filter(function(t){return t instanceof RegExp}),o=0,r=i.length;o<r;o++)if(n.match(i[o]))return!0;return!1})(t,r)||n.removeAttribute(t.nodeName)})},o=0,r=l.length;o<r;o++)i(o);return n.body.innerHTML}var be="tooltip",Ie="bs.tooltip",De="."+Ie,we=g.fn[be],Ae="bs-tooltip",Ne=new RegExp("(^|\\s)"+Ae+"\\S+","g"),Oe=["sanitize","whiteList","sanitizeFn"],ke={animation:"boolean",template:"string",title:"(string|element|function)",trigger:"string",delay:"(number|object)",html:"boolean",selector:"(string|boolean)",placement:"(string|function)",offset:"(number|string|function)",container:"(string|element|boolean)",fallbackPlacement:"(string|array)",boundary:"(string|element)",sanitize:"boolean",sanitizeFn:"(null|function)",whiteList:"object"},Pe={AUTO:"auto",TOP:"top",RIGHT:"right",BOTTOM:"bottom",LEFT:"left"},Le={animation:!0,template:'<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,selector:!1,placement:"top",offset:0,container:!1,fallbackPlacement:"flip",boundary:"scrollParent",sanitize:!0,sanitizeFn:null,whiteList:Ee},je="show",He="out",Re={HIDE:"hide"+De,HIDDEN:"hidden"+De,SHOW:"show"+De,SHOWN:"shown"+De,INSERTED:"inserted"+De,CLICK:"click"+De,FOCUSIN:"focusin"+De,FOCUSOUT:"focusout"+De,MOUSEENTER:"mouseenter"+De,MOUSELEAVE:"mouseleave"+De},xe="fade",Fe="show",Ue=".tooltip-inner",We=".arrow",qe="hover",Me="focus",Ke="click",Qe="manual",Be=function(){function i(t,e){if("undefined"==typeof u)throw new TypeError("Bootstrap's tooltips require Popper.js (https://popper.js.org/)");this._isEnabled=!0,this._timeout=0,this._hoverState="",this._activeTrigger={},this._popper=null,this.element=t,this.config=this._getConfig(e),this.tip=null,this._setListeners()}var t=i.prototype;return t.enable=function(){this._isEnabled=!0},t.disable=function(){this._isEnabled=!1},t.toggleEnabled=function(){this._isEnabled=!this._isEnabled},t.toggle=function(t){if(this._isEnabled)if(t){var e=this.constructor.DATA_KEY,n=g(t.currentTarget).data(e);n||(n=new this.constructor(t.currentTarget,this._getDelegateConfig()),g(t.currentTarget).data(e,n)),n._activeTrigger.click=!n._activeTrigger.click,n._isWithActiveTrigger()?n._enter(null,n):n._leave(null,n)}else{if(g(this.getTipElement()).hasClass(Fe))return void this._leave(null,this);this._enter(null,this)}},t.dispose=function(){clearTimeout(this._timeout),g.removeData(this.element,this.constructor.DATA_KEY),g(this.element).off(this.constructor.EVENT_KEY),g(this.element).closest(".modal").off("hide.bs.modal"),this.tip&&g(this.tip).remove(),this._isEnabled=null,this._timeout=null,this._hoverState=null,(this._activeTrigger=null)!==this._popper&&this._popper.destroy(),this._popper=null,this.element=null,this.config=null,this.tip=null},t.show=function(){var e=this;if("none"===g(this.element).css("display"))throw new Error("Please use show on visible elements");var t=g.Event(this.constructor.Event.SHOW);if(this.isWithContent()&&this._isEnabled){g(this.element).trigger(t);var n=_.findShadowRoot(this.element),i=g.contains(null!==n?n:this.element.ownerDocument.documentElement,this.element);if(t.isDefaultPrevented()||!i)return;var o=this.getTipElement(),r=_.getUID(this.constructor.NAME);o.setAttribute("id",r),this.element.setAttribute("aria-describedby",r),this.setContent(),this.config.animation&&g(o).addClass(xe);var s="function"==typeof this.config.placement?this.config.placement.call(this,o,this.element):this.config.placement,a=this._getAttachment(s);this.addAttachmentClass(a);var l=this._getContainer();g(o).data(this.constructor.DATA_KEY,this),g.contains(this.element.ownerDocument.documentElement,this.tip)||g(o).appendTo(l),g(this.element).trigger(this.constructor.Event.INSERTED),this._popper=new u(this.element,o,{placement:a,modifiers:{offset:this._getOffset(),flip:{behavior:this.config.fallbackPlacement},arrow:{element:We},preventOverflow:{boundariesElement:this.config.boundary}},onCreate:function(t){t.originalPlacement!==t.placement&&e._handlePopperPlacementChange(t)},onUpdate:function(t){return e._handlePopperPlacementChange(t)}}),g(o).addClass(Fe),"ontouchstart"in document.documentElement&&g(document.body).children().on("mouseover",null,g.noop);var c=function(){e.config.animation&&e._fixTransition();var t=e._hoverState;e._hoverState=null,g(e.element).trigger(e.constructor.Event.SHOWN),t===He&&e._leave(null,e)};if(g(this.tip).hasClass(xe)){var h=_.getTransitionDurationFromElement(this.tip);g(this.tip).one(_.TRANSITION_END,c).emulateTransitionEnd(h)}else c()}},t.hide=function(t){var e=this,n=this.getTipElement(),i=g.Event(this.constructor.Event.HIDE),o=function(){e._hoverState!==je&&n.parentNode&&n.parentNode.removeChild(n),e._cleanTipClass(),e.element.removeAttribute("aria-describedby"),g(e.element).trigger(e.constructor.Event.HIDDEN),null!==e._popper&&e._popper.destroy(),t&&t()};if(g(this.element).trigger(i),!i.isDefaultPrevented()){if(g(n).removeClass(Fe),"ontouchstart"in document.documentElement&&g(document.body).children().off("mouseover",null,g.noop),this._activeTrigger[Ke]=!1,this._activeTrigger[Me]=!1,this._activeTrigger[qe]=!1,g(this.tip).hasClass(xe)){var r=_.getTransitionDurationFromElement(n);g(n).one(_.TRANSITION_END,o).emulateTransitionEnd(r)}else o();this._hoverState=""}},t.update=function(){null!==this._popper&&this._popper.scheduleUpdate()},t.isWithContent=function(){return Boolean(this.getTitle())},t.addAttachmentClass=function(t){g(this.getTipElement()).addClass(Ae+"-"+t)},t.getTipElement=function(){return this.tip=this.tip||g(this.config.template)[0],this.tip},t.setContent=function(){var t=this.getTipElement();this.setElementContent(g(t.querySelectorAll(Ue)),this.getTitle()),g(t).removeClass(xe+" "+Fe)},t.setElementContent=function(t,e){"object"!=typeof e||!e.nodeType&&!e.jquery?this.config.html?(this.config.sanitize&&(e=Se(e,this.config.whiteList,this.config.sanitizeFn)),t.html(e)):t.text(e):this.config.html?g(e).parent().is(t)||t.empty().append(e):t.text(g(e).text())},t.getTitle=function(){var t=this.element.getAttribute("data-original-title");return t||(t="function"==typeof this.config.title?this.config.title.call(this.element):this.config.title),t},t._getOffset=function(){var e=this,t={};return"function"==typeof this.config.offset?t.fn=function(t){return t.offsets=l({},t.offsets,e.config.offset(t.offsets,e.element)||{}),t}:t.offset=this.config.offset,t},t._getContainer=function(){return!1===this.config.container?document.body:_.isElement(this.config.container)?g(this.config.container):g(document).find(this.config.container)},t._getAttachment=function(t){return Pe[t.toUpperCase()]},t._setListeners=function(){var i=this;this.config.trigger.split(" ").forEach(function(t){if("click"===t)g(i.element).on(i.constructor.Event.CLICK,i.config.selector,function(t){return i.toggle(t)});else if(t!==Qe){var e=t===qe?i.constructor.Event.MOUSEENTER:i.constructor.Event.FOCUSIN,n=t===qe?i.constructor.Event.MOUSELEAVE:i.constructor.Event.FOCUSOUT;g(i.element).on(e,i.config.selector,function(t){return i._enter(t)}).on(n,i.config.selector,function(t){return i._leave(t)})}}),g(this.element).closest(".modal").on("hide.bs.modal",function(){i.element&&i.hide()}),this.config.selector?this.config=l({},this.config,{trigger:"manual",selector:""}):this._fixTitle()},t._fixTitle=function(){var t=typeof this.element.getAttribute("data-original-title");(this.element.getAttribute("title")||"string"!==t)&&(this.element.setAttribute("data-original-title",this.element.getAttribute("title")||""),this.element.setAttribute("title",""))},t._enter=function(t,e){var n=this.constructor.DATA_KEY;(e=e||g(t.currentTarget).data(n))||(e=new this.constructor(t.currentTarget,this._getDelegateConfig()),g(t.currentTarget).data(n,e)),t&&(e._activeTrigger["focusin"===t.type?Me:qe]=!0),g(e.getTipElement()).hasClass(Fe)||e._hoverState===je?e._hoverState=je:(clearTimeout(e._timeout),e._hoverState=je,e.config.delay&&e.config.delay.show?e._timeout=setTimeout(function(){e._hoverState===je&&e.show()},e.config.delay.show):e.show())},t._leave=function(t,e){var n=this.constructor.DATA_KEY;(e=e||g(t.currentTarget).data(n))||(e=new this.constructor(t.currentTarget,this._getDelegateConfig()),g(t.currentTarget).data(n,e)),t&&(e._activeTrigger["focusout"===t.type?Me:qe]=!1),e._isWithActiveTrigger()||(clearTimeout(e._timeout),e._hoverState=He,e.config.delay&&e.config.delay.hide?e._timeout=setTimeout(function(){e._hoverState===He&&e.hide()},e.config.delay.hide):e.hide())},t._isWithActiveTrigger=function(){for(var t in this._activeTrigger)if(this._activeTrigger[t])return!0;return!1},t._getConfig=function(t){var e=g(this.element).data();return Object.keys(e).forEach(function(t){-1!==Oe.indexOf(t)&&delete e[t]}),"number"==typeof(t=l({},this.constructor.Default,e,"object"==typeof t&&t?t:{})).delay&&(t.delay={show:t.delay,hide:t.delay}),"number"==typeof t.title&&(t.title=t.title.toString()),"number"==typeof t.content&&(t.content=t.content.toString()),_.typeCheckConfig(be,t,this.constructor.DefaultType),t.sanitize&&(t.template=Se(t.template,t.whiteList,t.sanitizeFn)),t},t._getDelegateConfig=function(){var t={};if(this.config)for(var e in this.config)this.constructor.Default[e]!==this.config[e]&&(t[e]=this.config[e]);return t},t._cleanTipClass=function(){var t=g(this.getTipElement()),e=t.attr("class").match(Ne);null!==e&&e.length&&t.removeClass(e.join(""))},t._handlePopperPlacementChange=function(t){var e=t.instance;this.tip=e.popper,this._cleanTipClass(),this.addAttachmentClass(this._getAttachment(t.placement))},t._fixTransition=function(){var t=this.getTipElement(),e=this.config.animation;null===t.getAttribute("x-placement")&&(g(t).removeClass(xe),this.config.animation=!1,this.hide(),this.show(),this.config.animation=e)},i._jQueryInterface=function(n){return this.each(function(){var t=g(this).data(Ie),e="object"==typeof n&&n;if((t||!/dispose|hide/.test(n))&&(t||(t=new i(this,e),g(this).data(Ie,t)),"string"==typeof n)){if("undefined"==typeof t[n])throw new TypeError('No method named "'+n+'"');t[n]()}})},s(i,null,[{key:"VERSION",get:function(){return"4.3.1"}},{key:"Default",get:function(){return Le}},{key:"NAME",get:function(){return be}},{key:"DATA_KEY",get:function(){return Ie}},{key:"Event",get:function(){return Re}},{key:"EVENT_KEY",get:function(){return De}},{key:"DefaultType",get:function(){return ke}}]),i}();g.fn[be]=Be._jQueryInterface,g.fn[be].Constructor=Be,g.fn[be].noConflict=function(){return g.fn[be]=we,Be._jQueryInterface};var Ve="popover",Ye="bs.popover",ze="."+Ye,Xe=g.fn[Ve],$e="bs-popover",Ge=new RegExp("(^|\\s)"+$e+"\\S+","g"),Je=l({},Be.Default,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'}),Ze=l({},Be.DefaultType,{content:"(string|element|function)"}),tn="fade",en="show",nn=".popover-header",on=".popover-body",rn={HIDE:"hide"+ze,HIDDEN:"hidden"+ze,SHOW:"show"+ze,SHOWN:"shown"+ze,INSERTED:"inserted"+ze,CLICK:"click"+ze,FOCUSIN:"focusin"+ze,FOCUSOUT:"focusout"+ze,MOUSEENTER:"mouseenter"+ze,MOUSELEAVE:"mouseleave"+ze},sn=function(t){var e,n;function i(){return t.apply(this,arguments)||this}n=t,(e=i).prototype=Object.create(n.prototype),(e.prototype.constructor=e).__proto__=n;var o=i.prototype;return o.isWithContent=function(){return this.getTitle()||this._getContent()},o.addAttachmentClass=function(t){g(this.getTipElement()).addClass($e+"-"+t)},o.getTipElement=function(){return this.tip=this.tip||g(this.config.template)[0],this.tip},o.setContent=function(){var t=g(this.getTipElement());this.setElementContent(t.find(nn),this.getTitle());var e=this._getContent();"function"==typeof e&&(e=e.call(this.element)),this.setElementContent(t.find(on),e),t.removeClass(tn+" "+en)},o._getContent=function(){return this.element.getAttribute("data-content")||this.config.content},o._cleanTipClass=function(){var t=g(this.getTipElement()),e=t.attr("class").match(Ge);null!==e&&0<e.length&&t.removeClass(e.join(""))},i._jQueryInterface=function(n){return this.each(function(){var t=g(this).data(Ye),e="object"==typeof n?n:null;if((t||!/dispose|hide/.test(n))&&(t||(t=new i(this,e),g(this).data(Ye,t)),"string"==typeof n)){if("undefined"==typeof t[n])throw new TypeError('No method named "'+n+'"');t[n]()}})},s(i,null,[{key:"VERSION",get:function(){return"4.3.1"}},{key:"Default",get:function(){return Je}},{key:"NAME",get:function(){return Ve}},{key:"DATA_KEY",get:function(){return Ye}},{key:"Event",get:function(){return rn}},{key:"EVENT_KEY",get:function(){return ze}},{key:"DefaultType",get:function(){return Ze}}]),i}(Be);g.fn[Ve]=sn._jQueryInterface,g.fn[Ve].Constructor=sn,g.fn[Ve].noConflict=function(){return g.fn[Ve]=Xe,sn._jQueryInterface};var an="scrollspy",ln="bs.scrollspy",cn="."+ln,hn=g.fn[an],un={offset:10,method:"auto",target:""},fn={offset:"number",method:"string",target:"(string|element)"},dn={ACTIVATE:"activate"+cn,SCROLL:"scroll"+cn,LOAD_DATA_API:"load"+cn+".data-api"},gn="dropdown-item",_n="active",mn='[data-spy="scroll"]',pn=".nav, .list-group",vn=".nav-link",yn=".nav-item",En=".list-group-item",Cn=".dropdown",Tn=".dropdown-item",Sn=".dropdown-toggle",bn="offset",In="position",Dn=function(){function n(t,e){var n=this;this._element=t,this._scrollElement="BODY"===t.tagName?window:t,this._config=this._getConfig(e),this._selector=this._config.target+" "+vn+","+this._config.target+" "+En+","+this._config.target+" "+Tn,this._offsets=[],this._targets=[],this._activeTarget=null,this._scrollHeight=0,g(this._scrollElement).on(dn.SCROLL,function(t){return n._process(t)}),this.refresh(),this._process()}var t=n.prototype;return t.refresh=function(){var e=this,t=this._scrollElement===this._scrollElement.window?bn:In,o="auto"===this._config.method?t:this._config.method,r=o===In?this._getScrollTop():0;this._offsets=[],this._targets=[],this._scrollHeight=this._getScrollHeight(),[].slice.call(document.querySelectorAll(this._selector)).map(function(t){var e,n=_.getSelectorFromElement(t);if(n&&(e=document.querySelector(n)),e){var i=e.getBoundingClientRect();if(i.width||i.height)return[g(e)[o]().top+r,n]}return null}).filter(function(t){return t}).sort(function(t,e){return t[0]-e[0]}).forEach(function(t){e._offsets.push(t[0]),e._targets.push(t[1])})},t.dispose=function(){g.removeData(this._element,ln),g(this._scrollElement).off(cn),this._element=null,this._scrollElement=null,this._config=null,this._selector=null,this._offsets=null,this._targets=null,this._activeTarget=null,this._scrollHeight=null},t._getConfig=function(t){if("string"!=typeof(t=l({},un,"object"==typeof t&&t?t:{})).target){var e=g(t.target).attr("id");e||(e=_.getUID(an),g(t.target).attr("id",e)),t.target="#"+e}return _.typeCheckConfig(an,t,fn),t},t._getScrollTop=function(){return this._scrollElement===window?this._scrollElement.pageYOffset:this._scrollElement.scrollTop},t._getScrollHeight=function(){return this._scrollElement.scrollHeight||Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)},t._getOffsetHeight=function(){return this._scrollElement===window?window.innerHeight:this._scrollElement.getBoundingClientRect().height},t._process=function(){var t=this._getScrollTop()+this._config.offset,e=this._getScrollHeight(),n=this._config.offset+e-this._getOffsetHeight();if(this._scrollHeight!==e&&this.refresh(),n<=t){var i=this._targets[this._targets.length-1];this._activeTarget!==i&&this._activate(i)}else{if(this._activeTarget&&t<this._offsets[0]&&0<this._offsets[0])return this._activeTarget=null,void this._clear();for(var o=this._offsets.length;o--;){this._activeTarget!==this._targets[o]&&t>=this._offsets[o]&&("undefined"==typeof this._offsets[o+1]||t<this._offsets[o+1])&&this._activate(this._targets[o])}}},t._activate=function(e){this._activeTarget=e,this._clear();var t=this._selector.split(",").map(function(t){return t+'[data-target="'+e+'"],'+t+'[href="'+e+'"]'}),n=g([].slice.call(document.querySelectorAll(t.join(","))));n.hasClass(gn)?(n.closest(Cn).find(Sn).addClass(_n),n.addClass(_n)):(n.addClass(_n),n.parents(pn).prev(vn+", "+En).addClass(_n),n.parents(pn).prev(yn).children(vn).addClass(_n)),g(this._scrollElement).trigger(dn.ACTIVATE,{relatedTarget:e})},t._clear=function(){[].slice.call(document.querySelectorAll(this._selector)).filter(function(t){return t.classList.contains(_n)}).forEach(function(t){return t.classList.remove(_n)})},n._jQueryInterface=function(e){return this.each(function(){var t=g(this).data(ln);if(t||(t=new n(this,"object"==typeof e&&e),g(this).data(ln,t)),"string"==typeof e){if("undefined"==typeof t[e])throw new TypeError('No method named "'+e+'"');t[e]()}})},s(n,null,[{key:"VERSION",get:function(){return"4.3.1"}},{key:"Default",get:function(){return un}}]),n}();g(window).on(dn.LOAD_DATA_API,function(){for(var t=[].slice.call(document.querySelectorAll(mn)),e=t.length;e--;){var n=g(t[e]);Dn._jQueryInterface.call(n,n.data())}}),g.fn[an]=Dn._jQueryInterface,g.fn[an].Constructor=Dn,g.fn[an].noConflict=function(){return g.fn[an]=hn,Dn._jQueryInterface};var wn="bs.tab",An="."+wn,Nn=g.fn.tab,On={HIDE:"hide"+An,HIDDEN:"hidden"+An,SHOW:"show"+An,SHOWN:"shown"+An,CLICK_DATA_API:"click"+An+".data-api"},kn="dropdown-menu",Pn="active",Ln="disabled",jn="fade",Hn="show",Rn=".dropdown",xn=".nav, .list-group",Fn=".active",Un="> li > .active",Wn='[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',qn=".dropdown-toggle",Mn="> .dropdown-menu .active",Kn=function(){function i(t){this._element=t}var t=i.prototype;return t.show=function(){var n=this;if(!(this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE&&g(this._element).hasClass(Pn)||g(this._element).hasClass(Ln))){var t,i,e=g(this._element).closest(xn)[0],o=_.getSelectorFromElement(this._element);if(e){var r="UL"===e.nodeName||"OL"===e.nodeName?Un:Fn;i=(i=g.makeArray(g(e).find(r)))[i.length-1]}var s=g.Event(On.HIDE,{relatedTarget:this._element}),a=g.Event(On.SHOW,{relatedTarget:i});if(i&&g(i).trigger(s),g(this._element).trigger(a),!a.isDefaultPrevented()&&!s.isDefaultPrevented()){o&&(t=document.querySelector(o)),this._activate(this._element,e);var l=function(){var t=g.Event(On.HIDDEN,{relatedTarget:n._element}),e=g.Event(On.SHOWN,{relatedTarget:i});g(i).trigger(t),g(n._element).trigger(e)};t?this._activate(t,t.parentNode,l):l()}}},t.dispose=function(){g.removeData(this._element,wn),this._element=null},t._activate=function(t,e,n){var i=this,o=(!e||"UL"!==e.nodeName&&"OL"!==e.nodeName?g(e).children(Fn):g(e).find(Un))[0],r=n&&o&&g(o).hasClass(jn),s=function(){return i._transitionComplete(t,o,n)};if(o&&r){var a=_.getTransitionDurationFromElement(o);g(o).removeClass(Hn).one(_.TRANSITION_END,s).emulateTransitionEnd(a)}else s()},t._transitionComplete=function(t,e,n){if(e){g(e).removeClass(Pn);var i=g(e.parentNode).find(Mn)[0];i&&g(i).removeClass(Pn),"tab"===e.getAttribute("role")&&e.setAttribute("aria-selected",!1)}if(g(t).addClass(Pn),"tab"===t.getAttribute("role")&&t.setAttribute("aria-selected",!0),_.reflow(t),t.classList.contains(jn)&&t.classList.add(Hn),t.parentNode&&g(t.parentNode).hasClass(kn)){var o=g(t).closest(Rn)[0];if(o){var r=[].slice.call(o.querySelectorAll(qn));g(r).addClass(Pn)}t.setAttribute("aria-expanded",!0)}n&&n()},i._jQueryInterface=function(n){return this.each(function(){var t=g(this),e=t.data(wn);if(e||(e=new i(this),t.data(wn,e)),"string"==typeof n){if("undefined"==typeof e[n])throw new TypeError('No method named "'+n+'"');e[n]()}})},s(i,null,[{key:"VERSION",get:function(){return"4.3.1"}}]),i}();g(document).on(On.CLICK_DATA_API,Wn,function(t){t.preventDefault(),Kn._jQueryInterface.call(g(this),"show")}),g.fn.tab=Kn._jQueryInterface,g.fn.tab.Constructor=Kn,g.fn.tab.noConflict=function(){return g.fn.tab=Nn,Kn._jQueryInterface};var Qn="toast",Bn="bs.toast",Vn="."+Bn,Yn=g.fn[Qn],zn={CLICK_DISMISS:"click.dismiss"+Vn,HIDE:"hide"+Vn,HIDDEN:"hidden"+Vn,SHOW:"show"+Vn,SHOWN:"shown"+Vn},Xn="fade",$n="hide",Gn="show",Jn="showing",Zn={animation:"boolean",autohide:"boolean",delay:"number"},ti={animation:!0,autohide:!0,delay:500},ei='[data-dismiss="toast"]',ni=function(){function i(t,e){this._element=t,this._config=this._getConfig(e),this._timeout=null,this._setListeners()}var t=i.prototype;return t.show=function(){var t=this;g(this._element).trigger(zn.SHOW),this._config.animation&&this._element.classList.add(Xn);var e=function(){t._element.classList.remove(Jn),t._element.classList.add(Gn),g(t._element).trigger(zn.SHOWN),t._config.autohide&&t.hide()};if(this._element.classList.remove($n),this._element.classList.add(Jn),this._config.animation){var n=_.getTransitionDurationFromElement(this._element);g(this._element).one(_.TRANSITION_END,e).emulateTransitionEnd(n)}else e()},t.hide=function(t){var e=this;this._element.classList.contains(Gn)&&(g(this._element).trigger(zn.HIDE),t?this._close():this._timeout=setTimeout(function(){e._close()},this._config.delay))},t.dispose=function(){clearTimeout(this._timeout),this._timeout=null,this._element.classList.contains(Gn)&&this._element.classList.remove(Gn),g(this._element).off(zn.CLICK_DISMISS),g.removeData(this._element,Bn),this._element=null,this._config=null},t._getConfig=function(t){return t=l({},ti,g(this._element).data(),"object"==typeof t&&t?t:{}),_.typeCheckConfig(Qn,t,this.constructor.DefaultType),t},t._setListeners=function(){var t=this;g(this._element).on(zn.CLICK_DISMISS,ei,function(){return t.hide(!0)})},t._close=function(){var t=this,e=function(){t._element.classList.add($n),g(t._element).trigger(zn.HIDDEN)};if(this._element.classList.remove(Gn),this._config.animation){var n=_.getTransitionDurationFromElement(this._element);g(this._element).one(_.TRANSITION_END,e).emulateTransitionEnd(n)}else e()},i._jQueryInterface=function(n){return this.each(function(){var t=g(this),e=t.data(Bn);if(e||(e=new i(this,"object"==typeof n&&n),t.data(Bn,e)),"string"==typeof n){if("undefined"==typeof e[n])throw new TypeError('No method named "'+n+'"');e[n](this)}})},s(i,null,[{key:"VERSION",get:function(){return"4.3.1"}},{key:"DefaultType",get:function(){return Zn}},{key:"Default",get:function(){return ti}}]),i}();g.fn[Qn]=ni._jQueryInterface,g.fn[Qn].Constructor=ni,g.fn[Qn].noConflict=function(){return g.fn[Qn]=Yn,ni._jQueryInterface},function(){if("undefined"==typeof g)throw new TypeError("Bootstrap's JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript.");var t=g.fn.jquery.split(" ")[0].split(".");if(t[0]<2&&t[1]<9||1===t[0]&&9===t[1]&&t[2]<1||4<=t[0])throw new Error("Bootstrap's JavaScript requires at least jQuery v1.9.1 but less than v4.0.0")}(),t.Util=_,t.Alert=p,t.Button=P,t.Carousel=lt,t.Collapse=bt,t.Dropdown=Jt,t.Modal=ve,t.Popover=sn,t.Scrollspy=Dn,t.Tab=Kn,t.Toast=ni,t.Tooltip=Be,Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=bootstrap.min.js.map
/**
 * @fileoverview dragscroll - scroll area by dragging
 * @version 0.0.8
 * 
 * @license MIT, see http://github.com/asvd/dragscroll
 * @copyright 2015 asvd <heliosframework@gmail.com> 
 */


(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory((root.dragscroll = {}));
    }
}(this, function (exports) {
    var _window = window;
    var _document = document;
    var mousemove = 'mousemove';
    var mouseup = 'mouseup';
    var mousedown = 'mousedown';
    var EventListener = 'EventListener';
    var addEventListener = 'add'+EventListener;
    var removeEventListener = 'remove'+EventListener;
    var newScrollX, newScrollY;

    var dragged = [];
    var reset = function(i, el) {
        for (i = 0; i < dragged.length;) {
            el = dragged[i++];
            el = el.container || el;
            el[removeEventListener](mousedown, el.md, 0);
            _window[removeEventListener](mouseup, el.mu, 0);
            _window[removeEventListener](mousemove, el.mm, 0);
        }

        // cloning into array since HTMLCollection is updated dynamically
        dragged = [].slice.call(_document.getElementsByClassName('dragscroll'));
        for (i = 0; i < dragged.length;) {
            (function(el, lastClientX, lastClientY, pushed, scroller, cont){
                (cont = el.container || el)[addEventListener](
                    mousedown,
                    cont.md = function(e) {
                        if (!el.hasAttribute('nochilddrag') ||
                            _document.elementFromPoint(
                                e.pageX, e.pageY
                            ) == cont
                        ) {
                            pushed = 1;
                            lastClientX = e.clientX;
                            lastClientY = e.clientY;

                            e.preventDefault();
                        }
                    }, 0
                );

                _window[addEventListener](
                    mouseup, cont.mu = function() {pushed = 0;}, 0
                );

                _window[addEventListener](
                    mousemove,
                    cont.mm = function(e) {
                        if (pushed) {
                            (scroller = el.scroller||el).scrollLeft -=
                                newScrollX = (- lastClientX + (lastClientX=e.clientX));
                            scroller.scrollTop -=
                                newScrollY = (- lastClientY + (lastClientY=e.clientY));
                            if (el == _document.body) {
                                (scroller = _document.documentElement).scrollLeft -= newScrollX;
                                scroller.scrollTop -= newScrollY;
                            }
                        }
                    }, 0
                );
             })(dragged[i++]);
        }
    }

      
    if (_document.readyState == 'complete') {
        reset();
    } else {
        _window[addEventListener]('load', reset, 0);
    }

    exports.reset = reset;
}));

/*!
 * imagesLoaded PACKAGED v4.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

!function(e,t){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",t):"object"==typeof module&&module.exports?module.exports=t():e.EvEmitter=t()}("undefined"!=typeof window?window:this,function(){function e(){}var t=e.prototype;return t.on=function(e,t){if(e&&t){var i=this._events=this._events||{},n=i[e]=i[e]||[];return n.indexOf(t)==-1&&n.push(t),this}},t.once=function(e,t){if(e&&t){this.on(e,t);var i=this._onceEvents=this._onceEvents||{},n=i[e]=i[e]||{};return n[t]=!0,this}},t.off=function(e,t){var i=this._events&&this._events[e];if(i&&i.length){var n=i.indexOf(t);return n!=-1&&i.splice(n,1),this}},t.emitEvent=function(e,t){var i=this._events&&this._events[e];if(i&&i.length){i=i.slice(0),t=t||[];for(var n=this._onceEvents&&this._onceEvents[e],o=0;o<i.length;o++){var r=i[o],s=n&&n[r];s&&(this.off(e,r),delete n[r]),r.apply(this,t)}return this}},t.allOff=function(){delete this._events,delete this._onceEvents},e}),function(e,t){"use strict";"function"==typeof define&&define.amd?define(["ev-emitter/ev-emitter"],function(i){return t(e,i)}):"object"==typeof module&&module.exports?module.exports=t(e,require("ev-emitter")):e.imagesLoaded=t(e,e.EvEmitter)}("undefined"!=typeof window?window:this,function(e,t){function i(e,t){for(var i in t)e[i]=t[i];return e}function n(e){if(Array.isArray(e))return e;var t="object"==typeof e&&"number"==typeof e.length;return t?d.call(e):[e]}function o(e,t,r){if(!(this instanceof o))return new o(e,t,r);var s=e;return"string"==typeof e&&(s=document.querySelectorAll(e)),s?(this.elements=n(s),this.options=i({},this.options),"function"==typeof t?r=t:i(this.options,t),r&&this.on("always",r),this.getImages(),h&&(this.jqDeferred=new h.Deferred),void setTimeout(this.check.bind(this))):void a.error("Bad element for imagesLoaded "+(s||e))}function r(e){this.img=e}function s(e,t){this.url=e,this.element=t,this.img=new Image}var h=e.jQuery,a=e.console,d=Array.prototype.slice;o.prototype=Object.create(t.prototype),o.prototype.options={},o.prototype.getImages=function(){this.images=[],this.elements.forEach(this.addElementImages,this)},o.prototype.addElementImages=function(e){"IMG"==e.nodeName&&this.addImage(e),this.options.background===!0&&this.addElementBackgroundImages(e);var t=e.nodeType;if(t&&u[t]){for(var i=e.querySelectorAll("img"),n=0;n<i.length;n++){var o=i[n];this.addImage(o)}if("string"==typeof this.options.background){var r=e.querySelectorAll(this.options.background);for(n=0;n<r.length;n++){var s=r[n];this.addElementBackgroundImages(s)}}}};var u={1:!0,9:!0,11:!0};return o.prototype.addElementBackgroundImages=function(e){var t=getComputedStyle(e);if(t)for(var i=/url\((['"])?(.*?)\1\)/gi,n=i.exec(t.backgroundImage);null!==n;){var o=n&&n[2];o&&this.addBackground(o,e),n=i.exec(t.backgroundImage)}},o.prototype.addImage=function(e){var t=new r(e);this.images.push(t)},o.prototype.addBackground=function(e,t){var i=new s(e,t);this.images.push(i)},o.prototype.check=function(){function e(e,i,n){setTimeout(function(){t.progress(e,i,n)})}var t=this;return this.progressedCount=0,this.hasAnyBroken=!1,this.images.length?void this.images.forEach(function(t){t.once("progress",e),t.check()}):void this.complete()},o.prototype.progress=function(e,t,i){this.progressedCount++,this.hasAnyBroken=this.hasAnyBroken||!e.isLoaded,this.emitEvent("progress",[this,e,t]),this.jqDeferred&&this.jqDeferred.notify&&this.jqDeferred.notify(this,e),this.progressedCount==this.images.length&&this.complete(),this.options.debug&&a&&a.log("progress: "+i,e,t)},o.prototype.complete=function(){var e=this.hasAnyBroken?"fail":"done";if(this.isComplete=!0,this.emitEvent(e,[this]),this.emitEvent("always",[this]),this.jqDeferred){var t=this.hasAnyBroken?"reject":"resolve";this.jqDeferred[t](this)}},r.prototype=Object.create(t.prototype),r.prototype.check=function(){var e=this.getIsImageComplete();return e?void this.confirm(0!==this.img.naturalWidth,"naturalWidth"):(this.proxyImage=new Image,this.proxyImage.addEventListener("load",this),this.proxyImage.addEventListener("error",this),this.img.addEventListener("load",this),this.img.addEventListener("error",this),void(this.proxyImage.src=this.img.src))},r.prototype.getIsImageComplete=function(){return this.img.complete&&this.img.naturalWidth},r.prototype.confirm=function(e,t){this.isLoaded=e,this.emitEvent("progress",[this,this.img,t])},r.prototype.handleEvent=function(e){var t="on"+e.type;this[t]&&this[t](e)},r.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindEvents()},r.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindEvents()},r.prototype.unbindEvents=function(){this.proxyImage.removeEventListener("load",this),this.proxyImage.removeEventListener("error",this),this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},s.prototype=Object.create(r.prototype),s.prototype.check=function(){this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.img.src=this.url;var e=this.getIsImageComplete();e&&(this.confirm(0!==this.img.naturalWidth,"naturalWidth"),this.unbindEvents())},s.prototype.unbindEvents=function(){this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},s.prototype.confirm=function(e,t){this.isLoaded=e,this.emitEvent("progress",[this,this.element,t])},o.makeJQueryPlugin=function(t){t=t||e.jQuery,t&&(h=t,h.fn.imagesLoaded=function(e,t){var i=new o(this,e,t);return i.jqDeferred.promise(h(this))})},o.makeJQueryPlugin(),o});
/*!
 * in-view 0.6.1 - Get notified when a DOM element enters or exits the viewport.
 * Copyright (c) 2016 Cam Wiegert <cam@camwiegert.com> - https://camwiegert.github.io/in-view
 * License: MIT
 */
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.inView=e():t.inView=e()}(this,function(){return function(t){function e(r){if(n[r])return n[r].exports;var i=n[r]={exports:{},id:r,loaded:!1};return t[r].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}var i=n(2),o=r(i);t.exports=o["default"]},function(t,e){function n(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}t.exports=n},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(9),o=r(i),u=n(3),f=r(u),s=n(4),c=function(){if("undefined"!=typeof window){var t=100,e=["scroll","resize","load"],n={history:[]},r={offset:{},threshold:0,test:s.inViewport},i=(0,o["default"])(function(){n.history.forEach(function(t){n[t].check()})},t);e.forEach(function(t){return addEventListener(t,i)}),window.MutationObserver&&addEventListener("DOMContentLoaded",function(){new MutationObserver(i).observe(document.body,{attributes:!0,childList:!0,subtree:!0})});var u=function(t){if("string"==typeof t){var e=[].slice.call(document.querySelectorAll(t));return n.history.indexOf(t)>-1?n[t].elements=e:(n[t]=(0,f["default"])(e,r),n.history.push(t)),n[t]}};return u.offset=function(t){if(void 0===t)return r.offset;var e=function(t){return"number"==typeof t};return["top","right","bottom","left"].forEach(e(t)?function(e){return r.offset[e]=t}:function(n){return e(t[n])?r.offset[n]=t[n]:null}),r.offset},u.threshold=function(t){return"number"==typeof t&&t>=0&&t<=1?r.threshold=t:r.threshold},u.test=function(t){return"function"==typeof t?r.test=t:r.test},u.is=function(t){return r.test(t,r)},u.offset(0),u}};e["default"]=c()},function(t,e){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),i=function(){function t(e,r){n(this,t),this.options=r,this.elements=e,this.current=[],this.handlers={enter:[],exit:[]},this.singles={enter:[],exit:[]}}return r(t,[{key:"check",value:function(){var t=this;return this.elements.forEach(function(e){var n=t.options.test(e,t.options),r=t.current.indexOf(e),i=r>-1,o=n&&!i,u=!n&&i;o&&(t.current.push(e),t.emit("enter",e)),u&&(t.current.splice(r,1),t.emit("exit",e))}),this}},{key:"on",value:function(t,e){return this.handlers[t].push(e),this}},{key:"once",value:function(t,e){return this.singles[t].unshift(e),this}},{key:"emit",value:function(t,e){for(;this.singles[t].length;)this.singles[t].pop()(e);for(var n=this.handlers[t].length;--n>-1;)this.handlers[t][n](e);return this}}]),t}();e["default"]=function(t,e){return new i(t,e)}},function(t,e){"use strict";function n(t,e){var n=t.getBoundingClientRect(),r=n.top,i=n.right,o=n.bottom,u=n.left,f=n.width,s=n.height,c={t:o,r:window.innerWidth-u,b:window.innerHeight-r,l:i},a={x:e.threshold*f,y:e.threshold*s};return c.t>e.offset.top+a.y&&c.r>e.offset.right+a.x&&c.b>e.offset.bottom+a.y&&c.l>e.offset.left+a.x}Object.defineProperty(e,"__esModule",{value:!0}),e.inViewport=n},function(t,e){(function(e){var n="object"==typeof e&&e&&e.Object===Object&&e;t.exports=n}).call(e,function(){return this}())},function(t,e,n){var r=n(5),i="object"==typeof self&&self&&self.Object===Object&&self,o=r||i||Function("return this")();t.exports=o},function(t,e,n){function r(t,e,n){function r(e){var n=x,r=m;return x=m=void 0,E=e,w=t.apply(r,n)}function a(t){return E=t,j=setTimeout(h,e),M?r(t):w}function l(t){var n=t-O,r=t-E,i=e-n;return _?c(i,g-r):i}function d(t){var n=t-O,r=t-E;return void 0===O||n>=e||n<0||_&&r>=g}function h(){var t=o();return d(t)?p(t):void(j=setTimeout(h,l(t)))}function p(t){return j=void 0,T&&x?r(t):(x=m=void 0,w)}function v(){void 0!==j&&clearTimeout(j),E=0,x=O=m=j=void 0}function y(){return void 0===j?w:p(o())}function b(){var t=o(),n=d(t);if(x=arguments,m=this,O=t,n){if(void 0===j)return a(O);if(_)return j=setTimeout(h,e),r(O)}return void 0===j&&(j=setTimeout(h,e)),w}var x,m,g,w,j,O,E=0,M=!1,_=!1,T=!0;if("function"!=typeof t)throw new TypeError(f);return e=u(e)||0,i(n)&&(M=!!n.leading,_="maxWait"in n,g=_?s(u(n.maxWait)||0,e):g,T="trailing"in n?!!n.trailing:T),b.cancel=v,b.flush=y,b}var i=n(1),o=n(8),u=n(10),f="Expected a function",s=Math.max,c=Math.min;t.exports=r},function(t,e,n){var r=n(6),i=function(){return r.Date.now()};t.exports=i},function(t,e,n){function r(t,e,n){var r=!0,f=!0;if("function"!=typeof t)throw new TypeError(u);return o(n)&&(r="leading"in n?!!n.leading:r,f="trailing"in n?!!n.trailing:f),i(t,e,{leading:r,maxWait:e,trailing:f})}var i=n(7),o=n(1),u="Expected a function";t.exports=r},function(t,e){function n(t){return t}t.exports=n}])});
/*!
 * Isotope PACKAGED v3.0.6
 *
 * Licensed GPLv3 for open source use
 * or Isotope Commercial License for commercial use
 *
 * https://isotope.metafizzy.co
 * Copyright 2010-2018 Metafizzy
 */

!function(t,e){"function"==typeof define&&define.amd?define("jquery-bridget/jquery-bridget",["jquery"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("jquery")):t.jQueryBridget=e(t,t.jQuery)}(window,function(t,e){"use strict";function i(i,s,a){function u(t,e,o){var n,s="$()."+i+'("'+e+'")';return t.each(function(t,u){var h=a.data(u,i);if(!h)return void r(i+" not initialized. Cannot call methods, i.e. "+s);var d=h[e];if(!d||"_"==e.charAt(0))return void r(s+" is not a valid method");var l=d.apply(h,o);n=void 0===n?l:n}),void 0!==n?n:t}function h(t,e){t.each(function(t,o){var n=a.data(o,i);n?(n.option(e),n._init()):(n=new s(o,e),a.data(o,i,n))})}a=a||e||t.jQuery,a&&(s.prototype.option||(s.prototype.option=function(t){a.isPlainObject(t)&&(this.options=a.extend(!0,this.options,t))}),a.fn[i]=function(t){if("string"==typeof t){var e=n.call(arguments,1);return u(this,t,e)}return h(this,t),this},o(a))}function o(t){!t||t&&t.bridget||(t.bridget=i)}var n=Array.prototype.slice,s=t.console,r="undefined"==typeof s?function(){}:function(t){s.error(t)};return o(e||t.jQuery),i}),function(t,e){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",e):"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}("undefined"!=typeof window?window:this,function(){function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var i=this._events=this._events||{},o=i[t]=i[t]||[];return o.indexOf(e)==-1&&o.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var i=this._onceEvents=this._onceEvents||{},o=i[t]=i[t]||{};return o[e]=!0,this}},e.off=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var o=i.indexOf(e);return o!=-1&&i.splice(o,1),this}},e.emitEvent=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){i=i.slice(0),e=e||[];for(var o=this._onceEvents&&this._onceEvents[t],n=0;n<i.length;n++){var s=i[n],r=o&&o[s];r&&(this.off(t,s),delete o[s]),s.apply(this,e)}return this}},e.allOff=function(){delete this._events,delete this._onceEvents},t}),function(t,e){"function"==typeof define&&define.amd?define("get-size/get-size",e):"object"==typeof module&&module.exports?module.exports=e():t.getSize=e()}(window,function(){"use strict";function t(t){var e=parseFloat(t),i=t.indexOf("%")==-1&&!isNaN(e);return i&&e}function e(){}function i(){for(var t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},e=0;e<h;e++){var i=u[e];t[i]=0}return t}function o(t){var e=getComputedStyle(t);return e||a("Style returned "+e+". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1"),e}function n(){if(!d){d=!0;var e=document.createElement("div");e.style.width="200px",e.style.padding="1px 2px 3px 4px",e.style.borderStyle="solid",e.style.borderWidth="1px 2px 3px 4px",e.style.boxSizing="border-box";var i=document.body||document.documentElement;i.appendChild(e);var n=o(e);r=200==Math.round(t(n.width)),s.isBoxSizeOuter=r,i.removeChild(e)}}function s(e){if(n(),"string"==typeof e&&(e=document.querySelector(e)),e&&"object"==typeof e&&e.nodeType){var s=o(e);if("none"==s.display)return i();var a={};a.width=e.offsetWidth,a.height=e.offsetHeight;for(var d=a.isBorderBox="border-box"==s.boxSizing,l=0;l<h;l++){var f=u[l],c=s[f],m=parseFloat(c);a[f]=isNaN(m)?0:m}var p=a.paddingLeft+a.paddingRight,y=a.paddingTop+a.paddingBottom,g=a.marginLeft+a.marginRight,v=a.marginTop+a.marginBottom,_=a.borderLeftWidth+a.borderRightWidth,z=a.borderTopWidth+a.borderBottomWidth,I=d&&r,x=t(s.width);x!==!1&&(a.width=x+(I?0:p+_));var S=t(s.height);return S!==!1&&(a.height=S+(I?0:y+z)),a.innerWidth=a.width-(p+_),a.innerHeight=a.height-(y+z),a.outerWidth=a.width+g,a.outerHeight=a.height+v,a}}var r,a="undefined"==typeof console?e:function(t){console.error(t)},u=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"],h=u.length,d=!1;return s}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("desandro-matches-selector/matches-selector",e):"object"==typeof module&&module.exports?module.exports=e():t.matchesSelector=e()}(window,function(){"use strict";var t=function(){var t=window.Element.prototype;if(t.matches)return"matches";if(t.matchesSelector)return"matchesSelector";for(var e=["webkit","moz","ms","o"],i=0;i<e.length;i++){var o=e[i],n=o+"MatchesSelector";if(t[n])return n}}();return function(e,i){return e[t](i)}}),function(t,e){"function"==typeof define&&define.amd?define("fizzy-ui-utils/utils",["desandro-matches-selector/matches-selector"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("desandro-matches-selector")):t.fizzyUIUtils=e(t,t.matchesSelector)}(window,function(t,e){var i={};i.extend=function(t,e){for(var i in e)t[i]=e[i];return t},i.modulo=function(t,e){return(t%e+e)%e};var o=Array.prototype.slice;i.makeArray=function(t){if(Array.isArray(t))return t;if(null===t||void 0===t)return[];var e="object"==typeof t&&"number"==typeof t.length;return e?o.call(t):[t]},i.removeFrom=function(t,e){var i=t.indexOf(e);i!=-1&&t.splice(i,1)},i.getParent=function(t,i){for(;t.parentNode&&t!=document.body;)if(t=t.parentNode,e(t,i))return t},i.getQueryElement=function(t){return"string"==typeof t?document.querySelector(t):t},i.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},i.filterFindElements=function(t,o){t=i.makeArray(t);var n=[];return t.forEach(function(t){if(t instanceof HTMLElement){if(!o)return void n.push(t);e(t,o)&&n.push(t);for(var i=t.querySelectorAll(o),s=0;s<i.length;s++)n.push(i[s])}}),n},i.debounceMethod=function(t,e,i){i=i||100;var o=t.prototype[e],n=e+"Timeout";t.prototype[e]=function(){var t=this[n];clearTimeout(t);var e=arguments,s=this;this[n]=setTimeout(function(){o.apply(s,e),delete s[n]},i)}},i.docReady=function(t){var e=document.readyState;"complete"==e||"interactive"==e?setTimeout(t):document.addEventListener("DOMContentLoaded",t)},i.toDashed=function(t){return t.replace(/(.)([A-Z])/g,function(t,e,i){return e+"-"+i}).toLowerCase()};var n=t.console;return i.htmlInit=function(e,o){i.docReady(function(){var s=i.toDashed(o),r="data-"+s,a=document.querySelectorAll("["+r+"]"),u=document.querySelectorAll(".js-"+s),h=i.makeArray(a).concat(i.makeArray(u)),d=r+"-options",l=t.jQuery;h.forEach(function(t){var i,s=t.getAttribute(r)||t.getAttribute(d);try{i=s&&JSON.parse(s)}catch(a){return void(n&&n.error("Error parsing "+r+" on "+t.className+": "+a))}var u=new e(t,i);l&&l.data(t,o,u)})})},i}),function(t,e){"function"==typeof define&&define.amd?define("outlayer/item",["ev-emitter/ev-emitter","get-size/get-size"],e):"object"==typeof module&&module.exports?module.exports=e(require("ev-emitter"),require("get-size")):(t.Outlayer={},t.Outlayer.Item=e(t.EvEmitter,t.getSize))}(window,function(t,e){"use strict";function i(t){for(var e in t)return!1;return e=null,!0}function o(t,e){t&&(this.element=t,this.layout=e,this.position={x:0,y:0},this._create())}function n(t){return t.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})}var s=document.documentElement.style,r="string"==typeof s.transition?"transition":"WebkitTransition",a="string"==typeof s.transform?"transform":"WebkitTransform",u={WebkitTransition:"webkitTransitionEnd",transition:"transitionend"}[r],h={transform:a,transition:r,transitionDuration:r+"Duration",transitionProperty:r+"Property",transitionDelay:r+"Delay"},d=o.prototype=Object.create(t.prototype);d.constructor=o,d._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},d.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},d.getSize=function(){this.size=e(this.element)},d.css=function(t){var e=this.element.style;for(var i in t){var o=h[i]||i;e[o]=t[i]}},d.getPosition=function(){var t=getComputedStyle(this.element),e=this.layout._getOption("originLeft"),i=this.layout._getOption("originTop"),o=t[e?"left":"right"],n=t[i?"top":"bottom"],s=parseFloat(o),r=parseFloat(n),a=this.layout.size;o.indexOf("%")!=-1&&(s=s/100*a.width),n.indexOf("%")!=-1&&(r=r/100*a.height),s=isNaN(s)?0:s,r=isNaN(r)?0:r,s-=e?a.paddingLeft:a.paddingRight,r-=i?a.paddingTop:a.paddingBottom,this.position.x=s,this.position.y=r},d.layoutPosition=function(){var t=this.layout.size,e={},i=this.layout._getOption("originLeft"),o=this.layout._getOption("originTop"),n=i?"paddingLeft":"paddingRight",s=i?"left":"right",r=i?"right":"left",a=this.position.x+t[n];e[s]=this.getXValue(a),e[r]="";var u=o?"paddingTop":"paddingBottom",h=o?"top":"bottom",d=o?"bottom":"top",l=this.position.y+t[u];e[h]=this.getYValue(l),e[d]="",this.css(e),this.emitEvent("layout",[this])},d.getXValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&!e?t/this.layout.size.width*100+"%":t+"px"},d.getYValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&e?t/this.layout.size.height*100+"%":t+"px"},d._transitionTo=function(t,e){this.getPosition();var i=this.position.x,o=this.position.y,n=t==this.position.x&&e==this.position.y;if(this.setPosition(t,e),n&&!this.isTransitioning)return void this.layoutPosition();var s=t-i,r=e-o,a={};a.transform=this.getTranslate(s,r),this.transition({to:a,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})},d.getTranslate=function(t,e){var i=this.layout._getOption("originLeft"),o=this.layout._getOption("originTop");return t=i?t:-t,e=o?e:-e,"translate3d("+t+"px, "+e+"px, 0)"},d.goTo=function(t,e){this.setPosition(t,e),this.layoutPosition()},d.moveTo=d._transitionTo,d.setPosition=function(t,e){this.position.x=parseFloat(t),this.position.y=parseFloat(e)},d._nonTransition=function(t){this.css(t.to),t.isCleaning&&this._removeStyles(t.to);for(var e in t.onTransitionEnd)t.onTransitionEnd[e].call(this)},d.transition=function(t){if(!parseFloat(this.layout.options.transitionDuration))return void this._nonTransition(t);var e=this._transn;for(var i in t.onTransitionEnd)e.onEnd[i]=t.onTransitionEnd[i];for(i in t.to)e.ingProperties[i]=!0,t.isCleaning&&(e.clean[i]=!0);if(t.from){this.css(t.from);var o=this.element.offsetHeight;o=null}this.enableTransition(t.to),this.css(t.to),this.isTransitioning=!0};var l="opacity,"+n(a);d.enableTransition=function(){if(!this.isTransitioning){var t=this.layout.options.transitionDuration;t="number"==typeof t?t+"ms":t,this.css({transitionProperty:l,transitionDuration:t,transitionDelay:this.staggerDelay||0}),this.element.addEventListener(u,this,!1)}},d.onwebkitTransitionEnd=function(t){this.ontransitionend(t)},d.onotransitionend=function(t){this.ontransitionend(t)};var f={"-webkit-transform":"transform"};d.ontransitionend=function(t){if(t.target===this.element){var e=this._transn,o=f[t.propertyName]||t.propertyName;if(delete e.ingProperties[o],i(e.ingProperties)&&this.disableTransition(),o in e.clean&&(this.element.style[t.propertyName]="",delete e.clean[o]),o in e.onEnd){var n=e.onEnd[o];n.call(this),delete e.onEnd[o]}this.emitEvent("transitionEnd",[this])}},d.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(u,this,!1),this.isTransitioning=!1},d._removeStyles=function(t){var e={};for(var i in t)e[i]="";this.css(e)};var c={transitionProperty:"",transitionDuration:"",transitionDelay:""};return d.removeTransitionStyles=function(){this.css(c)},d.stagger=function(t){t=isNaN(t)?0:t,this.staggerDelay=t+"ms"},d.removeElem=function(){this.element.parentNode.removeChild(this.element),this.css({display:""}),this.emitEvent("remove",[this])},d.remove=function(){return r&&parseFloat(this.layout.options.transitionDuration)?(this.once("transitionEnd",function(){this.removeElem()}),void this.hide()):void this.removeElem()},d.reveal=function(){delete this.isHidden,this.css({display:""});var t=this.layout.options,e={},i=this.getHideRevealTransitionEndProperty("visibleStyle");e[i]=this.onRevealTransitionEnd,this.transition({from:t.hiddenStyle,to:t.visibleStyle,isCleaning:!0,onTransitionEnd:e})},d.onRevealTransitionEnd=function(){this.isHidden||this.emitEvent("reveal")},d.getHideRevealTransitionEndProperty=function(t){var e=this.layout.options[t];if(e.opacity)return"opacity";for(var i in e)return i},d.hide=function(){this.isHidden=!0,this.css({display:""});var t=this.layout.options,e={},i=this.getHideRevealTransitionEndProperty("hiddenStyle");e[i]=this.onHideTransitionEnd,this.transition({from:t.visibleStyle,to:t.hiddenStyle,isCleaning:!0,onTransitionEnd:e})},d.onHideTransitionEnd=function(){this.isHidden&&(this.css({display:"none"}),this.emitEvent("hide"))},d.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},o}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("outlayer/outlayer",["ev-emitter/ev-emitter","get-size/get-size","fizzy-ui-utils/utils","./item"],function(i,o,n,s){return e(t,i,o,n,s)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter"),require("get-size"),require("fizzy-ui-utils"),require("./item")):t.Outlayer=e(t,t.EvEmitter,t.getSize,t.fizzyUIUtils,t.Outlayer.Item)}(window,function(t,e,i,o,n){"use strict";function s(t,e){var i=o.getQueryElement(t);if(!i)return void(u&&u.error("Bad element for "+this.constructor.namespace+": "+(i||t)));this.element=i,h&&(this.$element=h(this.element)),this.options=o.extend({},this.constructor.defaults),this.option(e);var n=++l;this.element.outlayerGUID=n,f[n]=this,this._create();var s=this._getOption("initLayout");s&&this.layout()}function r(t){function e(){t.apply(this,arguments)}return e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e}function a(t){if("number"==typeof t)return t;var e=t.match(/(^\d*\.?\d*)(\w*)/),i=e&&e[1],o=e&&e[2];if(!i.length)return 0;i=parseFloat(i);var n=m[o]||1;return i*n}var u=t.console,h=t.jQuery,d=function(){},l=0,f={};s.namespace="outlayer",s.Item=n,s.defaults={containerStyle:{position:"relative"},initLayout:!0,originLeft:!0,originTop:!0,resize:!0,resizeContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}};var c=s.prototype;o.extend(c,e.prototype),c.option=function(t){o.extend(this.options,t)},c._getOption=function(t){var e=this.constructor.compatOptions[t];return e&&void 0!==this.options[e]?this.options[e]:this.options[t]},s.compatOptions={initLayout:"isInitLayout",horizontal:"isHorizontal",layoutInstant:"isLayoutInstant",originLeft:"isOriginLeft",originTop:"isOriginTop",resize:"isResizeBound",resizeContainer:"isResizingContainer"},c._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),o.extend(this.element.style,this.options.containerStyle);var t=this._getOption("resize");t&&this.bindResize()},c.reloadItems=function(){this.items=this._itemize(this.element.children)},c._itemize=function(t){for(var e=this._filterFindItemElements(t),i=this.constructor.Item,o=[],n=0;n<e.length;n++){var s=e[n],r=new i(s,this);o.push(r)}return o},c._filterFindItemElements=function(t){return o.filterFindElements(t,this.options.itemSelector)},c.getItemElements=function(){return this.items.map(function(t){return t.element})},c.layout=function(){this._resetLayout(),this._manageStamps();var t=this._getOption("layoutInstant"),e=void 0!==t?t:!this._isLayoutInited;this.layoutItems(this.items,e),this._isLayoutInited=!0},c._init=c.layout,c._resetLayout=function(){this.getSize()},c.getSize=function(){this.size=i(this.element)},c._getMeasurement=function(t,e){var o,n=this.options[t];n?("string"==typeof n?o=this.element.querySelector(n):n instanceof HTMLElement&&(o=n),this[t]=o?i(o)[e]:n):this[t]=0},c.layoutItems=function(t,e){t=this._getItemsForLayout(t),this._layoutItems(t,e),this._postLayout()},c._getItemsForLayout=function(t){return t.filter(function(t){return!t.isIgnored})},c._layoutItems=function(t,e){if(this._emitCompleteOnItems("layout",t),t&&t.length){var i=[];t.forEach(function(t){var o=this._getItemLayoutPosition(t);o.item=t,o.isInstant=e||t.isLayoutInstant,i.push(o)},this),this._processLayoutQueue(i)}},c._getItemLayoutPosition=function(){return{x:0,y:0}},c._processLayoutQueue=function(t){this.updateStagger(),t.forEach(function(t,e){this._positionItem(t.item,t.x,t.y,t.isInstant,e)},this)},c.updateStagger=function(){var t=this.options.stagger;return null===t||void 0===t?void(this.stagger=0):(this.stagger=a(t),this.stagger)},c._positionItem=function(t,e,i,o,n){o?t.goTo(e,i):(t.stagger(n*this.stagger),t.moveTo(e,i))},c._postLayout=function(){this.resizeContainer()},c.resizeContainer=function(){var t=this._getOption("resizeContainer");if(t){var e=this._getContainerSize();e&&(this._setContainerMeasure(e.width,!0),this._setContainerMeasure(e.height,!1))}},c._getContainerSize=d,c._setContainerMeasure=function(t,e){if(void 0!==t){var i=this.size;i.isBorderBox&&(t+=e?i.paddingLeft+i.paddingRight+i.borderLeftWidth+i.borderRightWidth:i.paddingBottom+i.paddingTop+i.borderTopWidth+i.borderBottomWidth),t=Math.max(t,0),this.element.style[e?"width":"height"]=t+"px"}},c._emitCompleteOnItems=function(t,e){function i(){n.dispatchEvent(t+"Complete",null,[e])}function o(){r++,r==s&&i()}var n=this,s=e.length;if(!e||!s)return void i();var r=0;e.forEach(function(e){e.once(t,o)})},c.dispatchEvent=function(t,e,i){var o=e?[e].concat(i):i;if(this.emitEvent(t,o),h)if(this.$element=this.$element||h(this.element),e){var n=h.Event(e);n.type=t,this.$element.trigger(n,i)}else this.$element.trigger(t,i)},c.ignore=function(t){var e=this.getItem(t);e&&(e.isIgnored=!0)},c.unignore=function(t){var e=this.getItem(t);e&&delete e.isIgnored},c.stamp=function(t){t=this._find(t),t&&(this.stamps=this.stamps.concat(t),t.forEach(this.ignore,this))},c.unstamp=function(t){t=this._find(t),t&&t.forEach(function(t){o.removeFrom(this.stamps,t),this.unignore(t)},this)},c._find=function(t){if(t)return"string"==typeof t&&(t=this.element.querySelectorAll(t)),t=o.makeArray(t)},c._manageStamps=function(){this.stamps&&this.stamps.length&&(this._getBoundingRect(),this.stamps.forEach(this._manageStamp,this))},c._getBoundingRect=function(){var t=this.element.getBoundingClientRect(),e=this.size;this._boundingRect={left:t.left+e.paddingLeft+e.borderLeftWidth,top:t.top+e.paddingTop+e.borderTopWidth,right:t.right-(e.paddingRight+e.borderRightWidth),bottom:t.bottom-(e.paddingBottom+e.borderBottomWidth)}},c._manageStamp=d,c._getElementOffset=function(t){var e=t.getBoundingClientRect(),o=this._boundingRect,n=i(t),s={left:e.left-o.left-n.marginLeft,top:e.top-o.top-n.marginTop,right:o.right-e.right-n.marginRight,bottom:o.bottom-e.bottom-n.marginBottom};return s},c.handleEvent=o.handleEvent,c.bindResize=function(){t.addEventListener("resize",this),this.isResizeBound=!0},c.unbindResize=function(){t.removeEventListener("resize",this),this.isResizeBound=!1},c.onresize=function(){this.resize()},o.debounceMethod(s,"onresize",100),c.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},c.needsResizeLayout=function(){var t=i(this.element),e=this.size&&t;return e&&t.innerWidth!==this.size.innerWidth},c.addItems=function(t){var e=this._itemize(t);return e.length&&(this.items=this.items.concat(e)),e},c.appended=function(t){var e=this.addItems(t);e.length&&(this.layoutItems(e,!0),this.reveal(e))},c.prepended=function(t){var e=this._itemize(t);if(e.length){var i=this.items.slice(0);this.items=e.concat(i),this._resetLayout(),this._manageStamps(),this.layoutItems(e,!0),this.reveal(e),this.layoutItems(i)}},c.reveal=function(t){if(this._emitCompleteOnItems("reveal",t),t&&t.length){var e=this.updateStagger();t.forEach(function(t,i){t.stagger(i*e),t.reveal()})}},c.hide=function(t){if(this._emitCompleteOnItems("hide",t),t&&t.length){var e=this.updateStagger();t.forEach(function(t,i){t.stagger(i*e),t.hide()})}},c.revealItemElements=function(t){var e=this.getItems(t);this.reveal(e)},c.hideItemElements=function(t){var e=this.getItems(t);this.hide(e)},c.getItem=function(t){for(var e=0;e<this.items.length;e++){var i=this.items[e];if(i.element==t)return i}},c.getItems=function(t){t=o.makeArray(t);var e=[];return t.forEach(function(t){var i=this.getItem(t);i&&e.push(i)},this),e},c.remove=function(t){var e=this.getItems(t);this._emitCompleteOnItems("remove",e),e&&e.length&&e.forEach(function(t){t.remove(),o.removeFrom(this.items,t)},this)},c.destroy=function(){var t=this.element.style;t.height="",t.position="",t.width="",this.items.forEach(function(t){t.destroy()}),this.unbindResize();var e=this.element.outlayerGUID;delete f[e],delete this.element.outlayerGUID,h&&h.removeData(this.element,this.constructor.namespace)},s.data=function(t){t=o.getQueryElement(t);var e=t&&t.outlayerGUID;return e&&f[e]},s.create=function(t,e){var i=r(s);return i.defaults=o.extend({},s.defaults),o.extend(i.defaults,e),i.compatOptions=o.extend({},s.compatOptions),i.namespace=t,i.data=s.data,i.Item=r(n),o.htmlInit(i,t),h&&h.bridget&&h.bridget(t,i),i};var m={ms:1,s:1e3};return s.Item=n,s}),function(t,e){"function"==typeof define&&define.amd?define("isotope-layout/js/item",["outlayer/outlayer"],e):"object"==typeof module&&module.exports?module.exports=e(require("outlayer")):(t.Isotope=t.Isotope||{},t.Isotope.Item=e(t.Outlayer))}(window,function(t){"use strict";function e(){t.Item.apply(this,arguments)}var i=e.prototype=Object.create(t.Item.prototype),o=i._create;i._create=function(){this.id=this.layout.itemGUID++,o.call(this),this.sortData={}},i.updateSortData=function(){if(!this.isIgnored){this.sortData.id=this.id,this.sortData["original-order"]=this.id,this.sortData.random=Math.random();var t=this.layout.options.getSortData,e=this.layout._sorters;for(var i in t){var o=e[i];this.sortData[i]=o(this.element,this)}}};var n=i.destroy;return i.destroy=function(){n.apply(this,arguments),this.css({display:""})},e}),function(t,e){"function"==typeof define&&define.amd?define("isotope-layout/js/layout-mode",["get-size/get-size","outlayer/outlayer"],e):"object"==typeof module&&module.exports?module.exports=e(require("get-size"),require("outlayer")):(t.Isotope=t.Isotope||{},t.Isotope.LayoutMode=e(t.getSize,t.Outlayer))}(window,function(t,e){"use strict";function i(t){this.isotope=t,t&&(this.options=t.options[this.namespace],this.element=t.element,this.items=t.filteredItems,this.size=t.size)}var o=i.prototype,n=["_resetLayout","_getItemLayoutPosition","_manageStamp","_getContainerSize","_getElementOffset","needsResizeLayout","_getOption"];return n.forEach(function(t){o[t]=function(){return e.prototype[t].apply(this.isotope,arguments)}}),o.needsVerticalResizeLayout=function(){var e=t(this.isotope.element),i=this.isotope.size&&e;return i&&e.innerHeight!=this.isotope.size.innerHeight},o._getMeasurement=function(){this.isotope._getMeasurement.apply(this,arguments)},o.getColumnWidth=function(){this.getSegmentSize("column","Width")},o.getRowHeight=function(){this.getSegmentSize("row","Height")},o.getSegmentSize=function(t,e){var i=t+e,o="outer"+e;if(this._getMeasurement(i,o),!this[i]){var n=this.getFirstItemSize();this[i]=n&&n[o]||this.isotope.size["inner"+e]}},o.getFirstItemSize=function(){var e=this.isotope.filteredItems[0];return e&&e.element&&t(e.element)},o.layout=function(){this.isotope.layout.apply(this.isotope,arguments)},o.getSize=function(){this.isotope.getSize(),this.size=this.isotope.size},i.modes={},i.create=function(t,e){function n(){i.apply(this,arguments)}return n.prototype=Object.create(o),n.prototype.constructor=n,e&&(n.options=e),n.prototype.namespace=t,i.modes[t]=n,n},i}),function(t,e){"function"==typeof define&&define.amd?define("masonry-layout/masonry",["outlayer/outlayer","get-size/get-size"],e):"object"==typeof module&&module.exports?module.exports=e(require("outlayer"),require("get-size")):t.Masonry=e(t.Outlayer,t.getSize)}(window,function(t,e){var i=t.create("masonry");i.compatOptions.fitWidth="isFitWidth";var o=i.prototype;return o._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns(),this.colYs=[];for(var t=0;t<this.cols;t++)this.colYs.push(0);this.maxY=0,this.horizontalColIndex=0},o.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var t=this.items[0],i=t&&t.element;this.columnWidth=i&&e(i).outerWidth||this.containerWidth}var o=this.columnWidth+=this.gutter,n=this.containerWidth+this.gutter,s=n/o,r=o-n%o,a=r&&r<1?"round":"floor";s=Math[a](s),this.cols=Math.max(s,1)},o.getContainerWidth=function(){var t=this._getOption("fitWidth"),i=t?this.element.parentNode:this.element,o=e(i);this.containerWidth=o&&o.innerWidth},o._getItemLayoutPosition=function(t){t.getSize();var e=t.size.outerWidth%this.columnWidth,i=e&&e<1?"round":"ceil",o=Math[i](t.size.outerWidth/this.columnWidth);o=Math.min(o,this.cols);for(var n=this.options.horizontalOrder?"_getHorizontalColPosition":"_getTopColPosition",s=this[n](o,t),r={x:this.columnWidth*s.col,y:s.y},a=s.y+t.size.outerHeight,u=o+s.col,h=s.col;h<u;h++)this.colYs[h]=a;return r},o._getTopColPosition=function(t){var e=this._getTopColGroup(t),i=Math.min.apply(Math,e);return{col:e.indexOf(i),y:i}},o._getTopColGroup=function(t){if(t<2)return this.colYs;for(var e=[],i=this.cols+1-t,o=0;o<i;o++)e[o]=this._getColGroupY(o,t);return e},o._getColGroupY=function(t,e){if(e<2)return this.colYs[t];var i=this.colYs.slice(t,t+e);return Math.max.apply(Math,i)},o._getHorizontalColPosition=function(t,e){var i=this.horizontalColIndex%this.cols,o=t>1&&i+t>this.cols;i=o?0:i;var n=e.size.outerWidth&&e.size.outerHeight;return this.horizontalColIndex=n?i+t:this.horizontalColIndex,{col:i,y:this._getColGroupY(i,t)}},o._manageStamp=function(t){var i=e(t),o=this._getElementOffset(t),n=this._getOption("originLeft"),s=n?o.left:o.right,r=s+i.outerWidth,a=Math.floor(s/this.columnWidth);a=Math.max(0,a);var u=Math.floor(r/this.columnWidth);u-=r%this.columnWidth?0:1,u=Math.min(this.cols-1,u);for(var h=this._getOption("originTop"),d=(h?o.top:o.bottom)+i.outerHeight,l=a;l<=u;l++)this.colYs[l]=Math.max(d,this.colYs[l])},o._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var t={height:this.maxY};return this._getOption("fitWidth")&&(t.width=this._getContainerFitWidth()),t},o._getContainerFitWidth=function(){for(var t=0,e=this.cols;--e&&0===this.colYs[e];)t++;return(this.cols-t)*this.columnWidth-this.gutter},o.needsResizeLayout=function(){var t=this.containerWidth;return this.getContainerWidth(),t!=this.containerWidth},i}),function(t,e){"function"==typeof define&&define.amd?define("isotope-layout/js/layout-modes/masonry",["../layout-mode","masonry-layout/masonry"],e):"object"==typeof module&&module.exports?module.exports=e(require("../layout-mode"),require("masonry-layout")):e(t.Isotope.LayoutMode,t.Masonry)}(window,function(t,e){"use strict";var i=t.create("masonry"),o=i.prototype,n={_getElementOffset:!0,layout:!0,_getMeasurement:!0};for(var s in e.prototype)n[s]||(o[s]=e.prototype[s]);var r=o.measureColumns;o.measureColumns=function(){this.items=this.isotope.filteredItems,r.call(this)};var a=o._getOption;return o._getOption=function(t){return"fitWidth"==t?void 0!==this.options.isFitWidth?this.options.isFitWidth:this.options.fitWidth:a.apply(this.isotope,arguments)},i}),function(t,e){"function"==typeof define&&define.amd?define("isotope-layout/js/layout-modes/fit-rows",["../layout-mode"],e):"object"==typeof exports?module.exports=e(require("../layout-mode")):e(t.Isotope.LayoutMode)}(window,function(t){"use strict";var e=t.create("fitRows"),i=e.prototype;return i._resetLayout=function(){this.x=0,this.y=0,this.maxY=0,this._getMeasurement("gutter","outerWidth")},i._getItemLayoutPosition=function(t){t.getSize();var e=t.size.outerWidth+this.gutter,i=this.isotope.size.innerWidth+this.gutter;0!==this.x&&e+this.x>i&&(this.x=0,this.y=this.maxY);var o={x:this.x,y:this.y};return this.maxY=Math.max(this.maxY,this.y+t.size.outerHeight),this.x+=e,o},i._getContainerSize=function(){return{height:this.maxY}},e}),function(t,e){"function"==typeof define&&define.amd?define("isotope-layout/js/layout-modes/vertical",["../layout-mode"],e):"object"==typeof module&&module.exports?module.exports=e(require("../layout-mode")):e(t.Isotope.LayoutMode)}(window,function(t){"use strict";var e=t.create("vertical",{horizontalAlignment:0}),i=e.prototype;return i._resetLayout=function(){this.y=0},i._getItemLayoutPosition=function(t){t.getSize();var e=(this.isotope.size.innerWidth-t.size.outerWidth)*this.options.horizontalAlignment,i=this.y;return this.y+=t.size.outerHeight,{x:e,y:i}},i._getContainerSize=function(){return{height:this.y}},e}),function(t,e){"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size","desandro-matches-selector/matches-selector","fizzy-ui-utils/utils","isotope-layout/js/item","isotope-layout/js/layout-mode","isotope-layout/js/layout-modes/masonry","isotope-layout/js/layout-modes/fit-rows","isotope-layout/js/layout-modes/vertical"],function(i,o,n,s,r,a){return e(t,i,o,n,s,r,a)}):"object"==typeof module&&module.exports?module.exports=e(t,require("outlayer"),require("get-size"),require("desandro-matches-selector"),require("fizzy-ui-utils"),require("isotope-layout/js/item"),require("isotope-layout/js/layout-mode"),require("isotope-layout/js/layout-modes/masonry"),require("isotope-layout/js/layout-modes/fit-rows"),require("isotope-layout/js/layout-modes/vertical")):t.Isotope=e(t,t.Outlayer,t.getSize,t.matchesSelector,t.fizzyUIUtils,t.Isotope.Item,t.Isotope.LayoutMode)}(window,function(t,e,i,o,n,s,r){function a(t,e){return function(i,o){for(var n=0;n<t.length;n++){var s=t[n],r=i.sortData[s],a=o.sortData[s];if(r>a||r<a){var u=void 0!==e[s]?e[s]:e,h=u?1:-1;return(r>a?1:-1)*h}}return 0}}var u=t.jQuery,h=String.prototype.trim?function(t){return t.trim()}:function(t){return t.replace(/^\s+|\s+$/g,"")},d=e.create("isotope",{layoutMode:"masonry",isJQueryFiltering:!0,sortAscending:!0});d.Item=s,d.LayoutMode=r;var l=d.prototype;l._create=function(){this.itemGUID=0,this._sorters={},this._getSorters(),e.prototype._create.call(this),this.modes={},this.filteredItems=this.items,this.sortHistory=["original-order"];for(var t in r.modes)this._initLayoutMode(t)},l.reloadItems=function(){this.itemGUID=0,e.prototype.reloadItems.call(this)},l._itemize=function(){for(var t=e.prototype._itemize.apply(this,arguments),i=0;i<t.length;i++){var o=t[i];o.id=this.itemGUID++}return this._updateItemsSortData(t),t},l._initLayoutMode=function(t){var e=r.modes[t],i=this.options[t]||{};this.options[t]=e.options?n.extend(e.options,i):i,this.modes[t]=new e(this)},l.layout=function(){return!this._isLayoutInited&&this._getOption("initLayout")?void this.arrange():void this._layout()},l._layout=function(){var t=this._getIsInstant();this._resetLayout(),this._manageStamps(),this.layoutItems(this.filteredItems,t),this._isLayoutInited=!0},l.arrange=function(t){this.option(t),this._getIsInstant();var e=this._filter(this.items);this.filteredItems=e.matches,this._bindArrangeComplete(),this._isInstant?this._noTransition(this._hideReveal,[e]):this._hideReveal(e),this._sort(),this._layout()},l._init=l.arrange,l._hideReveal=function(t){this.reveal(t.needReveal),this.hide(t.needHide)},l._getIsInstant=function(){var t=this._getOption("layoutInstant"),e=void 0!==t?t:!this._isLayoutInited;return this._isInstant=e,e},l._bindArrangeComplete=function(){function t(){e&&i&&o&&n.dispatchEvent("arrangeComplete",null,[n.filteredItems])}var e,i,o,n=this;this.once("layoutComplete",function(){e=!0,t()}),this.once("hideComplete",function(){i=!0,t()}),this.once("revealComplete",function(){o=!0,t()})},l._filter=function(t){var e=this.options.filter;e=e||"*";for(var i=[],o=[],n=[],s=this._getFilterTest(e),r=0;r<t.length;r++){var a=t[r];if(!a.isIgnored){var u=s(a);u&&i.push(a),u&&a.isHidden?o.push(a):u||a.isHidden||n.push(a)}}return{matches:i,needReveal:o,needHide:n}},l._getFilterTest=function(t){return u&&this.options.isJQueryFiltering?function(e){return u(e.element).is(t);
}:"function"==typeof t?function(e){return t(e.element)}:function(e){return o(e.element,t)}},l.updateSortData=function(t){var e;t?(t=n.makeArray(t),e=this.getItems(t)):e=this.items,this._getSorters(),this._updateItemsSortData(e)},l._getSorters=function(){var t=this.options.getSortData;for(var e in t){var i=t[e];this._sorters[e]=f(i)}},l._updateItemsSortData=function(t){for(var e=t&&t.length,i=0;e&&i<e;i++){var o=t[i];o.updateSortData()}};var f=function(){function t(t){if("string"!=typeof t)return t;var i=h(t).split(" "),o=i[0],n=o.match(/^\[(.+)\]$/),s=n&&n[1],r=e(s,o),a=d.sortDataParsers[i[1]];return t=a?function(t){return t&&a(r(t))}:function(t){return t&&r(t)}}function e(t,e){return t?function(e){return e.getAttribute(t)}:function(t){var i=t.querySelector(e);return i&&i.textContent}}return t}();d.sortDataParsers={parseInt:function(t){return parseInt(t,10)},parseFloat:function(t){return parseFloat(t)}},l._sort=function(){if(this.options.sortBy){var t=n.makeArray(this.options.sortBy);this._getIsSameSortBy(t)||(this.sortHistory=t.concat(this.sortHistory));var e=a(this.sortHistory,this.options.sortAscending);this.filteredItems.sort(e)}},l._getIsSameSortBy=function(t){for(var e=0;e<t.length;e++)if(t[e]!=this.sortHistory[e])return!1;return!0},l._mode=function(){var t=this.options.layoutMode,e=this.modes[t];if(!e)throw new Error("No layout mode: "+t);return e.options=this.options[t],e},l._resetLayout=function(){e.prototype._resetLayout.call(this),this._mode()._resetLayout()},l._getItemLayoutPosition=function(t){return this._mode()._getItemLayoutPosition(t)},l._manageStamp=function(t){this._mode()._manageStamp(t)},l._getContainerSize=function(){return this._mode()._getContainerSize()},l.needsResizeLayout=function(){return this._mode().needsResizeLayout()},l.appended=function(t){var e=this.addItems(t);if(e.length){var i=this._filterRevealAdded(e);this.filteredItems=this.filteredItems.concat(i)}},l.prepended=function(t){var e=this._itemize(t);if(e.length){this._resetLayout(),this._manageStamps();var i=this._filterRevealAdded(e);this.layoutItems(this.filteredItems),this.filteredItems=i.concat(this.filteredItems),this.items=e.concat(this.items)}},l._filterRevealAdded=function(t){var e=this._filter(t);return this.hide(e.needHide),this.reveal(e.matches),this.layoutItems(e.matches,!0),e.matches},l.insert=function(t){var e=this.addItems(t);if(e.length){var i,o,n=e.length;for(i=0;i<n;i++)o=e[i],this.element.appendChild(o.element);var s=this._filter(e).matches;for(i=0;i<n;i++)e[i].isLayoutInstant=!0;for(this.arrange(),i=0;i<n;i++)delete e[i].isLayoutInstant;this.reveal(s)}};var c=l.remove;return l.remove=function(t){t=n.makeArray(t);var e=this.getItems(t);c.call(this,t);for(var i=e&&e.length,o=0;i&&o<i;o++){var s=e[o];n.removeFrom(this.filteredItems,s)}},l.shuffle=function(){for(var t=0;t<this.items.length;t++){var e=this.items[t];e.sortData.random=Math.random()}this.options.sortBy="random",this._sort(),this._layout()},l._noTransition=function(t,e){var i=this.options.transitionDuration;this.options.transitionDuration=0;var o=t.apply(this,e);return this.options.transitionDuration=i,o},l.getFilteredItemElements=function(){return this.filteredItems.map(function(t){return t.element})},d});
/*!
 * OverlayScrollbars
 * https://github.com/KingSora/OverlayScrollbars
 *
 * Version: 1.12.0
 *
 * Copyright KingSora | Rene Haas.
 * https://github.com/KingSora
 *
 * Released under the MIT license.
 * Date: 30.03.2020
 */
!function(t,r){"function"==typeof define&&define.amd?define(["jquery"],function(n){return r(t,t.document,undefined,n)}):"object"==typeof module&&"object"==typeof module.exports?module.exports=r(t,t.document,undefined,require("jquery")):r(t,t.document,undefined,t.jQuery)}("undefined"!=typeof window?window:this,function(vi,di,hi,n){"use strict";var o,l,f,a,pi="object",bi="function",yi="array",mi="string",gi="boolean",wi="number",t="null",xi={c:"class",s:"style",i:"id",l:"length",p:"prototype",ti:"tabindex",oH:"offsetHeight",cH:"clientHeight",sH:"scrollHeight",oW:"offsetWidth",cW:"clientWidth",sW:"scrollWidth",hOP:"hasOwnProperty",bCR:"getBoundingClientRect"},_i=(o={},l={},{e:f=["-webkit-","-moz-","-o-","-ms-"],o:a=["WebKit","Moz","O","MS"],u:function(n){var t=l[n];if(l[xi.hOP](n))return t;for(var r,e,i,o=c(n),a=di.createElement("div")[xi.s],u=0;u<f.length;u++)for(i=f[u].replace(/-/g,""),r=[n,f[u]+n,i+o,c(i)+o],e=0;e<r[xi.l];e++)if(a[r[e]]!==hi){t=r[e];break}return l[n]=t},v:function(n,t,r){var e=n+" "+t,i=l[e];if(l[xi.hOP](e))return i;for(var o,a=di.createElement("div")[xi.s],u=t.split(" "),f=r||"",c=0,s=-1;c<u[xi.l];c++)for(;s<_i.e[xi.l];s++)if(o=s<0?u[c]:_i.e[s]+u[c],a.cssText=n+":"+o+f,a[xi.l]){i=o;break}return l[e]=i},d:function(n,t,r){var e=0,i=o[n];if(!o[xi.hOP](n)){for(i=vi[n];e<a[xi.l];e++)i=i||vi[(t?a[e]:a[e].toLowerCase())+c(n)];o[n]=i}return i||r}});function c(n){return n.charAt(0).toUpperCase()+n.slice(1)}var Si={wW:e(r,0,!0),wH:e(r,0),mO:e(_i.d,0,"MutationObserver",!0),rO:e(_i.d,0,"ResizeObserver",!0),rAF:e(_i.d,0,"requestAnimationFrame",!1,function(n){return vi.setTimeout(n,1e3/60)}),cAF:e(_i.d,0,"cancelAnimationFrame",!1,function(n){return vi.clearTimeout(n)}),now:function(){return Date.now&&Date.now()||(new Date).getTime()},stpP:function(n){n.stopPropagation?n.stopPropagation():n.cancelBubble=!0},prvD:function(n){n.preventDefault&&n.cancelable?n.preventDefault():n.returnValue=!1},page:function(n){var t=((n=n.originalEvent||n).target||n.srcElement||di).ownerDocument||di,r=t.documentElement,e=t.body;if(n.touches===hi)return!n.pageX&&n.clientX&&null!=n.clientX?{x:n.clientX+(r&&r.scrollLeft||e&&e.scrollLeft||0)-(r&&r.clientLeft||e&&e.clientLeft||0),y:n.clientY+(r&&r.scrollTop||e&&e.scrollTop||0)-(r&&r.clientTop||e&&e.clientTop||0)}:{x:n.pageX,y:n.pageY};var i=n.touches[0];return{x:i.pageX,y:i.pageY}},mBtn:function(n){var t=n.button;return n.which||t===hi?n.which:1&t?1:2&t?3:4&t?2:0},inA:function(n,t){for(var r=0;r<t[xi.l];r++)try{if(t[r]===n)return r}catch(e){}return-1},isA:function(n){var t=Array.isArray;return t?t(n):this.type(n)==yi},type:function(n){return n===hi||null===n?n+"":Object[xi.p].toString.call(n).replace(/^\[object (.+)\]$/,"$1").toLowerCase()},bind:e};function r(n){return n?vi.innerWidth||di.documentElement[xi.cW]||di.body[xi.cW]:vi.innerHeight||di.documentElement[xi.cH]||di.body[xi.cH]}function e(n,t){if(typeof n!=bi)throw"Can't bind function!";var r=xi.p,e=Array[r].slice.call(arguments,2),i=function(){},o=function(){return n.apply(this instanceof i?this:t,e.concat(Array[r].slice.call(arguments)))};return n[r]&&(i[r]=n[r]),o[r]=new i,o}var i,u,zi,s,v,L,N,d,h,p,b,y,m,g,Ti,Oi=Math,ki=n,Ci=(n.easing,n),Ai=(i=[],u="__overlayScrollbars__",function(n,t){var r=arguments[xi.l];if(r<1)return i;if(t)n[u]=t,i.push(n);else{var e=Si.inA(n,i);if(-1<e){if(!(1<r))return i[e][u];delete n[u],i.splice(e,1)}}}),w=(g=[],L=Si.type,y={className:["os-theme-dark",[t,mi]],resize:["none","n:none b:both h:horizontal v:vertical"],sizeAutoCapable:d=[!0,gi],clipAlways:d,normalizeRTL:d,paddingAbsolute:h=[!(N=[gi,wi,mi,yi,pi,bi,t]),gi],autoUpdate:[null,[t,gi]],autoUpdateInterval:[33,wi],updateOnLoad:[["img"],[mi,yi,t]],nativeScrollbarsOverlaid:{showNativeScrollbars:h,initialize:d},overflowBehavior:{x:["scroll",b="v-h:visible-hidden v-s:visible-scroll s:scroll h:hidden"],y:["scroll",b]},scrollbars:{visibility:["auto","v:visible h:hidden a:auto"],autoHide:["never","n:never s:scroll l:leave m:move"],autoHideDelay:[800,wi],dragScrolling:d,clickScrolling:h,touchSupport:d,snapHandle:h},textarea:{dynWidth:h,dynHeight:h,inheritedAttrs:[["style","class"],[mi,yi,t]]},callbacks:{onInitialized:p=[null,[t,bi]],onInitializationWithdrawn:p,onDestroyed:p,onScrollStart:p,onScroll:p,onScrollStop:p,onOverflowChanged:p,onOverflowAmountChanged:p,onDirectionChanged:p,onContentSizeChanged:p,onHostSizeChanged:p,onUpdated:p}},Ti={m:(m=function(i){var o=function(n){var t,r,e;for(t in n)n[xi.hOP](t)&&(r=n[t],(e=L(r))==yi?n[t]=r[i?1:0]:e==pi&&(n[t]=o(r)));return n};return o(Ci.extend(!0,{},y))})(),g:m(!0),_:function(n,t,C,r){var e={},i={},o=Ci.extend(!0,{},n),A=Ci.inArray,H=Ci.isEmptyObject,R=function(n,t,r,e,i,o){for(var a in t)if(t[xi.hOP](a)&&n[xi.hOP](a)){var u,f,c,s,l,v,d,h,p=!1,b=!1,y=t[a],m=L(y),g=m==pi,w=Si.isA(y)?y:[y],x=r[a],_=n[a],S=L(_),z=o?o+".":"",T='The option "'+z+a+"\" wasn't set, because",O=[],k=[];if(x=x===hi?{}:x,g&&S==pi)e[a]={},i[a]={},R(_,y,x,e[a],i[a],z+a),Ci.each([n,e,i],function(n,t){H(t[a])&&delete t[a]});else if(!g){for(v=0;v<w[xi.l];v++)if(l=w[v],c=(m=L(l))==mi&&-1===A(l,N))for(O.push(mi),u=l.split(" "),k=k.concat(u),d=0;d<u[xi.l];d++){for(s=(f=u[d].split(":"))[0],h=0;h<f[xi.l];h++)if(_===f[h]){p=!0;break}if(p)break}else if(O.push(l),S===l){p=!0;break}p?((b=_!==x)&&(e[a]=_),(c?A(x,f)<0:b)&&(i[a]=c?s:_)):C&&console.warn(T+" it doesn't accept the type [ "+S.toUpperCase()+' ] with the value of "'+_+'".\r\nAccepted types are: [ '+O.join(", ").toUpperCase()+" ]."+(0<k[length]?"\r\nValid strings are: [ "+k.join(", ").split(":").join(", ")+" ].":"")),delete n[a]}}};return R(o,t,r||{},e,i),!H(o)&&C&&console.warn("The following options are discarded due to invalidity:\r\n"+vi.JSON.stringify(o,null,2)),{S:e,z:i}}},(zi=vi.OverlayScrollbars=function(n,r,e){if(0===arguments[xi.l])return this;var i,t,o=[],a=Ci.isPlainObject(r);return n?(n=n[xi.l]!=hi?n:[n[0]||n],x(),0<n[xi.l]&&(a?Ci.each(n,function(n,t){(i=t)!==hi&&o.push(z(i,r,e,s,v))}):Ci.each(n,function(n,t){i=Ai(t),("!"===r&&zi.valid(i)||Si.type(r)==bi&&r(t,i)||r===hi)&&o.push(i)}),t=1===o[xi.l]?o[0]:o),t):a||!r?t:o}).globals=function(){x();var n=Ci.extend(!0,{},s);return delete n.msie,n},zi.defaultOptions=function(n){x();var t=s.defaultOptions;if(n===hi)return Ci.extend(!0,{},t);s.defaultOptions=Ci.extend(!0,{},t,Ti._(n,Ti.g,!0,t).S)},zi.valid=function(n){return n instanceof zi&&!n.getState().destroyed},zi.extension=function(n,t,r){var e=Si.type(n)==mi,i=arguments[xi.l],o=0;if(i<1||!e)return Ci.extend(!0,{length:g[xi.l]},g);if(e)if(Si.type(t)==bi)g.push({name:n,extensionFactory:t,defaultOptions:r});else for(;o<g[xi.l];o++)if(g[o].name===n){if(!(1<i))return Ci.extend(!0,{},g[o]);g.splice(o,1)}},zi);function x(){s=s||new _(Ti.m),v=v||new S(s)}function _(n){var _=this,i="overflow",S=Ci("body"),z=Ci('<div id="os-dummy-scrollbar-size"><div></div></div>'),o=z[0],e=Ci(z.children("div").eq(0));S.append(z),z.hide().show();var t,r,a,u,f,c,s,l,v,d=T(o),h={x:0===d.x,y:0===d.y},p=(r=vi.navigator.userAgent,u="substring",f=r[a="indexOf"]("MSIE "),c=r[a]("Trident/"),s=r[a]("Edge/"),l=r[a]("rv:"),v=parseInt,0<f?t=v(r[u](f+5,r[a](".",f)),10):0<c?t=v(r[u](l+3,r[a](".",l)),10):0<s&&(t=v(r[u](s+5,r[a](".",s)),10)),t);function T(n){return{x:n[xi.oH]-n[xi.cH],y:n[xi.oW]-n[xi.cW]}}Ci.extend(_,{defaultOptions:n,msie:p,autoUpdateLoop:!1,autoUpdateRecommended:!Si.mO(),nativeScrollbarSize:d,nativeScrollbarIsOverlaid:h,nativeScrollbarStyling:function(){var n=!1;z.addClass("os-viewport-native-scrollbars-invisible");try{n="none"===z.css("scrollbar-width")&&(9<p||!p)||"none"===vi.getComputedStyle(o,"::-webkit-scrollbar").getPropertyValue("display")}catch(t){}return n}(),overlayScrollbarDummySize:{x:30,y:30},cssCalc:_i.v("width","calc","(1px)")||null,restrictedMeasuring:function(){z.css(i,"hidden");var n=o[xi.sW],t=o[xi.sH];z.css(i,"visible");var r=o[xi.sW],e=o[xi.sH];return n-r!=0||t-e!=0}(),rtlScrollBehavior:function(){z.css({"overflow-y":"hidden","overflow-x":"scroll",direction:"rtl"}).scrollLeft(0);var n=z.offset(),t=e.offset();z.scrollLeft(-999);var r=e.offset();return{i:n.left===t.left,n:t.left!==r.left}}(),supportTransform:!!_i.u("transform"),supportTransition:!!_i.u("transition"),supportPassiveEvents:function(){var n=!1;try{vi.addEventListener("test",null,Object.defineProperty({},"passive",{get:function(){n=!0}}))}catch(t){}return n}(),supportResizeObserver:!!Si.rO(),supportMutationObserver:!!Si.mO()}),z.removeAttr(xi.s).remove(),function(){if(!h.x||!h.y){var y=Oi.abs,m=Si.wW(),g=Si.wH(),w=x();Ci(vi).on("resize",function(){if(0<Ai().length){var n=Si.wW(),t=Si.wH(),r=n-m,e=t-g;if(0==r&&0==e)return;var i,o=Oi.round(n/(m/100)),a=Oi.round(t/(g/100)),u=y(r),f=y(e),c=y(o),s=y(a),l=x(),v=2<u&&2<f,d=!function b(n,t){var r=y(n),e=y(t);return r!==e&&r+1!==e&&r-1!==e}(c,s),h=v&&d&&(l!==w&&0<w),p=_.nativeScrollbarSize;h&&(S.append(z),i=_.nativeScrollbarSize=T(z[0]),z.remove(),p.x===i.x&&p.y===i.y||Ci.each(Ai(),function(){Ai(this)&&Ai(this).update("zoom")})),m=n,g=t,w=l}})}function x(){var n=vi.screen.deviceXDPI||0,t=vi.screen.logicalXDPI||1;return vi.devicePixelRatio||n/t}}()}function S(r){var c,e=Ci.inArray,s=Si.now,l="autoUpdate",v=xi.l,d=[],h=[],p=!1,b=33,y=s(),m=function(){if(0<d[v]&&p){c=Si.rAF()(function(){m()});var n,t,r,e,i,o,a=s(),u=a-y;if(b<u){y=a-u%b,n=33;for(var f=0;f<d[v];f++)(t=d[f])!==hi&&(e=(r=t.options())[l],i=Oi.max(1,r.autoUpdateInterval),o=s(),(!0===e||null===e)&&o-h[f]>i&&(t.update("auto"),h[f]=new Date(o+=i)),n=Oi.max(1,Oi.min(n,i)));b=n}}else b=33};this.add=function(n){-1===e(n,d)&&(d.push(n),h.push(s()),0<d[v]&&!p&&(p=!0,r.autoUpdateLoop=p,m()))},this.remove=function(n){var t=e(n,d);-1<t&&(h.splice(t,1),d.splice(t,1),0===d[v]&&p&&(p=!1,r.autoUpdateLoop=p,c!==hi&&(Si.cAF()(c),c=-1)))}}function z(r,n,t,xt,_t){var cn=Si.type,sn=Ci.inArray,d=Ci.each,St=new zi,e=Ci[xi.p];if(dt(r)){if(Ai(r)){var i=Ai(r);return i.options(n),i}var zt,Tt,Ot,kt,D,Ct,At,Ht,E,ln,m,A,h,Rt,Lt,Nt,Wt,g,p,Dt,Et,It,Mt,jt,Ft,Pt,Ut,Vt,$t,o,a,qt,Bt,Xt,u,I,c,M,Yt,Kt,Gt,Jt,Qt,Zt,nr,tr,rr,er,ir,f,s,l,v,b,y,w,H,or,ar,ur,R,fr,cr,sr,lr,vr,dr,hr,pr,br,yr,mr,gr,wr,xr,_r,L,Sr,zr,Tr,Or,kr,Cr,Ar,Hr,x,_,Rr,Lr,Nr,Wr,Dr,Er,Ir,Mr,jr,Fr,Pr,Ur,Vr,$r,S,z,T,O,qr,Br,k,C,Xr,Yr,Kr,Gr,Jr,j,F,Qr,Zr,ne,te,re={},vn={},dn={},ee={},ie={},N="-hidden",oe="margin-",ae="padding-",ue="border-",fe="top",ce="right",se="bottom",le="left",ve="min-",de="max-",he="width",pe="height",be="float",ye="",me="auto",hn="sync",ge="scroll",we="100%",pn="x",bn="y",W=".",xe=" ",P="scrollbar",U="-horizontal",V="-vertical",_e=ge+"Left",Se=ge+"Top",$="mousedown touchstart",q="mouseup touchend touchcancel",B="mousemove touchmove",X="mouseenter",Y="mouseleave",K="keydown",G="keyup",J="selectstart",Q="transitionend webkitTransitionEnd oTransitionEnd",Z="__overlayScrollbarsRO__",nn="os-",tn="os-html",rn="os-host",en=rn+"-foreign",on=rn+"-textarea",an=rn+"-"+P+U+N,un=rn+"-"+P+V+N,fn=rn+"-transition",ze=rn+"-rtl",Te=rn+"-resize-disabled",Oe=rn+"-scrolling",ke=rn+"-overflow",Ce=(ke=rn+"-overflow")+"-x",Ae=ke+"-y",yn="os-textarea",mn=yn+"-cover",gn="os-padding",wn="os-viewport",He=wn+"-native-scrollbars-invisible",xn=wn+"-native-scrollbars-overlaid",_n="os-content",Re="os-content-arrange",Le="os-content-glue",Ne="os-size-auto-observer",Sn="os-resize-observer",zn="os-resize-observer-item",Tn=zn+"-final",On="os-text-inherit",kn=nn+P,Cn=kn+"-track",An=Cn+"-off",Hn=kn+"-handle",Rn=Hn+"-off",Ln=kn+"-unusable",Nn=kn+"-"+me+N,Wn=kn+"-corner",We=Wn+"-resize",De=We+"-both",Ee=We+U,Ie=We+V,Dn=kn+U,En=kn+V,In="os-dragging",Me="os-theme-none",Mn=[He,xn,An,Rn,Ln,Nn,We,De,Ee,Ie,In].join(xe),jn=[],Fn=[xi.ti],Pn={},je={},Fe=42,Un="load",Vn=[],$n={},qn=["wrap","cols","rows"],Bn=[xi.i,xi.c,xi.s,"open"].concat(Fn),Xn=[];return St.sleep=function(){$t=!0},St.update=function(n){var t,r,e,i,o;if(!Lt)return cn(n)==mi?n===me?(t=function a(){if(!$t&&!qr){var r,e,i,o=[],n=[{T:Kt,O:Bn.concat(":visible")},{T:Nt?Yt:hi,O:qn}];return d(n,function(n,t){(r=t.T)&&d(t.O,function(n,t){e=":"===t.charAt(0)?r.is(t):r.attr(t),i=$n[t],ui(e,i)&&o.push(t),$n[t]=e})}),it(o),0<o[xi.l]}}(),r=function f(){if($t)return!1;var n,t,r,e,i=oi(),o=Nt&&br&&!jr?Yt.val().length:0,a=!qr&&br&&!Nt,u={};return a&&(n=nr.css(be),u[be]=Vt?ce:le,u[he]=me,nr.css(u)),e={w:i[xi.sW]+o,h:i[xi.sH]+o},a&&(u[be]=n,u[he]=we,nr.css(u)),t=qe(),r=ui(e,x),x=e,r||t}(),(e=t||r)&&Xe({k:r,C:Rt?hi:qt})):n===hn?qr?(i=T(S.takeRecords()),o=O(z.takeRecords())):i=St.update(me):"zoom"===n&&Xe({A:!0,k:!0}):(n=$t||n,$t=!1,St.update(hn)&&!n||Xe({H:n})),Ye(),e||i||o},St.options=function(n,t){var r,e={};if(Ci.isEmptyObject(n)||!Ci.isPlainObject(n)){if(cn(n)!=mi)return a;if(!(1<arguments.length))return bt(a,n);!function f(n,t,r){for(var e=t.split(W),i=e.length,o=0,a={},u=a;o<i;o++)a=a[e[o]]=o+1<i?{}:r;Ci.extend(n,u,!0)}(e,n,t),r=ot(e)}else r=ot(n);Ci.isEmptyObject(r)||Xe({C:r})},St.destroy=function(){if(!Lt){for(var n in _t.remove(St),Ve(),Pe(Jt),Pe(Gt),Pn)St.removeExt(n);for(;0<Xn[xi.l];)Xn.pop()();$e(!0),rr&&mt(rr),tr&&mt(tr),Et&&mt(Gt),ft(!0),st(!0),at(!0);for(var t=0;t<Vn[xi.l];t++)Ci(Vn[t]).off(Un,rt);Vn=hi,$t=Lt=!0,Ai(r,0),ti("onDestroyed")}},St.scroll=function(n,t,r,e){if(0===arguments.length||n===hi){var i=Er&&Vt&&Ot.i,o=Er&&Vt&&Ot.n,a=vn.R,u=vn.L,f=vn.N;return u=i?1-u:u,a=i?f-a:a,f*=o?-1:1,{position:{x:a*=o?-1:1,y:dn.R},ratio:{x:u,y:dn.L},max:{x:f,y:dn.N},handleOffset:{x:vn.W,y:dn.W},handleLength:{x:vn.D,y:dn.D},handleLengthRatio:{x:vn.I,y:dn.I},trackLength:{x:vn.M,y:dn.M},snappedHandleOffset:{x:vn.j,y:dn.j},isRTL:Vt,isRTLNormalized:Er}}St.update(hn);var c,s,l,v,d,m,g,h,p,w=Er,b=[pn,le,"l"],y=[bn,fe,"t"],x=["+=","-=","*=","/="],_=cn(t)==pi,S=_?t.complete:e,z={},T={},O="begin",k="nearest",C="never",A="ifneeded",H=xi.l,R=[pn,bn,"xy","yx"],L=[O,"end","center",k],N=["always",C,A],W=n[xi.hOP]("el"),D=W?n.el:n,E=!!(D instanceof Ci||ki)&&D instanceof ki,I=!E&&dt(D),M=function(){s&&Qe(!0),l&&Qe(!1)},j=cn(S)!=bi?hi:function(){M(),S()};function F(n,t){for(c=0;c<t[H];c++)if(n===t[c])return 1}function P(n,t){var r=n?b:y;if(t=cn(t)==mi||cn(t)==wi?[t,t]:t,Si.isA(t))return n?t[0]:t[1];if(cn(t)==pi)for(c=0;c<r[H];c++)if(r[c]in t)return t[r[c]]}function U(n,t){var r,e,i,o,a=cn(t)==mi,u=n?vn:dn,f=u.R,c=u.N,s=Vt&&n,l=s&&Ot.n&&!w,v="replace",d=eval;if((e=a?(2<t[H]&&(o=t.substr(0,2),-1<sn(o,x)&&(r=o)),t=(t=r?t.substr(2):t)[v](/min/g,0)[v](/</g,0)[v](/max/g,(l?"-":ye)+we)[v](/>/g,(l?"-":ye)+we)[v](/px/g,ye)[v](/%/g," * "+c*(s&&Ot.n?-1:1)/100)[v](/vw/g," * "+ee.w)[v](/vh/g," * "+ee.h),ii(isNaN(t)?ii(d(t),!0).toFixed():t)):t)!==hi&&!isNaN(e)&&cn(e)==wi){var h=w&&s,p=f*(h&&Ot.n?-1:1),b=h&&Ot.i,y=h&&Ot.n;switch(p=b?c-p:p,r){case"+=":i=p+e;break;case"-=":i=p-e;break;case"*=":i=p*e;break;case"/=":i=p/e;break;default:i=e}i=b?c-i:i,i*=y?-1:1,i=s&&Ot.n?Oi.min(0,Oi.max(c,i)):Oi.max(0,Oi.min(c,i))}return i===f?hi:i}function V(n,t,r,e){var i,o,a=[r,r],u=cn(n);if(u==t)n=[n,n];else if(u==yi){if(2<(i=n[H])||i<1)n=a;else for(1===i&&(n[1]=r),c=0;c<i;c++)if(o=n[c],cn(o)!=t||!F(o,e)){n=a;break}}else n=u==pi?[n[pn]||r,n[bn]||r]:a;return{x:n[0],y:n[1]}}function $(n){var t,r,e=[],i=[fe,ce,se,le];for(c=0;c<n[H]&&c!==i[H];c++)t=n[c],(r=cn(t))==gi?e.push(t?ii(p.css(oe+i[c])):0):e.push(r==wi?t:0);return e}if(E||I){var q,B=W?n.margin:0,X=W?n.axis:0,Y=W?n.scroll:0,K=W?n.block:0,G=[0,0,0,0],J=cn(B);if(0<(p=E?D:Ci(D))[H]){B=J==wi||J==gi?$([B,B,B,B]):J==yi?2===(q=B[H])?$([B[0],B[1],B[0],B[1]]):4<=q?$(B):G:J==pi?$([B[fe],B[ce],B[se],B[le]]):G,d=F(X,R)?X:"xy",m=V(Y,mi,"always",N),g=V(K,mi,O,L),h=B;var Q=vn.R,Z=dn.R,nn=Qt.offset(),tn=p.offset(),rn={x:m.x==C||d==bn,y:m.y==C||d==pn};tn[fe]-=h[0],tn[le]-=h[3];var en={x:Oi.round(tn[le]-nn[le]+Q),y:Oi.round(tn[fe]-nn[fe]+Z)};if(Vt&&(Ot.n||Ot.i||(en.x=Oi.round(nn[le]-tn[le]+Q)),Ot.n&&w&&(en.x*=-1),Ot.i&&w&&(en.x=Oi.round(nn[le]-tn[le]+(vn.N-Q)))),g.x!=O||g.y!=O||m.x==A||m.y==A||Vt){var on=p[0],an=ln?on[xi.bCR]():{width:on[xi.oW],height:on[xi.oH]},un={w:an[he]+h[3]+h[1],h:an[pe]+h[0]+h[2]},fn=function(n){var t=ni(n),r=t.F,e=t.P,i=t.U,o=g[i]==(n&&Vt?O:"end"),a="center"==g[i],u=g[i]==k,f=m[i]==C,c=m[i]==A,s=ee[r],l=nn[e],v=un[r],d=tn[e],h=a?2:1,p=d+v/2,b=l+s/2,y=v<=s&&l<=d&&d+v<=l+s;f?rn[i]=!0:rn[i]||((u||c)&&(rn[i]=c&&y,o=v<s?b<p:p<b),en[i]-=o||a?(s/h-v/h)*(n&&Vt&&w?-1:1):0)};fn(!0),fn(!1)}rn.y&&delete en.y,rn.x&&delete en.x,n=en}}z[_e]=U(!0,P(!0,n)),z[Se]=U(!1,P(!1,n)),s=z[_e]!==hi,l=z[Se]!==hi,(s||l)&&(0<t||_)?_?(t.complete=j,Zt.animate(z,t)):(v={duration:t,complete:j},Si.isA(r)||Ci.isPlainObject(r)?(T[_e]=r[0]||r.x,T[Se]=r[1]||r.y,v.specialEasing=T):v.easing=r,Zt.animate(z,v)):(s&&Zt[_e](z[_e]),l&&Zt[Se](z[Se]),M())},St.scrollStop=function(n,t,r){return Zt.stop(n,t,r),St},St.getElements=function(n){var t={target:or,host:ar,padding:fr,viewport:cr,content:sr,scrollbarHorizontal:{scrollbar:f[0],track:s[0],handle:l[0]},scrollbarVertical:{scrollbar:v[0],track:b[0],handle:y[0]},scrollbarCorner:ir[0]};return cn(n)==mi?bt(t,n):t},St.getState=function(n){function t(n){if(!Ci.isPlainObject(n))return n;var r=fi({},n),t=function(n,t){r[xi.hOP](n)&&(r[t]=r[n],delete r[n])};return t("w",he),t("h",pe),delete r.c,r}var r={destroyed:!!t(Lt),sleeping:!!t($t),autoUpdate:t(!qr),widthAuto:t(br),heightAuto:t(yr),padding:t(gr),overflowAmount:t(kr),hideOverflow:t(pr),hasOverflow:t(hr),contentScrollSize:t(vr),viewportSize:t(ee),hostSize:t(lr),documentMixed:t(g)};return cn(n)==mi?bt(r,n):r},St.ext=function(n){var t,r="added removed on contract".split(" "),e=0;if(cn(n)==mi){if(Pn[xi.hOP](n))for(t=fi({},Pn[n]);e<r.length;e++)delete t[r[e]]}else for(e in t={},Pn)t[e]=fi({},St.ext(e));return t},St.addExt=function(n,t){var r,e,i,o,a=zi.extension(n),u=!0;if(a){if(Pn[xi.hOP](n))return St.ext(n);if((r=a.extensionFactory.call(St,fi({},a.defaultOptions),Ci,Si))&&(i=r.contract,cn(i)==bi&&(o=i(vi),u=cn(o)==gi?o:u),u))return e=(Pn[n]=r).added,cn(e)==bi&&e(t),St.ext(n)}else console.warn('A extension with the name "'+n+"\" isn't registered.")},St.removeExt=function(n){var t,r=Pn[n];return!!r&&(delete Pn[n],t=r.removed,cn(t)==bi&&t(),!0)},zi.valid(function wt(n,t,r){var e,i;return o=xt.defaultOptions,Ct=xt.nativeScrollbarStyling,Ht=fi({},xt.nativeScrollbarSize),zt=fi({},xt.nativeScrollbarIsOverlaid),Tt=fi({},xt.overlayScrollbarDummySize),Ot=fi({},xt.rtlScrollBehavior),ot(fi({},o,t)),At=xt.cssCalc,D=xt.msie,kt=xt.autoUpdateRecommended,E=xt.supportTransition,ln=xt.supportTransform,m=xt.supportPassiveEvents,A=xt.supportResizeObserver,h=xt.supportMutationObserver,xt.restrictedMeasuring,I=Ci(n.ownerDocument),H=I[0],u=Ci(H.defaultView||H.parentWindow),w=u[0],c=gt(I,"html"),M=gt(c,"body"),Yt=Ci(n),or=Yt[0],Nt=Yt.is("textarea"),Wt=Yt.is("body"),g=H!==di,p=Nt?Yt.hasClass(yn)&&Yt.parent().hasClass(_n):Yt.hasClass(rn)&&Yt.children(W+gn)[xi.l],zt.x&&zt.y&&!qt.nativeScrollbarsOverlaid.initialize?(ti("onInitializationWithdrawn"),p&&(at(!0),ft(!0),st(!0)),$t=Lt=!0):(Wt&&((e={}).l=Oi.max(Yt[_e](),c[_e](),u[_e]()),e.t=Oi.max(Yt[Se](),c[Se](),u[Se]()),i=function(){Zt.removeAttr(xi.ti),Yn(Zt,$,i,!0,!0)}),at(),ft(),st(),ut(),ct(!0),ct(!1),function s(){var r,t=w.top!==w,e={},i={},o={};function a(n){if(f(n)){var t=c(n),r={};(ne||Zr)&&(r[he]=i.w+(t.x-e.x)*o.x),(te||Zr)&&(r[pe]=i.h+(t.y-e.y)*o.y),Kt.css(r),Si.stpP(n)}else u(n)}function u(n){var t=n!==hi;Yn(I,[J,B,q],[tt,a,u],!0),si(M,In),ir.releaseCapture&&ir.releaseCapture(),t&&(r&&Ue(),St.update(me)),r=!1}function f(n){var t=(n.originalEvent||n).touches!==hi;return!$t&&!Lt&&(1===Si.mBtn(n)||t)}function c(n){return D&&t?{x:n.screenX,y:n.screenY}:Si.page(n)}Kn(ir,$,function(n){f(n)&&!Qr&&(qr&&(r=!0,Ve()),e=c(n),i.w=ar[xi.oW]-(Dt?0:It),i.h=ar[xi.oH]-(Dt?0:Mt),o=vt(),Yn(I,[J,B,q],[tt,a,u]),ci(M,In),ir.setCapture&&ir.setCapture(),Si.prvD(n),Si.stpP(n))})}(),Gn(),Pe(Jt,Jn),Wt&&(Zt[_e](e.l)[Se](e.t),di.activeElement==n&&cr.focus&&(Zt.attr(xi.ti,"-1"),cr.focus(),Yn(Zt,$,i,!1,!0))),St.update(me),Rt=!0,ti("onInitialized"),d(jn,function(n,t){ti(t.n,t.a)}),jn=[],cn(r)==mi&&(r=[r]),Si.isA(r)?d(r,function(n,t){St.addExt(t)}):Ci.isPlainObject(r)&&d(r,function(n,t){St.addExt(n,t)}),setTimeout(function(){E&&!Lt&&ci(Kt,fn)},333)),St}(r,n,t))&&Ai(r,St),St}function Yn(n,t,r,e,i){var o=Si.isA(t)&&Si.isA(r),a=e?"removeEventListener":"addEventListener",u=e?"off":"on",f=!o&&t.split(xe),c=0;if(o)for(;c<t[xi.l];c++)Yn(n,t[c],r[c],e);else for(;c<f[xi.l];c++)m?n[0][a](f[c],r,{passive:i||!1}):n[u](f[c],r)}function Kn(n,t,r,e){Yn(n,t,r,!1,e),Xn.push(Si.bind(Yn,0,n,t,r,!0,e))}function Pe(n,t){if(n){var r=Si.rO(),e="animationstart mozAnimationStart webkitAnimationStart MSAnimationStart",i="childNodes",o=3333333,a=function(){n[Se](o)[_e](Vt?Ot.n?-o:Ot.i?0:o:o),t()};if(t){if(A)((k=n.addClass("observed").append(ai(Sn)).contents()[0])[Z]=new r(a)).observe(k);else if(9<D||!kt){n.prepend(ai(Sn,ai({c:zn,dir:"ltr"},ai(zn,ai(Tn))+ai(zn,ai({c:Tn,style:"width: 200%; height: 200%"})))));var u,f,c,s,l=n[0][i][0][i][0],v=Ci(l[i][1]),d=Ci(l[i][0]),h=Ci(d[0][i][0]),p=l[xi.oW],b=l[xi.oH],y=xt.nativeScrollbarSize,m=function(){d[_e](o)[Se](o),v[_e](o)[Se](o)},g=function(){f=0,u&&(p=c,b=s,a())},w=function(n){return c=l[xi.oW],s=l[xi.oH],u=c!=p||s!=b,n&&u&&!f?(Si.cAF()(f),f=Si.rAF()(g)):n||g(),m(),n&&(Si.prvD(n),Si.stpP(n)),!1},x={},_={};ri(_,ye,[-2*(y.y+1),-2*y.x,-2*y.y,-2*(y.x+1)]),Ci(l).css(_),d.on(ge,w),v.on(ge,w),n.on(e,function(){w(!1)}),x[he]=o,x[pe]=o,h.css(x),m()}else{var S=H.attachEvent,z=D!==hi;if(S)n.prepend(ai(Sn)),gt(n,W+Sn)[0].attachEvent("onresize",a);else{var T=H.createElement(pi);T.setAttribute(xi.ti,"-1"),T.setAttribute(xi.c,Sn),T.onload=function(){var n=this.contentDocument.defaultView;n.addEventListener("resize",a),n.document.documentElement.style.display="none"},T.type="text/html",z&&n.prepend(T),T.data="about:blank",z||n.prepend(T),n.on(e,a)}}if(n[0]===R){var O=function(){var n=Kt.css("direction"),t={},r=0,e=!1;return n!==L&&(r="ltr"===n?(t[le]=0,t[ce]=me,o):(t[le]=me,t[ce]=0,Ot.n?-o:Ot.i?0:o),Jt.children().eq(0).css(t),Jt[_e](r)[Se](o),L=n,e=!0),e};O(),Kn(n,ge,function(n){return O()&&Xe(),Si.prvD(n),Si.stpP(n),!1})}}else if(A){var k,C=(k=n.contents()[0])[Z];C&&(C.disconnect(),delete k[Z])}else mt(n.children(W+Sn).eq(0))}}function Gn(){if(h){var o,a,u,f,c,s,r,e,i,l,n=Si.mO(),v=Si.now();O=function(n){var t=!1;return Rt&&!$t&&(d(n,function(){return!(t=function o(n){var t=n.attributeName,r=n.target,e=n.type,i="closest";if(r===sr)return null===t;if("attributes"===e&&(t===xi.c||t===xi.s)&&!Nt){if(t===xi.c&&Ci(r).hasClass(rn))return et(n.oldValue,r.className);if(typeof r[i]!=bi)return!0;if(null!==r[i](W+Sn)||null!==r[i](W+kn)||null!==r[i](W+Wn))return!1}return!0}(this))}),t&&(e=Si.now(),i=yr||br,l=function(){Lt||(v=e,Nt&&Be(),i?Xe():St.update(me))},clearTimeout(r),11<e-v||!i?l():r=setTimeout(l,11))),t},S=new n(T=function(n){var t,r=!1,e=!1,i=[];return Rt&&!$t&&(d(n,function(){o=(t=this).target,a=t.attributeName,u=a===xi.c,f=t.oldValue,c=o.className,p&&u&&!e&&-1<f.indexOf(en)&&c.indexOf(en)<0&&(s=lt(!0),ar.className=c.split(xe).concat(f.split(xe).filter(function(n){return n.match(s)})).join(xe),r=e=!0),r=r||(u?et(f,c):a!==xi.s||f!==o[xi.s].cssText),i.push(a)}),it(i),r&&St.update(e||me)),r}),z=new n(O)}}function Ue(){h&&!qr&&(S.observe(ar,{attributes:!0,attributeOldValue:!0,attributeFilter:Bn}),z.observe(Nt?or:sr,{attributes:!0,attributeOldValue:!0,subtree:!Nt,childList:!Nt,characterData:!Nt,attributeFilter:Nt?qn:Bn}),qr=!0)}function Ve(){h&&qr&&(S.disconnect(),z.disconnect(),qr=!1)}function Jn(){if(!$t){var n,t={w:R[xi.sW],h:R[xi.sH]};n=ui(t,_),_=t,n&&Xe({A:!0})}}function Qn(){Jr&&Ge(!0)}function Zn(){Jr&&!M.hasClass(In)&&Ge(!1)}function nt(){Gr&&(Ge(!0),clearTimeout(C),C=setTimeout(function(){Gr&&!Lt&&Ge(!1)},100))}function tt(n){return Si.prvD(n),!1}function rt(n){var r=Ci(n.target);yt(function(n,t){r.is(t)&&Xe({k:!0})})}function $e(n){n||$e(!0),Yn(Kt,B.split(xe)[0],nt,!Gr||n,!0),Yn(Kt,[X,Y],[Qn,Zn],!Jr||n,!0),Rt||n||Kt.one("mouseover",Qn)}function qe(){var n={};return Wt&&tr&&(n.w=ii(tr.css(ve+he)),n.h=ii(tr.css(ve+pe)),n.c=ui(n,$r),n.f=!0),!!($r=n).c}function et(n,t){var r,e,i=typeof t==mi?t.split(xe):[],o=function u(n,t){var r,e,i=[],o=[];for(r=0;r<n.length;r++)i[n[r]]=!0;for(r=0;r<t.length;r++)i[t[r]]?delete i[t[r]]:i[t[r]]=!0;for(e in i)o.push(e);return o}(typeof n==mi?n.split(xe):[],i),a=sn(Me,o);if(-1<a&&o.splice(a,1),0<o[xi.l])for(e=lt(!0,!0),r=0;r<o.length;r++)if(!o[r].match(e))return!0;return!1}function it(n){d(n=n||Fn,function(n,t){if(-1<Si.inA(t,Fn)){var r=Yt.attr(t);cn(r)==mi?Zt.attr(t,r):Zt.removeAttr(t)}})}function Be(){if(!$t){var n,t,r,e,i=!jr,o=ee.w,a=ee.h,u={},f=br||i;return u[ve+he]=ye,u[ve+pe]=ye,u[he]=me,Yt.css(u),n=or[xi.oW],t=f?Oi.max(n,or[xi.sW]-1):1,u[he]=br?me:we,u[ve+he]=we,u[pe]=me,Yt.css(u),r=or[xi.oH],e=Oi.max(r,or[xi.sH]-1),u[he]=t,u[pe]=e,er.css(u),u[ve+he]=o,u[ve+pe]=a,Yt.css(u),{V:n,$:r,q:t,B:e}}}function Xe(n){clearTimeout(Xt),n=n||{},je.A|=n.A,je.k|=n.k,je.H|=n.H;var t,r=Si.now(),e=!!je.A,i=!!je.k,o=!!je.H,a=n.C,u=0<Fe&&Rt&&!Lt&&!o&&!a&&r-Bt<Fe&&!yr&&!br;if(u&&(Xt=setTimeout(Xe,Fe)),!(Lt||u||$t&&!a||Rt&&!o&&(t=Kt.is(":hidden"))||"inline"===Kt.css("display"))){Bt=r,je={},!Ct||zt.x&&zt.y?Ht=fi({},xt.nativeScrollbarSize):(Ht.x=0,Ht.y=0),ie={x:3*(Ht.x+(zt.x?0:3)),y:3*(Ht.y+(zt.y?0:3))},a=a||{};var f=function(){return ui.apply(this,[].slice.call(arguments).concat([o]))},c={x:Zt[_e](),y:Zt[Se]()},s=qt.scrollbars,l=qt.textarea,v=s.visibility,d=f(v,Rr),h=s.autoHide,p=f(h,Lr),b=s.clickScrolling,y=f(b,Nr),m=s.dragScrolling,g=f(m,Wr),w=qt.className,x=f(w,Ir),_=qt.resize,S=f(_,Dr)&&!Wt,z=qt.paddingAbsolute,T=f(z,Sr),O=qt.clipAlways,k=f(O,zr),C=qt.sizeAutoCapable&&!Wt,A=f(C,Hr),H=qt.nativeScrollbarsOverlaid.showNativeScrollbars,R=f(H,Cr),L=qt.autoUpdate,N=f(L,Ar),W=qt.overflowBehavior,D=f(W,Or,o),E=l.dynWidth,I=f(Vr,E),M=l.dynHeight,j=f(Ur,M);if(Yr="n"===h,Kr="s"===h,Gr="m"===h,Jr="l"===h,Xr=s.autoHideDelay,Mr=Ir,Qr="n"===_,Zr="b"===_,ne="h"===_,te="v"===_,Er=qt.normalizeRTL,H=H&&zt.x&&zt.y,Rr=v,Lr=h,Nr=b,Wr=m,Ir=w,Dr=_,Sr=z,zr=O,Hr=C,Cr=H,Ar=L,Or=fi({},W),Vr=E,Ur=M,hr=hr||{x:!1,y:!1},x&&(si(Kt,Mr+xe+Me),ci(Kt,w!==hi&&null!==w&&0<w.length?w:Me)),N&&(!0===L||null===L&&kt?(Ve(),_t.add(St)):(_t.remove(St),Ue())),A)if(C)if(rr?rr.show():(rr=Ci(ai(Le)),Qt.before(rr)),Et)Gt.show();else{Gt=Ci(ai(Ne)),ur=Gt[0],rr.before(Gt);var F={w:-1,h:-1};Pe(Gt,function(){var n={w:ur[xi.oW],h:ur[xi.oH]};ui(n,F)&&(Rt&&yr&&0<n.h||br&&0<n.w||Rt&&!yr&&0===n.h||!br&&0===n.w)&&Xe(),F=n}),Et=!0,null!==At&&Gt.css(pe,At+"(100% + 1px)")}else Et&&Gt.hide(),rr&&rr.hide();o&&(Jt.find("*").trigger(ge),Et&&Gt.find("*").trigger(ge)),t=t===hi?Kt.is(":hidden"):t;var P,U=!!Nt&&"off"!==Yt.attr("wrap"),V=f(U,jr),$=Kt.css("direction"),q=f($,_r),B=Kt.css("box-sizing"),X=f(B,mr),Y=ei(ae);try{P=Et?ur[xi.bCR]():null}catch(gt){return}Dt="border-box"===B;var K=(Vt="rtl"===$)?le:ce,G=Vt?ce:le,J=!1,Q=!(!Et||"none"===Kt.css(be))&&(0===Oi.round(P.right-P.left)&&(!!z||0<ar[xi.cW]-It));if(C&&!Q){var Z=ar[xi.oW],nn=rr.css(he);rr.css(he,me);var tn=ar[xi.oW];rr.css(he,nn),(J=Z!==tn)||(rr.css(he,Z+1),tn=ar[xi.oW],rr.css(he,nn),J=Z!==tn)}var rn=(Q||J)&&C&&!t,en=f(rn,br),on=!rn&&br,an=!(!Et||!C||t)&&0===Oi.round(P.bottom-P.top),un=f(an,yr),fn=!an&&yr,cn=ei(ue,"-"+he,!(rn&&Dt||!Dt),!(an&&Dt||!Dt)),sn=ei(oe),ln={},vn={},dn=function(){return{w:ar[xi.cW],h:ar[xi.cH]}},hn=function(){return{w:fr[xi.oW]+Oi.max(0,sr[xi.cW]-sr[xi.sW]),h:fr[xi.oH]+Oi.max(0,sr[xi.cH]-sr[xi.sH])}},pn=It=Y.l+Y.r,bn=Mt=Y.t+Y.b;if(pn*=z?1:0,bn*=z?1:0,Y.c=f(Y,gr),jt=cn.l+cn.r,Ft=cn.t+cn.b,cn.c=f(cn,wr),Pt=sn.l+sn.r,Ut=sn.t+sn.b,sn.c=f(sn,xr),jr=U,_r=$,mr=B,br=rn,yr=an,gr=Y,wr=cn,xr=sn,q&&Et&&Gt.css(be,G),Y.c||q||T||en||un||X||A){var yn={},mn={},gn=[Y.t,Y.r,Y.b,Y.l];ri(vn,oe,[-Y.t,-Y.r,-Y.b,-Y.l]),z?(ri(yn,ye,gn),ri(Nt?mn:ln,ae)):(ri(yn,ye),ri(Nt?mn:ln,ae,gn)),Qt.css(yn),Yt.css(mn)}ee=hn();var wn=!!Nt&&Be(),xn=Nt&&f(wn,Pr),_n=Nt&&wn?{w:E?wn.q:wn.V,h:M?wn.B:wn.$}:{};if(Pr=wn,an&&(un||T||X||Y.c||cn.c)?ln[pe]=me:(un||T)&&(ln[pe]=we),rn&&(en||T||X||Y.c||cn.c||q)?(ln[he]=me,vn[de+he]=we):(en||T)&&(ln[he]=we,ln[be]=ye,vn[de+he]=ye),rn?(vn[he]=me,ln[he]=_i.v(he,"max-content intrinsic")||me,ln[be]=G):vn[he]=ye,vn[pe]=an?_n.h||sr[xi.cH]:ye,C&&rr.css(vn),nr.css(ln),ln={},vn={},e||i||xn||q||X||T||en||rn||un||an||R||D||k||S||d||p||g||y||I||j||V){var Sn="overflow",zn=Sn+"-x",Tn=Sn+"-y";if(!Ct){var On={},kn=hr.y&&pr.ys&&!H?zt.y?Zt.css(K):-Ht.y:0,Cn=hr.x&&pr.xs&&!H?zt.x?Zt.css(se):-Ht.x:0;ri(On,ye),Zt.css(On)}var An=oi(),Hn={w:_n.w||An[xi.cW],h:_n.h||An[xi.cH]},Rn=An[xi.sW],Ln=An[xi.sH];Ct||(On[se]=fn?ye:Cn,On[K]=on?ye:kn,Zt.css(On)),ee=hn();var Nn=dn(),Wn={w:Nn.w-Pt-jt-(Dt?0:It),h:Nn.h-Ut-Ft-(Dt?0:Mt)},Dn={w:Oi.max((rn?Hn.w:Rn)+pn,Wn.w),h:Oi.max((an?Hn.h:Ln)+bn,Wn.h)};if(Dn.c=f(Dn,Tr),Tr=Dn,C){(Dn.c||an||rn)&&(vn[he]=Dn.w,vn[pe]=Dn.h,Nt||(Hn={w:An[xi.cW],h:An[xi.cH]}));var En={},In=function(n){var t=ni(n),r=t.F,e=t.X,i=n?rn:an,o=n?jt:Ft,a=n?It:Mt,u=n?Pt:Ut,f=ee[r]-o-u-(Dt?0:a);i&&(i||!cn.c)||(vn[e]=Wn[r]-1),!(i&&Hn[r]<f)||n&&Nt&&U||(Nt&&(En[e]=ii(er.css(e))-1),--vn[e]),0<Hn[r]&&(vn[e]=Oi.max(1,vn[e]))};In(!0),In(!1),Nt&&er.css(En),rr.css(vn)}rn&&(ln[he]=we),!rn||Dt||qr||(ln[be]="none"),nr.css(ln),ln={};var Mn={w:An[xi.sW],h:An[xi.sH]};Mn.c=i=f(Mn,vr),vr=Mn,ee=hn(),e=f(Nn=dn(),lr),lr=Nn;var jn=Nt&&(0===ee.w||0===ee.h),Fn=kr,Pn={},Un={},Vn={},$n={},qn={},Bn={},Xn={},Yn=fr[xi.bCR](),Kn=function(n){var t=ni(n),r=ni(!n).U,e=t.U,i=t.F,o=t.X,a=ge+t.Y+"Max",u=Yn[o]?Oi.abs(Yn[o]-ee[i]):0,f=Fn&&0<Fn[e]&&0===cr[a];Pn[e]="v-s"===W[e],Un[e]="v-h"===W[e],Vn[e]="s"===W[e],$n[e]=Oi.max(0,Oi.round(100*(Mn[i]-ee[i]))/100),$n[e]*=jn||f&&0<u&&u<1?0:1,qn[e]=0<$n[e],Bn[e]=Pn[e]||Un[e]?qn[r]&&!Pn[r]&&!Un[r]:qn[e],Bn[e+"s"]=!!Bn[e]&&(Vn[e]||Pn[e]),Xn[e]=qn[e]&&Bn[e+"s"]};if(Kn(!0),Kn(!1),$n.c=f($n,kr),kr=$n,qn.c=f(qn,hr),hr=qn,Bn.c=f(Bn,pr),pr=Bn,zt.x||zt.y){var Gn,Jn={},Qn={},Zn=o;(qn.x||qn.y)&&(Qn.w=zt.y&&qn.y?Mn.w+Tt.y:ye,Qn.h=zt.x&&qn.x?Mn.h+Tt.x:ye,Zn=f(Qn,dr),dr=Qn),(qn.c||Bn.c||Mn.c||q||en||un||rn||an||R)&&(ln[oe+G]=ln[ue+G]=ye,Gn=function(n){var t=ni(n),r=ni(!n),e=t.U,i=n?se:K,o=n?an:rn;zt[e]&&qn[e]&&Bn[e+"s"]?(ln[oe+i]=!o||H?ye:Tt[e],ln[ue+i]=n&&o||H?ye:Tt[e]+"px solid transparent"):(Qn[r.F]=ln[oe+i]=ln[ue+i]=ye,Zn=!0)},Ct?li(Zt,He,!H):(Gn(!0),Gn(!1))),H&&(Qn.w=Qn.h=ye,Zn=!0),Zn&&!Ct&&(Jn[he]=Bn.y?Qn.w:ye,Jn[pe]=Bn.x?Qn.h:ye,tr||(tr=Ci(ai(Re)),Zt.prepend(tr)),tr.css(Jn)),nr.css(ln)}var nt,tt={};yn={};if((e||qn.c||Bn.c||Mn.c||D||X||R||q||k||un)&&(tt[G]=ye,(nt=function(n){var t=ni(n),r=ni(!n),e=t.U,i=t.K,o=n?se:K,a=function(){tt[o]=ye,re[r.F]=0};qn[e]&&Bn[e+"s"]?(tt[Sn+i]=ge,H||Ct?a():(tt[o]=-(zt[e]?Tt[e]:Ht[e]),re[r.F]=zt[e]?Tt[r.U]:0)):(tt[Sn+i]=ye,a())})(!0),nt(!1),!Ct&&(ee.h<ie.x||ee.w<ie.y)&&(qn.x&&Bn.x&&!zt.x||qn.y&&Bn.y&&!zt.y)?(tt[ae+fe]=ie.x,tt[oe+fe]=-ie.x,tt[ae+G]=ie.y,tt[oe+G]=-ie.y):tt[ae+fe]=tt[oe+fe]=tt[ae+G]=tt[oe+G]=ye,tt[ae+K]=tt[oe+K]=ye,qn.x&&Bn.x||qn.y&&Bn.y||jn?Nt&&jn&&(yn[zn]=yn[Tn]="hidden"):(!O||Un.x||Pn.x||Un.y||Pn.y)&&(Nt&&(yn[zn]=yn[Tn]=ye),tt[zn]=tt[Tn]="visible"),Qt.css(yn),Zt.css(tt),tt={},(qn.c||X||en||un)&&(!zt.x||!zt.y))){var rt=sr[xi.s];rt.webkitTransform="scale(1)",rt.display="run-in",sr[xi.oH],rt.display=ye,rt.webkitTransform=ye}if(ln={},q||en||un)if(Vt&&rn){var et=nr.css(be),it=Oi.round(nr.css(be,ye).css(le,ye).position().left);nr.css(be,et),it!==Oi.round(nr.position().left)&&(ln[le]=it)}else ln[le]=ye;if(nr.css(ln),Nt&&i){var ot=function wt(){var n=or.selectionStart;if(n===hi)return;var t,r,e=Yt.val(),i=e[xi.l],o=e.split("\n"),a=o[xi.l],u=e.substr(0,n).split("\n"),f=0,c=0,s=u[xi.l],l=u[u[xi.l]-1][xi.l];for(r=0;r<o[xi.l];r++)t=o[r][xi.l],c<t&&(f=r+1,c=t);return{G:s,J:l,Q:a,Z:c,nn:f,tn:n,rn:i}}();if(ot){var at=Fr===hi||ot.Q!==Fr.Q,ut=ot.G,ft=ot.J,ct=ot.nn,st=ot.Q,lt=ot.Z,vt=ot.tn,dt=ot.rn<=vt&&Br,ht={x:U||ft!==lt||ut!==ct?-1:kr.x,y:(U?dt||at&&Fn&&c.y===Fn.y:(dt||at)&&ut===st)?kr.y:-1};c.x=-1<ht.x?Vt&&Er&&Ot.i?0:ht.x:c.x,c.y=-1<ht.y?ht.y:c.y}Fr=ot}Vt&&Ot.i&&zt.y&&qn.x&&Er&&(c.x+=re.w||0),rn&&Kt[_e](0),an&&Kt[Se](0),Zt[_e](c.x)[Se](c.y);var pt="v"===v,bt="h"===v,yt="a"===v,mt=function(n,t){t=t===hi?n:t,Ke(!0,n,Xn.x),Ke(!1,t,Xn.y)};li(Kt,ke,Bn.x||Bn.y),li(Kt,Ce,Bn.x),li(Kt,Ae,Bn.y),q&&li(Kt,ze,Vt),Wt&&ci(Kt,Te),S&&(li(Kt,Te,Qr),li(ir,We,!Qr),li(ir,De,Zr),li(ir,Ee,ne),li(ir,Ie,te)),(d||D||Bn.c||qn.c||R)&&(H?R&&(si(Kt,Oe),H&&mt(!1)):yt?mt(Xn.x,Xn.y):pt?mt(!0):bt&&mt(!1)),(p||R)&&($e(!Jr&&!Gr),Ge(Yr,!Yr)),(e||$n.c||un||en||S||X||T||R||q)&&(Je(!0),Qe(!0),Je(!1),Qe(!1)),y&&Ze(!0,b),g&&Ze(!1,m),ti("onDirectionChanged",{isRTL:Vt,dir:$},q),ti("onHostSizeChanged",{width:lr.w,height:lr.h},e),ti("onContentSizeChanged",{width:vr.w,height:vr.h},i),ti("onOverflowChanged",{x:qn.x,y:qn.y,xScrollable:Bn.xs,yScrollable:Bn.ys,clipped:Bn.x||Bn.y},qn.c||Bn.c),ti("onOverflowAmountChanged",{x:$n.x,y:$n.y},$n.c)}Wt&&$r&&(hr.c||$r.c)&&($r.f||qe(),zt.y&&hr.x&&nr.css(ve+he,$r.w+Tt.y),zt.x&&hr.y&&nr.css(ve+pe,$r.h+Tt.x),$r.c=!1),Rt&&a.updateOnLoad&&Ye(),ti("onUpdated",{forced:o})}}function Ye(){Nt||yt(function(n,t){nr.find(t).each(function(n,t){Si.inA(t,Vn)<0&&(Vn.push(t),Ci(t).off(Un,rt).on(Un,rt))})})}function ot(n){var t=Ti._(n,Ti.g,!0,a);return a=fi({},a,t.S),qt=fi({},qt,t.z),t.z}function at(e){var n="parent",t=yn+xe+On,r=Nt?xe+On:ye,i=qt.textarea.inheritedAttrs,o={},a=function(){var r=e?Yt:Kt;d(o,function(n,t){cn(t)==mi&&(n==xi.c?r.addClass(t):r.attr(n,t))})},u=[rn,en,on,Te,ze,an,un,fn,Oe,ke,Ce,Ae,Me,yn,On,Ir].join(xe),f={};Kt=Kt||(Nt?p?Yt[n]()[n]()[n]()[n]():Ci(ai(on)):Yt),nr=nr||pt(_n+r),Zt=Zt||pt(wn+r),Qt=Qt||pt(gn+r),Jt=Jt||pt("os-resize-observer-host"),er=er||(Nt?pt(mn):hi),p&&ci(Kt,en),e&&si(Kt,u),i=cn(i)==mi?i.split(xe):i,Si.isA(i)&&Nt&&d(i,function(n,t){cn(t)==mi&&(o[t]=e?Kt.attr(t):Yt.attr(t))}),e?(p&&Rt?(Jt.children().remove(),d([Qt,Zt,nr,er],function(n,t){t&&si(t.removeAttr(xi.s),Mn)}),ci(Kt,Nt?on:rn)):(mt(Jt),nr.contents().unwrap().unwrap().unwrap(),Nt&&(Yt.unwrap(),mt(Kt),mt(er),a())),Nt&&Yt.removeAttr(xi.s),Wt&&si(c,tn)):(Nt&&(qt.sizeAutoCapable||(f[he]=Yt.css(he),f[pe]=Yt.css(pe)),p||Yt.addClass(On).wrap(Kt),Kt=Yt[n]().css(f)),p||(ci(Yt,Nt?t:rn),Kt.wrapInner(nr).wrapInner(Zt).wrapInner(Qt).prepend(Jt),nr=gt(Kt,W+_n),Zt=gt(Kt,W+wn),Qt=gt(Kt,W+gn),Nt&&(nr.prepend(er),a())),Ct&&ci(Zt,He),zt.x&&zt.y&&ci(Zt,xn),Wt&&ci(c,tn),R=Jt[0],ar=Kt[0],fr=Qt[0],cr=Zt[0],sr=nr[0],it())}function ut(){var r,t,e=[112,113,114,115,116,117,118,119,120,121,123,33,34,37,38,39,40,16,17,18,19,20,144],i=[],n="focus";function o(n){Be(),St.update(me),n&&kt&&clearInterval(r)}Nt?(9<D||!kt?Kn(Yt,"input",o):Kn(Yt,[K,G],[function a(n){var t=n.keyCode;sn(t,e)<0&&(i[xi.l]||(o(),r=setInterval(o,1e3/60)),sn(t,i)<0&&i.push(t))},function u(n){var t=n.keyCode,r=sn(t,i);sn(t,e)<0&&(-1<r&&i.splice(r,1),i[xi.l]||o(!0))}]),Kn(Yt,[ge,"drop",n,n+"out"],[function f(n){return Yt[_e](Ot.i&&Er?9999999:0),Yt[Se](0),Si.prvD(n),Si.stpP(n),!1},function c(n){setTimeout(function(){Lt||o()},50)},function s(){Br=!0,ci(Kt,n)},function l(){Br=!1,i=[],si(Kt,n),o(!0)}])):Kn(nr,Q,function v(n){!0!==Ar&&function l(n){if(!Rt)return 1;var t="flex-grow",r="flex-shrink",e="flex-basis",i=[he,ve+he,de+he,oe+le,oe+ce,le,ce,"font-weight","word-spacing",t,r,e],o=[ae+le,ae+ce,ue+le+he,ue+ce+he],a=[pe,ve+pe,de+pe,oe+fe,oe+se,fe,se,"line-height",t,r,e],u=[ae+fe,ae+se,ue+fe+he,ue+se+he],f="s"===Or.x||"v-s"===Or.x,c=!1,s=function(n,t){for(var r=0;r<n[xi.l];r++)if(n[r]===t)return!0;return!1};return("s"===Or.y||"v-s"===Or.y)&&((c=s(a,n))||Dt||(c=s(u,n))),f&&!c&&((c=s(i,n))||Dt||(c=s(o,n))),c}((n=n.originalEvent||n).propertyName)&&St.update(me)}),Kn(Zt,ge,function d(n){$t||(t!==hi?clearTimeout(t):((Kr||Gr)&&Ge(!0),ht()||ci(Kt,Oe),ti("onScrollStart",n)),F||(Qe(!0),Qe(!1)),ti("onScroll",n),t=setTimeout(function(){Lt||(clearTimeout(t),t=hi,(Kr||Gr)&&Ge(!1),ht()||si(Kt,Oe),ti("onScrollStop",n))},175))},!0)}function ft(i){var n,t,o=function(n){var t=pt(kn+xe+(n?Dn:En),!0),r=pt(Cn,t),e=pt(Hn,t);return p||i||(t.append(r),r.append(e)),{en:t,"in":r,an:e}};function r(n){var t=ni(n),r=t.en,e=t["in"],i=t.an;p&&Rt?d([r,e,i],function(n,t){si(t.removeAttr(xi.s),Mn)}):mt(r||o(n).en)}i?(r(!0),r()):(n=o(!0),t=o(),f=n.en,s=n["in"],l=n.an,v=t.en,b=t["in"],y=t.an,p||(Qt.after(v),Qt.after(f)))}function ct(_){var S,i,z,T,r=ni(_),O=r.un,t=w.top!==w,k=r.U,e=r.K,C=ge+r.Y,o="active",a="snapHandle",A=1,u=[16,17];function f(n){return D&&t?n["screen"+e]:Si.page(n)[k]}function c(n){return qt.scrollbars[n]}function s(){A=.5}function l(){A=1}function v(n){-1<sn(n.keyCode,u)&&s()}function H(n){-1<sn(n.keyCode,u)&&l()}function R(n){var t=(n.originalEvent||n).touches!==hi;return!($t||Lt||ht()||!Wr||t&&!c("touchSupport"))&&(1===Si.mBtn(n)||t)}function d(n){if(R(n)){var t=O.M,r=O.D,e=O.N*((f(n)-z)*T/(t-r));e=isFinite(e)?e:0,Vt&&_&&!Ot.i&&(e*=-1),Zt[C](Oi.round(i+e)),F&&Qe(_,i+e),m||Si.prvD(n)}else L(n)}function L(n){if(n=n||n.originalEvent,Yn(I,[B,q,K,G,J],[d,L,v,H,tt],!0),F&&Qe(_,!0),F=!1,si(M,In),si(r.an,o),si(r["in"],o),si(r.en,o),T=1,l(),S!==(z=i=hi)&&(St.scrollStop(),clearTimeout(S),S=hi),n){var t=ar[xi.bCR]();n.clientX>=t.left&&n.clientX<=t.right&&n.clientY>=t.top&&n.clientY<=t.bottom||Zn(),(Kr||Gr)&&Ge(!1)}}function N(n){i=Zt[C](),i=isNaN(i)?0:i,(Vt&&_&&!Ot.n||!Vt)&&(i=i<0?0:i),T=vt()[k],z=f(n),F=!c(a),ci(M,In),ci(r.an,o),ci(r.en,o),Yn(I,[B,q,J],[d,L,tt]),!D&&g||Si.prvD(n),Si.stpP(n)}Kn(r.an,$,function h(n){R(n)&&N(n)}),Kn(r["in"],[$,X,Y],[function W(n){if(R(n)){var d,h=Oi.round(ee[r.F]),p=r["in"].offset()[r.P],t=n.ctrlKey,b=n.shiftKey,y=b&&t,m=!0,g=function(n){F&&Qe(_,n)},w=function(){g(),N(n)},x=function(){if(!Lt){var n=(z-p)*T,t=O.W,r=O.M,e=O.D,i=O.N,o=O.R,a=270*A,u=m?Oi.max(400,a):a,f=i*((n-e/2)/(r-e)),c=Vt&&_&&(!Ot.i&&!Ot.n||Er),s=c?t<n:n<t,l={},v={easing:"linear",step:function(n){F&&(Zt[C](n),Qe(_,n))}};f=isFinite(f)?f:0,f=Vt&&_&&!Ot.i?i-f:f,b?(Zt[C](f),y?(f=Zt[C](),Zt[C](o),f=c&&Ot.i?i-f:f,f=c&&Ot.n?-f:f,l[k]=f,St.scroll(l,fi(v,{duration:130,complete:w}))):w()):(d=m?s:d,(c?d?n<=t+e:t<=n:d?t<=n:n<=t+e)?(clearTimeout(S),St.scrollStop(),S=hi,g(!0)):(S=setTimeout(x,u),l[k]=(d?"-=":"+=")+h,St.scroll(l,fi(v,{duration:a}))),m=!1)}};t&&s(),T=vt()[k],z=Si.page(n)[k],F=!c(a),ci(M,In),ci(r["in"],o),ci(r.en,o),Yn(I,[q,K,G,J],[L,v,H,tt]),x(),Si.prvD(n),Si.stpP(n)}},function p(n){j=!0,(Kr||Gr)&&Ge(!0)},function b(n){j=!1,(Kr||Gr)&&Ge(!1)}]),Kn(r.en,$,function y(n){Si.stpP(n)}),E&&Kn(r.en,Q,function(n){n.target===r.en[0]&&(Je(_),Qe(_))})}function Ke(n,t,r){var e=n?f:v;li(Kt,n?an:un,!t),li(e,Ln,!r)}function Ge(n,t){if(clearTimeout(k),n)si(f,Nn),si(v,Nn);else{var r,e=function(){j||Lt||(!(r=l.hasClass("active")||y.hasClass("active"))&&(Kr||Gr||Jr)&&ci(f,Nn),!r&&(Kr||Gr||Jr)&&ci(v,Nn))};0<Xr&&!0!==t?k=setTimeout(e,Xr):e()}}function Je(n){var t={},r=ni(n),e=r.un,i=Oi.min(1,(lr[r.F]-(Sr?n?It:Mt:0))/vr[r.F]);t[r.X]=Oi.floor(100*i*1e6)/1e6+"%",ht()||r.an.css(t),e.D=r.an[0]["offset"+r.cn],e.I=i}function Qe(n,t){var r,e,i=cn(t)==gi,o=Vt&&n,a=ni(n),u=a.un,f="translate(",c=_i.u("transform"),s=_i.u("transition"),l=n?Zt[_e]():Zt[Se](),v=t===hi||i?l:t,d=u.D,h=a["in"][0]["offset"+a.cn],p=h-d,b={},y=(cr[ge+a.cn]-cr["client"+a.cn])*(Ot.n&&o?-1:1),m=function(n){return isNaN(n/y)?0:Oi.max(0,Oi.min(1,n/y))},g=function(n){var t=p*n;return t=isNaN(t)?0:t,t=o&&!Ot.i?h-d-t:t,t=Oi.max(0,t)},w=m(l),x=g(m(v)),_=g(w);u.N=y,u.R=l,u.L=w,ln?(r=o?-(h-d-x):x,e=n?f+r+"px, 0)":f+"0, "+r+"px)",b[c]=e,E&&(b[s]=i&&1<Oi.abs(x-u.W)?function S(n){var t=_i.u("transition"),r=n.css(t);if(r)return r;for(var e,i,o,a="\\s*(([^,(]+(\\(.+?\\))?)+)[\\s,]*",u=new RegExp(a),f=new RegExp("^("+a+")+$"),c="property duration timing-function delay".split(" "),s=[],l=0,v=function(n){if(e=[],!n.match(f))return n;for(;n.match(u);)e.push(RegExp.$1),n=n.replace(u,ye);return e};l<c[xi.l];l++)for(i=v(n.css(t+"-"+c[l])),o=0;o<i[xi.l];o++)s[o]=(s[o]?s[o]+xe:ye)+i[o];return s.join(", ")}(a.an)+", "+(c+xe+250)+"ms":ye)):b[a.P]=x,ht()||(a.an.css(b),ln&&E&&i&&a.an.one(Q,function(){Lt||a.an.css(s,ye)})),u.W=x,u.j=_,u.M=h}function Ze(n,t){var r=t?"removeClass":"addClass",e=n?b:y,i=n?An:Rn;(n?s:l)[r](i),e[r](i)}function ni(n){return{X:n?he:pe,cn:n?"Width":"Height",P:n?le:fe,Y:n?"Left":"Top",U:n?pn:bn,K:n?"X":"Y",F:n?"w":"h",sn:n?"l":"t","in":n?s:b,an:n?l:y,en:n?f:v,un:n?vn:dn}}function st(n){ir=ir||pt(Wn,!0),n?p&&Rt?si(ir.removeAttr(xi.s),Mn):mt(ir):p||Kt.append(ir)}function ti(n,t,r){if(!1!==r)if(Rt){var e,i=qt.callbacks[n],o=n;"on"===o.substr(0,2)&&(o=o.substr(2,1).toLowerCase()+o.substr(3)),cn(i)==bi&&i.call(St,t),d(Pn,function(){cn((e=this).on)==bi&&e.on(o,t)})}else Lt||jn.push({n:n,a:t})}function ri(n,t,r){r=r||[ye,ye,ye,ye],n[(t=t||ye)+fe]=r[0],n[t+ce]=r[1],n[t+se]=r[2],n[t+le]=r[3]}function ei(n,t,r,e){return t=t||ye,n=n||ye,{t:e?0:ii(Kt.css(n+fe+t)),r:r?0:ii(Kt.css(n+ce+t)),b:e?0:ii(Kt.css(n+se+t)),l:r?0:ii(Kt.css(n+le+t))}}function lt(n,t){var r,e,i,o=function(n,t){if(i="",t&&typeof n==mi)for(e=n.split(xe),r=0;r<e[xi.l];r++)i+="|"+e[r]+"$";return i};return new RegExp("(^"+rn+"([-_].+|)$)"+o(Ir,n)+o(Mr,t),"g")}function vt(){var n=fr[xi.bCR]();return{x:ln&&1/(Oi.round(n.width)/fr[xi.oW])||1,y:ln&&1/(Oi.round(n.height)/fr[xi.oH])||1}}function dt(n){var t="ownerDocument",r="HTMLElement",e=n&&n[t]&&n[t].parentWindow||vi;return typeof e[r]==pi?n instanceof e[r]:n&&typeof n==pi&&null!==n&&1===n.nodeType&&typeof n.nodeName==mi}function ii(n,t){var r=t?parseFloat(n):parseInt(n,10);return isNaN(r)?0:r}function ht(){return Cr&&zt.x&&zt.y}function oi(){return Nt?er[0]:sr}function ai(r,n){return"<div "+(r?cn(r)==mi?'class="'+r+'"':function(){var n,t=ye;if(Ci.isPlainObject(r))for(n in r)t+=("c"===n?"class":n)+'="'+r[n]+'" ';return t}():ye)+">"+(n||ye)+"</div>"}function pt(n,t){var r=cn(t)==gi,e=!r&&t||Kt;return p&&!e[xi.l]?null:p?e[r?"children":"find"](W+n.replace(/\s/g,W)).eq(0):Ci(ai(n))}function bt(n,t){for(var r,e=t.split(W),i=0;i<e.length;i++){if(!n[xi.hOP](e[i]))return;r=n[e[i]],i<e.length&&cn(r)==pi&&(n=r)}return r}function yt(n){var t=qt.updateOnLoad;t=cn(t)==mi?t.split(xe):t,Si.isA(t)&&!Lt&&d(t,n)}function ui(n,t,r){if(r)return r;if(cn(n)!=pi||cn(t)!=pi)return n!==t;for(var e in n)if("c"!==e){if(!n[xi.hOP](e)||!t[xi.hOP](e))return!0;if(ui(n[e],t[e]))return!0}return!1}function fi(){return Ci.extend.apply(this,[!0].concat([].slice.call(arguments)))}function ci(n,t){return e.addClass.call(n,t)}function si(n,t){return e.removeClass.call(n,t)}function li(n,t,r){return(r?ci:si)(n,t)}function mt(n){return e.remove.call(n)}function gt(n,t){return e.find.call(n,t).eq(0)}}return ki&&ki.fn&&(ki.fn.overlayScrollbars=function(n,t){return ki.isPlainObject(n)?(ki.each(this,function(){w(this,n,t)}),this):w(this,n)}),w});
!function(t){var i=t(window);t.fn.visible=function(t,e,o){if(!(this.length<1)){var r=this.length>1?this.eq(0):this,n=r.get(0),f=i.width(),h=i.height(),o=o?o:"both",l=e===!0?n.offsetWidth*n.offsetHeight:!0;if("function"==typeof n.getBoundingClientRect){var g=n.getBoundingClientRect(),u=g.top>=0&&g.top<h,s=g.bottom>0&&g.bottom<=h,c=g.left>=0&&g.left<f,a=g.right>0&&g.right<=f,v=t?u||s:u&&s,b=t?c||a:c&&a;if("both"===o)return l&&v&&b;if("vertical"===o)return l&&v;if("horizontal"===o)return l&&b}else{var d=i.scrollTop(),p=d+h,w=i.scrollLeft(),m=w+f,y=r.offset(),z=y.top,B=z+r.height(),C=y.left,R=C+r.width(),j=t===!0?B:z,q=t===!0?z:B,H=t===!0?R:C,L=t===!0?C:R;if("both"===o)return!!l&&p>=q&&j>=d&&m>=L&&H>=w;if("vertical"===o)return!!l&&p>=q&&j>=d;if("horizontal"===o)return!!l&&m>=L&&H>=w}}}}(jQuery);
/*!
Waypoints - 4.0.1
Copyright © 2011-2016 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blob/master/licenses.txt
*/
!function(){"use strict";function t(o){if(!o)throw new Error("No options passed to Waypoint constructor");if(!o.element)throw new Error("No element option passed to Waypoint constructor");if(!o.handler)throw new Error("No handler option passed to Waypoint constructor");this.key="waypoint-"+e,this.options=t.Adapter.extend({},t.defaults,o),this.element=this.options.element,this.adapter=new t.Adapter(this.element),this.callback=o.handler,this.axis=this.options.horizontal?"horizontal":"vertical",this.enabled=this.options.enabled,this.triggerPoint=null,this.group=t.Group.findOrCreate({name:this.options.group,axis:this.axis}),this.context=t.Context.findOrCreateByElement(this.options.context),t.offsetAliases[this.options.offset]&&(this.options.offset=t.offsetAliases[this.options.offset]),this.group.add(this),this.context.add(this),i[this.key]=this,e+=1}var e=0,i={};t.prototype.queueTrigger=function(t){this.group.queueTrigger(this,t)},t.prototype.trigger=function(t){this.enabled&&this.callback&&this.callback.apply(this,t)},t.prototype.destroy=function(){this.context.remove(this),this.group.remove(this),delete i[this.key]},t.prototype.disable=function(){return this.enabled=!1,this},t.prototype.enable=function(){return this.context.refresh(),this.enabled=!0,this},t.prototype.next=function(){return this.group.next(this)},t.prototype.previous=function(){return this.group.previous(this)},t.invokeAll=function(t){var e=[];for(var o in i)e.push(i[o]);for(var n=0,r=e.length;r>n;n++)e[n][t]()},t.destroyAll=function(){t.invokeAll("destroy")},t.disableAll=function(){t.invokeAll("disable")},t.enableAll=function(){t.Context.refreshAll();for(var e in i)i[e].enabled=!0;return this},t.refreshAll=function(){t.Context.refreshAll()},t.viewportHeight=function(){return window.innerHeight||document.documentElement.clientHeight},t.viewportWidth=function(){return document.documentElement.clientWidth},t.adapters=[],t.defaults={context:window,continuous:!0,enabled:!0,group:"default",horizontal:!1,offset:0},t.offsetAliases={"bottom-in-view":function(){return this.context.innerHeight()-this.adapter.outerHeight()},"right-in-view":function(){return this.context.innerWidth()-this.adapter.outerWidth()}},window.Waypoint=t}(),function(){"use strict";function t(t){window.setTimeout(t,1e3/60)}function e(t){this.element=t,this.Adapter=n.Adapter,this.adapter=new this.Adapter(t),this.key="waypoint-context-"+i,this.didScroll=!1,this.didResize=!1,this.oldScroll={x:this.adapter.scrollLeft(),y:this.adapter.scrollTop()},this.waypoints={vertical:{},horizontal:{}},t.waypointContextKey=this.key,o[t.waypointContextKey]=this,i+=1,n.windowContext||(n.windowContext=!0,n.windowContext=new e(window)),this.createThrottledScrollHandler(),this.createThrottledResizeHandler()}var i=0,o={},n=window.Waypoint,r=window.onload;e.prototype.add=function(t){var e=t.options.horizontal?"horizontal":"vertical";this.waypoints[e][t.key]=t,this.refresh()},e.prototype.checkEmpty=function(){var t=this.Adapter.isEmptyObject(this.waypoints.horizontal),e=this.Adapter.isEmptyObject(this.waypoints.vertical),i=this.element==this.element.window;t&&e&&!i&&(this.adapter.off(".waypoints"),delete o[this.key])},e.prototype.createThrottledResizeHandler=function(){function t(){e.handleResize(),e.didResize=!1}var e=this;this.adapter.on("resize.waypoints",function(){e.didResize||(e.didResize=!0,n.requestAnimationFrame(t))})},e.prototype.createThrottledScrollHandler=function(){function t(){e.handleScroll(),e.didScroll=!1}var e=this;this.adapter.on("scroll.waypoints",function(){(!e.didScroll||n.isTouch)&&(e.didScroll=!0,n.requestAnimationFrame(t))})},e.prototype.handleResize=function(){n.Context.refreshAll()},e.prototype.handleScroll=function(){var t={},e={horizontal:{newScroll:this.adapter.scrollLeft(),oldScroll:this.oldScroll.x,forward:"right",backward:"left"},vertical:{newScroll:this.adapter.scrollTop(),oldScroll:this.oldScroll.y,forward:"down",backward:"up"}};for(var i in e){var o=e[i],n=o.newScroll>o.oldScroll,r=n?o.forward:o.backward;for(var s in this.waypoints[i]){var a=this.waypoints[i][s];if(null!==a.triggerPoint){var l=o.oldScroll<a.triggerPoint,h=o.newScroll>=a.triggerPoint,p=l&&h,u=!l&&!h;(p||u)&&(a.queueTrigger(r),t[a.group.id]=a.group)}}}for(var c in t)t[c].flushTriggers();this.oldScroll={x:e.horizontal.newScroll,y:e.vertical.newScroll}},e.prototype.innerHeight=function(){return this.element==this.element.window?n.viewportHeight():this.adapter.innerHeight()},e.prototype.remove=function(t){delete this.waypoints[t.axis][t.key],this.checkEmpty()},e.prototype.innerWidth=function(){return this.element==this.element.window?n.viewportWidth():this.adapter.innerWidth()},e.prototype.destroy=function(){var t=[];for(var e in this.waypoints)for(var i in this.waypoints[e])t.push(this.waypoints[e][i]);for(var o=0,n=t.length;n>o;o++)t[o].destroy()},e.prototype.refresh=function(){var t,e=this.element==this.element.window,i=e?void 0:this.adapter.offset(),o={};this.handleScroll(),t={horizontal:{contextOffset:e?0:i.left,contextScroll:e?0:this.oldScroll.x,contextDimension:this.innerWidth(),oldScroll:this.oldScroll.x,forward:"right",backward:"left",offsetProp:"left"},vertical:{contextOffset:e?0:i.top,contextScroll:e?0:this.oldScroll.y,contextDimension:this.innerHeight(),oldScroll:this.oldScroll.y,forward:"down",backward:"up",offsetProp:"top"}};for(var r in t){var s=t[r];for(var a in this.waypoints[r]){var l,h,p,u,c,d=this.waypoints[r][a],f=d.options.offset,w=d.triggerPoint,y=0,g=null==w;d.element!==d.element.window&&(y=d.adapter.offset()[s.offsetProp]),"function"==typeof f?f=f.apply(d):"string"==typeof f&&(f=parseFloat(f),d.options.offset.indexOf("%")>-1&&(f=Math.ceil(s.contextDimension*f/100))),l=s.contextScroll-s.contextOffset,d.triggerPoint=Math.floor(y+l-f),h=w<s.oldScroll,p=d.triggerPoint>=s.oldScroll,u=h&&p,c=!h&&!p,!g&&u?(d.queueTrigger(s.backward),o[d.group.id]=d.group):!g&&c?(d.queueTrigger(s.forward),o[d.group.id]=d.group):g&&s.oldScroll>=d.triggerPoint&&(d.queueTrigger(s.forward),o[d.group.id]=d.group)}}return n.requestAnimationFrame(function(){for(var t in o)o[t].flushTriggers()}),this},e.findOrCreateByElement=function(t){return e.findByElement(t)||new e(t)},e.refreshAll=function(){for(var t in o)o[t].refresh()},e.findByElement=function(t){return o[t.waypointContextKey]},window.onload=function(){r&&r(),e.refreshAll()},n.requestAnimationFrame=function(e){var i=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||t;i.call(window,e)},n.Context=e}(),function(){"use strict";function t(t,e){return t.triggerPoint-e.triggerPoint}function e(t,e){return e.triggerPoint-t.triggerPoint}function i(t){this.name=t.name,this.axis=t.axis,this.id=this.name+"-"+this.axis,this.waypoints=[],this.clearTriggerQueues(),o[this.axis][this.name]=this}var o={vertical:{},horizontal:{}},n=window.Waypoint;i.prototype.add=function(t){this.waypoints.push(t)},i.prototype.clearTriggerQueues=function(){this.triggerQueues={up:[],down:[],left:[],right:[]}},i.prototype.flushTriggers=function(){for(var i in this.triggerQueues){var o=this.triggerQueues[i],n="up"===i||"left"===i;o.sort(n?e:t);for(var r=0,s=o.length;s>r;r+=1){var a=o[r];(a.options.continuous||r===o.length-1)&&a.trigger([i])}}this.clearTriggerQueues()},i.prototype.next=function(e){this.waypoints.sort(t);var i=n.Adapter.inArray(e,this.waypoints),o=i===this.waypoints.length-1;return o?null:this.waypoints[i+1]},i.prototype.previous=function(e){this.waypoints.sort(t);var i=n.Adapter.inArray(e,this.waypoints);return i?this.waypoints[i-1]:null},i.prototype.queueTrigger=function(t,e){this.triggerQueues[e].push(t)},i.prototype.remove=function(t){var e=n.Adapter.inArray(t,this.waypoints);e>-1&&this.waypoints.splice(e,1)},i.prototype.first=function(){return this.waypoints[0]},i.prototype.last=function(){return this.waypoints[this.waypoints.length-1]},i.findOrCreate=function(t){return o[t.axis][t.name]||new i(t)},n.Group=i}(),function(){"use strict";function t(t){this.$element=e(t)}var e=window.jQuery,i=window.Waypoint;e.each(["innerHeight","innerWidth","off","offset","on","outerHeight","outerWidth","scrollLeft","scrollTop"],function(e,i){t.prototype[i]=function(){var t=Array.prototype.slice.call(arguments);return this.$element[i].apply(this.$element,t)}}),e.each(["extend","inArray","isEmptyObject"],function(i,o){t[o]=e[o]}),i.adapters.push({name:"jquery",Adapter:t}),i.Adapter=t}(),function(){"use strict";function t(t){return function(){var i=[],o=arguments[0];return t.isFunction(arguments[0])&&(o=t.extend({},arguments[1]),o.handler=arguments[0]),this.each(function(){var n=t.extend({},o,{element:this});"string"==typeof n.context&&(n.context=t(this).closest(n.context)[0]),i.push(new e(n))}),i}}var e=window.Waypoint;window.jQuery&&(window.jQuery.fn.waypoint=t(window.jQuery)),window.Zepto&&(window.Zepto.fn.waypoint=t(window.Zepto))}();
/*!
 * Lazy Load - JavaScript plugin for lazy loading images
 *
 * Copyright (c) 2007-2019 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   https://appelsiini.net/projects/lazyload
 *
 * Version: 2.0.0-rc.2
 *
 */

(function (root, factory) {
    if (typeof exports === "object") {
        module.exports = factory(root);
    } else if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        root.LazyLoad = factory(root);
    }
}) (typeof global !== "undefined" ? global : this.window || this.global, function (root) {

    "use strict";

    if (typeof define === "function" && define.amd){
        root = window;
    }

    const defaults = {
        src: "data-src",
        srcset: "data-srcset",
        selector: ".lazyload",
        root: null,
        rootMargin: "0px",
        threshold: 0
    };

    /**
    * Merge two or more objects. Returns a new object.
    * @private
    * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
    * @param {Object}   objects  The objects to merge together
    * @returns {Object}          Merged values of defaults and options
    */
    const extend = function ()  {

        let extended = {};
        let deep = false;
        let i = 0;
        let length = arguments.length;

        /* Check if a deep merge */
        if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
            deep = arguments[0];
            i++;
        }

        /* Merge the object into the extended object */
        let merge = function (obj) {
            for (let prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    /* If deep merge and property is an object, merge properties */
                    if (deep && Object.prototype.toString.call(obj[prop]) === "[object Object]") {
                        extended[prop] = extend(true, extended[prop], obj[prop]);
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };

        /* Loop through each object and conduct a merge */
        for (; i < length; i++) {
            let obj = arguments[i];
            merge(obj);
        }

        return extended;
    };

    function LazyLoad(images, options) {
        this.settings = extend(defaults, options || {});
        this.images = images || document.querySelectorAll(this.settings.selector);
        this.observer = null;
        this.init();
    }

    LazyLoad.prototype = {
        init: function() {

            /* Without observers load everything and bail out early. */
            if (!root.IntersectionObserver) {
                this.loadImages();
                return;
            }

            let self = this;
            let observerConfig = {
                root: this.settings.root,
                rootMargin: this.settings.rootMargin,
                threshold: [this.settings.threshold]
            };

            this.observer = new IntersectionObserver(function(entries) {
                Array.prototype.forEach.call(entries, function (entry) {
                    if (entry.isIntersecting) {
                        self.observer.unobserve(entry.target);
                        let src = entry.target.getAttribute(self.settings.src);
                        let srcset = entry.target.getAttribute(self.settings.srcset);
                        if ("img" === entry.target.tagName.toLowerCase()) {
                            if (src) {
                                entry.target.src = src;
                            }
                            if (srcset) {
                                entry.target.srcset = srcset;
                            }
                        } else {
                            entry.target.style.backgroundImage = "url(" + src + ")";
                        }
                    }
                });
            }, observerConfig);

            Array.prototype.forEach.call(this.images, function (image) {
                self.observer.observe(image);
            });
        },

        loadAndDestroy: function () {
            if (!this.settings) { return; }
            this.loadImages();
            this.destroy();
        },

        loadImages: function () {
            if (!this.settings) { return; }

            let self = this;
            Array.prototype.forEach.call(this.images, function (image) {
                let src = image.getAttribute(self.settings.src);
                let srcset = image.getAttribute(self.settings.srcset);
                if ("img" === image.tagName.toLowerCase()) {
                    if (src) {
                        image.src = src;
                    }
                    if (srcset) {
                        image.srcset = srcset;
                    }
                } else {
                    image.style.backgroundImage = "url('" + src + "')";
                }
            });
        },

        destroy: function () {
            if (!this.settings) { return; }
            this.observer.disconnect();
            this.settings = null;
        }
    };

    root.lazyload = function(images, options) {
        return new LazyLoad(images, options);
    };

    if (root.jQuery) {
        const $ = root.jQuery;
        $.fn.lazyload = function (options) {
            options = options || {};
            options.attribute = options.attribute || "data-src";
            new LazyLoad($.makeArray(this), options);
            return this;
        };
    }

    return LazyLoad;
});

/*!
 * Masonry PACKAGED v4.2.2
 * Cascading grid layout library
 * https://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

!function(t,e){"function"==typeof define&&define.amd?define("jquery-bridget/jquery-bridget",["jquery"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("jquery")):t.jQueryBridget=e(t,t.jQuery)}(window,function(t,e){"use strict";function i(i,r,a){function h(t,e,n){var o,r="$()."+i+'("'+e+'")';return t.each(function(t,h){var u=a.data(h,i);if(!u)return void s(i+" not initialized. Cannot call methods, i.e. "+r);var d=u[e];if(!d||"_"==e.charAt(0))return void s(r+" is not a valid method");var l=d.apply(u,n);o=void 0===o?l:o}),void 0!==o?o:t}function u(t,e){t.each(function(t,n){var o=a.data(n,i);o?(o.option(e),o._init()):(o=new r(n,e),a.data(n,i,o))})}a=a||e||t.jQuery,a&&(r.prototype.option||(r.prototype.option=function(t){a.isPlainObject(t)&&(this.options=a.extend(!0,this.options,t))}),a.fn[i]=function(t){if("string"==typeof t){var e=o.call(arguments,1);return h(this,t,e)}return u(this,t),this},n(a))}function n(t){!t||t&&t.bridget||(t.bridget=i)}var o=Array.prototype.slice,r=t.console,s="undefined"==typeof r?function(){}:function(t){r.error(t)};return n(e||t.jQuery),i}),function(t,e){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",e):"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}("undefined"!=typeof window?window:this,function(){function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var i=this._events=this._events||{},n=i[t]=i[t]||[];return-1==n.indexOf(e)&&n.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var i=this._onceEvents=this._onceEvents||{},n=i[t]=i[t]||{};return n[e]=!0,this}},e.off=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=i.indexOf(e);return-1!=n&&i.splice(n,1),this}},e.emitEvent=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){i=i.slice(0),e=e||[];for(var n=this._onceEvents&&this._onceEvents[t],o=0;o<i.length;o++){var r=i[o],s=n&&n[r];s&&(this.off(t,r),delete n[r]),r.apply(this,e)}return this}},e.allOff=function(){delete this._events,delete this._onceEvents},t}),function(t,e){"function"==typeof define&&define.amd?define("get-size/get-size",e):"object"==typeof module&&module.exports?module.exports=e():t.getSize=e()}(window,function(){"use strict";function t(t){var e=parseFloat(t),i=-1==t.indexOf("%")&&!isNaN(e);return i&&e}function e(){}function i(){for(var t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},e=0;u>e;e++){var i=h[e];t[i]=0}return t}function n(t){var e=getComputedStyle(t);return e||a("Style returned "+e+". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1"),e}function o(){if(!d){d=!0;var e=document.createElement("div");e.style.width="200px",e.style.padding="1px 2px 3px 4px",e.style.borderStyle="solid",e.style.borderWidth="1px 2px 3px 4px",e.style.boxSizing="border-box";var i=document.body||document.documentElement;i.appendChild(e);var o=n(e);s=200==Math.round(t(o.width)),r.isBoxSizeOuter=s,i.removeChild(e)}}function r(e){if(o(),"string"==typeof e&&(e=document.querySelector(e)),e&&"object"==typeof e&&e.nodeType){var r=n(e);if("none"==r.display)return i();var a={};a.width=e.offsetWidth,a.height=e.offsetHeight;for(var d=a.isBorderBox="border-box"==r.boxSizing,l=0;u>l;l++){var c=h[l],f=r[c],m=parseFloat(f);a[c]=isNaN(m)?0:m}var p=a.paddingLeft+a.paddingRight,g=a.paddingTop+a.paddingBottom,y=a.marginLeft+a.marginRight,v=a.marginTop+a.marginBottom,_=a.borderLeftWidth+a.borderRightWidth,z=a.borderTopWidth+a.borderBottomWidth,E=d&&s,b=t(r.width);b!==!1&&(a.width=b+(E?0:p+_));var x=t(r.height);return x!==!1&&(a.height=x+(E?0:g+z)),a.innerWidth=a.width-(p+_),a.innerHeight=a.height-(g+z),a.outerWidth=a.width+y,a.outerHeight=a.height+v,a}}var s,a="undefined"==typeof console?e:function(t){console.error(t)},h=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"],u=h.length,d=!1;return r}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("desandro-matches-selector/matches-selector",e):"object"==typeof module&&module.exports?module.exports=e():t.matchesSelector=e()}(window,function(){"use strict";var t=function(){var t=window.Element.prototype;if(t.matches)return"matches";if(t.matchesSelector)return"matchesSelector";for(var e=["webkit","moz","ms","o"],i=0;i<e.length;i++){var n=e[i],o=n+"MatchesSelector";if(t[o])return o}}();return function(e,i){return e[t](i)}}),function(t,e){"function"==typeof define&&define.amd?define("fizzy-ui-utils/utils",["desandro-matches-selector/matches-selector"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("desandro-matches-selector")):t.fizzyUIUtils=e(t,t.matchesSelector)}(window,function(t,e){var i={};i.extend=function(t,e){for(var i in e)t[i]=e[i];return t},i.modulo=function(t,e){return(t%e+e)%e};var n=Array.prototype.slice;i.makeArray=function(t){if(Array.isArray(t))return t;if(null===t||void 0===t)return[];var e="object"==typeof t&&"number"==typeof t.length;return e?n.call(t):[t]},i.removeFrom=function(t,e){var i=t.indexOf(e);-1!=i&&t.splice(i,1)},i.getParent=function(t,i){for(;t.parentNode&&t!=document.body;)if(t=t.parentNode,e(t,i))return t},i.getQueryElement=function(t){return"string"==typeof t?document.querySelector(t):t},i.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},i.filterFindElements=function(t,n){t=i.makeArray(t);var o=[];return t.forEach(function(t){if(t instanceof HTMLElement){if(!n)return void o.push(t);e(t,n)&&o.push(t);for(var i=t.querySelectorAll(n),r=0;r<i.length;r++)o.push(i[r])}}),o},i.debounceMethod=function(t,e,i){i=i||100;var n=t.prototype[e],o=e+"Timeout";t.prototype[e]=function(){var t=this[o];clearTimeout(t);var e=arguments,r=this;this[o]=setTimeout(function(){n.apply(r,e),delete r[o]},i)}},i.docReady=function(t){var e=document.readyState;"complete"==e||"interactive"==e?setTimeout(t):document.addEventListener("DOMContentLoaded",t)},i.toDashed=function(t){return t.replace(/(.)([A-Z])/g,function(t,e,i){return e+"-"+i}).toLowerCase()};var o=t.console;return i.htmlInit=function(e,n){i.docReady(function(){var r=i.toDashed(n),s="data-"+r,a=document.querySelectorAll("["+s+"]"),h=document.querySelectorAll(".js-"+r),u=i.makeArray(a).concat(i.makeArray(h)),d=s+"-options",l=t.jQuery;u.forEach(function(t){var i,r=t.getAttribute(s)||t.getAttribute(d);try{i=r&&JSON.parse(r)}catch(a){return void(o&&o.error("Error parsing "+s+" on "+t.className+": "+a))}var h=new e(t,i);l&&l.data(t,n,h)})})},i}),function(t,e){"function"==typeof define&&define.amd?define("outlayer/item",["ev-emitter/ev-emitter","get-size/get-size"],e):"object"==typeof module&&module.exports?module.exports=e(require("ev-emitter"),require("get-size")):(t.Outlayer={},t.Outlayer.Item=e(t.EvEmitter,t.getSize))}(window,function(t,e){"use strict";function i(t){for(var e in t)return!1;return e=null,!0}function n(t,e){t&&(this.element=t,this.layout=e,this.position={x:0,y:0},this._create())}function o(t){return t.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})}var r=document.documentElement.style,s="string"==typeof r.transition?"transition":"WebkitTransition",a="string"==typeof r.transform?"transform":"WebkitTransform",h={WebkitTransition:"webkitTransitionEnd",transition:"transitionend"}[s],u={transform:a,transition:s,transitionDuration:s+"Duration",transitionProperty:s+"Property",transitionDelay:s+"Delay"},d=n.prototype=Object.create(t.prototype);d.constructor=n,d._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},d.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},d.getSize=function(){this.size=e(this.element)},d.css=function(t){var e=this.element.style;for(var i in t){var n=u[i]||i;e[n]=t[i]}},d.getPosition=function(){var t=getComputedStyle(this.element),e=this.layout._getOption("originLeft"),i=this.layout._getOption("originTop"),n=t[e?"left":"right"],o=t[i?"top":"bottom"],r=parseFloat(n),s=parseFloat(o),a=this.layout.size;-1!=n.indexOf("%")&&(r=r/100*a.width),-1!=o.indexOf("%")&&(s=s/100*a.height),r=isNaN(r)?0:r,s=isNaN(s)?0:s,r-=e?a.paddingLeft:a.paddingRight,s-=i?a.paddingTop:a.paddingBottom,this.position.x=r,this.position.y=s},d.layoutPosition=function(){var t=this.layout.size,e={},i=this.layout._getOption("originLeft"),n=this.layout._getOption("originTop"),o=i?"paddingLeft":"paddingRight",r=i?"left":"right",s=i?"right":"left",a=this.position.x+t[o];e[r]=this.getXValue(a),e[s]="";var h=n?"paddingTop":"paddingBottom",u=n?"top":"bottom",d=n?"bottom":"top",l=this.position.y+t[h];e[u]=this.getYValue(l),e[d]="",this.css(e),this.emitEvent("layout",[this])},d.getXValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&!e?t/this.layout.size.width*100+"%":t+"px"},d.getYValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&e?t/this.layout.size.height*100+"%":t+"px"},d._transitionTo=function(t,e){this.getPosition();var i=this.position.x,n=this.position.y,o=t==this.position.x&&e==this.position.y;if(this.setPosition(t,e),o&&!this.isTransitioning)return void this.layoutPosition();var r=t-i,s=e-n,a={};a.transform=this.getTranslate(r,s),this.transition({to:a,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})},d.getTranslate=function(t,e){var i=this.layout._getOption("originLeft"),n=this.layout._getOption("originTop");return t=i?t:-t,e=n?e:-e,"translate3d("+t+"px, "+e+"px, 0)"},d.goTo=function(t,e){this.setPosition(t,e),this.layoutPosition()},d.moveTo=d._transitionTo,d.setPosition=function(t,e){this.position.x=parseFloat(t),this.position.y=parseFloat(e)},d._nonTransition=function(t){this.css(t.to),t.isCleaning&&this._removeStyles(t.to);for(var e in t.onTransitionEnd)t.onTransitionEnd[e].call(this)},d.transition=function(t){if(!parseFloat(this.layout.options.transitionDuration))return void this._nonTransition(t);var e=this._transn;for(var i in t.onTransitionEnd)e.onEnd[i]=t.onTransitionEnd[i];for(i in t.to)e.ingProperties[i]=!0,t.isCleaning&&(e.clean[i]=!0);if(t.from){this.css(t.from);var n=this.element.offsetHeight;n=null}this.enableTransition(t.to),this.css(t.to),this.isTransitioning=!0};var l="opacity,"+o(a);d.enableTransition=function(){if(!this.isTransitioning){var t=this.layout.options.transitionDuration;t="number"==typeof t?t+"ms":t,this.css({transitionProperty:l,transitionDuration:t,transitionDelay:this.staggerDelay||0}),this.element.addEventListener(h,this,!1)}},d.onwebkitTransitionEnd=function(t){this.ontransitionend(t)},d.onotransitionend=function(t){this.ontransitionend(t)};var c={"-webkit-transform":"transform"};d.ontransitionend=function(t){if(t.target===this.element){var e=this._transn,n=c[t.propertyName]||t.propertyName;if(delete e.ingProperties[n],i(e.ingProperties)&&this.disableTransition(),n in e.clean&&(this.element.style[t.propertyName]="",delete e.clean[n]),n in e.onEnd){var o=e.onEnd[n];o.call(this),delete e.onEnd[n]}this.emitEvent("transitionEnd",[this])}},d.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(h,this,!1),this.isTransitioning=!1},d._removeStyles=function(t){var e={};for(var i in t)e[i]="";this.css(e)};var f={transitionProperty:"",transitionDuration:"",transitionDelay:""};return d.removeTransitionStyles=function(){this.css(f)},d.stagger=function(t){t=isNaN(t)?0:t,this.staggerDelay=t+"ms"},d.removeElem=function(){this.element.parentNode.removeChild(this.element),this.css({display:""}),this.emitEvent("remove",[this])},d.remove=function(){return s&&parseFloat(this.layout.options.transitionDuration)?(this.once("transitionEnd",function(){this.removeElem()}),void this.hide()):void this.removeElem()},d.reveal=function(){delete this.isHidden,this.css({display:""});var t=this.layout.options,e={},i=this.getHideRevealTransitionEndProperty("visibleStyle");e[i]=this.onRevealTransitionEnd,this.transition({from:t.hiddenStyle,to:t.visibleStyle,isCleaning:!0,onTransitionEnd:e})},d.onRevealTransitionEnd=function(){this.isHidden||this.emitEvent("reveal")},d.getHideRevealTransitionEndProperty=function(t){var e=this.layout.options[t];if(e.opacity)return"opacity";for(var i in e)return i},d.hide=function(){this.isHidden=!0,this.css({display:""});var t=this.layout.options,e={},i=this.getHideRevealTransitionEndProperty("hiddenStyle");e[i]=this.onHideTransitionEnd,this.transition({from:t.visibleStyle,to:t.hiddenStyle,isCleaning:!0,onTransitionEnd:e})},d.onHideTransitionEnd=function(){this.isHidden&&(this.css({display:"none"}),this.emitEvent("hide"))},d.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},n}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("outlayer/outlayer",["ev-emitter/ev-emitter","get-size/get-size","fizzy-ui-utils/utils","./item"],function(i,n,o,r){return e(t,i,n,o,r)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter"),require("get-size"),require("fizzy-ui-utils"),require("./item")):t.Outlayer=e(t,t.EvEmitter,t.getSize,t.fizzyUIUtils,t.Outlayer.Item)}(window,function(t,e,i,n,o){"use strict";function r(t,e){var i=n.getQueryElement(t);if(!i)return void(h&&h.error("Bad element for "+this.constructor.namespace+": "+(i||t)));this.element=i,u&&(this.$element=u(this.element)),this.options=n.extend({},this.constructor.defaults),this.option(e);var o=++l;this.element.outlayerGUID=o,c[o]=this,this._create();var r=this._getOption("initLayout");r&&this.layout()}function s(t){function e(){t.apply(this,arguments)}return e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e}function a(t){if("number"==typeof t)return t;var e=t.match(/(^\d*\.?\d*)(\w*)/),i=e&&e[1],n=e&&e[2];if(!i.length)return 0;i=parseFloat(i);var o=m[n]||1;return i*o}var h=t.console,u=t.jQuery,d=function(){},l=0,c={};r.namespace="outlayer",r.Item=o,r.defaults={containerStyle:{position:"relative"},initLayout:!0,originLeft:!0,originTop:!0,resize:!0,resizeContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}};var f=r.prototype;n.extend(f,e.prototype),f.option=function(t){n.extend(this.options,t)},f._getOption=function(t){var e=this.constructor.compatOptions[t];return e&&void 0!==this.options[e]?this.options[e]:this.options[t]},r.compatOptions={initLayout:"isInitLayout",horizontal:"isHorizontal",layoutInstant:"isLayoutInstant",originLeft:"isOriginLeft",originTop:"isOriginTop",resize:"isResizeBound",resizeContainer:"isResizingContainer"},f._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),n.extend(this.element.style,this.options.containerStyle);var t=this._getOption("resize");t&&this.bindResize()},f.reloadItems=function(){this.items=this._itemize(this.element.children)},f._itemize=function(t){for(var e=this._filterFindItemElements(t),i=this.constructor.Item,n=[],o=0;o<e.length;o++){var r=e[o],s=new i(r,this);n.push(s)}return n},f._filterFindItemElements=function(t){return n.filterFindElements(t,this.options.itemSelector)},f.getItemElements=function(){return this.items.map(function(t){return t.element})},f.layout=function(){this._resetLayout(),this._manageStamps();var t=this._getOption("layoutInstant"),e=void 0!==t?t:!this._isLayoutInited;this.layoutItems(this.items,e),this._isLayoutInited=!0},f._init=f.layout,f._resetLayout=function(){this.getSize()},f.getSize=function(){this.size=i(this.element)},f._getMeasurement=function(t,e){var n,o=this.options[t];o?("string"==typeof o?n=this.element.querySelector(o):o instanceof HTMLElement&&(n=o),this[t]=n?i(n)[e]:o):this[t]=0},f.layoutItems=function(t,e){t=this._getItemsForLayout(t),this._layoutItems(t,e),this._postLayout()},f._getItemsForLayout=function(t){return t.filter(function(t){return!t.isIgnored})},f._layoutItems=function(t,e){if(this._emitCompleteOnItems("layout",t),t&&t.length){var i=[];t.forEach(function(t){var n=this._getItemLayoutPosition(t);n.item=t,n.isInstant=e||t.isLayoutInstant,i.push(n)},this),this._processLayoutQueue(i)}},f._getItemLayoutPosition=function(){return{x:0,y:0}},f._processLayoutQueue=function(t){this.updateStagger(),t.forEach(function(t,e){this._positionItem(t.item,t.x,t.y,t.isInstant,e)},this)},f.updateStagger=function(){var t=this.options.stagger;return null===t||void 0===t?void(this.stagger=0):(this.stagger=a(t),this.stagger)},f._positionItem=function(t,e,i,n,o){n?t.goTo(e,i):(t.stagger(o*this.stagger),t.moveTo(e,i))},f._postLayout=function(){this.resizeContainer()},f.resizeContainer=function(){var t=this._getOption("resizeContainer");if(t){var e=this._getContainerSize();e&&(this._setContainerMeasure(e.width,!0),this._setContainerMeasure(e.height,!1))}},f._getContainerSize=d,f._setContainerMeasure=function(t,e){if(void 0!==t){var i=this.size;i.isBorderBox&&(t+=e?i.paddingLeft+i.paddingRight+i.borderLeftWidth+i.borderRightWidth:i.paddingBottom+i.paddingTop+i.borderTopWidth+i.borderBottomWidth),t=Math.max(t,0),this.element.style[e?"width":"height"]=t+"px"}},f._emitCompleteOnItems=function(t,e){function i(){o.dispatchEvent(t+"Complete",null,[e])}function n(){s++,s==r&&i()}var o=this,r=e.length;if(!e||!r)return void i();var s=0;e.forEach(function(e){e.once(t,n)})},f.dispatchEvent=function(t,e,i){var n=e?[e].concat(i):i;if(this.emitEvent(t,n),u)if(this.$element=this.$element||u(this.element),e){var o=u.Event(e);o.type=t,this.$element.trigger(o,i)}else this.$element.trigger(t,i)},f.ignore=function(t){var e=this.getItem(t);e&&(e.isIgnored=!0)},f.unignore=function(t){var e=this.getItem(t);e&&delete e.isIgnored},f.stamp=function(t){t=this._find(t),t&&(this.stamps=this.stamps.concat(t),t.forEach(this.ignore,this))},f.unstamp=function(t){t=this._find(t),t&&t.forEach(function(t){n.removeFrom(this.stamps,t),this.unignore(t)},this)},f._find=function(t){return t?("string"==typeof t&&(t=this.element.querySelectorAll(t)),t=n.makeArray(t)):void 0},f._manageStamps=function(){this.stamps&&this.stamps.length&&(this._getBoundingRect(),this.stamps.forEach(this._manageStamp,this))},f._getBoundingRect=function(){var t=this.element.getBoundingClientRect(),e=this.size;this._boundingRect={left:t.left+e.paddingLeft+e.borderLeftWidth,top:t.top+e.paddingTop+e.borderTopWidth,right:t.right-(e.paddingRight+e.borderRightWidth),bottom:t.bottom-(e.paddingBottom+e.borderBottomWidth)}},f._manageStamp=d,f._getElementOffset=function(t){var e=t.getBoundingClientRect(),n=this._boundingRect,o=i(t),r={left:e.left-n.left-o.marginLeft,top:e.top-n.top-o.marginTop,right:n.right-e.right-o.marginRight,bottom:n.bottom-e.bottom-o.marginBottom};return r},f.handleEvent=n.handleEvent,f.bindResize=function(){t.addEventListener("resize",this),this.isResizeBound=!0},f.unbindResize=function(){t.removeEventListener("resize",this),this.isResizeBound=!1},f.onresize=function(){this.resize()},n.debounceMethod(r,"onresize",100),f.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},f.needsResizeLayout=function(){var t=i(this.element),e=this.size&&t;return e&&t.innerWidth!==this.size.innerWidth},f.addItems=function(t){var e=this._itemize(t);return e.length&&(this.items=this.items.concat(e)),e},f.appended=function(t){var e=this.addItems(t);e.length&&(this.layoutItems(e,!0),this.reveal(e))},f.prepended=function(t){var e=this._itemize(t);if(e.length){var i=this.items.slice(0);this.items=e.concat(i),this._resetLayout(),this._manageStamps(),this.layoutItems(e,!0),this.reveal(e),this.layoutItems(i)}},f.reveal=function(t){if(this._emitCompleteOnItems("reveal",t),t&&t.length){var e=this.updateStagger();t.forEach(function(t,i){t.stagger(i*e),t.reveal()})}},f.hide=function(t){if(this._emitCompleteOnItems("hide",t),t&&t.length){var e=this.updateStagger();t.forEach(function(t,i){t.stagger(i*e),t.hide()})}},f.revealItemElements=function(t){var e=this.getItems(t);this.reveal(e)},f.hideItemElements=function(t){var e=this.getItems(t);this.hide(e)},f.getItem=function(t){for(var e=0;e<this.items.length;e++){var i=this.items[e];if(i.element==t)return i}},f.getItems=function(t){t=n.makeArray(t);var e=[];return t.forEach(function(t){var i=this.getItem(t);i&&e.push(i)},this),e},f.remove=function(t){var e=this.getItems(t);this._emitCompleteOnItems("remove",e),e&&e.length&&e.forEach(function(t){t.remove(),n.removeFrom(this.items,t)},this)},f.destroy=function(){var t=this.element.style;t.height="",t.position="",t.width="",this.items.forEach(function(t){t.destroy()}),this.unbindResize();var e=this.element.outlayerGUID;delete c[e],delete this.element.outlayerGUID,u&&u.removeData(this.element,this.constructor.namespace)},r.data=function(t){t=n.getQueryElement(t);var e=t&&t.outlayerGUID;return e&&c[e]},r.create=function(t,e){var i=s(r);return i.defaults=n.extend({},r.defaults),n.extend(i.defaults,e),i.compatOptions=n.extend({},r.compatOptions),i.namespace=t,i.data=r.data,i.Item=s(o),n.htmlInit(i,t),u&&u.bridget&&u.bridget(t,i),i};var m={ms:1,s:1e3};return r.Item=o,r}),function(t,e){"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size"],e):"object"==typeof module&&module.exports?module.exports=e(require("outlayer"),require("get-size")):t.Masonry=e(t.Outlayer,t.getSize)}(window,function(t,e){var i=t.create("masonry");i.compatOptions.fitWidth="isFitWidth";var n=i.prototype;return n._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns(),this.colYs=[];for(var t=0;t<this.cols;t++)this.colYs.push(0);this.maxY=0,this.horizontalColIndex=0},n.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var t=this.items[0],i=t&&t.element;this.columnWidth=i&&e(i).outerWidth||this.containerWidth}var n=this.columnWidth+=this.gutter,o=this.containerWidth+this.gutter,r=o/n,s=n-o%n,a=s&&1>s?"round":"floor";r=Math[a](r),this.cols=Math.max(r,1)},n.getContainerWidth=function(){var t=this._getOption("fitWidth"),i=t?this.element.parentNode:this.element,n=e(i);this.containerWidth=n&&n.innerWidth},n._getItemLayoutPosition=function(t){t.getSize();var e=t.size.outerWidth%this.columnWidth,i=e&&1>e?"round":"ceil",n=Math[i](t.size.outerWidth/this.columnWidth);n=Math.min(n,this.cols);for(var o=this.options.horizontalOrder?"_getHorizontalColPosition":"_getTopColPosition",r=this[o](n,t),s={x:this.columnWidth*r.col,y:r.y},a=r.y+t.size.outerHeight,h=n+r.col,u=r.col;h>u;u++)this.colYs[u]=a;return s},n._getTopColPosition=function(t){var e=this._getTopColGroup(t),i=Math.min.apply(Math,e);return{col:e.indexOf(i),y:i}},n._getTopColGroup=function(t){if(2>t)return this.colYs;for(var e=[],i=this.cols+1-t,n=0;i>n;n++)e[n]=this._getColGroupY(n,t);return e},n._getColGroupY=function(t,e){if(2>e)return this.colYs[t];var i=this.colYs.slice(t,t+e);return Math.max.apply(Math,i)},n._getHorizontalColPosition=function(t,e){var i=this.horizontalColIndex%this.cols,n=t>1&&i+t>this.cols;i=n?0:i;var o=e.size.outerWidth&&e.size.outerHeight;return this.horizontalColIndex=o?i+t:this.horizontalColIndex,{col:i,y:this._getColGroupY(i,t)}},n._manageStamp=function(t){var i=e(t),n=this._getElementOffset(t),o=this._getOption("originLeft"),r=o?n.left:n.right,s=r+i.outerWidth,a=Math.floor(r/this.columnWidth);a=Math.max(0,a);var h=Math.floor(s/this.columnWidth);h-=s%this.columnWidth?0:1,h=Math.min(this.cols-1,h);for(var u=this._getOption("originTop"),d=(u?n.top:n.bottom)+i.outerHeight,l=a;h>=l;l++)this.colYs[l]=Math.max(d,this.colYs[l])},n._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var t={height:this.maxY};return this._getOption("fitWidth")&&(t.width=this._getContainerFitWidth()),t},n._getContainerFitWidth=function(){for(var t=0,e=this.cols;--e&&0===this.colYs[e];)t++;return(this.cols-t)*this.columnWidth-this.gutter},n.needsResizeLayout=function(){var t=this.containerWidth;return this.getContainerWidth(),t!=this.containerWidth},i});
/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
( function() {
	var container, button, menu, links, i, len;

	container = document.getElementById( 'site-navigation' );
	if ( ! container ) {
		return;
	}

	button = container.getElementsByTagName( 'button' )[0];
	if ( 'undefined' === typeof button ) {
		return;
	}

	menu = container.getElementsByTagName( 'ul' )[0];

	// Hide menu toggle button if menu is empty and return early.
	if ( 'undefined' === typeof menu ) {
		button.style.display = 'none';
		return;
	}

	menu.setAttribute( 'aria-expanded', 'false' );
	if ( -1 === menu.className.indexOf( 'nav-menu' ) ) {
		menu.className += ' nav-menu';
	}

	button.onclick = function() {
		if ( -1 !== container.className.indexOf( 'toggled' ) ) {
			container.className = container.className.replace( ' toggled', '' );
			button.setAttribute( 'aria-expanded', 'false' );
			menu.setAttribute( 'aria-expanded', 'false' );
		} else {
			container.className += ' toggled';
			button.setAttribute( 'aria-expanded', 'true' );
			menu.setAttribute( 'aria-expanded', 'true' );
		}
	};

	// Get all the link elements within the menu.
	links    = menu.getElementsByTagName( 'a' );

	// Each time a menu link is focused or blurred, toggle focus.
	for ( i = 0, len = links.length; i < len; i++ ) {
		links[i].addEventListener( 'focus', toggleFocus, true );
		links[i].addEventListener( 'blur', toggleFocus, true );
	}

	/**
	 * Sets or removes .focus class on an element.
	 */
	function toggleFocus() {
		var self = this;

		// Move up through the ancestors of the current link until we hit .nav-menu.
		while ( -1 === self.className.indexOf( 'nav-menu' ) ) {

			// On li elements toggle the class .focus.
			if ( 'li' === self.tagName.toLowerCase() ) {
				if ( -1 !== self.className.indexOf( 'focus' ) ) {
					self.className = self.className.replace( ' focus', '' );
				} else {
					self.className += ' focus';
				}
			}

			self = self.parentElement;
		}
	}

	/**
	 * Toggles `focus` class to allow submenu access on tablets.
	 */
	( function( container ) {
		var touchStartFn, i,
			parentLink = container.querySelectorAll( '.menu-item-has-children > a, .page_item_has_children > a' );

		if ( 'ontouchstart' in window ) {
			touchStartFn = function( e ) {
				var menuItem = this.parentNode, i;

				if ( ! menuItem.classList.contains( 'focus' ) ) {
					e.preventDefault();
					for ( i = 0; i < menuItem.parentNode.children.length; ++i ) {
						if ( menuItem === menuItem.parentNode.children[i] ) {
							continue;
						}
						menuItem.parentNode.children[i].classList.remove( 'focus' );
					}
					menuItem.classList.add( 'focus' );
				} else {
					menuItem.classList.remove( 'focus' );
				}
			};

			for ( i = 0; i < parentLink.length; ++i ) {
				parentLink[i].addEventListener( 'touchstart', touchStartFn, false );
			}
		}
	}( container ) );
} )();

/**
 * @popperjs/core v2.4.4 - MIT License
 */

"use strict";!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e=e||self).Popper={})}(this,(function(e){function t(e){return{width:(e=e.getBoundingClientRect()).width,height:e.height,top:e.top,right:e.right,bottom:e.bottom,left:e.left,x:e.left,y:e.top}}function n(e){return"[object Window]"!==e.toString()?(e=e.ownerDocument)?e.defaultView:window:e}function r(e){return{scrollLeft:(e=n(e)).pageXOffset,scrollTop:e.pageYOffset}}function o(e){return e instanceof n(e).Element||e instanceof Element}function i(e){return e instanceof n(e).HTMLElement||e instanceof HTMLElement}function a(e){return e?(e.nodeName||"").toLowerCase():null}function s(e){return(o(e)?e.ownerDocument:e.document).documentElement}function f(e){return t(s(e)).left+r(e).scrollLeft}function c(e){return n(e).getComputedStyle(e)}function p(e){return e=c(e),/auto|scroll|overlay|hidden/.test(e.overflow+e.overflowY+e.overflowX)}function l(e,o,c){void 0===c&&(c=!1);var l=s(o);e=t(e);var u=i(o),d={scrollLeft:0,scrollTop:0},m={x:0,y:0};return(u||!u&&!c)&&(("body"!==a(o)||p(l))&&(d=o!==n(o)&&i(o)?{scrollLeft:o.scrollLeft,scrollTop:o.scrollTop}:r(o)),i(o)?((m=t(o)).x+=o.clientLeft,m.y+=o.clientTop):l&&(m.x=f(l))),{x:e.left+d.scrollLeft-m.x,y:e.top+d.scrollTop-m.y,width:e.width,height:e.height}}function u(e){return{x:e.offsetLeft,y:e.offsetTop,width:e.offsetWidth,height:e.offsetHeight}}function d(e){return"html"===a(e)?e:e.assignedSlot||e.parentNode||e.host||s(e)}function m(e,t){void 0===t&&(t=[]);var r=function e(t){return 0<=["html","body","#document"].indexOf(a(t))?t.ownerDocument.body:i(t)&&p(t)?t:e(d(t))}(e);e="body"===a(r);var o=n(r);return r=e?[o].concat(o.visualViewport||[],p(r)?r:[]):r,t=t.concat(r),e?t:t.concat(m(d(r)))}function h(e){if(!i(e)||"fixed"===c(e).position)return null;if(e=e.offsetParent){var t=s(e);if("body"===a(e)&&"static"===c(e).position&&"static"!==c(t).position)return t}return e}function g(e){for(var t=n(e),r=h(e);r&&0<=["table","td","th"].indexOf(a(r))&&"static"===c(r).position;)r=h(r);if(r&&"body"===a(r)&&"static"===c(r).position)return t;if(!r)e:{for(e=d(e);i(e)&&0>["html","body"].indexOf(a(e));){if("none"!==(r=c(e)).transform||"none"!==r.perspective||r.willChange&&"auto"!==r.willChange){r=e;break e}e=e.parentNode}r=null}return r||t}function b(e){var t=new Map,n=new Set,r=[];return e.forEach((function(e){t.set(e.name,e)})),e.forEach((function(e){n.has(e.name)||function e(o){n.add(o.name),[].concat(o.requires||[],o.requiresIfExists||[]).forEach((function(r){n.has(r)||(r=t.get(r))&&e(r)})),r.push(o)}(e)})),r}function v(e){var t;return function(){return t||(t=new Promise((function(n){Promise.resolve().then((function(){t=void 0,n(e())}))}))),t}}function y(e){return e.split("-")[0]}function O(e,t){var n=!(!t.getRootNode||!t.getRootNode().host);if(e.contains(t))return!0;if(n)do{if(t&&e.isSameNode(t))return!0;t=t.parentNode||t.host}while(t);return!1}function x(e){return Object.assign(Object.assign({},e),{},{left:e.x,top:e.y,right:e.x+e.width,bottom:e.y+e.height})}function w(e,o){if("viewport"===o){o=n(e);var a=s(e);o=o.visualViewport;var p=a.clientWidth;a=a.clientHeight;var l=0,u=0;o&&(p=o.width,a=o.height,/^((?!chrome|android).)*safari/i.test(navigator.userAgent)||(l=o.offsetLeft,u=o.offsetTop)),e=x(e={width:p,height:a,x:l+f(e),y:u})}else i(o)?((e=t(o)).top+=o.clientTop,e.left+=o.clientLeft,e.bottom=e.top+o.clientHeight,e.right=e.left+o.clientWidth,e.width=o.clientWidth,e.height=o.clientHeight,e.x=e.left,e.y=e.top):(u=s(e),e=s(u),l=r(u),o=u.ownerDocument.body,p=Math.max(e.scrollWidth,e.clientWidth,o?o.scrollWidth:0,o?o.clientWidth:0),a=Math.max(e.scrollHeight,e.clientHeight,o?o.scrollHeight:0,o?o.clientHeight:0),u=-l.scrollLeft+f(u),l=-l.scrollTop,"rtl"===c(o||e).direction&&(u+=Math.max(e.clientWidth,o?o.clientWidth:0)-p),e=x({width:p,height:a,x:u,y:l}));return e}function j(e,t,n){return t="clippingParents"===t?function(e){var t=m(d(e)),n=0<=["absolute","fixed"].indexOf(c(e).position)&&i(e)?g(e):e;return o(n)?t.filter((function(e){return o(e)&&O(e,n)&&"body"!==a(e)})):[]}(e):[].concat(t),(n=(n=[].concat(t,[n])).reduce((function(t,n){return n=w(e,n),t.top=Math.max(n.top,t.top),t.right=Math.min(n.right,t.right),t.bottom=Math.min(n.bottom,t.bottom),t.left=Math.max(n.left,t.left),t}),w(e,n[0]))).width=n.right-n.left,n.height=n.bottom-n.top,n.x=n.left,n.y=n.top,n}function M(e){return 0<=["top","bottom"].indexOf(e)?"x":"y"}function E(e){var t=e.reference,n=e.element,r=(e=e.placement)?y(e):null;e=e?e.split("-")[1]:null;var o=t.x+t.width/2-n.width/2,i=t.y+t.height/2-n.height/2;switch(r){case"top":o={x:o,y:t.y-n.height};break;case"bottom":o={x:o,y:t.y+t.height};break;case"right":o={x:t.x+t.width,y:i};break;case"left":o={x:t.x-n.width,y:i};break;default:o={x:t.x,y:t.y}}if(null!=(r=r?M(r):null))switch(i="y"===r?"height":"width",e){case"start":o[r]=Math.floor(o[r])-Math.floor(t[i]/2-n[i]/2);break;case"end":o[r]=Math.floor(o[r])+Math.ceil(t[i]/2-n[i]/2)}return o}function D(e){return Object.assign(Object.assign({},{top:0,right:0,bottom:0,left:0}),e)}function P(e,t){return t.reduce((function(t,n){return t[n]=e,t}),{})}function k(e,n){void 0===n&&(n={});var r=n;n=void 0===(n=r.placement)?e.placement:n;var i=r.boundary,a=void 0===i?"clippingParents":i,f=void 0===(i=r.rootBoundary)?"viewport":i;i=void 0===(i=r.elementContext)?"popper":i;var c=r.altBoundary,p=void 0!==c&&c;r=D("number"!=typeof(r=void 0===(r=r.padding)?0:r)?r:P(r,q));var l=e.elements.reference;c=e.rects.popper,a=j(o(p=e.elements[p?"popper"===i?"reference":"popper":i])?p:p.contextElement||s(e.elements.popper),a,f),p=E({reference:f=t(l),element:c,strategy:"absolute",placement:n}),c=x(Object.assign(Object.assign({},c),p)),f="popper"===i?c:f;var u={top:a.top-f.top+r.top,bottom:f.bottom-a.bottom+r.bottom,left:a.left-f.left+r.left,right:f.right-a.right+r.right};if(e=e.modifiersData.offset,"popper"===i&&e){var d=e[n];Object.keys(u).forEach((function(e){var t=0<=["right","bottom"].indexOf(e)?1:-1,n=0<=["top","bottom"].indexOf(e)?"y":"x";u[e]+=d[n]*t}))}return u}function L(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return!t.some((function(e){return!(e&&"function"==typeof e.getBoundingClientRect)}))}function B(e){void 0===e&&(e={});var t=e.defaultModifiers,n=void 0===t?[]:t,r=void 0===(e=e.defaultOptions)?V:e;return function(e,t,i){function a(){f.forEach((function(e){return e()})),f=[]}void 0===i&&(i=r);var s={placement:"bottom",orderedModifiers:[],options:Object.assign(Object.assign({},V),r),modifiersData:{},elements:{reference:e,popper:t},attributes:{},styles:{}},f=[],c=!1,p={state:s,setOptions:function(i){return a(),s.options=Object.assign(Object.assign(Object.assign({},r),s.options),i),s.scrollParents={reference:o(e)?m(e):e.contextElement?m(e.contextElement):[],popper:m(t)},i=function(e){var t=b(e);return N.reduce((function(e,n){return e.concat(t.filter((function(e){return e.phase===n})))}),[])}(function(e){var t=e.reduce((function(e,t){var n=e[t.name];return e[t.name]=n?Object.assign(Object.assign(Object.assign({},n),t),{},{options:Object.assign(Object.assign({},n.options),t.options),data:Object.assign(Object.assign({},n.data),t.data)}):t,e}),{});return Object.keys(t).map((function(e){return t[e]}))}([].concat(n,s.options.modifiers))),s.orderedModifiers=i.filter((function(e){return e.enabled})),s.orderedModifiers.forEach((function(e){var t=e.name,n=e.options;n=void 0===n?{}:n,"function"==typeof(e=e.effect)&&(t=e({state:s,name:t,instance:p,options:n}),f.push(t||function(){}))})),p.update()},forceUpdate:function(){if(!c){var e=s.elements,t=e.reference;if(L(t,e=e.popper))for(s.rects={reference:l(t,g(e),"fixed"===s.options.strategy),popper:u(e)},s.reset=!1,s.placement=s.options.placement,s.orderedModifiers.forEach((function(e){return s.modifiersData[e.name]=Object.assign({},e.data)})),t=0;t<s.orderedModifiers.length;t++)if(!0===s.reset)s.reset=!1,t=-1;else{var n=s.orderedModifiers[t];e=n.fn;var r=n.options;r=void 0===r?{}:r,n=n.name,"function"==typeof e&&(s=e({state:s,options:r,name:n,instance:p})||s)}}},update:v((function(){return new Promise((function(e){p.forceUpdate(),e(s)}))})),destroy:function(){a(),c=!0}};return L(e,t)?(p.setOptions(i).then((function(e){!c&&i.onFirstUpdate&&i.onFirstUpdate(e)})),p):p}}function W(e){var t,r=e.popper,o=e.popperRect,i=e.placement,a=e.offsets,f=e.position,c=e.gpuAcceleration,p=e.adaptive,l=window.devicePixelRatio||1;e=Math.round(a.x*l)/l||0,l=Math.round(a.y*l)/l||0;var u=a.hasOwnProperty("x");a=a.hasOwnProperty("y");var d,m="left",h="top",b=window;if(p){var v=g(r);v===n(r)&&(v=s(r)),"top"===i&&(h="bottom",l-=v.clientHeight-o.height,l*=c?1:-1),"left"===i&&(m="right",e-=v.clientWidth-o.width,e*=c?1:-1)}return r=Object.assign({position:f},p&&_),c?Object.assign(Object.assign({},r),{},((d={})[h]=a?"0":"",d[m]=u?"0":"",d.transform=2>(b.devicePixelRatio||1)?"translate("+e+"px, "+l+"px)":"translate3d("+e+"px, "+l+"px, 0)",d)):Object.assign(Object.assign({},r),{},((t={})[h]=a?l+"px":"",t[m]=u?e+"px":"",t.transform="",t))}function A(e){return e.replace(/left|right|bottom|top/g,(function(e){return U[e]}))}function H(e){return e.replace(/start|end/g,(function(e){return z[e]}))}function T(e,t,n){return void 0===n&&(n={x:0,y:0}),{top:e.top-t.height-n.y,right:e.right-t.width+n.x,bottom:e.bottom-t.height+n.y,left:e.left-t.width-n.x}}function R(e){return["top","right","bottom","left"].some((function(t){return 0<=e[t]}))}var q=["top","bottom","right","left"],C=q.reduce((function(e,t){return e.concat([t+"-start",t+"-end"])}),[]),S=[].concat(q,["auto"]).reduce((function(e,t){return e.concat([t,t+"-start",t+"-end"])}),[]),N="beforeRead read afterRead beforeMain main afterMain beforeWrite write afterWrite".split(" "),V={placement:"bottom",modifiers:[],strategy:"absolute"},I={passive:!0},_={top:"auto",right:"auto",bottom:"auto",left:"auto"},U={left:"right",right:"left",bottom:"top",top:"bottom"},z={start:"end",end:"start"},F=[{name:"eventListeners",enabled:!0,phase:"write",fn:function(){},effect:function(e){var t=e.state,r=e.instance,o=(e=e.options).scroll,i=void 0===o||o,a=void 0===(e=e.resize)||e,s=n(t.elements.popper),f=[].concat(t.scrollParents.reference,t.scrollParents.popper);return i&&f.forEach((function(e){e.addEventListener("scroll",r.update,I)})),a&&s.addEventListener("resize",r.update,I),function(){i&&f.forEach((function(e){e.removeEventListener("scroll",r.update,I)})),a&&s.removeEventListener("resize",r.update,I)}},data:{}},{name:"popperOffsets",enabled:!0,phase:"read",fn:function(e){var t=e.state;t.modifiersData[e.name]=E({reference:t.rects.reference,element:t.rects.popper,strategy:"absolute",placement:t.placement})},data:{}},{name:"computeStyles",enabled:!0,phase:"beforeWrite",fn:function(e){var t=e.state,n=e.options;e=void 0===(e=n.gpuAcceleration)||e,n=void 0===(n=n.adaptive)||n,e={placement:y(t.placement),popper:t.elements.popper,popperRect:t.rects.popper,gpuAcceleration:e},null!=t.modifiersData.popperOffsets&&(t.styles.popper=Object.assign(Object.assign({},t.styles.popper),W(Object.assign(Object.assign({},e),{},{offsets:t.modifiersData.popperOffsets,position:t.options.strategy,adaptive:n})))),null!=t.modifiersData.arrow&&(t.styles.arrow=Object.assign(Object.assign({},t.styles.arrow),W(Object.assign(Object.assign({},e),{},{offsets:t.modifiersData.arrow,position:"absolute",adaptive:!1})))),t.attributes.popper=Object.assign(Object.assign({},t.attributes.popper),{},{"data-popper-placement":t.placement})},data:{}},{name:"applyStyles",enabled:!0,phase:"write",fn:function(e){var t=e.state;Object.keys(t.elements).forEach((function(e){var n=t.styles[e]||{},r=t.attributes[e]||{},o=t.elements[e];i(o)&&a(o)&&(Object.assign(o.style,n),Object.keys(r).forEach((function(e){var t=r[e];!1===t?o.removeAttribute(e):o.setAttribute(e,!0===t?"":t)})))}))},effect:function(e){var t=e.state,n={popper:{position:t.options.strategy,left:"0",top:"0",margin:"0"},arrow:{position:"absolute"},reference:{}};return Object.assign(t.elements.popper.style,n.popper),t.elements.arrow&&Object.assign(t.elements.arrow.style,n.arrow),function(){Object.keys(t.elements).forEach((function(e){var r=t.elements[e],o=t.attributes[e]||{};e=Object.keys(t.styles.hasOwnProperty(e)?t.styles[e]:n[e]).reduce((function(e,t){return e[t]="",e}),{}),i(r)&&a(r)&&(Object.assign(r.style,e),Object.keys(o).forEach((function(e){r.removeAttribute(e)})))}))}},requires:["computeStyles"]},{name:"offset",enabled:!0,phase:"main",requires:["popperOffsets"],fn:function(e){var t=e.state,n=e.name,r=void 0===(e=e.options.offset)?[0,0]:e,o=(e=S.reduce((function(e,n){var o=t.rects,i=y(n),a=0<=["left","top"].indexOf(i)?-1:1,s="function"==typeof r?r(Object.assign(Object.assign({},o),{},{placement:n})):r;return o=(o=s[0])||0,s=((s=s[1])||0)*a,i=0<=["left","right"].indexOf(i)?{x:s,y:o}:{x:o,y:s},e[n]=i,e}),{}))[t.placement],i=o.x;o=o.y,null!=t.modifiersData.popperOffsets&&(t.modifiersData.popperOffsets.x+=i,t.modifiersData.popperOffsets.y+=o),t.modifiersData[n]=e}},{name:"flip",enabled:!0,phase:"main",fn:function(e){var t=e.state,n=e.options;if(e=e.name,!t.modifiersData[e]._skip){var r=n.mainAxis;r=void 0===r||r;var o=n.altAxis;o=void 0===o||o;var i=n.fallbackPlacements,a=n.padding,s=n.boundary,f=n.rootBoundary,c=n.altBoundary,p=n.flipVariations,l=void 0===p||p,u=n.allowedAutoPlacements;p=y(n=t.options.placement),i=i||(p!==n&&l?function(e){if("auto"===y(e))return[];var t=A(e);return[H(e),t,H(t)]}(n):[A(n)]);var d=[n].concat(i).reduce((function(e,n){return e.concat("auto"===y(n)?function(e,t){void 0===t&&(t={});var n=t.boundary,r=t.rootBoundary,o=t.padding,i=t.flipVariations,a=t.allowedAutoPlacements,s=void 0===a?S:a,f=t.placement.split("-")[1];0===(i=(t=f?i?C:C.filter((function(e){return e.split("-")[1]===f})):q).filter((function(e){return 0<=s.indexOf(e)}))).length&&(i=t);var c=i.reduce((function(t,i){return t[i]=k(e,{placement:i,boundary:n,rootBoundary:r,padding:o})[y(i)],t}),{});return Object.keys(c).sort((function(e,t){return c[e]-c[t]}))}(t,{placement:n,boundary:s,rootBoundary:f,padding:a,flipVariations:l,allowedAutoPlacements:u}):n)}),[]);n=t.rects.reference,i=t.rects.popper;var m=new Map;p=!0;for(var h=d[0],g=0;g<d.length;g++){var b=d[g],v=y(b),O="start"===b.split("-")[1],x=0<=["top","bottom"].indexOf(v),w=x?"width":"height",j=k(t,{placement:b,boundary:s,rootBoundary:f,altBoundary:c,padding:a});if(O=x?O?"right":"left":O?"bottom":"top",n[w]>i[w]&&(O=A(O)),w=A(O),x=[],r&&x.push(0>=j[v]),o&&x.push(0>=j[O],0>=j[w]),x.every((function(e){return e}))){h=b,p=!1;break}m.set(b,x)}if(p)for(r=function(e){var t=d.find((function(t){if(t=m.get(t))return t.slice(0,e).every((function(e){return e}))}));if(t)return h=t,"break"},o=l?3:1;0<o&&"break"!==r(o);o--);t.placement!==h&&(t.modifiersData[e]._skip=!0,t.placement=h,t.reset=!0)}},requiresIfExists:["offset"],data:{_skip:!1}},{name:"preventOverflow",enabled:!0,phase:"main",fn:function(e){var t=e.state,n=e.options;e=e.name;var r=n.mainAxis,o=void 0===r||r;r=void 0!==(r=n.altAxis)&&r;var i=n.tether;i=void 0===i||i;var a=n.tetherOffset,s=void 0===a?0:a;n=k(t,{boundary:n.boundary,rootBoundary:n.rootBoundary,padding:n.padding,altBoundary:n.altBoundary}),a=y(t.placement);var f=t.placement.split("-")[1],c=!f,p=M(a);a="x"===p?"y":"x";var l=t.modifiersData.popperOffsets,d=t.rects.reference,m=t.rects.popper,h="function"==typeof s?s(Object.assign(Object.assign({},t.rects),{},{placement:t.placement})):s;if(s={x:0,y:0},l){if(o){var b="y"===p?"top":"left",v="y"===p?"bottom":"right",O="y"===p?"height":"width";o=l[p];var x=l[p]+n[b],w=l[p]-n[v],j=i?-m[O]/2:0,E="start"===f?d[O]:m[O];f="start"===f?-m[O]:-d[O],m=t.elements.arrow,m=i&&m?u(m):{width:0,height:0};var D=t.modifiersData["arrow#persistent"]?t.modifiersData["arrow#persistent"].padding:{top:0,right:0,bottom:0,left:0};b=D[b],v=D[v],m=Math.max(0,Math.min(d[O],m[O])),E=c?d[O]/2-j-m-b-h:E-m-b-h,c=c?-d[O]/2+j+m+v+h:f+m+v+h,h=t.elements.arrow&&g(t.elements.arrow),d=t.modifiersData.offset?t.modifiersData.offset[t.placement][p]:0,h=l[p]+E-d-(h?"y"===p?h.clientTop||0:h.clientLeft||0:0),c=l[p]+c-d,i=Math.max(i?Math.min(x,h):x,Math.min(o,i?Math.max(w,c):w)),l[p]=i,s[p]=i-o}r&&(r=l[a],i=Math.max(r+n["x"===p?"top":"left"],Math.min(r,r-n["x"===p?"bottom":"right"])),l[a]=i,s[a]=i-r),t.modifiersData[e]=s}},requiresIfExists:["offset"]},{name:"arrow",enabled:!0,phase:"main",fn:function(e){var t,n=e.state;e=e.name;var r=n.elements.arrow,o=n.modifiersData.popperOffsets,i=y(n.placement),a=M(i);if(i=0<=["left","right"].indexOf(i)?"height":"width",r&&o){var s=n.modifiersData[e+"#persistent"].padding,f=u(r),c="y"===a?"top":"left",p="y"===a?"bottom":"right",l=n.rects.reference[i]+n.rects.reference[a]-o[a]-n.rects.popper[i];o=o[a]-n.rects.reference[a],l=(r=(r=g(r))?"y"===a?r.clientHeight||0:r.clientWidth||0:0)/2-f[i]/2+(l/2-o/2),i=Math.max(s[c],Math.min(l,r-f[i]-s[p])),n.modifiersData[e]=((t={})[a]=i,t.centerOffset=i-l,t)}},effect:function(e){var t=e.state,n=e.options;e=e.name;var r=n.element;if(r=void 0===r?"[data-popper-arrow]":r,n=void 0===(n=n.padding)?0:n,null!=r){if("string"==typeof r&&!(r=t.elements.popper.querySelector(r)))return;O(t.elements.popper,r)&&(t.elements.arrow=r,t.modifiersData[e+"#persistent"]={padding:D("number"!=typeof n?n:P(n,q))})}},requires:["popperOffsets"],requiresIfExists:["preventOverflow"]},{name:"hide",enabled:!0,phase:"main",requiresIfExists:["preventOverflow"],fn:function(e){var t=e.state;e=e.name;var n=t.rects.reference,r=t.rects.popper,o=t.modifiersData.preventOverflow,i=k(t,{elementContext:"reference"}),a=k(t,{altBoundary:!0});n=T(i,n),r=T(a,r,o),o=R(n),a=R(r),t.modifiersData[e]={referenceClippingOffsets:n,popperEscapeOffsets:r,isReferenceHidden:o,hasPopperEscaped:a},t.attributes.popper=Object.assign(Object.assign({},t.attributes.popper),{},{"data-popper-reference-hidden":o,"data-popper-escaped":a})}}],X=B({defaultModifiers:F});e.createPopper=X,e.defaultModifiers=F,e.detectOverflow=k,e.popperGenerator=B,Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=popper.min.js.map

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.scrollama=t()}(this,function(){"use strict";function e(e){return"scrollama__debug-offset--"+e}function t(t){!function(t){var n=t.id,o=t.offsetVal,r=t.stepClass,i=document.createElement("div");i.id=e(n),i.className="scrollama__debug-offset",i.style.position="fixed",i.style.left="0",i.style.width="100%",i.style.height="0",i.style.borderTop="2px dashed black",i.style.zIndex="9999";var s=document.createElement("p");s.innerHTML='".'+r+'" trigger: <span>'+o+"</span>",s.style.fontSize="12px",s.style.fontFamily="monospace",s.style.color="black",s.style.margin="0",s.style.padding="6px",i.appendChild(s),document.body.appendChild(i)}({id:t.id,offsetVal:t.offsetVal,stepClass:t.stepEl[0].className})}function n(e){var t=e.id,n=e.index,o=e.state,r="scrollama__debug-step--"+t+"-"+n,i=document.getElementById(r+"_above"),s=document.getElementById(r+"_below"),a="enter"===o?"block":"none";i&&(i.style.display=a),s&&(s.style.display=a)}return function(){var o=["stepAbove","stepBelow","stepProgress","viewportAbove","viewportBelow"],r={},i={},s=null,a=[],f=[],l=[],c=[],u=0,p=0,d=0,v=0,g=0,m=0,x=!1,b=!1,w=!1,h=!1,y=!1,E=!1,M="down",I="percent",A=[];function C(e){console.error("scrollama error: "+e)}function O(){r={stepEnter:function(){},stepExit:function(){},stepProgress:function(){}},i={}}function S(e){return e.getBoundingClientRect().top+window.pageYOffset-(document.body.clientTop||0)}function B(e){return+e.getAttribute("data-scrollama-index")}function H(){window.pageYOffset>g?M="down":window.pageYOffset<g&&(M="up"),g=window.pageYOffset}function k(e){i[e]&&i[e].forEach(function(e){return e.disconnect()})}function _(){var t,n;d=window.innerHeight,t=document.body,n=document.documentElement,v=Math.max(t.scrollHeight,t.offsetHeight,n.clientHeight,n.scrollHeight,n.offsetHeight),p=u*("pixels"===I?1:d),x&&(f=a.map(function(e){return e.getBoundingClientRect().height}),l=a.map(S),b&&D()),w&&function(t){var n=t.id,o=t.offsetMargin,r=t.offsetVal,i="pixels"===t.format?"px":"",s=e(n),a=document.getElementById(s);a.style.top=o+"px",a.querySelector("span").innerText=""+r+i}({id:s,offsetMargin:p,offsetVal:u,format:I})}function N(e){if(e&&!b){if(!x)return C("scrollama error: enable() called before scroller was ready"),void(b=!1);D()}!e&&b&&o.forEach(k),b=e}function P(e,t){var n=B(e);void 0!==t&&(c[n].progress=t);var o={element:e,index:n,progress:c[n].progress};"enter"===c[n].state&&r.stepProgress(o)}function R(e,t){if("above"===t)for(var n=0;n<e;n+=1){var o=c[n];"enter"!==o.state&&"down"!==o.direction?(T(a[n],"down",!1),q(a[n],"down")):"enter"===o.state&&q(a[n],"down")}else if("below"===t)for(var r=c.length-1;r>e;r-=1){var i=c[r];"enter"===i.state&&q(a[r],"up"),"down"===i.direction&&(T(a[r],"up",!1),q(a[r],"up"))}}function T(e,t,o){void 0===o&&(o=!0);var i=B(e),a={element:e,index:i,direction:t};c[i].direction=t,c[i].state="enter",y&&o&&"down"===t&&R(i,"above"),y&&o&&"up"===t&&R(i,"below"),r.stepEnter&&!A[i]&&(r.stepEnter(a,c),w&&n({id:s,index:i,state:"enter"}),E&&(A[i]=!0)),h&&P(e)}function q(e,t){var o=B(e),i={element:e,index:o,direction:t};h&&("down"===t&&c[o].progress<1?P(e,1):"up"===t&&c[o].progress>0&&P(e,0)),c[o].direction=t,c[o].state="exit",r.stepExit(i,c),w&&n({id:s,index:o,state:"exit"})}function V(e){var t=e[0];H();var n=t.isIntersecting,o=t.boundingClientRect,r=t.target,i=o.top,s=o.bottom,a=i-p,f=s-p,l=B(r),u=c[l];n&&a<=0&&f>=0&&"down"===M&&"enter"!==u.state&&T(r,M),!n&&a>0&&"up"===M&&"enter"===u.state&&q(r,M)}function Y(e){var t=e[0];H();var n=t.isIntersecting,o=t.boundingClientRect,r=t.target,i=o.top,s=o.bottom,a=i-p,f=s-p,l=B(r),u=c[l];n&&a<=0&&f>=0&&"up"===M&&"enter"!==u.state&&T(r,M),!n&&f<0&&"down"===M&&"enter"===u.state&&q(r,M)}function F(e){var t=e[0];H();var n=t.isIntersecting,o=t.target,r=B(o),i=c[r];n&&"down"===M&&"down"!==i.direction&&"enter"!==i.state&&(T(o,"down"),q(o,"down"))}function j(e){var t=e[0];H();var n=t.isIntersecting,o=t.target,r=B(o),i=c[r];n&&"up"===M&&"down"===i.direction&&"enter"!==i.state&&(T(o,"up"),q(o,"up"))}function z(e){var t=e[0];H();var n=t.isIntersecting,o=t.intersectionRatio,r=t.boundingClientRect,i=t.target,s=r.bottom;n&&s-p>=0&&P(i,+o)}function L(){i.stepProgress=a.map(function(e,t){var n=f[t]-p+"px 0px "+(-d+p)+"px 0px",o=function(e){for(var t=Math.ceil(e/m),n=[],o=1/t,r=0;r<t;r+=1)n.push(r*o);return n}(f[t]),r=new IntersectionObserver(z,{rootMargin:n,threshold:o});return r.observe(e),r})}function D(){o.forEach(k),i.viewportAbove=a.map(function(e,t){var n=v-l[t],o=p-d-f[t],r=new IntersectionObserver(F,{rootMargin:n+"px 0px "+o+"px 0px"});return r.observe(e),r}),i.viewportBelow=a.map(function(e,t){var n=-p-f[t],o=p-d+f[t]+v,r=new IntersectionObserver(j,{rootMargin:n+"px 0px "+o+"px 0px"});return r.observe(e),r}),i.stepAbove=a.map(function(e,t){var n=-p+f[t],o=new IntersectionObserver(V,{rootMargin:n+"px 0px "+(p-d)+"px 0px"});return o.observe(e),o}),i.stepBelow=a.map(function(e,t){var n=-p,o=p-d+f[t],r=new IntersectionObserver(Y,{rootMargin:n+"px 0px "+o+"px 0px"});return r.observe(e),r}),h&&L()}function G(e){return!(!e||1!==e.nodeType)&&(function(e){var t=window.getComputedStyle(e);return("scroll"===t.overflowY||"auto"===t.overflowY)&&e.scrollHeight>e.clientHeight}(e)?e:G(e.parentNode))}var J={};return J.setup=function(e){var n=e.step,o=e.offset;void 0===o&&(o=.5);var r=e.progress;void 0===r&&(r=!1);var i=e.threshold;void 0===i&&(i=4);var f=e.debug;void 0===f&&(f=!1);var l=e.order;void 0===l&&(l=!0);var p,d,v,g,b,M=e.once;if(void 0===M&&(M=!1),O(),d=(p="abcdefghijklmnopqrstuv").length,v=Date.now(),s=""+[0,0,0].map(function(e){return p[Math.floor(Math.random()*d)]}).join("")+v,g=n,void 0===b&&(b=document),!(a="string"==typeof g?Array.from(b.querySelectorAll(g)):g instanceof Element?[g]:g instanceof NodeList?Array.from(g):g instanceof Array?g:[]).length)return C("no step elements"),J;var I=a.reduce(function(e,t){return e||G(t.parentNode)},!1);return I&&console.error("scrollama error: step elements cannot be children of a scrollable element. Remove any css on the parent element with overflow: scroll; or overflow: auto; on elements with fixed height.",I),w=f,h=r,y=l,E=M,J.offsetTrigger(o),m=Math.max(1,+i),x=!0,w&&t({id:s,stepEl:a,offsetVal:u}),a.forEach(function(e,t){return e.setAttribute("data-scrollama-index",t)}),c=a.map(function(){return{direction:null,state:null,progress:0}}),_(),J.enable(),J},J.resize=function(){return _(),J},J.enable=function(){return N(!0),J},J.disable=function(){return N(!1),J},J.destroy=function(){N(!1),O()},J.offsetTrigger=function(e){if(null===e)return u;if("number"==typeof e)I="percent",e>1&&C("offset value is greater than 1. Fallback to 1."),e<0&&C("offset value is lower than 0. Fallback to 0."),u=Math.min(Math.max(0,e),1);else if("string"==typeof e&&e.indexOf("px")>0){var t=+e.replace("px","");isNaN(t)?(C("offset value must be in 'px' format. Fallback to 0.5."),u=.5):(I="pixels",u=t)}else C("offset value does not include 'px'. Fallback to 0.5."),u=.5;return J},J.onStepEnter=function(e){return"function"==typeof e?r.stepEnter=e:C("onStepEnter requires a function"),J},J.onStepExit=function(e){return"function"==typeof e?r.stepExit=e:C("onStepExit requires a function"),J},J.onStepProgress=function(e){return"function"==typeof e?r.stepProgress=e:C("onStepProgress requires a function"),J},J}});
/**
 * File skip-link-focus-fix.js.
 *
 * Helps with accessibility for keyboard only users.
 *
 * Learn more: https://git.io/vWdr2
 */
( function() {
	var isIe = /(trident|msie)/i.test( navigator.userAgent );

	if ( isIe && document.getElementById && window.addEventListener ) {
		window.addEventListener( 'hashchange', function() {
			var id = location.hash.substring( 1 ),
				element;

			if ( ! ( /^[A-z0-9_-]+$/.test( id ) ) ) {
				return;
			}

			element = document.getElementById( id );

			if ( element ) {
				if ( ! ( /^(?:a|select|input|button|textarea)$/i.test( element.tagName ) ) ) {
					element.tabIndex = -1;
				}

				element.focus();
			}
		}, false );
	}
} )();

/**
 * @fileoverview syncscroll - scroll several areas simultaniously
 * @version 0.0.3
 * 
 * @license MIT, see http://github.com/asvd/intence
 * @copyright 2015 asvd <heliosframework@gmail.com> 
 */


(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory((root.syncscroll = {}));
    }
}(this,function (exports) {
    var Width = 'Width';
    var Height = 'Height';
    var Top = 'Top';
    var Left = 'Left';
    var scroll = 'scroll';
    var client = 'client';
    var EventListener = 'EventListener';
    var addEventListener = 'add' + EventListener;
    var length = 'length';
    var Math_round = Math.round;

    var names = {};

    var reset = function() {
        var elems = document.getElementsByClassName('sync'+scroll);

        // clearing existing listeners
        var i, j, el, found, name;
        for (name in names) {
            if (names.hasOwnProperty(name)) {
                for (i = 0; i < names[name][length]; i++) {
                    names[name][i]['remove'+EventListener](
                        scroll, names[name][i].syn, 0
                    );
                }
            }
        }

        // setting-up the new listeners
        for (i = 0; i < elems[length];) {
            found = j = 0;
            el = elems[i++];
            if (!(name = el.getAttribute('name'))) {
                // name attribute is not set
                continue;
            }

            el = el[scroll+'er']||el;  // needed for intence

            // searching for existing entry in array of names;
            // searching for the element in that entry
            for (;j < (names[name] = names[name]||[])[length];) {
                found |= names[name][j++] == el;
            }

            if (!found) {
                names[name].push(el);
            }

            el.eX = el.eY = 0;

            (function(el, name) {
                el[addEventListener](
                    scroll,
                    el.syn = function() {
                        var elems = names[name];

                        var scrollX = el[scroll+Left];
                        var scrollY = el[scroll+Top];

                        var xRate =
                            scrollX /
                            (el[scroll+Width] - el[client+Width]);
                        var yRate =
                            scrollY /
                            (el[scroll+Height] - el[client+Height]);

                        var updateX = scrollX != el.eX;
                        var updateY = scrollY != el.eY;

                        var otherEl, i = 0;

                        el.eX = scrollX;
                        el.eY = scrollY;

                        for (;i < elems[length];) {
                            otherEl = elems[i++];
                            if (otherEl != el) {
                                if (updateX &&
                                    Math_round(
                                        otherEl[scroll+Left] -
                                        (scrollX = otherEl.eX =
                                         Math_round(xRate *
                                             (otherEl[scroll+Width] -
                                              otherEl[client+Width]))
                                        )
                                    )
                                ) {
                                    otherEl[scroll+Left] = scrollX;
                                }
                                
                                if (updateY &&
                                    Math_round(
                                        otherEl[scroll+Top] -
                                        (scrollY = otherEl.eY =
                                         Math_round(yRate *
                                             (otherEl[scroll+Height] -
                                              otherEl[client+Height]))
                                        )
                                    )
                                ) {
                                    otherEl[scroll+Top] = scrollY;
                                }
                            }
                        }
                    }, 0
                );
            })(el, name);
        }
    }
    
       
    if (document.readyState == "complete") {
        reset();
    } else {
        window[addEventListener]("load", reset, 0);
    }

    exports.reset = reset;
}));


/*
    TimelineJS - ver. 3.6.6 - 2020-03-11
    Copyright (c) 2012-2016 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS3
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/* **********************************************
     Begin TL.js
********************************************** */

/*!
	TL
*/

(function (root) {
	root.TL = {
		VERSION: '0.1',
		_originalL: root.TL
	};
}(this));

/*	TL.Debug
	Debug mode
================================================== */
TL.debug = false;



/*	TL.Bind
================================================== */
TL.Bind = function (/*Function*/ fn, /*Object*/ obj) /*-> Object*/ {
	return function () {
		return fn.apply(obj, arguments);
	};
};



/* Trace (console.log)
================================================== */
trace = function( msg ) {
	if (TL.debug) {
		if (window.console) {
			console.log(msg);
		} else if ( typeof( jsTrace ) != 'undefined' ) {
			jsTrace.send( msg );
		} else {
			//alert(msg);
		}
	}
}


/* **********************************************
     Begin TL.Error.js
********************************************** */

/* Timeline Error class */

function TL_Error(message_key, detail) {
    this.name = 'TL.Error';
    this.message = message_key || 'error';
    this.message_key = this.message;
    this.detail = detail || '';
  
    // Grab stack?
    var e = new Error();
    if(e.hasOwnProperty('stack')) {
        this.stack = e.stack;
    }
}

TL_Error.prototype = Object.create(Error.prototype);
TL_Error.prototype.constructor = TL_Error;

TL.Error = TL_Error;


/* **********************************************
     Begin TL.Util.js
********************************************** */

/*	TL.Util
	Class of utilities
================================================== */

TL.Util = {
	mergeData: function(data_main, data_to_merge) {
		var x;
		for (x in data_to_merge) {
			if (Object.prototype.hasOwnProperty.call(data_to_merge, x)) {
				data_main[x] = data_to_merge[x];
			}
		}
		return data_main;
	},

	// like TL.Util.mergeData but takes an arbitrarily long list of sources to merge.
	extend: function (/*Object*/ dest) /*-> Object*/ {	// merge src properties into dest
		var sources = Array.prototype.slice.call(arguments, 1);
		for (var j = 0, len = sources.length, src; j < len; j++) {
			src = sources[j] || {};
			TL.Util.mergeData(dest, src);
		}
		return dest;
	},

	isEven: function(n) {
	  return n == parseFloat(n)? !(n%2) : void 0;
	},

	isTrue: function(s) {
		if (s == null) return false;
		return s == true || String(s).toLowerCase() == 'true' || Number(s) == 1;
	},

	findArrayNumberByUniqueID: function(id, array, prop, defaultVal) {
		var _n = defaultVal || 0;

		for (var i = 0; i < array.length; i++) {
			if (array[i].data[prop] == id) {
				_n = i;
			}
		};

		return _n;
	},

	convertUnixTime: function(str) {
		var _date, _months, _year, _month, _day, _time, _date_array = [],
			_date_str = {
				ymd:"",
				time:"",
				time_array:[],
				date_array:[],
				full_array:[]
			};

		_date_str.ymd = str.split(" ")[0];
		_date_str.time = str.split(" ")[1];
		_date_str.date_array = _date_str.ymd.split("-");
		_date_str.time_array = _date_str.time.split(":");
		_date_str.full_array = _date_str.date_array.concat(_date_str.time_array)

		for(var i = 0; i < _date_str.full_array.length; i++) {
			_date_array.push( parseInt(_date_str.full_array[i]) )
		}

		_date = new Date(_date_array[0], _date_array[1], _date_array[2], _date_array[3], _date_array[4], _date_array[5]);
		_months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		_year = _date.getFullYear();
		_month = _months[_date.getMonth()];
		_day = _date.getDate();
		_time = _month + ', ' + _day + ' ' + _year;

		return _time;
	},

	setData: function (obj, data) {
		obj.data = TL.Util.extend({}, obj.data, data);
		if (obj.data.unique_id === "") {
			obj.data.unique_id = TL.Util.unique_ID(6);
		}
	},

	stamp: (function () {
		var lastId = 0, key = '_tl_id';


		return function (/*Object*/ obj) {
			obj[key] = obj[key] || ++lastId;
			return obj[key];
		};
	}()),

	isArray: (function () {
	    // Use compiler's own isArray when available
	    if (Array.isArray) {
	        return Array.isArray;
	    }

	    // Retain references to variables for performance
	    // optimization
	    var objectToStringFn = Object.prototype.toString,
	        arrayToStringResult = objectToStringFn.call([]);

	    return function (subject) {
	        return objectToStringFn.call(subject) === arrayToStringResult;
	    };
	}()),

    getRandomNumber: function(range) {
   		return Math.floor(Math.random() * range);
   	},

	unique_ID: function(size, prefix) {

		var getRandomNumber = function(range) {
			return Math.floor(Math.random() * range);
		};

		var getRandomChar = function() {
			var chars = "abcdefghijklmnopqurstuvwxyz";
			return chars.substr( getRandomNumber(32), 1 );
		};

		var randomID = function(size) {
			var str = "";
			for(var i = 0; i < size; i++) {
				str += getRandomChar();
			}
			return str;
		};

		if (prefix) {
			return prefix + "-" + randomID(size);
		} else {
			return "tl-" + randomID(size);
		}
	},

	ensureUniqueKey: function(obj, candidate) {
		if (!candidate) { candidate = TL.Util.unique_ID(6); }

		if (!(candidate in obj)) { return candidate; }

		var root = candidate.match(/^(.+)(-\d+)?$/)[1];
		var similar_ids = [];
		// get an alternative
		for (key in obj) {
			if (key.match(/^(.+?)(-\d+)?$/)[1] == root) {
				similar_ids.push(key);
			}
		}
		candidate = root + "-" + (similar_ids.length + 1);

		for (var counter = similar_ids.length; similar_ids.indexOf(candidate) != -1; counter++) {
			candidate = root + '-' + counter;
		}

		return candidate;
	},


	htmlify: function(str) {
		//if (str.match(/<\s*p[^>]*>([^<]*)<\s*\/\s*p\s*>/)) {
		if (str.match(/<p>[\s\S]*?<\/p>/)) {

			return str;
		} else {
			return "<p>" + str + "</p>";
		}
	},

	unhtmlify: function(str) {
		str = str.replace(/(<[^>]*>)+/g, '');
		return str.replace('"', "'");
	},

	/*	* Turns plain text links into real links
	================================================== */
	linkify: function(text,targets,is_touch) {

        var make_link = function(url, link_text, prefix) {
            if (!prefix) {
                prefix = "";
            }
            var MAX_LINK_TEXT_LENGTH = 30;
            if (link_text && link_text.length > MAX_LINK_TEXT_LENGTH) {
                link_text = link_text.substring(0,MAX_LINK_TEXT_LENGTH) + "\u2026"; // unicode ellipsis
            }
            return prefix + "<a class='tl-makelink' href='" + url + "' onclick='void(0)'>" + link_text + "</a>";
        }
		// http://, https://, ftp://
		var urlPattern = /\b(?:https?|ftp):\/\/([a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|])/gim;

		// www. sans http:// or https://
		var pseudoUrlPattern = /(^|[^\/>])(www\.[\S]+(\b|$))/gim;

		// Email addresses
		var emailAddressPattern = /([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/gim;


		return text
			.replace(urlPattern, function(match, url_sans_protocol, offset, string) {
                // Javascript doesn't support negative lookbehind assertions, so
                // we need to handle risk of matching URLs in legit hrefs
                if (offset > 0) {
                    var prechar = string[offset-1];
                    if (prechar == '"' || prechar == "'" || prechar == "=") {
                        return match;
                    }
                }
                return make_link(match, url_sans_protocol);
            })
			.replace(pseudoUrlPattern, function(match, beforePseudo, pseudoUrl, offset, string) {
                return make_link('http://' + pseudoUrl, pseudoUrl, beforePseudo);
            })
			.replace(emailAddressPattern, function(match, email, offset, string) {
                return make_link('mailto:' + email, email);
            });
	},

	unlinkify: function(text) {
		if(!text) return text;
		text = text.replace(/<a\b[^>]*>/i,"");
		text = text.replace(/<\/a>/i, "");
		return text;
	},

	getParamString: function (obj) {
		var params = [];
		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				params.push(i + '=' + obj[i]);
			}
		}
		return '?' + params.join('&');
	},

	formatNum: function (num, digits) {
		var pow = Math.pow(10, digits || 5);
		return Math.round(num * pow) / pow;
	},

	falseFn: function () {
		return false;
	},

	requestAnimFrame: (function () {
		function timeoutDefer(callback) {
			window.setTimeout(callback, 1000 / 60);
		}

		var requestFn = window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			timeoutDefer;

		return function (callback, context, immediate, contextEl) {
			callback = context ? TL.Util.bind(callback, context) : callback;
			if (immediate && requestFn === timeoutDefer) {
				callback();
			} else {
				requestFn(callback, contextEl);
			}
		};
	}()),

	bind: function (/*Function*/ fn, /*Object*/ obj) /*-> Object*/ {
		return function () {
			return fn.apply(obj, arguments);
		};
	},

	template: function (str, data) {
		return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
			var value = data[key];
			if (!data.hasOwnProperty(key)) {
			    throw new TL.Error("template_value_err", str);
			}
			return value;
		});
	},

	hexToRgb: function(hex) {
	    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        if (TL.Util.css_named_colors[hex.toLowerCase()]) {
            hex = TL.Util.css_named_colors[hex.toLowerCase()];
        }
	    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
	        return r + r + g + g + b + b;
	    });

	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	},
	// given an object with r, g, and b keys, or a string of the form 'rgb(mm,nn,ll)', return a CSS hex string including the leading '#' character
	rgbToHex: function(rgb) {
		var r,g,b;
		if (typeof(rgb) == 'object') {
			r = rgb.r;
			g = rgb.g;
			b = rgb.b;
		} else if (typeof(rgb.match) == 'function'){
			var parts = rgb.match(/^rgb\((\d+),(\d+),(\d+)\)$/);
			if (parts) {
				r = parts[1];
				g = parts[2];
				b = parts[3];
			}
		}
		if (isNaN(r) || isNaN(b) || isNaN(g)) {
			throw new TL.Error("invalid_rgb_err");
		}
		return "#" + TL.Util.intToHexString(r) + TL.Util.intToHexString(g) + TL.Util.intToHexString(b);
	},
	colorObjToHex: function(o) {
		var parts = [o.r, o.g, o.b];
		return TL.Util.rgbToHex("rgb(" + parts.join(',') + ")")
	},
    css_named_colors: {
        "aliceblue": "#f0f8ff",
        "antiquewhite": "#faebd7",
        "aqua": "#00ffff",
        "aquamarine": "#7fffd4",
        "azure": "#f0ffff",
        "beige": "#f5f5dc",
        "bisque": "#ffe4c4",
        "black": "#000000",
        "blanchedalmond": "#ffebcd",
        "blue": "#0000ff",
        "blueviolet": "#8a2be2",
        "brown": "#a52a2a",
        "burlywood": "#deb887",
        "cadetblue": "#5f9ea0",
        "chartreuse": "#7fff00",
        "chocolate": "#d2691e",
        "coral": "#ff7f50",
        "cornflowerblue": "#6495ed",
        "cornsilk": "#fff8dc",
        "crimson": "#dc143c",
        "cyan": "#00ffff",
        "darkblue": "#00008b",
        "darkcyan": "#008b8b",
        "darkgoldenrod": "#b8860b",
        "darkgray": "#a9a9a9",
        "darkgreen": "#006400",
        "darkkhaki": "#bdb76b",
        "darkmagenta": "#8b008b",
        "darkolivegreen": "#556b2f",
        "darkorange": "#ff8c00",
        "darkorchid": "#9932cc",
        "darkred": "#8b0000",
        "darksalmon": "#e9967a",
        "darkseagreen": "#8fbc8f",
        "darkslateblue": "#483d8b",
        "darkslategray": "#2f4f4f",
        "darkturquoise": "#00ced1",
        "darkviolet": "#9400d3",
        "deeppink": "#ff1493",
        "deepskyblue": "#00bfff",
        "dimgray": "#696969",
        "dodgerblue": "#1e90ff",
        "firebrick": "#b22222",
        "floralwhite": "#fffaf0",
        "forestgreen": "#228b22",
        "fuchsia": "#ff00ff",
        "gainsboro": "#dcdcdc",
        "ghostwhite": "#f8f8ff",
        "gold": "#ffd700",
        "goldenrod": "#daa520",
        "gray": "#808080",
        "green": "#008000",
        "greenyellow": "#adff2f",
        "honeydew": "#f0fff0",
        "hotpink": "#ff69b4",
        "indianred": "#cd5c5c",
        "indigo": "#4b0082",
        "ivory": "#fffff0",
        "khaki": "#f0e68c",
        "lavender": "#e6e6fa",
        "lavenderblush": "#fff0f5",
        "lawngreen": "#7cfc00",
        "lemonchiffon": "#fffacd",
        "lightblue": "#add8e6",
        "lightcoral": "#f08080",
        "lightcyan": "#e0ffff",
        "lightgoldenrodyellow": "#fafad2",
        "lightgray": "#d3d3d3",
        "lightgreen": "#90ee90",
        "lightpink": "#ffb6c1",
        "lightsalmon": "#ffa07a",
        "lightseagreen": "#20b2aa",
        "lightskyblue": "#87cefa",
        "lightslategray": "#778899",
        "lightsteelblue": "#b0c4de",
        "lightyellow": "#ffffe0",
        "lime": "#00ff00",
        "limegreen": "#32cd32",
        "linen": "#faf0e6",
        "magenta": "#ff00ff",
        "maroon": "#800000",
        "mediumaquamarine": "#66cdaa",
        "mediumblue": "#0000cd",
        "mediumorchid": "#ba55d3",
        "mediumpurple": "#9370db",
        "mediumseagreen": "#3cb371",
        "mediumslateblue": "#7b68ee",
        "mediumspringgreen": "#00fa9a",
        "mediumturquoise": "#48d1cc",
        "mediumvioletred": "#c71585",
        "midnightblue": "#191970",
        "mintcream": "#f5fffa",
        "mistyrose": "#ffe4e1",
        "moccasin": "#ffe4b5",
        "navajowhite": "#ffdead",
        "navy": "#000080",
        "oldlace": "#fdf5e6",
        "olive": "#808000",
        "olivedrab": "#6b8e23",
        "orange": "#ffa500",
        "orangered": "#ff4500",
        "orchid": "#da70d6",
        "palegoldenrod": "#eee8aa",
        "palegreen": "#98fb98",
        "paleturquoise": "#afeeee",
        "palevioletred": "#db7093",
        "papayawhip": "#ffefd5",
        "peachpuff": "#ffdab9",
        "peru": "#cd853f",
        "pink": "#ffc0cb",
        "plum": "#dda0dd",
        "powderblue": "#b0e0e6",
        "purple": "#800080",
        "rebeccapurple": "#663399",
        "red": "#ff0000",
        "rosybrown": "#bc8f8f",
        "royalblue": "#4169e1",
        "saddlebrown": "#8b4513",
        "salmon": "#fa8072",
        "sandybrown": "#f4a460",
        "seagreen": "#2e8b57",
        "seashell": "#fff5ee",
        "sienna": "#a0522d",
        "silver": "#c0c0c0",
        "skyblue": "#87ceeb",
        "slateblue": "#6a5acd",
        "slategray": "#708090",
        "snow": "#fffafa",
        "springgreen": "#00ff7f",
        "steelblue": "#4682b4",
        "tan": "#d2b48c",
        "teal": "#008080",
        "thistle": "#d8bfd8",
        "tomato": "#ff6347",
        "turquoise": "#40e0d0",
        "violet": "#ee82ee",
        "wheat": "#f5deb3",
        "white": "#ffffff",
        "whitesmoke": "#f5f5f5",
        "yellow": "#ffff00",
        "yellowgreen": "#9acd32"
    },
	ratio: {
		square: function(size) {
			var s = {
				w: 0,
				h: 0
			}
			if (size.w > size.h && size.h > 0) {
				s.h = size.h;
				s.w = size.h;
			} else {
				s.w = size.w;
				s.h = size.w;
			}
			return s;
		},

		r16_9: function(size) {
			if (size.w !== null && size.w !== "") {
				return Math.round((size.w / 16) * 9);
			} else if (size.h !== null && size.h !== "") {
				return Math.round((size.h / 9) * 16);
			} else {
				return 0;
			}
		},
		r4_3: function(size) {
			if (size.w !== null && size.w !== "") {
				return Math.round((size.w / 4) * 3);
			} else if (size.h !== null && size.h !== "") {
				return Math.round((size.h / 3) * 4);
			}
		}
	},
	getObjectAttributeByIndex: function(obj, index) {
		if(typeof obj != 'undefined') {
			var i = 0;
			for (var attr in obj){
				if (index === i){
					return obj[attr];
				}
				i++;
			}
			return "";
		} else {
			return "";
		}

	},
	getUrlVars: function(string) {
		var str,
			vars = [],
			hash,
			hashes;

		str = string.toString();

		if (str.match('&#038;')) {
			str = str.replace("&#038;", "&");
		} else if (str.match('&#38;')) {
			str = str.replace("&#38;", "&");
		} else if (str.match('&amp;')) {
			str = str.replace("&amp;", "&");
		}

		hashes = str.slice(str.indexOf('?') + 1).split('&');

		for(var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}


		return vars;
	},
    /**
     * Remove any leading or trailing whitespace from the given string.
     * If `str` is undefined or does not have a `replace` function, return
     * an empty string.
     */
	trim: function(str) {
        if (str && typeof(str.replace) == 'function') {
            return str.replace(/^\s+|\s+$/g, '');
        }
        return "";
	},

	slugify: function(str) {
		// borrowed from http://stackoverflow.com/a/5782563/102476
		str = TL.Util.trim(str);
		str = str.toLowerCase();

		// remove accents, swap ñ for n, etc
		var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
		var to   = "aaaaaeeeeeiiiiooooouuuunc------";
		for (var i=0, l=from.length ; i<l ; i++) {
		str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
		}

		str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
		.replace(/\s+/g, '-') // collapse whitespace and replace by -
		.replace(/-+/g, '-'); // collapse dashes

		str = str.replace(/^([0-9])/,'_$1');
		return str;
	},
	maxDepth: function(ary) {
		// given a sorted array of 2-tuples of numbers, count how many "deep" the items are.
		// that is, what is the maximum number of tuples that occupy any one moment
		// each tuple should also be sorted
		var stack = [];
		var max_depth = 0;
		for (var i = 0; i < ary.length; i++) {

			stack.push(ary[i]);
			if (stack.length > 1) {
				var top = stack[stack.length - 1]
				var bottom_idx = -1;
				for (var j = 0; j < stack.length - 1; j++) {
					if (stack[j][1] < top[0]) {
						bottom_idx = j;
					}
				};
				if (bottom_idx >= 0) {
					stack = stack.slice(bottom_idx + 1);
				}

			}

			if (stack.length > max_depth) {
				max_depth = stack.length;
			}
		};
		return max_depth;
	},

	pad: function (val, len) {
		val = String(val);
		len = len || 2;
		while (val.length < len) val = "0" + val;
		return val;
	},
	intToHexString: function(i) {
		return TL.Util.pad(parseInt(i,10).toString(16));
	},
    findNextGreater: function(list, current, default_value) {
        // given a sorted list and a current value which *might* be in the list,
        // return the next greatest value if the current value is >= the last item in the list, return default,
        // or if default is undefined, return input value
        for (var i = 0; i < list.length; i++) {
            if (current < list[i]) {
                return list[i];
            }
        }

        return (default_value) ? default_value : current;
    },

    findNextLesser: function(list, current, default_value) {
        // given a sorted list and a current value which *might* be in the list,
        // return the next lesser value if the current value is <= the last item in the list, return default,
        // or if default is undefined, return input value
        for (var i = list.length - 1; i >= 0; i--) {
            if (current > list[i]) {
                return list[i];
            }
        }

        return (default_value) ? default_value : current;
    },

	isEmptyObject: function(o) {
		var properties = []
		if (Object.keys) {
			properties = Object.keys(o);
		} else { // all this to support IE 8
		    for (var p in o) if (Object.prototype.hasOwnProperty.call(o,p)) properties.push(p);
    }
		for (var i = 0; i < properties.length; i++) {
			var k = properties[i];
			if (o[k] != null && typeof o[k] != "string") return false;
			if (TL.Util.trim(o[k]).length != 0) return false;
		}
		return true;
	},
	parseYouTubeTime: function(s) {
	    // given a YouTube start time string in a reasonable format, reduce it to a number of seconds as an integer.
		if (typeof(s) == 'string') {
			parts = s.match(/^\s*(\d+h)?(\d+m)?(\d+s)?\s*/i);
			if (parts) {
				var hours = parseInt(parts[1]) || 0;
				var minutes = parseInt(parts[2]) || 0;
				var seconds = parseInt(parts[3]) || 0;
				return seconds + (minutes * 60) + (hours * 60 * 60);
			}
		} else if (typeof(s) == 'number') {
			return s;
		}
		return 0;
	},
	/**
	 * Try to make seamless the process of interpreting a URL to a web page which embeds an image for sharing purposes
	 * as a direct image link. Some services have predictable transformations we can use rather than explain to people
	 * this subtlety.
	 */
	transformImageURL: function(url) {
		return url.replace(/(.*)www.dropbox.com\/(.*)/, '$1dl.dropboxusercontent.com/$2')
	},

	base58: (function(alpha) {
	    var alphabet = alpha || '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
	        base = alphabet.length;
	    return {
	        encode: function(enc) {
	            if(typeof enc!=='number' || enc !== parseInt(enc))
	                throw '"encode" only accepts integers.';
	            var encoded = '';
	            while(enc) {
	                var remainder = enc % base;
	                enc = Math.floor(enc / base);
	                encoded = alphabet[remainder].toString() + encoded;
	            }
	            return encoded;
	        },
	        decode: function(dec) {
	            if(typeof dec!=='string')
	                throw '"decode" only accepts strings.';
	            var decoded = 0;
	            while(dec) {
	                var alphabetPosition = alphabet.indexOf(dec[0]);
	                if (alphabetPosition < 0)
	                    throw '"decode" can\'t find "' + dec[0] + '" in the alphabet: "' + alphabet + '"';
	                var powerOf = dec.length - 1;
	                decoded += alphabetPosition * (Math.pow(base, powerOf));
	                dec = dec.substring(1);
	            }
	            return decoded;
	        }
	    };
	})()

};


/* **********************************************
     Begin TL.Data.js
********************************************** */

// Expects TL to be visible in scope

;(function(TL){
    /* Zepto v1.1.2-15-g59d3fe5 - zepto event ajax form ie - zeptojs.com/license */

    var Zepto = (function() {
      var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter,
        document = window.document,
        elementDisplay = {}, classCache = {},
        cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
        fragmentRE = /^\s*<(\w+|!)[^>]*>/,
        singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        rootNodeRE = /^(?:body|html)$/i,
        capitalRE = /([A-Z])/g,

        // special attributes that should be get/set via method calls
        methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

        adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
        table = document.createElement('table'),
        tableRow = document.createElement('tr'),
        containers = {
          'tr': document.createElement('tbody'),
          'tbody': table, 'thead': table, 'tfoot': table,
          'td': tableRow, 'th': tableRow,
          '*': document.createElement('div')
        },
        readyRE = /complete|loaded|interactive/,
        classSelectorRE = /^\.([\w-]+)$/,
        idSelectorRE = /^#([\w-]*)$/,
        simpleSelectorRE = /^[\w-]*$/,
        class2type = {},
        toString = class2type.toString,
        zepto = {},
        camelize, uniq,
        tempParent = document.createElement('div'),
        propMap = {
          'tabindex': 'tabIndex',
          'readonly': 'readOnly',
          'for': 'htmlFor',
          'class': 'className',
          'maxlength': 'maxLength',
          'cellspacing': 'cellSpacing',
          'cellpadding': 'cellPadding',
          'rowspan': 'rowSpan',
          'colspan': 'colSpan',
          'usemap': 'useMap',
          'frameborder': 'frameBorder',
          'contenteditable': 'contentEditable'
        },
        isArray = Array.isArray ||
          function(object){ return object instanceof Array }

      zepto.matches = function(element, selector) {
        if (!selector || !element || element.nodeType !== 1) return false
        var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
                              element.oMatchesSelector || element.matchesSelector
        if (matchesSelector) return matchesSelector.call(element, selector)
        // fall back to performing a selector:
        var match, parent = element.parentNode, temp = !parent
        if (temp) (parent = tempParent).appendChild(element)
        match = ~zepto.qsa(parent, selector).indexOf(element)
        temp && tempParent.removeChild(element)
        return match
      }

      function type(obj) {
        return obj == null ? String(obj) :
          class2type[toString.call(obj)] || "object"
      }

      function isFunction(value) { return type(value) == "function" }
      function isWindow(obj)     { return obj != null && obj == obj.window }
      function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
      function isObject(obj)     { return type(obj) == "object" }
      function isPlainObject(obj) {
        return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
      }
      function likeArray(obj) { return typeof obj.length == 'number' }

      function compact(array) { return filter.call(array, function(item){ return item != null }) }
      function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
      camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
      function dasherize(str) {
        return str.replace(/::/g, '/')
               .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
               .replace(/([a-z\d])([A-Z])/g, '$1_$2')
               .replace(/_/g, '-')
               .toLowerCase()
      }
      uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

      function classRE(name) {
        return name in classCache ?
          classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
      }

      function maybeAddPx(name, value) {
        return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
      }

      function defaultDisplay(nodeName) {
        var element, display
        if (!elementDisplay[nodeName]) {
          element = document.createElement(nodeName)
          document.body.appendChild(element)
          display = getComputedStyle(element, '').getPropertyValue("display")
          element.parentNode.removeChild(element)
          display == "none" && (display = "block")
          elementDisplay[nodeName] = display
        }
        return elementDisplay[nodeName]
      }

      function children(element) {
        return 'children' in element ?
          slice.call(element.children) :
          $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
      }

      // `$.zepto.fragment` takes a html string and an optional tag name
      // to generate DOM nodes nodes from the given html string.
      // The generated DOM nodes are returned as an array.
      // This function can be overriden in plugins for example to make
      // it compatible with browsers that don't support the DOM fully.
      zepto.fragment = function(html, name, properties) {
        var dom, nodes, container

        // A special case optimization for a single tag
        if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

        if (!dom) {
          if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
          if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
          if (!(name in containers)) name = '*'

          container = containers[name]
          container.innerHTML = '' + html
          dom = $.each(slice.call(container.childNodes), function(){
            container.removeChild(this)
          })
        }

        if (isPlainObject(properties)) {
          nodes = $(dom)
          $.each(properties, function(key, value) {
            if (methodAttributes.indexOf(key) > -1) nodes[key](value)
            else nodes.attr(key, value)
          })
        }

        return dom
      }

      // `$.zepto.Z` swaps out the prototype of the given `dom` array
      // of nodes with `$.fn` and thus supplying all the Zepto functions
      // to the array. Note that `__proto__` is not supported on Internet
      // Explorer. This method can be overriden in plugins.
      zepto.Z = function(dom, selector) {
        dom = dom || []
        dom.__proto__ = $.fn
        dom.selector = selector || ''
        return dom
      }

      // `$.zepto.isZ` should return `true` if the given object is a Zepto
      // collection. This method can be overriden in plugins.
      zepto.isZ = function(object) {
        return object instanceof zepto.Z
      }

      // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
      // takes a CSS selector and an optional context (and handles various
      // special cases).
      // This method can be overriden in plugins.
      zepto.init = function(selector, context) {
        var dom
        // If nothing given, return an empty Zepto collection
        if (!selector) return zepto.Z()
        // Optimize for string selectors
        else if (typeof selector == 'string') {
          selector = selector.trim()
          // If it's a html fragment, create nodes from it
          // Note: In both Chrome 21 and Firefox 15, DOM error 12
          // is thrown if the fragment doesn't begin with <
          if (selector[0] == '<' && fragmentRE.test(selector))
            dom = zepto.fragment(selector, RegExp.$1, context), selector = null
          // If there's a context, create a collection on that context first, and select
          // nodes from there
          else if (context !== undefined) return $(context).find(selector)
          // If it's a CSS selector, use it to select nodes.
          else dom = zepto.qsa(document, selector)
        }
        // If a function is given, call it when the DOM is ready
        else if (isFunction(selector)) return $(document).ready(selector)
        // If a Zepto collection is given, just return it
        else if (zepto.isZ(selector)) return selector
        else {
          // normalize array if an array of nodes is given
          if (isArray(selector)) dom = compact(selector)
          // Wrap DOM nodes.
          else if (isObject(selector))
            dom = [selector], selector = null
          // If it's a html fragment, create nodes from it
          else if (fragmentRE.test(selector))
            dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
          // If there's a context, create a collection on that context first, and select
          // nodes from there
          else if (context !== undefined) return $(context).find(selector)
          // And last but no least, if it's a CSS selector, use it to select nodes.
          else dom = zepto.qsa(document, selector)
        }
        // create a new Zepto collection from the nodes found
        return zepto.Z(dom, selector)
      }

      // `$` will be the base `Zepto` object. When calling this
      // function just call `$.zepto.init, which makes the implementation
      // details of selecting nodes and creating Zepto collections
      // patchable in plugins.
      $ = function(selector, context){
        return zepto.init(selector, context)
      }

      function extend(target, source, deep) {
        for (key in source)
          if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
            if (isPlainObject(source[key]) && !isPlainObject(target[key]))
              target[key] = {}
            if (isArray(source[key]) && !isArray(target[key]))
              target[key] = []
            extend(target[key], source[key], deep)
          }
          else if (source[key] !== undefined) target[key] = source[key]
      }

      // Copy all but undefined properties from one or more
      // objects to the `target` object.
      $.extend = function(target){
        var deep, args = slice.call(arguments, 1)
        if (typeof target == 'boolean') {
          deep = target
          target = args.shift()
        }
        args.forEach(function(arg){ extend(target, arg, deep) })
        return target
      }

      // `$.zepto.qsa` is Zepto's CSS selector implementation which
      // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
      // This method can be overriden in plugins.
      zepto.qsa = function(element, selector){
        var found,
            maybeID = selector[0] == '#',
            maybeClass = !maybeID && selector[0] == '.',
            nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
            isSimple = simpleSelectorRE.test(nameOnly)
        return (isDocument(element) && isSimple && maybeID) ?
          ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
          (element.nodeType !== 1 && element.nodeType !== 9) ? [] :
          slice.call(
            isSimple && !maybeID ?
              maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
              element.getElementsByTagName(selector) : // Or a tag
              element.querySelectorAll(selector) // Or it's not simple, and we need to query all
          )
      }

      function filtered(nodes, selector) {
        return selector == null ? $(nodes) : $(nodes).filter(selector)
      }

      $.contains = function(parent, node) {
        return parent !== node && parent.contains(node)
      }

      function funcArg(context, arg, idx, payload) {
        return isFunction(arg) ? arg.call(context, idx, payload) : arg
      }

      function setAttribute(node, name, value) {
        value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
      }

      // access className property while respecting SVGAnimatedString
      function className(node, value){
        var klass = node.className,
            svg   = klass && klass.baseVal !== undefined

        if (value === undefined) return svg ? klass.baseVal : klass
        svg ? (klass.baseVal = value) : (node.className = value)
      }

      // "true"  => true
      // "false" => false
      // "null"  => null
      // "42"    => 42
      // "42.5"  => 42.5
      // "08"    => "08"
      // JSON    => parse if valid
      // String  => self
      function deserializeValue(value) {
        var num
        try {
          return value ?
            value == "true" ||
            ( value == "false" ? false :
              value == "null" ? null :
              !/^0/.test(value) && !isNaN(num = Number(value)) ? num :
              /^[\[\{]/.test(value) ? $.parseJSON(value) :
              value )
            : value
        } catch(e) {
          return value
        }
      }

      $.type = type
      $.isFunction = isFunction
      $.isWindow = isWindow
      $.isArray = isArray
      $.isPlainObject = isPlainObject

      $.isEmptyObject = function(obj) {
        var name
        for (name in obj) return false
        return true
      }

      $.inArray = function(elem, array, i){
        return emptyArray.indexOf.call(array, elem, i)
      }

      $.camelCase = camelize
      $.trim = function(str) {
        return str == null ? "" : String.prototype.trim.call(str)
      }

      // plugin compatibility
      $.uuid = 0
      $.support = { }
      $.expr = { }

      $.map = function(elements, callback){
        var value, values = [], i, key
        if (likeArray(elements))
          for (i = 0; i < elements.length; i++) {
            value = callback(elements[i], i)
            if (value != null) values.push(value)
          }
        else
          for (key in elements) {
            value = callback(elements[key], key)
            if (value != null) values.push(value)
          }
        return flatten(values)
      }

      $.each = function(elements, callback){
        var i, key
        if (likeArray(elements)) {
          for (i = 0; i < elements.length; i++)
            if (callback.call(elements[i], i, elements[i]) === false) return elements
        } else {
          for (key in elements)
            if (callback.call(elements[key], key, elements[key]) === false) return elements
        }

        return elements
      }

      $.grep = function(elements, callback){
        return filter.call(elements, callback)
      }

      if (window.JSON) $.parseJSON = JSON.parse

      // Populate the class2type map
      $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
        class2type[ "[object " + name + "]" ] = name.toLowerCase()
      })

      // Define methods that will be available on all
      // Zepto collections
      $.fn = {
        // Because a collection acts like an array
        // copy over these useful array functions.
        forEach: emptyArray.forEach,
        reduce: emptyArray.reduce,
        push: emptyArray.push,
        sort: emptyArray.sort,
        indexOf: emptyArray.indexOf,
        concat: emptyArray.concat,

        // `map` and `slice` in the jQuery API work differently
        // from their array counterparts
        map: function(fn){
          return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
        },
        slice: function(){
          return $(slice.apply(this, arguments))
        },

        ready: function(callback){
          // need to check if document.body exists for IE as that browser reports
          // document ready when it hasn't yet created the body element
          if (readyRE.test(document.readyState) && document.body) callback($)
          else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
          return this
        },
        get: function(idx){
          return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
        },
        toArray: function(){ return this.get() },
        size: function(){
          return this.length
        },
        remove: function(){
          return this.each(function(){
            if (this.parentNode != null)
              this.parentNode.removeChild(this)
          })
        },
        each: function(callback){
          emptyArray.every.call(this, function(el, idx){
            return callback.call(el, idx, el) !== false
          })
          return this
        },
        filter: function(selector){
          if (isFunction(selector)) return this.not(this.not(selector))
          return $(filter.call(this, function(element){
            return zepto.matches(element, selector)
          }))
        },
        add: function(selector,context){
          return $(uniq(this.concat($(selector,context))))
        },
        is: function(selector){
          return this.length > 0 && zepto.matches(this[0], selector)
        },
        not: function(selector){
          var nodes=[]
          if (isFunction(selector) && selector.call !== undefined)
            this.each(function(idx){
              if (!selector.call(this,idx)) nodes.push(this)
            })
          else {
            var excludes = typeof selector == 'string' ? this.filter(selector) :
              (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
            this.forEach(function(el){
              if (excludes.indexOf(el) < 0) nodes.push(el)
            })
          }
          return $(nodes)
        },
        has: function(selector){
          return this.filter(function(){
            return isObject(selector) ?
              $.contains(this, selector) :
              $(this).find(selector).size()
          })
        },
        eq: function(idx){
          return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
        },
        first: function(){
          var el = this[0]
          return el && !isObject(el) ? el : $(el)
        },
        last: function(){
          var el = this[this.length - 1]
          return el && !isObject(el) ? el : $(el)
        },
        find: function(selector){
          var result, $this = this
          if (typeof selector == 'object')
            result = $(selector).filter(function(){
              var node = this
              return emptyArray.some.call($this, function(parent){
                return $.contains(parent, node)
              })
            })
          else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
          else result = this.map(function(){ return zepto.qsa(this, selector) })
          return result
        },
        closest: function(selector, context){
          var node = this[0], collection = false
          if (typeof selector == 'object') collection = $(selector)
          while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
            node = node !== context && !isDocument(node) && node.parentNode
          return $(node)
        },
        parents: function(selector){
          var ancestors = [], nodes = this
          while (nodes.length > 0)
            nodes = $.map(nodes, function(node){
              if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
                ancestors.push(node)
                return node
              }
            })
          return filtered(ancestors, selector)
        },
        parent: function(selector){
          return filtered(uniq(this.pluck('parentNode')), selector)
        },
        children: function(selector){
          return filtered(this.map(function(){ return children(this) }), selector)
        },
        contents: function() {
          return this.map(function() { return slice.call(this.childNodes) })
        },
        siblings: function(selector){
          return filtered(this.map(function(i, el){
            return filter.call(children(el.parentNode), function(child){ return child!==el })
          }), selector)
        },
        empty: function(){
          return this.each(function(){ this.innerHTML = '' })
        },
        // `pluck` is borrowed from Prototype.js
        pluck: function(property){
          return $.map(this, function(el){ return el[property] })
        },
        show: function(){
          return this.each(function(){
            this.style.display == "none" && (this.style.display = '')
            if (getComputedStyle(this, '').getPropertyValue("display") == "none")
              this.style.display = defaultDisplay(this.nodeName)
          })
        },
        replaceWith: function(newContent){
          return this.before(newContent).remove()
        },
        wrap: function(structure){
          var func = isFunction(structure)
          if (this[0] && !func)
            var dom   = $(structure).get(0),
                clone = dom.parentNode || this.length > 1

          return this.each(function(index){
            $(this).wrapAll(
              func ? structure.call(this, index) :
                clone ? dom.cloneNode(true) : dom
            )
          })
        },
        wrapAll: function(structure){
          if (this[0]) {
            $(this[0]).before(structure = $(structure))
            var children
            // drill down to the inmost element
            while ((children = structure.children()).length) structure = children.first()
            $(structure).append(this)
          }
          return this
        },
        wrapInner: function(structure){
          var func = isFunction(structure)
          return this.each(function(index){
            var self = $(this), contents = self.contents(),
                dom  = func ? structure.call(this, index) : structure
            contents.length ? contents.wrapAll(dom) : self.append(dom)
          })
        },
        unwrap: function(){
          this.parent().each(function(){
            $(this).replaceWith($(this).children())
          })
          return this
        },
        clone: function(){
          return this.map(function(){ return this.cloneNode(true) })
        },
        hide: function(){
          return this.css("display", "none")
        },
        toggle: function(setting){
          return this.each(function(){
            var el = $(this)
            ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
          })
        },
        prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
        next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
        html: function(html){
          return arguments.length === 0 ?
            (this.length > 0 ? this[0].innerHTML : null) :
            this.each(function(idx){
              var originHtml = this.innerHTML
              $(this).empty().append( funcArg(this, html, idx, originHtml) )
            })
        },
        text: function(text){
          return arguments.length === 0 ?
            (this.length > 0 ? this[0].textContent : null) :
            this.each(function(){ this.textContent = (text === undefined) ? '' : ''+text })
        },
        attr: function(name, value){
          var result
          return (typeof name == 'string' && value === undefined) ?
            (this.length == 0 || this[0].nodeType !== 1 ? undefined :
              (name == 'value' && this[0].nodeName == 'INPUT') ? this.val() :
              (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
            ) :
            this.each(function(idx){
              if (this.nodeType !== 1) return
              if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
              else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
            })
        },
        removeAttr: function(name){
          return this.each(function(){ this.nodeType === 1 && setAttribute(this, name) })
        },
        prop: function(name, value){
          name = propMap[name] || name
          return (value === undefined) ?
            (this[0] && this[0][name]) :
            this.each(function(idx){
              this[name] = funcArg(this, value, idx, this[name])
            })
        },
        data: function(name, value){
          var data = this.attr('data-' + name.replace(capitalRE, '-$1').toLowerCase(), value)
          return data !== null ? deserializeValue(data) : undefined
        },
        val: function(value){
          return arguments.length === 0 ?
            (this[0] && (this[0].multiple ?
               $(this[0]).find('option').filter(function(){ return this.selected }).pluck('value') :
               this[0].value)
            ) :
            this.each(function(idx){
              this.value = funcArg(this, value, idx, this.value)
            })
        },
        offset: function(coordinates){
          if (coordinates) return this.each(function(index){
            var $this = $(this),
                coords = funcArg(this, coordinates, index, $this.offset()),
                parentOffset = $this.offsetParent().offset(),
                props = {
                  top:  coords.top  - parentOffset.top,
                  left: coords.left - parentOffset.left
                }

            if ($this.css('position') == 'static') props['position'] = 'relative'
            $this.css(props)
          })
          if (this.length==0) return null
          var obj = this[0].getBoundingClientRect()
          return {
            left: obj.left + window.pageXOffset,
            top: obj.top + window.pageYOffset,
            width: Math.round(obj.width),
            height: Math.round(obj.height)
          }
        },
        css: function(property, value){
          if (arguments.length < 2) {
            var element = this[0], computedStyle = getComputedStyle(element, '')
            if(!element) return
            if (typeof property == 'string')
              return element.style[camelize(property)] || computedStyle.getPropertyValue(property)
            else if (isArray(property)) {
              var props = {}
              $.each(isArray(property) ? property: [property], function(_, prop){
                props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
              })
              return props
            }
          }

          var css = ''
          if (type(property) == 'string') {
            if (!value && value !== 0)
              this.each(function(){ this.style.removeProperty(dasherize(property)) })
            else
              css = dasherize(property) + ":" + maybeAddPx(property, value)
          } else {
            for (key in property)
              if (!property[key] && property[key] !== 0)
                this.each(function(){ this.style.removeProperty(dasherize(key)) })
              else
                css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
          }

          return this.each(function(){ this.style.cssText += ';' + css })
        },
        index: function(element){
          return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
        },
        hasClass: function(name){
          if (!name) return false
          return emptyArray.some.call(this, function(el){
            return this.test(className(el))
          }, classRE(name))
        },
        addClass: function(name){
          if (!name) return this
          return this.each(function(idx){
            classList = []
            var cls = className(this), newName = funcArg(this, name, idx, cls)
            newName.split(/\s+/g).forEach(function(klass){
              if (!$(this).hasClass(klass)) classList.push(klass)
            }, this)
            classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
          })
        },
        removeClass: function(name){
          return this.each(function(idx){
            if (name === undefined) return className(this, '')
            classList = className(this)
            funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
              classList = classList.replace(classRE(klass), " ")
            })
            className(this, classList.trim())
          })
        },
        toggleClass: function(name, when){
          if (!name) return this
          return this.each(function(idx){
            var $this = $(this), names = funcArg(this, name, idx, className(this))
            names.split(/\s+/g).forEach(function(klass){
              (when === undefined ? !$this.hasClass(klass) : when) ?
                $this.addClass(klass) : $this.removeClass(klass)
            })
          })
        },
        scrollTop: function(value){
          if (!this.length) return
          var hasScrollTop = 'scrollTop' in this[0]
          if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
          return this.each(hasScrollTop ?
            function(){ this.scrollTop = value } :
            function(){ this.scrollTo(this.scrollX, value) })
        },
        scrollLeft: function(value){
          if (!this.length) return
          var hasScrollLeft = 'scrollLeft' in this[0]
          if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
          return this.each(hasScrollLeft ?
            function(){ this.scrollLeft = value } :
            function(){ this.scrollTo(value, this.scrollY) })
        },
        position: function() {
          if (!this.length) return

          var elem = this[0],
            // Get *real* offsetParent
            offsetParent = this.offsetParent(),
            // Get correct offsets
            offset       = this.offset(),
            parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

          // Subtract element margins
          // note: when an element has margin: auto the offsetLeft and marginLeft
          // are the same in Safari causing offset.left to incorrectly be 0
          offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
          offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

          // Add offsetParent borders
          parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
          parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

          // Subtract the two offsets
          return {
            top:  offset.top  - parentOffset.top,
            left: offset.left - parentOffset.left
          }
        },
        offsetParent: function() {
          return this.map(function(){
            var parent = this.offsetParent || document.body
            while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
              parent = parent.offsetParent
            return parent
          })
        }
      }

      // for now
      $.fn.detach = $.fn.remove

      // Generate the `width` and `height` functions
      ;['width', 'height'].forEach(function(dimension){
        var dimensionProperty =
          dimension.replace(/./, function(m){ return m[0].toUpperCase() })

        $.fn[dimension] = function(value){
          var offset, el = this[0]
          if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
            isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
            (offset = this.offset()) && offset[dimension]
          else return this.each(function(idx){
            el = $(this)
            el.css(dimension, funcArg(this, value, idx, el[dimension]()))
          })
        }
      })

      function traverseNode(node, fun) {
        fun(node)
        for (var key in node.childNodes) traverseNode(node.childNodes[key], fun)
      }

      // Generate the `after`, `prepend`, `before`, `append`,
      // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
      adjacencyOperators.forEach(function(operator, operatorIndex) {
        var inside = operatorIndex % 2 //=> prepend, append

        $.fn[operator] = function(){
          // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
          var argType, nodes = $.map(arguments, function(arg) {
                argType = type(arg)
                return argType == "object" || argType == "array" || arg == null ?
                  arg : zepto.fragment(arg)
              }),
              parent, copyByClone = this.length > 1
          if (nodes.length < 1) return this

          return this.each(function(_, target){
            parent = inside ? target : target.parentNode

            // convert all methods to a "before" operation
            target = operatorIndex == 0 ? target.nextSibling :
                     operatorIndex == 1 ? target.firstChild :
                     operatorIndex == 2 ? target :
                     null

            nodes.forEach(function(node){
              if (copyByClone) node = node.cloneNode(true)
              else if (!parent) return $(node).remove()

              traverseNode(parent.insertBefore(node, target), function(el){
                if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
                   (!el.type || el.type === 'text/javascript') && !el.src)
                  window['eval'].call(window, el.innerHTML)
              })
            })
          })
        }

        // after    => insertAfter
        // prepend  => prependTo
        // before   => insertBefore
        // append   => appendTo
        $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
          $(html)[operator](this)
          return this
        }
      })

      zepto.Z.prototype = $.fn

      // Export internal API functions in the `$.zepto` namespace
      zepto.uniq = uniq
      zepto.deserializeValue = deserializeValue
      $.zepto = zepto

      return $
    })()

    window.Zepto = Zepto
    window.$ === undefined && (window.$ = Zepto)

    ;(function($){
      var $$ = $.zepto.qsa, _zid = 1, undefined,
          slice = Array.prototype.slice,
          isFunction = $.isFunction,
          isString = function(obj){ return typeof obj == 'string' },
          handlers = {},
          specialEvents={},
          focusinSupported = 'onfocusin' in window,
          focus = { focus: 'focusin', blur: 'focusout' },
          hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

      specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

      function zid(element) {
        return element._zid || (element._zid = _zid++)
      }
      function findHandlers(element, event, fn, selector) {
        event = parse(event)
        if (event.ns) var matcher = matcherFor(event.ns)
        return (handlers[zid(element)] || []).filter(function(handler) {
          return handler
            && (!event.e  || handler.e == event.e)
            && (!event.ns || matcher.test(handler.ns))
            && (!fn       || zid(handler.fn) === zid(fn))
            && (!selector || handler.sel == selector)
        })
      }
      function parse(event) {
        var parts = ('' + event).split('.')
        return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
      }
      function matcherFor(ns) {
        return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
      }

      function eventCapture(handler, captureSetting) {
        return handler.del &&
          (!focusinSupported && (handler.e in focus)) ||
          !!captureSetting
      }

      function realEvent(type) {
        return hover[type] || (focusinSupported && focus[type]) || type
      }

      function add(element, events, fn, data, selector, delegator, capture){
        var id = zid(element), set = (handlers[id] || (handlers[id] = []))
        events.split(/\s/).forEach(function(event){
          if (event == 'ready') return $(document).ready(fn)
          var handler   = parse(event)
          handler.fn    = fn
          handler.sel   = selector
          // emulate mouseenter, mouseleave
          if (handler.e in hover) fn = function(e){
            var related = e.relatedTarget
            if (!related || (related !== this && !$.contains(this, related)))
              return handler.fn.apply(this, arguments)
          }
          handler.del   = delegator
          var callback  = delegator || fn
          handler.proxy = function(e){
            e = compatible(e)
            if (e.isImmediatePropagationStopped()) return
            e.data = data
            var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
            if (result === false) e.preventDefault(), e.stopPropagation()
            return result
          }
          handler.i = set.length
          set.push(handler)
          if ('addEventListener' in element)
            element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
        })
      }
      function remove(element, events, fn, selector, capture){
        var id = zid(element)
        ;(events || '').split(/\s/).forEach(function(event){
          findHandlers(element, event, fn, selector).forEach(function(handler){
            delete handlers[id][handler.i]
          if ('removeEventListener' in element)
            element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
          })
        })
      }

      $.event = { add: add, remove: remove }

      $.proxy = function(fn, context) {
        if (isFunction(fn)) {
          var proxyFn = function(){ return fn.apply(context, arguments) }
          proxyFn._zid = zid(fn)
          return proxyFn
        } else if (isString(context)) {
          return $.proxy(fn[context], fn)
        } else {
          throw new TypeError("expected function")
        }
      }

      $.fn.bind = function(event, data, callback){
        return this.on(event, data, callback)
      }
      $.fn.unbind = function(event, callback){
        return this.off(event, callback)
      }
      $.fn.one = function(event, selector, data, callback){
        return this.on(event, selector, data, callback, 1)
      }

      var returnTrue = function(){return true},
          returnFalse = function(){return false},
          ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
          eventMethods = {
            preventDefault: 'isDefaultPrevented',
            stopImmediatePropagation: 'isImmediatePropagationStopped',
            stopPropagation: 'isPropagationStopped'
          }

      function compatible(event, source) {
        if (source || !event.isDefaultPrevented) {
          source || (source = event)

          $.each(eventMethods, function(name, predicate) {
            var sourceMethod = source[name]
            event[name] = function(){
              this[predicate] = returnTrue
              return sourceMethod && sourceMethod.apply(source, arguments)
            }
            event[predicate] = returnFalse
          })

          if (source.defaultPrevented !== undefined ? source.defaultPrevented :
              'returnValue' in source ? source.returnValue === false :
              source.getPreventDefault && source.getPreventDefault())
            event.isDefaultPrevented = returnTrue
        }
        return event
      }

      function createProxy(event) {
        var key, proxy = { originalEvent: event }
        for (key in event)
          if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

        return compatible(proxy, event)
      }

      $.fn.delegate = function(selector, event, callback){
        return this.on(event, selector, callback)
      }
      $.fn.undelegate = function(selector, event, callback){
        return this.off(event, selector, callback)
      }

      $.fn.live = function(event, callback){
        $(document.body).delegate(this.selector, event, callback)
        return this
      }
      $.fn.die = function(event, callback){
        $(document.body).undelegate(this.selector, event, callback)
        return this
      }

      $.fn.on = function(event, selector, data, callback, one){
        var autoRemove, delegator, $this = this
        if (event && !isString(event)) {
          $.each(event, function(type, fn){
            $this.on(type, selector, data, fn, one)
          })
          return $this
        }

        if (!isString(selector) && !isFunction(callback) && callback !== false)
          callback = data, data = selector, selector = undefined
        if (isFunction(data) || data === false)
          callback = data, data = undefined

        if (callback === false) callback = returnFalse

        return $this.each(function(_, element){
          if (one) autoRemove = function(e){
            remove(element, e.type, callback)
            return callback.apply(this, arguments)
          }

          if (selector) delegator = function(e){
            var evt, match = $(e.target).closest(selector, element).get(0)
            if (match && match !== element) {
              evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
              return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
            }
          }

          add(element, event, callback, data, selector, delegator || autoRemove)
        })
      }
      $.fn.off = function(event, selector, callback){
        var $this = this
        if (event && !isString(event)) {
          $.each(event, function(type, fn){
            $this.off(type, selector, fn)
          })
          return $this
        }

        if (!isString(selector) && !isFunction(callback) && callback !== false)
          callback = selector, selector = undefined

        if (callback === false) callback = returnFalse

        return $this.each(function(){
          remove(this, event, callback, selector)
        })
      }

      $.fn.trigger = function(event, args){
        event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
        event._args = args
        return this.each(function(){
          // items in the collection might not be DOM elements
          if('dispatchEvent' in this) this.dispatchEvent(event)
          else $(this).triggerHandler(event, args)
        })
      }

      // triggers event handlers on current element just as if an event occurred,
      // doesn't trigger an actual event, doesn't bubble
      $.fn.triggerHandler = function(event, args){
        var e, result
        this.each(function(i, element){
          e = createProxy(isString(event) ? $.Event(event) : event)
          e._args = args
          e.target = element
          $.each(findHandlers(element, event.type || event), function(i, handler){
            result = handler.proxy(e)
            if (e.isImmediatePropagationStopped()) return false
          })
        })
        return result
      }

      // shortcut methods for `.bind(event, fn)` for each event type
      ;('focusin focusout load resize scroll unload click dblclick '+
      'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
      'change select keydown keypress keyup error').split(' ').forEach(function(event) {
        $.fn[event] = function(callback) {
          return callback ?
            this.bind(event, callback) :
            this.trigger(event)
        }
      })

      ;['focus', 'blur'].forEach(function(name) {
        $.fn[name] = function(callback) {
          if (callback) this.bind(name, callback)
          else this.each(function(){
            try { this[name]() }
            catch(e) {}
          })
          return this
        }
      })

      $.Event = function(type, props) {
        if (!isString(type)) props = type, type = props.type
        var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
        if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
        event.initEvent(type, bubbles, true)
        return compatible(event)
      }

    })(Zepto)

    ;(function($){
      var jsonpID = 0,
          document = window.document,
          key,
          name,
          rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          scriptTypeRE = /^(?:text|application)\/javascript/i,
          xmlTypeRE = /^(?:text|application)\/xml/i,
          jsonType = 'application/json',
          htmlType = 'text/html',
          blankRE = /^\s*$/

      // trigger a custom event and return false if it was cancelled
      function triggerAndReturn(context, eventName, data) {
        var event = $.Event(eventName)
        $(context).trigger(event, data)
        return !event.isDefaultPrevented()
      }

      // trigger an Ajax "global" event
      function triggerGlobal(settings, context, eventName, data) {
        if (settings.global) return triggerAndReturn(context || document, eventName, data)
      }

      // Number of active Ajax requests
      $.active = 0

      function ajaxStart(settings) {
        if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
      }
      function ajaxStop(settings) {
        if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
      }

      // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
      function ajaxBeforeSend(xhr, settings) {
        var context = settings.context
        if (settings.beforeSend.call(context, xhr, settings) === false ||
            triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
          return false

        triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
      }
      function ajaxSuccess(data, xhr, settings, deferred) {
        var context = settings.context, status = 'success'
        settings.success.call(context, data, status, xhr)
        if (deferred) deferred.resolveWith(context, [data, status, xhr])
        triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
        ajaxComplete(status, xhr, settings)
      }
      // type: "timeout", "error", "abort", "parsererror"
      function ajaxError(error, type, xhr, settings, deferred) {
        var context = settings.context
        settings.error.call(context, xhr, type, error)
        if (deferred) deferred.rejectWith(context, [xhr, type, error])
        triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
        ajaxComplete(type, xhr, settings)
      }
      // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
      function ajaxComplete(status, xhr, settings) {
        var context = settings.context
        settings.complete.call(context, xhr, status)
        triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
        ajaxStop(settings)
      }

      // Empty function, used as default callback
      function empty() {}

      $.ajaxJSONP = function(options, deferred){
        if (!('type' in options)) return $.ajax(options)

        var _callbackName = options.jsonpCallback,
          callbackName = ($.isFunction(_callbackName) ?
            _callbackName() : _callbackName) || ('jsonp' + (++jsonpID)),
          script = document.createElement('script'),
          originalCallback = window[callbackName],
          responseData,
          abort = function(errorType) {
            $(script).triggerHandler('error', errorType || 'abort')
          },
          xhr = { abort: abort }, abortTimeout

        if (deferred) deferred.promise(xhr)

        $(script).on('load error', function(e, errorType){
          clearTimeout(abortTimeout)
          $(script).off().remove()

          if (e.type == 'error' || !responseData) {
            ajaxError(null, errorType || 'error', xhr, options, deferred)
          } else {
            ajaxSuccess(responseData[0], xhr, options, deferred)
          }

          window[callbackName] = originalCallback
          if (responseData && $.isFunction(originalCallback))
            originalCallback(responseData[0])

          originalCallback = responseData = undefined
        })

        if (ajaxBeforeSend(xhr, options) === false) {
          abort('abort')
          return xhr
        }

        window[callbackName] = function(){
          responseData = arguments
        }

        script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
        document.head.appendChild(script)

        if (options.timeout > 0) abortTimeout = setTimeout(function(){
          abort('timeout')
        }, options.timeout)

        return xhr
      }

      $.ajaxSettings = {
        // Default type of request
        type: 'GET',
        // Callback that is executed before request
        beforeSend: empty,
        // Callback that is executed if the request succeeds
        success: empty,
        // Callback that is executed the the server drops error
        error: empty,
        // Callback that is executed on request complete (both: error and success)
        complete: empty,
        // The context for the callbacks
        context: null,
        // Whether to trigger "global" Ajax events
        global: true,
        // Transport
        xhr: function () {
          return new window.XMLHttpRequest()
        },
        // MIME types mapping
        // IIS returns Javascript as "application/x-javascript"
        accepts: {
          script: 'text/javascript, application/javascript, application/x-javascript',
          json:   jsonType,
          xml:    'application/xml, text/xml',
          html:   htmlType,
          text:   'text/plain'
        },
        // Whether the request is to another domain
        crossDomain: false,
        // Default timeout
        timeout: 0,
        // Whether data should be serialized to string
        processData: true,
        // Whether the browser should be allowed to cache GET responses
        cache: true
      }

      function mimeToDataType(mime) {
        if (mime) mime = mime.split(';', 2)[0]
        return mime && ( mime == htmlType ? 'html' :
          mime == jsonType ? 'json' :
          scriptTypeRE.test(mime) ? 'script' :
          xmlTypeRE.test(mime) && 'xml' ) || 'text'
      }

      function appendQuery(url, query) {
        if (query == '') return url
        return (url + '&' + query).replace(/[&?]{1,2}/, '?')
      }

      // serialize payload and append it to the URL for GET requests
      function serializeData(options) {
        if (options.processData && options.data && $.type(options.data) != "string")
          options.data = $.param(options.data, options.traditional)
        if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
          options.url = appendQuery(options.url, options.data), options.data = undefined
      }

      $.ajax = function(options){
        var settings = $.extend({}, options || {}),
            deferred = $.Deferred && $.Deferred()
        for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

        ajaxStart(settings)

        if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
          RegExp.$2 != window.location.host

        if (!settings.url) settings.url = window.location.toString()
        serializeData(settings)
        if (settings.cache === false) settings.url = appendQuery(settings.url, '_=' + Date.now())

        var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url)
        if (dataType == 'jsonp' || hasPlaceholder) {
          if (!hasPlaceholder)
            settings.url = appendQuery(settings.url,
              settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
          return $.ajaxJSONP(settings, deferred)
        }

        var mime = settings.accepts[dataType],
            headers = { },
            setHeader = function(name, value) { headers[name.toLowerCase()] = [name, value] },
            protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
            xhr = settings.xhr(),
            nativeSetHeader = xhr.setRequestHeader,
            abortTimeout

        if (deferred) deferred.promise(xhr)

        if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest')
        setHeader('Accept', mime || '*/*')
        if (mime = settings.mimeType || mime) {
          if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
          xhr.overrideMimeType && xhr.overrideMimeType(mime)
        }
        if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
          setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')

        if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name])
        xhr.setRequestHeader = setHeader

        xhr.onreadystatechange = function(){
          if (xhr.readyState == 4) {
            xhr.onreadystatechange = empty
            clearTimeout(abortTimeout)
            var result, error = false
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
              dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))
              result = xhr.responseText

              try {
                // http://perfectionkills.com/global-eval-what-are-the-options/
                if (dataType == 'script')    (1,eval)(result)
                else if (dataType == 'xml')  result = xhr.responseXML
                else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
              } catch (e) { error = e }

              if (error) ajaxError(error, 'parsererror', xhr, settings, deferred)
              else ajaxSuccess(result, xhr, settings, deferred)
            } else {
              ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred)
            }
          }
        }

        if (ajaxBeforeSend(xhr, settings) === false) {
          xhr.abort()
          ajaxError(null, 'abort', xhr, settings, deferred)
          return xhr
        }

        if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]

        var async = 'async' in settings ? settings.async : true
        xhr.open(settings.type, settings.url, async, settings.username, settings.password)

        for (name in headers) nativeSetHeader.apply(xhr, headers[name])

        if (settings.timeout > 0) abortTimeout = setTimeout(function(){
            xhr.onreadystatechange = empty
            xhr.abort()
            ajaxError(null, 'timeout', xhr, settings, deferred)
          }, settings.timeout)

        // avoid sending empty string (#319)
        xhr.send(settings.data ? settings.data : null)
        return xhr
      }

      // handle optional data/success arguments
      function parseArguments(url, data, success, dataType) {
        var hasData = !$.isFunction(data)
        return {
          url:      url,
          data:     hasData  ? data : undefined,
          success:  !hasData ? data : $.isFunction(success) ? success : undefined,
          dataType: hasData  ? dataType || success : success
        }
      }

      $.get = function(url, data, success, dataType){
        return $.ajax(parseArguments.apply(null, arguments))
      }

      $.post = function(url, data, success, dataType){
        var options = parseArguments.apply(null, arguments)
        options.type = 'POST'
        return $.ajax(options)
      }

      $.getJSON = function(url, data, success){
        var options = parseArguments.apply(null, arguments)
        options.dataType = 'json'
        return $.ajax(options)
      }

      $.fn.load = function(url, data, success){
        if (!this.length) return this
        var self = this, parts = url.split(/\s/), selector,
            options = parseArguments(url, data, success),
            callback = options.success
        if (parts.length > 1) options.url = parts[0], selector = parts[1]
        options.success = function(response){
          self.html(selector ?
            $('<div>').html(response.replace(rscript, "")).find(selector)
            : response)
          callback && callback.apply(self, arguments)
        }
        $.ajax(options)
        return this
      }

      var escape = encodeURIComponent

      function serialize(params, obj, traditional, scope){
        var type, array = $.isArray(obj), hash = $.isPlainObject(obj)
        $.each(obj, function(key, value) {
          type = $.type(value)
          if (scope) key = traditional ? scope :
            scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
          // handle data in serializeArray() format
          if (!scope && array) params.add(value.name, value.value)
          // recurse into nested objects
          else if (type == "array" || (!traditional && type == "object"))
            serialize(params, value, traditional, key)
          else params.add(key, value)
        })
      }

      $.param = function(obj, traditional){
        var params = []
        params.add = function(k, v){ this.push(escape(k) + '=' + escape(v)) }
        serialize(params, obj, traditional)
        return params.join('&').replace(/%20/g, '+')
      }
    })(Zepto)

    ;(function($){
      $.fn.serializeArray = function() {
        var result = [], el
        $([].slice.call(this.get(0).elements)).each(function(){
          el = $(this)
          var type = el.attr('type')
          if (this.nodeName.toLowerCase() != 'fieldset' &&
            !this.disabled && type != 'submit' && type != 'reset' && type != 'button' &&
            ((type != 'radio' && type != 'checkbox') || this.checked))
            result.push({
              name: el.attr('name'),
              value: el.val()
            })
        })
        return result
      }

      $.fn.serialize = function(){
        var result = []
        this.serializeArray().forEach(function(elm){
          result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
        })
        return result.join('&')
      }

      $.fn.submit = function(callback) {
        if (callback) this.bind('submit', callback)
        else if (this.length) {
          var event = $.Event('submit')
          this.eq(0).trigger(event)
          if (!event.isDefaultPrevented()) this.get(0).submit()
        }
        return this
      }

    })(Zepto)

    ;(function($){
      // __proto__ doesn't exist on IE<11, so redefine
      // the Z function to use object extension instead
      if (!('__proto__' in {})) {
        $.extend($.zepto, {
          Z: function(dom, selector){
            dom = dom || []
            $.extend(dom, $.fn)
            dom.selector = selector || ''
            dom.__Z = true
            return dom
          },
          // this is a kludge but works
          isZ: function(object){
            return $.type(object) === 'array' && '__Z' in object
          }
        })
      }

      // getComputedStyle shouldn't freak out when called
      // without a valid element as argument
      try {
        getComputedStyle(undefined)
      } catch(e) {
        var nativeGetComputedStyle = getComputedStyle;
        window.getComputedStyle = function(element, pseudoElement){
          try {
            return nativeGetComputedStyle(element, pseudoElement)
          } catch(e) {
            return null
          }
        }
      }
    })(Zepto)


  TL.getJSON = Zepto.getJSON;
	TL.ajax = Zepto.ajax;
})(TL)

//     Based on https://github.com/madrobby/zepto/blob/5585fe00f1828711c04208372265a5d71e3238d1/src/ajax.js
//     Zepto.js
//     (c) 2010-2012 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.
/*
Copyright (c) 2010-2012 Thomas Fuchs
http://zeptojs.com

Permission is hereby granted, free of charge, to any person obtaining a copy 
of this software and associated documentation files (the "Software"), to deal 
in the Software without restriction, including without limitation the rights 
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
copies of the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all 
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
SOFTWARE.
*/


/* **********************************************
     Begin TL.Class.js
********************************************** */

/*	TL.Class
	Class powers the OOP facilities of the library.
================================================== */
TL.Class = function () {};

TL.Class.extend = function (/*Object*/ props) /*-> Class*/ {
 
	// extended class with the new prototype
	var NewClass = function () {
		if (this.initialize) {
			this.initialize.apply(this, arguments);
		}
	};

	// instantiate class without calling constructor
	var F = function () {};
	F.prototype = this.prototype;
	var proto = new F();

	proto.constructor = NewClass;
	NewClass.prototype = proto;

	// add superclass access
	NewClass.superclass = this.prototype;

	// add class name
	//proto.className = props;

	//inherit parent's statics
	for (var i in this) {
		if (this.hasOwnProperty(i) && i !== 'prototype' && i !== 'superclass') {
			NewClass[i] = this[i];
		}
	}

	// mix static properties into the class
	if (props.statics) {
		TL.Util.extend(NewClass, props.statics);
		delete props.statics;
	}

	// mix includes into the prototype
	if (props.includes) {
		TL.Util.extend.apply(null, [proto].concat(props.includes));
		delete props.includes;
	}

	// merge options
	if (props.options && proto.options) {
		props.options = TL.Util.extend({}, proto.options, props.options);
	}

	// mix given properties into the prototype
	TL.Util.extend(proto, props);

	// allow inheriting further
	NewClass.extend = TL.Class.extend;

	// method for adding properties to prototype
	NewClass.include = function (props) {
		TL.Util.extend(this.prototype, props);
	};

	return NewClass;
};


/* **********************************************
     Begin TL.Events.js
********************************************** */

/*	TL.Events
	adds custom events functionality to TL classes
================================================== */
TL.Events = {
	addEventListener: function (/*String*/ type, /*Function*/ fn, /*(optional) Object*/ context) {
		var events = this._tl_events = this._tl_events || {};
		events[type] = events[type] || [];
		events[type].push({
			action: fn,
			context: context || this
		});
		return this;
	},

	hasEventListeners: function (/*String*/ type) /*-> Boolean*/ {
		var k = '_tl_events';
		return (k in this) && (type in this[k]) && (this[k][type].length > 0);
	},

	removeEventListener: function (/*String*/ type, /*Function*/ fn, /*(optional) Object*/ context) {
		if (!this.hasEventListeners(type)) {
			return this;
		}

		for (var i = 0, events = this._tl_events, len = events[type].length; i < len; i++) {
			if (
				(events[type][i].action === fn) &&
				(!context || (events[type][i].context === context))
			) {
				events[type].splice(i, 1);
				return this;
			}
		}
		return this;
	},

	fireEvent: function (/*String*/ type, /*(optional) Object*/ data) {
		if (!this.hasEventListeners(type)) {
			return this;
		}

		var event = TL.Util.mergeData({
			type: type,
			target: this
		}, data);

		var listeners = this._tl_events[type].slice();

		for (var i = 0, len = listeners.length; i < len; i++) {
			listeners[i].action.call(listeners[i].context || this, event);
		}

		return this;
	}
};

TL.Events.on	= TL.Events.addEventListener;
TL.Events.off	= TL.Events.removeEventListener;
TL.Events.fire = TL.Events.fireEvent;


/* **********************************************
     Begin TL.Browser.js
********************************************** */

/*
	Based on Leaflet Browser
	TL.Browser handles different browser and feature detections for internal  use.
*/


(function() {

	var ua = navigator.userAgent.toLowerCase(),
		doc = document.documentElement,

		ie = 'ActiveXObject' in window,

		webkit = ua.indexOf('webkit') !== -1,
		phantomjs = ua.indexOf('phantom') !== -1,
		android23 = ua.search('android [23]') !== -1,

		mobile = typeof orientation !== 'undefined',
		msPointer = navigator.msPointerEnabled && navigator.msMaxTouchPoints && !window.PointerEvent,
		pointer = (window.PointerEvent && navigator.pointerEnabled && navigator.maxTouchPoints) || msPointer,

		ie3d = ie && ('transition' in doc.style),
		webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !android23,
		gecko3d = 'MozPerspective' in doc.style,
		opera3d = 'OTransition' in doc.style,
		opera = window.opera;


	var retina = 'devicePixelRatio' in window && window.devicePixelRatio > 1;

	if (!retina && 'matchMedia' in window) {
		var matches = window.matchMedia('(min-resolution:144dpi)');
		retina = matches && matches.matches;
	}

	var touch = !window.L_NO_TOUCH && !phantomjs && (pointer || 'ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch));

	TL.Browser = {
		ie: ie,
		ua: ua,
		ie9: Boolean(ie && ua.match(/MSIE 9/i)),
		ielt9: ie && !document.addEventListener,
		webkit: webkit,
		//gecko: (ua.indexOf('gecko') !== -1) && !webkit && !window.opera && !ie,
		firefox: (ua.indexOf('gecko') !== -1) && !webkit && !window.opera && !ie,
		android: ua.indexOf('android') !== -1,
		android23: android23,
		chrome: ua.indexOf('chrome') !== -1,
		edge: ua.indexOf('edge/') !== -1,

		ie3d: ie3d,
		webkit3d: webkit3d,
		gecko3d: gecko3d,
		opera3d: opera3d,
		any3d: !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d || opera3d) && !phantomjs,

		mobile: mobile,
		mobileWebkit: mobile && webkit,
		mobileWebkit3d: mobile && webkit3d,
		mobileOpera: mobile && window.opera,

		touch: !! touch,
		msPointer: !! msPointer,
		pointer: !! pointer,

		retina: !! retina,
		orientation: function() {
			var w = window.innerWidth,
				h = window.innerHeight,
				_orientation = "portrait";

			if (w > h) {
				_orientation = "landscape";
			}
			if (Math.abs(window.orientation) == 90) {
				//_orientation = "landscape";
			}
			trace(_orientation);
			return _orientation;
		}
	};

}());


/* **********************************************
     Begin TL.Load.js
********************************************** */

/*	TL.Load
	Loads External Javascript and CSS
================================================== */

TL.Load = (function (doc) {
	var loaded	= [];
	
	function isLoaded(url) {
		
		var i			= 0,
			has_loaded	= false;
		
		for (i = 0; i < loaded.length; i++) {
			if (loaded[i] == url) {
				has_loaded = true;
			}
		}
		
		if (has_loaded) {
			return true;
		} else {
			loaded.push(url);
			return false;
		}
		
	}
	
	return {
		
		css: function (urls, callback, obj, context) {
			if (!isLoaded(urls)) {
				TL.LoadIt.css(urls, callback, obj, context);
			} else {
				callback();
			}
		},

		js: function (urls, callback, obj, context) {
			if (!isLoaded(urls)) {
				TL.LoadIt.js(urls, callback, obj, context);
			} else {
				callback();
			}
		}
    };
	
})(this.document);


/*jslint browser: true, eqeqeq: true, bitwise: true, newcap: true, immed: true, regexp: false */

/*
LazyLoad makes it easy and painless to lazily load one or more external
JavaScript or CSS files on demand either during or after the rendering of a web
page.

Supported browsers include Firefox 2+, IE6+, Safari 3+ (including Mobile
Safari), Google Chrome, and Opera 9+. Other browsers may or may not work and
are not officially supported.

Visit https://github.com/rgrove/lazyload/ for more info.

Copyright (c) 2011 Ryan Grove <ryan@wonko.com>
All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

@module lazyload
@class LazyLoad
@static
@version 2.0.3 (git)
*/

TL.LoadIt = (function (doc) {
  // -- Private Variables ------------------------------------------------------

  // User agent and feature test information.
  var env,

  // Reference to the <head> element (populated lazily).
  head,

  // Requests currently in progress, if any.
  pending = {},

  // Number of times we've polled to check whether a pending stylesheet has
  // finished loading. If this gets too high, we're probably stalled.
  pollCount = 0,

  // Queued requests.
  queue = {css: [], js: []},

  // Reference to the browser's list of stylesheets.
  styleSheets = doc.styleSheets;

  // -- Private Methods --------------------------------------------------------

  /**
  Creates and returns an HTML element with the specified name and attributes.

  @method createNode
  @param {String} name element name
  @param {Object} attrs name/value mapping of element attributes
  @return {HTMLElement}
  @private
  */
  function createNode(name, attrs) {
    var node = doc.createElement(name), attr;

    for (attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        node.setAttribute(attr, attrs[attr]);
      }
    }

    return node;
  }

  /**
  Called when the current pending resource of the specified type has finished
  loading. Executes the associated callback (if any) and loads the next
  resource in the queue.

  @method finish
  @param {String} type resource type ('css' or 'js')
  @private
  */
  function finish(type) {
    var p = pending[type],
        callback,
        urls;

    if (p) {
      callback = p.callback;
      urls     = p.urls;

      urls.shift();
      pollCount = 0;

      // If this is the last of the pending URLs, execute the callback and
      // start the next request in the queue (if any).
      if (!urls.length) {
        callback && callback.call(p.context, p.obj);
        pending[type] = null;
        queue[type].length && load(type);
      }
    }
  }

  /**
  Populates the <code>env</code> variable with user agent and feature test
  information.

  @method getEnv
  @private
  */
  function getEnv() {
    var ua = navigator.userAgent;

    env = {
      // True if this browser supports disabling async mode on dynamically
      // created script nodes. See
      // http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
      async: doc.createElement('script').async === true
    };

    (env.webkit = /AppleWebKit\//.test(ua))
      || (env.ie = /MSIE/.test(ua))
      || (env.opera = /Opera/.test(ua))
      || (env.gecko = /Gecko\//.test(ua))
      || (env.unknown = true);
  }

  /**
  Loads the specified resources, or the next resource of the specified type
  in the queue if no resources are specified. If a resource of the specified
  type is already being loaded, the new request will be queued until the
  first request has been finished.

  When an array of resource URLs is specified, those URLs will be loaded in
  parallel if it is possible to do so while preserving execution order. All
  browsers support parallel loading of CSS, but only Firefox and Opera
  support parallel loading of scripts. In other browsers, scripts will be
  queued and loaded one at a time to ensure correct execution order.

  @method load
  @param {String} type resource type ('css' or 'js')
  @param {String|Array} urls (optional) URL or array of URLs to load
  @param {Function} callback (optional) callback function to execute when the
    resource is loaded
  @param {Object} obj (optional) object to pass to the callback function
  @param {Object} context (optional) if provided, the callback function will
    be executed in this object's context
  @private
  */
  function load(type, urls, callback, obj, context) {
    var _finish = function () { finish(type); },
        isCSS   = type === 'css',
        nodes   = [],
        i, len, node, p, pendingUrls, url;

    env || getEnv();

    if (urls) {
      // If urls is a string, wrap it in an array. Otherwise assume it's an
      // array and create a copy of it so modifications won't be made to the
      // original.
      urls = typeof urls === 'string' ? [urls] : urls.concat();

      // Create a request object for each URL. If multiple URLs are specified,
      // the callback will only be executed after all URLs have been loaded.
      //
      // Sadly, Firefox and Opera are the only browsers capable of loading
      // scripts in parallel while preserving execution order. In all other
      // browsers, scripts must be loaded sequentially.
      //
      // All browsers respect CSS specificity based on the order of the link
      // elements in the DOM, regardless of the order in which the stylesheets
      // are actually downloaded.
      if (isCSS || env.async || env.gecko || env.opera) {
        // Load in parallel.
        queue[type].push({
          urls    : urls,
          callback: callback,
          obj     : obj,
          context : context
        });
      } else {
        // Load sequentially.
        for (i = 0, len = urls.length; i < len; ++i) {
          queue[type].push({
            urls    : [urls[i]],
            callback: i === len - 1 ? callback : null, // callback is only added to the last URL
            obj     : obj,
            context : context
          });
        }
      }
    }

    // If a previous load request of this type is currently in progress, we'll
    // wait our turn. Otherwise, grab the next item in the queue.
    if (pending[type] || !(p = pending[type] = queue[type].shift())) {
      return;
    }

    head || (head = doc.head || doc.getElementsByTagName('head')[0]);
    pendingUrls = p.urls;

    for (i = 0, len = pendingUrls.length; i < len; ++i) {
      url = pendingUrls[i];

      if (isCSS) {
          node = env.gecko ? createNode('style') : createNode('link', {
            href: url,
            rel : 'stylesheet'
          });
      } else {
        node = createNode('script', {src: url});
        node.async = false;
      }

      node.className = 'lazyload';
      node.setAttribute('charset', 'utf-8');

      if (env.ie && !isCSS) {
        node.onreadystatechange = function () {
          if (/loaded|complete/.test(node.readyState)) {
            node.onreadystatechange = null;
            _finish();
          }
        };
      } else if (isCSS && (env.gecko || env.webkit)) {
        // Gecko and WebKit don't support the onload event on link nodes.
        if (env.webkit) {
          // In WebKit, we can poll for changes to document.styleSheets to
          // figure out when stylesheets have loaded.
          p.urls[i] = node.href; // resolve relative URLs (or polling won't work)
          pollWebKit();
        } else {
          // In Gecko, we can import the requested URL into a <style> node and
          // poll for the existence of node.sheet.cssRules. Props to Zach
          // Leatherman for calling my attention to this technique.
          node.innerHTML = '@import "' + url + '";';
          pollGecko(node);
        }
      } else {
        node.onload = node.onerror = _finish;
      }

      nodes.push(node);
    }

    for (i = 0, len = nodes.length; i < len; ++i) {
      head.appendChild(nodes[i]);
    }
  }

  /**
  Begins polling to determine when the specified stylesheet has finished loading
  in Gecko. Polling stops when all pending stylesheets have loaded or after 10
  seconds (to prevent stalls).

  Thanks to Zach Leatherman for calling my attention to the @import-based
  cross-domain technique used here, and to Oleg Slobodskoi for an earlier
  same-domain implementation. See Zach's blog for more details:
  http://www.zachleat.com/web/2010/07/29/load-css-dynamically/

  @method pollGecko
  @param {HTMLElement} node Style node to poll.
  @private
  */
  function pollGecko(node) {
    var hasRules;

    try {
      // We don't really need to store this value or ever refer to it again, but
      // if we don't store it, Closure Compiler assumes the code is useless and
      // removes it.
      hasRules = !!node.sheet.cssRules;
    } catch (ex) {
      // An exception means the stylesheet is still loading.
      pollCount += 1;

      if (pollCount < 200) {
        setTimeout(function () { pollGecko(node); }, 50);
      } else {
        // We've been polling for 10 seconds and nothing's happened. Stop
        // polling and finish the pending requests to avoid blocking further
        // requests.
        hasRules && finish('css');
      }

      return;
    }

    // If we get here, the stylesheet has loaded.
    finish('css');
  }

  /**
  Begins polling to determine when pending stylesheets have finished loading
  in WebKit. Polling stops when all pending stylesheets have loaded or after 10
  seconds (to prevent stalls).

  @method pollWebKit
  @private
  */
  function pollWebKit() {
    var css = pending.css, i;

    if (css) {
      i = styleSheets.length;

      // Look for a stylesheet matching the pending URL.
      while (--i >= 0) {
        if (styleSheets[i].href === css.urls[0]) {
          finish('css');
          break;
        }
      }

      pollCount += 1;

      if (css) {
        if (pollCount < 200) {
          setTimeout(pollWebKit, 50);
        } else {
          // We've been polling for 10 seconds and nothing's happened, which may
          // indicate that the stylesheet has been removed from the document
          // before it had a chance to load. Stop polling and finish the pending
          // request to prevent blocking further requests.
          finish('css');
        }
      }
    }
  }

  return {

    /**
    Requests the specified CSS URL or URLs and executes the specified
    callback (if any) when they have finished loading. If an array of URLs is
    specified, the stylesheets will be loaded in parallel and the callback
    will be executed after all stylesheets have finished loading.

    @method css
    @param {String|Array} urls CSS URL or array of CSS URLs to load
    @param {Function} callback (optional) callback function to execute when
      the specified stylesheets are loaded
    @param {Object} obj (optional) object to pass to the callback function
    @param {Object} context (optional) if provided, the callback function
      will be executed in this object's context
    @static
    */
    css: function (urls, callback, obj, context) {
      load('css', urls, callback, obj, context);
    },

    /**
    Requests the specified JavaScript URL or URLs and executes the specified
    callback (if any) when they have finished loading. If an array of URLs is
    specified and the browser supports it, the scripts will be loaded in
    parallel and the callback will be executed after all scripts have
    finished loading.

    Currently, only Firefox and Opera support parallel loading of scripts while
    preserving execution order. In other browsers, scripts will be
    queued and loaded one at a time to ensure correct execution order.

    @method js
    @param {String|Array} urls JS URL or array of JS URLs to load
    @param {Function} callback (optional) callback function to execute when
      the specified scripts are loaded
    @param {Object} obj (optional) object to pass to the callback function
    @param {Object} context (optional) if provided, the callback function
      will be executed in this object's context
    @static
    */
    js: function (urls, callback, obj, context) {
      load('js', urls, callback, obj, context);
    }

  };
})(this.document);


/* **********************************************
     Begin TL.TimelineConfig.js
********************************************** */

/*  TL.TimelineConfig
separate the configuration from the display (TL.Timeline)
to make testing easier
================================================== */
TL.TimelineConfig = TL.Class.extend({

	includes: [],
	initialize: function (data) {
		this.title = '';
		this.scale = '';
		this.events = [];
		this.eras = [];
		this.event_dict = {}; // despite name, all slides (events + title) indexed by slide.unique_id
		this.messages = {
			errors: [],
			warnings: []
		};

		// Initialize the data
		if (typeof data === 'object' && data.events) {
			this.scale = data.scale;
			this.events = [];
			this._ensureValidScale(data.events);

			if (data.title) {
				var title_id = this._assignID(data.title);
				this._tidyFields(data.title);
				this.title = data.title;
				this.event_dict[title_id] = this.title;
			}

			for (var i = 0; i < data.events.length; i++) {
				try {
					this.addEvent(data.events[i], true);
				} catch (e) {
				    this.logError(e);
				}
			}

			if (data.eras) {
				for (var i = 0; i < data.eras.length; i++) {
					try {
						this.addEra(data.eras[i], true);
					} catch (e) {
						this.logError("Era " + i + ": " + e);
					}
				}
			}

			TL.DateUtil.sortByDate(this.events);
			TL.DateUtil.sortByDate(this.eras);

		}
	},
	logError: function(msg) {
		trace(msg);
		this.messages.errors.push(msg);
	},
	/*
	 * Return any accumulated error messages. If `sep` is passed, it should be a string which will be used to join all messages, resulting in a string return value. Otherwise,
	 * errors will be returned as an array.
	 */
	getErrors: function(sep) {
		if (sep) {
			return this.messages.errors.join(sep);
		} else {
			return this.messages.errors;
		}
	},
	/*
	 * Perform any sanity checks we can before trying to use this to make a timeline. Returns nothing, but errors will be logged
	 * such that after this is called, one can test `this.isValid()` to see if everything is OK.
	 */
	validate: function() {
		if (typeof(this.events) == "undefined" || typeof(this.events.length) == "undefined" || this.events.length == 0) {
			this.logError("Timeline configuration has no events.")
		}

		// make sure all eras have start and end dates
		for (var i = 0; i < this.eras.length; i++) {
			if (typeof(this.eras[i].start_date) == 'undefined' || typeof(this.eras[i].end_date) == 'undefined') {
				var era_identifier;
				if (this.eras[i].text && this.eras[i].text.headline) {
					era_identifier = this.eras[i].text.headline
				} else {
					era_identifier = "era " + (i+1);
				}
				this.logError("All eras must have start and end dates. [" + era_identifier + "]") // add internationalization (I18N) and context
			}
		};
	},

	isValid: function() {
		return this.messages.errors.length == 0;
	},
	/* Add an event (including cleaning/validation) and return the unique id.
	* All event data validation should happen in here.
	* Throws: TL.Error for any validation problems.
	*/
	addEvent: function(data, defer_sort) {
		var event_id = this._assignID(data);

		if (typeof(data.start_date) == 'undefined') {
		    throw new TL.Error("missing_start_date_err", event_id);
		} else {
			this._processDates(data);
			this._tidyFields(data);
		}

		this.events.push(data);
		this.event_dict[event_id] = data;

		if (!defer_sort) {
			TL.DateUtil.sortByDate(this.events);
		}
		return event_id;
	},

	addEra: function(data, defer_sort) {
		var event_id = this._assignID(data);

		if (typeof(data.start_date) == 'undefined') {
		    throw new TL.Error("missing_start_date_err", event_id);
		} else {
			this._processDates(data);
			this._tidyFields(data);
		}

		this.eras.push(data);
		this.event_dict[event_id] = data;

		if (!defer_sort) {
			TL.DateUtil.sortByDate(this.eras);
		}
		return event_id;
	},

	/**
	 * Given a slide, verify that its ID is unique, or assign it one which is.
	 * The assignment happens in this function, and the assigned ID is also
	 * the return value. Not thread-safe, because ids are not reserved
	 * when assigned here.
	 */
	_assignID: function(slide) {
		var slide_id = slide.unique_id;
		if (!TL.Util.trim(slide_id)) {
			// give it an ID if it doesn't have one
			slide_id = (slide.text) ? TL.Util.slugify(slide.text.headline) : null;
		}
		// make sure it's unique and add it.
		slide.unique_id = TL.Util.ensureUniqueKey(this.event_dict,slide_id);
		return slide.unique_id
	},

	/**
	 * Given an array of slide configs (the events), ensure that each one has a distinct unique_id. The id of the title
	 * is also passed in because in most ways it functions as an event slide, and the event IDs must also all be unique
	 * from the title ID.
	 */
	_makeUniqueIdentifiers: function(title_id, array) {
		var used = [title_id];

		// establish which IDs are assigned and if any appear twice, clear out successors.
		for (var i = 0; i < array.length; i++) {
			if (TL.Util.trim(array[i].unique_id)) {
				array[i].unique_id = TL.Util.slugify(array[i].unique_id); // enforce valid
				if (used.indexOf(array[i].unique_id) == -1) {
					used.push(array[i].unique_id);
				} else { // it was already used, wipe it out
					array[i].unique_id = '';
				}
			}
		};

		if (used.length != (array.length + 1)) {
			// at least some are yet to be assigned
			for (var i = 0; i < array.length; i++) {
				if (!array[i].unique_id) {
					// use the headline for the unique ID if it's available
					var slug = (array[i].text) ? TL.Util.slugify(array[i].text.headline) : null;
					if (!slug) {
						slug = TL.Util.unique_ID(6); // or generate a random ID
					}
					if (used.indexOf(slug) != -1) {
						slug = slug + '-' + i; // use the index to get a unique ID.
					}
					used.push(slug);
					array[i].unique_id = slug;
				}
			}
		}
	},
	_ensureValidScale: function(events) {
		if(!this.scale) {
			trace("Determining scale dynamically");
			this.scale = "human"; // default to human unless there's a slide which is explicitly 'cosmological' or one which has a cosmological year

			for (var i = 0; i < events.length; i++) {
				if (events[i].scale == 'cosmological') {
					this.scale = 'cosmological';
					break;
				}
				if (events[i].start_date && typeof(events[i].start_date.year) != "undefined") {
					var d = new TL.BigDate(events[i].start_date);
					var year = d.data.date_obj.year;
					if(year < -271820 || year >  275759) {
						this.scale = "cosmological";
						break;
					}
				}
			}
		}
		var dateCls = TL.DateUtil.SCALE_DATE_CLASSES[this.scale];
		if (!dateCls) { this.logError("Don't know how to process dates on scale "+this.scale); }
	},
	/*
	   Given a thing which has a start_date and optionally an end_date, make sure that it is an instance
		 of the correct date class (for human or cosmological scale). For slides, remove redundant end dates
		 (people frequently configure an end date which is the same as the start date).
	 */
	_processDates: function(slide_or_era) {
		var dateCls = TL.DateUtil.SCALE_DATE_CLASSES[this.scale];
		if(!(slide_or_era.start_date instanceof dateCls)) {
			var start_date = slide_or_era.start_date;
			slide_or_era.start_date = new dateCls(start_date);

			// eliminate redundant end dates.
			if (typeof(slide_or_era.end_date) != 'undefined' && !(slide_or_era.end_date instanceof dateCls)) {
				var end_date = slide_or_era.end_date;
				var equal = true;
				for (property in start_date) {
					equal = equal && (start_date[property] == end_date[property]);
				}
				if (equal) {
					trace("End date same as start date is redundant; dropping end date");
					delete slide_or_era.end_date;
				} else {
					slide_or_era.end_date = new dateCls(end_date);
				}

			}
		}

	},
	/**
	 * Return the earliest date that this config knows about, whether it's a slide or an era
	 */
	getEarliestDate: function() {
		// counting that dates were sorted in initialization
		var date = this.events[0].start_date;
		if (this.eras && this.eras.length > 0) {
			if (this.eras[0].start_date.isBefore(date)) {
				return this.eras[0].start_date;
			}
		}
		return date;

	},
	/**
	 * Return the latest date that this config knows about, whether it's a slide or an era, taking end_dates into account.
	 */
	getLatestDate: function() {
		var dates = [];
		for (var i = 0; i < this.events.length; i++) {
			if (this.events[i].end_date) {
				dates.push({ date: this.events[i].end_date });
			} else {
				dates.push({ date: this.events[i].start_date });
			}
		}
		for (var i = 0; i < this.eras.length; i++) {
			if (this.eras[i].end_date) {
				dates.push({ date: this.eras[i].end_date });
			} else {
				dates.push({ date: this.eras[i].start_date });
			}
		}
		TL.DateUtil.sortByDate(dates, 'date');
		return dates.slice(-1)[0].date;
	},
	_tidyFields: function(slide) {

		function fillIn(obj,key,default_value) {
			if (!default_value) default_value = '';
			if (!obj.hasOwnProperty(key)) { obj[key] = default_value }
		}

		if (slide.group) {
			slide.group = TL.Util.trim(slide.group);
		}

		if (!slide.text) {
			slide.text = {};
		}
		fillIn(slide.text,'text');
		fillIn(slide.text,'headline');
	}
});


/* **********************************************
     Begin TL.ConfigFactory.js
********************************************** */

/* TL.ConfigFactory.js
 * Build TimelineConfig objects from other data sources
 */
;(function(TL){
    /*
     * Convert a URL to a Google Spreadsheet (typically a /pubhtml version but somewhat flexible) into an object with the spreadsheet key (ID) and worksheet ID.

     If `url` is actually a string which is only letters, numbers, '-' and '_', then it's assumed to be an ID already. If we had a more precise way of testing to see if the input argument was a valid key, we might apply it, but I don't know where that's documented.

     If we're pretty sure this isn't a bare key or a url that could be used to find a Google spreadsheet then return null.
     */
    function parseGoogleSpreadsheetURL(url) {
        parts = {
            key: null,
            worksheet: 0 // not really sure how to use this to get the feed for that sheet, so this is not ready except for first sheet right now
        }
        // key as url parameter (old-fashioned)
        var key_pat = /\bkey=([-_A-Za-z0-9]+)&?/i;
        var url_pat = /docs.google.com\/spreadsheets(.*?)\/d\//; // fixing issue of URLs with u/0/d

        if (url.match(key_pat)) {
            parts.key = url.match(key_pat)[1];
            // can we get a worksheet from this form?
        } else if (url.match(url_pat)) {
            var pos = url.search(url_pat) + url.match(url_pat)[0].length;
            var tail = url.substr(pos);
            parts.key = tail.split('/')[0]
            if (url.match(/\?gid=(\d+)/)) {
                parts.worksheet = url.match(/\?gid=(\d+)/)[1];
            }
        } else if (url.match(/^\b[-_A-Za-z0-9]+$/)) {
            parts.key = url;
        }

        if (parts.key) {
            return parts;
        } else {
            return null;
        }
    }

    function extractGoogleEntryData_V1(item) {
        var item_data = {}
        for (k in item) {
            if (k.indexOf('gsx$') == 0) {
                item_data[k.substr(4)] = item[k].$t;
            }
        }
        if (TL.Util.isEmptyObject(item_data)) return null;
        var d = {
            media: {
                caption: item_data.mediacaption || '',
                credit: item_data.mediacredit || '',
                url: item_data.media || '',
                thumbnail: item_data.mediathumbnail || ''
            },
            text: {
                headline: item_data.headline || '',
                text: item_data.text || ''
            },
            group: item_data.tag || '',
            type: item_data.type || ''
        }
        if (item_data.startdate) {
            d['start_date'] = TL.Date.parseDate(item_data.startdate);
        }
        if (item_data.enddate) {
            d['end_date'] = TL.Date.parseDate(item_data.enddate);
        }


        return d;
    }

    function extractGoogleEntryData_V3(item) {

        function clean_integer(s) {
            if (s) {
                return s.replace(/[\s,]+/g,''); // doesn't handle '.' as comma separator, but how to distinguish that from decimal separator?
            }
        }

        var item_data = {}
        for (k in item) {
            if (k.indexOf('gsx$') == 0) {
                item_data[k.substr(4)] = TL.Util.trim(item[k].$t);
            }
        }
        if (TL.Util.isEmptyObject(item_data)) return null;
        var d = {
            media: {
                caption: item_data.mediacaption || '',
                credit: item_data.mediacredit || '',
                url: item_data.media || '',
                thumbnail: item_data.mediathumbnail || ''
            },
            text: {
                headline: item_data.headline || '',
                text: item_data.text || ''
            },
            start_date: {
                year: clean_integer(item_data.year),
                month: clean_integer(item_data.month) || '',
                day: clean_integer(item_data.day) || ''
            },
            end_date: {
                year: clean_integer(item_data.endyear) || '',
                month: clean_integer(item_data.endmonth) || '',
                day: clean_integer(item_data.endday) || ''
            },
            display_date: item_data.displaydate || '',

            type: item_data.type || ''
        }

        if (item_data.time) {
            TL.Util.mergeData(d.start_date,TL.DateUtil.parseTime(item_data.time));
        }

        if (item_data.endtime) {
            TL.Util.mergeData(d.end_date,TL.DateUtil.parseTime(item_data.endtime));
        }


        if (item_data.group) {
            d.group = item_data.group;
        }

        if (d.end_date.year == '') {
            var bad_date = d.end_date;
            delete d.end_date;
            if (bad_date.month != '' || bad_date.day != '' || bad_date.time != '') {
                var label = d.text.headline ||
                trace("Invalid end date for spreadsheet row. Must have a year if any other date fields are specified.");
                trace(item);
            }
        }

        if (item_data.background) {
            if (item_data.background.match(/^(https?:)?\/\/?/)) { // support http, https, protocol relative, site relative
                d['background'] = { 'url': item_data.background }
            } else { // for now we'll trust it's a color
                d['background'] = { 'color': item_data.background }
            }
        }

        return d;
    }

    

    var getGoogleItemExtractor = function(data) {
        if (typeof data.feed.entry === 'undefined'
                || data.feed.entry.length == 0) {
            throw new TL.Error("empty_feed_err");
        }
        var entry = data.feed.entry[0];

        if (typeof entry.gsx$startdate !== 'undefined') {
            // check headers V1
            // var headers_V1 = ['startdate', 'enddate', 'headline','text','media','mediacredit','mediacaption','mediathumbnail','media','type','tag'];
            // for (var i = 0; i < headers_V1.length; i++) {
            //     if (typeof entry['gsx$' + headers_V1[i]] == 'undefined') {
            //         throw new TL.Error("invalid_data_format_err");
            //     }
            // }
            return extractGoogleEntryData_V1;
        } else if (typeof entry.gsx$year !== 'undefined') {
            // check rest of V3 headers
            var headers_V3 = ['month', 'day', 'time', 'endmonth', 'endyear', 'endday', 'endtime', 'displaydate', 'headline','text','media','mediacredit','mediacaption','mediathumbnail','type','group','background'];
            // for (var i = 0; i < headers_V3.length; i++) {
            //     if (typeof entry['gsx$' + headers_V3[i]] == 'undefined') {
            //         throw new TL.Error("invalid_data_format_err");
            //     }
            // }
            return extractGoogleEntryData_V3;
        }
        throw new TL.Error("invalid_data_format_err");
    }

    var buildGoogleFeedURL = function(key, api_version) {
        if (api_version == 'v4') {
            return "https://sheets.googleapis.com/v4/spreadsheets/" + key + "/values/A1:R1000?key=AIzaSyCInR0kjJJ2Co6aQAXjLBQ14CEHam3K0xg";
        } else {
            return "https://spreadsheets.google.com/feeds/list/" + key + "/1/public/values?alt=json";
        }
    }

    var jsonFromGoogleURL = function(google_url) {
        var api_version = 'v3';
        var parts = parseGoogleSpreadsheetURL(google_url);
        if (parts && parts.key) {
            var spreadsheet_key = parts.key;
        } else {
            throw new TL.Error('invalid_url_err', google_url);
        }

        var url = buildGoogleFeedURL(spreadsheet_key, api_version);

        var response = TL.ajax({
            url: url,
            async: false
        });
        
        // tricky because errors can be in the response object or in the parsed data...

        if (response.status != 200) {
            console.log("Error fetching data " + api_version + ": " + response.status + " - " + response.statusText);
            api_version = 'v4';
            var url = buildGoogleFeedURL(spreadsheet_key, api_version);
            console.log("trying v4 - " + google_url);
            var response = TL.ajax({
                url: url,
                async: false
            });

            if (response.status == 403) {
                throw new TL.Error('invalid_url_share_required');
            } else if (response.status != 200) {
                var msg = "Error fetching data " + api_version + ": " + response.status + " - " + response.statusText;
                console.log(msg);
                throw new TL.Error("google_error", msg);
            }
        } 


        var data = JSON.parse(response.responseText);

        if (data.error) {
            var msg = "Error fetching data " + api_version + ": " + response.status + " - " + response.statusText;
            console.log(msg);
            console.log(data.error);
            throw new TL.Error("google_error", msg);
        }

        return googleFeedJSONtoTimelineJSON(data);
    }

    function extractGoogleEntryData_V4(column, item) {
        function clean_integer(s) {
            if (s) {
                return s.replace(/[\s,]+/g,''); // doesn't handle '.' as comma separator, but how to distinguish that from decimal separator?
            }
        }
        // console.log(item);
        var item_data = {};
        for (var i = 1; i < item.length; i++) {
            if (column.length >= i) {
                var column_name = column[i].toLowerCase().replace(" ", "");
                item_data[column_name] = item[i];
            }
           
        }

        var event = {
            media: {
                caption: item_data.mediacaption || '',
                credit: item_data.mediacredit || '',
                url: item_data.media || '',
                thumbnail: item_data.mediathumbnail || ''
            },
            text: {
                headline: item_data.headline || '',
                text: item_data.text || ''
            },
            start_date: {
                year: clean_integer(item[0]),
                month: clean_integer(item[1]) || '',
                day: clean_integer(item[2]) || ''
            },
            end_date: {
                year: clean_integer(item_data.endyear) || '',
                month: clean_integer(item_data.endmonth) || '',
                day: clean_integer(item_data.endday) || ''
            },
            display_date: item_data.displaydate || '',

            type: item_data.type || ''
        }


        if (item_data.time) {
            TL.Util.mergeData(event.start_date,TL.DateUtil.parseTime(item[3]));
        }

        if (item_data.endtime) {
            TL.Util.mergeData(event.end_date,TL.DateUtil.parseTime(item_data.endtime));
        }

        if (item_data.group) {
            event.group = item_data.group;
        }

        if (event.end_date.year == '') {
            var bad_date = event.end_date;
            delete event.end_date;
            if (bad_date.month != '' || bad_date.day != '' || bad_date.time != '') {
                var label = event.text.headline ||
                trace("Invalid end date for spreadsheet row. Must have a year if any other date fields are specified.");
                trace(item);
            }
        }

        if (item_data.background) {
            if (item_data.background.match(/^(https?:)?\/\/?/)) { // support http, https, protocol relative, site relative
                event['background'] = { 'url': item_data.background }
            } else { // for now we'll trust it's a color
                event['background'] = { 'color': item_data.background }
            }
        }

        return event;
    }

    var googleFeedJSONtoTimelineJSON = function(data) {
        var timeline_config = { 'events': [], 'errors': [], 'warnings': [], 'eras': [] }
        
        if (data.values) {
            // Google Sheets API v4
            for (var i = 1; i < data.values.length; i++) {
                var event = extractGoogleEntryData_V4(data.values[0], data.values[i]);
                if (event) { // blank rows return null
                    var row_type = 'event';
                    if (typeof (event.type) != 'undefined') {
                        row_type = event.type;
                        delete event.type;
                    }
                    if (row_type == 'title') {
                        if (!timeline_config.title) {
                            timeline_config.title = event;
                        } else {
                            timeline_config.warnings.push("Multiple title slides detected.");
                            timeline_config.events.push(event);
                        }
                    } else if (row_type == 'era') {
                        timeline_config.eras.push(event);
                    } else {
                        timeline_config.events.push(event);
                    }
                }
            }
        } else {

            // Google Sheets API v3 
            var extract = getGoogleItemExtractor(data);
            for (var i = 0; i < data.feed.entry.length; i++) {
                try {
                    var event = extract(data.feed.entry[i]);
                    if (event) { // blank rows return null
                    var row_type = 'event';
                    if (typeof(event.type) != 'undefined') {
                        row_type = event.type;
                        delete event.type;
                    }
                    if (row_type == 'title') {
                        if (!timeline_config.title) {
                        timeline_config.title = event;
                        } else {
                        timeline_config.warnings.push("Multiple title slides detected.");
                        timeline_config.events.push(event);
                        }
                    } else if (row_type == 'era') {
                        timeline_config.eras.push(event);
                    } else {
                        timeline_config.events.push(event);
                    }
                    }
                } catch(e) {
                    if (e.message) {
                        e = e.message;
                    }
                    timeline_config.errors.push(e + " ["+ i +"]");
                }
            };

        }

        return timeline_config;

    }

    var makeConfig = function(url, callback) {
        var tc,
            key = parseGoogleSpreadsheetURL(url);

        if (key) {
            try {
                var json = jsonFromGoogleURL(url);
            } catch(e) {
                tc = new TL.TimelineConfig();
                if (e.name == 'NetworkError') {
                    tc.logError(new TL.Error("network_err"));
                } else if(e.name == 'TL.Error') {
                    tc.logError(e);
                } else {
                    tc.logError(new TL.Error("unknown_read_err", e.name));
                }
                callback(tc);
                return;
            }
            tc = new TL.TimelineConfig(json);
            if (json.errors) {
                for (var i = 0; i < json.errors.length; i++) {
                    tc.logError(json.errors[i]);
                };
            }
            callback(tc);
        } else {
          TL.ajax({
            url: url,
            dataType: 'json',
            success: function(data){
            try {
                tc = new TL.TimelineConfig(data);
            } catch(e) {
                tc = new TL.TimelineConfig();
                tc.logError(e);
            }
            callback(tc);
            },
            error: function(xhr, errorType, error) {
              tc = new TL.TimelineConfig();
              if (errorType == 'parsererror') {
                var error = new TL.Error("invalid_url_err");
              } else {
                var error = new TL.Error("unknown_read_err", errorType)
              }
              tc.logError(error);
              callback(tc);
            }
          });

        }
    }

    TL.ConfigFactory = {
        // export for unit testing and use by authoring tool
        parseGoogleSpreadsheetURL: parseGoogleSpreadsheetURL,
        // export for unit testing
        googleFeedJSONtoTimelineJSON: googleFeedJSONtoTimelineJSON,


        fromGoogle: function(url) {
            console.warn("TL.ConfigFactory.fromGoogle is deprecated and will be removed soon. Use TL.ConfigFactory.makeConfig(url,callback)")
            return jsonFromGoogleURL(url);

        },

        /*
         * Given a URL to a Timeline data source, read the data, create a TimelineConfig
         * object, and call the given `callback` function passing the created config as
         * the only argument. This should be the main public interface to getting configs
         * from any kind of URL, Google or direct JSON.
         */
        makeConfig: makeConfig,
    }
})(TL)


/* **********************************************
     Begin TL.Language.js
********************************************** */

TL.Language = function(options) {
	// borrowed from http://stackoverflow.com/a/14446414/102476
	for (k in TL.Language.languages.en) {
		this[k] = TL.Language.languages.en[k];
	}
	if (options && options.language && typeof(options.language) == 'string' && options.language != 'en') {
		var code = options.language;
		if (!(code in TL.Language.languages)) {
			if (/\.json$/.test(code)) {
				var url = code;
			} else {
				var fragment = "/locale/" + code + ".json";
				var script_path = options.script_path || TL.Timeline.source_path;
				if (/\/$/.test(script_path)) { fragment = fragment.substr(1)}
				var url = script_path + fragment;
			}
			var self = this;
			var xhr = TL.ajax({
				url: url, async: false
			});
			if (xhr.status == 200) {
				TL.Language.languages[code] = JSON.parse(xhr.responseText);
			} else {
				throw "Could not load language [" + code + "]: " + xhr.statusText;
			}
		}
		TL.Util.mergeData(this,TL.Language.languages[code]);

	}
}

TL.Language.formatNumber = function(val,mask) {
		if (mask.match(/%(\.(\d+))?f/)) {
			var match = mask.match(/%(\.(\d+))?f/);
			var token = match[0];
			if (match[2]) {
				val = val.toFixed(match[2]);
			}
			return mask.replace(token,val);
		}
		// use mask as literal display value.
		return mask;
	}



/* TL.Util.mergeData is shallow, we have nested dicts.
   This is a simplistic handling but should work.
 */
TL.Language.prototype.mergeData = function(lang_json) {
	for (k in TL.Language.languages.en) {
		if (lang_json[k]) {
			if (typeof(this[k]) == 'object') {
				TL.Util.mergeData(lang_json[k], this[k]);
			} else {
				this[k] = lang_json[k]; // strings, mostly
			}
		}
	}
}

TL.Language.fallback = { messages: {} }; // placeholder to satisfy IE8 early compilation
TL.Language.prototype.getMessage = function(k) {
	return this.messages[k] || TL.Language.fallback.messages[k] || k;
}

TL.Language.prototype._ = TL.Language.prototype.getMessage; // keep it concise

TL.Language.prototype.formatDate = function(date, format_name) {

	if (date.constructor == Date) {
		return this.formatJSDate(date, format_name);
	}

	if (date.constructor == TL.BigYear) {
		return this.formatBigYear(date, format_name);
	}

	if (date.data && date.data.date_obj) {
		return this.formatDate(date.data.date_obj, format_name);
	}

	trace("Unfamiliar date presented for formatting");
	return date.toString();
}

TL.Language.prototype.formatBigYear = function(bigyear, format_name) {
	var the_year = bigyear.year;
	var format_list = this.bigdateformats[format_name] || this.bigdateformats['fallback'];

	if (format_list) {
		for (var i = 0; i < format_list.length; i++) {
			var tuple = format_list[i];
			if (Math.abs(the_year / tuple[0]) > 1) {
				// will we ever deal with distant future dates?
				return TL.Language.formatNumber(Math.abs(the_year / tuple[0]),tuple[1])
			}
		};

		return the_year.toString();

	} else {
	    trace("Language file dateformats missing cosmological. Falling back.");
	    return TL.Language.formatNumber(the_year,format_name);
	}
}

TL.Language.prototype.formatJSDate = function(js_date, format_name) {
	// ultimately we probably want this to work with TL.Date instead of (in addition to?) JS Date
	// utc, timezone and timezoneClip are carry over from Steven Levithan implementation. We probably aren't going to use them.
	var self = this;
	var formatPeriod = function(fmt, value) {
		var formats = self.period_labels[fmt];
		if (formats) {
			var fmt = (value < 12) ? formats[0] : formats[1];
		}
		return "<span class='tl-timeaxis-timesuffix'>" + fmt + "</span>";
	}

	var utc = false,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g;


	if (!format_name) {
		format_name = 'full';
	}

	var mask = this.dateformats[format_name] || TL.Language.fallback.dateformats[format_name];
	if (!mask) {
		mask = format_name; // allow custom format strings
	}


	var	_ = utc ? "getUTC" : "get",
		d = js_date[_ + "Date"](),
		D = js_date[_ + "Day"](),
		m = js_date[_ + "Month"](),
		y = js_date[_ + "FullYear"](),
		H = js_date[_ + "Hours"](),
		M = js_date[_ + "Minutes"](),
		s = js_date[_ + "Seconds"](),
		L = js_date[_ + "Milliseconds"](),
		o = utc ? 0 : js_date.getTimezoneOffset(),
		year = "",
		flags = {
			d:    d,
			dd:   TL.Util.pad(d),
			ddd:  this.date.day_abbr[D],
			dddd: this.date.day[D],
			m:    m + 1,
			mm:   TL.Util.pad(m + 1),
			mmm:  this.date.month_abbr[m],
			mmmm: this.date.month[m],
			yy:   String(y).slice(2),
			yyyy: (y < 0 && this.has_negative_year_modifier()) ? Math.abs(y) : y,
			h:    H % 12 || 12,
			hh:   TL.Util.pad(H % 12 || 12),
			H:    H,
			HH:   TL.Util.pad(H),
			M:    M,
			MM:   TL.Util.pad(M),
			s:    s,
			ss:   TL.Util.pad(s),
			l:    TL.Util.pad(L, 3),
			L:    TL.Util.pad(L > 99 ? Math.round(L / 10) : L),
			t:    formatPeriod('t',H),
			tt:   formatPeriod('tt',H),
			T:    formatPeriod('T',H),
			TT:   formatPeriod('TT',H),
			Z:    utc ? "UTC" : (String(js_date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
			o:    (o > 0 ? "-" : "+") + TL.Util.pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
			S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
		};

		var formatted = mask.replace(TL.Language.DATE_FORMAT_TOKENS, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});

		return this._applyEra(formatted, y);
}

TL.Language.prototype.has_negative_year_modifier = function() {
	return Boolean(this.era_labels.negative_year.prefix || this.era_labels.negative_year.suffix);
}


TL.Language.prototype._applyEra = function(formatted_date, original_year) {
	// trusts that the formatted_date was property created with a non-negative year if there are
	// negative affixes to be applied
	var labels = (original_year < 0) ? this.era_labels.negative_year : this.era_labels.positive_year;
	var result = '';
	if (labels.prefix) { result += '<span>' + labels.prefix + '</span> ' }
	result += formatted_date;
	if (labels.suffix) { result += ' <span>' + labels.suffix + '</span>' }
	return result;
}


TL.Language.DATE_FORMAT_TOKENS = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g;

TL.Language.languages = {
/*
	This represents the canonical list of message keys which translation files should handle. The existence of the 'en.json' file should not mislead you.
	It is provided more as a starting point for someone who wants to provide a
	new translation since the form for non-default languages (JSON not JS) is slightly different from what appears below. Also, those files have some message keys grandfathered in from TimelineJS2 which we'd rather not have to
	get "re-translated" if we use them.
*/
	en: {
		name: 					"English",
		lang: 					"en",
        api: {
            wikipedia:          "en" // the two letter code at the beginning of the Wikipedia subdomain for this language
        },
		messages: {
			loading: 			            		  "Loading",
			wikipedia: 			            		"From Wikipedia, the free encyclopedia",
			error: 				            			"Error",
      contract_timeline:              "Contract Timeline",
      return_to_title:                "Return to Title",
      loading_content:                "Loading Content",
      expand_timeline:                "Expand Timeline",
      loading_timeline:               "Loading Timeline... ",
      swipe_to_navigate:              "Swipe to Navigate<br><span class='tl-button'>OK</span>",
      unknown_read_err:               "An unexpected error occurred trying to read your spreadsheet data",
			invalid_url_err: 								"Unable to read Timeline data. Make sure your URL is for a Google Spreadsheet or a Timeline JSON file.",
			invalid_url_share_required:			"Because of unexpected changes to Google's data access API, the creator of this timeline must enable 'anyone with the url can read' access for this spreadsheet. See timeline.knightlab.com for more information.",
      network_err:                    "Unable to read your Google Spreadsheet. Make sure you have published it to the web.",
      empty_feed_err:                 "No data entries found",
      missing_start_date_err:         "Missing start_date",
      invalid_data_format_err:        "Header row has been modified.",
      date_compare_err:               "Can't compare TL.Dates on different scales",
      invalid_scale_err:              "Invalid scale",
      invalid_date_err:               "Invalid date: month, day and year must be numbers.",
      invalid_separator_error:        "Invalid time: misuse of : or . as separator.",
      invalid_hour_err:               "Invalid time (hour)",
      invalid_minute_err:             "Invalid time (minute)",
      invalid_second_err:             "Invalid time (second)",
      invalid_fractional_err:         "Invalid time (fractional seconds)",
      invalid_second_fractional_err:  "Invalid time (seconds and fractional seconds)",
      invalid_year_err:               "Invalid year",
      flickr_notfound_err:            "Photo not found or private",
      flickr_invalidurl_err:          "Invalid Flickr URL",
      imgur_invalidurl_err:           "Invalid Imgur URL",
      twitter_invalidurl_err:         "Invalid Twitter URL",
      twitter_load_err:               "Unable to load Tweet",
      twitterembed_invalidurl_err:    "Invalid Twitter Embed url",
      wikipedia_load_err:             "Unable to load Wikipedia entry",
      youtube_invalidurl_err:         "Invalid YouTube URL",
      spotify_invalid_url:            "Invalid Spotify URL",
      template_value_err:             "No value provided for variable",
      invalid_rgb_err:                "Invalid RGB argument",
      time_scale_scale_err:           "Don't know how to get date from time for scale",
      axis_helper_no_options_err:     "Axis helper must be configured with options",
      axis_helper_scale_err:          "No AxisHelper available for scale",
      invalid_integer_option:       	"Invalid option value—must be a whole number."
		},
		date: {
      month: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      month_abbr: ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."],
      day: ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      day_abbr: ["Sun.","Mon.", "Tues.", "Wed.", "Thurs.", "Fri.", "Sat."]
		},
		era_labels: { // specify prefix or suffix to apply to formatted date. Blanks mean no change.
	        positive_year: {
	        	prefix: '',
	        	suffix: ''
	        },
	        negative_year: { // if either of these is specified, the year will be converted to positive before they are applied
	        	prefix: '',
	        	suffix: 'BCE'
	        }
        },
        period_labels: {  // use of t/tt/T/TT legacy of original Timeline date format
			t: ['a', 'p'],
			tt: ['am', 'pm'],
			T: ['A', 'P'],
			TT: ['AM', 'PM']
		},
		dateformats: {
			year: "yyyy",
			month_short: "mmm",
			month: "mmmm yyyy",
			full_short: "mmm d",
			full: "mmmm d',' yyyy",
			time: "h:MM:ss TT' <small>'mmmm d',' yyyy'</small>'",
			time_short: "h:MM:ss TT",
			time_no_seconds_short: "h:MM TT",
			time_no_minutes_short: "h TT",
			time_no_seconds_small_date: "h:MM TT' <small>'mmmm d',' yyyy'</small>'",
			time_milliseconds: "l",
			full_long: "mmm d',' yyyy 'at' h:MM TT",
			full_long_small_date: "h:MM TT' <small>mmm d',' yyyy'</small>'"
		},
		bigdateformats: {
			fallback: [ // a list of tuples, with t[0] an order of magnitude and t[1] a format string. format string syntax may change...
				[1000000000,"%.2f billion years ago"],
				[1000000,"%.1f million years ago"],
				[1000,"%.1f thousand years ago"],
				[1, "%f years ago"]
			],
		    compact: [
				[1000000000,"%.2f bya"],
				[1000000,"%.1f mya"],
				[1000,"%.1f kya"],
				[1, "%f years ago"]
			],
		    verbose: [
				[1000000000,"%.2f billion years ago"],
				[1000000,"%.1f million years ago"],
				[1000,"%.1f thousand years ago"],
				[1, "%f years ago"]
			]
		}
	}
}

TL.Language.fallback = new TL.Language();


/* **********************************************
     Begin TL.I18NMixins.js
********************************************** */

/*  TL.I18NMixins
    assumes that its class has an options object with a TL.Language instance    
================================================== */
TL.I18NMixins = {
    getLanguage: function() {
        if (this.options && this.options.language) {
            return this.options.language;
        }
        trace("Expected a language option");
        return TL.Language.fallback;
    },

    _: function(msg) {
        return this.getLanguage()._(msg);
    }
}


/* **********************************************
     Begin TL.Ease.js
********************************************** */

/* The equations defined here are open source under BSD License.
 * http://www.robertpenner.com/easing_terms_of_use.html (c) 2003 Robert Penner
 * Adapted to single time-based by
 * Brian Crescimanno <brian.crescimanno@gmail.com>
 * Ken Snyder <kendsnyder@gmail.com>
 */

/** MIT License
 *
 * KeySpline - use bezier curve for transition easing function
 * Copyright (c) 2012 Gaetan Renaudeau <renaudeau.gaetan@gmail.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
/**
 * KeySpline - use bezier curve for transition easing function
 * is inspired from Firefox's nsSMILKeySpline.cpp
 * Usage:
 * var spline = new KeySpline(0.25, 0.1, 0.25, 1.0)
 * spline.get(x) => returns the easing value | x must be in [0, 1] range
 */

TL.Easings = {
    ease:        [0.25, 0.1, 0.25, 1.0], 
    linear:      [0.00, 0.0, 1.00, 1.0],
    easein:     [0.42, 0.0, 1.00, 1.0],
    easeout:    [0.00, 0.0, 0.58, 1.0],
    easeinout: [0.42, 0.0, 0.58, 1.0]
};

TL.Ease = {
	KeySpline: function(a) {
	//KeySpline: function(mX1, mY1, mX2, mY2) {
		this.get = function(aX) {
			if (a[0] == a[1] && a[2] == a[3]) return aX; // linear
			return CalcBezier(GetTForX(aX), a[1], a[3]);
		}

		function A(aA1, aA2) {
			return 1.0 - 3.0 * aA2 + 3.0 * aA1;
		}

		function B(aA1, aA2) {
			return 3.0 * aA2 - 6.0 * aA1;
		}

		function C(aA1) {
			return 3.0 * aA1;
		}

		// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.

		function CalcBezier(aT, aA1, aA2) {
			return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
		}

		// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.

		function GetSlope(aT, aA1, aA2) {
			return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
		}

		function GetTForX(aX) {
			// Newton raphson iteration
			var aGuessT = aX;
			for (var i = 0; i < 4; ++i) {
				var currentSlope = GetSlope(aGuessT, a[0], a[2]);
				if (currentSlope == 0.0) return aGuessT;
				var currentX = CalcBezier(aGuessT, a[0], a[2]) - aX;
				aGuessT -= currentX / currentSlope;
			}
			return aGuessT;
		}
	},
	
	easeInSpline: function(t) {
		var spline = new TL.Ease.KeySpline(TL.Easings.easein);
		return spline.get(t);
	},
	
	easeInOutExpo: function(t) {
		var spline = new TL.Ease.KeySpline(TL.Easings.easein);
		return spline.get(t);
	},
	
	easeOut: function(t) {
		return Math.sin(t * Math.PI / 2);
	},
	easeOutStrong: function(t) {
		return (t == 1) ? 1 : 1 - Math.pow(2, - 10 * t);
	},
	easeIn: function(t) {
		return t * t;
	},
	easeInStrong: function(t) {
		return (t == 0) ? 0 : Math.pow(2, 10 * (t - 1));
	},
	easeOutBounce: function(pos) {
		if ((pos) < (1 / 2.75)) {
			return (7.5625 * pos * pos);
		} else if (pos < (2 / 2.75)) {
			return (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75);
		} else if (pos < (2.5 / 2.75)) {
			return (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375);
		} else {
			return (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375);
		}
	},
	easeInBack: function(pos) {
		var s = 1.70158;
		return (pos) * pos * ((s + 1) * pos - s);
	},
	easeOutBack: function(pos) {
		var s = 1.70158;
		return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1;
	},
	bounce: function(t) {
		if (t < (1 / 2.75)) {
			return 7.5625 * t * t;
		}
		if (t < (2 / 2.75)) {
			return 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75;
		}
		if (t < (2.5 / 2.75)) {
			return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375;
		}
		return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375;
	},
	bouncePast: function(pos) {
		if (pos < (1 / 2.75)) {
			return (7.5625 * pos * pos);
		} else if (pos < (2 / 2.75)) {
			return 2 - (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75);
		} else if (pos < (2.5 / 2.75)) {
			return 2 - (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375);
		} else {
			return 2 - (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375);
		}
	},
	swingTo: function(pos) {
		var s = 1.70158;
		return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
	},
	swingFrom: function(pos) {
		var s = 1.70158;
		return pos * pos * ((s + 1) * pos - s);
	},
	elastic: function(pos) {
		return -1 * Math.pow(4, - 8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
	},
	spring: function(pos) {
		return 1 - (Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6));
	},
	blink: function(pos, blinks) {
		return Math.round(pos * (blinks || 5)) % 2;
	},
	pulse: function(pos, pulses) {
		return (-Math.cos((pos * ((pulses || 5) - .5) * 2) * Math.PI) / 2) + .5;
	},
	wobble: function(pos) {
		return (-Math.cos(pos * Math.PI * (9 * pos)) / 2) + 0.5;
	},
	sinusoidal: function(pos) {
		return (-Math.cos(pos * Math.PI) / 2) + 0.5;
	},
	flicker: function(pos) {
		var pos = pos + (Math.random() - 0.5) / 5;
		return easings.sinusoidal(pos < 0 ? 0 : pos > 1 ? 1 : pos);
	},
	mirror: function(pos) {
		if (pos < 0.5) return easings.sinusoidal(pos * 2);
		else return easings.sinusoidal(1 - (pos - 0.5) * 2);
	},
	// accelerating from zero velocity
	easeInQuad: function (t) { return t*t },
	// decelerating to zero velocity
	easeOutQuad: function (t) { return t*(2-t) },
	// acceleration until halfway, then deceleration
	easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
	// accelerating from zero velocity 
	easeInCubic: function (t) { return t*t*t },
	// decelerating to zero velocity 
	easeOutCubic: function (t) { return (--t)*t*t+1 },
	// acceleration until halfway, then deceleration 
	easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
	// accelerating from zero velocity 
	easeInQuart: function (t) { return t*t*t*t },
	// decelerating to zero velocity 
	easeOutQuart: function (t) { return 1-(--t)*t*t*t },
	// acceleration until halfway, then deceleration
	easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
	// accelerating from zero velocity
	easeInQuint: function (t) { return t*t*t*t*t },
	// decelerating to zero velocity
	easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
	// acceleration until halfway, then deceleration 
	easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
};

/*
Math.easeInExpo = function (t, b, c, d) {
	return c * Math.pow( 2, 10 * (t/d - 1) ) + b;
};

		

// exponential easing out - decelerating to zero velocity


Math.easeOutExpo = function (t, b, c, d) {
	return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
};

		

// exponential easing in/out - accelerating until halfway, then decelerating


Math.easeInOutExpo = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
	t--;
	return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
};
*/

/* **********************************************
     Begin TL.Animate.js
********************************************** */

/*	TL.Animate
	Basic animation
================================================== */

TL.Animate = function(el, options) {
	var animation = new tlanimate(el, options),
		webkit_timeout;
		/*
		// POSSIBLE ISSUE WITH WEBKIT FUTURE BUILDS
	var onWebKitTimeout = function() {

		animation.stop(true);
	}
	if (TL.Browser.webkit) {
		webkit_timeout = setTimeout(function(){onWebKitTimeout()}, options.duration);
	}
	*/
	return animation;
};


/*	Based on: Morpheus
	https://github.com/ded/morpheus - (c) Dustin Diaz 2011
	License MIT
================================================== */
window.tlanimate = (function() {

	var doc = document,
		win = window,
		perf = win.performance,
		perfNow = perf && (perf.now || perf.webkitNow || perf.msNow || perf.mozNow),
		now = perfNow ? function () { return perfNow.call(perf) } : function () { return +new Date() },
		html = doc.documentElement,
		fixTs = false, // feature detected below
		thousand = 1000,
		rgbOhex = /^rgb\(|#/,
		relVal = /^([+\-])=([\d\.]+)/,
		numUnit = /^(?:[\+\-]=?)?\d+(?:\.\d+)?(%|in|cm|mm|em|ex|pt|pc|px)$/,
		rotate = /rotate\(((?:[+\-]=)?([\-\d\.]+))deg\)/,
		scale = /scale\(((?:[+\-]=)?([\d\.]+))\)/,
		skew = /skew\(((?:[+\-]=)?([\-\d\.]+))deg, ?((?:[+\-]=)?([\-\d\.]+))deg\)/,
		translate = /translate\(((?:[+\-]=)?([\-\d\.]+))px, ?((?:[+\-]=)?([\-\d\.]+))px\)/,
		// these elements do not require 'px'
		unitless = { lineHeight: 1, zoom: 1, zIndex: 1, opacity: 1, transform: 1};

  // which property name does this browser use for transform
	var transform = function () {
		var styles = doc.createElement('a').style,
			props = ['webkitTransform', 'MozTransform', 'OTransform', 'msTransform', 'Transform'],
			i;

		for (i = 0; i < props.length; i++) {
			if (props[i] in styles) return props[i]
		};
	}();

	// does this browser support the opacity property?
	var opacity = function () {
		return typeof doc.createElement('a').style.opacity !== 'undefined'
	}();

	// initial style is determined by the elements themselves
	var getStyle = doc.defaultView && doc.defaultView.getComputedStyle ?
	function (el, property) {
		property = property == 'transform' ? transform : property
		property = camelize(property)
		var value = null,
			computed = doc.defaultView.getComputedStyle(el, '');

		computed && (value = computed[property]);
		return el.style[property] || value;
	} : html.currentStyle ?

    function (el, property) {
		property = camelize(property)

		if (property == 'opacity') {
			var val = 100
			try {
				val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity
			} catch (e1) {
				try {
					val = el.filters('alpha').opacity
				} catch (e2) {

				}
			}
			return val / 100
		}
		var value = el.currentStyle ? el.currentStyle[property] : null
		return el.style[property] || value
	} :

    function (el, property) {
		return el.style[camelize(property)]
    }

  var frame = function () {
    // native animation frames
    // http://webstuff.nfshost.com/anim-timing/Overview.html
    // http://dev.chromium.org/developers/design-documents/requestanimationframe-implementation
    return win.requestAnimationFrame  ||
      win.webkitRequestAnimationFrame ||
      win.mozRequestAnimationFrame    ||
      win.msRequestAnimationFrame     ||
      win.oRequestAnimationFrame      ||
      function (callback) {
        win.setTimeout(function () {
          callback(+new Date())
        }, 17) // when I was 17..
      }
  }()

  var children = []

	frame(function(timestamp) {
	  	// feature-detect if rAF and now() are of the same scale (epoch or high-res),
		// if not, we have to do a timestamp fix on each frame
		fixTs = timestamp > 1e12 != now() > 1e12
	})

  function has(array, elem, i) {
    if (Array.prototype.indexOf) return array.indexOf(elem)
    for (i = 0; i < array.length; ++i) {
      if (array[i] === elem) return i
    }
  }

  function render(timestamp) {
    var i, count = children.length
    // if we're using a high res timer, make sure timestamp is not the old epoch-based value.
    // http://updates.html5rocks.com/2012/05/requestAnimationFrame-API-now-with-sub-millisecond-precision
    if (perfNow && timestamp > 1e12) timestamp = now()
	if (fixTs) timestamp = now()
    for (i = count; i--;) {
      children[i](timestamp)
    }
    children.length && frame(render)
  }

  function live(f) {
    if (children.push(f) === 1) frame(render)
  }

  function die(f) {
    var rest, index = has(children, f)
    if (index >= 0) {
      rest = children.slice(index + 1)
      children.length = index
      children = children.concat(rest)
    }
  }

  function parseTransform(style, base) {
    var values = {}, m
    if (m = style.match(rotate)) values.rotate = by(m[1], base ? base.rotate : null)
    if (m = style.match(scale)) values.scale = by(m[1], base ? base.scale : null)
    if (m = style.match(skew)) {values.skewx = by(m[1], base ? base.skewx : null); values.skewy = by(m[3], base ? base.skewy : null)}
    if (m = style.match(translate)) {values.translatex = by(m[1], base ? base.translatex : null); values.translatey = by(m[3], base ? base.translatey : null)}
    return values
  }

  function formatTransform(v) {
    var s = ''
    if ('rotate' in v) s += 'rotate(' + v.rotate + 'deg) '
    if ('scale' in v) s += 'scale(' + v.scale + ') '
    if ('translatex' in v) s += 'translate(' + v.translatex + 'px,' + v.translatey + 'px) '
    if ('skewx' in v) s += 'skew(' + v.skewx + 'deg,' + v.skewy + 'deg)'
    return s
  }

  function rgb(r, g, b) {
    return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)
  }

  // convert rgb and short hex to long hex
  function toHex(c) {
    var m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    return (m ? rgb(m[1], m[2], m[3]) : c)
      .replace(/#(\w)(\w)(\w)$/, '#$1$1$2$2$3$3') // short skirt to long jacket
  }

  // change font-size => fontSize etc.
  function camelize(s) {
    return s.replace(/-(.)/g, function (m, m1) {
      return m1.toUpperCase()
    })
  }

  // aren't we having it?
  function fun(f) {
    return typeof f == 'function'
  }

  function nativeTween(t) {
    // default to a pleasant-to-the-eye easeOut (like native animations)
    return Math.sin(t * Math.PI / 2)
  }

  /**
    * Core tween method that requests each frame
    * @param duration: time in milliseconds. defaults to 1000
    * @param fn: tween frame callback function receiving 'position'
    * @param done {optional}: complete callback function
    * @param ease {optional}: easing method. defaults to easeOut
    * @param from {optional}: integer to start from
    * @param to {optional}: integer to end at
    * @returns method to stop the animation
    */
  function tween(duration, fn, done, ease, from, to) {
    ease = fun(ease) ? ease : morpheus.easings[ease] || nativeTween
    var time = duration || thousand
      , self = this
      , diff = to - from
      , start = now()
      , stop = 0
      , end = 0

    function run(t) {
      var delta = t - start
      if (delta > time || stop) {
        to = isFinite(to) ? to : 1
        stop ? end && fn(to) : fn(to)
        die(run)
        return done && done.apply(self)
      }
      // if you don't specify a 'to' you can use tween as a generic delta tweener
      // cool, eh?
      isFinite(to) ?
        fn((diff * ease(delta / time)) + from) :
        fn(ease(delta / time))
    }

    live(run)

    return {
      stop: function (jump) {
        stop = 1
        end = jump // jump to end of animation?
        if (!jump) done = null // remove callback if not jumping to end
      }
    }
  }

  /**
    * generic bezier method for animating x|y coordinates
    * minimum of 2 points required (start and end).
    * first point start, last point end
    * additional control points are optional (but why else would you use this anyway ;)
    * @param points: array containing control points
       [[0, 0], [100, 200], [200, 100]]
    * @param pos: current be(tween) position represented as float  0 - 1
    * @return [x, y]
    */
  function bezier(points, pos) {
    var n = points.length, r = [], i, j
    for (i = 0; i < n; ++i) {
      r[i] = [points[i][0], points[i][1]]
    }
    for (j = 1; j < n; ++j) {
      for (i = 0; i < n - j; ++i) {
        r[i][0] = (1 - pos) * r[i][0] + pos * r[parseInt(i + 1, 10)][0]
        r[i][1] = (1 - pos) * r[i][1] + pos * r[parseInt(i + 1, 10)][1]
      }
    }
    return [r[0][0], r[0][1]]
  }

  // this gets you the next hex in line according to a 'position'
  function nextColor(pos, start, finish) {
    var r = [], i, e, from, to
    for (i = 0; i < 6; i++) {
      from = Math.min(15, parseInt(start.charAt(i),  16))
      to   = Math.min(15, parseInt(finish.charAt(i), 16))
      e = Math.floor((to - from) * pos + from)
      e = e > 15 ? 15 : e < 0 ? 0 : e
      r[i] = e.toString(16)
    }
    return '#' + r.join('')
  }

  // this retreives the frame value within a sequence
  function getTweenVal(pos, units, begin, end, k, i, v) {
    if (k == 'transform') {
      v = {}
      for (var t in begin[i][k]) {
        v[t] = (t in end[i][k]) ? Math.round(((end[i][k][t] - begin[i][k][t]) * pos + begin[i][k][t]) * thousand) / thousand : begin[i][k][t]
      }
      return v
    } else if (typeof begin[i][k] == 'string') {
      return nextColor(pos, begin[i][k], end[i][k])
    } else {
      // round so we don't get crazy long floats
      v = Math.round(((end[i][k] - begin[i][k]) * pos + begin[i][k]) * thousand) / thousand
      // some css properties don't require a unit (like zIndex, lineHeight, opacity)
      if (!(k in unitless)) v += units[i][k] || 'px'
      return v
    }
  }

  // support for relative movement via '+=n' or '-=n'
  function by(val, start, m, r, i) {
    return (m = relVal.exec(val)) ?
      (i = parseFloat(m[2])) && (start + (m[1] == '+' ? 1 : -1) * i) :
      parseFloat(val)
  }

  /**
    * morpheus:
    * @param element(s): HTMLElement(s)
    * @param options: mixed bag between CSS Style properties & animation options
    *  - {n} CSS properties|values
    *     - value can be strings, integers,
    *     - or callback function that receives element to be animated. method must return value to be tweened
    *     - relative animations start with += or -= followed by integer
    *  - duration: time in ms - defaults to 1000(ms)
    *  - easing: a transition method - defaults to an 'easeOut' algorithm
    *  - complete: a callback method for when all elements have finished
    *  - bezier: array of arrays containing x|y coordinates that define the bezier points. defaults to none
    *     - this may also be a function that receives element to be animated. it must return a value
    */
  function morpheus(elements, options) {
    var els = elements ? (els = isFinite(elements.length) ? elements : [elements]) : [], i
      , complete = options.complete
      , duration = options.duration
      , ease = options.easing
      , points = options.bezier
      , begin = []
      , end = []
      , units = []
      , bez = []
      , originalLeft
      , originalTop

    if (points) {
      // remember the original values for top|left
      originalLeft = options.left;
      originalTop = options.top;
      delete options.right;
      delete options.bottom;
      delete options.left;
      delete options.top;
    }

    for (i = els.length; i--;) {

      // record beginning and end states to calculate positions
      begin[i] = {}
      end[i] = {}
      units[i] = {}

      // are we 'moving'?
      if (points) {

        var left = getStyle(els[i], 'left')
          , top = getStyle(els[i], 'top')
          , xy = [by(fun(originalLeft) ? originalLeft(els[i]) : originalLeft || 0, parseFloat(left)),
                  by(fun(originalTop) ? originalTop(els[i]) : originalTop || 0, parseFloat(top))]

        bez[i] = fun(points) ? points(els[i], xy) : points
        bez[i].push(xy)
        bez[i].unshift([
          parseInt(left, 10),
          parseInt(top, 10)
        ])
      }

      for (var k in options) {
        switch (k) {
        case 'complete':
        case 'duration':
        case 'easing':
        case 'bezier':
          continue
        }
        var v = getStyle(els[i], k), unit
          , tmp = fun(options[k]) ? options[k](els[i]) : options[k]
        if (typeof tmp == 'string' &&
            rgbOhex.test(tmp) &&
            !rgbOhex.test(v)) {
          delete options[k]; // remove key :(
          continue; // cannot animate colors like 'orange' or 'transparent'
                    // only #xxx, #xxxxxx, rgb(n,n,n)
        }

        begin[i][k] = k == 'transform' ? parseTransform(v) :
          typeof tmp == 'string' && rgbOhex.test(tmp) ?
            toHex(v).slice(1) :
            parseFloat(v)
        end[i][k] = k == 'transform' ? parseTransform(tmp, begin[i][k]) :
          typeof tmp == 'string' && tmp.charAt(0) == '#' ?
            toHex(tmp).slice(1) :
            by(tmp, parseFloat(v));
        // record original unit
        (typeof tmp == 'string') && (unit = tmp.match(numUnit)) && (units[i][k] = unit[1])
      }
    }
    // ONE TWEEN TO RULE THEM ALL
    return tween.apply(els, [duration, function (pos, v, xy) {
      // normally not a fan of optimizing for() loops, but we want something
      // fast for animating
      for (i = els.length; i--;) {
        if (points) {
          xy = bezier(bez[i], pos)
          els[i].style.left = xy[0] + 'px'
          els[i].style.top = xy[1] + 'px'
        }
        for (var k in options) {
          v = getTweenVal(pos, units, begin, end, k, i)
          k == 'transform' ?
            els[i].style[transform] = formatTransform(v) :
            k == 'opacity' && !opacity ?
              (els[i].style.filter = 'alpha(opacity=' + (v * 100) + ')') :
              (els[i].style[camelize(k)] = v)
        }
      }
    }, complete, ease])
  }

  // expose useful methods
  morpheus.tween = tween
  morpheus.getStyle = getStyle
  morpheus.bezier = bezier
  morpheus.transform = transform
  morpheus.parseTransform = parseTransform
  morpheus.formatTransform = formatTransform
  morpheus.easings = {}

  return morpheus
})();


/* **********************************************
     Begin TL.Point.js
********************************************** */

/*	TL.Point
	Inspired by Leaflet
	TL.Point represents a point with x and y coordinates.
================================================== */

TL.Point = function (/*Number*/ x, /*Number*/ y, /*Boolean*/ round) {
	this.x = (round ? Math.round(x) : x);
	this.y = (round ? Math.round(y) : y);
};

TL.Point.prototype = {
	add: function (point) {
		return this.clone()._add(point);
	},

	_add: function (point) {
		this.x += point.x;
		this.y += point.y;
		return this;
	},

	subtract: function (point) {
		return this.clone()._subtract(point);
	},

	// destructive subtract (faster)
	_subtract: function (point) {
		this.x -= point.x;
		this.y -= point.y;
		return this;
	},

	divideBy: function (num, round) {
		return new TL.Point(this.x / num, this.y / num, round);
	},

	multiplyBy: function (num) {
		return new TL.Point(this.x * num, this.y * num);
	},

	distanceTo: function (point) {
		var x = point.x - this.x,
			y = point.y - this.y;
		return Math.sqrt(x * x + y * y);
	},

	round: function () {
		return this.clone()._round();
	},

	// destructive round
	_round: function () {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		return this;
	},

	clone: function () {
		return new TL.Point(this.x, this.y);
	},

	toString: function () {
		return 'Point(' +
				TL.Util.formatNum(this.x) + ', ' +
				TL.Util.formatNum(this.y) + ')';
	}
};

/* **********************************************
     Begin TL.DomMixins.js
********************************************** */

/*	TL.DomMixins
	DOM methods used regularly
	Assumes there is a _el.container and animator
================================================== */
TL.DomMixins = {
	
	/*	Adding, Hiding, Showing etc
	================================================== */
	show: function(animate) {
		if (animate) {
			/*
			this.animator = TL.Animate(this._el.container, {
				left: 		-(this._el.container.offsetWidth * n) + "px",
				duration: 	this.options.duration,
				easing: 	this.options.ease
			});
			*/
		} else {
			this._el.container.style.display = "block";
		}
	},
	
	hide: function(animate) {
		this._el.container.style.display = "none";
	},
	
	addTo: function(container) {
		container.appendChild(this._el.container);
		this.onAdd();
	},
	
	removeFrom: function(container) {
		container.removeChild(this._el.container);
		this.onRemove();
	},
	
	/*	Animate to Position
	================================================== */
	animatePosition: function(pos, el) {
		var ani = {
			duration: 	this.options.duration,
			easing: 	this.options.ease
		};
		for (var name in pos) {
			if (pos.hasOwnProperty(name)) {
				ani[name] = pos[name] + "px";
			}
		}
		
		if (this.animator) {
			this.animator.stop();
		}
		this.animator = TL.Animate(el, ani);
	},
	
	/*	Events
	================================================== */
	
	onLoaded: function() {
		this.fire("loaded", this.data);
	},
	
	onAdd: function() {
		this.fire("added", this.data);
	},

	onRemove: function() {
		this.fire("removed", this.data);
	},
	
	/*	Set the Position
	================================================== */
	setPosition: function(pos, el) {
		for (var name in pos) {
			if (pos.hasOwnProperty(name)) {
				if (el) {
					el.style[name] = pos[name] + "px";
				} else {
					this._el.container.style[name] = pos[name] + "px";
				};
			}
		}
	},
	
	getPosition: function() {
		return TL.Dom.getPosition(this._el.container);
	}
	
};


/* **********************************************
     Begin TL.Dom.js
********************************************** */

/*	TL.Dom
	Utilities for working with the DOM
================================================== */

TL.Dom = {

	get: function(id) {
		return (typeof id === 'string' ? document.getElementById(id) : id);
	},

	getByClass: function(id) {
		if (id) {
			return document.getElementsByClassName(id);
		}
	},

	create: function(tagName, className, container) {
		var el = document.createElement(tagName);
		el.className = className;
		if (container) {
			container.appendChild(el);
		}
		return el;
	},

	createText: function(content, container) {
		var el = document.createTextNode(content);
		if (container) {
			container.appendChild(el);
		}
		return el;
	},

	getTranslateString: function (point) {
		return TL.Dom.TRANSLATE_OPEN +
				point.x + 'px,' + point.y + 'px' +
				TL.Dom.TRANSLATE_CLOSE;
	},

	setPosition: function (el, point) {
		el._tl_pos = point;
		if (TL.Browser.webkit3d) {
			el.style[TL.Dom.TRANSFORM] =  TL.Dom.getTranslateString(point);

			if (TL.Browser.android) {
				el.style['-webkit-perspective'] = '1000';
				el.style['-webkit-backface-visibility'] = 'hidden';
			}
		} else {
			el.style.left = point.x + 'px';
			el.style.top = point.y + 'px';
		}
	},

	getPosition: function(el){
	    var pos = {
	    	x: 0,
			y: 0
	    }
	    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
	        pos.x += el.offsetLeft// - el.scrollLeft;
	        pos.y += el.offsetTop// - el.scrollTop;
	        el = el.offsetParent;
	    }
	    return pos;
	},

	testProp: function(props) {
		var style = document.documentElement.style;

		for (var i = 0; i < props.length; i++) {
			if (props[i] in style) {
				return props[i];
			}
		}
		return false;
	}

};

TL.Util.mergeData(TL.Dom, {
	TRANSITION: TL.Dom.testProp(['transition', 'webkitTransition', 'OTransition', 'MozTransition', 'msTransition']),
	TRANSFORM: TL.Dom.testProp(['transformProperty', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']),

	TRANSLATE_OPEN: 'translate' + (TL.Browser.webkit3d ? '3d(' : '('),
	TRANSLATE_CLOSE: TL.Browser.webkit3d ? ',0)' : ')'
});


/* **********************************************
     Begin TL.DomUtil.js
********************************************** */

/*	TL.DomUtil
	Inspired by Leaflet
	TL.DomUtil contains various utility functions for working with DOM
================================================== */


TL.DomUtil = {
	get: function (id) {
		return (typeof id === 'string' ? document.getElementById(id) : id);
	},

	getStyle: function (el, style) {
		var value = el.style[style];
		if (!value && el.currentStyle) {
			value = el.currentStyle[style];
		}
		if (!value || value === 'auto') {
			var css = document.defaultView.getComputedStyle(el, null);
			value = css ? css[style] : null;
		}
		return (value === 'auto' ? null : value);
	},

	getViewportOffset: function (element) {
		var top = 0,
			left = 0,
			el = element,
			docBody = document.body;

		do {
			top += el.offsetTop || 0;
			left += el.offsetLeft || 0;

			if (el.offsetParent === docBody &&
					TL.DomUtil.getStyle(el, 'position') === 'absolute') {
				break;
			}
			el = el.offsetParent;
		} while (el);

		el = element;

		do {
			if (el === docBody) {
				break;
			}

			top -= el.scrollTop || 0;
			left -= el.scrollLeft || 0;

			el = el.parentNode;
		} while (el);

		return new TL.Point(left, top);
	},

	create: function (tagName, className, container) {
		var el = document.createElement(tagName);
		el.className = className;
		if (container) {
			container.appendChild(el);
		}
		return el;
	},

	disableTextSelection: function () {
		if (document.selection && document.selection.empty) {
			document.selection.empty();
		}
		if (!this._onselectstart) {
			this._onselectstart = document.onselectstart;
			document.onselectstart = TL.Util.falseFn;
		}
	},

	enableTextSelection: function () {
		document.onselectstart = this._onselectstart;
		this._onselectstart = null;
	},

	hasClass: function (el, name) {
		return (el.className.length > 0) &&
				new RegExp("(^|\\s)" + name + "(\\s|$)").test(el.className);
	},

	addClass: function (el, name) {
		if (!TL.DomUtil.hasClass(el, name)) {
			el.className += (el.className ? ' ' : '') + name;
		}
	},

	removeClass: function (el, name) {
		el.className = el.className.replace(/(\S+)\s*/g, function (w, match) {
			if (match === name) {
				return '';
			}
			return w;
		}).replace(/^\s+/, '');
	},

	setOpacity: function (el, value) {
		if (TL.Browser.ie) {
			el.style.filter = 'alpha(opacity=' + Math.round(value * 100) + ')';
		} else {
			el.style.opacity = value;
		}
	},


	testProp: function (props) {
		var style = document.documentElement.style;

		for (var i = 0; i < props.length; i++) {
			if (props[i] in style) {
				return props[i];
			}
		}
		return false;
	},

	getTranslateString: function (point) {

		return TL.DomUtil.TRANSLATE_OPEN +
				point.x + 'px,' + point.y + 'px' +
				TL.DomUtil.TRANSLATE_CLOSE;
	},

	getScaleString: function (scale, origin) {
		var preTranslateStr = TL.DomUtil.getTranslateString(origin),
			scaleStr = ' scale(' + scale + ') ',
			postTranslateStr = TL.DomUtil.getTranslateString(origin.multiplyBy(-1));

		return preTranslateStr + scaleStr + postTranslateStr;
	},

	setPosition: function (el, point) {
		el._tl_pos = point;
		if (TL.Browser.webkit3d) {
			el.style[TL.DomUtil.TRANSFORM] =  TL.DomUtil.getTranslateString(point);

			if (TL.Browser.android) {
				el.style['-webkit-perspective'] = '1000';
				el.style['-webkit-backface-visibility'] = 'hidden';
			}
		} else {
			el.style.left = point.x + 'px';
			el.style.top = point.y + 'px';
		}
	},

	getPosition: function (el) {
		return el._tl_pos;
	}
};

/* **********************************************
     Begin TL.DomEvent.js
********************************************** */

/*	TL.DomEvent
	Inspired by Leaflet 
	DomEvent contains functions for working with DOM events.
================================================== */
// TODO stamp

TL.DomEvent = {
	/* inpired by John Resig, Dean Edwards and YUI addEvent implementations */
	addListener: function (/*HTMLElement*/ obj, /*String*/ type, /*Function*/ fn, /*Object*/ context) {
		var id = TL.Util.stamp(fn),
			key = '_tl_' + type + id;

		if (obj[key]) {
			return;
		}

		var handler = function (e) {
			return fn.call(context || obj, e || TL.DomEvent._getEvent());
		};

		if (TL.Browser.touch && (type === 'dblclick') && this.addDoubleTapListener) {
			this.addDoubleTapListener(obj, handler, id);
		} else if ('addEventListener' in obj) {
			if (type === 'mousewheel') {
				obj.addEventListener('DOMMouseScroll', handler, false);
				obj.addEventListener(type, handler, false);
			} else if ((type === 'mouseenter') || (type === 'mouseleave')) {
				var originalHandler = handler,
					newType = (type === 'mouseenter' ? 'mouseover' : 'mouseout');
				handler = function (e) {
					if (!TL.DomEvent._checkMouse(obj, e)) {
						return;
					}
					return originalHandler(e);
				};
				obj.addEventListener(newType, handler, false);
			} else {
				obj.addEventListener(type, handler, false);
			}
		} else if ('attachEvent' in obj) {
			obj.attachEvent("on" + type, handler);
		}

		obj[key] = handler;
	},

	removeListener: function (/*HTMLElement*/ obj, /*String*/ type, /*Function*/ fn) {
		var id = TL.Util.stamp(fn),
			key = '_tl_' + type + id,
			handler = obj[key];

		if (!handler) {
			return;
		}

		if (TL.Browser.touch && (type === 'dblclick') && this.removeDoubleTapListener) {
			this.removeDoubleTapListener(obj, id);
		} else if ('removeEventListener' in obj) {
			if (type === 'mousewheel') {
				obj.removeEventListener('DOMMouseScroll', handler, false);
				obj.removeEventListener(type, handler, false);
			} else if ((type === 'mouseenter') || (type === 'mouseleave')) {
				obj.removeEventListener((type === 'mouseenter' ? 'mouseover' : 'mouseout'), handler, false);
			} else {
				obj.removeEventListener(type, handler, false);
			}
		} else if ('detachEvent' in obj) {
			obj.detachEvent("on" + type, handler);
		}
		obj[key] = null;
	},

	_checkMouse: function (el, e) {
		var related = e.relatedTarget;

		if (!related) {
			return true;
		}

		try {
			while (related && (related !== el)) {
				related = related.parentNode;
			}
		} catch (err) {
			return false;
		}

		return (related !== el);
	},

	/*jshint noarg:false */ // evil magic for IE
	_getEvent: function () {
		var e = window.event;
		if (!e) {
			var caller = arguments.callee.caller;
			while (caller) {
				e = caller['arguments'][0];
				if (e && window.Event === e.constructor) {
					break;
				}
				caller = caller.caller;
			}
		}
		return e;
	},
	/*jshint noarg:false */

	stopPropagation: function (/*Event*/ e) {
		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}
	},
	
	// TODO TL.Draggable.START
	disableClickPropagation: function (/*HTMLElement*/ el) {
		TL.DomEvent.addListener(el, TL.Draggable.START, TL.DomEvent.stopPropagation);
		TL.DomEvent.addListener(el, 'click', TL.DomEvent.stopPropagation);
		TL.DomEvent.addListener(el, 'dblclick', TL.DomEvent.stopPropagation);
	},

	preventDefault: function (/*Event*/ e) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
	},

	stop: function (e) {
		TL.DomEvent.preventDefault(e);
		TL.DomEvent.stopPropagation(e);
	},


	getWheelDelta: function (e) {
		var delta = 0;
		if (e.wheelDelta) {
			delta = e.wheelDelta / 120;
		}
		if (e.detail) {
			delta = -e.detail / 3;
		}
		return delta;
	}
};




/* **********************************************
     Begin TL.StyleSheet.js
********************************************** */

/*	TL.StyleSheet
	Style Sheet Object
================================================== */

TL.StyleSheet = TL.Class.extend({
	
	includes: [TL.Events],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function() {
		// Borrowed from: http://davidwalsh.name/add-rules-stylesheets
		this.style = document.createElement("style");
		
		// WebKit hack :(
		this.style.appendChild(document.createTextNode(""));
		
		// Add the <style> element to the page
		document.head.appendChild(this.style);
		
		this.sheet = this.style.sheet;
		
	},
	
	addRule: function(selector, rules, index) {
		var _index = 0;
		
		if (index) {
			_index = index;
		}
		
		if("insertRule" in this.sheet) {
			this.sheet.insertRule(selector + "{" + rules + "}", _index);
		}
		else if("addRule" in this.sheet) {
			this.sheet.addRule(selector, rules, _index);
		}
	},
	

	/*	Events
	================================================== */
	onLoaded: function(error) {
		this._state.loaded = true;
		this.fire("loaded", this.data);
	}
	
});

/* **********************************************
     Begin TL.Date.js
********************************************** */

/*	TL.Date
	Date object
	MONTHS are 1-BASED, not 0-BASED (different from Javascript date objects)
================================================== */

//
// Class for human dates
//

TL.Date = TL.Class.extend({

    // @data = ms, JS Date object, or JS dictionary with date properties
	initialize: function (data, format, format_short) {
	    if (typeof(data) == 'number') {
			this.data = {
				format:     "yyyy mmmm",
				date_obj:   new Date(data)
			};
	    } else if(Date == data.constructor) {
			this.data = {
				format:     "yyyy mmmm",
				date_obj:   data
			};
	    } else {
	        this.data = JSON.parse(JSON.stringify(data)); // clone don't use by reference.
            this._createDateObj();
	    }

		this._setFormat(format, format_short);
    },

	setDateFormat: function(format) {
		this.data.format = format;
	},

	getDisplayDate: function(language, format) {
	    if (this.data.display_date) {
	        return this.data.display_date;
	    }
        if (!language) {
            language = TL.Language.fallback;
        }
        if (language.constructor != TL.Language) {
            trace("First argument to getDisplayDate must be TL.Language");
            language = TL.Language.fallback;
        }

        var format_key = format || this.data.format;
        return language.formatDate(this.data.date_obj, format_key);
	},

	getMillisecond: function() {
		return this.getTime();
	},

	getTime: function() {
		return this.data.date_obj.getTime();
	},

	isBefore: function(other_date) {
        if (!this.data.date_obj.constructor == other_date.data.date_obj.constructor) {
            throw new TL.Error("date_compare_err") // but should be able to compare 'cosmological scale' dates once we get to that...
        }
        if ('isBefore' in this.data.date_obj) {
            return this.data.date_obj['isBefore'](other_date.data.date_obj);
        }
        return this.data.date_obj < other_date.data.date_obj
	},

	isAfter: function(other_date) {
        if (!this.data.date_obj.constructor == other_date.data.date_obj.constructor) {
            throw new TL.Error("date_compare_err") // but should be able to compare 'cosmological scale' dates once we get to that...
        }
        if ('isAfter' in this.data.date_obj) {
            return this.data.date_obj['isAfter'](other_date.data.date_obj);
        }
        return this.data.date_obj > other_date.data.date_obj
	},

    // Return a new TL.Date which has been 'floored' at the given scale.
    // @scale = string value from TL.Date.SCALES
    floor: function(scale) {
        var d = new Date(this.data.date_obj.getTime());
        for (var i = 0; i < TL.Date.SCALES.length; i++) {
             // for JS dates, we iteratively apply flooring functions
            TL.Date.SCALES[i][2](d);
            if (TL.Date.SCALES[i][0] == scale) return new TL.Date(d);
        };

        throw new TL.Error("invalid_scale_err", scale);
    },

	/*	Private Methods
	================================================== */

    _getDateData: function() {
        var _date = {
            year: 			0,
            month: 			1, // stupid JS dates
            day: 			1,
            hour: 			0,
            minute: 		0,
            second: 		0,
            millisecond: 	0
		};

		// Merge data
		TL.Util.mergeData(_date, this.data);

 		// Make strings into numbers
		var DATE_PARTS = TL.Date.DATE_PARTS;

 		for (var ix in DATE_PARTS) {
 		    var x = TL.Util.trim(_date[DATE_PARTS[ix]]);
 		    if (!x.match(/^-?\d*$/)) {
 		        throw new TL.Error("invalid_date_err", DATE_PARTS[ix] + " = '" + _date[DATE_PARTS[ix]] + "'");
 		    }
 		    
			var parsed = parseInt(_date[DATE_PARTS[ix]]);
			if (isNaN(parsed)) {
                parsed = (ix == 4 || ix == 5) ? 1 : 0; // month and day have diff baselines
            }
			_date[DATE_PARTS[ix]] = parsed;
		}

		if (_date.month > 0 && _date.month <= 12) { // adjust for JS's weirdness
			_date.month = _date.month - 1;
		}

		return _date;
    },

	_createDateObj: function() {
	    var _date = this._getDateData();
        this.data.date_obj = new Date(_date.year, _date.month, _date.day, _date.hour, _date.minute, _date.second, _date.millisecond);
        if (this.data.date_obj.getFullYear() != _date.year) {
            // Javascript has stupid defaults for two-digit years
            this.data.date_obj.setFullYear(_date.year);
        }
	},

    /*  Find Best Format
     * this may not work with 'cosmologic' dates, or with TL.Date if we
     * support constructing them based on JS Date and time
    ================================================== */
    findBestFormat: function(variant) {
        var eval_array = TL.Date.DATE_PARTS,
            format = "";

        for (var i = 0; i < eval_array.length; i++) {
            if ( this.data[eval_array[i]]) {
                if (variant) {
                    if (!(variant in TL.Date.BEST_DATEFORMATS)) {
                        variant = 'short'; // legacy
                    }
                } else {
                    variant = 'base'
                }
                return TL.Date.BEST_DATEFORMATS[variant][eval_array[i]];
            }
        };
        return "";
    },
    _setFormat: function(format, format_short) {
		if (format) {
			this.data.format = format;
		} else if (!this.data.format) {
			this.data.format = this.findBestFormat();
		}

		if (format_short) {
			this.data.format_short = format_short;
		} else if (!this.data.format_short) {
			this.data.format_short = this.findBestFormat(true);
		}
    }
});

// offer something that can figure out the right date class to return
TL.Date.makeDate = function(data) {
    var date = new TL.Date(data);
    if (!isNaN(date.getTime())) {
        return date;
    }
    return new TL.BigDate(data);
}

TL.BigYear = TL.Class.extend({
    initialize: function (year) {
        this.year = parseInt(year);
        if (isNaN(this.year)) {
            throw new TL.Error('invalid_year_err', year);
        }
    },

    isBefore: function(that) {
        return this.year < that.year;
    },

    isAfter: function(that) {
        return this.year > that.year;
    },

    getTime: function() {
        return this.year;
    }
});

(function(cls){
    // human scales
    cls.SCALES = [ // ( name, units_per_tick, flooring function )
        ['millisecond',1, function(d) { }],
        ['second',1000, function(d) { d.setMilliseconds(0);}],
        ['minute',1000 * 60, function(d) { d.setSeconds(0);}],
        ['hour',1000 * 60 * 60, function(d) { d.setMinutes(0);}],
        ['day',1000 * 60 * 60 * 24, function(d) { d.setHours(0);}],
        ['month',1000 * 60 * 60 * 24 * 30, function(d) { d.setDate(1);}],
        ['year',1000 * 60 * 60 * 24 * 365, function(d) { d.setMonth(0);}],
        ['decade',1000 * 60 * 60 * 24 * 365 * 10, function(d) {
            var real_year = d.getFullYear();
            d.setFullYear( real_year - (real_year % 10))
        }],
        ['century',1000 * 60 * 60 * 24 * 365 * 100, function(d) {
            var real_year = d.getFullYear();
            d.setFullYear( real_year - (real_year % 100))
        }],
        ['millennium',1000 * 60 * 60 * 24 * 365 * 1000, function(d) {
            var real_year = d.getFullYear();
            d.setFullYear( real_year - (real_year % 1000))
        }]
    ];

    // Date parts from highest to lowest precision
    cls.DATE_PARTS = ["millisecond", "second", "minute", "hour", "day", "month", "year"];

    var ISO8601_SHORT_PATTERN = /^([\+-]?\d+?)(-\d{2}?)?(-\d{2}?)?$/;
    // regex below from
    // http://www.pelagodesign.com/blog/2009/05/20/iso-8601-date-validation-that-doesnt-suck/
    var ISO8601_PATTERN = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

    /* For now, rather than extract parts from regexp, lets trust the browser.
     * Famous last words...
     * What about UTC vs local time?
     * see also http://stackoverflow.com/questions/10005374/ecmascript-5-date-parse-results-for-iso-8601-test-cases
     */
    cls.parseISODate = function(str) {
        var d = new Date(str);
        if (isNaN(d)) {
            throw new TL.Error("invalid_date_err", str);
        }
        return {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            day: d.getDate(),
            hour: d.getHours(),
            minute: d.getMinutes(),
            second: d.getSeconds(),
            millisecond: d.getMilliseconds()
        }

    }

    cls.parseDate = function(str) {

        if (str.match(ISO8601_SHORT_PATTERN)) {
            // parse short specifically to avoid timezone offset confusion
            // most browsers assume short is UTC, not local time.
            var parts = str.match(ISO8601_SHORT_PATTERN).slice(1);
            var d = { year: parts[0].replace('+','')} // year can be negative
            if (parts[1]) { d['month'] = parts[1].replace('-',''); }
            if (parts[2]) { d['day'] = parts[2].replace('-',''); }
            return d;
        }

        if (str.match(ISO8601_PATTERN)) {
            return cls.parseISODate(str);
        }

        if (str.match(/^\-?\d+$/)) {
            return { year: str }
        }

        var parsed = {}
        if (str.match(/\d+\/\d+\/\d+/)) { // mm/yy/dddd
            var date = str.match(/\d+\/\d+\/\d+/)[0];
            str = TL.Util.trim(str.replace(date,''));
            var date_parts = date.split('/');
            parsed.month = date_parts[0];
            parsed.day = date_parts[1];
            parsed.year = date_parts[2];
        }

        if (str.match(/\d+\/\d+/)) { // mm/yy
            var date = str.match(/\d+\/\d+/)[0];
            str = TL.Util.trim(str.replace(date,''));
            var date_parts = date.split('/');
            parsed.month = date_parts[0];
            parsed.year = date_parts[1];
        }
        // todo: handle hours, minutes, seconds, millis other date formats, etc...
        if (str.match(':')) {
            var time_parts = str.split(':');
            parsed.hour = time_parts[0];
            parsed.minute = time_parts[1];
            if (time_parts[2]) {
                second_parts = time_parts[2].split('.');
                parsed.second = second_parts[0];
                parsed.millisecond = second_parts[1];
            }
        }
        return parsed;
    }

    cls.BEST_DATEFORMATS = {
        base: {
            millisecond: 'time_short',
            second: 'time',
            minute: 'time_no_seconds_small_date',
            hour: 'time_no_seconds_small_date',
            day: 'full',
            month: 'month',
            year: 'year',
            decade: 'year',
            century: 'year',
            millennium: 'year',
            age: 'fallback',
            epoch: 'fallback',
            era: 'fallback',
            eon: 'fallback',
            eon2: 'fallback'
        },

        short: {
            millisecond: 'time_short',
            second: 'time_short',
            minute: 'time_no_seconds_short',
            hour: 'time_no_minutes_short',
            day: 'full_short',
            month: 'month_short',
            year: 'year',
            decade: 'year',
            century: 'year',
            millennium: 'year',
            age: 'fallback',
            epoch: 'fallback',
            era: 'fallback',
            eon: 'fallback',
            eon2: 'fallback'
        }
    }


})(TL.Date)


//
// Class for cosmological dates
//
TL.BigDate = TL.Date.extend({

    // @data = TL.BigYear object or JS dictionary with date properties
    initialize: function(data, format, format_short) {
        if (TL.BigYear == data.constructor) {
            this.data = {
                date_obj:   data
            }
        } else {
            this.data = JSON.parse(JSON.stringify(data));
            this._createDateObj();
        }

        this._setFormat(format, format_short);
    },

    // Create date_obj
    _createDateObj: function() {
	    var _date = this._getDateData();
        this.data.date_obj = new TL.BigYear(_date.year);
    },

    // Return a new TL.BigDate which has been 'floored' at the given scale.
    // @scale = string value from TL.BigDate.SCALES
    floor: function(scale) {
        for (var i = 0; i < TL.BigDate.SCALES.length; i++) {
            if (TL.BigDate.SCALES[i][0] == scale) {
                var floored = TL.BigDate.SCALES[i][2](this.data.date_obj);
                return new TL.BigDate(floored);
            }
        };

        throw new TL.Error("invalid_scale_err", scale);
    }
});

(function(cls){
    // cosmo units are years, not millis
    var AGE = 1000000;
    var EPOCH = AGE * 10;
    var ERA = EPOCH * 10;
    var EON = ERA * 10;

    var Floorer = function(unit) {
        return function(a_big_year) {
            var year = a_big_year.getTime();
            return new TL.BigYear(Math.floor(year/unit) * unit);
        }
    }

    // cosmological scales
    cls.SCALES = [ // ( name, units_per_tick, flooring function )
				['year',1, new Floorer(1)],
				['decade',10, new Floorer(10)],
				['century',100, new Floorer(100)],
				['millennium',1000, new Floorer(1000)],
        ['age',AGE, new Floorer(AGE)],          // 1M years
        ['epoch',EPOCH, new Floorer(EPOCH)],    // 10M years
        ['era',ERA, new Floorer(ERA)],          // 100M years
        ['eon',EON, new Floorer(EON)]           // 1B years
    ];

})(TL.BigDate)


/* **********************************************
     Begin TL.DateUtil.js
********************************************** */

/*	TL.DateUtil
	Utilities for parsing time
================================================== */


TL.DateUtil = {
	get: function (id) {
		return (typeof id === 'string' ? document.getElementById(id) : id);
	},

	sortByDate: function(array,prop_name) { // only for use with slide data objects
		var prop_name = prop_name || 'start_date';
		array.sort(function(a,b){
			if (a[prop_name].isBefore(b[prop_name])) return -1;
			if (a[prop_name].isAfter(b[prop_name])) return 1;
			return 0;
		});
	},

	parseTime: function(time_str) {
		var parsed = {
			hour: null, minute: null, second: null, millisecond: null // conform to keys in TL.Date
		}
		var period = null;
		var match = time_str.match(/(\s*[AaPp]\.?[Mm]\.?\s*)$/);
		if (match) {
			period = TL.Util.trim(match[0]);
			time_str = TL.Util.trim(time_str.substring(0,time_str.lastIndexOf(period)));
		}

		var parts = [];
		var no_separators = time_str.match(/^\s*(\d{1,2})(\d{2})\s*$/);
		if (no_separators) {
			parts = no_separators.slice(1);
		} else {
			parts = time_str.split(':');
			if (parts.length == 1) {
				parts = time_str.split('.');
			}
		}

		if (parts.length > 4) { 
		    throw new TL.Error("invalid_separator_error");
		}

		parsed.hour = parseInt(parts[0]);

		if (period && period.toLowerCase()[0] == 'p' && parsed.hour != 12) {
			parsed.hour += 12;
		} else if (period && period.toLowerCase()[0] == 'a' && parsed.hour == 12) {
			parsed.hour = 0;
		}


		if (isNaN(parsed.hour) || parsed.hour < 0 || parsed.hour > 23) {
			throw new TL.Error("invalid_hour_err", parsed.hour);
		}

		if (parts.length > 1) {
			parsed.minute = parseInt(parts[1]);
			if (isNaN(parsed.minute)) { 
			    throw new TL.Error("invalid_minute_err", parsed.minute); 
			}
		}

		if (parts.length > 2) {
			var sec_parts = parts[2].split(/[\.,]/);
			parts = sec_parts.concat(parts.slice(3)) // deal with various methods of specifying fractional seconds
			if (parts.length > 2) { 
			    throw new TL.Error("invalid_second_fractional_err");
			}
			parsed.second = parseInt(parts[0]);
			if (isNaN(parsed.second)) { 
			    throw new TL.Error("invalid_second_err");
			}
			if (parts.length == 2) {
				var frac_secs = parseInt(parts[1]);
				if (isNaN(frac_secs)) { 
				    throw new TL.Error("invalid_fractional_err");
				}
				parsed.millisecond = 100 * frac_secs;
			}
		}

		return parsed;
	},

	SCALE_DATE_CLASSES: {
		human: TL.Date,
		cosmological: TL.BigDate
	}


};


/* **********************************************
     Begin TL.Draggable.js
********************************************** */

/*	TL.Draggable
	TL.Draggable allows you to add dragging capabilities to any element. Supports mobile devices too.
	TODO Enable constraints
================================================== */

TL.Draggable = TL.Class.extend({
	
	includes: TL.Events,
	
	_el: {},
	
	mousedrag: {
		down:		"mousedown",
		up:			"mouseup",
		leave:		"mouseleave",
		move:		"mousemove"
	},
	
	touchdrag: {
		down:		"touchstart",
		up:			"touchend",
		leave:		"mouseleave",
		move:		"touchmove"
	},

	initialize: function (drag_elem, options, move_elem) {
		
		// DOM ELements 
		this._el = {
			drag: drag_elem,
			move: drag_elem
		};
		
		if (move_elem) {
			this._el.move = move_elem;
		}
		
		
		//Options
		this.options = {
			enable:	{
				x: true,
				y: true
			},
			constraint: {
				top: false,
				bottom: false,
				left: false,
				right: false
			},
			momentum_multiplier: 	2000,
			duration: 				1000,
			ease: 					TL.Ease.easeInOutQuint
		};
		
		
		// Animation Object
		this.animator = null;
		
		// Drag Event Type
		this.dragevent = this.mousedrag;
		
		if (TL.Browser.touch) {
			this.dragevent = this.touchdrag;
		}
		
		// Draggable Data
		this.data = {
			sliding:		false,
			direction: 		"none",
			pagex: {
				start:		0,
				end:		0
			},
			pagey: {
				start:		0,
				end:		0
			},
			pos: {
				start: {
					x: 0,
					y:0
				},
				end: {
					x: 0,
					y:0
				}
			},
			new_pos: {
				x: 0,
				y: 0
			},
			new_pos_parent: {
				x: 0,
				y: 0
			},
			time: {
				start:		0,
				end:		0
			},
			touch:			false
		};
		
		// Merge Data and Options
		TL.Util.mergeData(this.options, options);
		
		
	},
	
	enable: function(e) {
		
		this.data.pos.start = 0; 
		this._el.move.style.left = this.data.pos.start.x + "px";
		this._el.move.style.top = this.data.pos.start.y + "px";
		this._el.move.style.position = "absolute";
	},
	
	disable: function() {
		TL.DomEvent.removeListener(this._el.drag, this.dragevent.down, this._onDragStart, this);
		TL.DomEvent.removeListener(this._el.drag, this.dragevent.up, this._onDragEnd, this);
	},
	
	stopMomentum: function() {
		if (this.animator) {
			this.animator.stop();
		}

	},
	
	updateConstraint: function(c) {
		this.options.constraint = c;
		
	},
	
	/*	Private Methods
	================================================== */
	_onDragStart: function(e) {
		if (TL.Browser.touch) {
			if (e.originalEvent) {
				this.data.pagex.start = e.originalEvent.touches[0].screenX;
				this.data.pagey.start = e.originalEvent.touches[0].screenY;
			} else {
				this.data.pagex.start = e.targetTouches[0].screenX;
				this.data.pagey.start = e.targetTouches[0].screenY;
			}
		} else {
			this.data.pagex.start = e.pageX;
			this.data.pagey.start = e.pageY;
		}
		
		// Center element to finger or mouse
		if (this.options.enable.x) {
			this._el.move.style.left = this.data.pagex.start - (this._el.move.offsetWidth / 2) + "px";
		}
		
		if (this.options.enable.y) {
			this._el.move.style.top = this.data.pagey.start - (this._el.move.offsetHeight / 2) + "px";
		}
		
		this.data.pos.start = TL.Dom.getPosition(this._el.drag);
		this.data.time.start = new Date().getTime();
		
		this.fire("dragstart", this.data);
		TL.DomEvent.addListener(this._el.drag, this.dragevent.move, this._onDragMove, this);
		TL.DomEvent.addListener(this._el.drag, this.dragevent.leave, this._onDragEnd, this);
	},
	
	_onDragEnd: function(e) {
		this.data.sliding = false;
		TL.DomEvent.removeListener(this._el.drag, this.dragevent.move, this._onDragMove, this);
		TL.DomEvent.removeListener(this._el.drag, this.dragevent.leave, this._onDragEnd, this);
		this.fire("dragend", this.data);
		
		//  momentum
		this._momentum();
	},
	
	_onDragMove: function(e) {
		e.preventDefault();
		this.data.sliding = true;
		
		if (TL.Browser.touch) {
			if (e.originalEvent) {
				this.data.pagex.end = e.originalEvent.touches[0].screenX;
				this.data.pagey.end = e.originalEvent.touches[0].screenY;
			} else {
				this.data.pagex.end = e.targetTouches[0].screenX;
				this.data.pagey.end = e.targetTouches[0].screenY;
			}

		} else {
			this.data.pagex.end = e.pageX;
			this.data.pagey.end = e.pageY;
		}
		
		this.data.pos.end = TL.Dom.getPosition(this._el.drag);
		this.data.new_pos.x = -(this.data.pagex.start - this.data.pagex.end - this.data.pos.start.x);
		this.data.new_pos.y = -(this.data.pagey.start - this.data.pagey.end - this.data.pos.start.y );
		
		if (this.options.enable.x) {
			this._el.move.style.left = this.data.new_pos.x + "px";
		}
		
		if (this.options.enable.y) {
			this._el.move.style.top = this.data.new_pos.y + "px";
		}
		
		this.fire("dragmove", this.data);
	},
	
	_momentum: function() {
		var pos_adjust = {
				x: 0,
				y: 0,
				time: 0
			},
			pos_change = {
				x: 0,
				y: 0,
				time: 0
			},
			swipe = false,
			swipe_direction = "";
		
		
		if (TL.Browser.touch) {
			// Treat mobile multiplier differently
			//this.options.momentum_multiplier = this.options.momentum_multiplier * 2;
		}
		
		pos_adjust.time = (new Date().getTime() - this.data.time.start) * 10;
		pos_change.time = (new Date().getTime() - this.data.time.start) * 10;
		
		pos_change.x = this.options.momentum_multiplier * (Math.abs(this.data.pagex.end) - Math.abs(this.data.pagex.start));
		pos_change.y = this.options.momentum_multiplier * (Math.abs(this.data.pagey.end) - Math.abs(this.data.pagey.start));
		
		pos_adjust.x = Math.round(pos_change.x / pos_change.time);
		pos_adjust.y = Math.round(pos_change.y / pos_change.time);
		
		this.data.new_pos.x = Math.min(this.data.pos.end.x + pos_adjust.x);
		this.data.new_pos.y = Math.min(this.data.pos.end.y + pos_adjust.y);

		
		if (!this.options.enable.x) {
			this.data.new_pos.x = this.data.pos.start.x;
		} else if (this.data.new_pos.x < 0) {
			this.data.new_pos.x = 0;
		}
		
		if (!this.options.enable.y) {
			this.data.new_pos.y = this.data.pos.start.y;
		} else if (this.data.new_pos.y < 0) {
			this.data.new_pos.y = 0;
		}
		
		// Detect Swipe
		if (pos_change.time < 3000) {
			swipe = true;
		}
		
		// Detect Direction
		if (Math.abs(pos_change.x) > 10000) {
			this.data.direction = "left";
			if (pos_change.x > 0) {
				this.data.direction = "right";
			}
		}
		// Detect Swipe
		if (Math.abs(pos_change.y) > 10000) {
			this.data.direction = "up";
			if (pos_change.y > 0) {
				this.data.direction = "down";
			}
		}
		this._animateMomentum();
		if (swipe) {
			this.fire("swipe_" + this.data.direction, this.data);
		}
		
	},
	
	
	_animateMomentum: function() {
		var pos = {
				x: this.data.new_pos.x,
				y: this.data.new_pos.y
			},
			animate = {
				duration: 	this.options.duration,
				easing: 	TL.Ease.easeOutStrong
			};
		
		if (this.options.enable.y) {
			if (this.options.constraint.top || this.options.constraint.bottom) {
				if (pos.y > this.options.constraint.bottom) {
					pos.y = this.options.constraint.bottom;
				} else if (pos.y < this.options.constraint.top) {
					pos.y = this.options.constraint.top;
				}
			}
			animate.top = Math.floor(pos.y) + "px";
		}
		
		if (this.options.enable.x) {
			if (this.options.constraint.left || this.options.constraint.right) {
				if (pos.x > this.options.constraint.left) {
					pos.x = this.options.constraint.left;
				} else if (pos.x < this.options.constraint.right) {
					pos.x = this.options.constraint.right;
				}
			}
			animate.left = Math.floor(pos.x) + "px";
		}
		
		this.animator = TL.Animate(this._el.move, animate);
		
		this.fire("momentum", this.data);
	}
});


/* **********************************************
     Begin TL.Swipable.js
********************************************** */

/*	TL.Swipable
	TL.Draggable allows you to add dragging capabilities to any element. Supports mobile devices too.
	TODO Enable constraints
================================================== */

TL.Swipable = TL.Class.extend({
	
	includes: TL.Events,
	
	_el: {},
	
	mousedrag: {
		down:		"mousedown",
		up:			"mouseup",
		leave:		"mouseleave",
		move:		"mousemove"
	},
	
	touchdrag: {
		down:		"touchstart",
		up:			"touchend",
		leave:		"mouseleave",
		move:		"touchmove"
	},

	initialize: function (drag_elem, move_elem, options) {
		
		// DOM ELements 
		this._el = {
			drag: drag_elem,
			move: drag_elem
		};
		
		if (move_elem) {
			this._el.move = move_elem;
		}
		
		
		//Options
		this.options = {
			snap: false,
			enable:	{
				x: true,
				y: true
			},
			constraint: {
				top: false,
				bottom: false,
				left: 0,
				right: false
			},
			momentum_multiplier: 	2000,
			duration: 				1000,
			ease: 					TL.Ease.easeInOutQuint
		};
		
		
		// Animation Object
		this.animator = null;
		
		// Drag Event Type
		this.dragevent = this.mousedrag;
		
		if (TL.Browser.touch) {
			this.dragevent = this.touchdrag;
		}
		
		// Draggable Data
		this.data = {
			sliding:		false,
			direction: 		"none",
			pagex: {
				start:		0,
				end:		0
			},
			pagey: {
				start:		0,
				end:		0
			},
			pos: {
				start: {
					x: 0,
					y:0
				},
				end: {
					x: 0,
					y:0
				}
			},
			new_pos: {
				x: 0,
				y: 0
			},
			new_pos_parent: {
				x: 0,
				y: 0
			},
			time: {
				start:		0,
				end:		0
			},
			touch:			false
		};
		
		// Merge Data and Options
		TL.Util.mergeData(this.options, options);
		
		
	},
	
	enable: function(e) {
		TL.DomEvent.addListener(this._el.drag, this.dragevent.down, this._onDragStart, this);
		TL.DomEvent.addListener(this._el.drag, this.dragevent.up, this._onDragEnd, this);
		
		this.data.pos.start = 0; //TL.Dom.getPosition(this._el.move);
		this._el.move.style.left = this.data.pos.start.x + "px";
		this._el.move.style.top = this.data.pos.start.y + "px";
		this._el.move.style.position = "absolute";
		//this._el.move.style.zIndex = "11";
		//this._el.move.style.cursor = "move";
	},
	
	disable: function() {
		TL.DomEvent.removeListener(this._el.drag, this.dragevent.down, this._onDragStart, this);
		TL.DomEvent.removeListener(this._el.drag, this.dragevent.up, this._onDragEnd, this);
	},
	
	stopMomentum: function() {
		if (this.animator) {
			this.animator.stop();
		}

	},
	
	updateConstraint: function(c) {
		this.options.constraint = c;
		
		// Temporary until issues are fixed
		
	},
	
	/*	Private Methods
	================================================== */
	_onDragStart: function(e) {
		
		if (this.animator) {
			this.animator.stop();
		}
		
		if (TL.Browser.touch) {
			if (e.originalEvent) {
				this.data.pagex.start = e.originalEvent.touches[0].screenX;
				this.data.pagey.start = e.originalEvent.touches[0].screenY;
			} else {
				this.data.pagex.start = e.targetTouches[0].screenX;
				this.data.pagey.start = e.targetTouches[0].screenY;
			}
		} else {
			this.data.pagex.start = e.pageX;
			this.data.pagey.start = e.pageY;
		}
		
		// Center element to finger or mouse
		if (this.options.enable.x) {
			//this._el.move.style.left = this.data.pagex.start - (this._el.move.offsetWidth / 2) + "px";
		}
		
		if (this.options.enable.y) {
			//this._el.move.style.top = this.data.pagey.start - (this._el.move.offsetHeight / 2) + "px";
		}
		
		this.data.pos.start = {x:this._el.move.offsetLeft, y:this._el.move.offsetTop};
		
		
		this.data.time.start 			= new Date().getTime();
		
		this.fire("dragstart", this.data);
		TL.DomEvent.addListener(this._el.drag, this.dragevent.move, this._onDragMove, this);
		TL.DomEvent.addListener(this._el.drag, this.dragevent.leave, this._onDragEnd, this);
	},
	
	_onDragEnd: function(e) {
		this.data.sliding = false;
		TL.DomEvent.removeListener(this._el.drag, this.dragevent.move, this._onDragMove, this);
		TL.DomEvent.removeListener(this._el.drag, this.dragevent.leave, this._onDragEnd, this);
		this.fire("dragend", this.data);
		
		//  momentum
		this._momentum();
	},
	
	_onDragMove: function(e) {
		var change = {
			x:0,
			y:0
		}
		//e.preventDefault();
		this.data.sliding = true;
		
		if (TL.Browser.touch) {
			if (e.originalEvent) {
				this.data.pagex.end = e.originalEvent.touches[0].screenX;
				this.data.pagey.end = e.originalEvent.touches[0].screenY;
			} else {
				this.data.pagex.end = e.targetTouches[0].screenX;
				this.data.pagey.end = e.targetTouches[0].screenY;
			}

		} else {
			this.data.pagex.end = e.pageX;
			this.data.pagey.end = e.pageY;
		}
		
		change.x = this.data.pagex.start - this.data.pagex.end;
		change.y = this.data.pagey.start - this.data.pagey.end;
		
		this.data.pos.end = {x:this._el.drag.offsetLeft, y:this._el.drag.offsetTop};
		
		this.data.new_pos.x = -(change.x - this.data.pos.start.x);
		this.data.new_pos.y = -(change.y - this.data.pos.start.y );
		
		if (this.options.enable.x && ( Math.abs(change.x) > Math.abs(change.y) ) ) {
			e.preventDefault();
			this._el.move.style.left = this.data.new_pos.x + "px";
		}
		
		if (this.options.enable.y && ( Math.abs(change.y) > Math.abs(change.y) ) ) {
			e.preventDefault();
			this._el.move.style.top = this.data.new_pos.y + "px";
		}
		
		this.fire("dragmove", this.data);
	},
	
	_momentum: function() {
		var pos_adjust = {
				x: 0,
				y: 0,
				time: 0
			},
			pos_change = {
				x: 0,
				y: 0,
				time: 0
			},
			swipe_detect = {
				x: false,
				y: false
			},
			swipe = false,
			swipe_direction = "";
		
		
		this.data.direction = null;
		
		pos_adjust.time = (new Date().getTime() - this.data.time.start) * 10;
		pos_change.time = (new Date().getTime() - this.data.time.start) * 10;
		
		pos_change.x = this.options.momentum_multiplier * (Math.abs(this.data.pagex.end) - Math.abs(this.data.pagex.start));
		pos_change.y = this.options.momentum_multiplier * (Math.abs(this.data.pagey.end) - Math.abs(this.data.pagey.start));
		
		pos_adjust.x = Math.round(pos_change.x / pos_change.time);
		pos_adjust.y = Math.round(pos_change.y / pos_change.time);
		
		this.data.new_pos.x = Math.min(this.data.new_pos.x + pos_adjust.x);
		this.data.new_pos.y = Math.min(this.data.new_pos.y + pos_adjust.y);
		
		if (!this.options.enable.x) {
			this.data.new_pos.x = this.data.pos.start.x;
		} else if (this.options.constraint.left && this.data.new_pos.x > this.options.constraint.left) {
			this.data.new_pos.x = this.options.constraint.left;
		}
		
		if (!this.options.enable.y) {
			this.data.new_pos.y = this.data.pos.start.y;
		} else if (this.data.new_pos.y < 0) {
			this.data.new_pos.y = 0;
		}
		
		// Detect Swipe
		if (pos_change.time < 2000) {
			swipe = true;
		}
		
		
		if (this.options.enable.x && this.options.enable.y) {
			if (Math.abs(pos_change.x) > Math.abs(pos_change.y)) {
				swipe_detect.x = true;
			} else {
				swipe_detect.y = true;
			}
		} else if (this.options.enable.x) {
			if (Math.abs(pos_change.x) > Math.abs(pos_change.y)) {
				swipe_detect.x = true;
			}
		} else {
			if (Math.abs(pos_change.y) > Math.abs(pos_change.x)) {
				swipe_detect.y = true;
			}
		}
		
		// Detect Direction and long swipe
		if (swipe_detect.x) {
			
			// Long Swipe
			if (Math.abs(pos_change.x) > (this._el.drag.offsetWidth/2)) {
				swipe = true;
			}
			
			if (Math.abs(pos_change.x) > 10000) {
				this.data.direction = "left";
				if (pos_change.x > 0) {
					this.data.direction = "right";
				}
			}
		}
		
		if (swipe_detect.y) {
			
			// Long Swipe
			if (Math.abs(pos_change.y) > (this._el.drag.offsetHeight/2)) {
				swipe = true;
			}
			
			if (Math.abs(pos_change.y) > 10000) {
				this.data.direction = "up";
				if (pos_change.y > 0) {
					this.data.direction = "down";
				}
			}
		}
		
		if (pos_change.time < 1000 ) {
			
		} else {
			this._animateMomentum();
		}
		
		if (swipe && this.data.direction) {
			this.fire("swipe_" + this.data.direction, this.data);
		} else if (this.data.direction) {
			this.fire("swipe_nodirection", this.data);
		} else if (this.options.snap) {
			this.animator.stop();
			
			this.animator = TL.Animate(this._el.move, {
				top: 		this.data.pos.start.y,
				left: 		this.data.pos.start.x,
				duration: 	this.options.duration,
				easing: 	TL.Ease.easeOutStrong
			});
		}
		
	},
	
	
	_animateMomentum: function() {
		var pos = {
				x: this.data.new_pos.x,
				y: this.data.new_pos.y
			},
			animate = {
				duration: 	this.options.duration,
				easing: 	TL.Ease.easeOutStrong
			};
		
		if (this.options.enable.y) {
			if (this.options.constraint.top || this.options.constraint.bottom) {
				if (pos.y > this.options.constraint.bottom) {
					pos.y = this.options.constraint.bottom;
				} else if (pos.y < this.options.constraint.top) {
					pos.y = this.options.constraint.top;
				}
			}
			animate.top = Math.floor(pos.y) + "px";
		}
		
		if (this.options.enable.x) {
			if (this.options.constraint.left && pos.x >= this.options.constraint.left) {
				pos.x = this.options.constraint.left;
			}
			if (this.options.constraint.right && pos.x < this.options.constraint.right) {
				pos.x = this.options.constraint.right;
			}

			animate.left = Math.floor(pos.x) + "px";
		}
		
		this.animator = TL.Animate(this._el.move, animate);
		
		this.fire("momentum", this.data);
	}
});


/* **********************************************
     Begin TL.MenuBar.js
********************************************** */

/*	TL.MenuBar
	Draggable component to control size
================================================== */

TL.MenuBar = TL.Class.extend({

	includes: [TL.Events, TL.DomMixins],

	_el: {},

	/*	Constructor
	================================================== */
	initialize: function(elem, parent_elem, options) {
		// DOM ELEMENTS
		this._el = {
			parent: {},
			container: {},
			button_backtostart: {},
			button_zoomin: {},
			button_zoomout: {},
			arrow: {},
			line: {},
			coverbar: {},
			grip: {}
		};

		this.collapsed = false;

		if (typeof elem === 'object') {
			this._el.container = elem;
		} else {
			this._el.container = TL.Dom.get(elem);
		}

		if (parent_elem) {
			this._el.parent = parent_elem;
		}

		//Options
		this.options = {
			width: 					600,
			height: 				600,
			duration: 				1000,
			ease: 					TL.Ease.easeInOutQuint,
			menubar_default_y: 		0
		};

		// Animation
		this.animator = {};

		// Merge Data and Options
		TL.Util.mergeData(this.options, options);

		this._initLayout();
		this._initEvents();
	},

	/*	Public
	================================================== */
	show: function(d) {

		var duration = this.options.duration;
		if (d) {
			duration = d;
		}
		/*
		this.animator = TL.Animate(this._el.container, {
			top: 		this.options.menubar_default_y + "px",
			duration: 	duration,
			easing: 	TL.Ease.easeOutStrong
		});
		*/
	},

	hide: function(top) {
		/*
		this.animator = TL.Animate(this._el.container, {
			top: 		top,
			duration: 	this.options.duration,
			easing: 	TL.Ease.easeOutStrong
		});
		*/
	},

	toogleZoomIn: function(show) {
		if (show) {
      TL.DomUtil.removeClass(this._el.button_zoomin,'tl-menubar-button-inactive');
		} else {
      TL.DomUtil.addClass(this._el.button_zoomin,'tl-menubar-button-inactive');
		}
	},

	toogleZoomOut: function(show) {
		if (show) {
      TL.DomUtil.removeClass(this._el.button_zoomout,'tl-menubar-button-inactive');
		} else {
      TL.DomUtil.addClass(this._el.button_zoomout,'tl-menubar-button-inactive');
		}
	},

	setSticky: function(y) {
		this.options.menubar_default_y = y;
	},

	/*	Color
	================================================== */
	setColor: function(inverted) {
		if (inverted) {
			this._el.container.className = 'tl-menubar tl-menubar-inverted';
		} else {
			this._el.container.className = 'tl-menubar';
		}
	},

	/*	Update Display
	================================================== */
	updateDisplay: function(w, h, a, l) {
		this._updateDisplay(w, h, a, l);
	},


	/*	Events
	================================================== */
	_onButtonZoomIn: function(e) {
		this.fire("zoom_in", e);
	},

	_onButtonZoomOut: function(e) {
		this.fire("zoom_out", e);
	},

	_onButtonBackToStart: function(e) {
		this.fire("back_to_start", e);
	},


	/*	Private Methods
	================================================== */
	_initLayout: function () {

		// Create Layout
		this._el.button_zoomin 							= TL.Dom.create('span', 'tl-menubar-button', this._el.container);
		this._el.button_zoomout 						= TL.Dom.create('span', 'tl-menubar-button', this._el.container);
		this._el.button_backtostart 					= TL.Dom.create('span', 'tl-menubar-button', this._el.container);

		if (TL.Browser.mobile) {
			this._el.container.setAttribute("ontouchstart"," ");
		}

		this._el.button_backtostart.innerHTML		= "<span class='tl-icon-goback'></span>";
		this._el.button_zoomin.innerHTML			= "<span class='tl-icon-zoom-in'></span>";
		this._el.button_zoomout.innerHTML			= "<span class='tl-icon-zoom-out'></span>";


	},

	_initEvents: function () {
		TL.DomEvent.addListener(this._el.button_backtostart, 'click', this._onButtonBackToStart, this);
		TL.DomEvent.addListener(this._el.button_zoomin, 'click', this._onButtonZoomIn, this);
		TL.DomEvent.addListener(this._el.button_zoomout, 'click', this._onButtonZoomOut, this);
	},

	// Update Display
	_updateDisplay: function(width, height, animate) {

		if (width) {
			this.options.width = width;
		}
		if (height) {
			this.options.height = height;
		}
	}

});


/* **********************************************
     Begin TL.Message.js
********************************************** */

/*	TL.Message
	
================================================== */
 
TL.Message = TL.Class.extend({
	
	includes: [TL.Events, TL.DomMixins, TL.I18NMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function(data, options, add_to_container) {
		// DOM ELEMENTS
		this._el = {
			parent: {},
			container: {},
			message_container: {},
			loading_icon: {},
			message: {}
		};
	
		//Options
		this.options = {
			width: 					600,
			height: 				600,
			message_class: 			"tl-message",
			message_icon_class: 	"tl-loading-icon"
		};
		
		this._add_to_container = add_to_container || {}; // save ref
		
		// Merge Data and Options
		TL.Util.mergeData(this.data, data);
		TL.Util.mergeData(this.options, options);
		
		this._el.container = TL.Dom.create("div", this.options.message_class);
		
		if (add_to_container) {
			add_to_container.appendChild(this._el.container);
			this._el.parent = add_to_container;
		}
		
		// Animation
		this.animator = {};
				
		this._initLayout();
		this._initEvents();
	},
	
	/*	Public
	================================================== */
	updateMessage: function(t) {
		this._updateMessage(t);
	},
	
	
	/*	Update Display
	================================================== */
	updateDisplay: function(w, h) {
		this._updateDisplay(w, h);
	},
	
	_updateMessage: function(t) {
		if (!t) {
			this._el.message.innerHTML = this._('loading');
		} else {
			this._el.message.innerHTML = t;
		}
		
		// Re-add to DOM?
		if(!this._el.parent.atrributes && this._add_to_container.attributes) {
		    this._add_to_container.appendChild(this._el.container);
		    this._el.parent = this._add_to_container;
		}
	},
	

	/*	Events
	================================================== */

	
	_onMouseClick: function() {
		this.fire("clicked", this.options);
	},
	
	_onRemove: function() {
	    this._el.parent = {};
	},


	/*	Private Methods
	================================================== */
	_initLayout: function () {
		
		// Create Layout
		this._el.message_container = TL.Dom.create("div", "tl-message-container", this._el.container);
		this._el.loading_icon = TL.Dom.create("div", this.options.message_icon_class, this._el.message_container);
		this._el.message = TL.Dom.create("div", "tl-message-content", this._el.message_container);
		
		this._updateMessage();
		
	},
	
	_initEvents: function () {
		TL.DomEvent.addListener(this._el.container, 'click', this._onMouseClick, this);
		TL.DomEvent.addListener(this, 'removed', this._onRemove, this);
	},
	
	// Update Display
	_updateDisplay: function(width, height, animate) {
		
	}
	
});

/* **********************************************
     Begin TL.MediaType.js
********************************************** */

/*    TL.MediaType
    Determines the type of media the url string is.
    returns an object with .type and .id
    You can add new media types by adding a regex
    to match and the media class name to use to
    render the media

    The image_only parameter indicates that the
    call only wants an image-based media type
    that can be resolved to an image URL.

    TODO
    Allow array so a slideshow can be a mediatype
================================================== */
TL.MediaType = function(m, image_only) {
    var media = {},
        media_types =     [
            {
                type:         "youtube",
                name:         "YouTube",
                match_str:     "^(https?:)?\/*(www.)?youtube|youtu\.be",
                cls:         TL.Media.YouTube
            },
            {
                type:         "vimeo",
                name:         "Vimeo",
                match_str:     "^(https?:)?\/*(player.)?vimeo\.com",
                cls:         TL.Media.Vimeo
            },
            {
                type:         "dailymotion",
                name:         "DailyMotion",
                match_str:     "^(https?:)?\/*(www.)?dailymotion\.com",
                cls:         TL.Media.DailyMotion
            },
            {
                type:         "vine",
                name:         "Vine",
                match_str:     "^(https?:)?\/*(www.)?vine\.co",
                cls:         TL.Media.Vine
            },
            {
                type:         "soundcloud",
                name:         "SoundCloud",
                match_str:     "^(https?:)?\/*(player.)?soundcloud\.com",
                cls:         TL.Media.SoundCloud
            },
            {
                type:         "twitter",
                name:         "Twitter",
                match_str:     "^(https?:)?\/*(www.)?twitter\.com",
                cls:         TL.Media.Twitter
            },
            {
                type:         "twitterembed",
                name:         "TwitterEmbed",
                match_str:     "<blockquote class=['\"]twitter-tweet['\"]",
                cls:         TL.Media.Twitter
            },
            {
                type:         "googlemaps",
                name:         "Google Map",
                match_str:     /google.+?\/maps\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)|google.+?\/maps\/search\/([\w\W]+)\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)|google.+?\/maps\/place\/([\w\W]+)\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)|google.+?\/maps\/dir\/([\w\W]+)\/([\w\W]+)\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)/,
                cls:         TL.Media.GoogleMap
            },
            {
                type:         "googleplus",
                name:         "Google+",
                match_str:     "^(https?:)?\/*plus.google",
                cls:         TL.Media.GooglePlus
            },
            {
                type:         "flickr",
                name:         "Flickr",
                match_str:     "^(https?:)?\/*(www.)?flickr.com\/photos",
                cls:         TL.Media.Flickr
            },
            {
                type:         "flickr",
                name:         "Flickr",
                match_str:     "^(https?:\/\/)?flic.kr\/.*",
                cls:         TL.Media.Flickr
            },
            {
                type:         "instagram",
                name:         "Instagram",
                match_str:     /^(https?:)?\/*(www.)?(instagr.am|^(https?:)?\/*(www.)?instagram.com)\/p\//,
                cls:         TL.Media.Instagram
            },
            {
                type:         "profile",
                name:         "Profile",
                match_str:     /^(https?:)?\/*(www.)?instagr.am\/[a-zA-Z0-9]{2,}|^(https?:)?\/*(www.)?instagram.com\/[a-zA-Z0-9]{2,}/,
                cls:         TL.Media.Profile
            },
            {
                type:       "documentcloud",
                name:       "Document Cloud",
                match_str:  /documentcloud.org\//,
                cls:        TL.Media.DocumentCloud
            },
            {
                type:         "image",
                name:         "Image",
                match_str:     /(jpg|jpeg|png|gif|svg)(\?.*)?$/i,
                cls:         TL.Media.Image
            },
            {
                type:         "imgur",
                name:         "Imgur",
                match_str:     /^.*imgur.com\/.+$|<blockquote class=['\"]imgur-embed-pub['\"]/i,
                cls:         TL.Media.Imgur
            },
            {
                type:         "googledocs",
                name:         "Google Doc",
                match_str:     "^(https?:)?\/*[^.]*.google.com\/[^\/]*\/d\/[^\/]*\/[^\/]*\?usp=sharing|^(https?:)?\/*drive.google.com\/open\?id=[^\&]*\&authuser=0|^(https?:)?\/*drive.google.com\/open\?id=[^\&]*|^(https?:)?\/*[^.]*.googledrive.com\/host\/[^\/]*\/",
                cls:         TL.Media.GoogleDoc
            },
            {
                type:         "pdf",
                name:         "PDF",
                match_str:     /^.*\.pdf(\?.*)?(\#.*)?/,
                cls:         TL.Media.PDF
            },
            {
                type:         "wikipedia",
                name:         "Wikipedia",
                match_str:     "^(https?:)?\/*(www.)?wikipedia\.org|^(https?:)?\/*([a-z][a-z].)?wikipedia\.org",
                cls:         TL.Media.Wikipedia
            },
            {
                type:         "spotify",
                name:         "spotify",
                match_str:     "spotify",
                cls:         TL.Media.Spotify
            },
            {
                type:         "iframe",
                name:         "iFrame",
                match_str:     "iframe",
                cls:         TL.Media.IFrame
            },
            {
                type:         "storify",
                name:         "Storify",
                match_str:     "storify",
                cls:         TL.Media.Storify
            },
            {
                type:         "blockquote",
                name:         "Quote",
                match_str:     "blockquote",
                cls:         TL.Media.Blockquote
            },
            // {
            //     type:         "website",
            //     name:         "Website",
            //     match_str:     "https?://",
            //     cls:         TL.Media.Website
            // },
            {
                type:         "video",
                name:         "Video",
                match_str:     /(mp4)(\?.*)?$/i,
                cls:         TL.Media.Video
            },
            {
              type:         "wistia",
              name:         "Wistia",
              match_str:     /https?:\/\/(.+)?(wistia\.com|wi\.st)\/.*/i,
              cls:         TL.Media.Wistia
            },
            {
                type:         "audio",
                name:         "Audio",
                match_str:     /(mp3|wav|m4a)(\?.*)?$/i,
                cls:         TL.Media.Audio
            },
            {
                type:         "imageblank",
                name:         "Imageblank",
                match_str:     "",
                cls:         TL.Media.Image
            }
        ];

    if(image_only) {
        if (m instanceof Array) {
            return false;
        }
        for (var i = 0; i < media_types.length; i++) {
            switch(media_types[i].type) {
                case "flickr":
                case "image":
                case "instagram":
                    if (m.url.match(media_types[i].match_str)) {
                        media = media_types[i];
                        return media;
                    }
                    break;
                default:
                    break;
            }
        }

    } else {
        for (var i = 0; i < media_types.length; i++) {
            if (m instanceof Array) {
                return media = {
                    type:         "slider",
                    cls:         TL.Media.Slider
                };
            } else if (m.url.match(media_types[i].match_str)) {
                media         = media_types[i];
                return media;
            }
        }
    }
    return false;
}


/* **********************************************
     Begin TL.Media.js
********************************************** */

/*	TL.Media
	Main media template for media assets.
	Takes a data object and populates a dom object
================================================== */
// TODO add link

TL.Media = TL.Class.extend({

	includes: [TL.Events, TL.I18NMixins],

	_el: {},

	/*	Constructor
	================================================== */
	initialize: function(data, options, add_to_container) {
		// DOM ELEMENTS
		this._el = {
			container: {},
			content_container: {},
			content: {},
			content_item: {},
			content_link: {},
			caption: null,
			credit: null,
			parent: {},
			link: null
		};

		// Player (If Needed)
		this.player = null;

		// Timer (If Needed)
		this.timer = null;
		this.load_timer = null;

		// Message
		this.message = null;

		// Media ID
		this.media_id = null;

		// State
		this._state = {
			loaded: false,
			show_meta: false,
			media_loaded: false
		};

		// Data
		this.data = {
			unique_id: 			null,
			url: 				null,
			credit:				null,
			caption:			null,
			credit_alternate: 	null,
			caption_alternate: 	null,
			link: 				null,
			link_target: 		null
		};

		//Options
		this.options = {
			api_key_flickr: 		"bd3a7c45ddd52f3101825d41563a6125",
			api_key_googlemaps: "AIzaSyB9dW8e_iRrATFa8g24qB6BDBGdkrLDZYI",
			api_key_embedly: 		"", // ae2da610d1454b66abdf2e6a4c44026d
			credit_height: 			0,
			caption_height: 		0,
			background:         0   // is background media (for slide)
		};

		this.animator = {};

		// Merge Data and Options
		TL.Util.mergeData(this.options, options);
		TL.Util.mergeData(this.data, data);

        // Don't create DOM elements if this is background media
        if(!this.options.background) {
            this._el.container = TL.Dom.create("div", "tl-media");

            if (this.data.unique_id) {
                this._el.container.id = this.data.unique_id;
            }

            this._initLayout();

            if (add_to_container) {
                add_to_container.appendChild(this._el.container);
                this._el.parent = add_to_container;
            }
        }
	},

	loadMedia: function() {
		var self = this;

		if (!this._state.loaded) {
			try {
				this.load_timer = setTimeout(function() {
		            self.loadingMessage();
					self._loadMedia();
					// self._state.loaded = true; handled in onLoaded()
					self._updateDisplay();
				}, 1200);
			} catch (e) {
				trace("Error loading media for ", this._media);
				trace(e);
			}
		}
	},

  _updateMessage: function(msg) {
      if(this.message) {
          this.message.updateMessage(msg);
      }
  },

	loadingMessage: function() {
	    this._updateMessage(this._('loading') + " " + this.options.media_name);
	},

	errorMessage: function(msg) {
		if (msg) {
			msg = this._('error') + ": " + msg;
		} else {
			msg = this._('error');
		}
		this._updateMessage(msg);
	},

	updateMediaDisplay: function(layout) {
		if (this._state.loaded && !this.options.background) {

			if (TL.Browser.mobile) {
				this._el.content_item.style.maxHeight = (this.options.height/2) + "px";
			} else {
				this._el.content_item.style.maxHeight = this.options.height - this.options.credit_height - this.options.caption_height - 30 + "px";
			}

			//this._el.content_item.style.maxWidth = this.options.width + "px";
			this._el.container.style.maxWidth = this.options.width + "px";
			// Fix for max-width issues in Firefox
			if (TL.Browser.firefox) {
				if (this._el.content_item.offsetWidth > this._el.content_item.offsetHeight) {
					//this._el.content_item.style.width = "100%";
				}
			}

			this._updateMediaDisplay(layout);

			if (this._state.media_loaded) {
				if (this._el.credit) {
					this._el.credit.style.width		= this._el.content_item.offsetWidth + "px";
				}
				if (this._el.caption) {
					this._el.caption.style.width		= this._el.content_item.offsetWidth + "px";
				}
			}

		}
	},

	/*	Media Specific
	================================================== */
    _loadMedia: function() {
        // All overrides must call this.onLoaded() to set state
        this.onLoaded();
    },

    _updateMediaDisplay: function(l) {
        //this._el.content_item.style.maxHeight = (this.options.height - this.options.credit_height - this.options.caption_height - 16) + "px";
        if(TL.Browser.firefox) {
            this._el.content_item.style.maxWidth = this.options.width + "px";
            this._el.content_item.style.width = "auto";
        }
    },

    _getMeta: function() {

    },

    _getImageURL: function(w, h) {
        // Image-based media types should return <img>-compatible src url
        return "";
    },

	/*	Public
	================================================== */
	show: function() {

	},

	hide: function() {

	},

	addTo: function(container) {
		container.appendChild(this._el.container);
		this.onAdd();
	},

	removeFrom: function(container) {
		container.removeChild(this._el.container);
		this.onRemove();
	},

  getImageURL: function(w, h) {
      return this._getImageURL(w, h);
  },

	// Update Display
	updateDisplay: function(w, h, l) {
		this._updateDisplay(w, h, l);
	},

	stopMedia: function() {
		this._stopMedia();
	},

	loadErrorDisplay: function(message) {
		try {
			this._el.content.removeChild(this._el.content_item);
		} catch(e) {
			// if this._el.content_item isn't a child of this._el then just keep truckin
		}
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-loaderror", this._el.content);
		this._el.content_item.innerHTML = "<div class='tl-icon-" + this.options.media_type + "'></div><p>" + message + "</p>";

		// After Loaded
		this.onLoaded(true);
	},

	/*	Events
	================================================== */
	onLoaded: function(error) {
		this._state.loaded = true;
		this.fire("loaded", this.data);
		if (this.message) {
			this.message.hide();
		}
		if (!(error || this.options.background)) {
			this.showMeta();
		}
		this.updateDisplay();
	},

	onMediaLoaded: function(e) {
		this._state.media_loaded = true;
		this.fire("media_loaded", this.data);
		if (this._el.credit) {
			this._el.credit.style.width		= this._el.content_item.offsetWidth + "px";
		}
		if (this._el.caption) {
			this._el.caption.style.width		= this._el.content_item.offsetWidth + "px";
		}
	},

	showMeta: function(credit, caption) {
		this._state.show_meta = true;
		// Credit
		if (this.data.credit && this.data.credit != "") {
			this._el.credit					= TL.Dom.create("div", "tl-credit", this._el.content_container);
			this._el.credit.innerHTML		= this.options.autolink == true ? TL.Util.linkify(this.data.credit) : this.data.credit;
			this.options.credit_height 		= this._el.credit.offsetHeight;
		}

		// Caption
		if (this.data.caption && this.data.caption != "") {
			this._el.caption				= TL.Dom.create("div", "tl-caption", this._el.content_container);
			this._el.caption.innerHTML		= this.options.autolink == true ? TL.Util.linkify(this.data.caption) : this.data.caption;
			this.options.caption_height 	= this._el.caption.offsetHeight;
		}

		if (!this.data.caption || !this.data.credit) {
			this.getMeta();
		}

	},

	getMeta: function() {
		this._getMeta();
	},

	updateMeta: function() {
		if (!this.data.credit && this.data.credit_alternate) {
			this._el.credit					= TL.Dom.create("div", "tl-credit", this._el.content_container);
			this._el.credit.innerHTML		= this.data.credit_alternate;
			this.options.credit_height 		= this._el.credit.offsetHeight;
		}

		if (!this.data.caption && this.data.caption_alternate) {
			this._el.caption				= TL.Dom.create("div", "tl-caption", this._el.content_container);
			this._el.caption.innerHTML		= this.data.caption_alternate;
			this.options.caption_height 	= this._el.caption.offsetHeight;
		}

		this.updateDisplay();
	},

	onAdd: function() {
		this.fire("added", this.data);
	},

	onRemove: function() {
		this.fire("removed", this.data);
	},

	/*	Private Methods
	================================================== */
	_initLayout: function () {

		// Message
		this.message = new TL.Message({}, this.options);
		this.message.addTo(this._el.container);

		// Create Layout
		this._el.content_container = TL.Dom.create("div", "tl-media-content-container", this._el.container);

		// Link
		if (this.data.link && this.data.link != "") {

			this._el.link = TL.Dom.create("a", "tl-media-link", this._el.content_container);
			this._el.link.href = this.data.link;
			if (this.data.link_target && this.data.link_target != "") {
				this._el.link.target = this.data.link_target;
			} else {
				this._el.link.target = "_blank";
			}

			this._el.content = TL.Dom.create("div", "tl-media-content", this._el.link);

		} else {
			this._el.content = TL.Dom.create("div", "tl-media-content", this._el.content_container);
		}


	},

	// Update Display
	_updateDisplay: function(w, h, l) {
		if (w) {
			this.options.width = w;

		}
		//this._el.container.style.width = this.options.width + "px";
		if (h) {
			this.options.height = h;
		}

		if (l) {
			this.options.layout = l;
		}

		if (this._el.credit) {
			this.options.credit_height 		= this._el.credit.offsetHeight;
		}
		if (this._el.caption) {
			this.options.caption_height 	= this._el.caption.offsetHeight + 5;
		}

		this.updateMediaDisplay(this.options.layout);

	},

	_stopMedia: function() {

	}

});


/* **********************************************
     Begin TL.Media.Blockquote.js
********************************************** */

/*	TL.Media.Blockquote
================================================== */

TL.Media.Blockquote = TL.Media.extend({
	
	includes: [TL.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {		
		// Create Dom element
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-blockquote", this._el.content);
		this._el.content_container.className = "tl-media-content-container tl-media-content-container-text";
		
		// Get Media ID
		this.media_id = this.data.url;
		
		// API Call
		this._el.content_item.innerHTML = this.media_id;
		
		// After Loaded
		this.onLoaded();
	},
	
	updateMediaDisplay: function() {
		
	},
	
	_updateMediaDisplay: function() {
		
	}

	
});


/* **********************************************
     Begin TL.Media.DailyMotion.js
********************************************** */

/*	TL.Media.DailyMotion
================================================== */

TL.Media.DailyMotion = TL.Media.extend({

	includes: [TL.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;

		// Create Dom element
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-iframe tl-media-dailymotion", this._el.content);

		// Get Media ID
		if (this.data.url.match("video")) {
			this.media_id = this.data.url.split("video\/")[1].split(/[?&]/)[0];
		} else {
			this.media_id = this.data.url.split("embed\/")[1].split(/[?&]/)[0];
		}

		// API URL
		api_url = "https://www.dailymotion.com/embed/video/" + this.media_id+"?api=postMessage";

		// API Call
		this._el.content_item.innerHTML = "<iframe autostart='false' frameborder='0' width='100%' height='100%' src='" + api_url + "'></iframe>"

		// After Loaded
		this.onLoaded();
	},

	// Update Media Display
	_updateMediaDisplay: function() {
		this._el.content_item.style.height = TL.Util.ratio.r16_9({w:this._el.content_item.offsetWidth}) + "px";
	},

	_stopMedia: function() {
		this._el.content_item.querySelector("iframe").contentWindow.postMessage('{"command":"pause","parameters":[]}', "*");

	}

});


/* **********************************************
     Begin TL.Media.DocumentCloud.js
********************************************** */

/*	TL.Media.DocumentCloud
================================================== */

TL.Media.DocumentCloud = TL.Media.extend({

	includes: [TL.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var self = this;

		// Create Dom elements
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-documentcloud tl-media-shadow", this._el.content);
		this._el.content_item.id = TL.Util.unique_ID(7)

		// Check url
		if(this.data.url.match(/\.html$/)) {
		    this.data.url = this._transformURL(this.data.url);
		} else if(!(this.data.url.match(/.(json|js)$/))) {
		    trace("DOCUMENT CLOUD IN URL BUT INVALID SUFFIX");
		}

		// Load viewer API
        TL.Load.js([
					'https://assets.documentcloud.org/viewer/loader.js',
					'https://assets.documentcloud.org/viewer/viewer.js'],
            function() {	
	            self.createMedia();
			}
		);
	},

	// Viewer API needs js, not html
	_transformURL: function(url) {
        return url.replace(/(.*)\.html$/, '$1.js')
	},

	// Update Media Display
	_updateMediaDisplay: function() {
        this._el.content_item.style.height = this.options.height + "px";
		//this._el.content_item.style.width = this.options.width + "px";
	},

	createMedia: function() {
		// DocumentCloud API call
		DV.load(this.data.url, {
		    container: '#'+this._el.content_item.id,
		    showSidebar: false
		});
		this.onLoaded();
	},



	/*	Events
	================================================== */



});


/* **********************************************
     Begin TL.Media.Flickr.js
********************************************** */

/*	TL.Media.Flickr

================================================== */

TL.Media.Flickr = TL.Media.extend({

	includes: [TL.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;

		try {
		    // Get Media ID
		    this.establishMediaID();

            // API URL
            api_url = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + this.options.api_key_flickr + "&photo_id=" + this.media_id + "&format=json&jsoncallback=?";

            // API Call
            TL.getJSON(api_url, function(d) {
                if (d.stat == "ok") {
                    self.sizes = d.sizes.size; // store sizes info

                    if(!self.options.background) {
                        self.createMedia();
                    }

                    self.onLoaded();
                } else {
                    self.loadErrorDisplay(self._("flickr_notfound_err"));
                }
            });
		} catch(e) {
		    self.loadErrorDisplay(self._(e.message_key));
		}
	},

	establishMediaID: function() {
		if (this.data.url.match(/flic.kr\/.+/i)) {
			var encoded = this.data.url.split('/').slice(-1)[0];
			this.media_id = TL.Util.base58.decode(encoded);
		} else {
			var marker = 'flickr.com/photos/';
			var idx = this.data.url.indexOf(marker);
			if (idx == -1) { throw new TL.Error("flickr_invalidurl_err"); }
			var pos = idx + marker.length;
			this.media_id = this.data.url.substr(pos).split("/")[1];
		}
	},

	createMedia: function() {
	    var self = this;

		// Link
		this._el.content_link = TL.Dom.create("a", "", this._el.content);
		this._el.content_link.href = this.data.url;
		this._el.content_link.target = "_blank";

		// Photo
		this._el.content_item = TL.Dom.create("img", "tl-media-item tl-media-image tl-media-flickr tl-media-shadow", this._el.content_link);

		if (this.data.alt) {
			this._el.content_item.alt = this.data.alt;
		} else if (this.data.caption) {
			this._el.content_item.alt = TL.Util.unhtmlify(this.data.caption);
		}

		if (this.data.title) {
			this._el.content_item.title = this.data.title;
		} else if (this.data.caption) {
			this._el.content_item.title = TL.Util.unhtmlify(this.data.caption);
		}

		// Media Loaded Event
		this._el.content_item.addEventListener('load', function(e) {
			self.onMediaLoaded();
		});

		// Set Image Source
		this._el.content_item.src = this.getImageURL(this.options.width, this.options.height);
	},

    getImageURL: function(w, h) {
        var best_size 	= this.size_label(h),
            source = this.sizes[this.sizes.length - 2].source;

		for(var i = 0; i < this.sizes.length; i++) {
			if (this.sizes[i].label == best_size) {
				source = this.sizes[i].source;
			}
		}

		return source;
    },

	_getMeta: function() {
		var self = this,
		api_url;

		// API URL
		api_url = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=" + this.options.api_key_flickr + "&photo_id=" + this.media_id + "&format=json&jsoncallback=?";

		// API Call
		TL.getJSON(api_url, function(d) {
			self.data.credit_alternate = "<a href='" + self.data.url + "' target='_blank'>" + d.photo.owner.realname + "</a>";
			self.data.caption_alternate = d.photo.title._content + " " + d.photo.description._content;
			self.updateMeta();
		});
	},

	size_label: function(s) {
		var _size = "";

		if (s <= 75) {
			if (s <= 0) {
				_size = "Large";
			} else {
				_size = "Thumbnail";
			}
		} else if (s <= 180) {
			_size = "Small";
		} else if (s <= 240) {
			_size = "Small 320";
		} else if (s <= 375) {
			_size = "Medium";
		} else if (s <= 480) {
			_size = "Medium 640";
		} else if (s <= 600) {
			_size = "Large";
		} else {
			_size = "Large";
		}

		return _size;
	}



});


/* **********************************************
     Begin TL.Media.GoogleDoc.js
********************************************** */

/*	TL.Media.GoogleDoc

================================================== */

TL.Media.GoogleDoc = TL.Media.extend({
	
	includes: [TL.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var url,
			self = this;
		
		// Create Dom element
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-iframe", this._el.content);
		
		// Get Media ID
		if (this.data.url.match("open\?id\=")) {
			this.media_id = this.data.url.split("open\?id\=")[1];
			if (this.data.url.match("\&authuser\=0")) {
				url = this.media_id.match("\&authuser\=0")[0];
			};
		} else if (this.data.url.match(/file\/d\/([^/]*)\/?/)) {
			var doc_id = this.data.url.match(/file\/d\/([^/]*)\/?/)[1];
			url = 'https://drive.google.com/file/d/' + doc_id + '/preview'
		} else {
			url = this.data.url;
		}
		
		// this URL makes something suitable for an img src but what if it's not an image?
		// api_url = "http://www.googledrive.com/host/" + this.media_id + "/";
		
		this._el.content_item.innerHTML	=	"<iframe class='doc' frameborder='0' width='100%' height='100%' src='" + url + "'></iframe>";
		
		// After Loaded
		this.onLoaded();
	},
	
	// Update Media Display
	_updateMediaDisplay: function() {
		this._el.content_item.style.height = this.options.height + "px";
	}

	
});


/* **********************************************
     Begin TL.Media.GooglePlus.js
********************************************** */

/*	TL.Media.GooglePlus
================================================== */

TL.Media.GooglePlus = TL.Media.extend({
	
	includes: [TL.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;
		
		// Create Dom element
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-googleplus", this._el.content);
		
		// Get Media ID
		this.media_id = this.data.url;
		
		// API URL
		api_url = this.media_id;
		
		// API Call
		this._el.content_item.innerHTML = "<iframe frameborder='0' width='100%' height='100%' src='" + api_url + "'></iframe>"		
		
		// After Loaded
		this.onLoaded();
	},
	
	// Update Media Display
	_updateMediaDisplay: function() {
		this._el.content_item.style.height = this.options.height + "px";
	}

	
});


/* **********************************************
     Begin TL.Media.IFrame.js
********************************************** */

/*	TL.Media.IFrame
================================================== */

TL.Media.IFrame = TL.Media.extend({
	
	includes: [TL.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;
				
		// Create Dom element
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-iframe", this._el.content);
		
		// Get Media ID
		this.media_id = this.data.url;
		
		// API URL
		api_url = this.media_id;
		
		// API Call
		this._el.content_item.innerHTML = api_url;
		
		// After Loaded
		this.onLoaded();
	},
	
	// Update Media Display
	_updateMediaDisplay: function() {
		this._el.content_item.style.height = this.options.height + "px";
	}
	
});


/* **********************************************
     Begin TL.Media.Image.js
********************************************** */

/*	TL.Media.Image
	Produces image assets.
	Takes a data object and populates a dom object
================================================== */

TL.Media.Image = TL.Media.extend({

	includes: [TL.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		// Loading Message
		this.loadingMessage();

        // Create media?
        if(!this.options.background) {
            this.createMedia();
        }

        // After loaded
		this.onLoaded();
	},

    createMedia: function() {
        var self = this,
            image_class = "tl-media-item tl-media-image tl-media-shadow";

		if (this.data.url.match(/.png(\?.*)?$/) || this.data.url.match(/.svg(\?.*)?$/)) {
			image_class = "tl-media-item tl-media-image"
		}

 		// Link
		if (this.data.link) {
			this._el.content_link 				= TL.Dom.create("a", "", this._el.content);
			this._el.content_link.href 			= this.data.link;
			this._el.content_link.target 		= "_blank";
			this._el.content_item				= TL.Dom.create("img", image_class, this._el.content_link);
		} else {
			this._el.content_item				= TL.Dom.create("img", image_class, this._el.content);
		}

		if (this.data.alt) {
			this._el.content_item.alt = this.data.alt;
		} else if (this.data.caption) {
			this._el.content_item.alt = TL.Util.unhtmlify(this.data.caption);
		}

		if (this.data.title) {
			this._el.content_item.title = this.data.title;
		} else if (this.data.caption) {
			this._el.content_item.title = TL.Util.unhtmlify(this.data.caption);
		}

		// Media Loaded Event
		this._el.content_item.addEventListener('load', function(e) {
			self.onMediaLoaded();
		});

		this._el.content_item.src			= this.getImageURL();
    },

    getImageURL: function(w, h) {
        return TL.Util.transformImageURL(this.data.url);
    },

	_updateMediaDisplay: function(layout) {
		if(TL.Browser.firefox) {
			//this._el.content_item.style.maxWidth = (this.options.width/2) - 40 + "px";
			this._el.content_item.style.width = "auto";
		}
	}

});


/* **********************************************
     Begin TL.Media.Imgur.js
********************************************** */

/*	TL.Media.Flickr

================================================== */

TL.Media.Imgur = TL.Media.extend({

	includes: [TL.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		try {
			var self = this;

			if (this.data.url.match("<blockquote class=['\"]imgur-embed-pub['\"]")){
				var found = this.data.url.match(/(imgur\.com)\/(\w+)/);
				this.media_id = found[2];
				this.data.url = "http://imgur.com/gallery/" + this.media_id;
			}
			else if (this.data.url){
				this.media_id = this.data.url.split('/').slice(-1)[0];
			}

	        TL.Load.js([
						'https://s.imgur.com/min/embed.js'], 
					function(){
						self.createMedia();
					}
			);

		} catch(e) {
		    this.loadErrorDisplay(this._("imgur_invalidurl_err"));
		}
	},

	createMedia: function() {
	    var self = this;
		var api_url = "https://api.imgur.com/oembed.json?url=" + this.data.url;

		// Content div
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-image tl-media-imgur",
																								this._el.content);

		// API Call

          TL.ajax({
          	type: 'GET',
            url: api_url,
            dataType: 'json',
            success: function(data){
            try {
                self._el.content_item.innerHTML	= data.html;
            	setInterval(function(){
            		if(document.querySelector("blockquote.imgur-embed-pub") == null){
            			clearInterval();
            		}
            		else{
            			imgurEmbed.createIframe();
            			document.getElementById("imageElement").removeAttribute("style");
            			document.getElementById("image").removeAttribute("style");
            		}
            	}, 2000);
            } catch(e) {
            }
            },
            error: function(xhr, errorType, error) {
              tc = new TL.TimelineConfig();
              if (errorType == 'parsererror') {
                var error = new TL.Error("invalid_url_err");
              } else {
                var error = new TL.Error("unknown_read_err", errorType);
              }
              self.loadErrorDisplay(self._("imgur_invalidurl_err"));
              tc.logError(error);
            }
          });

         this.onLoaded();

	},



	_updateMediaDisplay: function() {
		//this.el.content_item = document.getElementById(this._el.content_item.id);
		this._el.content_item.style.width = this.options.width + "px";
		this._el.content_item.style.height = TL.Util.ratio.r16_9({w:this.options.width}) + "px";
	}

});


/* **********************************************
     Begin TL.Media.Instagram.js
********************************************** */

/*	TL.Media.Instagram

================================================== */

TL.Media.Instagram = TL.Media.extend({

	includes: [TL.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		// Get Media ID
		this.media_id = this.data.url.split("\/p\/")[1].split("/")[0];

		if(!this.options.background) {
		    this.createMedia();
		}

		// After Loaded
		this.onLoaded();
	},

    createMedia: function() {
        var self = this;

		// Link
		this._el.content_link 				= TL.Dom.create("a", "", this._el.content);
		this._el.content_link.href 			= this.data.url;
		this._el.content_link.target 		= "_blank";

		// Photo
		this._el.content_item				= TL.Dom.create("img", "tl-media-item tl-media-image tl-media-instagram tl-media-shadow", this._el.content_link);

		if (this.data.alt) {
			this._el.content_item.alt = this.data.alt;
		} else if (this.data.caption) {
			this._el.content_item.alt = TL.Util.unhtmlify(this.data.caption);
		}

		if (this.data.title) {
			this._el.content_item.title = this.data.title;
		} else if (this.data.caption) {
			this._el.content_item.title = TL.Util.unhtmlify(this.data.caption);
		}

		// Media Loaded Event
		this._el.content_item.addEventListener('load', function(e) {
			self.onMediaLoaded();
		});

	    this._el.content_item.src = this.getImageURL(this._el.content.offsetWidth);
    },

    getImageURL: function(w, h) {
        return "https://instagram.com/p/" + this.media_id + "/media/?size=" + this.sizes(w);
    },

	_getMeta: function() {
		var self = this,
		    api_url;

		// API URL
		api_url = "https://api.instagram.com/oembed?url=https://instagr.am/p/" + this.media_id + "&callback=?";

		// API Call
		TL.getJSON(api_url, function(d) {
			self.data.credit_alternate = "<a href='" + d.author_url + "' target='_blank'>" + d.author_name + "</a>";
			self.data.caption_alternate = d.title;
			self.updateMeta();
		});
	},

	sizes: function(s) {
		var _size = "";
		if (s <= 150) {
			_size = "t";
		} else if (s <= 306) {
			_size = "m";
		} else {
			_size = "l";
		}

		return _size;
	}



});


/* **********************************************
     Begin TL.Media.GoogleMap.js
********************************************** */

/*  TL.Media.Map
================================================== */

TL.Media.GoogleMap = TL.Media.extend({
	includes: [TL.Events],

	/*  Load the media
	================================================== */
	_loadMedia: function() {

		// Create Dom element
		this._el.content_item   = TL.Dom.create("div", "tl-media-item tl-media-map tl-media-shadow", this._el.content);

		// Get Media ID
		this.media_id = this.data.url;

		// API Call
		this.mapframe = TL.Dom.create("iframe", "", this._el.content_item);
		window.stash = this;
		this.mapframe.width       = "100%";
		this.mapframe.height      = "100%";
		this.mapframe.frameBorder = "0";
		this.mapframe.src         = this.makeGoogleMapsEmbedURL(this.media_id, this.options.api_key_googlemaps);
		
		
		// After Loaded
		this.onLoaded();
	},

	_updateMediaDisplay: function() {
		if (this._state.loaded) {
			var dimensions = TL.Util.ratio.square({w:this._el.content_item.offsetWidth});
			this._el.content_item.style.height = dimensions.h + "px";
		}
	},
	
	makeGoogleMapsEmbedURL: function(url,api_key) {
		// Test with https://docs.google.com/spreadsheets/d/1zCpvtRdftlR5fBPppmy_-SkGIo7RMwoPUiGFZDAXbTc/edit
		var Streetview = false;

		function determineMapMode(url){
			function parseDisplayMode(display_mode, param_string) {
				// Set the zoom param
				if (display_mode.slice(-1) == "z") {
					param_string["zoom"] = display_mode;
					// Set the maptype to something other than "roadmap"
				} else if (display_mode.slice(-1) == "m") {
					// TODO: make this somehow interpret the correct zoom level
					// until then fake it by using Google's default zoom level
					param_string["zoom"] = 14;
					param_string["maptype"] = "satellite";
					// Set all the fun streetview params
				} else if (display_mode.slice(-1) == "t") {
					Streetview = true;
					// streetview uses "location" instead of "center"
					// "place" mode doesn't have the center param, so we may need to grab that now
					if (mapmode == "place") {
						var center = url.match(regexes["place"])[3] + "," + url.match(regexes["place"])[4];
					} else {
						var center = param_string["center"];
						delete param_string["center"];
					}
					// Clear out all the other params -- this is so hacky
					param_string = {};
					param_string["location"] = center;
					streetview_params = display_mode.split(",");
					for (param in param_defs["streetview"]) {
						var i = parseInt(param) + 1;
						if (param_defs["streetview"][param] == "pitch" && streetview_params[i] == "90t"){
							// Although 90deg is the horizontal default in the URL, 0 is horizontal default for embed URL. WHY??
							// https://developers.google.com/maps/documentation/javascript/streetview
							param_string[param_defs["streetview"][param]] = 0;
						} else {
							param_string[param_defs["streetview"][param]] = streetview_params[i].slice(0,-1);
						}
					}

				}
				return param_string;
			}
			function determineMapModeURL(mapmode, match) {
				var param_string = {};
				var url_root = match[1], display_mode = match[match.length - 1];
				for (param in param_defs[mapmode]) {
					// skip first 2 matches, because they reflect the URL and not params
					var i = parseInt(param)+2;
					if (param_defs[mapmode][param] == "center") {
						param_string[param_defs[mapmode][param]] = match[i] + "," + match[++i];
					} else {
						param_string[param_defs[mapmode][param]] = match[i];
					}
				}

				param_string = parseDisplayMode(display_mode, param_string);
				param_string["key"] = api_key;
				if (Streetview == true) {
					mapmode = "streetview";
				} else {
				}
				return (url_root + "/embed/v1/" + mapmode + TL.Util.getParamString(param_string));
			}


			mapmode = "view";
			if (url.match(regexes["place"])) {
				mapmode = "place";
			} else if (url.match(regexes["directions"])) {
				mapmode = "directions";
			} else if (url.match(regexes["search"])) {
				mapmode = "search";
			}
			return determineMapModeURL(mapmode, url.match(regexes[mapmode]));

		}

		// These must be in the order they appear in the original URL
		// "key" param not included since it's not in the URL structure
		// Streetview "location" param not included since it's captured as "center"
		// Place "center" param ...um...
		var param_defs = {
			"view": ["center"],
			"place": ["q", "center"],
			"directions": ["origin", "destination", "center"],
			"search": ["q", "center"],
			"streetview": ["fov", "heading", "pitch"]
		};
		// Set up regex parts to make updating these easier if Google changes them
		var root_url_regex = /(https:\/\/.+google.+?\/maps)/;
		var coords_regex = /@([-\d.]+),([-\d.]+)/;
		var address_regex = /([\w\W]+)/;

		// Data doesn't seem to get used for anything
		var data_regex = /data=[\S]*/;

		// Capture the parameters that determine what map tiles to use
		// In roadmap view, mode URLs include zoom paramater (e.g. "14z")
		// In satellite (or "earth") view, URLs include a distance parameter (e.g. "84511m")
		// In streetview, URLs include paramaters like "3a,75y,49.76h,90t" -- see http://stackoverflow.com/a/22988073
		var display_mode_regex = /,((?:[-\d.]+[zmayht],?)*)/;

		var regexes = {
			view: new RegExp(root_url_regex.source + "/" + coords_regex.source + display_mode_regex.source),
			place: new RegExp(root_url_regex.source + "/place/" + address_regex.source + "/" + coords_regex.source + display_mode_regex.source),
			directions: new RegExp(root_url_regex.source + "/dir/" + address_regex.source + "/" + address_regex.source + "/" + coords_regex.source + display_mode_regex.source),
			search: new RegExp(root_url_regex.source + "/search/" + address_regex.source + "/" + coords_regex.source + display_mode_regex.source)
		};
		return determineMapMode(url);
	}
   
});


/* **********************************************
     Begin TL.Media.PDF.js
********************************************** */

/*	TL.Media.PDF
 * Chrome and Firefox on both OSes and Safari all support PDFs as iframe src.
 * This prompts for a download on IE10/11. We should investigate using
 * https://mozilla.github.io/pdf.js/ to support showing PDFs on IE.
================================================== */

TL.Media.PDF = TL.Media.extend({

	includes: [TL.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var url = TL.Util.transformImageURL(this.data.url),
			self = this;

		// Create Dom element
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-iframe", this._el.content);
		var markup = "";
		// not assigning media_id attribute. Seems like a holdover which is no longer used.
		if (TL.Browser.ie || TL.Browser.edge || url.match(/dl.dropboxusercontent.com/)) {
			markup = "<iframe class='doc' frameborder='0' width='100%' height='100%' src='//docs.google.com/viewer?url=" + url + "&amp;embedded=true'></iframe>";
		} else {
			markup = "<iframe class='doc' frameborder='0' width='100%' height='100%' src='" + url + "'></iframe>"
		}
		this._el.content_item.innerHTML	= markup
		this.onLoaded();
	},

	// Update Media Display
	_updateMediaDisplay: function() {
		this._el.content_item.style.height = this.options.height + "px";
	}


});


/* **********************************************
     Begin TL.Media.Profile.js
********************************************** */

/*	TL.Media.Profile

================================================== */

TL.Media.Profile = TL.Media.extend({
	
	includes: [TL.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		
		this._el.content_item				= TL.Dom.create("img", "tl-media-item tl-media-image tl-media-profile tl-media-shadow", this._el.content);
		this._el.content_item.src			= this.data.url;
		
		this.onLoaded();
	},
	
	_updateMediaDisplay: function(layout) {
		
		
		if(TL.Browser.firefox) {
			this._el.content_item.style.maxWidth = (this.options.width/2) - 40 + "px";
		}
	}
	
});

/* **********************************************
     Begin TL.Media.Slider.js
********************************************** */

/*	TL.Media.SLider
	Produces a Slider
	Takes a data object and populates a dom object
	TODO
	Placeholder
================================================== */

TL.Media.Slider = TL.Media.extend({
	
	includes: [TL.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		
		this._el.content_item				= TL.Dom.create("img", "tl-media-item tl-media-image", this._el.content);
		this._el.content_item.src			= this.data.url;
		
		this.onLoaded();
	}
	
});

/* **********************************************
     Begin TL.Media.SoundCloud.js
********************************************** */

/*	TL.Media.SoundCloud
================================================== */

var soundCoudCreated = false;

TL.Media.SoundCloud = TL.Media.extend({

	includes: [TL.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;

		// Create Dom element
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-iframe tl-media-soundcloud tl-media-shadow", this._el.content);

		// Get Media ID
		this.media_id = this.data.url;

		// API URL
		api_url = "https://soundcloud.com/oembed?url=" + this.media_id + "&format=js&callback=?"

		// API Call
		TL.getJSON(api_url, function(d) {
			TL.Load.js("https://w.soundcloud.com/player/api.js", function() {//load soundcloud api for pausing.
				self.createMedia(d);
			});
		});

	},

	createMedia: function(d) {
		this._el.content_item.innerHTML = d.html;

		this.soundCloudCreated = true;

		self.widget = SC.Widget(this._el.content_item.querySelector("iframe"));//create widget for api use

		// After Loaded
		this.onLoaded();
	},

	_stopMedia: function() {
		if (this.soundCloudCreated)
		{
			self.widget.pause();
		}
	}

});


/* **********************************************
     Begin TL.Media.Spotify.js
********************************************** */

/*	TL.Media.Spotify
================================================== */

TL.Media.Spotify = TL.Media.extend({

	includes: [TL.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;

		// Create Dom element
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-iframe tl-media-spotify", this._el.content);

		// Get Media ID
		if (this.data.url.match(/^spotify:track/) || this.data.url.match(/^spotify:album/) || this.data.url.match(/^spotify:user:.+:playlist:/)) {
			this.media_id = this.data.url;
		}

		if (this.data.url.match(/spotify\.com\/track\/(.+)/)) {
			this.media_id = "spotify:track:" + this.data.url.match(/spotify\.com\/track\/(.+)/)[1];
		} else if (this.data.url.match(/spotify\.com\/album\/(.+)/)) {
			this.media_id = "spotify:album:" + this.data.url.match(/spotify\.com\/album\/(.+)/)[1];
		} else if (this.data.url.match(/spotify\.com\/user\/(.+?)\/playlist\/(.+)/)) {
			var user = this.data.url.match(/spotify\.com\/user\/(.+?)\/playlist\/(.+)/)[1];
			var playlist = this.data.url.match(/spotify\.com\/user\/(.+?)\/playlist\/(.+)/)[2];
			this.media_id = "spotify:user:" + user + ":playlist:" + playlist;
		} else if (this.data.url.match(/spotify\.com\/artist\/(.+)/)) {
			var artist = this.data.url.match(/spotify\.com\/artist\/(.+)/)[1];
			this.media_id = "spotify:artist:" + artist;
		}


		if (this.media_id) {
			// API URL
			api_url = "https://embed.spotify.com/?uri=" + this.media_id + "&theme=white&view=coverart";

			this.player = TL.Dom.create("iframe", "tl-media-shadow", this._el.content_item);
			this.player.width 		= "100%";
			this.player.height 		= "100%";
			this.player.frameBorder = "0";
			this.player.src 		= api_url;

			// After Loaded
			this.onLoaded();

		} else {
				this.loadErrorDisplay(this._('spotify_invalid_url'));
		}
	},

	// Update Media Display

	_updateMediaDisplay: function(l) {
		var _height = this.options.height,
			_player_height = 0,
			_player_width = 0;

		if (TL.Browser.mobile) {
			_height = (this.options.height/2);
		} else {
			_height = this.options.height - this.options.credit_height - this.options.caption_height - 30;
		}

		this._el.content_item.style.maxHeight = "none";
		trace(_height);
		trace(this.options.width)
		if (_height > this.options.width) {
			trace("height is greater")
			_player_height = this.options.width + 80 + "px";
			_player_width = this.options.width + "px";
		} else {
			trace("width is greater")
			trace(this.options.width)
			_player_height = _height + "px";
			_player_width = _height - 80 + "px";
		}


		this.player.style.width = _player_width;
		this.player.style.height = _player_height;

		if (this._el.credit) {
			this._el.credit.style.width		= _player_width;
		}
		if (this._el.caption) {
			this._el.caption.style.width		= _player_width;
		}
	},


	_stopMedia: function() {
		// Need spotify stop code

	}

});


/* **********************************************
     Begin TL.Media.Storify.js
********************************************** */

/*	TL.Media.Storify
================================================== */

TL.Media.Storify = TL.Media.extend({
	
	includes: [TL.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var content;
				
		// Create Dom element
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-iframe tl-media-storify", this._el.content);
		
		// Get Media ID
		this.media_id = this.data.url;
		
		// Content
		content =	"<iframe frameborder='0' width='100%' height='100%' src='" + this.media_id + "/embed'></iframe>";
		content +=	"<script src='" + this.media_id + ".js'></script>";
		
		// API Call
		this._el.content_item.innerHTML = content;
		
		// After Loaded
		this.onLoaded();
	},
	
	// Update Media Display
	_updateMediaDisplay: function() {
		this._el.content_item.style.height = this.options.height + "px";
	}
	
	
});


/* **********************************************
     Begin TL.Media.Text.js
********************************************** */

TL.Media.Text = TL.Class.extend({
	
	includes: [TL.Events],
	
	// DOM ELEMENTS
	_el: {
		container: {},
		content_container: {},
		content: {},
		headline: {},
		date: {}
	},
	
	// Data
	data: {
		unique_id: 			"",
		headline: 			"headline",
		text: 				"text"
	},
	
	// Options
	options: {
		title: 			false
	},
	
	/*	Constructor
	================================================== */
	initialize: function(data, options, add_to_container) {
		
		TL.Util.setData(this, data);
		
		// Merge Options
		TL.Util.mergeData(this.options, options);
		
		this._el.container = TL.Dom.create("div", "tl-text");
		this._el.container.id = this.data.unique_id;
		
		this._initLayout();
		
		if (add_to_container) {
			add_to_container.appendChild(this._el.container);
		};
		
	},
	
	/*	Adding, Hiding, Showing etc
	================================================== */
	show: function() {
		
	},
	
	hide: function() {
		
	},
	
	addTo: function(container) {
		container.appendChild(this._el.container);
		//this.onAdd();
	},
	
	removeFrom: function(container) {
		container.removeChild(this._el.container);
	},
	
	headlineHeight: function() {
		return this._el.headline.offsetHeight + 40;
	},
	
	addDateText: function(str) {
		this._el.date.innerHTML = str;
	},
	
	/*	Events
	================================================== */
	onLoaded: function() {
		this.fire("loaded", this.data);
	},
	
	onAdd: function() {
		this.fire("added", this.data);
	},

	onRemove: function() {
		this.fire("removed", this.data);
	},
	
	/*	Private Methods
	================================================== */
	_initLayout: function () {
		
		// Create Layout
		this._el.content_container			= TL.Dom.create("div", "tl-text-content-container", this._el.container);
		
		// Date
		this._el.date 				= TL.Dom.create("h3", "tl-headline-date", this._el.content_container);
		
		// Headline
		if (this.data.headline != "") {
			var headline_class = "tl-headline";
			if (this.options.title) {
				headline_class = "tl-headline tl-headline-title";
			}
			this._el.headline				= TL.Dom.create("h2", headline_class, this._el.content_container);
			this._el.headline.innerHTML		= this.data.headline;
		}

		// Text
		if (this.data.text != "") {
			var text_content = "";

			text_content += TL.Util.htmlify(this.options.autolink == true ? TL.Util.linkify(this.data.text) : this.data.text);
			trace(this.data.text);
			this._el.content				= TL.Dom.create("div", "tl-text-content", this._el.content_container);
			this._el.content.innerHTML		= text_content;
			trace(text_content);
			trace(this._el.content)
		}

		// Fire event that the slide is loaded
		this.onLoaded();

	}

});


/* **********************************************
     Begin TL.Media.Twitter.js
********************************************** */

/*	TL.Media.Twitter
	Produces Twitter Display
================================================== */

TL.Media.Twitter = TL.Media.extend({
	
	includes: [TL.Events],
    

	
	/*	Load the media
	================================================== */

	_loadMedia: function() {
		var api_url,
			self = this;
					
		// Create Dom element
		this._el.content_item = TL.Dom.create("div", "tl-media-twitter", this._el.content);
		this._el.content_container.className = "tl-media-content-container tl-media-content-container-text";
        		
		// Get Media ID
        if(this.data.url.match("^(https?:)?\/*(www.)?twitter\.com"))
        {
		if (this.data.url.match("status\/")) {
			this.media_id = this.data.url.split("status\/")[1];
		} else if (this.data.url.match("statuses\/")) {
			this.media_id = this.data.url.split("statuses\/")[1];
		} else {
			this.media_id = "";
		}
        }
        
        else if(this.data.url.match("<blockquote class=['\"]twitter-tweet['\"]")) {
		
        var found = this.data.url.match(/(status|statuses)\/(\d+)/);
		if (found && found.length > 2) {
		    this.media_id = found[2];
		} else {
		    self.loadErrorDisplay(self._("twitterembed_invalidurl_err"));
		    return;
		}
    }
        
		// API URL
		api_url = "https://api.twitter.com/1/statuses/oembed.json?id=" + this.media_id + "&omit_script=true&include_entities=true&callback=?";
		
		// API Call
		TL.ajax({
			type: 'GET',
			url: api_url,
			dataType: 'json', //json data type
			success: function(d){
				self.createMedia(d);
			},
			error:function(xhr, type){
				var error_text = "";
				error_text += self._("twitter_load_err") + "<br/>" + self.media_id + "<br/>" + type;
				self.loadErrorDisplay(error_text);
			}
		});
		 
	},
	
	createMedia: function(d) {
        trace("create_media")	
		var tweet				= "",
			tweet_text			= "",
			tweetuser			= "",
			tweet_status_temp 	= "",
			tweet_status_url 	= "",
			tweet_status_date 	= "",
            self = this;
			
		//	TWEET CONTENT
		tweet_text 			= d.html.split("<\/p>\&mdash;")[0] + "</p></blockquote>";
		tweetuser			= d.author_url.split("twitter.com\/")[1];
		tweet_status_temp 	= d.html.split("<\/p>\&mdash;")[1].split("<a href=\"")[1];
		tweet_status_url 	= tweet_status_temp.split("\"\>")[0];
		tweet_status_date 	= tweet_status_temp.split("\"\>")[1].split("<\/a>")[0];
		
		// Open links in new window
		tweet_text = tweet_text.replace(/<a href/ig, '<a target="_blank" href');
        
        if (tweet_text.includes("pic.twitter.com")) {
            
            TL.Load.js('https://platform.twitter.com/widgets.js', function() {
                twttr.widgets.createTweet(self.media_id, self._el.content_item,
                {
                    conversation : 'none',    // or all
                    linkColor    : '#cc0000', // default is blue
                    theme        : 'light'    // or dark
                })
            });
            
            this.onLoaded();
            
        } else {

            // 	TWEET CONTENT
            tweet += tweet_text;

            //	TWEET AUTHOR
            tweet += "<div class='vcard'>";
            tweet += "<a href='" + tweet_status_url + "' class='twitter-date' target='_blank'>" + tweet_status_date + "</a>";
            tweet += "<img src='" + "' class='tl-media-item tl-media-image' target='_blank'>" + "</a>";
            tweet += "<div class='author'>";
            tweet += "<a class='screen-name url' href='" + d.author_url + "' target='_blank'>";
            tweet += "<span class='avatar'></span>";
            tweet += "<span class='fn'>" + d.author_name + " <span class='tl-icon-twitter'></span></span>";
            tweet += "<span class='nickname'>@" + tweetuser + "<span class='thumbnail-inline'></span></span>";
            tweet += "</a>";
            tweet += "</div>";
            tweet += "</div>";


            // Add to DOM
            this._el.content_item.innerHTML	= tweet;

            // After Loaded
            this.onLoaded();
        }
    },
	
    
	updateMediaDisplay: function() {
		
	},
	
	_updateMediaDisplay: function() {
		
	},
    
	
	
	
});


/* **********************************************
     Begin TL.Media.TwitterEmbed.js
********************************************** */

/*	TL.Media.TwitterEmbed
	Produces Twitter Display
================================================== */

        var mediaID;

TL.Media.TwitterEmbed = TL.Media.extend({
	includes: [TL.Events],
    

	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;
					
		// Create Dom element
		this._el.content_item = TL.Dom.create("div", "tl-media-twitter", this._el.content);
		this._el.content_container.className = "tl-media-content-container tl-media-content-container-text";
		
		// Get Media ID
		var found = this.data.url.match(/(status|statuses)\/(\d+)/);
		if (found && found.length > 2) {
		    this.media_id = found[2];
		} else {
		    self.loadErrorDisplay(self._("twitterembed_invalidurl_err"));
		    return;
		}

		// API URL
		api_url = "https://api.twitter.com/1/statuses/oembed.json?id=" + this.media_id + "&omit_script=true&include_entities=true&callback=?";
        
        window.twttr = (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0],
            t = window.twttr || {};
            if (d.getElementById(id)) return t;
            js = d.createElement(s);
            js.id = id;
            js.src = "https://platform.twitter.com/widgets.js";
            fjs.parentNode.insertBefore(js, fjs);

            t._e = [];
            t.ready = function(f) {
            t._e.push(f);
            };

            return t;
        }(document, "script", "twitter-wjs"));
        
        mediaID = this.media_id;
		
		// API Call
		TL.ajax({
			type: 'GET',
			url: api_url,
			dataType: 'json', //json data type
			success: function(d){
				self.createMedia(d);
			},
			error:function(xhr, type){
				var error_text = "";
				error_text += self._("twitter_load_err") + "<br/>" + self.media_id + "<br/>" + type;
				self.loadErrorDisplay(error_text);
			}
		});
		 
	},
	
	createMedia: function(d) {	
		trace("create_media")	
		var tweet				= "",
			tweet_text			= "",
			tweetuser			= "",
			tweet_status_temp 	= "",
			tweet_status_url 	= "",
			tweet_status_date 	= "";
			
		//	TWEET CONTENT
		tweet_text 			= d.html.split("<\/p>\&mdash;")[0] + "</p></blockquote>";
        console.log(tweet_text);
		tweetuser			= d.author_url.split("twitter.com\/")[1];
		tweet_status_temp 	= d.html.split("<\/p>\&mdash;")[1].split("<a href=\"")[1];
		tweet_status_url 	= tweet_status_temp.split("\"\>")[0];
		tweet_status_date 	= tweet_status_temp.split("\"\>")[1].split("<\/a>")[0];
		
		// Open links in new window
		tweet_text = tweet_text.replace(/<a href/ig, '<a target="_blank" href');
        
        if (tweet_text.includes("pic.twitter.com")) {
            twttr.ready(
                function(evt) {
                    tweet = document.getElementsByClassName("tl-media-twitter")[0];
                    var id = String(mediaID);
                    twttr.widgets.createTweet(id, tweet,
                        {
                            conversation : 'none',    // or all
                            linkColor    : '#cc0000', // default is blue
                            theme        : 'light'    // or dark
                        })
                    .then(function (evt) {
                        this.onLoaded();
                    });
                }
            );
            this._el.content_item.innerHTML	= tweet;
            this.onLoaded();
        } else{
            // 	TWEET CONTENT
            tweet += tweet_text;

            //	TWEET AUTHOR
            tweet += "<div class='vcard'>";
            tweet += "<a href='" + tweet_status_url + "' class='twitter-date' target='_blank'>" + tweet_status_date + "</a>";
            tweet += "<div class='author'>";
            tweet += "<a class='screen-name url' href='" + d.author_url + "' target='_blank'>";
            tweet += "<span class='avatar'></span>";
            tweet += "<span class='fn'>" + d.author_name + " <span class='tl-icon-twitter'></span></span>";
            tweet += "<span class='nickname'>@" + tweetuser + "<span class='thumbnail-inline'></span></span>";
            tweet += "</a>";
            tweet += "</div>";
            tweet += "</div>";


            // Add to DOM
            this._el.content_item.innerHTML	= tweet;

            // After Loaded
            this.onLoaded();
        }
			
	},
	
	updateMediaDisplay: function() {
		
	},
	
	_updateMediaDisplay: function() {
		
	}
	
	
	
});

/* **********************************************
     Begin TL.Media.Vimeo.js
********************************************** */

/*	TL.Media.Vimeo
================================================== */

TL.Media.Vimeo = TL.Media.extend({

	includes: [TL.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;

		// Create Dom element
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-iframe tl-media-vimeo tl-media-shadow", this._el.content);

		// Get Media ID
		this.media_id = this.data.url.split(/video\/|\/\/vimeo\.com\//)[1].split(/[?&]/)[0];
		var start_time = null;

		// Get start time
		if (this.data.url.match(/#t=([^&]+).*/)) {
			start_time = this.data.url.match(/#t=([^&]+).*/)[1];
		}

		// API URL
		api_url = "https://player.vimeo.com/video/" + this.media_id + "?api=1&title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff";
		if (start_time) {
			api_url = api_url += '&amp;#t=' + start_time;
		}

		this.player = TL.Dom.create("iframe", "", this._el.content_item);

		// Media Loaded Event
		this.player.addEventListener('load', function(e) {
			self.onMediaLoaded();
		});

		this.player.width 		= "100%";
		this.player.height 		= "100%";
		this.player.frameBorder = "0";
		this.player.src 		= api_url;

		this.player.setAttribute('allowfullscreen', '');
		this.player.setAttribute('webkitallowfullscreen', '');
		this.player.setAttribute('mozallowfullscreen', '');

		// After Loaded
		this.onLoaded();
	},

	// Update Media Display
	_updateMediaDisplay: function() {
		this._el.content_item.style.height = TL.Util.ratio.r16_9({w:this._el.content_item.offsetWidth}) + "px";
	},

	_stopMedia: function() {

		try {
			this.player.contentWindow.postMessage(JSON.stringify({method: "pause"}), "https://player.vimeo.com");
		}
		catch(err) {
			trace(err);
		}
	}
});


/* **********************************************
     Begin TL.Media.Vine.js
********************************************** */

/*	TL.Media.Vine

================================================== */

TL.Media.Vine = TL.Media.extend({

	includes: [TL.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;

		// Create Dom element
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-iframe tl-media-vine tl-media-shadow", this._el.content);

		// Get Media ID
		this.media_id = this.data.url.split("vine.co/v/")[1];

		// API URL
		api_url = "https://vine.co/v/" + this.media_id + "/embed/simple";

		// API Call
		this._el.content_item.innerHTML = "<iframe frameborder='0' width='100%' height='100%' src='" + api_url + "'></iframe><script async src='https://platform.vine.co/static/scripts/embed.js' charset='utf-8'></script>"		

		// After Loaded
		this.onLoaded();
	},

	// Update Media Display
	_updateMediaDisplay: function() {
		var size = TL.Util.ratio.square({w:this._el.content_item.offsetWidth , h:this.options.height});
		this._el.content_item.style.height = size.h + "px";
	},

	_stopMedia: function() {
		this._el.content_item.querySelector("iframe").contentWindow.postMessage('pause', '*');
	}

});


/* **********************************************
     Begin TL.Media.Website.js
********************************************** */

/*	TL.Media.Website
	Uses Embedly
	http://embed.ly/docs/api/extract/endpoints/1/extract
================================================== */

TL.Media.Website = TL.Media.extend({

	includes: [TL.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var self = this;

		// Get Media ID
		this.media_id = this.data.url.replace(/.*?:\/\//g, "");

		if (this.options.api_key_embedly) {
			// API URL
			api_url = "https://api.embed.ly/1/extract?key=" + this.options.api_key_embedly + "&url=" + this.media_id + "&callback=?";

			// API Call
			TL.getJSON(api_url, function(d) {
				self.createMedia(d);
			});
		} else {
			this.createCardContent();
		}
	},

	createCardContent: function() {
		(function(w, d){
			var id='embedly-platform', n = 'script';
			if (!d.getElementById(id)){
			 w.embedly = w.embedly || function() {(w.embedly.q = w.embedly.q || []).push(arguments);};
			 var e = d.createElement(n); e.id = id; e.async=1;
			 e.src = ('https:' === document.location.protocol ? 'https' : 'http') + '://cdn.embedly.com/widgets/platform.js';
			 var s = d.getElementsByTagName(n)[0];
			 s.parentNode.insertBefore(e, s);
			}
		})(window, document);

		var content = "<a href=\"" + this.data.url + "\" class=\"embedly-card\">" + this.data.url + "</a>";
		this._setContent(content);

	},
	createMedia: function(d) { // this costs API credits...
		var content = "";


		content		+=	"<h4><a href='" + this.data.url + "' target='_blank'>" + d.title + "</a></h4>";
		if (d.images) {
			if (d.images[0]) {
				trace(d.images[0].url);
				content		+=	"<img src='" + d.images[0].url + "' />";
			}
		}
		if (d.favicon_url) {
			content		+=	"<img class='tl-media-website-icon' src='" + d.favicon_url + "' />";
		}
		content		+=	"<span class='tl-media-website-description'>" + d.provider_name + "</span><br/>";
		content		+=	"<p>" + d.description + "</p>";

		this._setContent(content);
	},

	_setContent: function(content) {
		// Create Dom element
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-website", this._el.content);
		this._el.content_container.className = "tl-media-content-container tl-media-content-container-text";
		this._el.content_item.innerHTML = content;

		// After Loaded
		this.onLoaded();

	},

	updateMediaDisplay: function() {

	},

	_updateMediaDisplay: function() {

	}


});


/* **********************************************
     Begin TL.Media.Wikipedia.js
********************************************** */

/*	TL.Media.Wikipedia
================================================== */

TL.Media.Wikipedia = TL.Media.extend({

	includes: [TL.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			api_language,
			self = this;

		// Create Dom element
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-wikipedia", this._el.content);
		this._el.content_container.className = "tl-media-content-container tl-media-content-container-text";

		// Get Media ID
		this.media_id	 = this.data.url.split("wiki\/")[1].split("#")[0].replace("_", " ");
		this.media_id	 = this.media_id.replace(" ", "%20");
		api_language	 = this.data.url.split("//")[1].split(".wikipedia")[0];

		// API URL
		api_url = "https://" + api_language + ".wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&redirects=&titles=" + this.media_id + "&exintro=1&format=json&callback=?";

		// API Call
		TL.ajax({
			type: 'GET',
			url: api_url,
			dataType: 'json', //json data type

			success: function(d){
				self.createMedia(d);
			},
			error:function(xhr, type){
				var error_text = "";
				error_text += self._("wikipedia_load_err") + "<br/>" + self.media_id + "<br/>" + type;
				self.loadErrorDisplay(error_text);
			}
		});

	},

	createMedia: function(d) {
		var wiki = "";

		if (d.query) {
			var content = "",
				wiki = {
					entry: {},
					title: "",
					text: "",
					extract: "",
					paragraphs: 1,
					page_image: "",
					text_array: []
				};

			wiki.entry		 = TL.Util.getObjectAttributeByIndex(d.query.pages, 0);
			wiki.extract	 = wiki.entry.extract;
			wiki.title		 = wiki.entry.title;
			wiki.page_image	 = wiki.entry.thumbnail;

			if (wiki.extract.match("<p>")) {
				wiki.text_array = wiki.extract.split("<p>");
			} else {
				wiki.text_array.push(wiki.extract);
			}

			for(var i = 0; i < wiki.text_array.length; i++) {
				if (i+1 <= wiki.paragraphs && i+1 < wiki.text_array.length) {
					wiki.text	+= "<p>" + wiki.text_array[i+1];
				}
			}


			content		+=	"<span class='tl-icon-wikipedia'></span>";
			content		+=	"<div class='tl-wikipedia-title'><h4><a href='" + this.data.url + "' target='_blank'>" + wiki.title + "</a></h4>";
			content		+=	"<span class='tl-wikipedia-source'>" + this._('wikipedia') + "</span></div>";

			if (wiki.page_image) {
				//content 	+= 	"<img class='tl-wikipedia-pageimage' src='" + wiki.page_image.source +"'>";
			}

			content		+=	wiki.text;

			if (wiki.extract.match("REDIRECT")) {

			} else {
				// Add to DOM
				this._el.content_item.innerHTML	= content;
				// After Loaded
				this.onLoaded();
			}


		}

	},

	updateMediaDisplay: function() {

	},

	_updateMediaDisplay: function() {

	}

});


/* **********************************************
     Begin TL.Media.Wistia.js
********************************************** */

/*	TL.Media.Wistia
================================================== */

TL.Media.Wistia = TL.Media.extend({

	includes: [TL.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;

		// Create Dom element
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-iframe tl-media-wistia tl-media-shadow", this._el.content);

		// Get Media ID
		this.media_id = this.data.url.split(/https?:\/\/(.+)?(wistia\.com|wi\.st)\/medias\/(.*)/)[3];

		// API URL
		api_url = "https://fast.wistia.com/embed/iframe/" + this.media_id + "?version=v1&controlsVisibleOnLoad=true&playerColor=aae3d8";

    this.player = TL.Dom.create("iframe", "", this._el.content_item);

    // Media Loaded Event
		this.player.addEventListener('load', function(e) {
			self.onMediaLoaded();
		});

		this.player.width 		= "100%";
		this.player.height 		= "100%";
		this.player.frameBorder = "0";
		this.player.src 		= api_url;

		this.player.setAttribute('allowfullscreen', '');
		this.player.setAttribute('webkitallowfullscreen', '');
		this.player.setAttribute('mozallowfullscreen', '');

		// After Loaded
		this.onLoaded();
	},

	// Update Media Display
	_updateMediaDisplay: function() {
		this._el.content_item.style.height = TL.Util.ratio.r16_9({w:this._el.content_item.offsetWidth}) + "px";
	},

	_stopMedia: function() {
		try {
			this.player.contentWindow.postMessage(JSON.stringify({method: "pause"}), "https://player.vimeo.com");
		}
		catch(err) {
			trace(err);
		}
	}
});


/* **********************************************
     Begin TL.Media.YouTube.js
********************************************** */

/*	TL.Media.YouTube
================================================== */

TL.Media.YouTube = TL.Media.extend({

	includes: [TL.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var self = this,
			url_vars;

		this.youtube_loaded = false;

		// Create Dom element
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-youtube tl-media-shadow", this._el.content);
		this._el.content_item.id = TL.Util.unique_ID(7)

		// URL Vars
		url_vars = TL.Util.getUrlVars(this.data.url);

		// Get Media ID
		this.media_id = {};

		if (this.data.url.match('v=')) {
			this.media_id.id	= url_vars["v"];
		} else if (this.data.url.match('\/embed\/')) {
			this.media_id.id	= this.data.url.split("embed\/")[1].split(/[?&]/)[0];
		} else if (this.data.url.match(/v\/|v=|youtu\.be\//)){
			this.media_id.id	= this.data.url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
		} else {
			trace("YOUTUBE IN URL BUT NOT A VALID VIDEO");
		}

		// Get start second
		if (this.data.url.match("start=")) {
			this.media_id.start = parseInt(this.data.url.split("start=")[1], 10);
		}
		else if (this.data.url.match("t=")) {
			this.media_id.start = parseInt(this.data.url.split("t=")[1], 10);
		}

		//Get end second
		if (this.data.url.match("end=")) {
			this.media_id.end = parseInt(this.data.url.split("end=")[1], 10);
		}

		this.media_id.hd		= Boolean(typeof(url_vars["hd"]) != 'undefined');


		// API Call
		TL.Load.js('https://www.youtube.com/iframe_api', function() {
			self.createMedia();
		});

	},

	// Update Media Display
	_updateMediaDisplay: function() {
		//this.el.content_item = document.getElementById(this._el.content_item.id);
		this._el.content_item.style.height = TL.Util.ratio.r16_9({w:this.options.width}) + "px";
		this._el.content_item.style.width = this.options.width + "px";
	},

	_stopMedia: function() {
		if (this.youtube_loaded) {
			try {
			    if(this.player.getPlayerState() == YT.PlayerState.PLAYING) {
			        this.player.pauseVideo();
			    }
			}
			catch(err) {
				trace(err);
			}

		}
	},
	createMedia: function() {
		var self = this;

		clearTimeout(this.timer);

		if(typeof YT != 'undefined' && typeof YT.Player != 'undefined') {
			// Create Player
			this.player = new YT.Player(this._el.content_item.id, {
				playerVars: {
					enablejsapi:		1,
					color: 				'white',
					controls: 1, 
					start:				this.media_id.start,
					end:  				this.media_id.end,
					fs: 				1
				},
				videoId: this.media_id.id,
				events: {
					onReady: 			function() {
						self.onPlayerReady();
						// After Loaded
						self.onLoaded();
					},
					'onStateChange': 	self.onStateChange
				}
			});
		} else {
			this.timer = setTimeout(function() {
				self.createMedia();
			}, 1000);
		}
	},

	/*	Events
	================================================== */
	onPlayerReady: function(e) {
		this.youtube_loaded = true;
		this._el.content_item = document.getElementById(this._el.content_item.id);
		this.onMediaLoaded();

	},

	onStateChange: function(e) {
        if(e.data == YT.PlayerState.ENDED) {
            e.target.seekTo(0);
            e.target.pauseVideo();
        }
	}


});


/* **********************************************
     Begin TL.Media.Audio.js
********************************************** */

/*	TL.Media.Audio
	Produces audio assets.
	Takes a data object and populates a dom object
================================================== */

TL.Media.Audio = TL.Media.extend({

	includes: [TL.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		// Loading Message
		this.loadingMessage();

        // Create media?
        if(!this.options.background) {
            this.createMedia();
        }

        // After loaded
		this.onLoaded();
	},

  createMedia: function() {
    var self = this,
        audio_class = "tl-media-item tl-media-audio tl-media-shadow";

 		// Link
		if (this.data.link) {
			this._el.content_link 				= TL.Dom.create("a", "", this._el.content);
			this._el.content_link.href 		= this.data.link;
			this._el.content_link.target 	= "_blank";
			this._el.content_item					= TL.Dom.create("audio", audio_class, this._el.content_link);
		} else {
			this._el.content_item					= TL.Dom.create("audio", audio_class, this._el.content);
		}

		this._el.content_item.controls = true;
		this._el.source_item = TL.Dom.create("source", "", this._el.content_item);

		// Media Loaded Event
		this._el.content_item.addEventListener('load', function(e) {
			self.onMediaLoaded();
		});

		this._el.source_item.src = this.data.url;
		this._el.source_item.type = this._getType(this.data.url, this.data.mediatype.match_str);
		this._el.content_item.innerHTML += "Your browser doesn't support HTML5 audio with " + this._el.source_item.type;
  },

	_updateMediaDisplay: function(layout) {
		if(TL.Browser.firefox) {
			this._el.content_item.style.width = "auto";
		}
	},

	_getType: function(url, reg) {
		var ext = url.match(reg);
		var type = "audio/"
		switch(ext[1]) {
			case "mp3":
				type += "mpeg";
				break;
			case "wav":
				type += "wav";
				break;
			case "m4a":
				type += "mp4";
				break;
			default:
				type = "audio";
				break;
		}
		return type
	}

});


/* **********************************************
     Begin TL.Media.Video.js
********************************************** */

/*	TL.Media.Video
	Produces video assets.
	Takes a data object and populates a dom object
================================================== */

TL.Media.Video = TL.Media.extend({

	includes: [TL.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		// Loading Message
		this.loadingMessage();

        // Create media?
        if(!this.options.background) {
            this.createMedia();
        }

        // After loaded
		this.onLoaded();
	},

  createMedia: function() {
    var self = this,
        video_class = "tl-media-item tl-media-video tl-media-shadow";

 		// Link
		if (this.data.link) {
			this._el.content_link 				= TL.Dom.create("a", "", this._el.content);
			this._el.content_link.href 		= this.data.link;
			this._el.content_link.target 	= "_blank";
			this._el.content_item					= TL.Dom.create("video", video_class, this._el.content_link);
		} else {
			this._el.content_item					= TL.Dom.create("video", video_class, this._el.content);
		}

		this._el.content_item.controls = true;
		this._el.source_item = TL.Dom.create("source", "", this._el.content_item);

		// Media Loaded Event
		this._el.content_item.addEventListener('load', function(e) {
			self.onMediaLoaded();
		});

		this._el.source_item.src = this.data.url;
		this._el.source_item.type = this._getType(this.data.url, this.data.mediatype.match_str);
		this._el.content_item.innerHTML += "Your browser doesn't support HTML5 video with " + this._el.source_item.type;
  },

	_updateMediaDisplay: function(layout) {
		if(TL.Browser.firefox) {
			this._el.content_item.style.width = "auto";
		}
	},

	_getType: function(url, reg) {
		var ext = url.match(reg);
		var type = "video/"
		switch(ext[1]) {
			case "mp4":
				type += "mp4";
				break;
			default:
				type = "video";
				break;
		}
		return type
	}

});


/* **********************************************
     Begin TL.Slide.js
********************************************** */

/*	TL.Slide
	Creates a slide. Takes a data object and
	populates the slide with content.
================================================== */

TL.Slide = TL.Class.extend({

	includes: [TL.Events, TL.DomMixins, TL.I18NMixins],

	_el: {},

	/*	Constructor
	================================================== */
	initialize: function(data, options, title_slide) {
		// DOM Elements
		this._el = {
			container: {},
			scroll_container: {},
			background: {},
			content_container: {},
			content: {}
		};

		// Components
		this._media 		= null;
		this._mediaclass	= {};
		this._text			= {};
		this._background_media = null;

		// State
		this._state = {
			loaded: 		false
		};

		this.has = {
			headline: 	false,
			text: 		false,
			media: 		false,
			title: 		false,
			background: {
				image: false,
				color: false,
				color_value :""
			}
		}

		this.has.title = title_slide;

		// Data
		this.data = {
			unique_id: 				null,
			background: 			null,
			start_date: 			null,
			end_date: 				null,
			location: 				null,
			text: 					null,
			media: 					null,
            autolink: true
		};

		// Options
		this.options = {
			// animation
			duration: 			1000,
			slide_padding_lr: 	40,
			ease: 				TL.Ease.easeInSpline,
			width: 				600,
			height: 			600,
			skinny_size: 		650,
			media_name: 		""
		};

		// Actively Displaying
		this.active = false;

		// Animation Object
		this.animator = {};

		// Merge Data and Options
		TL.Util.mergeData(this.options, options);
		TL.Util.mergeData(this.data, data);

		this._initLayout();
		this._initEvents();


	},

	/*	Adding, Hiding, Showing etc
	================================================== */
	show: function() {
		this.animator = TL.Animate(this._el.slider_container, {
			left: 		-(this._el.container.offsetWidth * n) + "px",
			duration: 	this.options.duration,
			easing: 	this.options.ease
		});
	},

	hide: function() {

	},

	setActive: function(is_active) {
		this.active = is_active;

		if (this.active) {
			if (this.data.background) {
				this.fire("background_change", this.has.background);
			}
			this.loadMedia();
		} else {
			this.stopMedia();
		}
	},

	addTo: function(container) {
		container.appendChild(this._el.container);
		//this.onAdd();
	},

	removeFrom: function(container) {
		container.removeChild(this._el.container);
	},

	updateDisplay: function(w, h, l) {
		this._updateDisplay(w, h, l);
	},

	loadMedia: function() {
        var self = this;

		if (this._media && !this._state.loaded) {
			this._media.loadMedia();
			this._state.loaded = true;
		}

		if(this._background_media && !this._background_media._state.loaded) {
		    this._background_media.on("loaded", function() {
		        self._updateBackgroundDisplay();
		    });
		    this._background_media.loadMedia();
		}
	},

	stopMedia: function() {
		if (this._media && this._state.loaded) {
			this._media.stopMedia();
		}
	},

	getBackground: function() {
		return this.has.background;
	},

	scrollToTop: function() {
		this._el.container.scrollTop = 0;
	},

	getFormattedDate: function() {

		if (TL.Util.trim(this.data.display_date).length > 0) {
			return this.data.display_date;
		}
		var date_text = "";

		if(!this.has.title) {
            if (this.data.end_date) {
                date_text = " &mdash; " + this.data.end_date.getDisplayDate(this.getLanguage());
            }
            if (this.data.start_date) {
                date_text = this.data.start_date.getDisplayDate(this.getLanguage()) + date_text;
            }
        }
		return date_text;
	},

	/*	Events
	================================================== */


	/*	Private Methods
	================================================== */
	_initLayout: function () {
		// Create Layout
		this._el.container 				= TL.Dom.create("div", "tl-slide");

		if (this.has.title) {
			this._el.container.className = "tl-slide tl-slide-titleslide";
		}

		if (this.data.unique_id) {
			this._el.container.id 		= this.data.unique_id;
		}
		this._el.scroll_container 		= TL.Dom.create("div", "tl-slide-scrollable-container", this._el.container);
		this._el.content_container		= TL.Dom.create("div", "tl-slide-content-container", this._el.scroll_container);
		this._el.content				= TL.Dom.create("div", "tl-slide-content", this._el.content_container);
		this._el.background				= TL.Dom.create("div", "tl-slide-background", this._el.container);
		// Style Slide Background
		if (this.data.background) {
			if (this.data.background.url) {
		    var media_type = TL.MediaType(this.data.background, true);
		    if(media_type) {
          this._background_media = new media_type.cls(this.data.background, {background: 1});

          this.has.background.image 					= true;
          this._el.container.className 				+= ' tl-full-image-background';
          this.has.background.color_value 		= "#000";
          this._el.background.style.display 	= "block";
        }
			}
			if (this.data.background.color) {
				this.has.background.color 					= true;
				this._el.container.className 				+= ' tl-full-color-background';
				this.has.background.color_value 			= this.data.background.color;
				//this._el.container.style.backgroundColor = this.data.background.color;
				//this._el.background.style.backgroundColor 	= this.data.background.color;
				//this._el.background.style.display 			= "block";
			}
			if (this.data.background.text_background) {
				this._el.container.className 				+= ' tl-text-background';
			}

		}



		// Determine Assets for layout and loading
		if (this.data.media && this.data.media.url && this.data.media.url != "") {
			this.has.media = true;
		}
		if (this.data.text && this.data.text.text) {
			this.has.text = true;
		}
		if (this.data.text && this.data.text.headline) {
			this.has.headline = true;
		}

		// Create Media
		if (this.has.media) {
			// Determine the media type
			this.data.media.mediatype = TL.MediaType(this.data.media);
			this.options.media_name 	= this.data.media.mediatype.name;
			this.options.media_type 	= this.data.media.mediatype.type;
      this.options.autolink 		= this.data.autolink;

			// Create a media object using the matched class name
			this._media = new this.data.media.mediatype.cls(this.data.media, this.options);
		}

		// Create Text
		if (this.has.text || this.has.headline) {
			this._text = new TL.Media.Text(this.data.text, {title:this.has.title,language: this.options.language, autolink: this.data.autolink });
			this._text.addDateText(this.getFormattedDate());
		}



		// Add to DOM
		if (!this.has.text && !this.has.headline && this.has.media) {
			TL.DomUtil.addClass(this._el.container, 'tl-slide-media-only');
			this._media.addTo(this._el.content);
		} else if (this.has.headline && this.has.media && !this.has.text) {
			TL.DomUtil.addClass(this._el.container, 'tl-slide-media-only');
			this._text.addTo(this._el.content);
			this._media.addTo(this._el.content);
		} else if (this.has.text && this.has.media) {
			this._media.addTo(this._el.content);
			this._text.addTo(this._el.content);
		} else if (this.has.text || this.has.headline) {
			TL.DomUtil.addClass(this._el.container, 'tl-slide-text-only');
			this._text.addTo(this._el.content);
		}

		// Fire event that the slide is loaded
		this.onLoaded();

	},

	_initEvents: function() {

	},

	// Update Display
	_updateDisplay: function(width, height, layout) {
		var content_width,
			content_padding_left = this.options.slide_padding_lr,
			content_padding_right = this.options.slide_padding_lr;

		if (width) {
			this.options.width 					= width;
		} else {
			this.options.width 					= this._el.container.offsetWidth;
		}

		content_width = this.options.width - (this.options.slide_padding_lr * 2);

		if(TL.Browser.mobile && (this.options.width <= this.options.skinny_size)) {
			content_padding_left = 0;
			content_padding_right = 0;
			content_width = this.options.width;
		} else if (layout == "landscape") {

		} else if (this.options.width <= this.options.skinny_size) {
			content_padding_left = 50;
			content_padding_right = 50;
			content_width = this.options.width - content_padding_left - content_padding_right;
		} else {

		}

		this._el.content.style.paddingLeft 	= content_padding_left + "px";
		this._el.content.style.paddingRight = content_padding_right + "px";
		this._el.content.style.width		= content_width + "px";

		if (height) {
			this.options.height = height;
			//this._el.scroll_container.style.height		= this.options.height + "px";

		} else {
			this.options.height = this._el.container.offsetHeight;
		}

		if (this._media) {

			if (!this.has.text && this.has.headline) {
				this._media.updateDisplay(content_width, (this.options.height - this._text.headlineHeight()), layout);
			} else if (!this.has.text && !this.has.headline) {
				this._media.updateDisplay(content_width, this.options.height, layout);
			} else if (this.options.width <= this.options.skinny_size) {
				this._media.updateDisplay(content_width, this.options.height, layout);
			} else {
				this._media.updateDisplay(content_width/2, this.options.height, layout);
			}
		}

		this._updateBackgroundDisplay();
	},

	_updateBackgroundDisplay: function() {
	    if(this._background_media && this._background_media._state.loaded) {
	        this._el.background.style.backgroundImage 	= "url('" + this._background_media.getImageURL(this.options.width, this.options.height) + "')";
	    }
	}

});


/* **********************************************
     Begin TL.SlideNav.js
********************************************** */

/*	TL.SlideNav
	encapsulate DOM display/events for the 
	'next' and 'previous' buttons on a slide.
================================================== */
// TODO null out data

TL.SlideNav = TL.Class.extend({
	
	includes: [TL.Events, TL.DomMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function(data, options, add_to_container) {
		// DOM ELEMENTS
		this._el = {
			container: {},
			content_container: {},
			icon: {},
			title: {},
			description: {}
		};
	
		// Media Type
		this.mediatype = {};
		
		// Data
		this.data = {
			title: "Navigation",
			description: "Description",
			date: "Date"
		};
	
		//Options
		this.options = {
			direction: 			"previous"
		};
	
		this.animator = null;
		
		// Merge Data and Options
		TL.Util.mergeData(this.options, options);
		TL.Util.mergeData(this.data, data);
		
		
		this._el.container = TL.Dom.create("div", "tl-slidenav-" + this.options.direction);
		
		if (TL.Browser.mobile) {
			this._el.container.setAttribute("ontouchstart"," ");
		}
		
		this._initLayout();
		this._initEvents();
		
		if (add_to_container) {
			add_to_container.appendChild(this._el.container);
		};
		
	},
	
	/*	Update Content
	================================================== */
	update: function(slide) {
		var d = {
			title: "",
			description: "",
			date: slide.getFormattedDate()
		};
		
		if (slide.data.text) {
			if (slide.data.text.headline) {
				d.title = slide.data.text.headline;
			}
		}

		this._update(d);
	},
	
	/*	Color
	================================================== */
	setColor: function(inverted) {
		if (inverted) {
			this._el.content_container.className = 'tl-slidenav-content-container tl-slidenav-inverted';
		} else {
			this._el.content_container.className = 'tl-slidenav-content-container';
		}
	},
	
	/*	Events
	================================================== */
	_onMouseClick: function() {
		this.fire("clicked", this.options);
	},
	
	/*	Private Methods
	================================================== */
	_update: function(d) {
		// update data
		this.data = TL.Util.mergeData(this.data, d);
		
		// Title
		this._el.title.innerHTML = TL.Util.unlinkify(this.data.title);
		
		// Date
		this._el.description.innerHTML	= TL.Util.unlinkify(this.data.date);
	},
	
	_initLayout: function () {
		
		// Create Layout
		this._el.content_container			= TL.Dom.create("div", "tl-slidenav-content-container", this._el.container);
		this._el.icon						= TL.Dom.create("div", "tl-slidenav-icon", this._el.content_container);
		this._el.title						= TL.Dom.create("div", "tl-slidenav-title", this._el.content_container);
		this._el.description				= TL.Dom.create("div", "tl-slidenav-description", this._el.content_container);
		
		this._el.icon.innerHTML				= "&nbsp;"
		
		this._update();
	},
	
	_initEvents: function () {
		TL.DomEvent.addListener(this._el.container, 'click', this._onMouseClick, this);
	}
	
	
});

/* **********************************************
     Begin TL.StorySlider.js
********************************************** */

/*	StorySlider
	is the central class of the API - it is used to create a StorySlider

	Events:
	nav_next
	nav_previous
	slideDisplayUpdate
	loaded
	slideAdded
	slideLoaded
	slideRemoved


================================================== */

TL.StorySlider = TL.Class.extend({

	includes: [TL.Events, TL.I18NMixins],

	/*	Private Methods
	================================================== */
	initialize: function (elem, data, options, init) {

		// DOM ELEMENTS
		this._el = {
			container: {},
			background: {},
			slider_container_mask: {},
			slider_container: {},
			slider_item_container: {}
		};

		this._nav = {};
		this._nav.previous = {};
		this._nav.next = {};

		// Slide Spacing
		this.slide_spacing = 0;

		// Slides Array
		this._slides = [];

		// Swipe Object
		this._swipable;

		// Preload Timer
		this.preloadTimer;

		// Message
		this._message;

		// Current Slide
		this.current_id = '';

		// Data Object
		this.data = {};

		this.options = {
			id: 					"",
			layout: 				"portrait",
			width: 					600,
			height: 				600,
			default_bg_color: 		{r:255, g:255, b:255},
			slide_padding_lr: 		40, 			// padding on slide of slide
			start_at_slide: 		1,
			slide_default_fade: 	"0%", 			// landscape fade
			// animation
			duration: 				1000,
			ease: 					TL.Ease.easeInOutQuint,
			// interaction
			dragging: 				true,
			trackResize: 			true
		};

		// Main element ID
		if (typeof elem === 'object') {
			this._el.container = elem;
			this.options.id = TL.Util.unique_ID(6, "tl");
		} else {
			this.options.id = elem;
			this._el.container = TL.Dom.get(elem);
		}

		if (!this._el.container.id) {
			this._el.container.id = this.options.id;
		}

		// Animation Object
		this.animator = null;

		// Merge Data and Options
		TL.Util.mergeData(this.options, options);
		TL.Util.mergeData(this.data, data);

		if (init) {
			this.init();
		}
	},

	init: function() {
		this._initLayout();
		this._initEvents();
		this._initData();
		this._updateDisplay();

		// Go to initial slide
		this.goTo(this.options.start_at_slide);

		this._onLoaded();
	},

	/* Slides
	================================================== */
	_addSlide:function(slide) {
		slide.addTo(this._el.slider_item_container);
		slide.on('added', this._onSlideAdded, this);
		slide.on('background_change', this._onBackgroundChange, this);
	},

	_createSlide: function(d, title_slide, n) {
		var slide = new TL.Slide(d, this.options, title_slide);
		this._addSlide(slide);
		if(n < 0) {
		    this._slides.push(slide);
		} else {
		    this._slides.splice(n, 0, slide);
		}
	},

	_createSlides: function(array) {
		for (var i = 0; i < array.length; i++) {
			if (array[i].unique_id == "") {
				array[i].unique_id = TL.Util.unique_ID(6, "tl-slide");
			}
            this._createSlide(array[i], false, -1);
		}
	},

	_removeSlide: function(slide) {
		slide.removeFrom(this._el.slider_item_container);
		slide.off('added', this._onSlideRemoved, this);
		slide.off('background_change', this._onBackgroundChange);
	},

	_destroySlide: function(n) {
		this._removeSlide(this._slides[n]);
		this._slides.splice(n, 1);
	},

    _findSlideIndex: function(n) {
        var _n = n;
		if (typeof n == 'string' || n instanceof String) {
			_n = TL.Util.findArrayNumberByUniqueID(n, this._slides, "unique_id");
		}
		return _n;
    },

	/*	Public
	================================================== */
	updateDisplay: function(w, h, a, l) {
		this._updateDisplay(w, h, a, l);
	},

	// Create a slide
	createSlide: function(d, n) {
		this._createSlide(d, false, n);
	},

	// Create Many Slides from an array
	createSlides: function(array) {
		this._createSlides(array);
	},

	// Destroy slide by index
	destroySlide: function(n) {
	    this._destroySlide(n);
	},

	// Destroy slide by id
	destroySlideId: function(id) {
	    this.destroySlide(this._findSlideIndex(id));
	},

	/*	Navigation
	================================================== */
	goTo: function(n, fast, displayupdate) {
		n = parseInt(n);
		if (isNaN(n)) n = 0;

		var self = this;

		this.changeBackground({color_value:"", image:false});

		// Clear Preloader Timer
		if (this.preloadTimer) {
			clearTimeout(this.preloadTimer);
		}

		// Set Slide Active State
		for (var i = 0; i < this._slides.length; i++) {
			this._slides[i].setActive(false);
		}

		if (n < this._slides.length && n >= 0) {
			this.current_id = this._slides[n].data.unique_id;

			// Stop animation
			if (this.animator) {
				this.animator.stop();
			}
			if (this._swipable) {
				this._swipable.stopMomentum();
			}

			if (fast) {
				this._el.slider_container.style.left = -(this.slide_spacing * n) + "px";
				this._onSlideChange(displayupdate);
			} else {
				this.animator = TL.Animate(this._el.slider_container, {
					left: 		-(this.slide_spacing * n) + "px",
					duration: 	this.options.duration,
					easing: 	this.options.ease,
					complete: 	this._onSlideChange(displayupdate)
				});
			}

			// Set Slide Active State
			this._slides[n].setActive(true);

			// Update Navigation and Info
			if (this._slides[n + 1]) {
				this.showNav(this._nav.next, true);
				this._nav.next.update(this._slides[n + 1]);
			} else {
				this.showNav(this._nav.next, false);
			}
			if (this._slides[n - 1]) {
				this.showNav(this._nav.previous, true);
				this._nav.previous.update(this._slides[n - 1]);
			} else {
				this.showNav(this._nav.previous, false);
			}

			// Preload Slides
			this.preloadTimer = setTimeout(function() {
				self.preloadSlides(n);
			}, this.options.duration);
		}
	},

	goToId: function(id, fast, displayupdate) {
		this.goTo(this._findSlideIndex(id), fast, displayupdate);
	},

	preloadSlides: function(n) {
		if (this._slides[n + 1]) {
			this._slides[n + 1].loadMedia();
			this._slides[n + 1].scrollToTop();
		}
		if (this._slides[n + 2]) {
			this._slides[n + 2].loadMedia();
			this._slides[n + 2].scrollToTop();
		}
		if (this._slides[n - 1]) {
			this._slides[n - 1].loadMedia();
			this._slides[n - 1].scrollToTop();
		}
		if (this._slides[n - 2]) {
			this._slides[n - 2].loadMedia();
			this._slides[n - 2].scrollToTop();
		}
	},

	next: function() {
	    var n = this._findSlideIndex(this.current_id);
		if ((n + 1) < (this._slides.length)) {
			this.goTo(n + 1);
		} else {
			this.goTo(n);
		}
	},

	previous: function() {
	    var n = this._findSlideIndex(this.current_id);
		if (n - 1 >= 0) {
			this.goTo(n - 1);
		} else {
			this.goTo(n);
		}
	},

	showNav: function(nav_obj, show) {

		if (this.options.width <= 500 && TL.Browser.mobile) {

		} else {
			if (show) {
				nav_obj.show();
			} else {
				nav_obj.hide();
			}

		}
	},



	changeBackground: function(bg) {
		var bg_color = {r:256, g:256, b:256},
			bg_color_rgb;

		if (bg.color_value && bg.color_value != "") {
			bg_color = TL.Util.hexToRgb(bg.color_value);
			if (!bg_color) {
				trace("Invalid color value " + bg.color_value);
				bg_color = this.options.default_bg_color;
			}
		} else {
			bg_color = this.options.default_bg_color;
			bg.color_value = "rgb(" + bg_color.r + " , " + bg_color.g + ", " + bg_color.b + ")";
		}

		bg_color_rgb 	= bg_color.r + "," + bg_color.g + "," + bg_color.b;
		this._el.background.style.backgroundImage = "none";


		if (bg.color_value) {
			this._el.background.style.backgroundColor = bg.color_value;
		} else {
			this._el.background.style.backgroundColor = "transparent";
		}

		if (bg_color.r < 255 || bg_color.g < 255 || bg_color.b < 255 || bg.image) {
			this._nav.next.setColor(true);
			this._nav.previous.setColor(true);
		} else {
			this._nav.next.setColor(false);
			this._nav.previous.setColor(false);
		}
	},
	/*	Private Methods
	================================================== */

	// Update Display
	_updateDisplay: function(width, height, animate, layout) {
		var nav_pos, _layout;

		if(typeof layout === 'undefined'){
			_layout = this.options.layout;
		} else {
			_layout = layout;
		}

		this.options.layout = _layout;

		this.slide_spacing = this.options.width*2;

		if (width) {
			this.options.width = width;
		} else {
			this.options.width = this._el.container.offsetWidth;
		}

		if (height) {
			this.options.height = height;
		} else {
			this.options.height = this._el.container.offsetHeight;
		}

		//this._el.container.style.height = this.options.height;

		// position navigation
		nav_pos = (this.options.height/2);
		this._nav.next.setPosition({top:nav_pos});
		this._nav.previous.setPosition({top:nav_pos});


		// Position slides
		for (var i = 0; i < this._slides.length; i++) {
			this._slides[i].updateDisplay(this.options.width, this.options.height, _layout);
			this._slides[i].setPosition({left:(this.slide_spacing * i), top:0});

		};

		// Go to the current slide
		this.goToId(this.current_id, true, true);
	},

	// Reposition and redraw slides
    _updateDrawSlides: function() {
	    var _layout = this.options.layout;

		for (var i = 0; i < this._slides.length; i++) {
			this._slides[i].updateDisplay(this.options.width, this.options.height, _layout);
			this._slides[i].setPosition({left:(this.slide_spacing * i), top:0});
		};

		this.goToId(this.current_id, true, false);
	},


	/*	Init
	================================================== */
	_initLayout: function () {

		TL.DomUtil.addClass(this._el.container, 'tl-storyslider');

		// Create Layout
		this._el.slider_container_mask		= TL.Dom.create('div', 'tl-slider-container-mask', this._el.container);
		this._el.background 				= TL.Dom.create('div', 'tl-slider-background tl-animate', this._el.container);
		this._el.slider_container			= TL.Dom.create('div', 'tl-slider-container tlanimate', this._el.slider_container_mask);
		this._el.slider_item_container		= TL.Dom.create('div', 'tl-slider-item-container', this._el.slider_container);


		// Update Size
		this.options.width = this._el.container.offsetWidth;
		this.options.height = this._el.container.offsetHeight;

		// Create Navigation
		this._nav.previous = new TL.SlideNav({title: "Previous", description: "description"}, {direction:"previous"});
		this._nav.next = new TL.SlideNav({title: "Next",description: "description"}, {direction:"next"});

		// add the navigation to the dom
		this._nav.next.addTo(this._el.container);
		this._nav.previous.addTo(this._el.container);



		this._el.slider_container.style.left="0px";

		if (TL.Browser.touch) {
			//this._el.slider_touch_mask = TL.Dom.create('div', 'tl-slider-touch-mask', this._el.slider_container_mask);
			this._swipable = new TL.Swipable(this._el.slider_container_mask, this._el.slider_container, {
				enable: {x:true, y:false},
				snap: 	true
			});
			this._swipable.enable();

			// Message
			this._message = new TL.Message({}, {
				message_class: 		"tl-message-full",
				message_icon_class: "tl-icon-swipe-left"
			});
			this._message.updateMessage(this._("swipe_to_navigate"));
			this._message.addTo(this._el.container);
		}

	},

	_initEvents: function () {
		this._nav.next.on('clicked', this._onNavigation, this);
		this._nav.previous.on('clicked', this._onNavigation, this);

		if (this._message) {
			this._message.on('clicked', this._onMessageClick, this);
		}

		if (this._swipable) {
			this._swipable.on('swipe_left', this._onNavigation, this);
			this._swipable.on('swipe_right', this._onNavigation, this);
			this._swipable.on('swipe_nodirection', this._onSwipeNoDirection, this);
		}


	},

	_initData: function() {
	    if(this.data.title) {
	        this._createSlide(this.data.title, true, -1);
	    }
        this._createSlides(this.data.events);
	},

	/*	Events
	================================================== */
	_onBackgroundChange: function(e) {
	    var n = this._findSlideIndex(this.current_id);
		var slide_background = this._slides[n].getBackground();
		this.changeBackground(e);
		this.fire("colorchange", slide_background);
	},

	_onMessageClick: function(e) {
		this._message.hide();
	},

	_onSwipeNoDirection: function(e) {
		this.goToId(this.current_id);
	},

	_onNavigation: function(e) {

		if (e.direction == "next" || e.direction == "left") {
			this.next();
		} else if (e.direction == "previous" || e.direction == "right") {
			this.previous();
		}
		this.fire("nav_" + e.direction, this.data);
	},

	_onSlideAdded: function(e) {
		trace("slideadded")
		this.fire("slideAdded", this.data);
	},

	_onSlideRemoved: function(e) {
		this.fire("slideRemoved", this.data);
	},

	_onSlideChange: function(displayupdate) {
		if (!displayupdate) {
			this.fire("change", {unique_id: this.current_id});
		}
	},

	_onMouseClick: function(e) {

	},

	_fireMouseEvent: function (e) {
		if (!this._loaded) {
			return;
		}

		var type = e.type;
		type = (type === 'mouseenter' ? 'mouseover' : (type === 'mouseleave' ? 'mouseout' : type));

		if (!this.hasEventListeners(type)) {
			return;
		}

		if (type === 'contextmenu') {
			TL.DomEvent.preventDefault(e);
		}

		this.fire(type, {
			latlng: "something", //this.mouseEventToLatLng(e),
			layerPoint: "something else" //this.mouseEventToLayerPoint(e)
		});
	},

	_onLoaded: function() {
		this.fire("loaded", this.data);
	}


});


/* **********************************************
     Begin TL.TimeNav.js
********************************************** */

/*	TL.TimeNav

================================================== */

TL.TimeNav = TL.Class.extend({

	includes: [TL.Events, TL.DomMixins],

	_el: {},

	/*	Constructor
	================================================== */
	initialize: function (elem, timeline_config, options, init) {
		// DOM ELEMENTS
		this._el = {
			parent: {},
			container: {},
			slider: {},
			slider_background: {},
			line: {},
			marker_container_mask: {},
			marker_container: {},
			marker_item_container: {},
			timeaxis: {},
			timeaxis_background: {},
			attribution: {}
		};

		this.collapsed = false;

		if (typeof elem === 'object') {
			this._el.container = elem;
		} else {
			this._el.container = TL.Dom.get(elem);
		}

		this.config = timeline_config;

		//Options
		this.options = {
			width: 					600,
			height: 				600,
			duration: 				1000,
			ease: 					TL.Ease.easeInOutQuint,
			has_groups: 			false,
			optimal_tick_width: 	50,
			scale_factor: 			2, 				// How many screen widths wide should the timeline be
			marker_padding: 		5,
			timenav_height_min: 	150, 			// Minimum timenav height
			marker_height_min: 		30, 			// Minimum Marker Height
			marker_width_min: 		100, 			// Minimum Marker Width
			zoom_sequence:          [0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89] // Array of Fibonacci numbers for TimeNav zoom levels http://www.maths.surrey.ac.uk/hosted-sites/R.Knott/Fibonacci/fibtable.html
		};

		// Animation
		this.animator = null;

		// Ready state
		this.ready = false;

		// Markers Array
		this._markers = [];

		// Eras Array
		this._eras = [];
		this.has_eras = false;

		// Groups Array
		this._groups = [];

		// Row Height
		this._calculated_row_height = 100;

		// Current Marker
		this.current_id = "";

		// TimeScale
		this.timescale = {};

		// TimeAxis
		this.timeaxis = {};
		this.axishelper = {};

		// Max Rows
		this.max_rows = 6;

		// Animate CSS
		this.animate_css = false;

		// Swipe Object
		this._swipable;

		// Merge Data and Options
		TL.Util.mergeData(this.options, options);

		if (init) {
			this.init();
		}
	},

	init: function() {
		this._initLayout();
		this._initEvents();
		this._initData();
		this._updateDisplay();

		this._onLoaded();
	},

	/*	Public
	================================================== */
	positionMarkers: function() {
		this._positionMarkers();
	},

	/*	Update Display
	================================================== */
	updateDisplay: function(w, h, a, l) {
		this._updateDisplay(w, h, a, l);
	},


	/*	TimeScale
	================================================== */
	_getTimeScale: function() {
		/* maybe the establishing config values (marker_height_min and max_rows) should be
		separated from making a TimeScale object, which happens in another spot in this file with duplicate mapping of properties of this TimeNav into the TimeScale options object? */
		// Set Max Rows
		var marker_height_min = 0;
		try {
			marker_height_min = parseInt(this.options.marker_height_min);
		} catch(e) {
			trace("Invalid value for marker_height_min option.");
			marker_height_min = 30;
		}
		if (marker_height_min == 0) {
			trace("marker_height_min option must not be zero.")
			marker_height_min = 30;
		}
		this.max_rows = Math.round((this.options.height - this._el.timeaxis_background.offsetHeight - (this.options.marker_padding)) / marker_height_min);
		if (this.max_rows < 1) {
			this.max_rows = 1;
		}
		return new TL.TimeScale(this.config, {
            display_width: this._el.container.offsetWidth,
            screen_multiplier: this.options.scale_factor,
            max_rows: this.max_rows

		});
	},

	_updateTimeScale: function(new_scale) {
		this.options.scale_factor = new_scale;
		this._updateDrawTimeline();
	},

	zoomIn: function() { // move the the next "higher" scale factor
		var new_scale = TL.Util.findNextGreater(this.options.zoom_sequence, this.options.scale_factor);
		this.setZoomFactor(new_scale);
	},

	zoomOut: function() { // move the the next "lower" scale factor
		var new_scale = TL.Util.findNextLesser(this.options.zoom_sequence, this.options.scale_factor);
		this.setZoomFactor(new_scale);
	},

	setZoom: function(level) {
		var zoom_factor = this.options.zoom_sequence[level];
		if (typeof(zoom_factor) == 'number') {
			this.setZoomFactor(zoom_factor);
		} else {
			console.warn("Invalid zoom level. Please use an index number between 0 and " + (this.options.zoom_sequence.length - 1));
		}
	},

	setZoomFactor: function(factor) {
		if (factor <= this.options.zoom_sequence[0]) {
			this.fire("zoomtoggle", {zoom:"out", show:false});
		} else {
			this.fire("zoomtoggle", {zoom:"out", show:true});
		}

		if (factor >= this.options.zoom_sequence[this.options.zoom_sequence.length-1]) {
			this.fire("zoomtoggle", {zoom:"in", show:false});
		} else {
			this.fire("zoomtoggle", {zoom:"in", show:true});
		}

		if (factor == 0) {
			console.warn("Zoom factor must be greater than zero. Using 0.1");
			factor = 0.1;
		}
		this.options.scale_factor = factor;
		//this._updateDrawTimeline(true);
		this.goToId(this.current_id, !this._updateDrawTimeline(true), true);
	},

	/*	Groups
	================================================== */
	_createGroups: function() {
		this._groups = [];
		var group_labels = this.timescale.getGroupLabels();

		if (group_labels) {
			this.options.has_groups = true;
			for (var i = 0; i < group_labels.length; i++) {
				this._createGroup(group_labels[i]);
			}
		}

	},

	_createGroup: function(group_label) {
		var group = new TL.TimeGroup(group_label);
		this._addGroup(group);
		this._groups.push(group);
	},

	_addGroup:function(group) {
		group.addTo(this._el.container);

	},

	_positionGroups: function() {
		if (this.options.has_groups) {
			var available_height 	= (this.options.height - this._el.timeaxis_background.offsetHeight ),
				group_height 		= Math.floor((available_height /this.timescale.getNumberOfRows()) - this.options.marker_padding),
				group_labels		= this.timescale.getGroupLabels();

			for (var i = 0, group_rows = 0; i < this._groups.length; i++) {
				var group_y = Math.floor(group_rows * (group_height + this.options.marker_padding));
				var group_hide = false;
				if (group_y > (available_height- this.options.marker_padding)) {
					group_hide = true;
				}

				this._groups[i].setRowPosition(group_y, this._calculated_row_height + this.options.marker_padding/2);
				this._groups[i].setAlternateRowColor(TL.Util.isEven(i), group_hide);

				group_rows += this._groups[i].data.rows;    // account for groups spanning multiple rows
			}
		}
	},

	/*	Markers
	================================================== */
	_addMarker:function(marker) {
		marker.addTo(this._el.marker_item_container);
		marker.on('markerclick', this._onMarkerClick, this);
		marker.on('added', this._onMarkerAdded, this);
	},

	_createMarker: function(data, n) {
		var marker = new TL.TimeMarker(data, this.options);
		this._addMarker(marker);
		if(n < 0) {
		    this._markers.push(marker);
		} else {
		    this._markers.splice(n, 0, marker);
		}
	},

	_createMarkers: function(array) {
		for (var i = 0; i < array.length; i++) {
			this._createMarker(array[i], -1);
		}
	},

	_removeMarker: function(marker) {
		marker.removeFrom(this._el.marker_item_container);
		//marker.off('added', this._onMarkerRemoved, this);
	},

	_destroyMarker: function(n) {
	    this._removeMarker(this._markers[n]);
	    this._markers.splice(n, 1);
	},

	_positionMarkers: function(fast) {
		// POSITION X
		for (var i = 0; i < this._markers.length; i++) {
			var pos = this.timescale.getPositionInfo(i);
			if (fast) {
				this._markers[i].setClass("tl-timemarker tl-timemarker-fast");
			} else {
				this._markers[i].setClass("tl-timemarker");
			}
			this._markers[i].setPosition({left:pos.start});
			this._markers[i].setWidth(pos.width);
		};

	},

	_calculateMarkerHeight: function(h) {
		return ((h /this.timescale.getNumberOfRows()) - this.options.marker_padding);
	},

	_calculateRowHeight: function(h) {
		return (h /this.timescale.getNumberOfRows());
	},

	_calculateAvailableHeight: function() {
		return (this.options.height - this._el.timeaxis_background.offsetHeight - (this.options.marker_padding));
	},

	_calculateMinimumTimeNavHeight: function() {
		return (this.timescale.getNumberOfRows() * this.options.marker_height_min) + this._el.timeaxis_background.offsetHeight + (this.options.marker_padding);

	},

	getMinimumHeight: function() {
		return this._calculateMinimumTimeNavHeight();
	},

	_assignRowsToMarkers: function() {
		var available_height 	= this._calculateAvailableHeight(),
			marker_height 		= this._calculateMarkerHeight(available_height);


		this._positionGroups();

		this._calculated_row_height = this._calculateRowHeight(available_height);

		for (var i = 0; i < this._markers.length; i++) {

			// Set Height
			this._markers[i].setHeight(marker_height);

			//Position by Row
			var row = this.timescale.getPositionInfo(i).row;

			var marker_y = Math.floor(row * (marker_height + this.options.marker_padding)) + this.options.marker_padding;

			var remainder_height = available_height - marker_y + this.options.marker_padding;
			this._markers[i].setRowPosition(marker_y, remainder_height);
		};

	},

	_resetMarkersActive: function() {
		for (var i = 0; i < this._markers.length; i++) {
			this._markers[i].setActive(false);
		};
	},

	_findMarkerIndex: function(n) {
	    var _n = -1;
		if (typeof n == 'string' || n instanceof String) {
			_n = TL.Util.findArrayNumberByUniqueID(n, this._markers, "unique_id", _n);
		}
		return _n;
	},

	/*	ERAS
	================================================== */
	_createEras: function(array) {
		for (var i = 0; i < array.length; i++) {
			this._createEra(array[i], -1);
		}
	},

	_createEra: function(data, n) {
		var era = new TL.TimeEra(data, this.options);
		this._addEra(era);
		if(n < 0) {
		    this._eras.push(era);
		} else {
		    this._eras.splice(n, 0, era);
		}
	},

	_addEra:function(era) {
		era.addTo(this._el.marker_item_container);
		era.on('added', this._onEraAdded, this);
	},

	_removeEra: function(era) {
		era.removeFrom(this._el.marker_item_container);
		//marker.off('added', this._onMarkerRemoved, this);
	},

	_destroyEra: function(n) {
	    this._removeEra(this._eras[n]);
	    this._eras.splice(n, 1);
	},

	_positionEras: function(fast) {

		var era_color = 0;
		// POSITION X
		for (var i = 0; i < this._eras.length; i++) {
			var pos = {
				start:0,
				end:0,
				width:0
			};

			pos.start = this.timescale.getPosition(this._eras[i].data.start_date.getTime());
			pos.end = this.timescale.getPosition(this._eras[i].data.end_date.getTime());
			pos.width = pos.end - pos.start;

			if (fast) {
				this._eras[i].setClass("tl-timeera tl-timeera-fast");
			} else {
				this._eras[i].setClass("tl-timeera");
			}
			this._eras[i].setPosition({left:pos.start});
			this._eras[i].setWidth(pos.width);

			era_color++;
			if (era_color > 5) {
				era_color = 0;
			}
			this._eras[i].setColor(era_color);
		};

	},

	/*	Public
	================================================== */

	// Create a marker
	createMarker: function(d, n) {
	    this._createMarker(d, n);
	},

	// Create many markers from an array
	createMarkers: function(array) {
	    this._createMarkers(array);
	},

	// Destroy marker by index
	destroyMarker: function(n) {
	    this._destroyMarker(n);
	},

	// Destroy marker by id
	destroyMarkerId: function(id) {
	    this.destroyMarker(this._findMarkerIndex(id));
	},

	/*	Navigation
	================================================== */
	goTo: function(n, fast, css_animation) {
		var self = 	this,
			_ease = this.options.ease,
			_duration = this.options.duration,
			_n = (n < 0) ? 0 : n;

		// Set Marker active state
		this._resetMarkersActive();
		if(n >= 0 && n < this._markers.length) {
		    this._markers[n].setActive(true);
		}
		// Stop animation
		if (this.animator) {
			this.animator.stop();
		}

		if (fast) {
			this._el.slider.className = "tl-timenav-slider";
			this._el.slider.style.left = -this._markers[_n].getLeft() + (this.options.width/2) + "px";
		} else {
			if (css_animation) {
				this._el.slider.className = "tl-timenav-slider tl-timenav-slider-animate";
				this.animate_css = true;
				this._el.slider.style.left = -this._markers[_n].getLeft() + (this.options.width/2) + "px";
			} else {
				this._el.slider.className = "tl-timenav-slider";
				this.animator = TL.Animate(this._el.slider, {
					left: 		-this._markers[_n].getLeft() + (this.options.width/2) + "px",
					duration: 	_duration,
					easing: 	_ease
				});
			}
		}

		if(n >= 0 && n < this._markers.length) {
		    this.current_id = this._markers[n].data.unique_id;
		} else {
		    this.current_id = '';
		}
	},

	goToId: function(id, fast, css_animation) {
		this.goTo(this._findMarkerIndex(id), fast, css_animation);
	},

	/*	Events
	================================================== */
	_onLoaded: function() {
		this.ready = true;
		this.fire("loaded", this.config);
	},

	_onMarkerAdded: function(e) {
		this.fire("dateAdded", this.config);
	},

	_onEraAdded: function(e) {
		this.fire("eraAdded", this.config);
	},

	_onMarkerRemoved: function(e) {
		this.fire("dateRemoved", this.config);
	},

	_onMarkerClick: function(e) {
		// Go to the clicked marker
		this.goToId(e.unique_id);
		this.fire("change", {unique_id: e.unique_id});
	},

	_onMouseScroll: function(e) {

		var delta		= 0,
			scroll_to	= 0,
			constraint 	= {
				right: 	-(this.timescale.getPixelWidth() - (this.options.width/2)),
				left: 	this.options.width/2
			};
		if (!e) {
			e = window.event;
		}
		if (e.originalEvent) {
			e = e.originalEvent;
		}

		// Webkit and browsers able to differntiate between up/down and left/right scrolling
		if (typeof e.wheelDeltaX != 'undefined' ) {
			delta = e.wheelDeltaY/6;
			if (Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)) {
				delta = e.wheelDeltaX/6;
			} else {
				//delta = e.wheelDeltaY/6;
				delta = 0;
			}
		}
		if (delta) {
			if (e.preventDefault) {
				 e.preventDefault();
			}
			e.returnValue = false;
		}
		// Stop from scrolling too far
		scroll_to = parseInt(this._el.slider.style.left.replace("px", "")) + delta;


		if (scroll_to > constraint.left) {
			scroll_to = constraint.left;
		} else if (scroll_to < constraint.right) {
			scroll_to = constraint.right;
		}

		if (this.animate_css) {
			this._el.slider.className = "tl-timenav-slider";
			this.animate_css = false;
		}

		this._el.slider.style.left = scroll_to + "px";

	},

	_onDragMove: function(e) {
		if (this.animate_css) {
			this._el.slider.className = "tl-timenav-slider";
			this.animate_css = false;
		}

	},

	/*	Private Methods
	================================================== */
	// Update Display
	_updateDisplay: function(width, height, animate) {

		if (width) {
			this.options.width = width;
		}
		if (height && height != this.options.height) {
			this.options.height = height;
			this.timescale = this._getTimeScale();
		}

		// Size Markers
		this._assignRowsToMarkers();

		// Size swipable area
		this._el.slider_background.style.width = this.timescale.getPixelWidth() + this.options.width + "px";
		this._el.slider_background.style.left = -(this.options.width/2) + "px";
		this._el.slider.style.width = this.timescale.getPixelWidth() + this.options.width + "px";

		// Update Swipable constraint
		this._swipable.updateConstraint({top: false,bottom: false,left: (this.options.width/2),right: -(this.timescale.getPixelWidth() - (this.options.width/2))});

		// Go to the current slide
		this.goToId(this.current_id, true);
	},

	_drawTimeline: function(fast) {
		this.timescale = this._getTimeScale();
		this.timeaxis.drawTicks(this.timescale, this.options.optimal_tick_width);
		this._positionMarkers(fast);
		this._assignRowsToMarkers();
		this._createGroups();
		this._positionGroups();

		if (this.has_eras) {

			this._positionEras(fast);
		}
	},

	_updateDrawTimeline: function(check_update) {
		var do_update = false;

		// Check to see if redraw is needed
		if (check_update) {
			/* keep this aligned with _getTimeScale or reduce code duplication */
			var temp_timescale = new TL.TimeScale(this.config, {
	            display_width: this._el.container.offsetWidth,
	            screen_multiplier: this.options.scale_factor,
	            max_rows: this.max_rows

			});

			if (this.timescale.getMajorScale() == temp_timescale.getMajorScale()
			 && this.timescale.getMinorScale() == temp_timescale.getMinorScale()) {
				do_update = true;
			}
		} else {
			do_update = true;
		}

		// Perform update or redraw
		if (do_update) {
			this.timescale = this._getTimeScale();
			this.timeaxis.positionTicks(this.timescale, this.options.optimal_tick_width);
			this._positionMarkers();
			this._assignRowsToMarkers();
			this._positionGroups();
			if (this.has_eras) {
				this._positionEras();
			}
			this._updateDisplay();
		} else {
			this._drawTimeline(true);
		}

		return do_update;

	},


	/*	Init
	================================================== */
	_initLayout: function () {
		// Create Layout
		this._el.attribution 				= TL.Dom.create('div', 'tl-attribution', this._el.container);
		this._el.line						= TL.Dom.create('div', 'tl-timenav-line', this._el.container);
		this._el.slider						= TL.Dom.create('div', 'tl-timenav-slider', this._el.container);
		this._el.slider_background			= TL.Dom.create('div', 'tl-timenav-slider-background', this._el.slider);
		this._el.marker_container_mask		= TL.Dom.create('div', 'tl-timenav-container-mask', this._el.slider);
		this._el.marker_container			= TL.Dom.create('div', 'tl-timenav-container', this._el.marker_container_mask);
		this._el.marker_item_container		= TL.Dom.create('div', 'tl-timenav-item-container', this._el.marker_container);
		this._el.timeaxis 					= TL.Dom.create('div', 'tl-timeaxis', this._el.slider);
		this._el.timeaxis_background 		= TL.Dom.create('div', 'tl-timeaxis-background', this._el.container);


		// Knight Lab Logo
		this._el.attribution.innerHTML = "<a href='http://timeline.knightlab.com' target='_blank'><span class='tl-knightlab-logo'></span>Timeline JS</a>"

		// Time Axis
		this.timeaxis = new TL.TimeAxis(this._el.timeaxis, this.options);

		// Swipable
		this._swipable = new TL.Swipable(this._el.slider_background, this._el.slider, {
			enable: {x:true, y:false},
			constraint: {top: false,bottom: false,left: (this.options.width/2),right: false},
			snap: 	false
		});
		this._swipable.enable();

	},

	_initEvents: function () {
		// Drag Events
		this._swipable.on('dragmove', this._onDragMove, this);

		// Scroll Events
		TL.DomEvent.addListener(this._el.container, 'mousewheel', this._onMouseScroll, this);
		TL.DomEvent.addListener(this._el.container, 'DOMMouseScroll', this._onMouseScroll, this);
	},

	_initData: function() {
		// Create Markers and then add them
		this._createMarkers(this.config.events);

		if (this.config.eras) {
			this.has_eras = true;
			this._createEras(this.config.eras);
		}

		this._drawTimeline();

	}


});


/* **********************************************
     Begin TL.TimeMarker.js
********************************************** */

/*	TL.TimeMarker

================================================== */

TL.TimeMarker = TL.Class.extend({

	includes: [TL.Events, TL.DomMixins],

	_el: {},

	/*	Constructor
	================================================== */
	initialize: function(data, options) {

		// DOM Elements
		this._el = {
			container: {},
			content_container: {},
			media_container: {},
			timespan: {},
			line_left: {},
			line_right: {},
			content: {},
			text: {},
			media: {},
		};

		// Components
		this._text			= {};

		// State
		this._state = {
			loaded: 		false
		};


		// Data
		this.data = {
			unique_id: 			"",
			background: 		null,
			date: {
				year:			0,
				month:			0,
				day: 			0,
				hour: 			0,
				minute: 		0,
				second: 		0,
				millisecond: 	0,
				thumbnail: 		"",
				format: 		""
			},
			text: {
				headline: 		"",
				text: 			""
			},
			media: 				null
		};

		// Options
		this.options = {
			duration: 			1000,
			ease: 				TL.Ease.easeInSpline,
			width: 				600,
			height: 			600,
			marker_width_min: 	100 			// Minimum Marker Width
		};

		// Actively Displaying
		this.active = false;

		// Animation Object
		this.animator = {};

		// End date
		this.has_end_date = false;

		// Merge Data and Options
		TL.Util.mergeData(this.options, options);
		TL.Util.mergeData(this.data, data);

		this._initLayout();
		this._initEvents();


	},

	/*	Adding, Hiding, Showing etc
	================================================== */
	show: function() {

	},

	hide: function() {

	},

	setActive: function(is_active) {
		this.active = is_active;

		if (this.active && this.has_end_date) {
			this._el.container.className = 'tl-timemarker tl-timemarker-with-end tl-timemarker-active';
		} else if (this.active){
			this._el.container.className = 'tl-timemarker tl-timemarker-active';
		} else if (this.has_end_date){
			this._el.container.className = 'tl-timemarker tl-timemarker-with-end';
		} else {
			this._el.container.className = 'tl-timemarker';
		}
	},

	addTo: function(container) {
		container.appendChild(this._el.container);
	},

	removeFrom: function(container) {
		container.removeChild(this._el.container);
	},

	updateDisplay: function(w, h) {
		this._updateDisplay(w, h);
	},

	loadMedia: function() {

		if (this._media && !this._state.loaded) {
			this._media.loadMedia();
			this._state.loaded = true;
		}
	},

	stopMedia: function() {
		if (this._media && this._state.loaded) {
			this._media.stopMedia();
		}
	},

	getLeft: function() {
		return this._el.container.style.left.slice(0, -2);
	},

	getTime: function() { // TODO does this need to know about the end date?
		return this.data.start_date.getTime();
	},

	getEndTime: function() {

		if (this.data.end_date) {
			return this.data.end_date.getTime();
		} else {
			return false;
		}
	},

	setHeight: function(h) {
		var text_line_height = 12,
			text_lines = 1;

		this._el.content_container.style.height = h  + "px";
		this._el.timespan_content.style.height = h + "px";
		// Handle Line height for better display of text
		if (h <= 30) {
			this._el.content.className = "tl-timemarker-content tl-timemarker-content-small";
		} else {
			this._el.content.className = "tl-timemarker-content";
		}

		if (h <= 56) {
			TL.DomUtil.addClass(this._el.content_container, "tl-timemarker-content-container-small");
		} else {
			TL.DomUtil.removeClass(this._el.content_container, "tl-timemarker-content-container-small");
		}

		// Handle number of lines visible vertically

		if (TL.Browser.webkit) {
			text_lines = Math.floor(h / (text_line_height + 2));
			if (text_lines < 1) {
				text_lines = 1;
			}
			this._text.className = "tl-headline";
			this._text.style.webkitLineClamp = text_lines;
		} else {
			text_lines = h / text_line_height;
			if (text_lines > 1) {
				this._text.className = "tl-headline tl-headline-fadeout";
			} else {
				this._text.className = "tl-headline";
			}
			this._text.style.height = (text_lines * text_line_height)  + "px";
		}

	},

	setWidth: function(w) {
		if (this.data.end_date) {
			this._el.container.style.width = w + "px";

			if (w > this.options.marker_width_min) {
				this._el.content_container.style.width = w + "px";
				this._el.content_container.className = "tl-timemarker-content-container tl-timemarker-content-container-long";
			} else {
				this._el.content_container.style.width = this.options.marker_width_min + "px";
				this._el.content_container.className = "tl-timemarker-content-container";
			}
		}

	},

	setClass: function(n) {
		this._el.container.className = n;
	},

	setRowPosition: function(n, remainder) {
		this.setPosition({top:n});
		this._el.timespan.style.height = remainder + "px";

		if (remainder < 56) {
			//TL.DomUtil.removeClass(this._el.content_container, "tl-timemarker-content-container-small");
		}
	},

	/*	Events
	================================================== */
	_onMarkerClick: function(e) {
		this.fire("markerclick", {unique_id:this.data.unique_id});
	},

	/*	Private Methods
	================================================== */
	_initLayout: function () {
		//trace(this.data)
		// Create Layout
		this._el.container 				= TL.Dom.create("div", "tl-timemarker");
		if (this.data.unique_id) {
			this._el.container.id 		= this.data.unique_id + "-marker";
		}

		if (this.data.end_date) {
			this.has_end_date = true;
			this._el.container.className = 'tl-timemarker tl-timemarker-with-end';
		}

		this._el.timespan				= TL.Dom.create("div", "tl-timemarker-timespan", this._el.container);
		this._el.timespan_content		= TL.Dom.create("div", "tl-timemarker-timespan-content", this._el.timespan);
		this._el.content_container		= TL.Dom.create("div", "tl-timemarker-content-container", this._el.container);

		this._el.content				= TL.Dom.create("div", "tl-timemarker-content", this._el.content_container);

		this._el.line_left				= TL.Dom.create("div", "tl-timemarker-line-left", this._el.timespan);
		this._el.line_right				= TL.Dom.create("div", "tl-timemarker-line-right", this._el.timespan);

		// Thumbnail or Icon
		if (this.data.media) {
			this._el.media_container	= TL.Dom.create("div", "tl-timemarker-media-container", this._el.content);
			// ugh. needs an overhaul
			var mtd = {url: this.data.media.thumbnail};
			var thumbnail_media_type = (this.data.media.thumbnail) ? TL.MediaType(mtd, true) : null;
			if (thumbnail_media_type) {
				var thumbnail_media = new thumbnail_media_type.cls(mtd);
				thumbnail_media.on("loaded", function() {
					this._el.media				= TL.Dom.create("img", "tl-timemarker-media", this._el.media_container);
					this._el.media.src			= thumbnail_media.getImageURL();
				}.bind(this));
				thumbnail_media.loadMedia();
			} else {
				var media_type = TL.MediaType(this.data.media).type;
				this._el.media				= TL.Dom.create("span", "tl-icon-" + media_type, this._el.media_container);

			}

		}


		// Text
		this._el.text					= TL.Dom.create("div", "tl-timemarker-text", this._el.content);
		this._text						= TL.Dom.create("h2", "tl-headline", this._el.text);
		if (this.data.text.headline && this.data.text.headline != "") {
			this._text.innerHTML		= TL.Util.unlinkify(this.data.text.headline);
		} else if (this.data.text.text && this.data.text.text != "") {
			this._text.innerHTML		= TL.Util.unlinkify(this.data.text.text);
		} else if (this.data.media && this.data.media.caption && this.data.media.caption != "") {
			this._text.innerHTML		= TL.Util.unlinkify(this.data.media.caption);
		}



		// Fire event that the slide is loaded
		this.onLoaded();

	},

	_initEvents: function() {
		TL.DomEvent.addListener(this._el.container, 'click', this._onMarkerClick, this);
	},

	// Update Display
	_updateDisplay: function(width, height, layout) {

		if (width) {
			this.options.width 					= width;
		}

		if (height) {
			this.options.height = height;
		}

	}

});


/* **********************************************
     Begin TL.TimeEra.js
********************************************** */

/*	TL.TimeMarker

================================================== */

TL.TimeEra = TL.Class.extend({

	includes: [TL.Events, TL.DomMixins],

	_el: {},

	/*	Constructor
	================================================== */
	initialize: function(data, options) {

		// DOM Elements
		this._el = {
			container: {},
			background: {},
			content_container: {},
			content: {},
			text: {}
		};

		// Components
		this._text			= {};

		// State
		this._state = {
			loaded: 		false
		};


		// Data
		this.data = {
			unique_id: 			"",
			date: {
				year:			0,
				month:			0,
				day: 			0,
				hour: 			0,
				minute: 		0,
				second: 		0,
				millisecond: 	0,
				thumbnail: 		"",
				format: 		""
			},
			text: {
				headline: 		"",
				text: 			""
			}
		};

		// Options
		this.options = {
			duration: 			1000,
			ease: 				TL.Ease.easeInSpline,
			width: 				600,
			height: 			600,
			marker_width_min: 	100 			// Minimum Marker Width
		};

		// Actively Displaying
		this.active = false;

		// Animation Object
		this.animator = {};

		// End date
		this.has_end_date = false;

		// Merge Data and Options
		TL.Util.mergeData(this.options, options);
		TL.Util.mergeData(this.data, data);

		this._initLayout();
		this._initEvents();


	},

	/*	Adding, Hiding, Showing etc
	================================================== */
	show: function() {

	},

	hide: function() {

	},

	setActive: function(is_active) {

	},

	addTo: function(container) {
		container.appendChild(this._el.container);
	},

	removeFrom: function(container) {
		container.removeChild(this._el.container);
	},

	updateDisplay: function(w, h) {
		this._updateDisplay(w, h);
	},

	getLeft: function() {
		return this._el.container.style.left.slice(0, -2);
	},

	getTime: function() { // TODO does this need to know about the end date?
		return this.data.start_date.getTime();
	},

	getEndTime: function() {

		if (this.data.end_date) {
			return this.data.end_date.getTime();
		} else {
			return false;
		}
	},

	setHeight: function(h) {
		var text_line_height = 12,
			text_lines = 1;

		this._el.content_container.style.height = h  + "px";
		this._el.content.className = "tl-timeera-content";

		// Handle number of lines visible vertically

		if (TL.Browser.webkit) {
			text_lines = Math.floor(h / (text_line_height + 2));
			if (text_lines < 1) {
				text_lines = 1;
			}
			this._text.className = "tl-headline";
			this._text.style.webkitLineClamp = text_lines;
		} else {
			text_lines = h / text_line_height;
			if (text_lines > 1) {
				this._text.className = "tl-headline tl-headline-fadeout";
			} else {
				this._text.className = "tl-headline";
			}
			this._text.style.height = (text_lines * text_line_height)  + "px";
		}

	},

	setWidth: function(w) {
		if (this.data.end_date) {
			this._el.container.style.width = w + "px";

			if (w > this.options.marker_width_min) {
				this._el.content_container.style.width = w + "px";
				this._el.content_container.className = "tl-timeera-content-container tl-timeera-content-container-long";
			} else {
				this._el.content_container.style.width = this.options.marker_width_min + "px";
				this._el.content_container.className = "tl-timeera-content-container";
			}
		}

	},

	setClass: function(n) {
		this._el.container.className = n;
	},

	setRowPosition: function(n, remainder) {
		this.setPosition({top:n});

		if (remainder < 56) {
			//TL.DomUtil.removeClass(this._el.content_container, "tl-timeera-content-container-small");
		}
	},

	setColor: function(color_num) {
		this._el.container.className = 'tl-timeera tl-timeera-color' + color_num;
	},

	/*	Events
	================================================== */


	/*	Private Methods
	================================================== */
	_initLayout: function () {
		//trace(this.data)
		// Create Layout
		this._el.container 				= TL.Dom.create("div", "tl-timeera");
		if (this.data.unique_id) {
			this._el.container.id 		= this.data.unique_id + "-era";
		}

		if (this.data.end_date) {
			this.has_end_date = true;
			this._el.container.className = 'tl-timeera tl-timeera-with-end';
		}

		this._el.content_container		= TL.Dom.create("div", "tl-timeera-content-container", this._el.container);

		this._el.background 			= TL.Dom.create("div", "tl-timeera-background", this._el.content_container);

		this._el.content				= TL.Dom.create("div", "tl-timeera-content", this._el.content_container);

		

		// Text
		this._el.text					= TL.Dom.create("div", "tl-timeera-text", this._el.content);
		this._text						= TL.Dom.create("h2", "tl-headline", this._el.text);
		if (this.data.text.headline && this.data.text.headline != "") {
			this._text.innerHTML		= TL.Util.unlinkify(this.data.text.headline);
		} 



		// Fire event that the slide is loaded
		this.onLoaded();

	},

	_initEvents: function() {
		
	},

	// Update Display
	_updateDisplay: function(width, height, layout) {

		if (width) {
			this.options.width 					= width;
		}

		if (height) {
			this.options.height = height;
		}

	}

});


/* **********************************************
     Begin TL.TimeGroup.js
********************************************** */

/*	TL.TimeGroup
	
================================================== */
 
TL.TimeGroup = TL.Class.extend({
	
	includes: [TL.Events, TL.DomMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function(data) {
		
		// DOM ELEMENTS
		this._el = {
			parent: {},
			container: {},
			message: {}
		};
		
		//Options
		this.options = {
			width: 					600,
			height: 				600
		};
		
		// Data
		this.data = {
			label: "",
			rows: 1
		};
		
		
		this._el.container = TL.Dom.create("div", "tl-timegroup"); 
		
		// Merge Data
		TL.Util.mergeData(this.data, data);
		
		// Animation
		this.animator = {};
		
		
		this._initLayout();
		this._initEvents();
	},
	
	/*	Public
	================================================== */
	
	
	
	/*	Update Display
	================================================== */
	updateDisplay: function(w, h) {
		
	},
	
	setRowPosition: function(n, h) {
		// trace(n);
		// trace(this._el.container)
		this.options.height = h * this.data.rows;
		this.setPosition({top:n});
		this._el.container.style.height = this.options.height + "px";
		
	},
	
	setAlternateRowColor: function(alternate, hide) {
		var class_name = "tl-timegroup";
		if (alternate) {
			class_name += " tl-timegroup-alternate";
		}
		if (hide) {
			class_name += " tl-timegroup-hidden";
		}
		this._el.container.className = class_name;
	},
	
	/*	Events
	================================================== */

	
	_onMouseClick: function() {
		this.fire("clicked", this.options);
	},

	
	/*	Private Methods
	================================================== */
	_initLayout: function () {
		
		// Create Layout
		this._el.message = TL.Dom.create("div", "tl-timegroup-message", this._el.container);
		this._el.message.innerHTML = this.data.label;
		
		
	},
	
	_initEvents: function () {
		TL.DomEvent.addListener(this._el.container, 'click', this._onMouseClick, this);
	},
	
	// Update Display
	_updateDisplay: function(width, height, animate) {
		
	}
	
});

/* **********************************************
     Begin TL.TimeScale.js
********************************************** */

/*  TL.TimeScale
    Strategies for laying out the timenav
    make a new one if the slides change

    TODOS: deal with clustering
================================================== */
TL.TimeScale = TL.Class.extend({

    initialize: function (timeline_config, options) {

        var slides = timeline_config.events;
        this._scale = timeline_config.scale;

        options = TL.Util.mergeData({ // establish defaults
            display_width: 500,
            screen_multiplier: 3,
            max_rows: null
        }, options);

        this._display_width = options.display_width;
        this._screen_multiplier = options.screen_multiplier;
        this._pixel_width = this._screen_multiplier * this._display_width;

        this._group_labels = undefined;
        this._positions = [];
        this._pixels_per_milli = 0;

        this._earliest = timeline_config.getEarliestDate().getTime();
        this._latest = timeline_config.getLatestDate().getTime();
        this._span_in_millis = this._latest - this._earliest;
        if (this._span_in_millis <= 0) {
            this._span_in_millis = this._computeDefaultSpan(timeline_config);
        }
        this._average = (this._span_in_millis)/slides.length;

        this._pixels_per_milli = this.getPixelWidth() / this._span_in_millis;

        this._axis_helper = TL.AxisHelper.getBestHelper(this);

        this._scaled_padding = (1/this.getPixelsPerTick()) * (this._display_width/2)
        this._computePositionInfo(slides, options.max_rows);
    },

    _computeDefaultSpan: function(timeline_config) {
        // this gets called when all events are at the same instant,
        // or maybe when the span_in_millis is > 0 but still below a desired threshold
        // TODO: does this need smarts about eras?
        if (timeline_config.scale == 'human') {
            var formats = {}
            for (var i = 0; i < timeline_config.events.length; i++) {
                var fmt = timeline_config.events[i].start_date.findBestFormat();
                formats[fmt] = (formats[fmt]) ? formats[fmt] + 1 : 1;
            };

            for (var i = TL.Date.SCALES.length - 1; i >= 0; i--) {
                if (formats.hasOwnProperty(TL.Date.SCALES[i][0])) {
                    var scale = TL.Date.SCALES[TL.Date.SCALES.length - 1]; // default
                    if (TL.Date.SCALES[i+1]) {
                        scale = TL.Date.SCALES[i+1]; // one larger than the largest in our data
                    }
                    return scale[1]
                }
            };
            return 365 * 24 * 60 * 60 * 1000; // default to a year?
        }

        return 200000; // what is the right handling for cosmo dates?
    },
    getGroupLabels: function() { /*
        return an array of objects, one per group, in the order (top to bottom) that the groups are expected to appear. Each object will have two properties:
            * label (the string as specified in one or more 'group' properties of events in the configuration)
            * rows (the number of rows occupied by events associated with the label. )
        */
        return (this._group_labels || []);
    },

    getScale: function() {
        return this._scale;
    },

    getNumberOfRows: function() {
        return this._number_of_rows
    },

    getPixelWidth: function() {
        return this._pixel_width;
    },

    getPosition: function(time_in_millis) {
        // be careful using millis, as they won't scale to cosmological time.
        // however, we're moving to make the arg to this whatever value
        // comes from TL.Date.getTime() which could be made smart about that --
        // so it may just be about the naming.
        return ( time_in_millis - this._earliest ) * this._pixels_per_milli
    },

    getPositionInfo: function(idx) {
        return this._positions[idx];
    },

    getPixelsPerTick: function() {
        return this._axis_helper.getPixelsPerTick(this._pixels_per_milli);
    },

    getTicks: function() {
        return {
            major: this._axis_helper.getMajorTicks(this),
            minor: this._axis_helper.getMinorTicks(this) }
    },

    getDateFromTime: function(t) {
        if(this._scale == 'human') {
            return new TL.Date(t);
        } else if(this._scale == 'cosmological') {
            return new TL.BigDate(new TL.BigYear(t));
        }
        throw new TL.Error("time_scale_scale_err", this._scale);
    },

    getMajorScale: function() {
        return this._axis_helper.major.name;
    },

    getMinorScale: function() {
        return this._axis_helper.minor.name;
    },

    _assessGroups: function(slides) {
        var groups = [];
        var empty_group = false;
        for (var i = 0; i < slides.length; i++) {
            if(slides[i].group) {
                if(groups.indexOf(slides[i].group) < 0) {
                    groups.push(slides[i].group);
                } else {
                    empty_group = true;
                }
            }
        };
        if (groups.length && empty_group) {
            groups.push('');
        }
        return groups;
    },

    /*  Compute the marker row positions, minimizing the number of
        overlaps.

        @positions = list of objects from this._positions
        @rows_left = number of rows available (assume > 0)
    */
    _computeRowInfo: function(positions, rows_left) {
        var lasts_in_row = [];
        var n_overlaps = 0;

        for (var i = 0; i < positions.length; i++) {
            var pos_info = positions[i];
            var overlaps = [];

            // See if we can add item to an existing row without
            // overlapping the previous item in that row
            delete pos_info.row;

            for (var j = 0; j < lasts_in_row.length; j++) {
                overlaps.push(lasts_in_row[j].end - pos_info.start);
                if(overlaps[j] <= 0) {
                    pos_info.row = j;
                    lasts_in_row[j] = pos_info;
                    break;
                }
            }

            // If we couldn't add to an existing row without overlap...
            if (typeof(pos_info.row) == 'undefined') {
                if (rows_left === null) {
                    // Make a new row
                    pos_info.row = lasts_in_row.length;
                    lasts_in_row.push(pos_info);
                } else if (rows_left > 0) {
                    // Make a new row
                    pos_info.row = lasts_in_row.length;
                    lasts_in_row.push(pos_info);
                    rows_left--;
                } else {
                    // Add to existing row with minimum overlap.
                    var min_overlap = Math.min.apply(null, overlaps);
                    var idx = overlaps.indexOf(min_overlap);
                    pos_info.row = idx;
                    if (pos_info.end > lasts_in_row[idx].end) {
                        lasts_in_row[idx] = pos_info;
                    }
                    n_overlaps++;
                }
            }
        }

        return {n_rows: lasts_in_row.length, n_overlaps: n_overlaps};
    },

    /*  Compute marker positions.  If using groups, this._number_of_rows
        will never be less than the number of groups.

        @max_rows = total number of available rows
        @default_marker_width should be in pixels
    */
    _computePositionInfo: function(slides, max_rows, default_marker_width) {
        default_marker_width = default_marker_width || 100;

        var groups = [];
        var empty_group = false;

        // Set start/end/width; enumerate groups
        for (var i = 0; i < slides.length; i++) {
            var pos_info = {
                start: this.getPosition(slides[i].start_date.getTime())
            };
            this._positions.push(pos_info);

            if (typeof(slides[i].end_date) != 'undefined') {
                var end_pos = this.getPosition(slides[i].end_date.getTime());
                pos_info.width = end_pos - pos_info.start;
                if (pos_info.width > default_marker_width) {
                    pos_info.end = pos_info.start + pos_info.width;
                } else {
                    pos_info.end = pos_info.start + default_marker_width;
                }
            } else {
                pos_info.width = default_marker_width;
                pos_info.end = pos_info.start + default_marker_width;
            }

            if(slides[i].group) {
                if(groups.indexOf(slides[i].group) < 0) {
                    groups.push(slides[i].group);
                }
            } else {
                empty_group = true;
            }
        }

        if(!(groups.length)) {
            var result = this._computeRowInfo(this._positions, max_rows);
            this._number_of_rows = result.n_rows;
        } else {
            if(empty_group) {
                groups.push("");
            }

            // Init group info
            var group_info = [];

            for(var i = 0; i < groups.length; i++) {
                group_info[i] = {
                    label: groups[i],
                    idx: i,
                    positions: [],
                    n_rows: 1,      // default
                    n_overlaps: 0
                };
            }

            for(var i = 0; i < this._positions.length; i++) {
                var pos_info = this._positions[i];

                pos_info.group = groups.indexOf(slides[i].group || "");
                pos_info.row = 0;

                var gi = group_info[pos_info.group];
                for(var j = gi.positions.length - 1; j >= 0; j--) {
                    if(gi.positions[j].end > pos_info.start) {
                        gi.n_overlaps++;
                    }
                }

                gi.positions.push(pos_info);
            }

            var n_rows = groups.length; // start with 1 row per group

            while(true) {
                // Count free rows available
                var rows_left = Math.max(0, max_rows - n_rows);
                if(!rows_left) {
                    break;  // no free rows, nothing to do
                }

                // Sort by # overlaps, idx
               group_info.sort(function(a, b) {
                    if(a.n_overlaps > b.n_overlaps) {
                        return -1;
                    } else if(a.n_overlaps < b.n_overlaps) {
                        return 1;
                    }
                    return a.idx - b.idx;
                });
                if(!group_info[0].n_overlaps) {
                    break; // no overlaps, nothing to do
                }

                // Distribute free rows among groups with overlaps
                var n_rows = 0;
                for(var i = 0; i < group_info.length; i++) {
                    var gi = group_info[i];

                    if(gi.n_overlaps && rows_left) {
                        var res = this._computeRowInfo(gi.positions,  gi.n_rows + 1);
                        gi.n_rows = res.n_rows;     // update group info
                        gi.n_overlaps = res.n_overlaps;
                        rows_left--;                // update rows left
                    }

                    n_rows += gi.n_rows;            // update rows used
                }
            }

            // Set number of rows
            this._number_of_rows = n_rows;

            // Set group labels; offset row positions
            this._group_labels = [];

            group_info.sort(function(a, b) {return a.idx - b.idx; });

            for(var i = 0, row_offset = 0; i < group_info.length; i++) {
                this._group_labels.push({
                    label: group_info[i].label,
                    rows: group_info[i].n_rows
                });

                for(var j = 0; j < group_info[i].positions.length; j++) {
                    var pos_info = group_info[i].positions[j];
                    pos_info.row += row_offset;
                }

                row_offset += group_info[i].n_rows;
            }
        }

    }
});


/* **********************************************
     Begin TL.TimeAxis.js
********************************************** */

/*	TL.TimeAxis
	Display element for showing timescale ticks
================================================== */

TL.TimeAxis = TL.Class.extend({

	includes: [TL.Events, TL.DomMixins, TL.I18NMixins],

	_el: {},

	/*	Constructor
	================================================== */
	initialize: function(elem, options) {
		// DOM Elements
		this._el = {
			container: {},
			content_container: {},
			major: {},
			minor: {},
		};

		// Components
		this._text			= {};

		// State
		this._state = {
			loaded: 		false
		};


		// Data
		this.data = {};

		// Options
		this.options = {
			duration: 				1000,
			ease: 					TL.Ease.easeInSpline,
			width: 					600,
			height: 				600
		};

		// Actively Displaying
		this.active = false;

		// Animation Object
		this.animator = {};

		// Axis Helper
		this.axis_helper = {};

		// Minor tick dom element array
		this.minor_ticks = [];

		// Minor tick dom element array
		this.major_ticks = [];

		// Date Format Lookup, map TL.Date.SCALES names to...
		this.dateformat_lookup = {
	        millisecond: 'time_milliseconds',     // ...TL.Language.<code>.dateformats
	        second: 'time_short',
	        minute: 'time_no_seconds_short',
	        hour: 'time_no_minutes_short',
	        day: 'full_short',
	        month: 'month_short',
	        year: 'year',
	        decade: 'year',
	        century: 'year',
	        millennium: 'year',
	        age: 'compact',  // ...TL.Language.<code>.bigdateformats
	        epoch: 'compact',
	        era: 'compact',
	        eon: 'compact',
	        eon2: 'compact'
	    }

		// Main element
		if (typeof elem === 'object') {
			this._el.container = elem;
		} else {
			this._el.container = TL.Dom.get(elem);
		}

		// Merge Data and Options
		TL.Util.mergeData(this.options, options);

		this._initLayout();
		this._initEvents();

	},

	/*	Adding, Hiding, Showing etc
	================================================== */
	show: function() {

	},

	hide: function() {

	},

	addTo: function(container) {
		container.appendChild(this._el.container);
	},

	removeFrom: function(container) {
		container.removeChild(this._el.container);
	},

	updateDisplay: function(w, h) {
		this._updateDisplay(w, h);
	},

	getLeft: function() {
		return this._el.container.style.left.slice(0, -2);
	},

	drawTicks: function(timescale, optimal_tick_width) {

		var ticks = timescale.getTicks();

		var controls = {
			minor: {
				el: this._el.minor,
				dateformat: this.dateformat_lookup[ticks['minor'].name],
				ts_ticks: ticks['minor'].ticks,
				tick_elements: this.minor_ticks
			},
			major: {
				el: this._el.major,
				dateformat: this.dateformat_lookup[ticks['major'].name],
				ts_ticks: ticks['major'].ticks,
				tick_elements: this.major_ticks
			}
		}
		// FADE OUT
		this._el.major.className = "tl-timeaxis-major";
		this._el.minor.className = "tl-timeaxis-minor";
		this._el.major.style.opacity = 0;
		this._el.minor.style.opacity = 0;

		// CREATE MAJOR TICKS
		this.major_ticks = this._createTickElements(
			ticks['major'].ticks,
			this._el.major,
			this.dateformat_lookup[ticks['major'].name]
		);

		// CREATE MINOR TICKS
		this.minor_ticks = this._createTickElements(
			ticks['minor'].ticks,
			this._el.minor,
			this.dateformat_lookup[ticks['minor'].name],
			ticks['major'].ticks
		);

		this.positionTicks(timescale, optimal_tick_width, true);

		// FADE IN
		this._el.major.className = "tl-timeaxis-major tl-animate-opacity tl-timeaxis-animate-opacity";
		this._el.minor.className = "tl-timeaxis-minor tl-animate-opacity tl-timeaxis-animate-opacity";
		this._el.major.style.opacity = 1;
		this._el.minor.style.opacity = 1;
	},

	_createTickElements: function(ts_ticks,tick_element,dateformat,ticks_to_skip) {
		tick_element.innerHTML = "";
		var skip_times = {};

		var yearZero = new Date(-1,13,-30);
		skip_times[yearZero.getTime()] = true;

		if (ticks_to_skip){
			for (var i = 0; i < ticks_to_skip.length; i++) {
				skip_times[ticks_to_skip[i].getTime()] = true;
			}
		}

		var tick_elements = []
		for (var i = 0; i < ts_ticks.length; i++) {
			var ts_tick = ts_ticks[i];
			if (!(ts_tick.getTime() in skip_times)) {
				var tick = TL.Dom.create("div", "tl-timeaxis-tick", tick_element),
					tick_text 	= TL.Dom.create("span", "tl-timeaxis-tick-text tl-animate-opacity", tick);

				tick_text.innerHTML = ts_tick.getDisplayDate(this.getLanguage(), dateformat);

				tick_elements.push({
					tick:tick,
					tick_text:tick_text,
					display_date:ts_tick.getDisplayDate(this.getLanguage(), dateformat),
					date:ts_tick
				});
			}
		}
		return tick_elements;
	},

	positionTicks: function(timescale, optimal_tick_width, no_animate) {

		// Handle Animation
		if (no_animate) {
			this._el.major.className = "tl-timeaxis-major";
			this._el.minor.className = "tl-timeaxis-minor";
		} else {
			this._el.major.className = "tl-timeaxis-major tl-timeaxis-animate";
			this._el.minor.className = "tl-timeaxis-minor tl-timeaxis-animate";
		}

		this._positionTickArray(this.major_ticks, timescale, optimal_tick_width);
		this._positionTickArray(this.minor_ticks, timescale, optimal_tick_width);

	},

	_positionTickArray: function(tick_array, timescale, optimal_tick_width) {
		// Poition Ticks & Handle density of ticks
		if (tick_array[1] && tick_array[0]) {
			var distance = ( timescale.getPosition(tick_array[1].date.getMillisecond()) - timescale.getPosition(tick_array[0].date.getMillisecond()) ),
				fraction_of_array = 1;


			if (distance < optimal_tick_width) {
				fraction_of_array = Math.round(optimal_tick_width/timescale.getPixelsPerTick());
			}

			var show = 1;

			for (var i = 0; i < tick_array.length; i++) {

				var tick = tick_array[i];

				// Poition Ticks
				tick.tick.style.left = timescale.getPosition(tick.date.getMillisecond()) + "px";
				tick.tick_text.innerHTML = tick.display_date;

				// Handle density of ticks
				if (fraction_of_array > 1) {
					if (show >= fraction_of_array) {
						show = 1;
						tick.tick_text.style.opacity = 1;
						tick.tick.className = "tl-timeaxis-tick";
					} else {
						show++;
						tick.tick_text.style.opacity = 0;
						tick.tick.className = "tl-timeaxis-tick tl-timeaxis-tick-hidden";
					}
				} else {
					tick.tick_text.style.opacity = 1;
					tick.tick.className = "tl-timeaxis-tick";
				}

			};
		}
	},

	/*	Events
	================================================== */


	/*	Private Methods
	================================================== */
	_initLayout: function () {
		this._el.content_container		= TL.Dom.create("div", "tl-timeaxis-content-container", this._el.container);
		this._el.major					= TL.Dom.create("div", "tl-timeaxis-major", this._el.content_container);
		this._el.minor					= TL.Dom.create("div", "tl-timeaxis-minor", this._el.content_container);

		// Fire event that the slide is loaded
		this.onLoaded();
	},

	_initEvents: function() {

	},

	// Update Display
	_updateDisplay: function(width, height, layout) {

		if (width) {
			this.options.width 					= width;
		}

		if (height) {
			this.options.height = height;
		}

	}

});


/* **********************************************
     Begin TL.AxisHelper.js
********************************************** */

/*  TL.AxisHelper
    Strategies for laying out the timenav
    markers and time axis
    Intended as a private class -- probably only known to TimeScale
================================================== */
TL.AxisHelper = TL.Class.extend({
    initialize: function (options) {
		if (options) {
            this.scale = options.scale;
	        this.minor = options.minor;
	        this.major = options.major;
		} else {
            throw new TL.Error("axis_helper_no_options_err")
        }
       
    },
    
    getPixelsPerTick: function(pixels_per_milli) {
        return pixels_per_milli * this.minor.factor;
    },

    getMajorTicks: function(timescale) {
		return this._getTicks(timescale, this.major)
    },

    getMinorTicks: function(timescale) {
        return this._getTicks(timescale, this.minor)
    },

    _getTicks: function(timescale, option) {

        var factor_scale = timescale._scaled_padding * option.factor;
        var first_tick_time = timescale._earliest - factor_scale;
        var last_tick_time = timescale._latest + factor_scale;
        var ticks = []
        for (var i = first_tick_time; i < last_tick_time; i += option.factor) {
            ticks.push(timescale.getDateFromTime(i).floor(option.name));
        }

        return {
            name: option.name,
            ticks: ticks
        }

    }

});

(function(cls){ // add some class-level behavior

    var HELPERS = {};
    
    var setHelpers = function(scale_type, scales) {
        HELPERS[scale_type] = [];
        
        for (var idx = 0; idx < scales.length - 1; idx++) {
            var minor = scales[idx];
            var major = scales[idx+1];
            HELPERS[scale_type].push(new cls({
                scale: minor[3],
                minor: { name: minor[0], factor: minor[1]},
                major: { name: major[0], factor: major[1]}
            }));
        }
    };
    
    setHelpers('human', TL.Date.SCALES);
    setHelpers('cosmological', TL.BigDate.SCALES);
    
    cls.HELPERS = HELPERS;
    
    cls.getBestHelper = function(ts,optimal_tick_width) {
        if (typeof(optimal_tick_width) != 'number' ) {
            optimal_tick_width = 100;
        }
        var ts_scale = ts.getScale();
        var helpers = HELPERS[ts_scale];
        
        if (!helpers) {
            throw new TL.Error("axis_helper_scale_err", ts_scale);
        }
        
        var prev = null;
        for (var idx = 0; idx < helpers.length; idx++) {
            var curr = helpers[idx];
            var pixels_per_tick = curr.getPixelsPerTick(ts._pixels_per_milli);
            if (pixels_per_tick > optimal_tick_width)  {
                if (prev == null) return curr;
                var curr_dist = Math.abs(optimal_tick_width - pixels_per_tick);
                var prev_dist = Math.abs(optimal_tick_width - pixels_per_tick);
                if (curr_dist < prev_dist) {
                    return curr;
                } else {
                    return prev;
                }
            }
            prev = curr;
        }
        return helpers[helpers.length - 1]; // last resort           
    }
})(TL.AxisHelper);


/* **********************************************
     Begin TL.Timeline.js
********************************************** */

/*  TimelineJS
Designed and built by Zach Wise at KnightLab

This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at https://mozilla.org/MPL/2.0/.

================================================== */
/*
TODO

*/

/*  Required Files
CodeKit Import
https://incident57.com/codekit/
================================================== */

// CORE
	// @codekit-prepend "core/TL.js";
	// @codekit-prepend "core/TL.Error.js";
	// @codekit-prepend "core/TL.Util.js";
	// @codekit-prepend "data/TL.Data.js";
	// @codekit-prepend "core/TL.Class.js";
	// @codekit-prepend "core/TL.Events.js";
	// @codekit-prepend "core/TL.Browser.js";
	// @codekit-prepend "core/TL.Load.js";
	// @codekit-prepend "core/TL.TimelineConfig.js";
	// @codekit-prepend "core/TL.ConfigFactory.js";


// LANGUAGE
	// @codekit-prepend "language/TL.Language.js";
	// @codekit-prepend "language/TL.I18NMixins.js";

// ANIMATION
	// @codekit-prepend "animation/TL.Ease.js";
	// @codekit-prepend "animation/TL.Animate.js";

// DOM
	// @codekit-prepend "dom/TL.Point.js";
	// @codekit-prepend "dom/TL.DomMixins.js";
	// @codekit-prepend "dom/TL.Dom.js";
	// @codekit-prepend "dom/TL.DomUtil.js";
	// @codekit-prepend "dom/TL.DomEvent.js";
	// @codekit-prepend "dom/TL.StyleSheet.js";

// Date
	// @codekit-prepend "date/TL.Date.js";
	// @codekit-prepend "date/TL.DateUtil.js";

// UI
	// @codekit-prepend "ui/TL.Draggable.js";
	// @codekit-prepend "ui/TL.Swipable.js";
	// @codekit-prepend "ui/TL.MenuBar.js";
	// @codekit-prepend "ui/TL.Message.js";

// MEDIA
	// @codekit-prepend "media/TL.MediaType.js";
	// @codekit-prepend "media/TL.Media.js";

// MEDIA TYPES
	// @codekit-prepend "media/types/TL.Media.Blockquote.js";
	// @codekit-prepend "media/types/TL.Media.DailyMotion.js";
	// @codekit-prepend "media/types/TL.Media.DocumentCloud.js";
	// @codekit-prepend "media/types/TL.Media.Flickr.js";
	// @codekit-prepend "media/types/TL.Media.GoogleDoc.js";
	// @codekit-prepend "media/types/TL.Media.GooglePlus.js";
	// @codekit-prepend "media/types/TL.Media.IFrame.js";
	// @codekit-prepend "media/types/TL.Media.Image.js";
	// @codekit-prepend "media/types/TL.Media.Imgur.js";
	// @codekit-prepend "media/types/TL.Media.Instagram.js";
	// @codekit-prepend "media/types/TL.Media.GoogleMap.js";
	// @codekit-prepend "media/types/TL.Media.PDF.js";
	// @codekit-prepend "media/types/TL.Media.Profile.js";
	// @codekit-prepend "media/types/TL.Media.Slider.js";
	// @codekit-prepend "media/types/TL.Media.SoundCloud.js";
	// @codekit-prepend "media/types/TL.Media.Spotify.js";
	// @codekit-prepend "media/types/TL.Media.Storify.js";
	// @codekit-prepend "media/types/TL.Media.Text.js";
	// @codekit-prepend "media/types/TL.Media.Twitter.js";
	// @codekit-prepend "media/types/TL.Media.TwitterEmbed.js";
	// @codekit-prepend "media/types/TL.Media.Vimeo.js";
	// @codekit-prepend "media/types/TL.Media.Vine.js";
	// @codekit-prepend "media/types/TL.Media.Website.js";
	// @codekit-prepend "media/types/TL.Media.Wikipedia.js";
	// @codekit-prepend "media/types/TL.Media.Wistia.js";
	// @codekit-prepend "media/types/TL.Media.YouTube.js";
	// @codekit-prepend "media/types/TL.Media.Audio.js";
	// @codekit-prepend "media/types/TL.Media.Video.js";

// STORYSLIDER
	// @codekit-prepend "slider/TL.Slide.js";
	// @codekit-prepend "slider/TL.SlideNav.js";
	// @codekit-prepend "slider/TL.StorySlider.js";

// TIMENAV
	// @codekit-prepend "timenav/TL.TimeNav.js";
	// @codekit-prepend "timenav/TL.TimeMarker.js";
	// @codekit-prepend "timenav/TL.TimeEra.js";
	// @codekit-prepend "timenav/TL.TimeGroup.js";
	// @codekit-prepend "timenav/TL.TimeScale.js";
	// @codekit-prepend "timenav/TL.TimeAxis.js";
	// @codekit-prepend "timenav/TL.AxisHelper.js";


TL.Timeline = TL.Class.extend({
	includes: [TL.Events, TL.I18NMixins],

	/*  Private Methods
	================================================== */
	initialize: function (elem, data, options) {
		var self = this;
		if (!options) { options = {}};
		// Version
		this.version = "3.2.6";

		// Ready
		this.ready = false;

		// DOM ELEMENTS
		this._el = {
			container: {},
			storyslider: {},
			timenav: {},
			menubar: {}
		};

		// Determine Container Element
		if (typeof elem === 'object') {
			this._el.container = elem;
		} else {
			this._el.container = TL.Dom.get(elem);
		}

		// Slider
		this._storyslider = {};

		// Style Sheet
		this._style_sheet = new TL.StyleSheet();

		// TimeNav
		this._timenav = {};

		// Menu Bar
		this._menubar = {};

		// Loaded State
		this._loaded = {storyslider:false, timenav:false};

		// Data Object
		this.config = null;

		this.options = {
			script_path: 				"",
			height: 					this._el.container.offsetHeight,
			width: 						this._el.container.offsetWidth,
			debug: 						false,
			is_embed: 					false,
			is_full_embed: 				false,
			hash_bookmark: false,
			default_bg_color: 			{r:255, g:255, b:255},
			scale_factor: 				2,						// How many screen widths wide should the timeline be
			layout: 					"landscape",			// portrait or landscape
			timenav_position: 			"bottom",				// timeline on top or bottom
			optimal_tick_width: 		60,						// optimal distance (in pixels) between ticks on axis
			base_class: 				"tl-timeline", 		// removing tl-timeline will break all default stylesheets...
			timenav_height: 			null,
			timenav_height_percentage: 	25,						// Overrides timenav height as a percentage of the screen
			timenav_mobile_height_percentage: 40, 				// timenav height as a percentage on mobile devices
			timenav_height_min: 		175,					// Minimum timenav height
			marker_height_min: 			30,						// Minimum Marker Height
			marker_width_min: 			100,					// Minimum Marker Width
			marker_padding: 			5,						// Top Bottom Marker Padding
			start_at_slide: 			0,
			start_at_end: 				false,
			menubar_height: 			0,
			skinny_size: 				650,
			medium_size: 				800,
			relative_date: 				false,					// Use momentjs to show a relative date from the slide.text.date.created_time field
			use_bc: 					false,					// Use declared suffix on dates earlier than 0
			// animation
			duration: 					1000,
			ease: 						TL.Ease.easeInOutQuint,
			// interaction
			dragging: 					true,
			trackResize: 				true,
			map_type: 					"stamen:toner-lite",
			slide_padding_lr: 			100,					// padding on slide of slide
			slide_default_fade: 		"0%",					// landscape fade
			zoom_sequence: 				[0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89], // Array of Fibonacci numbers for TimeNav zoom levels
			language: 					"en",
			ga_property_id: 			null,
			track_events: 				['back_to_start','nav_next','nav_previous','zoom_in','zoom_out' ]
		};

		// Animation Objects
		this.animator_timenav = null;
		this.animator_storyslider = null;
		this.animator_menubar = null;

		// Add message to DOM
		this.message = new TL.Message({}, {message_class: "tl-message-full"}, this._el.container);

		// Merge Options
		if (typeof(options.default_bg_color) == "string") {
			var parsed = TL.Util.hexToRgb(options.default_bg_color); // will clear it out if its invalid
			if (parsed) {
				options.default_bg_color = parsed;
			} else {
				delete options.default_bg_color
				trace("Invalid default background color. Ignoring.");
			}
		}
		TL.Util.mergeData(this.options, options);

		window.addEventListener("resize", function(e){
			self.updateDisplay();
		});

		// Set Debug Mode
		TL.debug = this.options.debug;

		// Apply base class to container
		TL.DomUtil.addClass(this._el.container, 'tl-timeline');

		if (this.options.is_embed) {
			TL.DomUtil.addClass(this._el.container, 'tl-timeline-embed');
		}

		if (this.options.is_full_embed) {
			TL.DomUtil.addClass(this._el.container, 'tl-timeline-full-embed');
		}

		document.addEventListener("keydown", function(event) {
			var keyName = event.key;
			var currentSlide = self._getSlideIndex(self.current_id);
			var _n = self.config.events.length - 1;
			var lastSlide = self.config.title ? _n + 1 : _n;
			var firstSlide = 0;

			if (keyName == 'ArrowLeft'){
				if (currentSlide!=firstSlide){
					self.goToPrev();
				}
			}
			else if (keyName == 'ArrowRight'){
				if (currentSlide!=lastSlide){
					self.goToNext();
				}
			}
		});

		// Use Relative Date Calculations
		// NOT YET IMPLEMENTED
		if(this.options.relative_date) {
			if (typeof(moment) !== 'undefined') {
				self._loadLanguage(data);
			} else {
				TL.Load.js(this.options.script_path + "/library/moment.js", function() {
					self._loadLanguage(data);
					trace("LOAD MOMENTJS")
				});
			}
		} else {
			self._loadLanguage(data);
		}

	},
	_translateError: function(e) {
	    if(e.hasOwnProperty('stack')) {
	        trace(e.stack);
	    }
	    if(e.message_key) {
	        return this._(e.message_key) + (e.detail ? ' [' + e.detail +']' : '')
	    }
	    return e;
	},

	/*  Load Language
	================================================== */
	_loadLanguage: function(data) {
		try {
		    this.options.language = new TL.Language(this.options);

		    this._initData(data);
		} catch(e) {
		    this.showMessage(this._translateError(e));
		}
	},


	/*  Navigation
	================================================== */

	// Goto slide with id
	goToId: function(id) {
		if (this.current_id != id) {
			this.current_id = id;
			this._timenav.goToId(this.current_id);
			this._storyslider.goToId(this.current_id, false, true);
			this.fire("change", {unique_id: this.current_id}, this);
		}
	},

	// Goto slide n
	goTo: function(n) {
		if(this.config.title) {
			if(n == 0) {
				this.goToId(this.config.title.unique_id);
			} else {
				this.goToId(this.config.events[n - 1].unique_id);
			}
		} else {
			this.goToId(this.config.events[n].unique_id);
		}
	},

	// Goto first slide
	goToStart: function() {
		this.goTo(0);
	},

	// Goto last slide
	goToEnd: function() {
		var _n = this.config.events.length - 1;
		this.goTo(this.config.title ? _n + 1 : _n);
	},

	// Goto previous slide
	goToPrev: function() {
		this.goTo(this._getSlideIndex(this.current_id) - 1);
	},

	// Goto next slide
	goToNext: function() {
		this.goTo(this._getSlideIndex(this.current_id) + 1);
	},

	/* Event maniupluation
	================================================== */

	// Add an event
	add: function(data) {
		var unique_id = this.config.addEvent(data);

		var n = this._getEventIndex(unique_id);
		var d = this.config.events[n];

		this._storyslider.createSlide(d, this.config.title ? n+1 : n);
		this._storyslider._updateDrawSlides();

		this._timenav.createMarker(d, n);
		this._timenav._updateDrawTimeline(false);

		this.fire("added", {unique_id: unique_id});
	},

	// Remove an event
	remove: function(n) {
		if(n >= 0  && n < this.config.events.length) {
			// If removing the current, nav to new one first
			if(this.config.events[n].unique_id == this.current_id) {
				if(n < this.config.events.length - 1) {
					this.goTo(n + 1);
				} else {
					this.goTo(n - 1);
				}
			}

			var event = this.config.events.splice(n, 1);
			delete this.config.event_dict[event[0].unique_id];
			this._storyslider.destroySlide(this.config.title ? n+1 : n);
			this._storyslider._updateDrawSlides();

			this._timenav.destroyMarker(n);
			this._timenav._updateDrawTimeline(false);

			this.fire("removed", {unique_id: event[0].unique_id});
		}
	},

	removeId: function(id) {
		this.remove(this._getEventIndex(id));
	},

	/* Get slide data
	================================================== */

	getData: function(n) {
		if(this.config.title) {
			if(n == 0) {
				return this.config.title;
			} else if(n > 0 && n <= this.config.events.length) {
				return this.config.events[n - 1];
			}
		} else if(n >= 0 && n < this.config.events.length) {
			return this.config.events[n];
		}
		return null;
	},

	getDataById: function(id) {
		return this.getData(this._getSlideIndex(id));
	},

	/* Get slide object
	================================================== */

	getSlide: function(n) {
		if(n >= 0 && n < this._storyslider._slides.length) {
			return this._storyslider._slides[n];
		}
		return null;
	},

	getSlideById: function(id) {
		return this.getSlide(this._getSlideIndex(id));
	},

	getCurrentSlide: function() {
		return this.getSlideById(this.current_id);
	},


	/*  Display
	================================================== */
	updateDisplay: function() {
		if (this.ready) {
			this._updateDisplay();
		}
	},

  	/*
  		Compute the height of the navigation section of the Timeline, taking into account
  		the possibility of an explicit height or height percentage, but also honoring the
  		`timenav_height_min` option value. If `timenav_height` is specified it takes precedence over `timenav_height_percentage` but in either case, if the resultant pixel height is less than `options.timenav_height_min` then the value of `options.timenav_height_min` will be returned. (A minor adjustment is made to the returned value to account for marker padding.)

  		Arguments:
  		@timenav_height (optional): an integer value for the desired height in pixels
  		@timenav_height_percentage (optional): an integer between 1 and 100

  	 */
	_calculateTimeNavHeight: function(timenav_height, timenav_height_percentage) {

		var height = 0;

		if (timenav_height) {
			height = timenav_height;
		} else {
			if (this.options.timenav_height_percentage || timenav_height_percentage) {
				if (timenav_height_percentage) {
					height = Math.round((this.options.height/100)*timenav_height_percentage);
				} else {
					height = Math.round((this.options.height/100)*this.options.timenav_height_percentage);
				}

			}
		}

		// Set new minimum based on how many rows needed
		if (this._timenav.ready) {
			if (this.options.timenav_height_min < this._timenav.getMinimumHeight()) {
				this.options.timenav_height_min = this._timenav.getMinimumHeight();
			}
		}

		// If height is less than minimum set it to minimum
		if (height < this.options.timenav_height_min) {
			height = this.options.timenav_height_min;
		}

		height = height - (this.options.marker_padding * 2);

		return height;
	},

	/*  Private Methods
	================================================== */

	// Update View
	_updateDisplay: function(timenav_height, animate, d) {
		var duration    = this.options.duration,
		display_class   = this.options.base_class,
		menu_position   = 0,
		self      = this;

		if (d) {
			duration = d;
		}

		// Update width and height
		this.options.width = this._el.container.offsetWidth;
		this.options.height = this._el.container.offsetHeight;

		// Check if skinny
		if (this.options.width <= this.options.skinny_size) {
			display_class += " tl-skinny";
			this.options.layout = "portrait";
		} else if (this.options.width <= this.options.medium_size) {
			display_class += " tl-medium";
			this.options.layout = "landscape";
		} else {
			this.options.layout = "landscape";
		}

		// Detect Mobile and Update Orientation on Touch devices
		if (TL.Browser.touch) {
			this.options.layout = TL.Browser.orientation();
		}

		if (TL.Browser.mobile) {
			display_class += " tl-mobile";
			// Set TimeNav Height
			this.options.timenav_height = this._calculateTimeNavHeight(timenav_height, this.options.timenav_mobile_height_percentage);
		} else {
			// Set TimeNav Height
			this.options.timenav_height = this._calculateTimeNavHeight(timenav_height);
		}

		// LAYOUT
		if (this.options.layout == "portrait") {
			// Portrait
			display_class += " tl-layout-portrait";

		} else {
			// Landscape
			display_class += " tl-layout-landscape";

		}

		// Set StorySlider Height
		this.options.storyslider_height = (this.options.height - this.options.timenav_height);

		// Positon Menu
		if (this.options.timenav_position == "top") {
			menu_position = ( Math.ceil(this.options.timenav_height)/2 ) - (this._el.menubar.offsetHeight/2) - (39/2) ;
		} else {
			menu_position = Math.round(this.options.storyslider_height + 1 + ( Math.ceil(this.options.timenav_height)/2 ) - (this._el.menubar.offsetHeight/2) - (35/2));
		}


		if (animate) {

			// Animate TimeNav

			/*
			if (this.animator_timenav) {
			this.animator_timenav.stop();
			}

			this.animator_timenav = TL.Animate(this._el.timenav, {
			height:   (this.options.timenav_height) + "px",
			duration:   duration/4,
			easing:   TL.Ease.easeOutStrong,
			complete: function () {
			//self._map.updateDisplay(self.options.width, self.options.timenav_height, animate, d, self.options.menubar_height);
			}
			});
			*/

			this._el.timenav.style.height = Math.ceil(this.options.timenav_height) + "px";

			// Animate StorySlider
			if (this.animator_storyslider) {
				this.animator_storyslider.stop();
			}
			this.animator_storyslider = TL.Animate(this._el.storyslider, {
				height:   this.options.storyslider_height + "px",
				duration:   duration/2,
				easing:   TL.Ease.easeOutStrong
			});

			// Animate Menubar
			if (this.animator_menubar) {
				this.animator_menubar.stop();
			}

			this.animator_menubar = TL.Animate(this._el.menubar, {
				top:  menu_position + "px",
				duration:   duration/2,
				easing:   TL.Ease.easeOutStrong
			});

		} else {
			// TimeNav
			this._el.timenav.style.height = Math.ceil(this.options.timenav_height) + "px";

			// StorySlider
			this._el.storyslider.style.height = this.options.storyslider_height + "px";

			// Menubar
			this._el.menubar.style.top = menu_position + "px";
		}

		if (this.message) {
			this.message.updateDisplay(this.options.width, this.options.height);
		}
		// Update Component Displays
		this._timenav.updateDisplay(this.options.width, this.options.timenav_height, animate);
		this._storyslider.updateDisplay(this.options.width, this.options.storyslider_height, animate, this.options.layout);

		if (this.options.language.direction == 'rtl') {
			display_class += ' tl-rtl';
		}


		// Apply class
		this._el.container.className = display_class;

	},

	// Update hashbookmark in the url bar
	_updateHashBookmark: function(id) {
		var hash = "#" + "event-" + id.toString();
		if (window.location.protocol != 'file:') {
			window.history.replaceState(null, "Browsing TimelineJS", hash);
		}
		this.fire("hash_updated", {unique_id:this.current_id, hashbookmark:"#" + "event-" + id.toString()}, this);
	},

	/*  Init
	================================================== */
	// Initialize the data
	_initData: function(data) {
		var self = this;

		if (typeof data == 'string') {
			var self = this;
			TL.ConfigFactory.makeConfig(data, function(config) {
				self.setConfig(config);
			});
		} else if (TL.TimelineConfig == data.constructor) {
			this.setConfig(data);
		} else {
			this.setConfig(new TL.TimelineConfig(data));
		}
	},

	setConfig: function(config) {
		this.config = config;
		this.config.validate();
		this._validateOptions();
		if (this.config.isValid()) {
		    try {
			    this._onDataLoaded();
			} catch(e) {
			    this.showMessage("<strong>"+ this._('error') +":</strong> " + this._translateError(e));
			}
		} else {
		    var translated_errs = [];

		    for(var i = 0, errs = this.config.getErrors(); i < errs.length; i++) {
		        translated_errs.push(this._translateError(errs[i]));
		    }

			this.showMessage("<strong>"+ this._('error') +":</strong> " + translated_errs.join('<br>'));
			// should we set 'self.ready'? if not, it won't resize,
			// but most resizing would only work
			// if more setup happens
		}
	},
	_validateOptions: function() {
		// assumes that this.options and this.config have been set.
		var INTEGER_PROPERTIES = ['timenav_height', 'timenav_height_min', 'marker_height_min', 'marker_width_min', 'marker_padding', 'start_at_slide', 'slide_padding_lr'  ];

		for (var i = 0; i < INTEGER_PROPERTIES.length; i++) {
				var opt = INTEGER_PROPERTIES[i];
				var value = this.options[opt];
				valid = true;
				if (typeof(value) == 'number') {
					valid = (value == parseInt(value))
				} else if (typeof(value) == "string") {
					valid = (value.match(/^\s*(\-?\d+)?\s*$/));
				}
				if (!valid) {
					this.config.logError({ message_key: 'invalid_integer_option', detail: opt });
				}
		}
	},
	// Initialize the layout
	_initLayout: function () {
		var self = this;

        this.message.removeFrom(this._el.container);
		this._el.container.innerHTML = "";

		// Create Layout
		if (this.options.timenav_position == "top") {
			this._el.timenav		= TL.Dom.create('div', 'tl-timenav', this._el.container);
			this._el.storyslider	= TL.Dom.create('div', 'tl-storyslider', this._el.container);
		} else {
			this._el.storyslider  	= TL.Dom.create('div', 'tl-storyslider', this._el.container);
			this._el.timenav		= TL.Dom.create('div', 'tl-timenav', this._el.container);
		}

		this._el.menubar			= TL.Dom.create('div', 'tl-menubar', this._el.container);


		// Initial Default Layout
		this.options.width        = this._el.container.offsetWidth;
		this.options.height       = this._el.container.offsetHeight;
		// this._el.storyslider.style.top  = "1px";

		// Set TimeNav Height
		this.options.timenav_height = this._calculateTimeNavHeight(this.options.timenav_height);

		// Create TimeNav
		this._timenav = new TL.TimeNav(this._el.timenav, this.config, this.options);
		this._timenav.on('loaded', this._onTimeNavLoaded, this);
		this._timenav.on('update_timenav_min', this._updateTimeNavHeightMin, this);
		this._timenav.options.height = this.options.timenav_height;
		this._timenav.init();

        // intial_zoom cannot be applied before the timenav has been created
        if (this.options.initial_zoom) {
            // at this point, this.options refers to the merged set of options
            this.setZoom(this.options.initial_zoom);
        }

		// Create StorySlider
		this._storyslider = new TL.StorySlider(this._el.storyslider, this.config, this.options);
		this._storyslider.on('loaded', this._onStorySliderLoaded, this);
		this._storyslider.init();

		// Create Menu Bar
		this._menubar = new TL.MenuBar(this._el.menubar, this._el.container, this.options);

		// LAYOUT
		if (this.options.layout == "portrait") {
			this.options.storyslider_height = (this.options.height - this.options.timenav_height - 1);
		} else {
			this.options.storyslider_height = (this.options.height - 1);
		}


		// Update Display
		this._updateDisplay(this._timenav.options.height, true, 2000);

	},

  /* Depends upon _initLayout because these events are on things the layout initializes */
	_initEvents: function () {
		// TimeNav Events
		this._timenav.on('change', this._onTimeNavChange, this);
		this._timenav.on('zoomtoggle', this._onZoomToggle, this);

		// StorySlider Events
		this._storyslider.on('change', this._onSlideChange, this);
		this._storyslider.on('colorchange', this._onColorChange, this);
		this._storyslider.on('nav_next', this._onStorySliderNext, this);
		this._storyslider.on('nav_previous', this._onStorySliderPrevious, this);

		// Menubar Events
		this._menubar.on('zoom_in', this._onZoomIn, this);
		this._menubar.on('zoom_out', this._onZoomOut, this);
		this._menubar.on('back_to_start', this._onBackToStart, this);

	},

	/* Analytics
	================================================== */
	_initGoogleAnalytics: function() {
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		ga('create', this.options.ga_property_id, 'auto');
		ga('set', 'anonymizeIp', true);
	},

	_initAnalytics: function() {
		if (this.options.ga_property_id === null) { return; }
		this._initGoogleAnalytics();
        ga('send', 'pageview');
		var events = this.options.track_events;
		for (i=0; i < events.length; i++) {
			var event_ = events[i];
			this.addEventListener(event_, function(e) {
				ga('send', 'event', e.type, 'clicked');
			});
		}
	},

	_onZoomToggle: function(e) {
		if (e.zoom == "in") {
			this._menubar.toogleZoomIn(e.show);
		} else if (e.zoom == "out") {
			this._menubar.toogleZoomOut(e.show);
		}

	},

	/* Get index of event by id
	================================================== */
	_getEventIndex: function(id) {
		for(var i = 0; i < this.config.events.length; i++) {
			if(id == this.config.events[i].unique_id) {
				return i;
			}
		}
		return -1;
	},

	/*  Get index of slide by id
	================================================== */
	_getSlideIndex: function(id) {
		if(this.config.title && this.config.title.unique_id == id) {
			return 0;
		}
		for(var i = 0; i < this.config.events.length; i++) {
			if(id == this.config.events[i].unique_id) {
				return this.config.title ? i+1 : i;
			}
		}
		return -1;
	},

	/*  Events
	================================================== */

	_onDataLoaded: function(e) {
		this.fire("dataloaded");
		this._initLayout();
		this._initEvents();
		this._initAnalytics();
		if (this.message) {
			this.message.hide();
		}

		this.ready = true;

	},

	showMessage: function(msg) {
		if (this.message) {
			this.message.updateMessage(msg);
		} else {
			trace("No message display available.")
			trace(msg);
		}
	},

	_onColorChange: function(e) {
		this.fire("color_change", {unique_id:this.current_id}, this);
		if (e.color || e.image) {

		} else {

		}
	},

	_onSlideChange: function(e) {
		if (this.current_id != e.unique_id) {
			this.current_id = e.unique_id;
			this._timenav.goToId(this.current_id);
			this._onChange(e);
		}
	},

	_onTimeNavChange: function(e) {
		if (this.current_id != e.unique_id) {
			this.current_id = e.unique_id;
			this._storyslider.goToId(this.current_id);
			this._onChange(e);
		}
	},

	_onChange: function(e) {
		this.fire("change", {unique_id:this.current_id}, this);
		if (this.options.hash_bookmark && this.current_id) {
			this._updateHashBookmark(this.current_id);
		}
	},

	_onBackToStart: function(e) {
		this._storyslider.goTo(0);
		this.fire("back_to_start", {unique_id:this.current_id}, this);
	},

	/**
	 * Zoom in and zoom out should be part of the public API.
	 */
	zoomIn: function() {
	    this._timenav.zoomIn();
	},
	zoomOut: function() {
	    this._timenav.zoomOut();
	},

	setZoom: function(level) {
	    this._timenav.setZoom(level);
	},

	_onZoomIn: function(e) {
		this._timenav.zoomIn();
		this.fire("zoom_in", {zoom_level:this._timenav.options.scale_factor}, this);
	},

	_onZoomOut: function(e) {
		this._timenav.zoomOut();
		this.fire("zoom_out", {zoom_level:this._timenav.options.scale_factor}, this);
	},

	_onTimeNavLoaded: function() {
		this._loaded.timenav = true;
		this._onLoaded();
	},

	_onStorySliderLoaded: function() {
		this._loaded.storyslider = true;
		this._onLoaded();
	},

	_onStorySliderNext: function(e) {
		this.fire("nav_next", e);
	},

	_onStorySliderPrevious: function(e) {
		this.fire("nav_previous", e);
	},

	_onLoaded: function() {
		if (this._loaded.storyslider && this._loaded.timenav) {
			this.fire("loaded", this.config);
			// Go to proper slide
			if (this.options.hash_bookmark && window.location.hash != "") {
				this.goToId(window.location.hash.replace("#event-", ""));
			} else {
				if( TL.Util.isTrue(this.options.start_at_end) || this.options.start_at_slide > this.config.events.length ) {
					this.goToEnd();
				} else {
					this.goTo(this.options.start_at_slide);
				}
				if (this.options.hash_bookmark ) {
					this._updateHashBookmark(this.current_id);
				}
			}

		}
	}

});

TL.Timeline.source_path = (function() {
	var script_tags = document.getElementsByTagName('script');
	var src = script_tags[script_tags.length-1].src;
	return src.substr(0,src.lastIndexOf('/'));
})();


/*!
 * UAParser.js v0.7.21
 * Lightweight JavaScript-based User-Agent string parser
 * https://github.com/faisalman/ua-parser-js
 *
 * Copyright © 2012-2019 Faisal Salman <f@faisalman.com>
 * Licensed under MIT License
 */
(function(window,undefined){"use strict";var LIBVERSION="0.7.21",EMPTY="",UNKNOWN="?",FUNC_TYPE="function",UNDEF_TYPE="undefined",OBJ_TYPE="object",STR_TYPE="string",MAJOR="major",MODEL="model",NAME="name",TYPE="type",VENDOR="vendor",VERSION="version",ARCHITECTURE="architecture",CONSOLE="console",MOBILE="mobile",TABLET="tablet",SMARTTV="smarttv",WEARABLE="wearable",EMBEDDED="embedded";var util={extend:function(regexes,extensions){var mergedRegexes={};for(var i in regexes){if(extensions[i]&&extensions[i].length%2===0){mergedRegexes[i]=extensions[i].concat(regexes[i])}else{mergedRegexes[i]=regexes[i]}}return mergedRegexes},has:function(str1,str2){if(typeof str1==="string"){return str2.toLowerCase().indexOf(str1.toLowerCase())!==-1}else{return false}},lowerize:function(str){return str.toLowerCase()},major:function(version){return typeof version===STR_TYPE?version.replace(/[^\d\.]/g,"").split(".")[0]:undefined},trim:function(str){return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")}};var mapper={rgx:function(ua,arrays){var i=0,j,k,p,q,matches,match;while(i<arrays.length&&!matches){var regex=arrays[i],props=arrays[i+1];j=k=0;while(j<regex.length&&!matches){matches=regex[j++].exec(ua);if(!!matches){for(p=0;p<props.length;p++){match=matches[++k];q=props[p];if(typeof q===OBJ_TYPE&&q.length>0){if(q.length==2){if(typeof q[1]==FUNC_TYPE){this[q[0]]=q[1].call(this,match)}else{this[q[0]]=q[1]}}else if(q.length==3){if(typeof q[1]===FUNC_TYPE&&!(q[1].exec&&q[1].test)){this[q[0]]=match?q[1].call(this,match,q[2]):undefined}else{this[q[0]]=match?match.replace(q[1],q[2]):undefined}}else if(q.length==4){this[q[0]]=match?q[3].call(this,match.replace(q[1],q[2])):undefined}}else{this[q]=match?match:undefined}}}}i+=2}},str:function(str,map){for(var i in map){if(typeof map[i]===OBJ_TYPE&&map[i].length>0){for(var j=0;j<map[i].length;j++){if(util.has(map[i][j],str)){return i===UNKNOWN?undefined:i}}}else if(util.has(map[i],str)){return i===UNKNOWN?undefined:i}}return str}};var maps={browser:{oldsafari:{version:{"1.0":"/8",1.2:"/1",1.3:"/3","2.0":"/412","2.0.2":"/416","2.0.3":"/417","2.0.4":"/419","?":"/"}}},device:{amazon:{model:{"Fire Phone":["SD","KF"]}},sprint:{model:{"Evo Shift 4G":"7373KT"},vendor:{HTC:"APA",Sprint:"Sprint"}}},os:{windows:{version:{ME:"4.90","NT 3.11":"NT3.51","NT 4.0":"NT4.0",2000:"NT 5.0",XP:["NT 5.1","NT 5.2"],Vista:"NT 6.0",7:"NT 6.1",8:"NT 6.2",8.1:"NT 6.3",10:["NT 6.4","NT 10.0"],RT:"ARM"}}}};var regexes={browser:[[/(opera\smini)\/([\w\.-]+)/i,/(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,/(opera).+version\/([\w\.]+)/i,/(opera)[\/\s]+([\w\.]+)/i],[NAME,VERSION],[/(opios)[\/\s]+([\w\.]+)/i],[[NAME,"Opera Mini"],VERSION],[/\s(opr)\/([\w\.]+)/i],[[NAME,"Opera"],VERSION],[/(kindle)\/([\w\.]+)/i,/(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]*)/i,/(avant\s|iemobile|slim)(?:browser)?[\/\s]?([\w\.]*)/i,/(bidubrowser|baidubrowser)[\/\s]?([\w\.]+)/i,/(?:ms|\()(ie)\s([\w\.]+)/i,/(rekonq)\/([\w\.]*)/i,/(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon)\/([\w\.-]+)/i],[NAME,VERSION],[/(konqueror)\/([\w\.]+)/i],[[NAME,"Konqueror"],VERSION],[/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i],[[NAME,"IE"],VERSION],[/(edge|edgios|edga|edg)\/((\d+)?[\w\.]+)/i],[[NAME,"Edge"],VERSION],[/(yabrowser)\/([\w\.]+)/i],[[NAME,"Yandex"],VERSION],[/(Avast)\/([\w\.]+)/i],[[NAME,"Avast Secure Browser"],VERSION],[/(AVG)\/([\w\.]+)/i],[[NAME,"AVG Secure Browser"],VERSION],[/(puffin)\/([\w\.]+)/i],[[NAME,"Puffin"],VERSION],[/(focus)\/([\w\.]+)/i],[[NAME,"Firefox Focus"],VERSION],[/(opt)\/([\w\.]+)/i],[[NAME,"Opera Touch"],VERSION],[/((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i],[[NAME,"UCBrowser"],VERSION],[/(comodo_dragon)\/([\w\.]+)/i],[[NAME,/_/g," "],VERSION],[/(windowswechat qbcore)\/([\w\.]+)/i],[[NAME,"WeChat(Win) Desktop"],VERSION],[/(micromessenger)\/([\w\.]+)/i],[[NAME,"WeChat"],VERSION],[/(brave)\/([\w\.]+)/i],[[NAME,"Brave"],VERSION],[/(qqbrowserlite)\/([\w\.]+)/i],[NAME,VERSION],[/(QQ)\/([\d\.]+)/i],[NAME,VERSION],[/m?(qqbrowser)[\/\s]?([\w\.]+)/i],[NAME,VERSION],[/(baiduboxapp)[\/\s]?([\w\.]+)/i],[NAME,VERSION],[/(2345Explorer)[\/\s]?([\w\.]+)/i],[NAME,VERSION],[/(MetaSr)[\/\s]?([\w\.]+)/i],[NAME],[/(LBBROWSER)/i],[NAME],[/xiaomi\/miuibrowser\/([\w\.]+)/i],[VERSION,[NAME,"MIUI Browser"]],[/;fbav\/([\w\.]+);/i],[VERSION,[NAME,"Facebook"]],[/safari\s(line)\/([\w\.]+)/i,/android.+(line)\/([\w\.]+)\/iab/i],[NAME,VERSION],[/headlesschrome(?:\/([\w\.]+)|\s)/i],[VERSION,[NAME,"Chrome Headless"]],[/\swv\).+(chrome)\/([\w\.]+)/i],[[NAME,/(.+)/,"$1 WebView"],VERSION],[/((?:oculus|samsung)browser)\/([\w\.]+)/i],[[NAME,/(.+(?:g|us))(.+)/,"$1 $2"],VERSION],[/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i],[VERSION,[NAME,"Android Browser"]],[/(sailfishbrowser)\/([\w\.]+)/i],[[NAME,"Sailfish Browser"],VERSION],[/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i],[NAME,VERSION],[/(dolfin)\/([\w\.]+)/i],[[NAME,"Dolphin"],VERSION],[/(qihu|qhbrowser|qihoobrowser|360browser)/i],[[NAME,"360 Browser"]],[/((?:android.+)crmo|crios)\/([\w\.]+)/i],[[NAME,"Chrome"],VERSION],[/(coast)\/([\w\.]+)/i],[[NAME,"Opera Coast"],VERSION],[/fxios\/([\w\.-]+)/i],[VERSION,[NAME,"Firefox"]],[/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i],[VERSION,[NAME,"Mobile Safari"]],[/version\/([\w\.]+).+?(mobile\s?safari|safari)/i],[VERSION,NAME],[/webkit.+?(gsa)\/([\w\.]+).+?(mobile\s?safari|safari)(\/[\w\.]+)/i],[[NAME,"GSA"],VERSION],[/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i],[NAME,[VERSION,mapper.str,maps.browser.oldsafari.version]],[/(webkit|khtml)\/([\w\.]+)/i],[NAME,VERSION],[/(navigator|netscape)\/([\w\.-]+)/i],[[NAME,"Netscape"],VERSION],[/(swiftfox)/i,/(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,/(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([\w\.-]+)$/i,/(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,/(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,/(links)\s\(([\w\.]+)/i,/(gobrowser)\/?([\w\.]*)/i,/(ice\s?browser)\/v?([\w\._]+)/i,/(mosaic)[\/\s]([\w\.]+)/i],[NAME,VERSION]],cpu:[[/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i],[[ARCHITECTURE,"amd64"]],[/(ia32(?=;))/i],[[ARCHITECTURE,util.lowerize]],[/((?:i[346]|x)86)[;\)]/i],[[ARCHITECTURE,"ia32"]],[/windows\s(ce|mobile);\sppc;/i],[[ARCHITECTURE,"arm"]],[/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i],[[ARCHITECTURE,/ower/,"",util.lowerize]],[/(sun4\w)[;\)]/i],[[ARCHITECTURE,"sparc"]],[/((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+[;l]))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i],[[ARCHITECTURE,util.lowerize]]],device:[[/\((ipad|playbook);[\w\s\),;-]+(rim|apple)/i],[MODEL,VENDOR,[TYPE,TABLET]],[/applecoremedia\/[\w\.]+ \((ipad)/],[MODEL,[VENDOR,"Apple"],[TYPE,TABLET]],[/(apple\s{0,1}tv)/i],[[MODEL,"Apple TV"],[VENDOR,"Apple"],[TYPE,SMARTTV]],[/(archos)\s(gamepad2?)/i,/(hp).+(touchpad)/i,/(hp).+(tablet)/i,/(kindle)\/([\w\.]+)/i,/\s(nook)[\w\s]+build\/(\w+)/i,/(dell)\s(strea[kpr\s\d]*[\dko])/i],[VENDOR,MODEL,[TYPE,TABLET]],[/(kf[A-z]+)\sbuild\/.+silk\//i],[MODEL,[VENDOR,"Amazon"],[TYPE,TABLET]],[/(sd|kf)[0349hijorstuw]+\sbuild\/.+silk\//i],[[MODEL,mapper.str,maps.device.amazon.model],[VENDOR,"Amazon"],[TYPE,MOBILE]],[/android.+aft([bms])\sbuild/i],[MODEL,[VENDOR,"Amazon"],[TYPE,SMARTTV]],[/\((ip[honed|\s\w*]+);.+(apple)/i],[MODEL,VENDOR,[TYPE,MOBILE]],[/\((ip[honed|\s\w*]+);/i],[MODEL,[VENDOR,"Apple"],[TYPE,MOBILE]],[/(blackberry)[\s-]?(\w+)/i,/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]*)/i,/(hp)\s([\w\s]+\w)/i,/(asus)-?(\w+)/i],[VENDOR,MODEL,[TYPE,MOBILE]],[/\(bb10;\s(\w+)/i],[MODEL,[VENDOR,"BlackBerry"],[TYPE,MOBILE]],[/android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone|p00c)/i],[MODEL,[VENDOR,"Asus"],[TYPE,TABLET]],[/(sony)\s(tablet\s[ps])\sbuild\//i,/(sony)?(?:sgp.+)\sbuild\//i],[[VENDOR,"Sony"],[MODEL,"Xperia Tablet"],[TYPE,TABLET]],[/android.+\s([c-g]\d{4}|so[-l]\w+)(?=\sbuild\/|\).+chrome\/(?![1-6]{0,1}\d\.))/i],[MODEL,[VENDOR,"Sony"],[TYPE,MOBILE]],[/\s(ouya)\s/i,/(nintendo)\s([wids3u]+)/i],[VENDOR,MODEL,[TYPE,CONSOLE]],[/android.+;\s(shield)\sbuild/i],[MODEL,[VENDOR,"Nvidia"],[TYPE,CONSOLE]],[/(playstation\s[34portablevi]+)/i],[MODEL,[VENDOR,"Sony"],[TYPE,CONSOLE]],[/(sprint\s(\w+))/i],[[VENDOR,mapper.str,maps.device.sprint.vendor],[MODEL,mapper.str,maps.device.sprint.model],[TYPE,MOBILE]],[/(htc)[;_\s-]+([\w\s]+(?=\)|\sbuild)|\w+)/i,/(zte)-(\w*)/i,/(alcatel|geeksphone|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]*)/i],[VENDOR,[MODEL,/_/g," "],[TYPE,MOBILE]],[/(nexus\s9)/i],[MODEL,[VENDOR,"HTC"],[TYPE,TABLET]],[/d\/huawei([\w\s-]+)[;\)]/i,/(nexus\s6p|vog-l29|ane-lx1|eml-l29)/i],[MODEL,[VENDOR,"Huawei"],[TYPE,MOBILE]],[/android.+(bah2?-a?[lw]\d{2})/i],[MODEL,[VENDOR,"Huawei"],[TYPE,TABLET]],[/(microsoft);\s(lumia[\s\w]+)/i],[VENDOR,MODEL,[TYPE,MOBILE]],[/[\s\(;](xbox(?:\sone)?)[\s\);]/i],[MODEL,[VENDOR,"Microsoft"],[TYPE,CONSOLE]],[/(kin\.[onetw]{3})/i],[[MODEL,/\./g," "],[VENDOR,"Microsoft"],[TYPE,MOBILE]],[/\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?:?(\s4g)?)[\w\s]+build\//i,/mot[\s-]?(\w*)/i,/(XT\d{3,4}) build\//i,/(nexus\s6)/i],[MODEL,[VENDOR,"Motorola"],[TYPE,MOBILE]],[/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i],[MODEL,[VENDOR,"Motorola"],[TYPE,TABLET]],[/hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i],[[VENDOR,util.trim],[MODEL,util.trim],[TYPE,SMARTTV]],[/hbbtv.+maple;(\d+)/i],[[MODEL,/^/,"SmartTV"],[VENDOR,"Samsung"],[TYPE,SMARTTV]],[/\(dtv[\);].+(aquos)/i],[MODEL,[VENDOR,"Sharp"],[TYPE,SMARTTV]],[/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i,/((SM-T\w+))/i],[[VENDOR,"Samsung"],MODEL,[TYPE,TABLET]],[/smart-tv.+(samsung)/i],[VENDOR,[TYPE,SMARTTV],MODEL],[/((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i,/(sam[sung]*)[\s-]*(\w+-?[\w-]*)/i,/sec-((sgh\w+))/i],[[VENDOR,"Samsung"],MODEL,[TYPE,MOBILE]],[/sie-(\w*)/i],[MODEL,[VENDOR,"Siemens"],[TYPE,MOBILE]],[/(maemo|nokia).*(n900|lumia\s\d+)/i,/(nokia)[\s_-]?([\w-]*)/i],[[VENDOR,"Nokia"],MODEL,[TYPE,MOBILE]],[/android[x\d\.\s;]+\s([ab][1-7]\-?[0178a]\d\d?)/i],[MODEL,[VENDOR,"Acer"],[TYPE,TABLET]],[/android.+([vl]k\-?\d{3})\s+build/i],[MODEL,[VENDOR,"LG"],[TYPE,TABLET]],[/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i],[[VENDOR,"LG"],MODEL,[TYPE,TABLET]],[/(lg) netcast\.tv/i],[VENDOR,MODEL,[TYPE,SMARTTV]],[/(nexus\s[45])/i,/lg[e;\s\/-]+(\w*)/i,/android.+lg(\-?[\d\w]+)\s+build/i],[MODEL,[VENDOR,"LG"],[TYPE,MOBILE]],[/(lenovo)\s?(s(?:5000|6000)(?:[\w-]+)|tab(?:[\s\w]+))/i],[VENDOR,MODEL,[TYPE,TABLET]],[/android.+(ideatab[a-z0-9\-\s]+)/i],[MODEL,[VENDOR,"Lenovo"],[TYPE,TABLET]],[/(lenovo)[_\s-]?([\w-]+)/i],[VENDOR,MODEL,[TYPE,MOBILE]],[/linux;.+((jolla));/i],[VENDOR,MODEL,[TYPE,MOBILE]],[/((pebble))app\/[\d\.]+\s/i],[VENDOR,MODEL,[TYPE,WEARABLE]],[/android.+;\s(oppo)\s?([\w\s]+)\sbuild/i],[VENDOR,MODEL,[TYPE,MOBILE]],[/crkey/i],[[MODEL,"Chromecast"],[VENDOR,"Google"],[TYPE,SMARTTV]],[/android.+;\s(glass)\s\d/i],[MODEL,[VENDOR,"Google"],[TYPE,WEARABLE]],[/android.+;\s(pixel c)[\s)]/i],[MODEL,[VENDOR,"Google"],[TYPE,TABLET]],[/android.+;\s(pixel( [23])?( xl)?)[\s)]/i],[MODEL,[VENDOR,"Google"],[TYPE,MOBILE]],[/android.+;\s(\w+)\s+build\/hm\1/i,/android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i,/android.+(mi[\s\-_]*(?:a\d|one|one[\s_]plus|note lte)?[\s_]*(?:\d?\w?)[\s_]*(?:plus)?)\s+build/i,/android.+(redmi[\s\-_]*(?:note)?(?:[\s_]*[\w\s]+))\s+build/i],[[MODEL,/_/g," "],[VENDOR,"Xiaomi"],[TYPE,MOBILE]],[/android.+(mi[\s\-_]*(?:pad)(?:[\s_]*[\w\s]+))\s+build/i],[[MODEL,/_/g," "],[VENDOR,"Xiaomi"],[TYPE,TABLET]],[/android.+;\s(m[1-5]\snote)\sbuild/i],[MODEL,[VENDOR,"Meizu"],[TYPE,MOBILE]],[/(mz)-([\w-]{2,})/i],[[VENDOR,"Meizu"],MODEL,[TYPE,MOBILE]],[/android.+a000(1)\s+build/i,/android.+oneplus\s(a\d{4})[\s)]/i],[MODEL,[VENDOR,"OnePlus"],[TYPE,MOBILE]],[/android.+[;\/]\s*(RCT[\d\w]+)\s+build/i],[MODEL,[VENDOR,"RCA"],[TYPE,TABLET]],[/android.+[;\/\s]+(Venue[\d\s]{2,7})\s+build/i],[MODEL,[VENDOR,"Dell"],[TYPE,TABLET]],[/android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i],[MODEL,[VENDOR,"Verizon"],[TYPE,TABLET]],[/android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(V?.*)\s+build/i],[[VENDOR,"Barnes & Noble"],MODEL,[TYPE,TABLET]],[/android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i],[MODEL,[VENDOR,"NuVision"],[TYPE,TABLET]],[/android.+;\s(k88)\sbuild/i],[MODEL,[VENDOR,"ZTE"],[TYPE,TABLET]],[/android.+[;\/]\s*(gen\d{3})\s+build.*49h/i],[MODEL,[VENDOR,"Swiss"],[TYPE,MOBILE]],[/android.+[;\/]\s*(zur\d{3})\s+build/i],[MODEL,[VENDOR,"Swiss"],[TYPE,TABLET]],[/android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i],[MODEL,[VENDOR,"Zeki"],[TYPE,TABLET]],[/(android).+[;\/]\s+([YR]\d{2})\s+build/i,/android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(\w{5})\sbuild/i],[[VENDOR,"Dragon Touch"],MODEL,[TYPE,TABLET]],[/android.+[;\/]\s*(NS-?\w{0,9})\sbuild/i],[MODEL,[VENDOR,"Insignia"],[TYPE,TABLET]],[/android.+[;\/]\s*((NX|Next)-?\w{0,9})\s+build/i],[MODEL,[VENDOR,"NextBook"],[TYPE,TABLET]],[/android.+[;\/]\s*(Xtreme\_)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i],[[VENDOR,"Voice"],MODEL,[TYPE,MOBILE]],[/android.+[;\/]\s*(LVTEL\-)?(V1[12])\s+build/i],[[VENDOR,"LvTel"],MODEL,[TYPE,MOBILE]],[/android.+;\s(PH-1)\s/i],[MODEL,[VENDOR,"Essential"],[TYPE,MOBILE]],[/android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i],[MODEL,[VENDOR,"Envizen"],[TYPE,TABLET]],[/android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(\w{1,9})\s+build/i],[VENDOR,MODEL,[TYPE,TABLET]],[/android.+[;\/]\s*(Trio[\s\-]*.*)\s+build/i],[MODEL,[VENDOR,"MachSpeed"],[TYPE,TABLET]],[/android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i],[VENDOR,MODEL,[TYPE,TABLET]],[/android.+[;\/]\s*TU_(1491)\s+build/i],[MODEL,[VENDOR,"Rotor"],[TYPE,TABLET]],[/android.+(KS(.+))\s+build/i],[MODEL,[VENDOR,"Amazon"],[TYPE,TABLET]],[/android.+(Gigaset)[\s\-]+(Q\w{1,9})\s+build/i],[VENDOR,MODEL,[TYPE,TABLET]],[/\s(tablet|tab)[;\/]/i,/\s(mobile)(?:[;\/]|\ssafari)/i],[[TYPE,util.lowerize],VENDOR,MODEL],[/[\s\/\(](smart-?tv)[;\)]/i],[[TYPE,SMARTTV]],[/(android[\w\.\s\-]{0,9});.+build/i],[MODEL,[VENDOR,"Generic"]]],engine:[[/windows.+\sedge\/([\w\.]+)/i],[VERSION,[NAME,"EdgeHTML"]],[/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],[VERSION,[NAME,"Blink"]],[/(presto)\/([\w\.]+)/i,/(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,/(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,/(icab)[\/\s]([23]\.[\d\.]+)/i],[NAME,VERSION],[/rv\:([\w\.]{1,9}).+(gecko)/i],[VERSION,NAME]],os:[[/microsoft\s(windows)\s(vista|xp)/i],[NAME,VERSION],[/(windows)\snt\s6\.2;\s(arm)/i,/(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s\w]*)/i,/(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i],[NAME,[VERSION,mapper.str,maps.os.windows.version]],[/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],[[NAME,"Windows"],[VERSION,mapper.str,maps.os.windows.version]],[/\((bb)(10);/i],[[NAME,"BlackBerry"],VERSION],[/(blackberry)\w*\/?([\w\.]*)/i,/(tizen|kaios)[\/\s]([\w\.]+)/i,/(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|sailfish|contiki)[\/\s-]?([\w\.]*)/i],[NAME,VERSION],[/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]*)/i],[[NAME,"Symbian"],VERSION],[/\((series40);/i],[NAME],[/mozilla.+\(mobile;.+gecko.+firefox/i],[[NAME,"Firefox OS"],VERSION],[/(nintendo|playstation)\s([wids34portablevu]+)/i,/(mint)[\/\s\(]?(\w*)/i,/(mageia|vectorlinux)[;\s]/i,/(joli|[kxln]?ubuntu|debian|suse|opensuse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]*)/i,/(hurd|linux)\s?([\w\.]*)/i,/(gnu)\s?([\w\.]*)/i],[NAME,VERSION],[/(cros)\s[\w]+\s([\w\.]+\w)/i],[[NAME,"Chromium OS"],VERSION],[/(sunos)\s?([\w\.\d]*)/i],[[NAME,"Solaris"],VERSION],[/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]*)/i],[NAME,VERSION],[/(haiku)\s(\w+)/i],[NAME,VERSION],[/cfnetwork\/.+darwin/i,/ip[honead]{2,4}(?:.*os\s([\w]+)\slike\smac|;\sopera)/i],[[VERSION,/_/g,"."],[NAME,"iOS"]],[/(mac\sos\sx)\s?([\w\s\.]*)/i,/(macintosh|mac(?=_powerpc)\s)/i],[[NAME,"Mac OS"],[VERSION,/_/g,"."]],[/((?:open)?solaris)[\/\s-]?([\w\.]*)/i,/(aix)\s((\d)(?=\.|\)|\s)[\w\.])*/i,/(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms|fuchsia)/i,/(unix)\s?([\w\.]*)/i],[NAME,VERSION]]};var UAParser=function(uastring,extensions){if(typeof uastring==="object"){extensions=uastring;uastring=undefined}if(!(this instanceof UAParser)){return new UAParser(uastring,extensions).getResult()}var ua=uastring||(window&&window.navigator&&window.navigator.userAgent?window.navigator.userAgent:EMPTY);var rgxmap=extensions?util.extend(regexes,extensions):regexes;this.getBrowser=function(){var browser={name:undefined,version:undefined};mapper.rgx.call(browser,ua,rgxmap.browser);browser.major=util.major(browser.version);return browser};this.getCPU=function(){var cpu={architecture:undefined};mapper.rgx.call(cpu,ua,rgxmap.cpu);return cpu};this.getDevice=function(){var device={vendor:undefined,model:undefined,type:undefined};mapper.rgx.call(device,ua,rgxmap.device);return device};this.getEngine=function(){var engine={name:undefined,version:undefined};mapper.rgx.call(engine,ua,rgxmap.engine);return engine};this.getOS=function(){var os={name:undefined,version:undefined};mapper.rgx.call(os,ua,rgxmap.os);return os};this.getResult=function(){return{ua:this.getUA(),browser:this.getBrowser(),engine:this.getEngine(),os:this.getOS(),device:this.getDevice(),cpu:this.getCPU()}};this.getUA=function(){return ua};this.setUA=function(uastring){ua=uastring;return this};return this};UAParser.VERSION=LIBVERSION;UAParser.BROWSER={NAME:NAME,MAJOR:MAJOR,VERSION:VERSION};UAParser.CPU={ARCHITECTURE:ARCHITECTURE};UAParser.DEVICE={MODEL:MODEL,VENDOR:VENDOR,TYPE:TYPE,CONSOLE:CONSOLE,MOBILE:MOBILE,SMARTTV:SMARTTV,TABLET:TABLET,WEARABLE:WEARABLE,EMBEDDED:EMBEDDED};UAParser.ENGINE={NAME:NAME,VERSION:VERSION};UAParser.OS={NAME:NAME,VERSION:VERSION};if(typeof exports!==UNDEF_TYPE){if(typeof module!==UNDEF_TYPE&&module.exports){exports=module.exports=UAParser}exports.UAParser=UAParser}else{if(typeof define==="function"&&define.amd){define(function(){return UAParser})}else if(window){window.UAParser=UAParser}}var $=window&&(window.jQuery||window.Zepto);if($&&!$.ua){var parser=new UAParser;$.ua=parser.getResult();$.ua.get=function(){return parser.getUA()};$.ua.set=function(uastring){parser.setUA(uastring);var result=parser.getResult();for(var prop in result){$.ua[prop]=result[prop]}}}})(typeof window==="object"?window:this);