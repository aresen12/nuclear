function get_data_start_teach(){
    $.ajax({
        url: `/b/get_data_start/w0`,
        type: 'GET',
        dataType: 'json',
        contentType:'application/json',
        success: function(json){
            load_data_DB(json);
            start_UI(re);
            console.log(json)
            },
        error: function(err) {
            console.error(err);
        }
});

}


function get_data_start_task(condition){
    $.ajax({
        url: `/b/get_data_start/${condition}`,
        type: 'GET',
        dataType: 'json',
        contentType:'application/json',
        success: function(json){
            load_data_DB(json);
            start_UI(re);
            document.getElementById('global_error_d').style.display = "none";
            document.getElementById('game_select_d').style.display = "none";
        },
        error: function(err) {
            console.error(err);
        }
});
}
