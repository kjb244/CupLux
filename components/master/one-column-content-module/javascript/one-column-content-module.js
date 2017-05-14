var main = function(){
	var settings = {};
	settings.$target = $("[data-module-one-column-content-module]");


	voidMain = function(){
		var $faqLink = settings.$target.find('#faq-link, #read-more-link');
		$faqLink.on('click', function(){
			$(this).toggleClass('shown').next('img').toggleClass('rotateUp');
			var $faqHidden = $(".data-module-rewards-faq, .data-module-nature-for-one-bottom");
			$faqHidden.slideToggle(1000);
				if ($faqLink.hasClass('shown')){
					var pixelsDown = $faqHidden.find('.row').first().offset().top;
					var offset = Foundation.utils.is_small_only() == true ? 50: 75;
					$('html, body').animate({scrollTop: pixelsDown - offset}, 1000);

				}

		});

	}

	return voidMain();



}();