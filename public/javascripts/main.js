
$(document).ready(function(){
	$(document).foundation();

	var main = function(){

		var $target = $('.mainModule');

		fadeOutAll = function(clazz){
			//if class is already show then don't do anything
			if ( $target.find(clazz).hasClass('show') || clazz == undefined){
				return;
			}

			//scroll to top first
			var duration = $(window).scrollTop() == 0 ? 0: 300;
			$("html, body").animate(
				{ scrollTop: 0 }, { duration: duration, complete: function(){
									//fade out current module
									$target.find('.main .show').fadeOut(200, function(){
										//fade in new one
										$target.find(clazz).fadeIn(1000).addClass('show');
			
										$(this).removeClass('show').addClass('hide');
				
									});
				   				}
				});


		},

		linkFind = function(){

			$target.find('.show-for-medium-up a').on('click', function(){ 
		
				var destClass = $(this).attr('data-destination');

				if (destClass){
					destClass  = '.' + destClass;

					fadeOutAll(destClass);

				}

			});
		}

		return {
			init: linkFind()
		}

	}();


 });



