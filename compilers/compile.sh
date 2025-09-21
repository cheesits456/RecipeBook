#!/usr/bin/env bash

# Remove old compressed archives
rm ./dist/zipped/* || echo

echo "COMPILATION:"
# Compile program
electron-packager . RecipeBook --overwrite --out ./dist --platform linux,win32 --icon ./icon/icon.ico && {
	echo
	echo "PROCESSING:"
	./compilers/process-output.sh && {
		echo
		echo "COMPRESSION:"
		# Compress files to zip archives
		./compilers/zip-output.sh && {
			echo
			echo "Program compiled to './dist/' and compressed to './dist/zipped/'"
		}
	}
}
