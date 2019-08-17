<?php
	include("connSql.php");
	$string_data = $_POST['datas']; //获取插入的表的索引
	$array_data = json_decode($string_data, true);
	$query_type = $array_data["query_type"];
	$optype = $array_data["optype"];
	$jsonArray = array();
	// 1：查询所有， 2：按条件查询
	if($optype == ""){
		if($query_type == "1"){
			$sql_query_paidan = "select * from oprecord,user where oprecord.uid=user.uid order by opdate desc"; 
		}else if($query_type == "2"){
			$query_info = $array_data["queryinfo"];
			$sql_query_paidan = "select * from oprecord,user where oprecord.uid=user.uid and (uname like '%$query_info%' or user.uid like '%$query_info%') order by opdate desc";
		}
	}else{
		if($query_type == "1"){
			$sql_query_paidan = "select * from oprecord,user where oprecord.uid=user.uid and optype='$optype' order by opdate desc"; 
		}else if($query_type == "2"){
			$query_info = $array_data["queryinfo"];
			$sql_query_paidan = "select * from oprecord,user where oprecord.uid=user.uid and optype='$optype' and (uname like '%$query_info%' or user.uid like '%$query_info%') order by opdate desc";
		}
	}
	$jsonArray = get_order_form($conn, $sql_query_paidan, $jsonArray);
	$conn->close();
	echo json_encode($jsonArray);
	
	// 获取订单信息
	function get_order_form($conn, $sql, $jsonArray){
		$result = $conn->query($sql);
		if ($result->num_rows > 0) {
		    // 输出数据
		    while($row = $result->fetch_assoc()) {
		    	$arr = array(
					'uid'=>$row["uid"],
					'uname'=>$row["uname"],
					'optype'=>$row["optype"],
					'opedid'=>$row["opedid"],
					'opremarks'=>$row["opremarks"],
					'opdate'=>$row["opdate"],
				);
				$jsonArray[] = ($arr);
		    }
		}
		return $jsonArray;
	}
?>