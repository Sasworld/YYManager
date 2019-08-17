<?php
	include("connSql.php");
	$string_data = $_POST['datas']; //获取插入的表的索引
	$array_data = json_decode($string_data, true);
	$uid= $array_data["uid"];
	$pw = $array_data["pw"];
	$sql = "SELECT AES_DECRYPT(UNHEX(mgpw), 'sasworld') as mgpw FROM manager where mgid='$uid';";
	$result = $conn->query($sql);
	if ($result->num_rows > 0) {
		$row = $result->fetch_assoc();
		$mgpw = $row["mgpw"];
		if($mgpw == $pw){
			$arr = array(
				'res'=>"1",
			);
		}else{
			$arr = array(
				'res'=>"2",
			);
		}
	} else {
	    $arr = array(
			'res'=>"3",
		);
	}
//	freeze_member($conn);
	reduce_member_pdcoin($conn);
	$conn->close();
	echo json_encode($arr);
	
	// 冻结30天未排单的账号
	function freeze_member($conn){
		$sql_query_user = "select uid,regdate from user"; 
		$result = $conn->query($sql_query_user);
		if ($result->num_rows > 0) {
		    // 输出数据
		    while($row = $result->fetch_assoc()) {
		    	$uid = $row["uid"];
		    	$regdate = strtotime($row["regdate"]);
		    	$sql = "select pddate from paidan where pduid='$uid' order by pddate limit 1";
		    	$pd_res = $conn->query($sql);
				if ($pd_res->num_rows > 0) {
					$pd_row = $pd_res->fetch_assoc();
					$pddate = strtotime($pd_row["pddate"]);
					$curr_time = time();
					$dis_time = ($curr_time - $pddate)/(24*3600);
					if($dis_time > 30){
						mysqli_query($conn,"update user set state='2' where uid='$uid';");
					}
				}else{
					$curr_time = time();
					$dis_time = ($curr_time - $regdate)/(24*3600);
					if($dis_time > 30){
						mysqli_query($conn,"update user set state='2' where uid='$uid';");
					}
				}
		    }
		}
	}
	
	// 扣除未及时收款的账户的排单币
	function reduce_member_pdcoin($conn){
		$sql_query_user = "select orderid, sellerid from orderform where sktype=1"; 
		$result = $conn->query($sql_query_user);
		if ($result->num_rows > 0) {
		    // 输出数据
		    while($row = $result->fetch_assoc()) {
		    	mysqli_query($conn, 'BEGIN');
		    	$memberid = $row["sellerid"];
		    	$orderid = $row["orderid"];
				mysqli_query($conn,"update user set paidancoin=paidancoin-300 where uid='$memberid';");
				$affectRow = mysqli_affected_rows($conn);
				if ($affectRow == 0 || mysqli_errno($conn)) {  
				     
				} else {
					mysqli_query($conn,"update orderform set sktype=0 where orderid='$orderid';");
					if ($affectRow == 0 || mysqli_errno($conn)) {  
				    	mysqli_query($conn, 'ROLLBACK');
					} else {
						// 记录转账
						$opremarks = "未确认收款:".$orderid;
						$opsql = "insert into oprecord(uid, optype, opedid, opremarks) values('17135106727','8', '$memberid', '$opremarks')";
						$conn->query($opsql);
						$affectRow = mysqli_affected_rows($conn);
						if ($affectRow == 0 || mysqli_errno($conn)) {  
						    // 回滚事务重新提交  
						    mysqli_query($conn, 'ROLLBACK');
						} else {
							mysqli_query($conn, 'COMMIT');
						}
					}
				}
		    }
		}
	}
?>