#!/usr/bin/env bash

# Create zipped subdirectory if it doesn't already exist
if [ ! -d "./dist/zipped" ]; then
	mkdir -p "./dist/zipped"
fi

# Enter ./dist folder
cd "./dist" || exit

# Zip every subdirectory sequentially except zipped folder itself
for i in ./*; do
	if [ "$i" = "./zipped" ]; then
		continue
	fi
	echo -n "Zipping ${i} . . . "
	zip -rq "${i}.zip" "${i}/"
	echo "Done!"
done

# Move new .zip files into zipped subdirectory
mv ./*.zip ./zipped
