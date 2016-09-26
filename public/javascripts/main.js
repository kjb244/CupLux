
$(document).ready(function(){
	$(document).foundation();

	var $target = $('.mainModule');

	function fadeOutAll(clazz){
		//if class is already show then don't do anything
		if ( $target.find(clazz).hasClass('show') || clazz == undefined){
			return;
		}

		$target.find('.main .show').fadeOut(200, function(){
			$target.find(clazz).fadeIn(1000).addClass('show');
	
				$(this).removeClass('show').addClass('hide');
		
		});
	}

	$target.find('.show-for-medium-up a').on('click', function(){ 
		
		var destClass = $(this).attr('data-destination');

		if (destClass){
			destClass  = '.' + destClass;

			fadeOutAll(destClass);

		}
		
		
	 });




	


});
