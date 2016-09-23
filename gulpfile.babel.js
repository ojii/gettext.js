'use strict';

import fs from 'fs';
import gulp from 'gulp';
import eslint from 'gulp-eslint';
import tape from 'gulp-tape';
import {rollup} from 'rollup';
import babel from 'rollup-plugin-babel';
import uglify from 'uglify-js';

let cache;

gulp.task('rollup', () => {
    return rollup({
        entry: 'src/js/gettext.js',
        plugins: [
            babel({
                presets: ['es2015-rollup'],
                babelrc: false
            })
        ],
        useStrict: true,
        treeshake: true,
        cache: cache
    }).then(bundle => {
        return bundle.write({
            dest: 'dist/js/gettext.js',
            format: 'cjs',
            sourceMap: true,
            moduleName: 'gettext',
        }).then(() => {
            const result = uglify.minify('dist/js/gettext.js', {
                inSourceMap: 'dist/js/gettext.js.map',
                outSourceMap: 'dist/js/gettext.min.js.map',
            });
            fs.writeFileSync('dist/js/gettext.min.js', result.code);
            fs.writeFileSync('dist/js/gettext.min.js.map', result.map);
        });
    });
});

gulp.task('lint', () => {
    return gulp.src('src/js/gettext.js').pipe(
        eslint()
    ).pipe(
        eslint.format()
    ).pipe(
        eslint.failAfterError()
    )
});

gulp.task('build', ['lint', 'rollup']);

gulp.task('watch', () => {
    return gulp.watch('./src/js/**/*.js', ['build']);
});

gulp.task('test', () => {
    return gulp.src('src/js/tests.js').pipe(tape());
});

gulp.task('default', ['build', 'watch']);
