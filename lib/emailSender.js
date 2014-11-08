'use strict'

var addrs = require('email-addresses');

function emailSender() {
	var from = addrs.parseOneAddress(process.env['SENDER']);
	var emailFrom = {
			name: from.name,
			email: from.address
		};
	return emailFrom;
}

module.exports = emailSender;
