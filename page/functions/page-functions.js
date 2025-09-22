function showCreate(recipe) {
	document.title = `RecipeBook - ${recipe ? "Edit" : "Create New"} Recipe`;
	document.getElementById("create-button").style.display = "none";
	const mainHtml = `
		<div class="container">
			<div class="row">
				<h1>${recipe ? "Edit" : "Create New"} Recipe</h1>
			</div>
			<div class="row">
				<form class="form">
					<div class="container">
						<div class="row">
							<div class="col-md-6">
								<label for="recipe-title">Recipe Title:</label><br>
								<input type="text" id="recipe-title" name="recipe-title" placeholder="Eggs and Bacon" value="${recipe ? recipe.title : ""}">
							</div>
							<div class="col-md-6">
								<label for="recipe-servings">Servings:</label><br>
								<input type="number" id="recipe-servings" name="recipe-servings" placeholder="1" value="${recipe ? recipe.servings : 1}" min="1">
							</div>
						</div>
						<br>
						<div class="row">
							<div class="col-md-6">
								<label for="recipe-types">
									Recipe Categories: &nbsp;<span style="font-size:9pt">(one per line)</span>
								</label><br>
								<textarea id="recipe-types" placeholder="Breakfast&NewLine;Fingerfood"></textarea>
							</div>
							<div class="col-md-6">
								<label for="recipe-restrictions">Dietary Restrictions:</label><br><br>
								<div class="container">
									<div class="row">
										<div class="col-md-1">
											<input type="checkbox" id="recipe-vegetarian" class="form-check-input hover-pointer" name="recipe-vegetarian"><br>
											<input type="checkbox" id="recipe-vegan" class="form-check-input hover-pointer" name="recipe-vegan">
										</div>
										<div class="col-md-5">
											<label for="recipe-vegetarian" class="form-check-label hover-pointer">Vegetarian</label><br>
											<label for="recipe-vegan" class="form-check-label hover-pointer">Vegan</label>
										</div>
										<div class="col-md-1">
											<input type="checkbox" id="recipe-gluten" class="form-check-input hover-pointer" name="recipe-gluten"><br>
											<input type="checkbox" id="recipe-dairy" class="form-check-input hover-pointer" name="recipe-dairy">
										</div>
										<div class="col-md-5">
											<label for="recipe-gluten" class="form-check-label hover-pointer">Gluten Free</label><br>
											<label for="recipe-dairy" class="form-check-label hover-pointer">Dairy Free</label>
										</div>
									</div>
								</div>
							</div>
						</div>
						<br>
						<div class="row">
							<div class="col-md-6">
								<label for="recipe-ingredients">
									Ingredients: &nbsp;<span style="font-size:9pt">(one per line)</span>
								</label><br>
								<textarea id="recipe-ingredients" class="height-10" placeholder="2 Eggs&NewLine;2 Slices of bacon"></textarea>
							</div>
							<div class="col-md-6">
								<label for="recipe-directions">
									Directions: &nbsp;<span style="font-size:9pt">(one per line)</span>
								</label><br>
								<textarea id="recipe-directions" class="height-10" placeholder="Crack eggs into skillet and cook how desired&NewLine;Put bacon into second skillet and cook until done&NewLine;Place eggs and bacon onto a plate and serve"></textarea>
							</div>
						</div>
					</div>
					<br>
					<div class="row">
						<div class="col-md-12">
							<div class="button" onclick="createNewRecipe()">${recipe ? "Save" : "Create New Recipe"}</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	`;
	document.getElementById("main").innerHTML = mainHtml;
	document.getElementById("recipe-title").focus();
	if (recipe) {
		document.getElementById("recipe-title").setAttribute("disabled", "true");
		document.getElementById("recipe-types").value = recipe.mealType.join("\n");
		document.getElementById("recipe-ingredients").value = recipe.ingredients.join("\n");
		document.getElementById("recipe-directions").value = recipe.instructions.join("\n");
		if (recipe.dietaryRestrictions.vegetarian) document.getElementById("recipe-vegetarian").setAttribute("checked", "true");
		if (recipe.dietaryRestrictions.vegan) document.getElementById("recipe-vegan").setAttribute("checked", "true");
		if (recipe.dietaryRestrictions.glutenFree) document.getElementById("recipe-gluten").setAttribute("checked", "true");
		if (recipe.dietaryRestrictions.dairyFree) document.getElementById("recipe-dairy").setAttribute("checked", "true");
	};
};



