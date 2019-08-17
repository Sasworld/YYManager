// 退出账户
function quit_account(){
	var certain_cancel = window.confirm("确认退出当前账户？");
	if(certain_cancel){
		localStorage.clear();
		window.location.href = "login.html";
	}else{
		
	}
}