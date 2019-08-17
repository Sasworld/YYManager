function update_setting(){
	if(confirm("确认更新设置？")){
		var best_paidan = $("#best_max_paidan").val();
		var rand_paidan = $("#rand_max_paidan").val();
		var wechat = $("#wechat").val();
		if(best_paidan == "") {
			alert("未设置优选区排单最大显示量");
		} else if(rand_paidan == ""){
			alert("未设置随机区排单最大显示量");
		}else if(wechat == ""){
			alert("未设置微信号");
		}else{
			var upadte_data = {"best_paidan":best_paidan, "rand_paidan":rand_paidan, "wechat":wechat};
			$.ajax({
		        type: "POST",
		        url: "php/updatesetting.php" ,
		        data: {datas:JSON.stringify(upadte_data)},
		        dataType: "json",
		        contentType: "application/x-www-form-urlencoded; charset=utf-8",//设置字符集
		        success: function(json) {
		            alert(json.res);
		            setting_data();
		        },
		        error: function(){
		        	alert("请求失败");
		        }
		    });	
		}
	}
}

function refresh_sta(){
	
}