
var user_info = new Array();
// ============================ 搜索会员 ============================
function search_member(){
	var search_info = $('#text_search_member').val();
	get_member_information("2", search_info);
}

// ============================ 会员详情 ============================
// 打开会员信息弹窗
function showPopWindow(obj){
	//得到当前所在行
	var row = obj.parentNode.parentNode.rowIndex;
	$("#mask_memberlist").css("display", "block");
	$("#popwindow_member_info").css("display", "block");
	//获取可视页面高度、宽度
	var see_height = $(window).height();
	var see_width = $(window).width();
	//获取弹出框高和宽
	var popHeight = $("#popwindow_member_info").height();
	var popWidth = $("#popwindow_member_info").width();
	$("#popwindow_member_info").css("left", (see_width - popWidth) / 2 + "px");
	$("#popwindow_member_info").css("top", (see_height - popHeight) / 2 + "px");
	// 填充会员数据
	var json_obj = member_array[row - 1];
	var uname = json_obj.uname;
	var uid = json_obj.uid;
	var bank = json_obj.bank;
	var subbank = json_obj.subbank;
	var banknumber = json_obj.banknumber;
	var ownername = json_obj.ownername;
	var alipay = json_obj.alipay;
	var mem_state = json_obj.state;
	
	user_info[0] = bank;
	user_info[1] = subbank;
	user_info[2] = banknumber;
	user_info[3] = ownername;
	user_info[4] = alipay;
	user_info[5] = uid;
	
	$('#member_name').val(uname);
	$('#member_tel').val(uid);
	$('#member_principal').val(json_obj.principal);
	$('#member_bonus').val(json_obj.bonus);
	$('#member_parentname').val(json_obj.parentname);
	$('#member_stars').val(json_obj.stars);
	$('#member_pdcoin').val(json_obj.paidancoin);
	$('#member_accode').val(json_obj.activecode);
	$('#member_bank').val(bank);
	$('#member_subbank').val(subbank);
	$('#member_banknumber').val(banknumber);
	$('#member_ownername').val(ownername);
	$('#member_alipay').val(alipay);
	$('#member_register_date').val(json_obj.regdate);
	if (mem_state == "1") {
		$('#member_state').val("已激活");
	} else if (mem_state == "2") {
		$('#member_state').val("已冻结");
	} else if (mem_state == "0") {
		$('#member_state').val("未激活");
	}
}

// 编辑用户信息
function edit_member_info(){
	$('#member_bank').removeAttr("disabled");
	$('#member_subbank').removeAttr("disabled");
	$('#member_banknumber').removeAttr("disabled");
	$('#member_ownername').removeAttr("disabled");
	$('#member_alipay').removeAttr("disabled");
	// 隐藏编辑按钮, 显示修改和取消按钮
	$("#btn_edit_member_info").css("display", "none");
	$("#btn_confirm_alter").css("display", "inline");
	$("#btn_cancel_alter").css("display", "inline");
}

// 确认修改
function confirm_alter(){
	var bank = $('#member_bank').val();
	var subbank = $('#member_subbank').val();
	var banknumber = $('#member_banknumber').val();
	var ownername = $('#member_ownername').val();
	var alipay = $('#member_alipay').val();
	if (user_info[0] == bank && user_info[1] == subbank && user_info[2] == banknumber && user_info[3] == ownername && user_info[4] == alipay) {
		alert("数据未修改");
	} else{
		var recharge_info = {"memberid":user_info[5], "bank":bank, "subbank":subbank, "banknumber":banknumber, "ownername":ownername, "alipay":alipay };
		$.ajax({
	        type: "POST",
	        url: "php/altermember.php" ,
	        data: {datas:JSON.stringify(recharge_info)},
	        dataType: "json",
	        contentType: "application/x-www-form-urlencoded; charset=utf-8",//设置字符集
	        success: function(json) {
	            alert(json.res);
	            close_pop();
	            get_member_information("1", "");
	        },
	        error: function(){
	        	alert("请求失败");
	        }
	    });
	}
}

// 取消修改
function cancel_alter(){
	$('#member_bank').attr("disabled", "disabled");
	$('#member_subbank').attr("disabled", "disabled");
	$('#member_banknumber').attr("disabled", "disabled");
	$('#member_ownername').attr("disabled", "disabled");
	$('#member_alipay').attr("disabled", "disabled");
	$("#btn_edit_member_info").css("display", "inline");
	$("#btn_confirm_alter").css("display", "none");
	$("#btn_cancel_alter").css("display", "none");
}

// ============================ 会员充值 ============================
// 打开充值弹窗
function member_recharge(obj){
	user_info= get_user_info(obj);
	if(user_info[2] == "已冻结"){
		alert("当前账户已被冻结");
	}else{
		$("#mask_memberlist").css("display", "block");
		$("#popwindow_recharge").css("display", "block");
		//获取可视页面高度、宽度
		var see_height = $(window).height();
		var see_width = $(window).width();
		//获取弹出框高和宽
		var popHeight = $("#popwindow_recharge").height();
		var popWidth = $("#popwindow_recharge").width();
		$("#popwindow_recharge").css("left", (see_width - popWidth) / 2 + "px");
		$("#popwindow_recharge").css("top", (see_height - popHeight) / 2 + "px");
	}
}

