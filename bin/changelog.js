#!/usr/bin/env node

'use strict';

var argv = require('yargs').argv,
	log = require('../lib/log'),
	message = require('../lib/message'),
	buildTree = require('../lib/buildTree'),
	tagForCommit = require('../lib/tagForCommit'),
	mandrillEmail = require('../lib/mandrillEmail'),
	_ = require('lodash'),
	Promise = require('rsvp').Promise,
	addrs = require('email-addresses'),
	child_process = require('child_process');

log(argv.location, argv.range, function(err, commits){
	if(err){
		console.log('Error',err);
		return;
	}

	var index = _.indexBy(commits, 'commit');

	_.forEach(commits, function(commit) {
		commit.parent = _.map(commit.parent, function(commit) {
			return index[commit] || { commit: commit, parent: [] };
		});
	});

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
		var tree = { children: [] };
		buildTree(commits[0], tree);
		var info = message(tree, argv.locationUrl);
		console.log(info);

		//Email parser
		var from = addrs.parseOneAddress(process.env['SENDER']);
		var emailFrom = {
			name: from.name,
			email: from.address
		};
		var recievers = addrs.parseAddressList(process.env['ADDRESSES']);
		var emailinfo = _.map(recievers, function(email) {
			return {
				name: email.name,
				email: email.address,
				type: 'to'
			};
		});

		mandrillEmail(info, emailInfo, emailFrom).then(function sendEmail(result) {
			console.log('donearino');
		})
		.catch(function(err) {
			console.log('ERROR LEL', err);
		})

//	})
});