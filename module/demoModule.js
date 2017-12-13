$(function () {




    app.regModule('demo', {

        view: {
            url: 'view/demo.html'
        },

        
        //自定义函数
        myMethod : function($view){
             
             //初始化事件
             $view.click(function(){
                alert('view click');
             });

        },

        //加载视图,只加载一次
        //初始化当前模块事件
        onLoadView: function (html) {
          
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
                me.render($view);
            });

           


        },
        
        //路由器调用 或其他模块调用
        //通过传递不同的参数让当前模块展现不同的状态
        onLoad : function(request,params){

            log('load test');

        }


    });

});