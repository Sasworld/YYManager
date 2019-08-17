var tranfer_info = new Array();

// 
function search_order(){
	var search_info = $("#text_search_order").val();
	get_order_information("2", search_info);
}

function show_zhuanjiao(obj){
	var row = obj.parentNode.parentNode.rowIndex;
	var table = document.getElementById("table_order_list");
	tranfer_info[0] = table.rows[row].cells[0].innerHTML; // 订单id
	tranfer_info[1] = table.rows[row].cells[4].innerHTML; // 买家id
	tranfer_info[2] = table.rows[row].cells[5].innerHTML; // 卖家id
	tranfer_info[3] = table.rows[row].cells[1].innerHTML; // 卖家账户
	tranfer_info[4] = table.rows[row].cells[6].innerHTML; // 订单状态
	if(tranfer_info[4] == "未打款"){
		$("#mask_memberlist").css("display", "block");
		$("#popwindow_transfer").css("display", "block");
		//获取可视页面高度、宽度
		var see_height = $(window).height();
		var see_width = $(window).width();
		//获取弹出框高和宽
		var popHeight = $("#div_dk_pic").height();
		var popWidth = $("#div_dk_pic").width();
		$("#popwindow_transfer").css("left", (see_width - popWidth) / 2 + "px");
		$("#popwindow_transfer").css("top", (see_height - popHeight) / 2 + "px");
	}else if(tranfer_info[4] == "已打款"){
		alert("买方已打款，无法转交该单");
	}else if(tranfer_info[4] == "已完成"){
		alert("此单已完成，无法转交该单");
	}else{
		alert("页面错误请刷新");
	}
	
}

function transfer_user(){
	my_validate("transfer_username", "请输入会员账户");
	var user_name = $('#transfer_username').val();
	if(user_name == tranfer_info[3]){
		alert("不能与转交给自己账户");
	}else{
//		alert(tranfer_info[1] +"  " + tranfer_info[0] +"  " + user_name +"  " + tranfer_info[2] +"  ");
		var transfer_info = {"uid":tranfer_info[1], "orderid":tranfer_info[0], "uname":user_name, "sellamount":tranfer_info[2]};
		$.ajax({
	        type: "POST",
	        url: "php/transferuser.php" ,
	        data: {datas:JSON.stringify(transfer_info)},
	        dataType: "json",
	        contentType: "application/x-www-form-urlencoded; charset=utf-8",//设置字符集
	        success: function(json) {
	        	alert(json.res);
	        	$('#transfer_username').val("");
	        	tranfer_info = new Array(); //刷新数据 
	        	close_transfer();
	        	var query_info = $("#text_search_order").val();
	        	// 刷新页面
	        	if(query_info == ""){
	        		get_order_information("1", ""); 
	        	}else{
	        		get_order_information("2", query_info);
	        	}
	        },
	        error: function(){
	        	alert("请求失败");
	        }
	    });
	}
}

// 查看打款凭证
function show_dkcerificate(obj){
	var row = obj.parentNode.parentNode.rowIndex;
	var table = document.getElementById("table_order_list");
	var orderid = table.rows[row].cells[0].innerHTML;//订单id
	var orderstate = table.rows[row].cells[6].innerHTML;//订单状态
	if (orderstate != "未打款") {
		$("#mask_memberlist").css("display", "block");
		$("#div_dk_pic").css("display", "block");
		//获取可视页面高度、宽度
		var see_height = $(window).height();
		var see_width = $(window).width();
		//获取弹出框高和宽
		var popHeight = $("#div_dk_pic").height();
		var popWidth = $("#div_dk_pic").width();
		$("#div_dk_pic").css("left", (see_width - popWidth) / 2 + "px");
		$("#div_dk_pic").css("top", (see_height - popHeight) / 2 + "px");
		var recharge_info = {"orderid":orderid};
		$.ajax({
	        type: "POST",
	        url: "php/getdkpic.php" ,
	        data: {datas:JSON.stringify(recharge_info)},
	        dataType: "json",
	        contentType: "application/x-www-form-urlencoded; charset=utf-8",//设置字符集
	        success: function(json) {
	        	$("#img_dkcertificate").attr("src", "http://47.110.83.139/Trade/Certificate/" + json.certificate);
			$("#img_dkcertificate").css("display","block");
	        },
	        error: function(){
	        	alert("请求失败");
	        }
	    });
	} else{
		alert("尚未提交打款凭证");
	}
}

// 关闭转交
function close_transfer(){
	$("#mask_memberlist").css("display", "none");
	$('#popwindow_transfer').css("display", "none");
}

//
function close_recharge(){
	$("#mask_memberlist").css("display", "none");
	$('#popwindow_transfer').css("display", "none");
}
// 关闭打款截图弹窗
function close_dk_pic(){
	$("#mask_memberlist").css("display", "none");
	$("#div_dk_pic").css("display", "none");
	$("#img_dkcertificate").attr("src", "");
}


//获取当前点击的会员的信息
function get_user_info(obj){
	var info = new Array();
	//得到当前所在行
	var row = obj.parentNode.parentNode.rowIndex;
	var table = document.getElementById("table_member_list");
	var user_name = table.rows[row].cells[0].innerHTML;//获取用户昵称
	var user_id = table.rows[row].cells[1].innerHTML;//获取用户id
	info[0] = user_name;
	info[1] = user_id;
	return info;
}

// 确认收款
function confirm_sk(obj){
	var row = obj.parentNode.parentNode.rowIndex;
	var table = document.getElementById("table_order_list");
	var orderid = table.rows[row].cells[0].innerHTML;//
	var user_id = table.rows[row].cells[4].innerHTML;//获取用户id
	var state = table.rows[row].cells[6].innerHTML;//
	if (state == "已完成") {
		alert("请勿重复收款");
	} else{
		var truthBeTold = window.confirm("确认收款？");
		if (truthBeTold) {
			var info = {"flags":"3", "uid":user_id, "orderid":orderid};
			$.ajax({
		        type: "POST",
		        url: "php/confirmsk.php" ,
		        data: {datas:JSON.stringify(info)},
		        dataType: "json",
		        contentType: "application/x-www-form-urlencoded; charset=utf-8",//设置字符集
		        success: function(json) {
		            alert(json.result);
		            get_officialorder_information("3", "");
		        }
		    });
		}
	}
}
