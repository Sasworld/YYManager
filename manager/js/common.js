var member_array = new Array(); // 会员信息
//左侧导航栏切换
function showPage(obj){
	var page_name = obj.getAttribute("id");
	if(page_name == "member_manage"){
		$("#div_main_content").load( "memberlist.html", function( response, status, xhr ) {
			$("#div_main_content").html(response);
			if(status == "success"){
				get_member_information("1", "");
			}
		});
	} else if(page_name == "manage_trade"){
		$("#div_main_content").load( "trade.html", function( response, status, xhr ) {
			$("#div_main_content").html(response);
			if(status == "success"){
				get_order_information("1", "");
			}
		});
	}else if(page_name == "op_record"){
		$("#div_main_content").load( "oprecord.html", function( response, status, xhr ) {
			$("#div_main_content").html(response);
			if(status == "success"){
				get_record("1", "", "");
			}
		});
	}else if(page_name == "statistic"){
		$("#div_main_content").load( "managestatistic.html", function( response, status, xhr ) {
			$("#div_main_content").html(response);
			if(status == "success"){
				setting_data();
			}
		});
	}
	closeLastItem();
	openPage(page_name);
}

// 页面卡片
function tab_page(obj){
	var page_name = obj.getAttribute("id");
	if(page_name == "newmember"){
		$('#newmember').addClass("theme_bg_color");
		$('#allmember').removeClass("theme_bg_color");
		$('#allmember').addClass("theme_txt_color");
		$('#newmember').removeClass("theme_txt_color");
		get_member_information("3", "");
	}else if(page_name == "allmember"){
		$('#allmember').addClass("theme_bg_color");
		$('#newmember').removeClass("theme_bg_color");
		$('#newmember').addClass("theme_txt_color");
		$('#allmember').removeClass("theme_txt_color");
		get_member_information("1", "");
	}else if(page_name == "paidan"){
		$("#div_main_content").load( "paidan.html", function( response, status, xhr ) {
			$("#div_main_content").html(response);
			if(status == "success"){
				get_paidan_information("1", "");
			}
		});
	}else if(page_name == "order"){
		$("#div_main_content").load( "trade.html", function( response, status, xhr ) {
			$("#div_main_content").html(response);
			if(status == "success"){
				get_order_information("1", "");
			}
		});
	}else if(page_name == "manage_order"){
		$("#div_main_content").load( "trade.html", function( response, status, xhr ) {
			$("#div_main_content").html(response);
			if(status == "success"){
				$('#manage_order').addClass("theme_bg_color");
				$('#order').removeClass("theme_bg_color");
				$('#order').addClass("theme_txt_color");
				$('#manage_order').removeClass("theme_txt_color");
				get_officialorder_information("3", "");
			}
		});
	}
}
// 网站数据
function setting_data(){
	var recharge_info = {};
	$.ajax({
        type: "POST",
        url: "php/getstatistic.php" ,
        data: {datas:JSON.stringify(recharge_info)},
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",//设置字符集
        success: function(json) {
            $('#total_paidan').text(json.total_paidan);
            $('#today_total_paidan').text(json.today_paidan);
            $('#total_jiaoge').text(json.total_jiaoge);
            $('#today_total_jiaoge').text(json.today_jiaoge);
            $('#total_tixian').text(json.total_tixian);
            $('#today_total_tixian').text(json.today_tixian);
            $('#best_max_paidan').val(json.best_pd);
            $('#rand_max_paidan').val(json.rand_pd);
            $("#wechat").val(json.wechat);
        },
        error: function(){
        	alert("请求失败");
        }
    });
}


