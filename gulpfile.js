var gulp = require("gulp");
var browserSync = require("browser-sync");
var reload = browserSync.reload;

//处理less
var less = require("gulp-less");
var path = require("path");

//压缩js
var uglify = require('gulp-uglify');

//清空文件夹
var del = require("del");

//上传ftp
var gutil = require('gulp-util');
var ftp = require("gulp-ftp");

gulp.task("less",function(){
    gulp.src('./less/*.less')
        .pipe(
            less({
            paths: [path.join(__dirname,'less','includes')]
        }))
        .pipe(gulp.dest('./css'))
        .pipe(reload({ stream:true }));
});

//监听文件改动并重新载入
gulp.task('serve',['less'],function(){
    browserSync({
        server: {
            baseDir: './'
        }
    });
    gulp.watch('./less/*.less', ['less']);
    gulp.watch(['./views/*.html','./css/*.css','./js/*.js'],{cwd: "./"},reload);
});

//输出css
gulp.task('minify-css',function(){
    gulp.src('./css/*.css')
        .pipe(gulp.dest('output/css/'));
});

//输出html
gulp.task('minify-html',function(){
    gulp.src('./views/*.html')
        .pipe(gulp.dest('output/views/'));
});

//输出image
gulp.task('img',function(){
    gulp.src(['./images/*.jpg','./images/*.png'])
        .pipe(gulp.dest('output/images/'));
});

//压缩并输出js
gulp.task('minify-js',function(){
    gulp.src('./js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('output/js/'));
});

gulp.task('del',function(cb){
    del(['output/css','output/js','output/views','output/images'],cb);
    //del(['./output'],cb);
});

gulp.task('upload-ftp',function(){
    return gulp.src('./output/**')
        .pipe(
            ftp({
                host: '', //服务器地址
                port: "21", //服务器端口
                user: "", //ftp账户
                pass: "", //ftp账户密码
                remotePath: "/www/test" //对应服务器文件地址
            })
        )
        .pipe(gutil.noop());
})

gulp.task('build',['del','minify-css','minify-js','minify-html','img'],function(){
    gulp.start(['upload-ftp']);
    console.log("上传ftp成功");
})
gulp.task('default',['upload-ftp']);