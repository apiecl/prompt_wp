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

