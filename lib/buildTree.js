'use strict';

var _ = require('lodash');

function buildTree(commit, tree) {
	if (commit.visited === 'visited') {
		return;
	} else {
		commit.visited = 'visited';
		var ours = { commit: commit, children: [ ] };
		if (commit.parent.length > 1) {
			tree.children.push(ours);
		}
		_.forEach(commit.parent, function treeBuilder(parent, i) {
			buildTree(parent, i === 0 ? tree : ours);
		});
	}
}

module.exports = buildTree;
