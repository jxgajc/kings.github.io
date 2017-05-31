/**登录和登出*/
<!--
$(document).ready(function() {
	
	var userinfo= getUserInfo();
	var info = JSON.parse(userinfo);
	var ticket = info.ticket;
	/**已登录*/
	if(info.status=="succ"){
		$('#login1001').text(info.username).attr('target','_bank').attr('href', 'https://usercenter.chinadaily.com.cn/profile/graph');
		$('#login1002').text('');
		$('#successCallBack').append("<div class='lo-ri-two'><a href='javascript:void()' id='sigout'>退出</a></div>");
	} 
	/**调用登出接口*/
 	$("#sigout").click(function(){
 		$.ajax({type: "get",async: false,
     		 data:{ticket:ticket,callback:"signOut"},
     		 url: "https://usercenter.chinadaily.com.cn/ssoapi/signOut",
             dataType: "jsonp",
             jsonp: "callback",
             jsonpCallback:"signOut",
             success: function(json){
				if(json.status == 1) {
	             	alert("成功登出");
	             	
	             	var CurUrl = location.href ;
	             	var DesUrl = 'https://usercenter.chinadaily.com.cn?service='+ CurUrl;
	             	
	             	$('#login1001').load();
					$('#login1002').load();
	             	$('#login1001').text('登录');
	             	$('#login1001').attr('href', DesUrl).removeAttr('target');
					$('#login1002').text('注册');
					$('#sigout').text('');
             	}
             },
             error: function(){
            	 alert('登出异常,请重试!');
             }
     	});
     	return false;
     });
});

//-->