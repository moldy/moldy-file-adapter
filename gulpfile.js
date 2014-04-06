var gulp = require( 'gulp' ),
	shell = require( 'gulp-shell' );

var pkg = require( './package.json' );

gulp.task( 'test', function () {
	return gulp.src( '' ).pipe( shell( [ 'npm test' ] ) );
} );

gulp.task( 'watch', function () {
	gulp.watch( [ './src/**/*.js' ], [ 'scripts', 'test' ] );
	gulp.watch( [ './test/**/*' ], [ 'test' ] );
	gulp.watch( [ '*.js' ], [ 'default' ] );
} );

gulp.task( 'default', [ 'test', ] );
gulp.task( 'run', [ 'test', 'watch' ] );