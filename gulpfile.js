
const {src , dest, watch, parallel} = require('gulp');
const scss                          = require('gulp-sass')(require('sass'));
const concat                        = require('gulp-concat');
const browserSync                   = require('browser-sync').create();
const uglify                        = require('gulp-uglify-es').default;
const autoprefixer                  = require('gulp-autoprefixer');
const imagemin                      = require('gulp-imagemin');
const del                           = require('del');

function browsersync (){
    browserSync.init({
        server:{
            baseDir:"app/"
        }
    });
}

function scripts (){
    return src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/slick-carousel/slick/slick.js',
        'app/js/**/*.js',
        '!app/js/main.min.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}

function img ()
{
  src('app/images/**/*')
  .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
	  imagemin.mozjpeg({quality: 75, progressive: true}),
	  imagemin.optipng({optimizationLevel: 5})
  ]))
  .pipe(dest('dist/images'))
}

function styles (){
    return src(['app/scss/style.scss',"app/css/slick.css"])
        .pipe(scss({outputStyle: 'compressed'}))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist:['last 10 version'],
            grid:true
        }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function cleandist () {
    return del('dist')
}

function build () {
    return src([
        'app/css/style.min.css',
        'app/fonts/**/*',
        'app/js/main.min.js',
        'app/*.html',
    ], {base:'app'})
        .pipe(dest('dist'))
}

function watching (){
    watch(['app/scss/**/*.scss'],styles);
    watch(['app/js/**/*.js','!app/js/main.min.js'], scripts);
    watch(['app/**/*.html']).on('change',browserSync.reload);
}

exports.cleandist   = cleandist;
exports.styles      = styles;
exports.watching    = watching;
exports.browsersync = browsersync;
exports.scripts     = scripts;
exports.img         = img;
exports.build       = build;
exports.dist        = parallel(build,img);
exports.default     = parallel(scripts, browsersync, watching);
