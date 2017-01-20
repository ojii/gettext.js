'use strict';

import fs from 'fs';
import gulp from 'gulp';
import eslint from 'gulp-eslint';
import tape from 'gulp-tape';
import {rollup} from 'rollup';
import babel from 'rollup-plugin-babel';
import uglify from 'uglify-js';

let cache;

function write_bundle(bundle, path, format) {
    const paths = {
        dest: `${path}/gettext.${format}.js`,
        dest_map: `${path}/gettext.${format}.js.map`,
        min: `${path}/gettext.${format}.min.js`,
        min_map: `${path}/gettext.${format}.min.js.map`
    };
    return bundle.write({
        dest: paths.dest,
        format: format,
        sourceMap: true,
        moduleName: 'gettext'
    }).then(() => {
        const result = uglify.minify(paths.dest, {
            inSourceMap: paths.dest_map,
            outSourceMap: paths.min_map
        });
        fs.writeFileSync(paths.min, result.code);
        fs.writeFileSync(paths.min_map, result.map);
    });
}

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
        return write_bundle(bundle, 'dist/node/', 'cjs').then(() => {
            return write_bundle(bundle, 'dist/browser/', 'iife');
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
    );
});

gulp.task('build', ['lint', 'rollup']);

gulp.task('watch', () => {
    return gulp.watch('./src/js/**/*.js', ['build']);
});

gulp.task('test', () => {
    return gulp.src('src/js/tests.js').pipe(tape());
});

gulp.task('default', ['lint', 'build', 'watch']);
