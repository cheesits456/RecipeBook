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
	};
};



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
		};
	};
};