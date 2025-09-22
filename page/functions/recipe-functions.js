function createNewRecipe() {
	let ids = [
		"recipe-title",
		"recipe-servings",
		"recipe-types",
		"recipe-ingredients",
		"recipe-directions"
	];
	let error = false;
	for (const id of ids) {
		let element = document.getElementById(id);
		if (!element.value) {
			error = true;
			element.style.outline = "rgba(230, 0, 0, 0.7) auto 1px";
		} else element.style.outline = "none";
	};
	if (error === true) return;
	let recipe = {
		title: document.getElementById("recipe-title").value.trim(),
		servings: Number(document.getElementById("recipe-servings").value),
		mealType: [],
		dietaryRestrictions: {
			vegetarian: document.getElementById("recipe-vegetarian").checked,
			vegan: document.getElementById("recipe-vegan").checked,
			glutenFree: document.getElementById("recipe-gluten").checked,
			dairyFree: document.getElementById("recipe-dairy").checked
		},
		ingredients: [],
		instructions: []
	};
	let recipeTypes = document.getElementById("recipe-types").value.trim().split("\n");
	for (const recipeType of recipeTypes) recipe.mealType.push(recipeType.trim());
	let ingredients = document.getElementById("recipe-ingredients").value.trim().split("\n");
	for (const ingredient of ingredients) recipe.ingredients.push(ingredient.trim());
	let instructions = document.getElementById("recipe-directions").value.trim().split("\n");
	for (const instruction of instructions) recipe.instructions.push(instruction.trim());
	const recipePath = path.join(recipeDirectory, `${recipe.title.replace(/'/g, "")}.recipe`).replace(/\\/g, "\\\\");
	fs.writeFileSync(recipePath, JSON.stringify(recipe, null, "\t"));
	$("#saved-modal").modal("toggle");
	updateSidebar();
	showRecipePage(recipePath);
};



function editRecipe(title) {
	const data = JSON.parse(fs.readFileSync(path.join(recipeDirectory, `${title}.recipe`)));
	showCreate(data);
};



function renameRecipe() {
	const oldTitle = document.getElementById("recipe-title").innerText;
	const newTitle = document.getElementById("renamed-title").value.trim();
	let data = JSON.parse(fs.readFileSync(path.join(recipeDirectory, `${oldTitle}.recipe`).replace(/\\/g, "\\\\")));
	data.title = newTitle;
	fs.writeFileSync(path.join(recipeDirectory, `${oldTitle}.recipe`).replace(/\\/g, "\\\\"), JSON.stringify(data, null, "\t"));
	if (!newTitle) return document.getElementById("renamed-title").style.outline = "rgba(230, 0, 0, 0.7) auto 1px";
	fs.renameSync(path.join(recipeDirectory, `${oldTitle}.recipe`).replace(/\\/g, "\\\\"), path.join(recipeDirectory, `${newTitle}.recipe`).replace(/\\/g, "\\\\"));
	showRecipePage(path.join(recipeDirectory, `${newTitle}.recipe`).replace(/\\/g, "\\\\"))
};