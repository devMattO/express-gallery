const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], () => {
  browserSync.init({
    proxy: 'localhost:3000',
      // server: "./public"
  });

  gulp.watch('sass/styles.scss', ['sass']);
  gulp.watch('public/*.html').on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', () =>
  gulp.src('sass/styles.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream())
);

gulp.task('default', ['serve']);
