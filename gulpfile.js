const { src, dest, series, watch } = require("gulp");
const htmlClean = require("gulp-htmlclean");
const less = require("gulp-less");
const cssClean = require("gulp-clean-css");
const stripDebug = require("gulp-strip-debug");
const uglify = require("gulp-uglify-es").default;
const imgMin = require("gulp-imagemin");
const connect = require("gulp-connect");
const folder = {
    src: "src/",
    dist: "dist/"
};
function html() {
    return src(folder.src + "html/*")
        .pipe(htmlClean())
        .pipe(dest(folder.dist + "html/"))
        .pipe(connect.reload());
}
function css() {
    return src(folder.src + "css/*")
        .pipe(less())
        .pipe(cssClean())
        .pipe(dest(folder.dist + "css/"))
        .pipe(connect.reload());
}
function js() {
    return src(folder.src + "js/*")
        // .pipe(stripDebug())
        // .pipe(uglify())
        .pipe(dest(folder.dist + "js/"))
        .pipe(connect.reload());
}
function images() {
    return src(folder.src + "images/*")
        // .pipe(imgMin())
        .pipe(dest(folder.dist + "images/"))
        .pipe(connect.reload());
}
function server() {
    connect.server({
        port: "1998",
        livereload: true// 自动刷新
    });
}
watch(folder.src + "html/*", function (cb) {
    html();
    cb();
});
watch(folder.src + "css/*", function (cb) {
    css();
    cb();
});
watch(folder.src + "js/*", function (cb) {
    js();
    cb();
});
watch(folder.src + "images/*", function (cb) {
    images();
    cb();
});
exports.default = series(html, css, js, images, server);