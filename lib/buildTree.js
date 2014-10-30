'use strict';

var _ = require('lodash');

function buildTree(commit, depth, tree) {
	var ours = { commit: commit, children: [ ] };
	if (commit.parent.length > 1) {
		tree.children.push(ours);
	}
	_.forEachRight(commit.parent, function treeBuilder(parent, i) {
		buildTree(parent, depth + i, (i === 0) ? tree : ours);
	});
}

module.exports = buildTree;
