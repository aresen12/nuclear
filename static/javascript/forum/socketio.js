const socket = io.connect();


function set_emoji(id_mess, id_emoji){
    var div = document.getElementById(id_mess + "emoji_btn_id" + id_emoji);
    if (div) {
        if (div.style.background == "#6699cc"){
            document.getElementById(menu_id).style.display = "none";
            app.ui.menu_id = '';
            alert(500);
            return 500;
        }
    }
    var chat_id = app.c_chat.chat_id;
    socket.emit('emoji', {chat_id: chat_id, id_mess: id_mess, value: id_emoji});
    if (app.ui.menu_id){
        document.getElementById(menu_id).style.display = "none";
        app.ui.menu_id = '';
    }
}


function send_io_mess() {
    const chat_id = app.c_chat.chat_id;
    const input = document.getElementById('about');
    const message = input.value;
    const html2 = document.getElementById('html_m');
    const html_m = html2.value;
    if (message) {
        // Send message to server
        socket.emit('room_message', {room: chat_id, message: message, html: html_m });
        input.value = '';
        html2.value = '';
    }
}


socket.on('emoji_client', (data) => {
    gener_emoji(data["id_emoji"], data["id_mess"], !(data["id_sender"] == app.id_user), data['value'])
});


socket.on('message', (data) => {
    console.log("message");
    const messagesDiv = document.getElementById('content');
//    document.getElementById("last_mess_id").value = data["id_m"];
//    set_read(document.getElementById("chat_id").value);
    var other = 1;
    if (app.id_user == data["id_sender"]){
        var other = 0;
    }
    if (data["type"] == 3){
        gener_sticker(data["id_m"], data["time"].split(".")[0], data["html"], other, 0, data["name"], 0);
    } else{
        gener_html(data["id_m"], data["message"], data["time"], data["html"], other, data["read"],
         data["name"], data["pinned"])
    }
});


function gener_sticker(id_m, time, html_m, other, read, name_sender){
     if (other && !read && !vis){
                notification("стикер", document.getElementById('name_chat').innerText);
            }
     const messagesDiv = document.getElementById('content');
     const messageItem = document.createElement('div');
    if (other) {
        messageItem.classList = 'message-other';
    } else{
        messageItem.classList = 'my-message';
    };
    const message_text = document.createElement('p');
    message_text.classList = "text-in-mess";
    message_text.id = 'text' + id_m;
    const html_text = document.createElement('div');
    html_text.innerHTML = html_m;
    var em_div = document.createElement("div");
    em_div.id = "em" + id_m;
    messageItem.appendChild(html_text);
    messageItem.appendChild(message_text);
    messageItem.appendChild(em_div);
    messageItem.role = "alert";
    var onclick = "";
    if (app.ui.mobile){
        messageItem.setAttribute("onclick", `open_menu_mess('m${id_m}')`);
    }
     const time_div = document.createElement('p');
     time_div.classList = "time-mess";
     if (other){
        time_div.textContent = time + " " + name_sender;
     }else{
        time_div.textContent = time;
     }
     messageItem.appendChild(time_div);
    if (read){
        time_div.innerHTML += '<button type="button" class="info-btn "\
         data-bs-toggle="tooltip" data-bs-placement="top" title="прочитано">ᨒ</button>';
    } else{
        time_div.innerHTML += '<button type="button" class="info-btn "\
         data-bs-toggle="tooltip" data-bs-placement="top" title="доставлено">ᨈ</button>';
    }
    const menu_con = document.createElement("div");
    menu_con.style.display = "none";
    menu_con.classList.add("context-menu-open");
    menu_con.id = "mm" + id_m;
    messageItem.appendChild(menu_con);
    messageItem.id = `m${id_m}`;
    messageItem.style.background = "none";
    messageItem.style.color = "white";
    messageItem.setAttribute("oncontextmenu", `open_menu_mess("m${id_m}");  return false`);
    messagesDiv.appendChild(messageItem);
     scrollToBottom("content");
}


socket.on('delete_message', (data) => {
    document.getElementById("m" + data["message_id"]).remove();
        console.log("delete" + data["message_id"]);
});


socket.on('un_pinned_message', (data) => {
    delete_pin_message(data["id_mess"]);
});


socket.on('delete_emoji', (data) => {
    document.getElementById(`${data["message_id_on_emoji"]}emoji_btn_id${data["id_emoji"]}`);
    var btn = document.getElementById(data["message_id_on_emoji"] + "emoji_btn_id" + data["id_emoji"]);
    if (data['id_sender'] == app.id_user){
        btn.style.background = "#91b3f2";
        btn.setAttribute("onclick", `set_emoji(${data["message_id_on_emoji"]}, ${data["id_emoji"]})`);
    }
    console.log(btn.textContent);
    if (btn.textContent.length  && Number(btn.textContent.split(" ")[1])){
        btn.textContent = emoji[data["id_emoji"]] + (Number(btn.textContent.split(" ")[1]) - 1);
    } else {
        var em_div = document.getElementById("em" + data["message_id_on_emoji"]);
        btn.remove();
    }
})