// =========================== 获取会员操作记录 =================================
function get_record(type, info, optype){
	switch (optype){
		case "提现":
			optype = "1";
			break;
		case "搜索":
			optype = "2";
			break;
		case "激活码转账":
			optype = "3";
			break;
		case "排单币转账":
			optype = "4";
			break;
		case "排单币充值":
			optype = "5";
			break;
		case "激活码充值":
			optype = "6";
			break;
		case "未确认收款罚款":
	  		optype = "8";
			break;
		default:
			optype = "";
			break;
	}
	// 获取会员数据
	var manager_info = {"query_type":type, "queryinfo":info, "optype":optype}
	$.ajax({
        type: "POST",
        url: "php/oprecord.php" ,
        data: {datas:JSON.stringify(manager_info)},
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",//设置字符集
        success: function(json) {
            var oprecord_array = eval(json);
            if(oprecord_array.length == 0){
            	$("#no_data_tip").css("display", "block");
            }else{
            	$("#no_data_tip").css("display", "none");
            }
        	$("#table_oprecord_list tr:gt(0)").remove();
            for(var i = 0; i < oprecord_array.length; ++i){
	  			json_obj = oprecord_array[i];
	  			var optype = json_obj.optype;
	  			switch (optype){
	  				case "1":
	  					type = "提现";
	  					break;
	  				case "2":
	  					type = "搜索";
	  					break;
	  				case "3":
	  					type = "激活码转账";
	  					break;
	  				case "4":
	  					type = "排单币转账";
	  					break;
	  				case "5":
	  					type = "排单币充值";
	  					break;
	  				case "6":
	  					type = "激活码充值";
	  					break;
	  				case "8":
	  					type = "未确认收款罚款";
	  					break;
	  				default:
	  					break;
	  			}
  				var row = "<tr><td>" + json_obj.uname + "</td><td>" + json_obj.uid + "</td><td>" + type + "</td>" +
						  "<td>" + json_obj.opedid + "</td><td>" + json_obj.opremarks + "</td><td>" + json_obj.opdate + "</td></tr>";
	          	$("#table_oprecord_list").append(row);
	  		}
        },
        error: function(){
        	alert("请求失败");
        }
    });
}

// =========================== 获取排单信息 =================================
function get_paidan_information(type, info){
	// 获取会员数据
	var manager_info = {"query_type":type, "queryinfo":info}
	$.ajax({
        type: "POST",
        url: "php/getpaidan.php" ,
        data: {datas:JSON.stringify(manager_info)},
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",//设置字符集
        success: function(json) {
            var paidan_array = eval(json);
            if(paidan_array.length == 0){
            	$("#no_data_tip").css("display", "block");
            }else{
            	$("#no_data_tip").css("display", "none");
            }
        	$("#table_paidan_list tr:gt(0)").remove();
            for(var i = 0; i < paidan_array.length; ++i){
	  			json_obj = paidan_array[i];
	  			var needamount = json_obj.needamount;
	  			var pdstate = json_obj.pdstate;
	  			var pdamount = json_obj.pdamount;
	  			if(pdstate == "1"){
	  				var state = "隐藏排单";
	  			}else{
	  				var state = "显示排单";
	  			}
	  			if(needamount == 0){
	  				var finish = "已完成";
	  			}else{
	  				var finish = "未完成";
	  			}
  				var row = "<tr><td>" + json_obj.pdid + "</td><td>" + json_obj.uname + "</td><td>" + json_obj.uid + "</td>" +
						  "<td>" + pdamount + "</td><td>" + (pdamount - needamount ) + "</td><td>" + finish + "</td>" +
						  "<td>" + json_obj.pddate + "</td><td><span class=\"span_operate theme_txt_hover\" onclick=\"manage_jiaoge(this)\">交割</span>" + 
						  "<span id=\"pd_opearate\" class=\"span_operate theme_txt_hover\" onclick=\"close_paidan(this)\">" + state + "</span></td>" + 
						  "</tr>";
	          	$("#table_paidan_list").append(row);
	  		}
        },
        error: function(){
        	alert("请求失败");
        }
    });
}
// =========================== 获取平台交割订单信息 =================================
function get_officialorder_information(type, info){
	// 获取会员数据
	var manager_info = {"query_type":type, "queryinfo":info}
	$.ajax({
        type: "POST",
        url: "php/getorders.php" ,
        data: {datas:JSON.stringify(manager_info)},
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",//设置字符集
        success: function(json) {
            var order_array = eval(json);
            if(order_array.length == 0){
            	$("#no_data_tip").css("display", "block");
            }else{
            	$("#no_data_tip").css("display", "none");
            }
        	$("#table_order_list tr:gt(0)").remove();
            for(var i = 0; i < order_array.length; ++i){
	  			json_obj = order_array[i];
	  			var finishstate = json_obj.finishstate;
	  			var orderstate = json_obj.orderstate;
	  			if(orderstate == "1"){
	  				var order_state = "未提现";
	  			}else if(orderstate == "2"){
	  				var order_state = "已提现";
	  			}
	  			// 2：账号封号，1：账号已激活， 0：账号未激活
	  			if(finishstate == 2){
	  				var finish_state = "已完成";
	  			}else if(finishstate == 1){
	  				var finish_state = "已打款";
	  			}else if(finishstate == 0){
	  				var finish_state = "未打款";
	  			}
	  			var row = "<tr><td>" + json_obj.orderid + "</td><td>" + json_obj.buyername + "</td><td>" + json_obj.sellername + "</td>" +
							  "<td>" + json_obj.buyerid + "</td><td>" + json_obj.sellerid + "</td><td>" + json_obj.principal + "</td>" +
							  "<td>" + finish_state + "</td><td>" + order_state + "</td><td>" + json_obj.orderdate + "</td><td>" +
							  "<span class=\"span_operate theme_txt_hover\" onclick=\"confirm_sk(this)\">确认收款</span><span class=\"span_operate theme_txt_hover\" onclick=\"show_dkcerificate(this)\">打款凭证</span>" + 
							  "</td></tr>";
	          	$("#table_order_list").append(row);
	  		}
        },
        error: function(){
        	alert("请求失败");
        }
    });
}

