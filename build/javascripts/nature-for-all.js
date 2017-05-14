$(document).ready(function(){  var main = function(){

	$(document).foundation();
	var settings = {};
	settings.$target = $("[data-module-engagement-module]");

	var voidMain = function(){


		//activate current nav
		var path = window.location.pathname.replace('/','');
		var pathArr = path.split('-');

		for(var i=0; i<pathArr.length; i++){
			var $curr = settings.$target.find('a[id*="' + pathArr[i] + '"]');
			if ($curr.length){
				$curr.parent().addClass('current');
				break;
			}
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

	}

	return voidMain();



}();})