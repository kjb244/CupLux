$(document).ready(function(){  var main = function(){

	$(document).foundation();


}(); var main = function(){




}(); var main = function(){
	var settings = {};
	settings.$target = $("[data-module-one-column-content-module");


	voidMain = function(){
		var $faqLink = settings.$target.find('#faq-link');
		$faqLink.on('click touchstart', function(){
			$(this).toggleClass('shown').next('img').toggleClass('rotateUp');
			var $faqHidden = $(".data-module-rewards-faq");
			$faqHidden.slideToggle(500, function(){
				if ($faqLink.hasClass('shown')){
					var pixelsDown = $faqHidden.find('.row').first().offset().top;
					var offset = Foundation.utils.is_small_only() == true ? 50: 0;
					$('html, body').animate({scrollTop: pixelsDown - offset}, 1000);

				}
				
			});



		})

	}

	return voidMain();



}(); var main = function(){



}();})