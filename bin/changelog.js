#!/usr/bin/env nodejs
var argv = require('yargs').argv;
var log = require('../lib/log'),
	_ = require('lodash');

log('/home/amansandhu/Documents/Cmpt-225/Assignment-2', 'HEAD', function(err, commits){
	if(err){
		console.log('Error');
		return;
	}

	var some = _.filter(commits, function(commit) {
		return _.contains(commit.tree, 'ff2dfdc60b61fb886496427d82145181a52f3215');
	});
	console.log(commits);
	console.log(some);
});