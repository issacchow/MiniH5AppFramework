$(function () {
    app.regModule('login', {
        view: {
            url: 'view/login.html'
        },

        //私有属性,在onLoadView时初始化
        $btnGetCode: null,
        //电话号码
        $txtPhone: null,

        _this:null,

        //加载视图,只加载一次
        //初始化当前模块事件
        onRender: function (html) {
            _this = this;
            //这里可以使用模块引擎来进行渲染最终的html代码
            var $view = $(html);

            //点击获取验证码事件
            var $getCode = $view.find('.get-code'); //或者 var $getCode = $('.get-code',$view);
            var codeLock = true;
            $getCode.click(function () {
                var phoneNumber = $("#phone_number", $view).val().trim();
                if(phoneNumber.length == 0) {//未填写手机号
                    app.showMsg("请输入11位有效的手机号");
                } else if (checkPhoneNumber(phoneNumber, true)) {//手机号格式验证通过
                    if (codeLock) {
                        app.showMsg("验证码已发送到您的手机");
                        $(this).text("59秒后获取").addClass("code-default");
                        var isSuccess =  sendMessage(phoneNumber);//发送短信
                        var time = 59;
                        var timer = setInterval(function () {
                            if (time <= 0) {
                                $getCode.text("获取验证码").removeClass("code-default");
                                clearInterval(timer);
                                codeLock = true;
                            } else {
                                time = time - 1;
                                $getCode.text(time + "秒后获取");
                            }
                        }, 1000);
                    }
                } else {//手机号格式验证不通过
                    app.showMsg("请输入11位有效的手机号");
                }
            });
            this.$btnGetCode = $getCode;

            //手机号码
            var $phone = $view.find('#phone_number');
            this.$txtPhone = $phone;

            //手机号码 onblur事件
            $phone.blur(function () {
                var phoneNumber = $(this).val();
                if(phoneNumber) {
                    checkPhoneNumber(phoneNumber, true);
                }
            });
            //手机号码 onkeyup事件
            $phone.keyup(function () {
                checkIsEnableNext($view);
            });

            var $smscode = $view.find("#sms_code")
            //验证码 onblur事件
            $smscode.blur(function () {
                var smsCode = $(this).val();
                if(smsCode) {
                    checkSmsCode(smsCode, true);
                }
            });
            //验证码 onkeyup事件
            $smscode.keyup(function () {
                checkIsEnableNext($view);
            })

            //选择服务站
            $view.find('#serve_community_name').click(function(){
                app.goto('/selectCity');
            });

            //下一步
            $('#btnNext',$view).click(function(){
                var isEnable = checkIsEnableNext($view);
                if(isEnable) {
                    var isSuccess = check($view);
                    if(isSuccess) {
                        app.goto("/fillInData")
                    }
                }
            });

            //并将html代码初始化事件好后的jquery对象，传递调用this.render方法
            this.render($view);
        },

        onLoad : function(request,params){
            var scModule = app.getModule("selectCity");
            var scData = scModule.data();
            var sscModule  = app.getModule('selectServeCommunity');
            var sscData = sscModule.data();
            this.$view.find('#serve_community_id').val(sscData.community_id);
            this.$view.find('#serve_community_name').val(sscData.community_name);
            this.$view.find('#city_name').val(scData.city_name);
            checkIsEnableNext(this.$view);
        }
    });

    //发送短信
    function sendMessage(phoneNumber) {
        var isSuccess = false;
        var url = app.url("/sms/volunteerApplySmsCode");
        $.ajax(url, {
            async: true,
            data: {phone:phoneNumber},
            dataType: 'json',
            success: function (resp) {
                if(resp.errcode == 0) {
                    isSuccess = true;
                } else {
                    app.showMsg(resp.errmsg);
                }
            },
            error: function (err) {
                app.showMsg("发送失败");
            }
        });

        return isSuccess;
    }

    //检查验证码是否正确
    function check($view) {
        var isSuccess = false;
        var sms_code = $view.find("#sms_code").val();
        var phone_number = $view.find("#phone_number").val();
        $.ajax(app.url("/volunteer/checkPhoneAndSmsCode"), {
            async: false,
            data: {
                phone_number:phone_number,
                sms_code:sms_code
            },
            dataType: 'json',
            success: function (resp) {
                if(resp.errcode == 0) {
                    isSuccess = true;
                } else {
                    app.showMsg(resp.errmsg);
                }
            },
            error: function (err) {
                app.showMsg("发送失败");
            }
        });

        return isSuccess;
    }

    //检查能否点击下一步到新页面
    function checkIsEnableNext($view) {
        var isEnable = false;
        var $next = $view.find("#btnNext");
        var phoneNumber = $view.find("#phone_number").val();
        var smsCode = $view.find("#sms_code").val();
        var serveCommunityId = $view.find("#serve_community_id").val();
        if(phoneNumber && smsCode && serveCommunityId) {//必须全部填写
            if(checkPhoneNumber(phoneNumber) && checkSmsCode(smsCode) && serveCommunityId) {
                isEnable = true;
            }
        }
       if(isEnable) {
           if(!$next.hasClass("on")) {
               $next.addClass("on");
           }
       } else {
           if($next.hasClass("on")) {
               $next.removeClass("on");
           }
       }

        return isEnable;
    }
    
    //检查手机号有效性
    function checkPhoneNumber(phoneNumber, isShowMsg) {
        var isPass = /^1[34578]\d{9}$/.test(phoneNumber);
        if(!isPass) {
            if(isShowMsg) {
                app.showMsg("请输入11位有效的手机号");
            }
            return false;
        }
        return true;
    }
    
    //检查验证码有效性
    function checkSmsCode(smsCode, isShowMsg) {
        var isPass = /^\d{4}$/.test(smsCode);
        if(!isPass) {
            if(isShowMsg) {
                app.showMsg("验证码格式有误");
            }
            return false;
        }
        return true;
    }

});