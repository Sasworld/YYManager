function login(){
	var pw = $('#password').val();
	var userid = $('#userid').val();
	if(userid == ""){
		alert("请输入账号！");
	}else if(pw == ""){
		alert("请输入密码！");
	}else{
		var transfer_info = {"uid":userid, "pw":pw};
		$.ajax({
	        type: "POST",
	        url: "php/login.php" ,
	        data: {datas:JSON.stringify(transfer_info)},
	        dataType: "json",
	        contentType: "application/x-www-form-urlencoded; charset=utf-8",//设置字符集
	        success: function(json) {
	        	if (json.res == "1") {
	            	//保存用户id，设置时间，超时需重新登陆,存储数据到localStorage
					if(!window.localStorage){
				        alert("浏览器不支持,更换其它浏览器");
				    }else{
				        var storage=window.localStorage;
				        storage["managerid"] = userid;
				        storage['mg_operate_time'] = new Date().getTime();
				        window.location.href="home.html";
				    }
	        	} else if (json.res == "3"){
	        		alert("账号不存在");
	        	}else{
	        		alert("密码错误");
	        	}
	        },
	        error: function(){
	        	alert("请求失败");
	        }
	    });
	}
}