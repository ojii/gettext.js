/*jshint strict: false, latedef:true, noempty:true, noarg:true, unused:vars, evil:true, esnext:true, indent:4, eqeqeq:true, nocomma:true, quotmark:single, nonbsp:true, node:true, bitwise:false, curly:true, undef:true, nonew:true, forin:true */
'use strict';
var gulp = require('gulp');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var shell = require('gulp-shell');

gulp.task('demo', () => {
    return gulp.src('demo/locale/**/LC_MESSAGES/*.po', {'read': false}).pipe(
        shell([
            'msgfmt -o <%= mo(file) %> <%= file.path %>',
            'gettextjs -iv demo/locale',
            'gettextjs -iv --js demo/locale'
        ], {
            templateData: {
                mo: (f) => { return f.path.substr(0, f.path.length - 2) + 'mo'; }
            }
        })
    );
});

gulp.task('build', () => {
    return gulp.src(['./src/js/gettext.js']).pipe(
        sourcemaps.init()
    ).pipe(babel({
        presets: ['es2015']
    })).pipe(rename({
        basename: 'gettext'
    })).pipe(
        sourcemaps.write()
    ).pipe(
        gulp.dest('./dist/')
    ).pipe(
        uglify()
    ).pipe(rename({
        extname: '.min.js'
    })).pipe(
        sourcemaps.write('.')
    ).pipe(
        gulp.dest('./dist/')
    );
});

gulp.task('watch', () => {
    return gulp.watch('src/js/*.js', ['build']);
});

gulp.task('default', ['build', 'watch']);
