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


/////////From changelog////////
/*	**Grabs tags for commits for version number**
	var x = _.chain(commits)
		.pluck('commit')
		.map(tagForCommit)
		.value();

	Promise.all(x).then(function(tags) {
		var pairs = _.zip(tags, commits);
		_.each(pairs, function(pair) {
			pair[1].tags = pair[0];
		});

	}).then(function() {
*/