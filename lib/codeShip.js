'use strict';

var request = require('request'),
	_ = require('lodash');

function codeShip(branchTitle, callback) {
	request.get({
		url: 'https://www.codeship.io/api/v1/projects/' + process.env['PROJECT_ID'] + '.json?api_key=' + process.env['CODESHIP_KEY'],
		json: true
	}, function versionRange(err, response, project) {
		if (err) {
			return callback(err);
		}
		var masters = _.filter(project.builds, { branch: branchTitle });
		//console.log(latestMaster);
		callback(null, masters);
	});
}

module.exports = codeShip;