#!/usr/bin/env bash

rm ./dist/zipped/* || echo
electron-packager . RecipeBook --overwrite --out ./dist --platform linux,win32 && echo && ./compilers/zip-output.sh