$(document).ready(function(){  var main = function(){

	$(document).foundation();
	var settings = {};
	settings.$target = $("[data-module-engagement-module]");

	var voidMain = function(){

		var browser =  navigator.userAgent.toLowerCase();
		if (browser.indexOf('chrome') > -1 && navigaotr.appVersion.indexOf('Mac') == -1){
			settings.$target.find('li').addClass('flexBottomBorderSpecific');
		}


	}

	return voidMain();


}(); var main = function(){



}(); var main = function(){
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

		var $grandOpening = $("[data-module-one-column-content-module].data-module-main-grand-opening-one-column-content");
		console.log($grandOpening);
		setTimeout(function(){
			$grandOpening.slideDown("slow");

		},2000);

		var $exclusionsRestrictionsLink = settings.$target.find('#exclusions-restrictions-link');
		$exclusionsRestrictionsLink.on('click', function(){
			$(this).closest('.row').find('.row').first().slideToggle();
		})

	}

	return voidMain();



}();})