// =========================== 获取订单信息 =================================
function get_order_information(type, info){
	// 获取会员数据
	var manager_info = {"query_type":type, "queryinfo":info}
	$.ajax({
        type: "POST",
        url: "php/getorders.php" ,
        data: {datas:JSON.stringify(manager_info)},
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",//设置字符集
        success: function(json) {
            var order_array = eval(json);
            if(order_array.length == 0){
            	$("#no_data_tip").css("display", "block");
            }else{
            	$("#no_data_tip").css("display", "none");
            }
        	$("#table_order_list tr:gt(0)").remove();
            for(var i = 0; i < order_array.length; ++i){
	  			json_obj = order_array[i];
	  			var finishstate = json_obj.finishstate;
	  			var orderstate = json_obj.orderstate;
	  			if(orderstate == "1"){
	  				var order_state = "未提现";
	  			}else if(orderstate == "2"){
	  				var order_state = "已提现";
	  			}
	  			// 2：账号封号，1：账号已激活， 0：账号未激活
	  			if(finishstate == 2){
	  				var finish_state = "已完成";
	  			}else if(finishstate == 1){
	  				var finish_state = "已打款";
	  			}else if(finishstate == 0){
	  				var finish_state = "未打款";
	  			}
	  			var row = "<tr><td>" + json_obj.orderid + "</td><td>" + json_obj.buyername + "</td><td>" + json_obj.sellername + "</td>" +
							  "<td>" + json_obj.buyerid + "</td><td>" + json_obj.sellerid + "</td><td>" + json_obj.principal + "</td>" +
							  "<td>" + finish_state + "</td><td>" + order_state + "</td><td>" + json_obj.orderdate + "</td><td>" +
							  "<span class=\"span_operate theme_txt_hover\" onclick=\"show_zhuanjiao(this)\">转交</span><span class=\"span_operate theme_txt_hover\" onclick=\"show_dkcerificate(this)\">打款凭证</span>" + 
							  "</td></tr>";
	          	$("#table_order_list").append(row);
	  		}
        },
        error: function(){
        	alert("请求失败");
        }
    });
}

