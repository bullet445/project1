const build_project = 'build';   
const source_project = 'src';

const path = {
    build: {
        html: build_project +"/",
        css: build_project + "/css/",
        js: build_project + "/js/",
        img: build_project + "/img/",
        fonts: build_project + "/fonts/",
    },
    src: {
        html: [source_project + "/index.html"],
        css: source_project + "/style.scss",
        js: source_project + "/js/index.js",
        img: source_project + "/img/**/*.*",
        fonts: source_project + "/fonts/",
    },
    watch: {
        html: source_project + "/**/*.html",
        css: source_project + "/**/*.scss",
        js: source_project + "/js/*.js",
        img: source_project + "/img/**/*.*",
        
    },
    clean: './build'
};

let {src, dest} = require('gulp');
const autoPrefixer = require('gulp-autoprefixer');
    gulp = require('gulp');
    fileinclude = require('gulp-file-include');
    browsersync = require('browser-sync').create();
    fileinclude = require('gulp-file-include');
    del = require('del');
    sass = require('gulp-sass');
    autoprefixer = require('gulp-autoprefixer');
    group_media = require('gulp-group-css-media-queries');
    clean_css = require('gulp-clean-css');
    rename = require('gulp-rename');
    uglify = require('gulp-uglify-es').default;
    imagemin = require('gulp-imagemin');
    
    
function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: "./build"
        },
        open: false,
        tunnel: true,
        host: 'localhost',
        port: 9000,
        logPrefix: "Sergey"
    })
}
//html 
function html(){
    return src(path.src.html)
    .pipe(fileinclude())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}
//js
function js(){
    return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(rename({extname: ".min.js"}))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}
//css
function css () {
    return src(path.src.css)
    .pipe(sass())
    .pipe(
        autoprefixer({
            cascade: true
        })
        )
    .pipe(group_media())
    .pipe(gulp.dest(path.build.css))
    .pipe(clean_css())
    .pipe(rename({extname: ".min.css"}))
    .pipe(gulp.dest(path.build.css))
    .pipe(browsersync.stream())
}
//img
function imgMin(){
    return src(path.src.img)
    .pipe(
        imagemin({
            progressive: true,
            svgPlugins: [{removeViveBox: false}],
            interlaced: true,
            optimizationLevel: 3
        })
    )
    .pipe(gulp.dest(path.build.img))
    .pipe(browsersync.stream())
}
//fonts
function fonts(){
    return src(path.src.fonts)
    .pipe(dest(path.build.fonts))
}
//слежение
function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], imgMin);
}
//чистка папки build
async function clean(params) {
    const deletedFilePaths = await del(['./build/*.*']);
}

const build = gulp.series(clean, gulp.parallel(fonts,imgMin,js,css,html));
const watch = gulp.parallel(build, watchFiles, browserSync);

exports.imgMin = imgMin;
exports.html = html;
exports.css = css;
exports.build = build;
exports.watch = watch;
exports.default = watch;