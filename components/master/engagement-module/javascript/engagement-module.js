var main = function(){

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


}();