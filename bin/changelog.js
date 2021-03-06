#!/usr/bin/env node

'use strict';

var argv = require('yargs').argv,
	log = require('../lib/log'),
	message = require('../lib/message'),
	buildTree = require('../lib/buildTree'),
	tagForCommit = require('../lib/tagForCommit'),
	mandrillEmail = require('../lib/mandrillEmail'),
	codeShip = require('../lib/codeShip'),
	emailSender = require('../lib/emailSender'),
	emailReciever = require('../lib/emailReciever'),
	_ = require('lodash'),
	Promise = require('rsvp').Promise,
	addrs = require('email-addresses'),
	child_process = require('child_process');

codeShip(process.env['BRANCH_NAME'], function(err, projects) {
	if (err) {
		console.log('Error',err);
	}

	console.log(projects.length);
	if (projects.length < 2) {
		var range = 'HEAD';
	} else {
		var range = projects[1].commit_id+'..'+projects[0].commit_id
	}
	log(argv.location, range, function(err, commits){
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

		var tree = { children: [] };
		buildTree(commits[0], tree);
		var info = message(tree, argv.locationUrl);
		console.log(info);

		var emailFrom = emailSender();
		var emailInfo = emailReciever();

		mandrillEmail(info, emailInfo, emailFrom).then(function sendEmail(result) {
			console.log('donearino');
		})
		.catch(function(err) {
			console.log('ERROR LEL', err);
		})
	});
});