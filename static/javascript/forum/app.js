function answer(id_mess){
    exit_menu();
    var la = document.getElementById("edit-label");
    var t = document.getElementById("text" + id_mess).textContent.trim();
     if (t == ""){
        t = "файл";
    };
    la.innerHTML = t;
    la.innerHTML += '<button type="button" onclick="close_edit()" class="btn-close edit-btn-close" aria-label="Close"></button>'
    la.style.display = "block";
    document.getElementById("html_m").value = `<button id="answer" class="answer-a"
    onclick="answer_color('m${id_mess}')">${t}</button>`;
}


function edit_post(id_mess, text){
    var chat_id =  app.c_chat.chat_id;
    globalThis.edit_id = "";
    app.ui.edit_flag = false;
    document.getElementById("edit-label").style.display = "none";
    $.ajax({
    url: '/forum/edit_message',
    type: 'POST',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"id":id_mess, "new_text": text, "chat_id": app.c_chat.chat_id}),
    success: function(json){
        close_edit();
    },
    error: function(err) {
        console.error(err);
    }
});
}


function delete_mess(id_mess){
    exit_menu();
      $.ajax({
    url: '/forum/delete',
    type: 'DELETE',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"id":id_mess, "chat_id": app.c_chat.chat_id}),
    error: function(err) {
        console.error(err);
    }
});
    }