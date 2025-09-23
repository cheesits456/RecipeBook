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
	let recipeTypes = removeStringFromArray("", document.getElementById("recipe-types").value.trim().split("\n"));
	for (const recipeType of recipeTypes) recipe.mealType.push(recipeType.trim());
	let ingredients = removeStringFromArray("", document.getElementById("recipe-ingredients").value.trim().split("\n"));
	for (const ingredient of ingredients) recipe.ingredients.push(ingredient.trim());
	let instructions = removeStringFromArray("", document.getElementById("recipe-directions").value.trim().split("\n"));
	for (const instruction of instructions) recipe.instructions.push(instruction.trim());
	const recipePath = path.join(recipeDirectory, `${recipe.title.replace(/'/g, "")}.recipe`).replace(/\\/g, "\\\\");
	fs.writeFileSync(recipePath, JSON.stringify(recipe, null, "\t"));
	$("#saved-modal").modal("toggle");
	updateSidebar();
	showRecipePage(recipePath);
};



function deleteRecipe() {
	const title = document.getElementById("recipe-title").innerText;
	fs.unlinkSync(path.join(recipeDirectory, `${title}.recipe`).replace(/\\/g, "\\\\"));
	$("#delete-modal").modal("toggle");
	updateSidebar();
	showMain();
	$("#deleted-modal").modal("toggle");
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



function search() {
	const query = document.getElementById("search-query").value.trim();
	if (!query) return;
	document.getElementById("create-button").style.display = "none";
	document.title = `RecipeBook - ${query}`
	let mainHtml = `
		<div class="container">
			<div class="row">
				<div class="col-md-12">
					<h1>${query}</h1>
					<hr>
				</div>
			</div>
	`;
	const fileNames = fs.readdirSync(recipeDirectory);
	for (const fileName of fileNames) {
		if (!fileName.endsWith(".recipe")) continue;
		let recipe = {};
		try {
			recipe = JSON.parse(fs.readFileSync(path.join(recipeDirectory, fileName)));
		} catch { };
		if (!recipe.title) continue;
		let match = false;
		if (recipe.title.toLowerCase().includes(query.toLowerCase())) match = true;
		for (const mealType of recipe.mealType) {
			if (mealType.toLowerCase().includes(query.toLowerCase())) match = true;
		};
		for (const ingredient of recipe.ingredients) {
			if (ingredient.toLowerCase().includes(query.toLowerCase())) match = true;
		};
		for (const instruction of recipe.instructions) {
			if (instruction.toLowerCase().includes(query.toLowerCase())) match = true;
		};
		let dietaryRestrictions = [];
		if (recipe.dietaryRestrictions.vegetarian) dietaryRestrictions.push("Vegetarian");
		if (recipe.dietaryRestrictions.vegan) dietaryRestrictions.push("Vegan");
		if (recipe.dietaryRestrictions.dairyFree) dietaryRestrictions.push("Dairy Free");
		if (recipe.dietaryRestrictions.glutenFree) dietaryRestrictions.push("Gluten Free");
		for (const restriction of dietaryRestrictions) {
			if (restriction.toLowerCase() === query.toLowerCase()) match = true; 
		}
		dietaryRestrictions = dietaryRestrictions.length ? dietaryRestrictions.join(", ") : "";
		if (match) {
			mainHtml += `
				<div class="row">
					<div class="col-md-12">
						<div class="card">
							<div class="card-header weight-600 hover-pointer" onclick="showRecipePage('${path.join(recipeDirectory, fileName).replace(/\\/g, "\\\\")}')">${recipe.title}</div>
							<div class="container">
								<div class="row">
									<div class="col-md-6">
										<div class="card-text">${recipe.servings} serving${recipe.servings === 1 ? "" : "s"}</div>
									</div>
									<div class="col-md-6">
										<div class="card-text">${dietaryRestrictions}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			`;
		};
	};
	mainHtml += `</div>`;
	document.getElementById("main").innerHTML = mainHtml;
};