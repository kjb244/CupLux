$(document).ready(function(){  var main = function(){

	$(document).foundation();

	var settings = {};
	settings.$target = $("[data-module-engagement-module]");

	var voidMain = function(){

		settings.$target.find('.menu-icon > a').on('click', function(){
			if (Foundation.utils.is_small_only()){
				setTimeout(function(){
					console.log('trigger scroll');
					$(window).scroll();
				},100);
			}
		});

	}

	return voidMain();


}(); var main = function(){




}(); var main = function(){
	var settings = {};
	settings.$target = $("[data-module-one-column-content-module].data-module-rewards-faq-link");


	voidMain = function(){
		var $faqLink = settings.$target.find('#faq-link');
		$faqLink.on('click', function(){
			$(this).toggleClass('shown').next('img').toggleClass('rotateUp');
			var $faqHidden = $(".data-module-rewards-faq");
			$faqHidden.slideToggle(1000);
				if ($faqLink.hasClass('shown')){
					var pixelsDown = $faqHidden.find('.row').first().offset().top;
					var offset = Foundation.utils.is_small_only() == true ? 50: 75;
					$('html, body').animate({scrollTop: pixelsDown - offset}, 1000);

				}

		});

	}

	return voidMain();



}(); var main = function(){



}();})