'use strict';

var mandrill = require('mandrill-api/mandrill');

var mandrillClient = new mandrill.Mandrill(process.env['MANDRILL_KEY']);

function mandrillEmail (info) {
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

	return new Promise(function emailResult(resolve, reject) {
		mandrillClient.message.send({message: email}, resolve, reject);
	});
}
module.exports = mandrillEmail;
