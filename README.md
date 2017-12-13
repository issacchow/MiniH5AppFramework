# 这是一个迷你H5应用框架



如果您不想用Vue.JS、ReactJS、AngularJS就可以实现:


* 1.路由功能
* 2.模块分离
* 3.控制器与视图分离
* 4.数据与HTML分离(模板引擎)

每个模块就像 Spring MVC里的Controller一样负责以下工作:

* 1.渲染页面
* 2.处理请求


#### 最终实现效果:


用户感觉是在同一个页面文件上局部刷新内容

每个模块都可以通过 URL地址 #号 后的参数来改变不同状态。

例如:


```
/app.html#/login  表示加载用户 登陆模块
```

```
/app.html#/showNews?news=10086 表示加载新闻消息详细内容模块
```

加载模块示例:
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
											               }
												           );
													       
													       </pre>

