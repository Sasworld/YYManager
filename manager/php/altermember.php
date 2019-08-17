<?php
	include("connSql.php");
	$string_data = $_POST['datas']; //获取插入的表的索引
	$array_data = json_decode($string_data, true);
	$memberid = $array_data["memberid"];
	$bank = $array_data["bank"];
	$subbank = $array_data["subbank"];
	$banknumber = $array_data["banknumber"];
	$ownername = $array_data["ownername"];
	$alipay = $array_data["alipay"];
	
//	$memberid = "15755511770";
//	$bank = "bank";
//	$subbank = "subbank";
//	$banknumber = "banknumber";
//	$ownername = "ownername";
//	$alipay = "alipay";
	mysqli_query($conn,"update user set bank='$bank',alipay='$alipay',subbank='$subbank',banknumber='$banknumber',ownername='$ownername' where uid='$memberid';");
	$affectRow = mysqli_affected_rows($conn);
	if ($affectRow == 0 || mysqli_errno($conn)) {  
	    $arr = array(
			'res'=>"修改失败，请稍后重试", 
		);
	}else{
		$arr = array(
			'res'=>"已成功修改账户信息", 
		);
	}
	$conn->close();
	echo json_encode($arr);	
?>