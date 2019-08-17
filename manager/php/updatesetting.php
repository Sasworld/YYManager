<?php
	include("connSql.php");
	$string_data = $_POST['datas']; //获取插入的表的索引
	$array_data = json_decode($string_data, true);
	$best_paidan = $array_data["best_paidan"];
	$rand_paidan = $array_data["rand_paidan"];
	$wechat = $array_data["wechat"];
	mysqli_query($conn,"update setting set bestpdamount='$best_paidan',randpdamount='$rand_paidan',wechat='$wechat';");
	$affectRow = mysqli_affected_rows($conn);
	if ($affectRow == 0){
		$arr = array(
			'res'=>"设置未改变", 
		);
	} else if(mysqli_errno($conn)) {  
	    $arr = array(
			'res'=>"更新失败", 
		);
	} else {
		$arr = array(
			'res'=>"数据已更新", 
		);
	}
	$conn->close();
	echo json_encode($arr);
?>