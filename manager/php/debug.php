<?php
	include("connSql.php");
	$string_data = $_POST['datas']; //获取插入的表的索引
	$query_info = "";
	$sql_query_order = "select * from orderform,user where sellerid<>'$managerid' and uid=buyerid and (uname like '%$query_info%' or uid like '%$query_info%') order by orderstate asc";
	$jsonArray = get_order_form($conn, $sql_query_order, $jsonArray);
	$conn->close();
	echo json_encode($jsonArray);
	
	// 获取订单信息
	function get_order_form($conn, $sql, $jsonArray){
		$result = $conn->query($sql);
		if ($result->num_rows > 0) {
		    // 输出数据
		    while($row = $result->fetch_assoc()) {
		    	$buyerid = $row["buyerid"];
		    	$sellerid = $row["sellerid"];
		    	$sql_get_buyer_name = "select uname from user where uid='$buyerid'";
		    	$sql_get_seller_name = "select uname from user where uid='$sellerid'";
		    	$row_get_buyer_name = $conn->query($sql_get_buyer_name)->fetch_assoc();
		    	$row_get_seller_name = $conn->query($sql_get_seller_name)->fetch_assoc();
		    	$buyername = $row_get_buyer_name["uname"];
		    	$sellername = $row_get_seller_name["uname"];
		    	$arr = array(
					'orderid'=>$row["orderid"],
					'buyername'=>$buyername,
					'sellername'=>$sellername,
					'buyerid'=>$row["buyerid"],
					'sellerid'=>$row["sellerid"],
					'principal'=>$row["principal"],
					'orderstate'=>$row["orderstate"],
					'finishstate'=>$row["finishstate"],
					'orderdate'=>$row["orderdate"],
				);
				$jsonArray[] = ($arr);
		    }
		}
		return $jsonArray;
	}
?>