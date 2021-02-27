const { series, parallel, src, dest } = require('gulp');
//series:同步
//parallel：异步
//gulp-uglify压缩
//gulp-rename重命名 rename({extname:'.min.js'})
// function func1(cb) {
//     console.log("func1");
//     for (let i = 0; i < 2000; i++) {

//     }
//     cb();
// }
// function func2(cb) {
//     console.log("func2");
//     cb();
// }
//文件监控
// watch
// watch('文件路径',{ config }, function (cb) { 
//     cb();
// })
exports.default = function () {
    return src('src/js/index.js')
        .pipe(dest('src/dist/js'))
};