'use strict';

var mandrill = require('mandrill-api/mandrill'),
	Promise = require('rsvp').Promise;

var mandrillClient = new mandrill.Mandrill(process.env['MANDRILL_KEY']);

function mandrillEmail (info) {
	var email = {
		'html': info,
		'subject': 'Commit progress report',
		'from_email': process.env['FROM_EMAIL'],
		'from_name': process.env['FROM_NAME'],
		'to': [{
			'email': process.env['TO_EMAIL'],
			'name': process.env['TO_NAME'],
			'type': 'to'
		}]
	};

	return new Promise(function emailResult(resolve, reject) {
		mandrillClient.message.send({message: email}, resolve, reject);
	});
}
module.exports = mandrillEmail;
