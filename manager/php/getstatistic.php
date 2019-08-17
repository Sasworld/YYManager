<?php
	include("connSql.php");
	// 排单金额
	$sql_get_total_paidan = "select sum(pdamount) as money from paidan";
	$sql_get_today_paidan = "select sum(pdamount) as money from paidan where TO_DAYS(pddate) = TO_DAYS(NOW())";
	$total_paidan = get_money($conn, $sql_get_total_paidan);
	$today_paidan = get_money($conn, $sql_get_today_paidan);
	// 交割金额
	$sql_get_total_jiaoge = "select sum(principal) as money from orderform";
	$sql_get_today_jiaoge = "select sum(principal) as money from orderform where TO_DAYS(orderdate) = TO_DAYS(NOW())";
	$total_jiaoge = get_money($conn, $sql_get_total_jiaoge);
	$today_jiaoge = get_money($conn, $sql_get_today_jiaoge);
	// 提现金额
	$sql_get_total_tixian = "select sum(opremarks) as money from oprecord where optype='1'";
	$sql_get_today_tixian = "select sum(opremarks) as money from oprecord where optype='1' and TO_DAYS(opdate) = TO_DAYS(NOW())";
	$total_tixian = get_money($conn, $sql_get_total_tixian);
	$today_tixian = get_money($conn, $sql_get_today_tixian);
	// 排单量显示
	$sql_query_paidan_setting = "select * from setting";
	$result = $conn->query($sql_query_paidan_setting);
	$row = $result->fetch_assoc();
	$best_pd_amount = $row["bestpdamount"];
	$rand_pd_amount = $row["randpdamount"];
	$wechat = $row["wechat"];
	$arr = array(
		'total_paidan'=>$total_paidan,
		'today_paidan'=>$today_paidan,
		'total_jiaoge'=>$total_jiaoge,
		'today_jiaoge'=>$today_jiaoge,
		'total_tixian'=>$total_tixian,
		'today_tixian'=>$today_tixian,
		'best_pd'=>$best_pd_amount,
		'rand_pd'=>$rand_pd_amount,
		'wechat'=>$wechat,
	);
	$conn->close();
	echo json_encode($arr);
	
	function get_money($conn, $sql){
		$result = $conn->query($sql);
		if($result == null){
			$money = 0;
		}else{
			if ($result->num_rows > 0) {
			    $row = $result->fetch_assoc();
			    if($row["money"] == null){
					$money = 0;
				}else{
					$money = $row["money"];
				}
			}else{
				$money = 0;
			}			
		}
		return $money;
	}
?>