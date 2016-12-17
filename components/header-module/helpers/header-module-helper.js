'use strict';

var exports = module.exports = {};

var functions = {
	testing: function(){
		return "Kevin";
	},
	testing2: function(){
		return "Kevin2";
	}
}

for(let key in functions){
	exports[key] = functions[key];
}

