$(document).ready(function(){  var main = function(){

	$(document).foundation();
	var settings = {};
	settings.$target = $("[data-module-engagement-module]");

	var voidMain = function(){

		var browser =  navigator.userAgent.toLowerCase();
		if (browser.indexOf('chrom') > -1){
			settings.$target.find('li').addClass('flexBottomBorderSpecific');
		}


	}

	return voidMain();


}(); var main = function(){



}();})