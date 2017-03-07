// =============================================================================== DEPENDENCY

var gulp 		= require('gulp'),
	dest 		= require('gulp-dest'),
	debug 		= require('gulp-debug'),
	rename 		= require('gulp-rename'),
	del 		= require('del'),
	sass 		= require('gulp-sass'),
	sourcemaps 	= require('gulp-sourcemaps'),
	bulkSass 	= require('gulp-sass-bulk-import'),
	cleanCSS 	= require('gulp-clean-css'),
	concat 		= require('gulp-concat'),
	minify 		= require('gulp-minify'),
	uglify 		= require("gulp-uglify"),
	gutil 		= require('gulp-util'),
	vinylPaths 	= require('vinyl-paths');

// =============================================================================== PROJECT STRUCTURE

var app_root = "..",
	production_build 	= false,
	proj = {
		app_in			: app_root + "/source/app",
		app_out			: app_root + "/www/js",

		app_temp_in		: app_root + "/source/app/templates",
		app_temp_out	: app_root + "/www/page",

		app_sass_in		: app_root + "/source/scss/priscilla-framework",
		app_sass_out	: app_root + "/www/css",

		fonts_in		: app_root + "/source/scss/priscilla-framework/fonts",
		fonts_out		: app_root + "/www/fonts",

		angular_in		: app_root + "/source/vendor/angular",
		angular_out		: app_root + "/www/js",

		ionic_in 		: app_root + "/source/vendor/ionic",
		ionic_out 		: app_root + "/www/js",

		ionic_sass_in	: app_root + "/source/scss/ionic-framework/scss",
		ionic_sass_out	: app_root + "/www/css",

		ionic_fonts_in	: app_root + "/source/scss/ionic-framework/fonts",
		ionic_fonts_out	: app_root + "/www/fonts"
	};

// =============================================================================== TASKS

gulp.task("clear_fonts", [], function() {
	return del([
			  proj.fonts_out + "/**",
		"!" + proj.fonts_out + "/fonts/"
	], { force: true } );
});

gulp.task("copy_app_templates", [], function() {
	gulp.src( proj.app_temp_in + "/**/*" )
		.pipe( gulp.dest( proj.app_temp_out ) );

	gulp.src( proj.app_temp_in + "/**/*.htm" )
		.pipe( gulp.dest( proj.app_temp_out ) )
		.pipe( debug() );
});

gulp.task("copy_ionic_fonts", [], function() {
	gulp.src( proj.ionic_fonts_in + "/**/*.*" )
		.pipe( gulp.dest( proj.ionic_fonts_out ) )
		.pipe( debug() );
});

gulp.task('copy_app_fonts', [], function() {
	gulp.src( proj.app_fonts_in + "/**.*" )
		.pipe( gulp.dest( proj.app_fonts_out ) )
		.pipe( debug() );
});

gulp.task('ionic_sass', [], function() {
	var options = {
		outputStyle	: 'compressed',
		verbose 	: true
	}

	gulp.src( proj.ionic_sass_in + "/ionic.scss" )
		.pipe( bulkSass() )
		.pipe( sourcemaps.init() )
		.pipe( sass( options ).on('error', sass.logError) )
		.pipe( cleanCSS() )
		.pipe( sourcemaps.write('./') )
		.pipe( gulp.dest( proj.ionic_sass_out ));


	gulp.src( proj.ionic_sass_in + "/ionic-harris.scss" )
		.pipe( bulkSass() )
		.pipe( sourcemaps.init() )
		.pipe( sass( options ).on('error', sass.logError) )
		.pipe( cleanCSS() )
		.pipe( sourcemaps.write('./') )
		.pipe( gulp.dest( proj.ionic_sass_out ));

});

