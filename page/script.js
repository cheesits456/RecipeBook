const fs = require("fs");
const path = require("path");

const os = require("os");

process.chdir(__dirname);

// Set variable for recipe directory and create the folder if it doesn't exist
const recipeDirectory = path.join(os.homedir(), "Documents", "Recipes");
if (!fs.existsSync(recipeDirectory)) fs.mkdir(recipeDirectory, null, () => { });

let config = {};
if (fs.existsSync(path.join(recipeDirectory, "RecipeBook.config"))) {
	try {
		config = JSON.parse(fs.readFileSync(path.join(recipeDirectory, "RecipeBook.config")))
	} catch { };
}

// Set variable for whether darkmode is enabled
let darkmode = config.darkmode || false;
let darkmodeCounter = 0;

// Set the copyright year and version number
document.getElementById("copyright-version").innerHTML = JSON.parse(fs.readFileSync(path.join("..", "package.json").replace(/\\/g, "\\\\"))).version;
document.getElementById("copyright-year").innerHTML = new Date().getFullYear();

updateSidebar();
changeColor(config.color || "blue");

// Display the landing page
showMain();



// FUNCTIONS
// Return a capitalized string
function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
};


// Compile a list of meal types and set a sidebar link for each one
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
	}
	document.getElementById("mealTypes").innerHTML = sidebarHtml;
}


// Display the landing page
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


// Display the Create New Recipe page
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
	}
};


// Display recipes for a certain mealtype
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
			`
		};

	};

	mainHtml += `</div>`;

	document.getElementById("main").innerHTML = mainHtml;
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
			`
		};

	}

	mainHtml += `</div>`;
	document.getElementById("main").innerHTML = mainHtml;

}


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
	`

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
		`
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
		`
	};

	mainHtml += `
			</div>
		</div>
	`
	document.getElementById("main").innerHTML = mainHtml;
};


// Save new recipe to file
function createNewRecipe() {
	let ids = [
		"recipe-title",
		"recipe-servings",
		"recipe-types",
		"recipe-ingredients",
		"recipe-directions"
	];
	let error = false;

	// validate form
	for (const id of ids) {
		let element = document.getElementById(id);
		if (!element.value) {
			error = true;
			element.style.outline = "rgba(230, 0, 0, 0.7) auto 1px";
		} else element.style.outline = "none";
	};
	if (error === true) return;

	// build data structure
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
	// trim user inputs
	let recipeTypes = document.getElementById("recipe-types").value.trim().split("\n");
	for (const recipeType of recipeTypes) recipe.mealType.push(recipeType.trim());
	let ingredients = document.getElementById("recipe-ingredients").value.trim().split("\n");
	for (const ingredient of ingredients) recipe.ingredients.push(ingredient.trim());
	let instructions = document.getElementById("recipe-directions").value.trim().split("\n");
	for (const instruction of instructions) recipe.instructions.push(instruction.trim());

	// write file and update sidebar
	const recipePath = path.join(recipeDirectory, `${recipe.title.replace(/'/g, "")}.recipe`).replace(/\\/g, "\\\\");
	fs.writeFileSync(recipePath, JSON.stringify(recipe, null, "\t"));
	$("#saved-modal").modal("toggle");
	updateSidebar();
	showRecipePage(recipePath);
};

// Edit an existing recipe
function editRecipe(title) {
	const data = JSON.parse(fs.readFileSync(path.join(recipeDirectory, `${title}.recipe`)));
	showCreate(data);
}

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
}

function showRenameInput() {
	document.getElementById("rename-button").innerHTML = `<input id="renamed-title" type="text" style="margin:0.5rem">`;
	document.getElementById("renamed-title").focus();
	document.getElementById("renamed-title").setAttribute("value", document.getElementById("recipe-title").innerText);
	document.getElementById("edit-button").innerHTML = `<div class="edit-button hover-pointer" onclick="renameRecipe()">Rename</div>`;
}

function renameRecipe() {
	const oldTitle = document.getElementById("recipe-title").innerText;
	const newTitle = document.getElementById("renamed-title").value.trim();

	let data = JSON.parse(fs.readFileSync(path.join(recipeDirectory, `${oldTitle}.recipe`).replace(/\\/g, "\\\\")));
	data.title = newTitle;
	fs.writeFileSync(path.join(recipeDirectory, `${oldTitle}.recipe`).replace(/\\/g, "\\\\"), JSON.stringify(data, null, "\t"));

	if (!newTitle) return document.getElementById("renamed-title").style.outline = "rgba(230, 0, 0, 0.7) auto 1px";

	fs.renameSync(path.join(recipeDirectory, `${oldTitle}.recipe`).replace(/\\/g, "\\\\"), path.join(recipeDirectory, `${newTitle}.recipe`).replace(/\\/g, "\\\\"));

	showRecipePage(path.join(recipeDirectory, `${newTitle}.recipe`).replace(/\\/g, "\\\\"))
}

