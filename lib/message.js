var _ = require('lodash');


function message(tree, depth, locationUrl) {
	var sub = _.chain(tree.children).map(function(child) {
		return '<li>' + message(child, depth+1, locationUrl) + '</li>';
	}).join('').value();
	if(!tree.commit) return '<ul>' + sub + '</ul>';
	tree.commit.msg = tree.commit.msg.split('\n');
	var expr = /^Merge pull request #(\d+) from ([^\s]+)/;
	expr = expr.exec(tree.commit.msg[0]);
//	console.log(expr);
	var pullUrl = locationUrl + expr[1];
//	return tree.commit.commit + '<br/>' + tree.commit.author + '<ul>' + sub + '</ul>';
//	return _.template ('${author} <br/> ${msg}', tree.commit) + '<ul>' + sub + '</ul>';
	return _.template ('<body style="background-color:lightgrey"> ${author} <br/> version: ${tags} <br/>',tree.commit) + '<a href="'+pullUrl+'">Details</a>' + 
	_.template ('<br/> <b>Commit message:</b> <br/> <br/> ${msg[2]} <br/> <br/>', tree.commit) + '<ul>' + sub + '</ul>';
}

module.exports=message;