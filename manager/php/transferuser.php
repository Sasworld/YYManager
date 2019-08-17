<?php
	include("connSql.php");
	include("../aliyun-dysms-php-sdk/api_demo/SmsDemo.php");
	$string_data = $_POST['datas']; //获取插入的表的索引
	$array_data = json_decode($string_data, true);
	$uid = $array_data["uid"];
	$orderid = $array_data["orderid"];
	$uname = $array_data["uname"];
	$sellamount = $array_data["sellamount"];

	//$uid = "17615849160";
	//$orderid = "JG868490";
	//$uname = "sas";
	//$sellamount = "6000";
//	$uid = "15755511770";
//	$orderid = "JG799786";
//	$uname = "li";
//	$sellamount = "1000";
	$sql_query_need = "select needamount,uid from user,paidan where pduid=uid and uname='$uname' and needamount>0";
	$result = $conn->query($sql_query_need);
	if ($result->num_rows > 0) {
	    $row = $result->fetch_assoc();
	    $needamount = $row["needamount"];
	    $buyerid = $row["uid"];
	    if($sellamount > $needamount){
	    	$arr = array(
				'res'=>"超出排单请求", 
			);
	    }else{
	    	// 开始事务
			mysqli_query($conn, 'BEGIN');
	    	mysqli_query($conn,"update orderform set buyerid='$buyerid' where orderid='$orderid';");
			$affectRow = mysqli_affected_rows($conn);
			if ($affectRow == 0 || mysqli_errno($conn)) {  
				// 回滚事务重新提交  
				mysqli_query($conn, 'ROLLBACK');
			    $arr = array(
					'res'=>"转交失败", 
				);
			} else {
				mysqli_query($conn,"update paidan set needamount=needamount-'$sellamount' where pduid='$buyerid' and needamount>0;");				$affectRow = mysqli_affected_rows($conn);
				if ($affectRow == 0 || mysqli_errno($conn)) { 
					// 回滚事务重新提交  
					mysqli_query($conn, 'ROLLBACK');
				    $arr = array(
						'res'=>"转交失败", 
					);
				} else {
					mysqli_query($conn, 'COMMIT');
					$response = SmsDemo::sendSms($buyerid);
					$arr = array(
						'res'=>"转交成功", 
					);
				}
			}
	    }
	} else{
		$arr = array(
			'res'=>"查询失败", 
		);
	}
	$conn->close();
	echo json_encode($arr);
?>