var _ = require('lodash'),
	Promise = require('rsvp').Promise;



function tagForCommit(sha1) {
	return new Promise(function(resolve, reject) {
		child_process.execFile('git', ['tag', '--points-at', sha1], {cwd: argv.location}, function(err, tag) {
			if (err) return reject(err);
			else return resolve(tag.split('\n').slice(0, -1));
		});
	});
}
module.export=tagForCommit;