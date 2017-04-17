var main = function(){


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


}();