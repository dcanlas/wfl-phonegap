var gulp = require('gulp');
var inject = require('gulp-inject');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');

var paths = {
    sass: ['./scss/**/*.scss'],
    javascript: [
        './www/**/*.js',
        '!./www/js/common/*.js',
        '!./www/js/modules/*.js',
        '!./www/js/main/*.js',
        '!./www/js/app.js',
        '!./www/js/index.js',
        '!./www/lib/**',
        '!./www/spec/**'
    ]
};

gulp.task('index', function(){
    return gulp.src('./www/index.html')
        .pipe(inject(
            gulp.src(paths.javascript,
                {read: false}), {relative: true}))
        .pipe(gulp.dest('./www'));
});

gulp.task('watch', function() {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch([
        paths.javascript,
        paths.css
    ], ['index']);
});

gulp.task('sass', function(done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass())
        .pipe(gulp.dest('./www/css/'))
        .pipe(cleanCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});