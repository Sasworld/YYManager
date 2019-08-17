<?php
	include("connSql.php");
	$string_data = $_POST['datas']; //获取插入的表的索引
	$array_data = json_decode($string_data, true);
	$memberid = $array_data["memberid"];
	mysqli_query($conn,"update user set state='1' where uid='$memberid';");
	$affectRow = mysqli_affected_rows($conn);
	if ($affectRow == 0 || mysqli_errno($conn)) {  
	    $arr = array(
			'res'=>"激活失败，请稍后重试", 
		);
	} else {
		$arr = array(
			'res'=>"账户已激活", 
		);
	}
	$conn->close();
	echo json_encode($arr);	
?>