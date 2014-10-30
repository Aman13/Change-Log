'use strict';

var Promise = require('rsvp').Promise,
	childProcess = require('child_process'),
	argv = require('yargs').argv;

function tagForCommit(sha1) {
	return new Promise(function tagPromise(resolve, reject) {
		childProcess.execFile('git', ['tag', '--points-at', sha1], {cwd: argv.location}, function split(err, tag) {
			if (err) {
				return reject(err);
			} else {
				return resolve(tag.split('\n').slice(0, -1));
			}
		});
	});
}
module.export = tagForCommit;
