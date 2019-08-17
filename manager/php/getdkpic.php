<?php
	include("connSql.php");
	$string_data = $_POST['datas']; //获取插入的表的索引
	$array_data = json_decode($string_data, true);
	$orderid = $array_data["orderid"];
//	$orderid = "JG652247";
	$sql_query_paidan = "select certificate from orderform where orderid='$orderid'"; 
	$result = $conn->query($sql_query_paidan);
	if ($result->num_rows > 0) {
	    $row = $result->fetch_assoc();
    	$arr = array(
			'certificate'=>$row["certificate"],
		);
	}
	$conn->close();
	echo json_encode($arr);
?>