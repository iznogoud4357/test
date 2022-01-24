
var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var cleancss = require('gulp-clean-css');
var browsersync = require('browser-sync').create();

var config = {
    paths:{
        less: './assets/css/*.less', // путь к файлам less
        html: '/index.html' // путь к index.html
    },
    output:{
        cssname: 'styles.css', // все файлы less, данного проекта, сохраняем в один файл rezstyle.css
        path: './assets/css' // путь к файлу css
    }
};

gulp.task('less', function(){
    // получаем все файлы less, инициализируем sourcemaps, компилируем less в css, объединение всех less в rezstyle.css, добавление автопрефиксов, минификация css, куда сохранять результат, синхронизация

    return gulp.src(config.paths.less).pipe(sourcemaps.init()).pipe(less()).pipe(concat(config.output.cssname)).pipe(autoprefixer()).pipe(cleancss()).pipe(sourcemaps.write()).pipe(gulp.dest(config.output.path)).pipe(browsersync.stream());
});

gulp.task('serve', function(){
    browsersync.init({
        server: {
            basedir: config.output.path
        }
    });

    // смотреть за файлами всеми less
    gulp.watch(config.paths.less, ['less']);

    gulp.watch(config.paths.html).on('change', browsersync.reload);
});

// запуск функций less и serve
gulp.task('default', ['less', 'serve']);

gulp.task('img', function() {
    return gulp.src('assets/img/**/*') // Берем все изображения из app
        .pipe(cache(imagemin({ // С кешированием
            // .pipe(imagemin({ // Сжимаем изображения без кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))/**/)
        .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});
gulp.task('prebuild', async function() {

    var buildCss = gulp.src([ // Переносим библиотеки в продакшен
        'app/css/styles.css'
    ])
        .pipe(gulp.dest('dist/css'))

    var buildHtml = gulp.src('index.html') // Переносим HTML в продакшен
        .pipe(gulp.dest('dist'));

});
