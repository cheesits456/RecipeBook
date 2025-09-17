#!/usr/bin/env bash

if [ ! -d "./dist/zipped" ]; then
	mkdir -p "./dist/zipped"
fi

cd "./dist" || exit

for i in ./*; do
	if [ "$i" = "./zipped" ]; then
		continue
	fi
	echo -n "Zipping ${i} . . . "
	zip -rq "${i}.zip" "${i}/"
	echo "Done!"
done

mv ./*.zip ./zipped