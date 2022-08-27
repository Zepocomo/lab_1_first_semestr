import gulp from "gulp";
import deleteAsync from "del";
import cssnano from "gulp-cssnano";
import autoprefixer from "gulp-autoprefixer";
import imagemin from "gulp-imagemin";
import concat from "gulp-concat";
import uglify from "gulp-uglify";
import rename from "gulp-rename";
import browsersync from "browser-sync";
import * as nodePath from "path";
const rootFolder=nodePath.basename(nodePath.resolve());
const buildFolder=`./dist`;
const srcFolder=`./app`;
const path={
    build:{
        html:`${buildFolder}/`,
        js:`${buildFolder}/js/`,
        css:`${buildFolder}/css/`,
        fonts:`${buildFolder}/fonts/`,
        img:`${buildFolder}/img/`,
        sass:`${buildFolder}/sass/`,
        files:`${srcFolder}/**/`
    },
    src:{
        html:`${srcFolder}/*.html`,
        js:`${srcFolder}/js/*.js`,
        css:`${srcFolder}/css/*.css`,
        fonts:`${srcFolder}/fonts/*.*`,
        img:`${srcFolder}/img/*.*`,
        sass:`${srcFolder}/sass/*.sass`,
        files:`${srcFolder}/**/*.*`
    },
    watch:{
        html:`${srcFolder}/html/*.html`,
        js:`${srcFolder}/js/*.js`,
        css:`${srcFolder}/css/*.css`,
        fonts:`${srcFolder}/fonts/*.*`,
        img:`${srcFolder}/img/*.*`,
        sass:`${srcFolder}/sass/*.sass`
    },
    clean:buildFolder,
    buildFolder:buildFolder,
    srcFolder:srcFolder,
    rootFolder:rootFolder,
    ftp:``
}
global.app={
    path:path,
    gulp:gulp
}

const html = () => {
    return app.gulp.src(path.src.html)
        .pipe(app.gulp.dest(path.build.html))
        .pipe(browsersync.stream())
}
const img = () => {
    return app.gulp.src(path.src.img)
        .pipe (imagemin ({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true
        }))
        .pipe(app.gulp.dest(path.build.img))
};
const css = () => {
    return app.gulp.src(path.src.css)
        .pipe(app.gulp.dest(path.build.css))
}
const js = () => {
    return app.gulp.src(path.src.js)
        .pipe (concat ( 'scripts.js'))
        .pipe (uglify ())
        .pipe (rename ({suffix: '.min'}))
        .pipe(app.gulp.dest(path.build.js))
};

const sas = () => {
    return app.gulp.src(path.src.sass)
        .pipe (concat ( 'styles.sass'))
        .pipe (autoprefixer ({
            browsers: [ 'last 2 versions'],
            cascade: false
        }))
        .pipe (cssnano ())
        .pipe (rename ({suffix: '.min'}))
        .pipe(app.gulp.dest(path.build.sass))
}
const fonts = () => {
    return app.gulp.src(path.src.fonts)
        .pipe(app.gulp.dest(path.build.fonts))
}

function watcher () {
    gulp.watch(path.watch.html,html)
}
const reset = () => {
    return deleteAsync(app.path.clean);
}
const server = () => {
    browsersync.init({
        server:{
            baseDir:`${app.path.build.html}`
        },
        notify:false,
        port:3000
    })
}
gulp.task ( "default", );
const mainTask=gulp.parallel(watcher,server)
const dev=gulp.series(reset,html,sas,js, img,css,fonts,mainTask)
gulp.task('default',dev)