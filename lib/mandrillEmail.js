var mandrill = require('mandrill-api/mandrill');

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
		 mandrill_client.messages.send({message: email}, function(result) {
		 	console.log(result);
		 }, function(err) {
		 	console.log('mistakes were made');
		 });
}
module.exports=mandrillEmail;