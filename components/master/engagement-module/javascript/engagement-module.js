var main = function(){

	$(document).foundation();

	var settings = {};
	settings.$target = $("[data-module-engagement-module]");

	var voidMain = function(){

		settings.$target.find('.menu-icon > a').on('click', function(){
			if (Foundation.utils.is_small_only()){
				setTimeout(function(){
					$(window).scroll();
				},100);
			}
		});

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


}();