// =========================== 获取会员信息 =================================
function get_member_information(type, info){
	// 获取会员数据
	var manager_info = {"query_type":type, "queryinfo":info}
	$.ajax({
        type: "POST",
        url: "php/getmembers.php" ,
        data: {datas:JSON.stringify(manager_info)},
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",//设置字符集
        success: function(json) {
            member_array = eval(json);
            if(type == "1"){
        		$('#span_member_amount').text(member_array.length);
        	}
            if(member_array.length == 0){
            	$("#no_data_tip").css("display", "block");
            }else{
            	$("#no_data_tip").css("display", "none");
            }
        	$("#table_member_list tr:gt(0)").remove();
            for(var i = 0; i < member_array.length; ++i){
	  			json_obj = member_array[i];
	  			var member_state_code = json_obj.state;
	  			// 2：账号封号，1：账号已激活， 0：账号未激活
	  			if(member_state_code == 2){
	  				var row = "<tr><td>" + json_obj.uname + "</td><td>" + json_obj.uid + "</td><td>" + json_obj.parentname + "</td>" +
							  "<td>" + json_obj.principal + "</td><td>" + json_obj.stars + "</td><td>" + json_obj.paidancoin + "</td>" +
							  "<td>" + json_obj.activecode + "</td><td>" + json_obj.regdate + "</td><td>已冻结</td><td>" +
							  "<span class=\"span_operate theme_txt_hover\" onclick=\"showPopWindow(this)\">查看</span>" + 
							  "<span class=\"span_operate theme_txt_hover\" onclick=\"member_recharge(this)\">充值</span>" + 
							  "<span class=\"span_operate theme_txt_hover\" onclick=\"active_account(this)\">激活</span>" +
							  "<span class=\"span_operate theme_txt_hover\" onclick=\"freeze_account(this)\">冻结</span>" +
							  "</td></tr>";
	  			}else if(member_state_code == 1){
	  				var row = "<tr><td>" + json_obj.uname + "</td><td>" + json_obj.uid + "</td><td>" + json_obj.parentname + "</td>" +
							  "<td>" + json_obj.principal + "</td><td>" + json_obj.stars + "</td><td>" + json_obj.paidancoin + "</td>" +
							  "<td>" + json_obj.activecode + "</td><td>" + json_obj.regdate + "</td><td>已激活</td><td>" +
							  "<span class=\"span_operate theme_txt_hover\" onclick=\"showPopWindow(this)\">查看</span>" + 
							  "<span class=\"span_operate theme_txt_hover\" onclick=\"member_recharge(this)\">充值</span>" + 
							  "<span class=\"span_operate theme_txt_hover\" onclick=\"active_account(this)\">激活</span>" + 
							  "<span class=\"span_operate theme_txt_hover\" onclick=\"freeze_account(this)\">冻结</span>" +
							  "</td></tr>";
	  			}else if(member_state_code == 0){
	  				var row = "<tr><td>" + json_obj.uname + "</td><td>" + json_obj.uid + "</td><td>" + json_obj.parentname + "</td>" +
							  "<td>" + json_obj.principal + "</td><td>" + json_obj.stars + "</td><td>" + json_obj.paidancoin + "</td>" +
							  "<td>" + json_obj.activecode + "</td><td>" + json_obj.regdate + "</td><td>未激活</td><td>" +
							  "<span class=\"span_operate theme_txt_hover\" onclick=\"showPopWindow(this)\">查看</span>" + 
							  "<span class=\"span_operate theme_txt_hover\" onclick=\"member_recharge(this)\">充值</span>" + 
							  "<span class=\"span_operate theme_txt_hover\" onclick=\"active_account(this)\">激活</span>" + 
							  "<span class=\"span_operate theme_txt_hover\" onclick=\"freeze_account(this)\">冻结</span>" +
							  "</td></tr>";
	  			}
	          	$("#table_member_list").append(row);
	  		}
        },
        error: function(){
        	alert("请求失败");
        }
    });
}

//页面内的选项卡切换
function tabPage(obj){
	var pageName = obj.getAttribute("id");
	//执行界面刷新的相关操作
	loadPage(pageName+".html","div_main_content");
}

//打开当前选定的item,分别设置图片和文字颜色
function openPage(id){
	if(id == "member_manage"){
		document.getElementById("img_member").src='imgs/member_down.png';
		document.getElementById("label_member").style.color="#FF9900";
	}else if(id == "manage_trade"){
		document.getElementById("img_trade").src='imgs/trade_down.png';
		document.getElementById("label_trade").style.color="#FF9900";
	}else if(id == "statistic"){
		document.getElementById("img_statistic").src='imgs/statistic_down.png';
		document.getElementById("label_statistic").style.color="#FF9900";
	}else if(id == "op_record"){
		document.getElementById("img_op_record").src='imgs/order_down.png';
		document.getElementById("label_op_record").style.color="#FF9900";
	}
}
//关闭其他所有item
function closeLastItem(){
	document.getElementById("img_member").src='imgs/member_up.png';
	document.getElementById("label_member").style.color="#8a8a8a";
	document.getElementById("img_trade").src='imgs/trade_up.png';
	document.getElementById("label_trade").style.color="#8a8a8a";
	document.getElementById("img_statistic").src='imgs/statistic_up.png';
	document.getElementById("label_statistic").style.color="#8a8a8a";
	document.getElementById("img_op_record").src='imgs/order_up.png';
	document.getElementById("label_op_record").style.color="#8a8a8a";
}

//局部刷新页面,返回结果放在resdiv中
function load_page(currenturl, resdiv)
{	
	$("#"+resdiv).load( currenturl, function( response, status, xhr ) {
		$("#"+resdiv).html(response);
	});
}

// 验证表单是否为空， 通过$.fn 扩展jQuery方法
function my_validate(element, tips){
	if($("#" + element).val() == "" || $.trim($("#" + element).val()).length == 0){
    alert(tips);
    throw SyntaxError(); //如果验证不通过，则不执行后面
  }
}

// 判断输入是否为数字
function checkRate(nubmer) {
　　var re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/ 
　　if (!re.test(nubmer)) {
　　　　alert("请输入数字");
　　　　return false;
　　}else{
	   return true;
	}
}

// 获取当前用户的id
function get_managerid(){
	var storage=window.localStorage;
	var managerid = storage["managerid"];
	return managerid;
}
// 判断用户是否已经登陆, 未登录跳转至登陆界面
function check_login_state(){
	var user_login_state = get_managerid();
	if(user_login_state == null){
		window.location.href="login.html";
	}
}