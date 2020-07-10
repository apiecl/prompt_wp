import { src, dest, watch, series, parallel } from 'gulp';
import yargs from 'yargs';
import sass from 'gulp-sass';
import less from 'gulp-less';
import cleanCss from 'gulp-clean-css';
import gulpif from 'gulp-if';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import concat from 'gulp-concat';
import terser from 'gulp-terser';

const PRODUCTION = yargs.argv.prod;

export const styles = () => {
  return src('sass/style.scss')
   .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulpif(PRODUCTION, postcss([ autoprefixer ])))
    .pipe(gulpif(PRODUCTION, cleanCss({compatibility:'*'})))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
    .pipe(dest('.'))
    .pipe(server.stream());
}

export const timelineStyles = () => {
  return src('less/TL.Timeline.less')
    .pipe(less())
    .pipe(dest('.'))
    .pipe(server.stream());
}

export const watchForChanges = () => {
  watch('sass/**/*.scss', styles);
  watch('**/*.php', styles, reload);
  watch('less/**/*.less', timelineStyles);
  watch('js/*.js', bundleJS);
}

export const bundleJS = () => {
  return src(['js/jquery-3.5.1.min.js', 
              'js/audio_vis.js', 
              'js/popper.min.js', 
              'js/bootstrap.min.js', 
              'js/dragscroll.js', 
              'js/imagesloaded.pkgd.min.js', 
              'js/in-view.min.js',
              'js/isotope.pkgd.min.js',
              'js/jquery.overlayScrollbars.min.js',
              'js/lazyload.js',
              'js/masonry.pkgd.min.js',
              'js/navigation.js',
              'js/skip-link-focus-fix.js',
              'js/ua-parser.min.js',
              'js/timeline.js',
              'js/bitacora-functions.js',
              'js/bitacora-texto-dramatico.js',
              'js/bitacora.js'
               ])
          .pipe(concat('bitacoraBundle.js'))
          .pipe(terser())
          .pipe(dest('dist'))
}

const server = browserSync.create();

export const serve = done => {
	server.init({
		proxy: "http://bitacora.local"
	});
	done();
}

export const reload = done => {
	server.reload();
	done();
}

export const dev = series( styles, timelineStyles, serve, watchForChanges )
export const build = series( styles, timelineStyles, bundleJS )
export default dev;