# 这是一个迷你H5应用框架

## 仅供学习与技术交流,如果有什么疑问,请加QQ:86508962



如果您不想用Vue.JS、ReactJS、AngularJS就可以实现:


* 1.路由功能 -- 使用Router.js路由器
* 2.模块分离
* 3.控制器与视图分离
* 4.数据与HTML分离(模板引擎) --使用腾讯模板引擎 artTemplate
* 5.支持浏览器后退前进 切换模块功能

每个模块 Module类 就像 Spring MVC里的Controller一样负责以下工作:

* 渲染页面  -- onRender事件
* 处理请求  -- onLoad事件


#### 最终实现效果:


用户感觉是在同一个页面文件上加载不同的模块，实际上是由很多个页面组成一个H5App功能。

每个模块都可以通过 URL地址 #号 后的参数来改变不同状态。

例如:


```
/app.html#/login  表示加载用户 登陆模块
```

```
/app.html#/showNews?news=10086 表示加载新闻消息详细内容模块
```


### 核心代码
#### App类单例

<pre>
app.regModule();     //注册新模块

app.getModule();     //可以通过模块来获取当前模块状态数据，例如: app.getModule('login').getData(); 但不建议使用该方法去破坏路由器本身降低耦合的本质。

app.goto('/login');  //重定向并加载另外一个模块

app.showLoading();   //显示loading效果

app.hideLoading();   //隐藏loading效果

app.showMsg("my name is:{0}","issac"); //显示提示消息

</pre>

#### Module类

定义了视图渲染 和 请求处理 两个功能；


> onRender - 渲染事件

只会执行一次。

需要进行事件绑定,完成渲染后调用 this.render方法，将jquery对象传给框架去处理


> onLoad - 模块加载事件

通过app.goto方法会触发该事件

参数request: 为Router.js 的类, 常用方法为request.get('xxx','defaultValue');

参数this: 表示当前模块类型,有以下属性:

    this.render - 用于onRender事件中,完成渲染对象后调用

	this.$view 当前已渲染好的视图jquery对象

	this.XXXX 注册模块时所定义的自定义属性，例如this.myMethod






### 加载模块:

<pre>
require([
"module/demoModule",
"module/loginModule",
"module/selectCityModule"
 ],

 function(){
 $(function () {
//默认加载登陆模块
       app.goto("/login");
   });
});
								       
</pre>


### 定义模块:

<pre>
$(function () {
    //定义一个名为demo的模块
    app.regModule('demo', {
        //视图配置
        view: {
            //视图文件路径
            url: 'view/demo.html'
        },


        //自定义函数
        myMethod : function($view){
             
             //初始化事件
             $view.click(function(){
                alert('view click');
             });

        },

        
        //渲染视图过程
        //html变量为view配置所对应的html代码
        //需要进行一系列的操作，如:
        //样式设定、事件绑定、模板数据绑定
        onRender: function (html) {
         
            //引用当前对象，避免在异步中用this 失效
            var me = this;

            //异步加载数据并初始化事件
            //模拟异步请求回调
            var post = function(url,callback){
                setTimeout(callback,500);
            };
            //请求数据并执行模板
            post('/getData',function(data){
                var data = {
                    name : 'John',
                    age : 22
                };

                html = template.render(html, data);
               
                //初始化事件
                var $view = $(html);
                me.myMethod($view);
                me.render($view);//必须调用
            });
        },
        
        //路由器调用 或其他模块调用
        //通过传递不同的参数让当前模块展现不同的状态
        onLoad : function(request,params){
            //获取参数
            //例如当路由到 app.html#/demo?name=issac
            //那么name 则为issac,如果name参数为xxx
            var name = request.get('name',"xxx");
            log('load test');

        }


    });

});
</pre>

