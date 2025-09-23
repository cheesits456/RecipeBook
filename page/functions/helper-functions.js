function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
};



function removeStringFromArray(string, array) {
	let returnValue = [];
	for (const item of array) {
		if (item != string) returnValue.push(item);
	};
	return returnValue;
};



function replaceFractions(text) {
	return text
		.replace(/1\/2/g, "½")
		.replace(/1\/3/g, "⅓")
		.replace(/1\/4/g, "¼")
		.replace(/1\/5/g, "⅕")
		.replace(/1\/6/g, "⅙")
		.replace(/1\/7/g, "⅐")
		.replace(/1\/8/g, "⅛")
		.replace(/1\/9/g, "⅑")
		.replace(/1\/10/g, "⅒")
		.replace(/2\/3/g, "⅔")
		.replace(/2\/5/g, "⅖")
		.replace(/3\/5/g, "⅗")
		.replace(/3\/8/g, "⅜")
		.replace(/4\/5/g, "⅘")
		.replace(/3\/4/g, "¾")
		.replace(/5\/6/g, "⅚")
		.replace(/5\/8/g, "⅝")
		.replace(/7\/8/g, "⅞");
};