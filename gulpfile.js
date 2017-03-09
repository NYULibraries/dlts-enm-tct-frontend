var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    del = require('del'),
    es = require('event-stream'),
    bowerFiles = require('main-bower-files'),
    print = require('gulp-print'),
    Q = require('q'),
    streamqueue = require('streamqueue'),
    path = require('path');
j
var paths = {
  scripts: 'src/**/*.js',
  styles: 'src/**/*.css',
  index: 'src/index.html',
  distDev:'./dist.dev',
  distProd: './dist.prod',
  templates: 'src/**/*.html',
  scriptsDevServer: 'devServer/**/*.js',
  fonts: 'bower_components/font-awesome/fonts/*.*',
  images: get_config_replacements('img','src/**/*.png'),
};

var pipes = {};


// Move images from sources
pipes.moveImagesDev = function () {
  return gulp.src(paths.images)
    .pipe(gulp.dest(paths.distDev));
};


// Move fonts from sources
pipes.moveImagesProd = function () {
  return gulp.src(paths.images)
    .pipe(gulp.dest(paths.distProd));
};


// Move fonts from sources
pipes.movefontsDev = function () {
  return gulp.src([paths.fonts])
    .pipe(gulp.dest(paths.distDev + '/fonts'));
};

// Move fonts from sources
pipes.movefontsProd = function () {
  return gulp.src([paths.fonts])
    .pipe(gulp.dest(paths.distProd + '/fonts'));
};


// Use gulp-angular-filesort to load files in the proper order
pipes.orderedVendorScripts = function() {
    return plugins.order(['jquery.js', 'angular.js']);
};

pipes.orderedAppScripts = function() {
    return plugins.angularFilesort();
};

pipes.minifiedFileName = function() {
    return plugins.rename(function (path) {
        path.extname = '.min' + path.extname;
    });
};

pipes.validatedAppScripts = function() {
    return gulp.src(paths.scripts)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
};

pipes.builtAppScriptsDev = function() {
    return pipes.validatedAppScripts()
        .pipe(gulp.dest(paths.distDev));
};

pipes.builtAppScriptsProd = function() {
    var scriptedPartials = pipes.scriptedPartials();
    var validatedAppScripts = pipes.validatedAppScripts();

    return streamqueue({ objectMode: true },scriptedPartials,validatedAppScripts)
        .pipe(pipes.orderedAppScripts())
        .pipe(plugins.sourcemaps.init())
            .pipe(plugins.concat('app.min.js'))
            .pipe(plugins.uglify().on('error',plugins.util.log))
        .pipe(plugins.sourcemaps.write('maps'))
        .pipe(gulp.dest(paths.distProd));
};

pipes.builtVendorScriptsDev = function() {
    return gulp.src(bowerFiles({
            filter: /\.js/
        }))
        .pipe(gulp.dest(paths.distDev + '/bower_components'));
};


