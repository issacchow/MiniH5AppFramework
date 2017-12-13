/*提示框
 * 调用例子：
	toast("你输入的手机号码格式不正确");
 * 
 */
function toast(txt){
	$(".toast-box").remove();
	var _html = '<div class="toast-box"><span>'+txt+'</span></div>';
	$("body").append(_html);
	
	$(".toast-box").delay(2000).fadeOut(200, function(){
		$(".toast-box").remove();
	});
}


/*弹窗选择
 * 调用例子：
    $.mhhDialog({
        actions: [//设置项目列表
	  		{
			    text: "男",	//必填
			    value: "1",	//value值，可选填
			    noClose: true,	//是否点击项目关闭弹窗  true则不关闭  默认不填是关闭
			    onClick: function(data) {	//点击每个项目的执行方法 data是返回值
			    	$.mhhDialog.hide();	//手动关闭弹窗
			        console.log(data.text);
			        console.log(data.value);
			    }
			},
			{
			    text: "女",
			    value: "2",
			    noClose: true,
			    onClick: function(data) {
			    	$.mhhDialog.hide(); //手动关闭弹窗
		    		console.log(data.text);
			        console.log(data.value); 
			    }
			}
		],
		onClose: function(){
			console.log("已经关闭弹窗");
		}
	})
 */
(function($){
	$.mhhDialog = function(options){
		var actions = options.actions;
		var onClose = options.onClose;
		var photo = options.photo;
		
		var _html = '';
			_html += '<div class="mhh-dialog-mask"></div>';
			_html += '<div class="mhh-dialog-box">'; 
			_html +=	'<div class="mhh-dialog-con-tips">';
			_html +=		'<img src="images/photo_tips.png"/>';
			_html +=		'<strong>请提供您本人的免冠正面照片</strong>';
			_html +=		'<p>非本人照片或卡通头像将无法通过申请</p>';
			_html +=	'</div>';
			_html +=	'<div class="mhh-dialog-item">';
				_html +=	'<ul>';
							for(var i=0; i<actions.length; i++){
								_html += '<li data-value="'+actions[i].value+'">'+actions[i].text+'</li>';
							}
				_html +=	'</ul>';
				_html +=	'<div class="mhh-dialog-cancel">取消</div>';			
			_html +=	'</div>';
		_html +=	'</div>';
		
		$("body").append(_html);
		if(photo){
			$(".mhh-dialog-con-tips").show();
		}
		$(".mhh-dialog-mask").fadeIn(200);
		$(".mhh-dialog-box").slideDown(200);
		
		//点击项目
		$(".mhh-dialog-item ul li").click(function(){
			var _index = $(this).index();
			var _text = $(this).text();
			var _val = $(this).attr("data-value");
			var _obj = {
				text: _text,
				value: _val
			}
			actions[_index].onClick(_obj);
			
			var closeThis = actions[_index].noClose || false;
			if(!closeThis){
				$.mhhDialog.hide();
			}
		});
		
		//点击取消
		$(".mhh-dialog-cancel").click(function(){
			if(onClose){ onClose(); }
			$.mhhDialog.hide();
		});
		
		//移除弹出框
		$.mhhDialog.hide = function(){
			$(".mhh-dialog-mask").fadeOut(200, function(){
				$(".mhh-dialog-mask").remove();
			});
			$(".mhh-dialog-box").slideUp(200, function(){
				$(".mhh-dialog-box").remove();
			});
		}
	}
	
})(jQuery);



/* 弹窗
 * 调用例子
  	$.mhhAlert({
  		type: '1',	//可以选3中弹窗；type=1是带有输入框的弹窗；type=2是不带输入框的弹窗；type=3是alert弹窗
	  	title: '标题',
	  	text: '内容文案',
	  	placeholder: '输入框提示',
	  	maxlength: 8,	//输入框最大字符长度
	  	empty: false,	//是否允许输入框为空  默认是false是不允许
	  	noClose: false,	//是否点击确定后不关闭弹窗 默认是false关闭弹窗 设置true可以用$.mhhAlert.hide();手动关闭
	  	onOK: function (value) {	//type=1时才有的value值
	    	//点击确认
	  	},
	  	onCancel: function () {
	    	//点击取消
	  	}
	});
	$.mhhAlert({
  		type: '2',
	  	title: '确认删除?',
		text: '您确定要删除改文件吗?删除后不可恢复。',
	  	onOK: function(){
	  		
	  	}
	});
	$.mhhAlert({
  		type: '3',
	  	title: '温馨提示',
		text: '您不可以进行该操作',
	  	onOK: function(){

	  	}
	});
*/
(function($){
	$.mhhAlert = function(options){
		var _type = options.type || 1;
		var _title = options.title;
		var _text = options.text || "";
		var _placeholder = options.placeholder;
		var _maxlength = options.maxlength;
		var _empty = options.empty || false;
		var _onOK = options.onOK;
		var _onCancel = options.onCancel;
		var _noClose = options.noClose || false;
		
		var _html = '';
			_html += '<div class="mhh-alert-mask"></div>';
			_html += '<div class="mhh-alert-wrap">'; 
			_html +=	'<div class="mhh-alert-box">';
			_html +=		'<div class="mhh-alert-con">';
			_html +=			'<strong>'+_title+'</strong>';
			if(_text != ""){ _html += '<p>'+_text+'</p>'; }
			if(_type == 1){ _html += '<div class="mhh-alert-text"><input type="text" placeholder="'+_placeholder+'" maxlength="'+_maxlength+'" /></div>'; }
			_html +=			'<div class="mhh-alert-btn">';
			if(_type == 3){
				_html += '<span class="mhh-alert-ok" style="width:100%;">确定</span>';
			}else{
				_html += '<span class="mhh-alert-cancel">取消</span>';			
				_html += '<span class="mhh-alert-ok">确定</span>';
			}
			_html +=			'</div>';
			_html +=		'</div>';
			_html +=	'</div>';
			_html += '</div>';
	
		$("body").append(_html);
		$(".mhh-alert-mask").fadeIn(200);
		$(".mhh-alert-wrap").css("display", "table");
		
		//输入框必填值
		if(_type == 1 && !_empty){
			$(".mhh-alert-ok").addClass("disabled");
			$(".mhh-alert-text input").focus();
			$(".mhh-alert-text input").bind("input propertychange", function(){
				if($(this).val().length <= 0){
					$(".mhh-alert-ok").addClass("disabled");
				}else{
					$(".mhh-alert-ok").removeClass("disabled");
				}
			});
		}
		
		//点击确定
		$(".mhh-alert-ok").click(function(){
			if(!$(this).hasClass("disabled")){
				if(_type == 1){
					var _val = $(".mhh-alert-text input").val();
					if(_onOK){ _onOK(_val); }//把value值传回去
				}else{
					if(_onOK){ _onOK(); }
				}
				if(!_noClose){
					$.mhhAlert.hide();
				}
			}
		});
		
		//点击取消
		$(".mhh-alert-cancel").click(function(){
			if(_onCancel){ _onCancel(); }
			$.mhhAlert.hide();
		});
		
		//移除弹出框
		$.mhhAlert.hide = function(){
			$(".mhh-alert-mask").remove();
			$(".mhh-alert-wrap").remove();
			
		}
	}
	
})(jQuery);