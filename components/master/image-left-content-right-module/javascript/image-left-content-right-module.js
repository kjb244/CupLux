var main = function(){
	var settings = {};
	settings.$target = $("[data-module-image-left-content-right-module]");

	voidMain = function(){
		settings.$target.find('#pdf-menu-link').on('click', function(){
			var pdfString = settings.$target.find('.pdf-string').text();
			window.open("data:application/pdf;base64," + encodeURI(pdfString));
		});
	}

	return voidMain();



}();