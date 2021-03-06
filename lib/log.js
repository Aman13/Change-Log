'use strict';

var childProcess = require('child_process');

function Commit(opts)	{
	this.commit = opts.commit;
	this.author = opts.author;
	this.msg = opts.msg;
	this.parent = opts.parent || [];
	this.depth = 0;
	this.tree = opts.tree;
	this.tags = [];
}

function log(location, range, callback) {
	childProcess.execFile('git', ['log', '--format=raw', range], {cwd: location, maxBuffer: 400 * 1024}, function collectData(err, data) {
		if (err) {
			return callback(err);
		}

		var commits = [];
		var state = 0;
		var props = {};
		var buffer = '';
		var pbuffer = [];
		var lines = data.split('\n');

		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];

			if (state === 0) {
				if (line === '') {
					state = 1;
				} else {
					var tokens = line.split(' ');
					if (tokens[0] === 'parent') {
						pbuffer.push(tokens[1]);
					} else if (tokens[0] === 'author') {
						props[tokens[0]] = tokens[1] + ' ' + tokens[2];
					} else {
						props[tokens[0]] = tokens[1];
					}
				}
			} else if (state === 1) {
				if (line === '') {
					state = 0;
					props.msg = buffer;
					props.parent = pbuffer;
					commits.push(new Commit(props));
					buffer = '';
					props = {};
					pbuffer = [];
				} else {
					buffer += line.substring(4) + '\n';
				}
			}
		}
		callback(null, commits);
	});
}

module.exports = log;
