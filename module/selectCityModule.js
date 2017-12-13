$(function () {
    app.regModule('selectCity', {
        view: {
            url: 'view/selectCity.html'
        },

        //加载视图,只加载一次
        //初始化当前模块事件
        onRender: function (html) {

            var $view = $(html);
            //初始化
            var citys = loadHotCity();//加载热门城市
            if(citys) {
                var html = '';
                $.each(citys, function (index, element) {
                    html += format('<li>{0}</li>', element.city_name);
                });
                $view.find('#cityList ul').empty().html(html);

                //事件监听
                $view.find('#cityList li').off().click(function(){
                    var cityName = $(this).html();
                    $view.find('#city_name').val(cityName);

                    app.goto( format('/login?selectCity={0}',cityName) );
                });
            }

            this.render($view);
        },

        onLoad : function(request){
           
        }
    });

    //加载热门城市
    function loadHotCity() {
       return [{
        city_name:'广州'
       },{
        city_name:'上海'
       }]
    }
});