function showDeleteDialog() {
	$("#delete-modal").modal("toggle");
};



function showMain() {
	document.title = "RecipeBook";
	document.getElementById("create-button").style.display = "flex";
	const mainHtml = `
		<div class="landing-header">
			<h1>Welcome to RecipeBook</h1>
			<div>Your digital cookbook</div>
		</div>
		<div class="color-selectors">
			&nbsp;<span class="red-button hover-pointer" data-toggle="tooltip" data-placement="top" title="Change to Red" onclick="changeColor('red')">&nbsp; &nbsp; &nbsp; </span> &nbsp; &nbsp;
			<span class="orange-button hover-pointer" data-toggle="tooltip" data-placement="top" title="Change to Orange" onclick="changeColor('orange')">&nbsp; &nbsp; &nbsp; </span> &nbsp; &nbsp;
			<span class="green-button hover-pointer" data-toggle="tooltip" data-placement="top" title="Change to Green" onclick="changeColor('green')">&nbsp; &nbsp; &nbsp; </span> &nbsp; &nbsp;
			<span class="blue-button hover-pointer" data-toggle="tooltip" data-placement="top" title="Change to Blue" onclick="changeColor('blue')">&nbsp; &nbsp; &nbsp; </span> &nbsp; &nbsp;
			<span class="purple-button hover-pointer" data-toggle="tooltip" data-placement="top" title="Change to Purple" onclick="changeColor('purple')">&nbsp; &nbsp; &nbsp; </span> &nbsp; &nbsp;
			<label class="switch" onclick="toggleDarkmode()">
				<input id="darkmode-slider" type="checkbox" ${darkmode ? "checked" : ""}>
				<span class="slider round"></span>
			</label>
		</div>
		<div class="landing-body">
			<div class="size-13">Browse recipe categories on the left</div>
			<div>or</div>
			<div class="size-13">Create a new recipe with the button in the corner</div>
		</div>
	`;
	document.getElementById("main").innerHTML = mainHtml;
};



