const path = require("path");

const electron = require("electron");

function createWindow() {

	const window = new electron.BrowserWindow({
		width: 1200,
		height: 650,
		minWidth: 1200,
		minHeight: 650,
		icon: path.join(__dirname, "icon", "icon.png"),
		webPreferences: {
			contextIsolation: false,
			enableRemoteModule: true,
			nodeIntegration: true
		}
	});

	window.removeMenu();
	window.loadFile(path.join("page", "index.html"));
}

electron.app.whenReady().then(createWindow);

process.on("uncaughtException", console.error);