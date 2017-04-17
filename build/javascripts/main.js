$(document).ready(function(){  var main = function(){


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
	var settings = {};
	settings.$target = $('[data-module-image-interchange-module]')

	getScreenSize = function(){
		return (Foundation.utils.is_small_only() == true ? 'small': (Foundation.utils.is_medium_only() == true ? 'medium': 'large'));
	}

	getOrientation = function(){
		if (window.matchMedia("(orientation: portrait)").matches) {
   			return "portrait"
		}
		return "landscape";

	}

	hideShowImages = function(){

		var screenSize = getScreenSize();
		//hide and move image source so it doesn't download
		$('.orbit-container').hide();

		$('.orbit-container ul').each(function(idx, val){
			
			var clazz = $(val).attr('class').toLowerCase();
			var bool = false;
			
			if (clazz.indexOf(screenSize) > -1){
				if (screenSize == "small" || screenSize == "medium"){
					var orientation = getOrientation();
					if (orientation == "portrait" && clazz.indexOf('vert') > -1){
						$(val).parent().show();
						bool = true;
					}
					else if (orientation == "landscape" && clazz.indexOf('horiz') > -1){
						$(val).parent().show();
						bool = true;
					}
				}
				else{
					$(val).parent().show();
					bool = true;
				}
				

			}

			if (bool){
				$(val).find('img').each(function(){
					if ($(this).attr('src').length < 1 ){
						$(this).attr('src', $(this).attr('data-src'));
					}
					
				});
				return false;
				
			}


		});

		setTimeout(function(){
			$(document).scroll();
		},200);

	}


	voidMain = function(){
		hideShowImages();

		$(window).on('resize', function(){
			hideShowImages();
		});

		$(window).on('orientationchange', function(){
			hideShowImages();
		})

		$(document).foundation();



		$('.orbit-container').click();

			

	}

	return voidMain();
	

}(); var main = function(){



}();})