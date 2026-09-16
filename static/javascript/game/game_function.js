function get_data_start_teach(){
    $.ajax({
        url: `/b/get_data_start/w0`,
        type: 'GET',
        dataType: 'json',
        contentType:'application/json',
        success: function(json){
            load_data_DB(json);
            console.log(json)
//            showdiv1("game_select_d");
            },
        error: function(err) {
            console.error(err);
        }
});
}