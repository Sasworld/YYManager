
var user_info = new Array();
// ============================ 搜索订单 ============================
function search_paidan(){
	var search_info = $('#text_search_paidan').val();
	get_paidan_information("2", search_info);
}

// 隐藏排单
function close_paidan(obj){
	var row = obj.parentNode.parentNode.rowIndex;
	var table = document.getElementById("table_paidan_list");
	var pdid = table.rows[row].cells[0].innerHTML;//排单id
	if(table.rows[row].cells[7].getElementsByTagName("span")[1].innerHTML == "隐藏排单"){
		var state = 2;
	}else{
		var state = 1;
	}
	var set_info = {"pdid":pdid, "state":state};
	$.ajax({
        type: "POST",
        url: "php/updatepd.php" ,
        data: {datas:JSON.stringify(set_info)},
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",//设置字符集
        success: function(json) {
        	alert(json.res);
        	var query_info = $("#text_search_paidan").val();
        	// 刷新页面
        	if(query_info == ""){
        		get_paidan_information("1", ""); 
        	}else{
        		get_paidan_information("2", query_info);
        	}
        },
        error: function(){
        	alert("请求失败");
        }
    });
}

// 交割
function manage_jiaoge(obj){
	//得到当前所在行
	var row = obj.parentNode.parentNode.rowIndex;
	var table = document.getElementById("table_paidan_list");
	var user_name = table.rows[row].cells[0].innerHTML;//
	var paidanid = table.rows[row].cells[0].innerHTML;//
	var trademoney = table.rows[row].cells[3].innerHTML-table.rows[row].cells[4].innerHTML;//
	var state = table.rows[row].cells[5].innerHTML;
	if (state == "已完成") {
		alert("该单已完成");
	} else{
		if (confirm("确认交割该单？")) {
			var user_info = {"trademoney":trademoney, "paidanid":paidanid};
			$.ajax({
		        type: "POST",
		        url: "php/jiaoge.php" ,
		        data: {datas:JSON.stringify(user_info)},
		        dataType: "json",
		        contentType: "application/x-www-form-urlencoded; charset=utf-8",//设置字符集
		        success: function(json) {
		    		alert(json.result);
		    		get_paidan_information("1", "");
		        },
		        error: function(){
		        	alert("请求失败");
		        }
		    });
		}
	}
}