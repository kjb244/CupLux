'use strict';

var exports = module.exports = {};

var functions = {
	times: function (n, block) {

 		var accum = '';
    	for(var i = 0; i < n; ++i){
    		accum += block.fn(i);

    	}

    	return accum;
        
    
	    }
	}


for(let key in functions){
	exports[key] = functions[key];
}