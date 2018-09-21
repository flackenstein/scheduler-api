"use strict";
const Bundler = require("parcel-bundler");
const Path = require("path");
const fs = require("fs-extra");

// Remove build folder
console.log("Removing build directory...");
fs.removeSync(".build");

// Create build folder
console.log("Creating build directory...");
fs.mkdirsSync(".build");

// Copy Static files
console.log("Copying static files [node modules]...");
fs.copySync('node_modules', '.build/node_modules');

// Entrypoint file location
const file = Path.join(__dirname, "../src/server.ts");

// Bundler options
const options = {
    outDir: ".build", // The out directory to put the build files in, defaults to dist
    outFile: "server.js", // The name of the outputFile
    publicUrl: "/", // The url to server on, defaults to dist
    watch: false, // whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== "production"
    cache: false, // Enabled or disables caching, defaults to true
    cacheDir: ".cache", // The directory cache gets put in, defaults to .cache
    contentHash: false, // Disable content hash from being included on the filename
    minify: true, // Minify files, enabled if process.env.NODE_ENV === "production"
    scopeHoist: false, // turn on experimental scope hoisting/tree shaking flag, for smaller production
    target: "node", // browser/node/electron, defaults to browser
    https: false, // Serve files over https or http, defaults to false
    logLevel: 3, // 3 = log everything, 2 = log warnings & errors, 1 = log errors
    hmr: false, //Enable or disable HMR while watching
    hmrPort: 0, // The port the HMR socket runs on, defaults to a random free port (0 in node.js resolves to a random free port)
    sourceMaps: false, // Enable or disable sourcemaps, defaults to enabled (not supported in minified builds yet)
    hmrHostname: "", // A hostname for hot module reload, default to ""
    detailedReport: true // Prints a detailed report of the bundles, assets, filesizes and times, defaults to false, reports are only printed if watch is disabled
};

const bundler = new Bundler(file, options);
bundler.bundle();
