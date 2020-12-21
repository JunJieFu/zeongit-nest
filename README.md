
# Zeongit

  为什么叫Zeongit呢？首先呢是域名便宜，其次是作者的名字粤语拼音就是zeongit，所以就决定用这个作为项目名字了。
  
  这个项目是干什么的呢？其实这个项目就是用Nestjs整合了[zeongit share](https://github.com/JunJieFu/zeongit-share) 、[zeongit account](https://github.com/JunJieFu/zeongit-account) 、[zeongit beauty](https://github.com/JunJieFu/zeongit-beauty)
  
  为什么要用nestjs整合三个项目呢？都是因为穷，首先作者没有多余资金去支撑服务器的支出，所以所有服务都运行在一个2核2G的服务器上，包括Redis、MySQL、ElasticSearch、JVM，并且JVM占用内存对于作者来说有点吃不消。所以就想着用内存占用较少的Nodejs来完成，最终选用的是Nestjs框架。
  
  Kotlin Vs Typescript
  你说我愿不愿意用Typescript去移植，一开始我是不愿意的，因为作为语言，Kotlin比Typescript更加严谨，语法糖更加多，代码量比Typescript更少。作为框架，SpringBoot比Nestjs更加成熟。但是没有绝对的完美，运行SpringBoot的内存远超出运行Nestjs的内存，所以想到我那2核2G的服务器，不得不作出这个改变，理想永远都不能脱离现实。  
    
## 项目结构  
### share
共享模块，即对Nestjs的再度自定义的封装，该自定义封装模块可以移植到任意Nestjs项目使用。
### data
数据模块，MySQL、ElasticSearch实体模块，具体是为其他项目提供数据源。 
### auth
授权模块，该模块对带有指定校验装饰器的的接口进行授权校验，也具有生成JWT等功能。
### account
账号模块，Web启动模块，主要暴露登录注册等与账号操作有关的接口。
### qiniu
七牛模块，类似于数据模块，主要提供七牛数据操作功能模块。
### beauty
模仿Pixiv的主体模块，主要提供图片预览，收藏等功能接口功能。
### beauty-admin
模仿Pixiv的管理模块，现阶段主要是对采集Pixiv的一系列操作

## 采集流程
![process](https://github.com/JunJieFu/zeongit-nest/tree/master/doc/beauty-admin-process.jpg)
采集流程可以作很多机械操作，但是现在没有精力去弄自动化采集。

## 快速链接  
官网：[Zeongit Beauty](http://beauty.zeongit.cn)  

## 相关应用
[Zeongit Beauty](http://beauty.zeongit.cn/)
  
## 技术栈  
 - Typescript
 - Nestjs
 - Mysql 
 - Redis  
 - Elasticsearch  
  

  
## 前端网站提供
[zeongit-beauty-web](https://github.com/JunJieFu/zeongit-beauty-web) 分支为nest则为Nestjs项目下的项目

## 构建  
``` bash  
$ npm run start:build
  
$ npm run start:prod
```  

#### 开源协议  
[MIT](https://opensource.org/licenses/MIT)
