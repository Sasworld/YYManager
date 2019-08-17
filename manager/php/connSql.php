<?php
	$servername = "47.110.83.139";
	$username = "root";
	$password = "6130e41bb94a";
	$dbname = "testyuyuan";
	// 创建连接
	$conn = mysqli_connect($servername, $username, $password, $dbname);
	// 检测连接
	if (!$conn) {
	    die("连接失败: " . mysqli_connect_error());
	}
	$conn->query('set names utf8');
	$sql_get_manager_id = "select uid from user where state='manager'"; // 获取管理员id
	$res_manager_id = $conn->query($sql_get_manager_id);
	if ($res_manager_id->num_rows > 0) {
	    $row = $res_manager_id->fetch_assoc();
	    $managerid = $row["uid"];
	}?>