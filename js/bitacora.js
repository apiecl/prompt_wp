jQuery(document).ready(function($) {
	console.log('init bitacora js');

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
});

function disableMedia( target ) {
	console.log(target);
}

function enableMedia( media, target ) {
	var carouselID = '#mediacarousel-' + target;
	console.log(carouselID);
	$.ajax({
		type: "post",
		url: prompt.ajaxurl,
		data: {
			action: "bit_render_mediazone",
			params: media,
			id: target
		},
		error: function( response ) {
			console.log(response);
		},
		success:function(response) {
			console.log(response);
			$('#' + target).append(response);
			var slider = tns({
				container: carouselID,
				items: 1,
				nav: false,
				controlsText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>' ],
				center: true
			});
		}
	});
}