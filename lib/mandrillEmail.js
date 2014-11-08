'use strict';

var mandrill = require('mandrill-api/mandrill'),
	Promise = require('rsvp').Promise;

var mandrillClient = new mandrill.Mandrill(process.env['MANDRILL_KEY']);

function mandrillEmail (info, emailInfo, sender) {
	var email = {
		'html': info,
		'subject': 'Commit progress report',
		'from_email': sender.email,
		'from_name': sender.name,
		'to': emailInfo
	};

	return new Promise(function emailResult(resolve, reject) {
		mandrillClient.messages.send({message: email}, resolve, reject);
	});
}

module.exports = mandrillEmail;
