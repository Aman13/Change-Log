'use strict';

var _ = require('lodash');

function message(tree, locationUrl) {
	var sub = _.chain(tree.children).map(function mapChildren(child) {
		return '<li>' + message(child, locationUrl) + '</li>';
	}).join('').value();
	if (!tree.commit) {
		return '<ul>' + sub + '</ul>';
	}
	var treeMessage = tree.commit.msg.split('\n');
	var expr = /^Merge pull request #(\d+) from ([^\s]+)/;
	expr = expr.exec(treeMessage[0]);
	if (expr !== null) {
		var pullUrl = locationUrl + expr[1];
		return _.template('${author} <br/>',tree.commit) + '<a href="' + pullUrl + '">Details</a>' + '<br/> <b>Commit message:</b> <br/> <br/> ' + treeMessage[2] + ' <br/> <br/>' + '<ul>' + sub + '</ul>';
	} else {
		return _.template('<b> ${author} Made some mistakes <br/> <br/> </b>', tree.commit) + '<ul>' + sub + '</ul>';
	}
}

module.exports = message;