function showRecipePage(recipePath) {
	document.getElementById("create-button").style.display = "none";
	const recipe = JSON.parse(fs.readFileSync(recipePath));
	document.title = `RecipeBook - ${recipe.title}`
	let dietaryRestrictions = [];
	if (recipe.dietaryRestrictions.vegetarian) dietaryRestrictions.push("Vegetarian");
	if (recipe.dietaryRestrictions.vegan) dietaryRestrictions.push("Vegan");
	if (recipe.dietaryRestrictions.dairyFree) dietaryRestrictions.push("Dairy Free");
	if (recipe.dietaryRestrictions.glutenFree) dietaryRestrictions.push("Gluten Free");
	dietaryRestrictions = dietaryRestrictions.length ? dietaryRestrictions.join(", ") : "None";
	let mainHtml = `
		<div class="container">
			<div class="row">
				<div class="col-md-8">
					<h1 id="recipe-title">${recipe.title}</h1>
				</div>
				<div id="rename-button" class="col-md-2">
					<div class="edit-button hover-pointer" onclick="showRenameInput()">Rename</div>
				</div>
				<div id="edit-button" class="col-md-2">
					<div class="edit-button hover-pointer" onclick="editRecipe('${recipe.title.replace(/'/g, "\\'")}')">Edit</div>
				</div>
			</div><hr>
			<div class="row">
				<div class="col-md-4">
					<div><span class="weight-600">Servings:</span> ${recipe.servings}</div>
				</div>
				<div class="col-md-8">
					<div><span class="weight-600">Dietary Restrictions:</span> ${dietaryRestrictions}</div>
				</div>
			</div><br>
			<div class="row">
				<div class="weight-600">Ingredients:</div>
			</div>
			<div class="row">
	`;
	for (const ingredient of recipe.ingredients) {
		mainHtml += `
			<div class="col-md-1">
				<center>
					<input id="ingredient-${recipe.ingredients.indexOf(ingredient)}" class="form-check-input hover-pointer" type="checkbox">
				</center>
			</div>
			<div class="col-md-11">
				<label for="ingredient-${recipe.ingredients.indexOf(ingredient)}" class="hover-pointer">${replaceFractions(ingredient)}</label>
			</div>
		`;
	};
	mainHtml += `
		</div><br>
		<div class="row">
			<div class="weight-600">Directions:</div>
		</div>
		<div class="row">
	`;
	for (const step of recipe.instructions) {
		mainHtml += `
			<div class="col-md-1">
				<center>
					<input id="step-${recipe.instructions.indexOf(step)}" class="form-check-input hover-pointer" type="checkbox">
				</center>
			</div>
			<div class="col-md-11">
				<label for="step-${recipe.instructions.indexOf(step)}" class="hover-pointer">${replaceFractions(step)}</label>
			</div>
		`;
	};
	mainHtml += `
			</div>
		</div>
	`;
	document.getElementById("main").innerHTML = mainHtml;
};



function showRecipes(mealType) {
	document.title = `RecipeBook - ${mealType}`
	document.getElementById("create-button").style.display = "none";
	let mainHtml = `
		<div class="container">
			<div class="row">
				<div class="col-md-12">
					<h1>${mealType}</h1>
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
		if (!recipe.mealType) continue;
		let match = false;
		for (const type of recipe.mealType) {
			if (type.toLowerCase() === mealType.toLowerCase()) match = true;
		};
		if (match) {
			let dietaryRestrictions = [];
			if (recipe.dietaryRestrictions.vegetarian) dietaryRestrictions.push("Vegetarian");
			if (recipe.dietaryRestrictions.vegan) dietaryRestrictions.push("Vegan");
			if (recipe.dietaryRestrictions.dairyFree) dietaryRestrictions.push("Dairy Free");
			if (recipe.dietaryRestrictions.glutenFree) dietaryRestrictions.push("Gluten Free");
			dietaryRestrictions = dietaryRestrictions.length ? dietaryRestrictions.join(", ") : "";
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



function showRenameInput() {
	document.getElementById("rename-button").innerHTML = `<input id="renamed-title" type="text" style="margin:0.5rem">`;
	document.getElementById("renamed-title").focus();
	document.getElementById("renamed-title").setAttribute("value", document.getElementById("recipe-title").innerText);
	document.getElementById("edit-button").innerHTML = `<div class="edit-button hover-pointer" onclick="renameRecipe()">Rename</div>`;
};



function updateSidebar() {
	const fileNames = fs.readdirSync(recipeDirectory);
	let mealTypes = []
	for (const fileName of fileNames) {
		let recipe = {};
		try {
			recipe = JSON.parse(fs.readFileSync(path.join(recipeDirectory, fileName)));
		} catch { };
		if (!recipe.mealType) continue;
		for (const mealType of recipe.mealType) {
			if (!mealTypes.includes(capitalize(mealType))) mealTypes.push(capitalize(mealType));
		};
	};
	mealTypes.sort();
	let sidebarHtml = "";
	for (const mealType of mealTypes) {
		sidebarHtml += `
			<li onclick="showRecipes('${mealType.replace(/'/g, "\\'")}')">
				<a href="#">${mealType}</a>
			</li>
		`;
	};
	document.getElementById("mealTypes").innerHTML = sidebarHtml;
};