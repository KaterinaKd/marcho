const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const autoPrefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const del = require('del');
const browserSync = require('browser-sync').create();

function browsersync(){
    browserSync.init({
        server: {
            baseDir: 'app/'
        },
        notify: false
    })
}

function styles(){
    return src('app/scss/style.scss')
        .pipe(scss({outputStyle: 'compressed'}))
        .pipe(concat('style.min.css'))
        .pipe(autoPrefixer({
            overrideBrowserslist: ['last 10 version'],
            grid: true
        }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function cleanDist() {
    return del('dist')
}


function images() {
    return src('app/images/**/*.*')
    .pipe(imagemin())
    .pipe(dest('dist/images'))
}



function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'app/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream()) 
}

function build() {
    return src([
        'app/**/*.html',
        'app/css/style.min.css',
        'app/js/main.min.js'
    ],{base:"app"})
    .pipe(dest('dist'))
}


function watching() {
    watch(['app/scss/**/*.scss'],styles);
    watch(['app/js/**/*.js','!app/js/main.min.js'],scripts);
    watch(['app/**/*.html']).on('change', browserSync.reload);
}



exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.images = images;
exports.cleanDist = cleanDist;
exports.build = build;
exports.build = series(cleanDist,images,build);
exports.default = parallel(styles,scripts,browsersync,watching);