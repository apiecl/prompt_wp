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

	function loadMediaInModal(mediaid, modal, ispage, type) {
		
		var nextMedia = jQuery('.activeMedia').next('.media-item-wrapper.filtered');
		var prevMedia = jQuery('.activeMedia').prev('.media-item-wrapper.filtered');
		var modalBody = jQuery( '#' + modal + ' .modal-body');

		modalBody.append('<div class="loadingZone"><i class="fas fa-spin fa-slash fa-2x"></i> Cargando</div>');

		jQuery.ajax({
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

	function loadMediaInContainer(mediaid, container, type, ispage) {
		
		var nextMedia = jQuery('.activeMedia').next('.media-item-wrapper');
		var prevMedia = jQuery('.activeMedia').prev('.media-item-wrapper');
		var container = jQuery( '#' + container);

		container.empty().append('<div class="loadingZone"><i class="fas fa-spin fa-slash fa-2x"></i> Cargando</div>');

		jQuery.ajax({
			type: "post",
			url: prompt.ajaxurl,
			dataType: 'json',
			data: {
				action: "bit_ajax_get_media_in_text",
				mediaid: mediaid,
				type: type,
				ispage: ispage
			},
			error: function( response ) {
				console.log(response);
			},
			success: function( data ) {
				console.log(data);
				renderMediaResponse(data, container);
			}
		});

		return [nextMedia, prevMedia];
	}

	function renderMediaResponse(data, container) {
		var html = '';

		html += '<div class="row">';
		html += '<div class="col-md-8 media-container-left">';

		if(data.type == 'image') {
			html += '<img src="' + data.mediaurl + '" alt="' + data.title + '" />';
		}
		else if(data.type == 'video') {
			html += '<div class="wp-video"><video class="wp-video-shortcode" src="' + data.mediaurl + '"></video></div>';
		}
		else if(data.type == 'pdf') {
			html += '<a class="documento-download" href="' + data.mediaurl + '"><i class="fas fa-download"></i> Descargar documento (.pdf)</a>';
		}
		else if(data.type == 'audio') {
			html += '<audio src="' + data.mediaurl +'"></audio>';
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
				console.log(tax);
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