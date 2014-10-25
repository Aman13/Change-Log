#!/usr/bin/env nodejs
var argv = require('yargs').argv;
var log = require('../lib/log'),
	_ = require('lodash');

var fs = require('fs');

var mandrill = require('mandrill-api/mandrill');

var child_process = require('child_process');

var location = '/home/amansandhu/Documents/Projects/repo-log-test';

var locationurl = 'https://github.com/Aman13/repo-log-test/pull/';

var Promise = require('rsvp').Promise;

var util = require('util');

mandrill_client = new mandrill.Mandrill('5oM9eU13RLqrIbo3YSDgEg');


function tagForCommit(sha1) {
	return new Promise(function(resolve, reject) {
		child_process.execFile('git', ['tag', '--points-at', sha1], {cwd: location}, function(err, tag) {
			if (err) return reject(err);
			else return resolve(tag.split('\n').slice(0, -1));
		});
	});
}

log(location, argv.range, function(err, commits){
	if(err){
		console.log('Error',err);
		return;
	}

	var some = _.map(commits, function(commit) {
		 return _.template('Parent sha1 is ${ parent } author is ${author}', commit);
	});

	var index = _.indexBy(commits, 'commit');

	_.forEach(commits, function(commit) {
		commit.parent = _.map(commit.parent, function(commit) {
			return index[commit] || { commit: commit, parent: [] };
		});
	});

	function buildTree(commit, depth, tree) {
		var ours = { commit: commit, children: [ ] };
		if (commit.parent.length > 1)
			tree.children.push(ours);
		_.forEachRight(commit.parent, function(parent, i) {
			buildTree(parent, depth + i, (i === 0) ? tree : ours);
		});
	}

	function message(tree, depth) {
		
		var sub = _.chain(tree.children).map(function(child) {
			return '<li>' + message(child, depth+1) + '</li>';
		}).join('').value();
		if(!tree.commit) return '<ul>' + sub + '</ul>';
		tree.commit.msg = tree.commit.msg.split('\n');
		var expr = /^Merge pull request #(\d+) from ([^\s]+)/;
		expr = expr.exec(tree.commit.msg[0]);
		var pullUrl = locationurl + expr[1];
	//	return tree.commit.commit + '<br/>' + tree.commit.author + '<ul>' + sub + '</ul>';
	//	return _.template ('${author} <br/> ${msg}', tree.commit) + '<ul>' + sub + '</ul>';
		return _.template ('${author} <br/>',tree.commit) + '<a href="'+pullUrl+'">details</a>' + _.template ('<br/> <b>Commit message:</b> <br/> ${msg[2]}', tree.commit) + '<ul>' + sub + '</ul>';
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
		var tree = { children: [] };
		buildTree(commits[0], 0, tree);
		var info = message(tree, 0);

		var email = {
			'html': info,
			'subject': 'example commit log',
			'from_email': 'sandhu.amandeep.s@gmail.com',
			'from_name': 'Aman',
			'to': [{
				'email': 'scorpion_013@hotmail.com',
				'name': 'Bob',
				'type': 'to'
			}]

		};

		mandrill_client.messages.send({message: email}, function(result) {
			console.log(result);
		}, function(err) {
			console.log('mistakes were made');
		});
	})
});