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
};

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