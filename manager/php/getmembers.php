<?php
	include("connSql.php");
	$string_data = $_POST['datas']; //获取插入的表的索引
	$array_data = json_decode($string_data, true);
	$query_type = $array_data["query_type"];
	// 1：查询所有， 2：按条件查询, 3：获取今日注册的会员
	if($query_type == "1"){
		$jsonArray = array();
		$sql_query_active_member = "select * from user where state='1' and uid<>'$managerid' order by regdate desc"; // 获取激活的会员
		$sql_query_unactive_member = "select * from user where state='0' order by regdate desc"; // 获取未激活的会员
		$sql_query_freeze_member = "select * from user where state='2' order by regdate desc"; // 获取冻结的会员
		$jsonArray = get_team_member($conn, $sql_query_active_member, $jsonArray);
		$jsonArray = get_team_member($conn, $sql_query_unactive_member, $jsonArray);
		$jsonArray = get_team_member($conn, $sql_query_freeze_member, $jsonArray);
	}else if($query_type == "2"){
		$query_info = $array_data["queryinfo"];
		$jsonArray = array();
		$sql_query_member = "select * from user where uid like '%$query_info%' or uname like '%$query_info%' order by regdate desc";
		$jsonArray = get_team_member($conn, $sql_query_member, $jsonArray);
	}else if($query_type == "3"){
		$jsonArray = array();
		$sql_query_member = "select * from user where TO_DAYS(regdate) = TO_DAYS(NOW()) order by regdate desc";
		$jsonArray = get_team_member($conn, $sql_query_member, $jsonArray);
	}
	$conn->close();
	echo json_encode($jsonArray);
	
	// 获取会员信息
	function get_team_member($conn, $sql, $jsonArray){
		$result = $conn->query($sql);
		if ($result->num_rows > 0) {
		    // 输出数据
		    while($row = $result->fetch_assoc()) {
		    	$arr = array(
					'uid'=>$row["uid"],
					'uname'=>$row["uname"],
					'parentname'=>$row["parentname"],
					'principal'=>$row["principal"],
					'stars'=>$row["stars"],
					'paidancoin'=>$row["paidancoin"],
					'activecode'=>$row["activecode"],
					'regdate'=>$row["regdate"],
					'bank'=>$row["bank"],
					'bonus'=>$row["bank"],
					'subbank'=>$row["subbank"],
					'banknumber'=>$row["banknumber"],
					'ownername'=>$row["ownername"],
					'alipay'=>$row["alipay"],
					'state'=>$row["state"],
				);
				$jsonArray[] = ($arr);
		    }
		}
		return $jsonArray;
	}
?>