gulp.task('app_sass', [], function() {
	var options = {
		outputStyle	: 'compressed',
		verbose 	: true
	}

	gulp.src( proj.app_sass_in + "/styles.scss" )
		.pipe( bulkSass() )
		.pipe( sourcemaps.init() )
		.pipe( sass( options ).on('error', sass.logError) )
		.pipe( cleanCSS() )
		.pipe( sourcemaps.write('./') )
		.pipe( gulp.dest( proj.app_sass_out ));
});

gulp.task('harris_theme_sass', [], function() {
	var options = {
		outputStyle	: 'compressed',
		verbose 	: true
	}

	gulp.src( proj.app_sass_in + "/styles-harris.scss" )
		.pipe( bulkSass() )
		.pipe( sourcemaps.init() )
		.pipe( sass().on('error', sass.logError) )
		.pipe( cleanCSS() )
		.pipe( sourcemaps.write('./') )
		.pipe( gulp.dest( proj.app_sass_out ));
});

gulp.task('concat_angular', [], function() {
	gulp.src([
				  proj.angular + "/angular.js",
				  proj.angular + "/*.js",
				  proj.angular_ui + "/*.js",
			"!" + proj.angular + "/*.min.js",
			"!" + proj.angular_ui + "/*.min.js"
		])
		.pipe( debug() )
		.pipe( concat({ path: 'angular.bundle.js' }) )
		.pipe( gulp.dest( proj.angular_output ) );
});

gulp.task('concat_ionic', [], function() {
	gulp.src([
				  proj.ionic_js + "/ionic.js",
				  proj.ionic_js + "/ionic-angular.js",
				  proj.ionic_js + "/*.js",
			"!" + proj.ionic_js + "/*.min.js"
		])
		.pipe( debug() )
		.pipe( concat({ path: 'ionic.bundle.js' }) )
		.pipe( gulp.dest( proj.ionic_js_output ) );
});

gulp.task('concat_app', [], function() {
	gulp.src([
			proj.app_in + "/core/app.js",		// IMPORTANT !!!
			proj.app_in + "/core/config.js", 	// these two must go first

			proj.app_in + "/controllers/**/*.js",
			proj.app_in + "/directives/*.js",
			proj.app_in + "/filters/*.js",
			proj.app_in + "/services/*.js",
			proj.app_in + "/plugins/**/*.js"
		])
		.pipe( debug() )
		.pipe( concat({ path: 'priscilla-app.js' }) )
		.pipe( gulp.dest( proj.app_out ) );
});


gulp.task('default', function() {
	gulp.src([
			proj.app_sass_in + "/**/*.scss"
		])
		.pipe( debug() );

	// watch for changes inside font directory in Ionic & Priscilla framework
	gulp.watch([
			proj.ionic_fonts_in + "/**/*.*",
			proj.app_fonts_in + "/**/*.*"
		], ["clear_fonts", "copy_ionic_fonts", "copy_app_fonts"]);

	// watch angular js files and modules
	gulp.watch([
				  proj.angular_in + "/*.js",
			"!" + proj.angular_in + "/*.min.js"
		], ["concat_angular"]);

	// watch ionic js files
	gulp.watch([
				  proj.ionic_in + "/*.js",
			"!" + proj.ionic_in + "/*.min.js"
		], ["concat_ionic"]);


	// watch priscilla app files
	gulp.watch([
			proj.app_in + "/core/*.js",
			proj.app_in + "/controllers/**/*.js",
			proj.app_in + "/directives/*.js",
			proj.app_in + "/filters/*.js",
			proj.app_in + "/services/*.js",
			proj.app_in + "/plugins/**/*.js"
		], ["concat_app"]);

	// watch priscilla app templates
	gulp.watch([
			proj.app_temp_in + "/**/*.htm"
		], ["copy_app_templates"]);


	// watch ionic sass files
	gulp.watch([
			proj.ionic_sass_in + "/**/*.scss"
		], ["ionic_sass"]);

	// watch priscilla sass files
	gulp.watch([
			proj.app_sass_in + "/**/*.scss"
		], ["app_sass", "harris_theme_sass"]
	);

});
