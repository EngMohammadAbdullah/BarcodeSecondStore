var gulp = require("gulp"),
    cordova = require("cordova-lib").cordova;

gulp.task("default", function (callback) {
    cordova.run({
        "platforms": ["android"],
        "options": {
            argv: ["--release","--gradleArg=--no-daemon"]
        }
    }, callback);
});