function changeColor(color) {
	let root = document.querySelector(":root");
	let config = {};
	if (fs.existsSync(path.join(recipeDirectory, "RecipeBook.config"))) {
		try {
			config = JSON.parse(fs.readFileSync(path.join(recipeDirectory, "RecipeBook.config")))
		} catch { };
	};
	config.color = color;
	fs.writeFileSync(path.join(recipeDirectory, "RecipeBook.config"), JSON.stringify(config, null, "\t"));
	if (color === "red") {
		root.style.setProperty("--background", darkmode ? "#3f3b3b" : "#fff5f5");
		root.style.setProperty("--text", darkmode ? "#eee" : "black");
		root.style.setProperty("--primary", "#d81515");
		root.style.setProperty("--primary-transparent", "#d8151522");
		root.style.setProperty("--secondary", "#961111");
		root.style.setProperty("--tertiary", "#631111");
		root.style.setProperty("--quartinary", "#460c0c");
		root.style.setProperty("--quartinary-transparent", "#460c0c22");
	} else if (color === "orange") {
		root.style.setProperty("--background", darkmode ? "#3f3e3b" : "#fffaf5");
		root.style.setProperty("--text", darkmode ? "#eee" : "black");
		root.style.setProperty("--primary", "#e77e05");
		root.style.setProperty("--primary-transparent", "#e77e0522");
		root.style.setProperty("--secondary", "#aa5b00");
		root.style.setProperty("--tertiary", "#4b2800");
		root.style.setProperty("--quartinary", "#381e00");
		root.style.setProperty("--quartinary-transparent", "#381e0022");
	} else if (color === "green") {
		root.style.setProperty("--background", darkmode ? "#3b3f3b" : "#f0fff1");
		root.style.setProperty("--text", darkmode ? "#eee" : "black");
		root.style.setProperty("--primary", "#45d122");
		root.style.setProperty("--primary-transparent", "#45d12222");
		root.style.setProperty("--secondary", "#2b8315");
		root.style.setProperty("--tertiary", "#0d2e04");
		root.style.setProperty("--quartinary", "#0a2403");
		root.style.setProperty("--quartinary-transparent", "#0a240322");
	} else if (color === "blue") {
		root.style.setProperty("--background", darkmode ? "#3b3d3f" : "#f0f4ff");
		root.style.setProperty("--text", darkmode ? "#eee" : "black");
		root.style.setProperty("--primary", "#4f52ba");
		root.style.setProperty("--primary-transparent", "#4f52ba22");
		root.style.setProperty("--secondary", "#353577");
		root.style.setProperty("--tertiary", "#1f2049");
		root.style.setProperty("--quartinary", "#161a2d");
		root.style.setProperty("--quartinary-transparent", "#161a2d22");
	} else if (color === "purple") {
		root.style.setProperty("--background", darkmode ? "#3e3b3f" : "#f9f0ff");
		root.style.setProperty("--text", darkmode ? "#eee" : "black");
		root.style.setProperty("--primary", "#9122d1");
		root.style.setProperty("--primary-transparent", "#8b22d122");
		root.style.setProperty("--secondary", "#4e1172");
		root.style.setProperty("--tertiary", "#30083a");
		root.style.setProperty("--quartinary", "#1f062e");
		root.style.setProperty("--quartinary-transparent", "#1f062e22");

	}
}

function toggleDarkmode() {
	darkmodeCounter++;
	if (darkmodeCounter === 2) darkmodeCounter = 0;
	if (darkmodeCounter === 1) {
		let config = {};
		if (fs.existsSync(path.join(recipeDirectory, "RecipeBook.config"))) {
			try {
				config = JSON.parse(fs.readFileSync(path.join(recipeDirectory, "RecipeBook.config")))
			} catch { };
		};
		if (!darkmode) darkmode = true;
		else darkmode = false;
		config.darkmode = darkmode;
		fs.writeFileSync(path.join(recipeDirectory, "RecipeBook.config"), JSON.stringify(config, null, "\t"));
		let root = document.querySelector(":root");
		let color = window.getComputedStyle(document.getElementById("body")).backgroundColor;
		switch (color) {
			case "rgb(63, 59, 59)":
				root.style.setProperty("--background", "#fff5f5");
				root.style.setProperty("--text", "black");
				break;
			case "rgb(255, 245, 245)":
				root.style.setProperty("--background", "#3f3b3b");
				root.style.setProperty("--text", "#eee");
				break;
			case "rgb(63, 62, 59)":
				root.style.setProperty("--background", "#fffaf5");
				root.style.setProperty("--text", "black");
				break;
			case "rgb(255, 250, 245)":
				root.style.setProperty("--background", "#3f3e3b");
				root.style.setProperty("--text", "#eee");
				break;
			case "rgb(59, 63, 59)":
				root.style.setProperty("--background", "#f0fff1");
				root.style.setProperty("--text", "black");
				break;
			case "rgb(240, 255, 241)":
				root.style.setProperty("--background", "#3b3f3b");
				root.style.setProperty("--text", "#eee");
				break;
			case "rgb(59, 61, 63)":
				root.style.setProperty("--background", "#f0f4ff");
				root.style.setProperty("--text", "black");
				break;
			case "rgb(240, 244, 255)":
				root.style.setProperty("--background", "#3b3d3f");
				root.style.setProperty("--text", "#eee");
				break;
			case "rgb(62, 59, 63)":
				root.style.setProperty("--background", "#f9f0ff");
				root.style.setProperty("--text", "black");
				break;
			case "rgb(249, 240, 255)":
				root.style.setProperty("--background", "#3e3b3f");
				root.style.setProperty("--text", "#eee");
				break;

		}
	}
}