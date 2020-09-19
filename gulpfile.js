const build_project = 'build';   
const source_project = 'src';

const path = {
    build: {
        html: build_project +"/",
        css: build_project + "/css/",
        js: build_project + "/js/",
        img: build_project + "/img/",
        fonts: build_project + "/fonts/",
        libs: build_project + "/libs/",
    },
    src: {
        html: [source_project + "/index.html"],
        css: source_project + "/style/style.scss",
        js: source_project + "/js/common.js",
        img: source_project + "/img/**/*.*",
        fonts: source_project + "/fonts/**/*.*",
        libs: source_project + "/libs/**/*.*",
    },
    watch: {
        html: source_project + "/**/*.html",
        css: source_project + "/**/*.scss",
        js: source_project + "/js/*.js",
        img: source_project + "/img/**/*.*",
        fonts: source_project + "/fonts/**/*.*",
        libs: source_project + "/libs/**/*.*"
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
    
    
async function browserSync(params) {
    await browsersync.init({
        server: {
            baseDir: "./build"
        },
        open: false,
        host: 'localhost',
        port: 3000,
        logPrefix: "Sergey"
    })
}
//html 
async function html(){
    return await src(path.src.html)
    .pipe(fileinclude())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

//js
async function js(){
    return await src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(rename({extname: ".min.js"}))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}

//jquery
async function libs(){
    return await src(path.src.libs)
    .pipe(dest(path.build.libs))
}

//css
async function css () {
    return await src(path.src.css)
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
async function imgMin(){
    return await src(path.src.img)
    .pipe(
        imagemin({
            progressive: true,
            svgPlugins: [{removeViveBox: false}],
            interlaced: true,
            optimizationLevel: 3
        })
    )
    .pipe(gulp.dest(path.build.img))
    done();
}
//fonts
async function fonts(){
    return await src(path.src.fonts)
    .pipe(dest(path.build.fonts))
    done();
}
//слежение
async function watchFiles() {
    await gulp.watch([path.watch.html], html);
    await gulp.watch([path.watch.css], css);
    await gulp.watch([path.watch.js], js);
    await gulp.watch([path.watch.img], imgMin);
    await gulp.watch([path.watch.fonts], fonts);
}
//чистка папки build
async function clean(params) {
    const deletedFilePaths = await del(['./build/*.*']);
}

const build = gulp.series(clean, gulp.parallel(libs,fonts,imgMin,js,css,html));
const watch = gulp.parallel(build, watchFiles, browserSync);



exports.js = js;
exports.html = html;
exports.css = css;
exports.build = build;
exports.watch = watch;
exports.default = watch;