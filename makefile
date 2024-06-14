.PHONY: climb-tree-instant

#! Avoid using this
climb-tree-instant:
	git push && git checkout rec && git pull && git merge dev && git push && git checkout main && git pull && git merge rec && git push && git checkout dev