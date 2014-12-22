/**
 * Created by clint.milner on 12/21/14.
 */

var gulp = require( 'gulp' ),
    gutil = require( 'gulp-util' ),
    coffee = require( 'gulp-coffee' ),
    browserify = require( 'gulp-browserify' ),
    compass = require( 'gulp-compass' ),
    connect = require( 'gulp-connect' ),
    gulpIf = require( 'gulp-if' ),
    uglify = require( 'gulp-uglify' ),
    minifyHtml = require( 'gulp-minify-html' ),
    concat = require( 'gulp-concat' );

var env, htmlSources, jsonSources, coffeeSources, jsSources, sassSources, outputDir, sassStyle;

env = process.env.NODE_ENV || 'development';

if( env === 'development' )
{
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
}
else
{
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
}

htmlSources = [ outputDir + '*.html' ];
jsonSources = [ outputDir + 'js/*.json' ];

coffeeSources = [ 'components/coffee/tagline.coffee' ];
jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];
sassSources = [ 'components/sass/style.scss' ];

gulp.task( 'coffee', function(){
   gulp.src( coffeeSources )
       .pipe( coffee( { bare: true } )
           .on( 'error', gutil.log ) )
       .pipe( gulp.dest( 'components/scripts' )
   )
});

gulp.task( 'js', function(){
    gulp.src( jsSources )
        .pipe( concat( 'script.js' ) )
        .pipe( browserify() )
        .pipe( gulpIf( env === 'production', uglify() ))
        .pipe( gulp.dest( outputDir+ 'js' ) )
        .pipe( connect.reload() )
});

gulp.task( 'compass', function(){
    gulp.src( sassSources )
        .pipe( compass(
            {
                sass: 'components/sass',
                image: outputDir + 'images',
                style: sassStyle
            }
        ))
        .on( 'error', gutil.log )
        .pipe( gulp.dest( outputDir + 'css' ) )
        .pipe( connect.reload() )
});

gulp.task( 'json', function(){
    gulp.src( jsonSources )
        .pipe( connect.reload() )
});

gulp.task( 'html', function(){
    gulp.src( 'builds/development/*.html' )
        .pipe( gulpIf( env === 'production', minifyHtml() ) )
        .pipe( gulpIf( env === 'production', gulp.dest( outputDir ) ) )
        .pipe( connect.reload() )
});

gulp.task( 'watch', function(){
   gulp.watch( 'builds/development/*.html', [ 'html' ] );
   gulp.watch( jsonSources, [ 'json' ] );
   gulp.watch( coffeeSources, [ 'coffee' ] );
   gulp.watch( jsSources, [ 'js' ] );
   gulp.watch( 'components/sass/*.scss', [ 'compass' ] );
});

gulp.task( 'connect', function(){
   connect.server({
       root: outputDir,
       livereload: true
   })
});


gulp.task( 'default', [ 'html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch' ] );