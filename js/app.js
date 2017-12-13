function format(str) {
    if (arguments.length > 1) {

        for (var i = 1; i < arguments.length; i++) {
            var reg = new RegExp('\\{' + (i - 1) + '\\}', 'gi');
            str = str.replace(reg, arguments[i]);
        }
    }
    return str;
}

function log() {
    if (console) {
        console.log(format.apply(null, arguments));
    }
}
function dir(obj) {
    if (console) {
        console.dir(obj);
    }
}

var app = {

    registerModules: {},

    router: null,

    //当前已加载的模块
    currentModule: null,

    init: function () {
        this.router = new Router();
    },


    regRoute: function () {

    },

    /**
     * 注册模块
     * @param name 模块名称
     * @param config 模块配置
     * @returns {Module}
     */
    regModule: function (name, config) {
        var module = new Module(name, config);
        this.registerModules[name] = module;

        /** 绑定路由 **/
        var router = this.router;

        var path = format('#/{0}', module.name);
        router.addRoute(path, module.load, module);
        //路由器配置
        return module;
    },

    getModule: function (name) {
        var module = this.registerModules[name];
        return module;
    },


    /**
     * 转跳到指定path
     * @param path 模块地址, 例如 /login/main?
     * @param params 附加的参数
     * @example
     * app.goto("/login/main?phone=15800000",{ showPassword:true});
     */
    goto: function (path) {
        this.router.run(path);
    },

    /**
     * 返回一个全路径url
     * @param path
     */
    url : function(path){
        return "/web/client" + path;
    },

    /**
    * 显示提示消息,支持格式化
    * @example app.showMsg('Hi,{0}','John');
    */
    showMsg : function(){
        var msg = format.apply(null,arguments);
        toast(msg);
    },

    showLoading : function(){

    },

    hideLoading : function(){

    }

};


/**
 * 创建模块
 * @param {Map} config 配置参数
 * {
 *    view:{
 *       url : '/login.html'
      },
      onRender : function(html){

      },
      '/main' : function(request,params){
      },
      'other' : function(request,params){

      }
 * }
 */
function Module(name, config) {
    var def = {
        view: {
            url: null
        },

        //是否自动保存数据
        //当调用触发unLoad方法时会根据该值进行处理
        autoSaveData: true,

        /**
        * 渲染视图过程
        */
        onRender: function (html) {
            var $html = $(html);
            this.render($html);
        },
        onLoad: function (request, params) {

        },
        //保存数据的实现
        onSaveData : function(){
            var json = this.$view.find('form').serializeJSON();
            //log('save data:');
            //dir(json);
            $.extend( this._data,json);

            //手动保存其他数据
            //log('onSaveData');
        }
    };


    var module = $.extend(true, {}, def, config);
    //前一个模块
    module.prevModule = null;
    module.name = name;
    module.hasLoadView = false;
    module.loadView = function () {
        //同步请求
        $.ajax(module.view.url, {
            context: this,
            async: false,
            dataType: 'html',
            ifModified: false,
            success: function (html) {
                //log('load html');
                this.onLoadView.apply(this, [html]);
            }
        });

    }

    var __loadViewRequest = null;

    //进行渲染
    module.render = function ($html) {
        var $viewBox = $('#view-box');
        $viewBox.html();
        $viewBox.append($html);
        this.$view = $html;
        this.hasLoadView = true;
        var args = __loadViewRequest;
        // log('loadViewRequest:');
        // dir(args);
        this.load.apply(this,args);
    };

    module.load = function (request, next) {
        //log('load module:{0}', this.name);
        //dir(arguments);

        if(app.currentModule!=null){
            app.currentModule.unload();
            this.prevModule = app.currentModule;
        }

        if (this.hasLoadView == false) {
            __loadViewRequest = arguments;//临时存储
            this.loadView();
            //等待 loadView触发render再次触发load方法
            return;
        }
       
        this.onLoad.apply(this, arguments);
        app.currentModule = this;
        this.$view.show();
    };

    //卸载
    module.unload = function () {
        this.$view.hide();
        if (this.autoSaveData == true)
            this.saveData();
    }

    //绑定数据,为下一个模块提供数据
    module._data = {};
    module.data = function (key, value) {
        if (arguments.length == 0) {
            //获取整个值
            return this._data;
        }else if(arguments.length==1){
            //获取单个值
            return this._data[key];
        } else {
            this._data[key] = value;
        }
    };

    //保存状态
    //根据当前页面所有input控件的值序列化成一个json值并保存data属性中
    module.saveData = function () {
       this.onSaveData();
    };

    log('new Moddule:{0}', module.name);
    //console.dir(module);
    return module;
};

function View() {

}


$(function () {
    app.init();
});