pipes.builtVendorScriptsProd = function() {
    return gulp.src(bowerFiles({
            filter: /\.js/,
        }))
        .pipe(pipes.orderedVendorScripts())
        .pipe(plugins.concat('vendor.min.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(paths.distProd));
};

pipes.validatedPartials = function() {
    return gulp.src(paths.templates.concat(['!src/index.html']))
        .pipe(plugins.htmlhint({'doctype-first': false}))
        .pipe(plugins.htmlhint.reporter());
};

pipes.builtPartialsDev = function() {
    return pipes.validatedPartials()
        .pipe(gulp.dest(paths.distDev));
};

pipes.scriptedPartials = function() {
    return pipes.validatedPartials()
        .pipe(plugins.htmlhint.failReporter())
        .pipe(plugins.htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(plugins.ngHtml2js({
            moduleName: "editorial",
        }));
};

pipes.builtVendorStylesDev = function() {
  var filter = config['removeBootstrap'] ? /awesome\.less|\.css/ : /\.less|\.css/;
  
  return gulp.src(bowerFiles({filter: filter}))
    .pipe(plugins.less())
    .pipe(gulp.dest(paths.distDev + '/css'));
};

pipes.builtVendorStylesProd = function() {
  var filter = config['removeBootstrap'] ? /awesome\.less|\.css/ : /\.less|\.css/;

  return gulp.src(bowerFiles({filter: filter}))
    .pipe(plugins.sourcemaps.init())
      .pipe(plugins.less())
      .pipe(plugins.minifyCss())
      .pipe(pipes.minifiedFileName())
    .pipe(plugins.sourcemaps.write('maps'))
    .pipe(gulp.dest(paths.distProd + '/css'));
};

pipes.builtStylesDev = function() {
    return gulp.src(paths.styles)
        .pipe(gulp.dest(paths.distDev));
};

pipes.builtStylesProd = function() {
    return gulp.src(paths.styles)
        .pipe(plugins.sourcemaps.init())
            .pipe(plugins.minifyCss())
            .pipe(pipes.minifiedFileName())
        .pipe(plugins.sourcemaps.write('/maps'))
        .pipe(gulp.dest(paths.distProd));
};

pipes.validatedIndex = function() {
    return gulp.src(paths.index)
        .pipe(plugins.htmlhint())
        .pipe(plugins.htmlhint.reporter());
};

pipes.builtIndexDev = function() {

    var orderedVendorScripts = pipes.builtVendorScriptsDev()
        .pipe(pipes.orderedVendorScripts());

    var orderedAppScripts = pipes.builtAppScriptsDev()
        .pipe(pipes.orderedAppScripts());

    var appStyles = pipes.builtStylesDev();

    var vendorStyles = pipes.builtVendorStylesDev();

    return pipes.validatedIndex()
        .pipe(gulp.dest(paths.distDev)) // write first to get relative path for inject
        .pipe(plugins.inject(orderedVendorScripts, {relative: true, name: 'bower'}))
        .pipe(plugins.inject(orderedAppScripts, {relative: true}))
        .pipe(plugins.inject(vendorStyles, {relative: true, name: 'bower'}))
        .pipe(plugins.inject(appStyles, {relative: true}))
        .pipe(gulp.dest(paths.distDev));
};

pipes.builtIndexProd = function() {

    var vendorScripts = pipes.builtVendorScriptsProd();
    var appScripts = pipes.builtAppScriptsProd();
    var appStyles = pipes.builtStylesProd();
    var vendorStyles = pipes.builtVendorStylesProd();

    return pipes.validatedIndex()
        .pipe(gulp.dest(paths.distProd)) // write first to get relative path for inject
        .pipe(plugins.inject(vendorScripts, {relative: true, name: 'bower'}))
        .pipe(plugins.inject(appScripts, {relative: true}))
        .pipe(plugins.inject(vendorStyles, {relative: true, name: 'bower'}))
        .pipe(plugins.inject(appStyles, {relative: true}))
        .pipe(plugins.htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(gulp.dest(paths.distProd));
};

pipes.builtAppDev = function() {
    pipes.movefontsDev();
    pipes.moveImagesDev();
    return es.merge(pipes.builtIndexDev(), pipes.builtPartialsDev());
};

pipes.builtAppProd = function() {
    pipes.movefontsProd();
    pipes.moveImagesProd();
    return pipes.builtIndexProd();
};

// removes all compiled dev files
gulp.task('clean-dev', function() {
  return del(paths.distDev);
});

// removes all compiled production files
gulp.task('clean-prod', function() {
    return del(paths.distProd);
});


pipes.validatedDevServerScripts = function() {
    return gulp.src(paths.scriptsDevServer)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
};

// checks html source files for syntax errors
gulp.task('validate-partials', pipes.validatedPartials);

// checks index.html for syntax errors
gulp.task('validate-index', pipes.validatedIndex);

// moves html source files into the dev environment
gulp.task('build-partials-dev', pipes.builtPartialsDev);

// converts partials to javascript using html2js
gulp.task('convert-partials-to-js', pipes.scriptedPartials);

// runs jshint on the dev server scripts
gulp.task('validate-devserver-scripts', pipes.validatedDevServerScripts);

// runs jshint on the app scripts
gulp.task('validate-app-scripts', pipes.validatedAppScripts);

// moves app scripts into the dev environment
gulp.task('build-app-scripts-dev', pipes.builtAppScriptsDev);

// concatenates, uglifies, and moves app scripts and partials into the prod environment
gulp.task('build-app-scripts-prod', pipes.builtAppScriptsProd);

// compiles app sass and moves to the dev environment
gulp.task('build-styles-dev', pipes.builtStylesDev);

// compiles and minifies app sass to css and moves to the prod environment
gulp.task('build-styles-prod', pipes.builtStylesProd);

// compiles bootstrap less and saves to dev environment
gulp.task('build-vendor-styles-dev',pipes.builtVendorStylesDev);

// compiles bootstrap and minifies less and saves to the prod environment
gulp.task('build-vendor-styles-prod',pipes.builtVendorStylesProd);

// moves vendor scripts into the dev environment
gulp.task('build-vendor-scripts-dev', pipes.builtVendorScriptsDev);

// concatenates, uglifies, and moves vendor scripts into the prod environment
gulp.task('build-vendor-scripts-prod', pipes.builtVendorScriptsProd);

// validates and injects sources into index.html and moves it to the dev environment
gulp.task('build-index-dev', pipes.builtIndexDev);

// validates and injects sources into index.html, minifies and moves it to the dev environment
gulp.task('build-index-prod', pipes.builtIndexProd);

// builds a complete dev environment
gulp.task('build-app-dev', pipes.builtAppDev);

// builds a complete prod environment
gulp.task('build-app-prod', pipes.builtAppProd);

// cleans and builds a complete dev environment
gulp.task('clean-build-app-dev', ['clean-dev'], pipes.builtAppDev);

// cleans and builds a complete prod environment
gulp.task('clean-build-app-prod', ['clean-prod'], pipes.builtAppProd);

// clean, build, and watch live changes to the dev environment
gulp.task('watch-dev', ['clean-build-app-dev'], function() {

    // start nodemon to auto-reload the dev server
    plugins.nodemon({ 
          script: 'server.js', 
          ext: 'js', 
          watch: ['devServer/'], 
          env: {NODE_ENV : 'development',
                NODE_DIR: argv.config ? 'builds/output/' + argv.config + '/' : ''} 
        })
        .on('change', ['jshint-devserver'])
        .on('restart', function () {
            console.log('[nodemon] restarted dev server');
        });

    // start live-reload server
    plugins.livereload.listen({ start: true, port: 35729, host: '127.0.0.1' });

    // watch index
    gulp.watch(paths.index, function() {
        return pipes.builtIndexDev()
            .pipe(plugins.livereload());
    });

    // watch app scripts
    gulp.watch(paths.scripts, function() {
        return pipes.builtAppScriptsDev()
            .pipe(plugins.livereload());
    });

    // watch html partials
    gulp.watch(paths.templates, function() {
        return pipes.builtPartialsDev()
            .pipe(plugins.livereload());
    });

    // watch styles
    gulp.watch(paths.styles, function() {
        return pipes.builtStylesDev()
            .pipe(plugins.livereload());
    });

});


// clean, build, and watch live changes to the prod environment
gulp.task('watch-prod', ['clean-build-app-prod', 'validate-devserver-scripts'], function() {

    // start nodemon to auto-reload the dev server
    plugins.nodemon({ 
          script: 'server.js', 
          ext: 'js', 
          watch: ['devServer/'], 
          env: {NODE_ENV : 'production',
                NODE_DIR: argv.config ? 'builds/output/' + argv.config + '/' : ''} 
        })
        .on('change', ['validate-devserver-scripts'])
        .on('restart', function () {
            console.log('[nodemon] restarted dev server');
        });

    // start live-reload server
    plugins.livereload.listen({ start: true, port: 35729, host: '127.0.0.1' });

    // watch index
    gulp.watch(paths.index, function() {
        return pipes.builtIndexProd()
            .pipe(plugins.livereload());
    });

    // watch app scripts
    gulp.watch(paths.scripts, function() {
        return pipes.builtAppScriptsProd()
            .pipe(plugins.livereload());
    });

    // watch html partials
    gulp.watch(paths.templates, function() {
        return pipes.builtAppScriptsProd()
            .pipe(plugins.livereload());
    });

    // watch styles
    gulp.watch(paths.styles, function() {
        return pipes.builtStylesProd()
            .pipe(plugins.livereload());
    });

});
