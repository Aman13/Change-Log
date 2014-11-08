'use strict';

var addrs = require('email-addresses'),
	_ = require('lodash');

function emailReciever() {
	var recievers = addrs.parseAddressList(process.env['ADDRESSES']);
	var emailInfo = _.map(recievers, function(email) {
		return {
			name: email.name,
			email: email.address,
			type: 'to'
		};
	});
	return emailInfo;
}

module.exports = emailReciever;
