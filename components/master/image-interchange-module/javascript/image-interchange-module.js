var main = function(){
	var settings = {};
	settings.$target = $('[data-module-image-interchange-module]')

	getScreenSize = function(){
		return (Foundation.utils.is_small_only() == true ? 'small': (Foundation.utils.is_medium_only() == true ? 'medium': 'large'));
	}

	hideShowImages = function(){

		var screenSize = getScreenSize();
		//hide and move image source so it doesn't download
		$('.orbit-container').hide();

		$('.orbit-container ul').each(function(idx, val){
			
			var clazz = $(val).attr('class').toLowerCase();
			
			if (clazz.indexOf(screenSize) > -1){
				
				$(val).parent().show();
				$(val).find('img').each(function(){
					$(this).attr('src', $(this).attr('data-src'));
				});
				
			}


		});

	}


	voidMain = function(){
		hideShowImages();

		$(window).on('resize', function(){
			hideShowImages();
		});






		$('.orbit-container').click();
			

	}

	return voidMain();
	

}();