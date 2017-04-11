var main = function(){
	var settings = {};
	settings.$target = $('[data-module-image-interchange-module]')

	getScreenSize = function(){
		return (Foundation.utils.is_small_only() == true ? 'small': (Foundation.utils.is_medium_only() == true ? 'medium': 'large'));
	}

	storeImageSources = function(){
		settings.$target.find('img').each(function(idx2, val2){
				var imgSrc = $(val2).attr('src');
				$(val2).attr('data-img-src', imgSrc);
			});
	}
	voidMain = function(){
		storeImageSources();

		var screenSize = getScreenSize();
		//hide and move image source so it doesn't download
		$('.orbit-container ul').each(function(idx, val){
			
			var clazz = $(val).attr('class').toLowerCase();
			
			if (clazz.indexOf(screenSize) == -1){
				
				$(val).parent().hide();
				$(val).find('img').attr('src', '');
			}



		});



		$('.orbit-container').click();
			

	}

	return voidMain();
	

}();