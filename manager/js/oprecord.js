function search_oprecord(){
	var info = $('#text_search_oprecord').val();
	var type = $("#select_query_record_type").val();
	get_record("2", info, type);
}
