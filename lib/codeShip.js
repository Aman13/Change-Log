#!/usr/bin/env node

var request = require('request'),
	_ = require('lodash');

function codeShip(branch, callback) {
	request.get({
		url: 'https://www.codeship.io/api/v1/projects/38345.json?api_key=KEY',
		json: true
	}, function(err, response, project) {
		if (err) {
		return callback(err);
		}
	//	console.log(project);
		var latestMaster = _.first(project.builds, { branch: branch });
		console.log(latestMaster);
		callback(null, latestMaster);
	});

};