var exports = module.exports = {};

exports.jsonHelper = function(inp){

	//do links
	var links = {};
	var key;
	var key2;
	//create link id and content
	for(key in inp.LINKS){

		var aTag = '<a';
		var node = inp.LINKS[key];

		for(var key2 in node){
			if (! /content/.test(key2)){
				aTag += " " + key2 + "='" + node[key2] + "'";
			}
		}
		
		aTag += '>';
		aTag += node.content || '';
		aTag += '</a>'
		
		links[key] = aTag;
	}

	//convert entire json to string and start replacing
	inp = JSON.stringify(inp);

	//loop through links object and replace
	for(key in links){
		inp = inp.replace('"{LINK||' + key + '}"', '"' + links[key] + '"');
	}

	//put back into js object
	inp = JSON.parse(inp);
	//return object
	return inp;



}