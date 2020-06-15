jQuery(document).ready(function($) {
	//var escenaLabel = $('.escenalabel');
	var playtextRow = $('.playtext-row');
	var instanceFull;
	var instanceMini;
	var visibleIds = [];

	$('.texto-mini, .texto-full').addClass('transparent');

	var customScroll = $('.texto-mini, .texto-full').overlayScrollbars({
		autoUpdate: true,
		callbacks: {
			onInitialized: function() {
				$('.texto-mini, .texto-full').removeClass('transparent');
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
	}

	instanceFull.options({
		className: 'os-theme-none',
		callbacks: {
			onScrollStart: function() {
				$('#texto-mini .textunit').removeClass('onfield');
			},
			onScrollStop: function() {
				scrollOtherInstance(this, instanceMini);
				for(var i = 0; i < visibleIds.length; i++) {
					$('#texto-mini .textunit[data-id="' + visibleIds[i] + '"]').addClass('onfield');	
				}
			}
		}
	});


	instanceMini.options({
		className: 'os-theme-prompt',
		callbacks: {
			onScroll: function() {
				scrollOtherInstance(this, instanceFull);
			}
		}
	});

	inView('#texto-full .scene-row.scene-marker').on('enter', function(el) {
		var activeScene = $(el).attr('id');
		$('#selectScene').val('#' + activeScene);
	});

	

	inView('.playtext-row').on('enter', function(el) {	
		visibleIds.push($(el).attr('data-id'));
	});

	inView('.playtext-row').on('exit', function(el) {
		var index = visibleIds.indexOf($(el).attr('data-id'));
		if(index > -1) {
			visibleIds.splice(index, 1);
		}
	});

	
	//console.log(instanceFull);



	// $(function(){
	// 	$('#texto-full').scroll(function(){    	
	// 		console.log('scrolltest');
	// 		var scrollTop = $(document).scrollTop() + ($(window).height() / 2);
	// 		var positions = [];
	// 		playtextRow.removeClass('selected');

	// 		playtextRow.each(function(){
	//         	  //console.log($(this).position().top);
	//         	  //$(this).removeClass("active");
	//         	  positions.push({position:$(this).position().top, element: $(this)});
	//         	});

	// 		var getClosest = closest(positions,scrollTop);
	// 		getClosest.addClass('selected');
	// 		var dataEscena = getClosest.attr('data-escena');
	// 		var dataEscenaSlug = getClosest.attr('data-escenaslug');
	// 		var dataPersonaje = getClosest.attr('data-personajes');
	// 		var dataParlamento = getClosest.attr('data-parlamento');

	// 		if(dataEscena.length) {
	// 				//escenaLabel.empty().append(dataEscena);
	// 				$('#selectScene').val('#' + dataEscenaSlug);	

	// 			}

	// 			if(dataParlamento.length) {
	// 				$('.personajes .personaje').removeClass('active');
	// 				$('.personajes .personaje[data-personaje="' + dataParlamento + '"]').addClass('active');

	// 			}

	// 			//console.log(getClosest.attr('data-escena'));
	// 			//getClosest.addClass("active");
	// 		});

	// 	function closest(array, number) {
	// 		var num = 0;
	// 		for (var i = array.length - 1; i >= 0; i--) {
	// 			if(Math.abs(number - array[i].position) < Math.abs(number - array[num].position)){
	// 				num = i;
	// 			}
	// 		}
	// 		return array[num].element;
	// 	}

	// });

	$('body').on('change','#selectScene', function(e) {
		var selected = $('option:selected', this).attr('value');
		//var element = document.querySelector(selected);
		//var top = element.offsetTop;

		instanceFull.scroll($(selected));
		
		//$('.texto-full').addClass('smooth');

		$('.escena-nav').removeClass('active');
	});



	$('.playtext-row, .textunit').on('hover', function() {
		var curId = $(this).attr('data-id');
		var dataParlamento = $(this).attr('data-parlamento');

		$('.personajes .personaje').removeClass('active');
		$('.personajes .personaje[data-personaje="' + dataParlamento + '"]').addClass('active');

		$('.playtext-row, .textunit').removeClass('selected');
		$('.textunit[data-id="' + curId + '"]').addClass('selected');

	});

	// $('.textunit').on('click', function() {
	// 	var curId = $(this).attr('data-id');
	// 	var selected = $('.playtext-row[data-id="' + curId + '"]');
	// 	var top = selected.offsetTop;
	// 	console.log(top);
	// 	document.getElementById('texto-full').scrollTop = top - 60;
	// });

	//var parlamentos = setPersonajes('data-parlamento');
	//personajes = setPersonajes('data-personajes');



	

		//console.log(personajes);

		// for(var i = 0; i < customScroll.length; i++) {
		// 	console.log(customScroll[i].getElements());
		// }

		// for(var i = 0; i < personajes.length; i++) {
		// 	$('.textPersonajes .col-md-12').append('<span class="typelabel personajelabel" data-filterpersonaje="' + personajes[i] + '">' + personajes[i] + '</span>');
		// }

		// for(var i = 0; i < parlamentos.length; i++) {
		// 	$('.textParlamentos .col-md-12').append('<span class="typelabel parlamentolabel" data-filterparlamento="' + parlamentos[i] + '">' + parlamentos[i] + '</span>')
		// }



		// $('body').on('click', '.typelabel.personajelabel', function(e) {

		// 	$('.playtext-row:hidden').show();

		// 	if($(this).hasClass('active')) {
		// 		$(this).removeClass('active');
		// 	} else {
		// 		var curpersonaje = $(this).attr('data-filterpersonaje');
		// 		$('body .typelabel.personajelabel').removeClass('active');
		// 		$(this).addClass('active');
		// 		$('.playtext-row').not('[data-personajes~="' + curpersonaje + '"]').hide();
		// 	}
		// });	
	});

