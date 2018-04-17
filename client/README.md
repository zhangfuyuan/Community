# Community
  
  基于 Ionic3 + Angular4 + Cordova 开发的智物业管理慧社区（毕业设计作品 仅安卓版）
  
  参考文献：
  
  [Ionic 官方文档](https://ionicframework.com/docs/)
  
  [ionic-preview-app github 源代码](https://github.com/ionic-team/ionic-preview-app/tree/master/src/pages)
  
  [ionic github 源代码](https://github.com/ionic-team/ionic/tree/master/src/components)
  
## 开发流程

1. 搭建项目：

```
  ionic start community tabs
  
  cd community
  
  ionic serve #在浏览器运行
  
  ionic build #在移动端浏览器运行
  
  ionic cordova platform add android #结合上一步打包android文件
  
  ionic cordova run android #在AVD/插USB真机上测试
  
  ionic cordova run android --livereload -c -s #记得插拔USB插头
 
  ionic cordova platform rm android #删除默认生成的平台
```

2. 利用 IonicPage 实现页面懒加载

  >（1）通过指令创建一个页面目录：
  
  ```
    ionic g page my-community
    
    ionic g page intel-property
    
    ionic g page personal-info
    
    ionic g page tabs
  ```
  
  >（2）重构 `tabs.html` ：
  
  ```
    <ion-tabs>
      <ion-tab [root]="tab1Root" tabTitle="我的社区" tabIcon="megaphone"></ion-tab>
      <ion-tab [root]="tab2Root" tabTitle="智慧物管" tabIcon="construct"></ion-tab>
      <ion-tab [root]="tab3Root" tabTitle="个人中心" tabIcon="person"></ion-tab>
    </ion-tabs>
  ```
  
  > * [在这里找相应的 icon](https://ionicframework.com/docs/ionicons/)
  >
  >（3）重构 `tabs.ts` ：
  
  ```
    ...
   
    @IonicPage({
      name: 'Tabs' //改这！
    })
    @Component({
      selector: 'page-tabs',
      templateUrl: 'tabs.html',
    })
    export class TabsPage {
    
      tab1Root = 'MyCommunity'; //改这！
      tab2Root = 'IntelProperty'; //改这！
      tab3Root = 'PersonalInfo'; //改这！
    
      constructor(public navCtrl: NavController, public navParams: NavParams) {
      }
    
      ionViewDidLoad() {
        console.log('ionViewDidLoad TabsPage');
      }
    
    }
  ```
  
  >（4）重构 `app.component.ts` ：
  
  ```
    import { Component } from '@angular/core';
    import { Platform } from 'ionic-angular';
    import { StatusBar } from '@ionic-native/status-bar';
    import { SplashScreen } from '@ionic-native/splash-screen';
    
    // todo: 删除 import { TabsPage } from '../pages/tabs/tabs';
    
    @Component({
      templateUrl: 'app.html'
    })
    export class MyApp {
      rootPage:any = 'Tabs'; //改这！
    
      constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
        platform.ready().then(() => {
          // Okay, so the platform is ready and our plugins are available.
          // Here you can do any higher level native things you might need.
          statusBar.styleDefault();
          splashScreen.hide();
        });
      }
    }
  ```
  
  >（5）重构 `app.module.ts` ：
  
  ```
    import { NgModule, ErrorHandler } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
    import { MyApp } from './app.component';
    
    // todo: 删除 import { AboutPage } from '../pages/about/about';
    // todo: 删除 import { ContactPage } from '../pages/contact/contact';
    // todo: 删除 import { HomePage } from '../pages/home/home';
    // todo: 删除 import { TabsPage } from '../pages/tabs/tabs';
    
    import { StatusBar } from '@ionic-native/status-bar';
    import { SplashScreen } from '@ionic-native/splash-screen';
    
    @NgModule({
      declarations: [
        MyApp,
        // todo: 删除 AboutPage,
        // todo: 删除 ContactPage,
        // todo: 删除 HomePage,
        // todo: 删除 TabsPage
      ],
      imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp)
      ],
      bootstrap: [IonicApp],
      entryComponents: [
        MyApp,
        // todo: 删除 AboutPage,
        // todo: 删除 ContactPage,
        // todo: 删除 HomePage,
        // todo: 删除 TabsPage
      ],
      providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
      ]
    })
    export class AppModule {}
  ```
  
  >（6）重构 `my-community.ts` 、`intel-property.ts`、`personal-info` ：
  
  ```
    ...
    
    @IonicPage({
      name: 'MyCommunity' //改成与 tabs.ts 文件中 tab*Root 的值一致
    })
    
    ...
  ```
  
  * 至此可运行 `ionic serve` 启动测试是否成功。
  
## 技术问题

### （一）仿饿了么屏幕滑动的顶部动画

1. 使用 `<ion-content (ionScroll)="scrollHandler($event)">` 添加滑动监听事件

* 参考[《angular4 滚动事件》](https://blog.csdn.net/mrfano/article/details/76147021)

2. 使用[Angular Renderer (渲染器)](https://segmentfault.com/a/1190000010326100)操控DOM元素

```
  ...
  <div class="info" #info>
  
  ...
  import { Component, ElementRef, ViewChild, Renderer } from '@angular/core';
  import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
  
  ...
  @ViewChild('info') infoBox: ElementRef;
  
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public app: App,
              private elementRef: ElementRef,
              private renderer: Renderer) {
  }
  
  ...
  scrollHandler(e) {
    let $contentEl = document.querySelector('#personalCont').querySelector('.scroll-content'),
      $infoEl = this.infoBox.nativeElement;

    this.renderer.setElementStyle($infoEl, 'height', `${(-e.scrollTop+114).toFixed(2)}px`);
    this.renderer.setElementStyle($infoEl, 'transform', `scale(${(1-e.scrollTop/114).toFixed(2)})`);
    $contentEl.setAttribute('style', `margin-top: ${(-e.scrollTop+170).toFixed(2)}px;margin-bottom: 56px;`);

    // 加入以下判断是为了用户过快滑动以致浏览器计算失真
    if (e.scrollTop > 114) {
      this.renderer.setElementStyle($infoEl, 'height', `0px`);
      this.renderer.setElementStyle($infoEl, 'transform', `scale(0)`);
      $contentEl.setAttribute('style', 'margin-top: 56px;margin-bottom: 56px;');
    }
  }
```

* 特别注意：`$contentEl.style.marginTop = '56px';` angular不支持DOM元素的 `style` 属性操作，建议使用 `setAttribute('style', '');`

3. 为了让动画过渡流畅，有缓动感，使用css3新特性 `transition`

```
  #personalCont>.scroll-content {
    transition: margin-top .5s ease-out;
  }

  .info {
    transition: height .5s ease-out, transform .5s ease-out;
    overflow: hidden;
  }
```

4. 使用去抖/节流减少滑动事件的计算

```
  debounce (fn, delay) {
    let timer = null

    return function (...args) {
      if (timer) {
        clearTimeout(timer)
      }

      timer = setTimeout(() => {
        fn.apply(this, args)
      }, delay)
    }
  }
```

### （二）通过ionic创建的父子组件建议使用 Events 实现双向通信

1. 父组件：引入 Events 模块 -> 订阅自定义事件 -> 在回调函数参数中获取传递的数据

```
  ...
  import { IonicPage, NavController, NavParams, PopoverController, Events } from 'ionic-angular';
  
  ...
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private popoverCtrl: PopoverController,
              public events: Events) {
    
    events.subscribe('b1-filter', (data, time) => {
      console.log(data, 'at', time);
    });
  }
    
  ....
```

2. 子组件：引入 Events 模块 -> 设置合理的事件处理函数 -> 发布自定义事件，并在参数中获取传递的数据

```
  ...
  import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
  
  ...
  
  changeFontFamily() {
    if (!this.value) return;

    this.events.publish('b1-filter', this.value, Date.now());
  }
    
  ...
```

3. 优化：如果非长活动页面，由于每次进入激活此页面均订阅此事件，导致叠加触发事件处理函数，因此需解绑

```
  // 父组件
  ngOnDestroy() {
    this.events.unsubscribe('b1-filter');
  }
```

* 注意：`app` + `tabs` 等入口和第一级页面为长活动页面，`constructor` 内订阅往往只会一次，而其他二、三级和子组件则每次激活均订阅

### （三）Angular 清除定时器的生命钩子

```
  ngOnDestroy(){
    clearInterval(this.timer);
  }
```

### （四）无法不用 ElementRef, ViewChild 捕获元素的解决方法

* 方法一：加上一个“虚拟”的标签 `<ng-container>`（会渲染）或 `<ng-template>`（不会渲染）

* 方法二：添加读取参数：`@ViewChild('username', { read: ElementRef }) usernameInput: ElementRef;`

### （五）通过全局登录状态实现跳转拦截【服务端API已写好】

1. 引入 `HTTP` 请求模块
  
  >（1）在 `app.module.ts` 文件导入 `HttpModule` 并注入模块：
  
  ```
    import { HttpModule } from '@angular/http'; //改这！
      
    ...
    
    @NgModule({
      declarations: [
        MyApp
      ],
      imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        HttpModule //改这！
      ],
      bootstrap: [IonicApp],
      entryComponents: [
        MyApp
      ],
      providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
      ]
    })
    export class AppModule {}
  ```
  
  >（2）在需要http请求的 `app.component.ts` 入口文件处理逻辑： 
  
  ```
    // 注意此处导入的是 Http 和结果集 Response
    import { Http, Response } from '@angular/http';
    
    ...
    
    // 注入构造器
    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private http: Http, private global: GlobalDataProvider) {
      platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        statusBar.styleDefault();
        splashScreen.hide();
  
        this.checkToken();
      });
    }
    
    // 在需要的方法里调用，此时仍未解决跨域问题
    checkToken() {
      this.http.post('/api/users/checkToken', {...}).subscribe((response: Response) => {
        let res = response.json();
  
        if (res.status === 200) {
          // todo
        } else {
          // todo
        }
      });
    }
  ```
  
2. 利用（正向）代理解决跨域问题——打开 `ionic.config.json` 文件，添加 `proxies` 代理配置字段： ：

  ```
    {
      "name": "master",
      "app_id": "3aad9716",
      "type": "ionic-angular",
      "integrations": {
        "cordova": {}
      },
     // 添加这！记得删除此行！！
      "proxies": [
        {
          "path": "/api",
          "proxyUrl": "http://localhost:3000"
        }
      ]
     // 至此！记得删除此行！！
    }
  ```
  
* 正确调用姿势：`this.http.get('/api/users/checkToken', { params:{...} })...` ，记得重启项目

* 注意： `get` 方式下传参在第二个对象参数的 `params` 属性值中, `post` 方式下传参在第二个对象参数

3. 通过 `provider` 提供全局变量服务 

  >（1）通过以下指令创建 `provider` 管理全局声明：
  
  ```
    ionic g provider GlobalData
  ```
  
  >（2）删除 `HttpClient` 模块重整如下：
  
  ```
    import { Injectable } from '@angular/core';
    
    @Injectable()
    export class GlobalDataProvider {
    
      private _userInfo = null;
      
      constructor() {
        
      }
    
      get userInfo() {
        return this._userInfo;
      }
    
      set userInfo(value) {
        this._userInfo = value;
      }
    }
  ```
  
  >（3）在需要http请求的 `app.component.ts` 入口文件处理逻辑： 

  ```
    // 按文件的相对路径引入模块
    import { GlobalDataProvider } from './../../providers/global-data/global-data';
    
    ...
    
    // 全局变量模块需要注入
    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private http: Http, private global: GlobalDataProvider) {
      ...
    }
    
    ...
    // 赋值 或 取值
    if (res.status === 200) {
      this.global.userInfo = res.data;
    } else {
      console.log(res.message);
      this.global.userInfo = null;
    }
  ```
  
### （六）本地存储 Storage 节约内存问题

* 对于没有新数据插入更改的话，通过判断减少 `set()` 方法的调用，否则没有新数据每次均会浪费3kb内存：

```
  if (newMsgItems.length > 0) {
    newMsgItems.map((item)=>{
      newMsgObj = item;
      newMsgObj['isRead'] = false;
      msgItems.push(newMsgObj);
    });
    this.storage.set('msgItems', JSON.stringify(msgItems));
  }
```

### （七）时间格式化

* 建议在 `app.component.ts` 入口文件引入：

```
  Date.prototype['format'] = function(fmt) {
    let o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
    };
    
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    
    for (let k in o)
      if (new RegExp("(" + k + ")").test(fmt)) 
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    
    return fmt;
  }
```

* `TS` 注意点：
  
  > * 给对象添加新属性不能直接 `.` 赋值，建议使用 `obj['新属性名']` 赋值
  > * 同理，调用 `new Date()['format']('yyyy-MM-dd hh:mm:ss.S qqq')`


