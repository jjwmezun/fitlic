const JS_DEV = 'js';
const JS_SRC = JS_DEV + '/**/*.js';
const JS_CONCAT_DEV = 'jsconcat';
const JS_CONCAT_SRC = 'jsconcat/main.js';
const JS_PUB = '../js';

const SASS_DEV  = 'scss';
const SASS_SRC = SASS_DEV + '/main.scss';

const CSS_DEV  = 'css';
const CSS_PUB  = '../css';

const CSS_SRC  = CSS_DEV + '/main.css';

var gulp    = require( 'gulp'           );
var concat  = require( 'gulp-concat'    );
var uglify  = require( 'gulp-uglify'    );
var sass    = require( 'gulp-sass'      );
var cssnano = require( 'gulp-cssnano'   );

gulp.task
(
	'debug',
	function()
	{
		console.log( SASS_DEV );
	}
);

gulp.task
(
	'jsconcat',
	function()
	{
  		return gulp.src( JS_SRC )
    		.pipe( concat( 'main.js' ) )
    		.pipe( gulp.dest( JS_PUB ) );
	}
);

gulp.task
(
	'jsmin',
	function()
	{
		return gulp.src( JS_CONCAT_SRC )
			.pipe( uglify() )
			.pipe( gulp.dest( JS_PUB ) );
	}
);

gulp.task
(
	'sass',
	function()
	{
		return gulp.src( SASS_SRC )
			.pipe( sass() )
			.pipe( gulp.dest( CSS_DEV ) );
	}
);

gulp.task
(
	'cssmin',
	function()
	{
		return gulp.src( CSS_SRC )
			.pipe( cssnano() )
			.pipe( gulp.dest( CSS_PUB ) );
	}
);

gulp.task
(
	'watch',
	function()
	{
		gulp.watch( JS_SRC,  [ 'jsconcat' ] );
		//gulp.watch( JS_CONCAT_SRC,  [ 'jsmin' ] );
		gulp.watch( `${ SASS_DEV }/**/*.scss`, [ 'sass' ] );
		gulp.watch( CSS_SRC,  [ 'cssmin' ] );
	}
);