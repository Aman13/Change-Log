#!/usr/bin/env nodejs
var argv = require('yargs').argv;
var log = require('../lib/log'),
	_ = require('lodash');

var fs = require('fs');

var child_process = require('child_process');

var location = '/home/amansandhu/Documents/Projects/repo-log-test';

var Promise = require('rsvp').Promise;

function tagForCommit(sha1) {
	return new Promise(function(resolve, reject) {
		child_process.execFile('git', ['tag', '--points-at', sha1], {cwd: location}, function(err, tag) {
			if (err) return reject(err);
			else return resolve(tag.split('\n').slice(0, -1));
		});	
	});
}
//9ce716d1559259d268681b0877865a79157c9762
//e574985a0e28337f237616a52b89239c10f55106

//tagForCommit('9ce716d1559259d268681b0877865a79157c9762', function(err, tag) {
//	console.log(arguments);
//});

log(location, argv.range, function(err, commits){
	if(err){
		console.log('Error',err);
		return;
	}

	//var sha1 = fs.readFileSync(location+'/.git/refs/heads/master', 'utf8');

	//console.log(sha1);

	var some = _.map(commits, function(commit) {
		 return _.template('Parent sha1 is ${ parent } author is ${author}', commit);
	});

//	var output = _.chain(commits)
//		.filter(function(commit) { return commit.author === 'Aman13'; })
//		.filter(function(commit) {return commit.tree === '11f57af878fabefc43927b1829309a8567ad4b4c';})
//		.map('msg')
//		.join('\n')		
//		.value();

	var index = _.indexBy(commits, 'commit');

	_.forEach(commits, function(commit) {
		commit.parent = _.map(commit.parent, function(commit) {
			return index[commit] || { commit: commit, children: [] };
		});
	});

	_.forEach(commits, function(commit) {
		_.forEach(commit.parent, function(parent) {
			parent.children.push(commit);
		});
	});

	function dfs(commit, depth) {

		var shit = '';
		for (var i = 0; i < depth; ++i)
			shit += '\t';

		console.log(shit+commit.tags+' ');
		console.log(shit+'-----------------');
		console.log();

		_.each(commit.parent, function(parent, i) {
			dfs(parent, depth+i);
		}); //Need depth first search for multiple children
	}

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
		dfs(commits[0], 0);
	})

	//console.log(commits[1].parent[0].author);
});