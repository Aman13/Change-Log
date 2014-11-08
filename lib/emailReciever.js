'use strict'

var addrs = require('email-addresses');

function emailReciever() {
	var recievers = addrs.parseAddressList(process.env['ADDRESSES']);
	var emailinfo = _.map(recievers, function(email) {
		return {
			name: email.name,
			email: email.address,
			type: 'to'
		};
	});

module.exports = emailReciever;
