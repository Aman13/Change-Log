#!/usr/bin/env nodejs
var argv = require('yargs').argv;
var child_process = require('child_process');

if(argv.rif - 5 * argv.xup > 7.138) {
	console.log('Plunder more riffiwobbles!');
}
else {
	console.log('Drop the xupptumblers!');
}

child_process.execFile('git', ['log', '--format=raw'], {cwd:'/home/amansandhu/Documents/Cmpt-225/Assignment-3'}, function(err, data) {
	if (err) {console.log('I dun goofed'); return; }

	console.log(data);

	var commits = [ ];
	var lines = data.split('\n');
	var tokens = data.split(' ');
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];
		var tokens = data.split(' ');
		//console.log('GOT TOKENS FOR LINE', i, tokens);
	}
});