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
import uglify from 'gulp-uglify';

const PRODUCTION = yargs.argv.prod;

export const styles = () => {
  return src('sass/style.scss')
   .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(PRODUCTION, postcss([ autoprefixer ])))
    .pipe(gulpif(PRODUCTION, cleanCss({compatibility:'ie8'})))
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
  return src(['js/*.js'])
          .pipe(concat('bitacora.js'))
          //.pipe(uglify())
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