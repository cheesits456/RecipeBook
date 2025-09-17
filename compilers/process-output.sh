#!/usr/bin/env bash

output_folder="./dist/RecipeBook-linux-x64"
echo "Moving binary to new path"
mv "${output_folder}/RecipeBook" "${output_folder}/binary"
echo "Creating new launcher file"
cp "./compilers/launcher.sh" "${output_folder}/RecipeBook"
echo "Done!"