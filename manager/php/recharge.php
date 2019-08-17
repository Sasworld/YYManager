<?php
// ===================== 会员充值 ========================= //
	include("connSql.php");
	$string_data = $_POST['datas']; //获取插入的表的索引
	$array_data = json_decode($string_data, true);
	$memberid = $array_data["memberid"];
	$amount = $array_data["amount"];
	$rechargetype = $array_data["rechargetype"];
	$uname = $array_data["uname"];
//	$memberid = "17512552723";
//	$amount = "1000";
//	$rechargetype = "1";
//	$uname = $array_data["ss"];
	// 开始事务
	mysqli_query($conn, 'BEGIN');
	// 1：排单币充值， 2：激活码充值
	if($rechargetype == "1"){
		$sql_recharge = "update user set paidancoin=paidancoin+'$amount' where uid='$memberid'";
	} else if($rechargetype == "2"){
		$sql_recharge = "update user set activecode=activecode+'$amount' where uid='$memberid'";
	}
	mysqli_query($conn, $sql_recharge);
	$affectRow = mysqli_affected_rows($conn);
	if ($affectRow == 0 || mysqli_errno($conn)) {  
	     $arr = array(
			'result'=>"充值失败", 
		);
	} else {
		if($rechargetype == "1"){
			// 记录转账
			$opremarks = $uname."充值排单币: ".$amount;
			$opsql = "insert into oprecord(uid, optype, opedid, opremarks) values('$managerid','5', '$memberid', '$opremarks')";
		} else if($rechargetype == "2"){
			// 记录转账
			$opremarks = $uname."充值激活码: ".$amount;
			$opsql = "insert into oprecord(uid, optype, opedid, opremarks) values('$managerid','6', '$memberid', '$opremarks')";
		}
		$conn->query($opsql);
		$affectRow = mysqli_affected_rows($conn);
		if ($affectRow == 0 || mysqli_errno($conn)) {  
		    // 回滚事务重新提交  
		    mysqli_query($conn, 'ROLLBACK');
		    $arr = array(
				'result'=>"充值失败", 
			);
		} else {
			mysqli_query($conn, 'COMMIT');
			$arr = array(
				'result'=>"充值成功", 
			);
		}
	}
	$conn->close();
	echo json_encode($arr);
?>