jQuery(document).ready(function($) {
	//var escenaLabel = $('.escenalabel');
	var playtextRow = $('.playtext-row');
	var instanceFull;
	var instanceMini;
	var visibleIds = [];
	var prevScroll = 0;
	var activeId;
	var activeMaterials;
	var activeText;
	var activeParlamento;

	//inView.offset({top: 200});

	$('.texto-mini, .texto-full').addClass('transparent');
	$('#texto-full .playtext-row:first').addClass('active');


	var customScroll = $('.texto-mini, .texto-full').overlayScrollbars({
		autoUpdate: true,
		callbacks: {
			onInitialized: function() {
				$('.texto-mini, .texto-full').removeClass('transparent');
				wrapper = document.querySelector('.os-viewport'), 
				wrapperBox = wrapper.getBoundingClientRect();

				if($(this.getElements().target).attr('id') == 'texto-full') {
					instanceFull = this;
				} else {
					instanceMini = this;
				}
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
		if(materialesIds.length) {
			activeMaterials = materialesIds;	
			matZone.empty().show().append('<p>Materiales disponibles</p>');
		} else {
			matZone.empty().hide();
		}
		
	}

	instanceFull.options({
		className: 'os-theme-none',
		callbacks: {
			onScrollStart: function() {
				$('#texto-mini .textunit').removeClass('onfield');
				//$('.playtext-row').removeClass('active');
			},
			onScroll: function() {
				//instanceMini.sleep();
				//instanceMini.update();
			},
			onScrollStop: function() {
				scrollOtherInstance(this, instanceMini);
				//instanceMini.update();
				//var top = $('#texto-full .playtext-row[data-id="' + visibleIds.splice(-1)[0] + '"]');

				//top.addClass('active');
				//console.log(visibleIds[0]);

				var curScroll = this.scroll().position.y;
				
				//console.log(curScroll);
				//var topset = false;
				var offsets = [];

				if(curScroll > prevScroll) {
						scrollDirection = 'down';
						//$('.playtext-row.active').removeClass('active').next().addClass('active');
					} else {
						scrollDirection = 'up';
						//visibleIds.reverse();
						//$('.playtext-row.active').removeClass('active').prev().addClass('active');
					}

				// for(var i = 0; i < visibleIds.length; i++) {
				// 	$('#texto-mini .textunit[data-id="' + visibleIds[i] + '"]').addClass('onfield');	
				// 	var offset = $('.playtext-row[data-id="' + visibleIds[i] + '"]').offset();
				// 	//console.log(offset);
				// 	var curScroll = this.scroll().position.y;
				
				// 	prevScroll = curScroll;
					
					
					
				// 	//console.log(offset.top);
				// 	//$('.playtext-row[data-id="' + visibleIds[i] + '"] div.parlamento').empty().append(offset.top);

					
				// 	offsets.push(offset.top);

				// 	//instanceMini.update();
				// }

				// $('.playtext-row').each(function() {
				// 	var curOffset = $(this).offset();
				// 	console.log(curOffset.top, curScroll);
				// });

				var min = Math.min.apply(Math, offsets);
				let minFunc = (element) => element >= 316 && element < 500;
				console.log(offsets);
				var activeKey = offsets.findIndex(minFunc);
				console.log(activeKey);

				var current = $('.playtext-row[data-id="' + visibleIds[activeKey] + '"]');
				current.addClass('active');
				//topset = true;
				activeId = visibleIds[activeKey];
				//console.log(activeId);
				//$('.materiales-left').empty().append();

				//updateMaterialZone(current.attr('data-ids_asoc'));				
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
		selected.addClass('selected');
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
		instanceFull.scroll({ 
							el: $(this),
							margin: [10, 0, 0, 0]
							},
							250, 
							'linear'
							);
		$('.playtext-row.active').removeClass('active');
		$(this).addClass('active');
		updateMaterialZone($(this).attr('data-ids_asoc'));
		activeText = $('.text-item', this).text();
		activeParlamento = $(this).attr('data-parlamento');
	});

	$('.trigger-media').on('click', function(event) {
		event.preventDefault();
		var el = $(this);
		var target = el.attr('data-expand');
		var targetel = $(target);
		if(targetel.hasClass('active')) {
			//targetel.slideUp();
			$(this).removeClass('active');
			targetel.removeClass('active').empty();
			disableMedia(targetel);
		} else {
			$('.media-zone.active').removeClass('active');
			$('.trigger-media').removeClass('active');
			//targetel.slideDown();
			targetel.addClass('active');
			$(this).addClass('active');
			enableMedia($(this).attr('data-assoc'), $(this).attr('data-plain-id'));
		}
	});

	$('.materiales-left').on('click', function(event) {
		event.preventDefault();
		console.log('materiales-left');
	});

	$('.modal-media-list-text').on('shown.bs.modal', function(e) {
		console.log(activeMaterials);
		$('#content-current-material').empty();
		$('.curText').empty().append('<span class="acot">' + activeParlamento + ':</span> ' + activeText);
		enableMedia(activeMaterials, 'modal-media-text-lista-materiales');

		// var modal = $(this).attr('id');
		// var ispage = $(this).attr('data-ispage');

		// var navMedia = loadMediaInModal(mediaid, modal, ispage, type);
		// nextMedia = navMedia[0];
		// prevMedia = navMedia[1];

	});

	});