// 提交充值请求
function submit_recharge(){
	my_validate("recharge_amount", "请输入充值金额");
	var amount = $("#recharge_amount").val();
	checkRate(amount);
	if(amount <= 0){
		alert("不能充值为0");
	} else{
		var rechargetype = $('input[name="recharge_radio"]:checked').val();
		switch (rechargetype){
			case "1":
				var tips = "确认充值排单币 " + amount + " 给：" + user_info[0] + "？";
				break;
			case "2":
				var tips = "确认充值激活码 " + amount + " 给：" + user_info[0] + "？";
				break;
			default:
				var tips = "";
				break;
		}
		if(tips == ""){
			alert("信息有误");
		}else{
			if(confirm(tips)){
				var recharge_info = {"amount":amount, "uname":user_info[0], "memberid":user_info[1], "rechargetype":rechargetype};
				$.ajax({
			        type: "POST",
			        url: "php/recharge.php" ,
			        data: {datas:JSON.stringify(recharge_info)},
			        dataType: "json",
			        contentType: "application/x-www-form-urlencoded; charset=utf-8",//设置字符集
			        success: function(json) {
			            alert(json.result);
			            close_recharge();
			            var query_info = $("#div_memberlist_content").val();
			        	// 刷新页面
			        	if(query_info == ""){
			        		get_member_information("1", ""); 
			        	}else{
			        		get_member_information("2", query_info);
			        	}
			        },
			        error: function(){
			        	alert("请求失败");
			        }
			    });
			} else{
				close_recharge();
			}				
		}
	}
}

// 关闭充值弹窗
function close_recharge(){
	$("#mask_memberlist").css("display", "none");
	$('#popwindow_recharge').css("display", "none");
	$("#recharge_amount").val("");
	user_info = new Array();
}

// ============================ 冻结会员账户 ============================
function freeze_account(obj){
	//得到当前所在行
	var row = obj.parentNode.parentNode.rowIndex;
	var table = document.getElementById("table_member_list");
	var user_id = table.rows[row].cells[1].innerHTML;//获取用户id
	var user_name = table.rows[row].cells[0].innerHTML;//获取用户昵称
	var state = table.rows[row].cells[8].innerHTML;//获取用户账号状态
	if(state != "已冻结"){
		if(confirm("确定冻结账户：" + user_name + "？") == true){
			var member_info = {"memberid":user_id};
			$.ajax({
		        type: "POST",
		        url: "php/freezemember.php" ,
		        data: {datas:JSON.stringify(member_info)},
		        dataType: "json",
		        contentType: "application/x-www-form-urlencoded; charset=utf-8",//设置字符集
		        success: function(json) {
		            alert(json.res);
		            get_member_information("1", "");
		        },
		        error: function(){
		        	alert("请求失败");
		        }
		    });
		} else{
			
		}
	}else{
		alert("当前账户未冻结状态");
	}
}

// 关闭弹窗
function close_pop(){
	$("#mask_memberlist").css("display", "none");
	$("#popwindow_member_info").css("display", "none");
	cancel_alter();
}

//获取当前点击的会员的信息
function get_user_info(obj){
	var info = new Array();
	//得到当前所在行
	var row = obj.parentNode.parentNode.rowIndex;
	var table = document.getElementById("table_member_list");
	var user_name = table.rows[row].cells[0].innerHTML;//获取用户昵称
	var user_id = table.rows[row].cells[1].innerHTML;//获取用户id
	var state = table.rows[row].cells[8].innerHTML;//获取用户账号状态
	info[0] = user_name;
	info[1] = user_id;
	info[2] = state;
	return info;
}

// 激活账户
function active_account(obj){
	//得到当前所在行
	var row = obj.parentNode.parentNode.rowIndex;
	var table = document.getElementById("table_member_list");
	var user_id = table.rows[row].cells[1].innerHTML;//获取用户id
	var user_name = table.rows[row].cells[0].innerHTML;//获取用户昵称
	var state = table.rows[row].cells[8].innerHTML;//获取用户账号状态
	if(state != "已激活"){
		if(confirm("确定激活账户：" + user_name + "？") == true){
			var member_info = {"memberid":user_id};
			$.ajax({
		        type: "POST",
		        url: "php/activeaccount.php" ,
		        data: {datas:JSON.stringify(member_info)},
		        dataType: "json",
		        contentType: "application/x-www-form-urlencoded; charset=utf-8",//设置字符集
		        success: function(json) {
		            alert(json.res);
		            get_member_information("1", "");
		        },
		        error: function(){
		        	alert("请求失败");
		        }
		    });
		} else{
			
		}
	}else{
		alert("该账户已是激活状态");
	}
}

