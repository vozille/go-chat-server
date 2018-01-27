var gulp = require('gulp');
var merge = require('merge-stream');
var minify_css_code = require('gulp-clean-css')
var minify_js_code = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('copy_from_node_modules', function () {
    var vue_js = gulp.src('./node_modules/vue/dist/*.*')
    .pipe(gulp.dest('./public/js/dependencies/'));

    var bootstrap_css = gulp.src('./node_modules/bootstrap/dist/css/*.*')
    .pipe(gulp.dest('./public/css/dependencies/'));

    var bootstrap_js = gulp.src('./node_modules/bootstrap/dist/js/*.*')
    .pipe(gulp.dest('./public/js/dependencies/'));

    return merge(vue_js, bootstrap_css, bootstrap_js)

});

gulp.task('minify_css', function(){
    gulp.src('./public/css/*.css')
    .pipe(rename({ suffix: '.min' }))
    .pipe(minify_css_code())
    .pipe(gulp.dest('./public/css/minified/'))
});

gulp.task('minify_js', function(){
    gulp.src('./public/js/*.js')
    .pipe(rename({ suffix: '.min' }))
    .pipe(minify_js_code())
    .pipe(gulp.dest('./public/js/minified'))
});

gulp.task('default', ['copy_from_node_modules', 'minify_js', 'minify_css']);