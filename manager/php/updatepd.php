<?php
	include("connSql.php");
	$string_data = $_POST['datas']; //获取插入的表的索引
	$array_data = json_decode($string_data, true);
	$pdid = $array_data["pdid"];
	$state = $array_data["state"];
	mysqli_query($conn,"update paidan set pdstate='$state' where pdid='$pdid';");
	$affectRow = mysqli_affected_rows($conn);
	if ($affectRow == 0 || mysqli_errno($conn)) {  
	    $arr = array(
			'res'=>"设置失败", 
		);
	} else {
		$arr = array(
			'res'=>"设置成功", 
		);
	}
	$conn->close();
	echo json_encode($arr);
?>