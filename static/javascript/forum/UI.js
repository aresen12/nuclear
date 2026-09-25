const emoji = ["🔥", "❤️", "👍", "😁", "👎", "❤️‍🔥", "😭", "👌", "😨",  "🍌", "🌭", "💋",
"🤯", "👏", "🍾",  "💘", "🥰",  "🤔", "😱", "🤬", "😢", "🎉", "🤩", "🤮", "💩", "🙏",
"🕊️", "🤡", "🥱", "🥴", "😍", "🐳", "🌚", "💯", "😂", "⚡️", "🏆", "💔", "🤨", "😐", "🍓", "🖕",
 "😈", "😴", "🤓", "👻", "👨‍💻", "🙈", "👀", "😇", "🤝", "✍️", "🤗", "🫡", "🎅", "🎄", "⛄️", "💅",
"🤪", "🗿", "🆒", "🙉", "🦄", "😘", "💊", "🙊", "😎", "👾", "🤷", "🤷‍♀️", "🤷‍♂️", "😡"];

function showdiv1(Div) {
    var x = document.getElementById(Div);
    if(x.style.display=="none") {
        x.style.display = "block";
        return false;
    }
    x.style.display = "none";
    return true;
}


function exit_menu(){
    if (globalThis.menu_id != ""){
        try{
            document.getElementById(globalThis.menu_id).style.display = "none";
        } catch (error){}
        globalThis.menu_id = "";
    }
}



function gener_html(id_m, text, time, html_m, other, read, name_sender, pinned, file_="") {
//    document.getElementById("last_mess_id").value = id_m;
     const messagesDiv = document.getElementById('content');
     const messageItem = document.createElement('div');
     messageItem.id = 'm' + id_m;
    images = ["bmp", "jpg", "png", "svg", "webp", "jpeg"]
    audio = ["mp3", "flac", "m4a"]
    video = ["mp4", "mov"]
    if (other) {
        messageItem.classList = 'message-other';
    } else{
        messageItem.classList = 'my-message';
    };
    const message_text = document.createElement('p');
    message_text.textContent = text;
    message_text.classList = "text-in-mess";
    message_text.id = 'text' + id_m;
    const html_text = document.createElement('div');
    if (html_m != ""){
        html_text.innerHTML = html_m;
    }
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
    if (file_){
        var ras = file_[1].split(".");
        ras = ras[ras.length - 1];
        if (images.includes(ras)){
            var images_list = document.getElementById("images_list");
            if (images_list.value == ""){
                images_list.value = file_[1];
            } else {
                images_list.value += " " + file_[1];
            }
            const button = document.createElement('button');
            button.classList = "info-btn";
            button.setAttribute("onclick", `showImg('m${id_m}', '${file_[1]}')`);
            const img_elem = document.createElement('img');
            img_elem.classList = "mess-img";
            img_elem.src = "/static/img/" + file_[1];
            button.appendChild(img_elem);
            messageItem.appendChild(button);
        } else {
             if (audio.includes(ras)){
                 var w = window.innerWidth * 0.187;
                 if (app.ui.mobile){
                        w = window.innerWidth * 0.57;
                 };
                 const audio2 = document.createElement("audio");
                 audio2.classList = "audio";
                 audio2.src = '/static/img/' + file_[1];
                 audio2.textContent = file_[0];
                 audio2.style.width = w + 'px';
                 audio2.controls = 'controls';
                 messageItem.appendChild(audio2);
            }else {
                if (video.includes(ras)){
                    var w = window.innerWidth * 0.18;
                    if (app.ui.mobile){
                        w = window.innerWidth * 0.57;
                    };
                    const video = document.createElement("video");
                    video.classList = "audio";
                    video.controls = 'controls';
                     video.src = '/static/img/' + file_[1];
                  video.textContent = file_[0];
                     video.style.width = w + 'px';
                 messageItem.appendChild(video);
                } else{
                    const a_ = document.createElement('a');
                    a_.classList = "my-a";
                    a_.href = '/static/img/' + file_[1];
                    a_.textContent = file_[0];
                    a_.setAttribute('download', file_[0]);
                    messageItem.appendChild(a_);
                }
        }
    }
    };
     const time_div = document.createElement('p');
     time_div.classList = "time-mess";
     if (other){
        time_div.textContent = time + " " + name_sender;
     }else{
        time_div.textContent = time;
     }
     messageItem.appendChild(time_div);
    if (read){
        time_div.innerHTML += '<button type="button" class="btn "\
         data-bs-toggle="tooltip" data-bs-placement="top" title="прочитано">ᨒ</button>';
    } else{
        time_div.innerHTML += `<button id="mr${id_m}" type="button" class="btn "
         data-bs-toggle="tooltip" data-bs-placement="top" title="доставлено">ᨈ</button>`;
    }
    const menu_con = document.createElement("div");
    menu_con.style.display = "none";
    menu_con.classList.add("context-menu-open");
    menu_con.id = "mm" + id_m;
    messageItem.appendChild(menu_con);
    messageItem.setAttribute("oncontextmenu", `open_menu_mess("m${id_m}");  return false`);
    messagesDiv.appendChild(messageItem);
     scrollToBottom("content");
//     if(pinned){
//        add_pinned(id_m);
//        messagesDiv.style.height = "100%";
//     }
}


setSelectionRange = function(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
      input.focus();
      input.setSelectionRange(selectionStart, selectionEnd);
    }
    else if (input.createTextRange) {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveEnd('character', selectionEnd);
      range.moveStart('character', selectionStart);
      range.select();
    }
};

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


function scrollToBottom(elementId) {
    var div = document.getElementById(elementId);
    div.scrollTop = div.scrollHeight;
}


function go(){
    setSelectionRange(document.getElementById("about"), globalThis.position, globalThis.position);
}


function show(){
    var chat_id = app.c_chat.chat_id;
    var request_url =  "/forum/get_json_mess";
      $.ajax({
    url: request_url,
    type: 'POST',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"chat_id": chat_id}),
    success: function(json_mess){
        var cont = document.getElementById("content");
        var date = "";
        cont.innerHTML = "";
        for (let i = 0; i < json_mess["messages"].length; i++){
            var c_m = json_mess["messages"][i];
            console.log(app.id_user, c_m["id_sender"])
            var other = !(app.id_user == c_m["id_sender"]);
            console.log(other);
            var file = "";
            if (c_m["file"]){
                file = json_mess["files"][c_m["file"]];
            };
            var time = c_m["time"].split(" ");
            if (date != time[0]){
                var time2 = time[0].split("-");
                date = time[0];
                cont.innerHTML += '<div class="date_k">' + time2[2]+ "." + time2[1] + "." + time2[0] + '</div>';
            };
            if (c_m["type"] == 3){
            gener_sticker(c_m["id"], time[1].split(".")[0], c_m["html_m"], other, c_m['read'], c_m["name_sender"]);
        } else if (c_m["type"] == 2){
            gener_emoji(c_m["id"],  c_m["html_m"], other, c_m["text"]);
        } else if (c_m["type"] == 4){
            gener_voting(c_m["id"], c_m["text"], JSON.parse(c_m["html_m"]), other, c_m['read'], c_m["name_sender"], time[1].split(".")[0]);
        }else {
            gener_html(c_m["id"], c_m["text"], time[1].split(".")[0],
            c_m["html_m"],  other, c_m['read'], c_m["name_sender"], file);
        }
        }
//        for (let i = 0;i < json_mess["pinned_message"].length; i++){
//            add_pinned(json_mess["pinned_message"][i]);
//        }
        cont.style.height = "100%";
        cont.innerHTML += '<div id="pos"><div id="pos2"></div></div>';
        go();
//        set_read(app.c_chat.chat_id);
        },
    error: function(err) {
        console.error(err);
    }
});
    }


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


function gener_emoji(id_mess, html_m, other, id_emoji){
    var em_div = document.getElementById("em" + html_m);
//    em_div.classList = "emoji";
    if (document.getElementById(html_m + "emoji_btn_id" + id_emoji)){
        var btn = document.getElementById(html_m + "emoji_btn_id" + id_emoji);
        if (btn.textContent.length  && Number(btn.textContent.split(" ")[1])){
            btn.textContent = `${emoji[id_emoji]} ${(Number(btn.textContent.split(" ")[1]) + 1)}`;
        } else {
              btn.textContent = emoji[id_emoji] + " 2";
        }
    } else {
        var btn = document.createElement("button");
        btn.textContent = emoji[id_emoji];
        btn.classList = "btn emoji";
        btn.id = html_m + "emoji_btn_id" + id_emoji;
        em_div.appendChild(btn);
    }
    if (!other){
            btn.style.background = "#3574e8";
             btn.setAttribute("onclick", `unset_emoji(${id_mess})`);
    } else {
        if (btn.style.background != "#3574e8") {
            btn.setAttribute("onclick", `set_emoji(${html_m}, ${id_emoji})`);
        }
    }
}





function open_menu_mess(id_mess){
    var chat_id = app.c_chat.chat_id;
    var name_functions = ["answer", "delete_mess", "copyToClipboard"];
    var titles = ["ответить", "удалить", "скопировать"];
    var ul = document.createElement("ul");
    ul.id = "ul_on_menu"  + id_mess.slice(1);
    const curr_m = document.getElementById("m" + id_mess);
    if (app.ui.mobile && curr_m.style.display == "block") {
        return 200;
    }
    if (globalThis.menu_id != ""){
        try{
        exit_menu();
        } catch(err) {}
    };
    for (let i = 0; i < name_functions.length; i++){
        var li = document.createElement("li");
        li.textContent = titles[i];
        li.setAttribute("onclick", `${name_functions[i]}(${id_mess.slice(1)}, "${chat_id}")`);
        ul.appendChild(li);
    }
    if (document.getElementById(id_mess).className == "my-message") {
        var li = document.createElement("li");
        li.textContent = "редактировать";
        li.setAttribute("onclick", `edit(${id_mess.slice(1)})`);
        ul.appendChild(li);
    }
    const emoji_div2 = document.createElement("div");
    emoji_div2.id = "emoji" + id_mess.slice(1);
    for (let i = 0; i < 4; i++){
        var btn_emoji = document.createElement("button");
        btn_emoji.classList = "btn emoji-button";
        btn_emoji.textContent = emoji[i];
        btn_emoji.setAttribute("onclick", `set_emoji(${id_mess.slice(1)}, ${i})`);
        emoji_div2.appendChild(btn_emoji);
    }
    var btn_emoji = document.createElement("button");
        btn_emoji.classList = "btn emoji-button";
        btn_emoji.textContent = "⋁";
        btn_emoji.setAttribute("onclick", `show_more_emoji(${id_mess.slice(1)})`);
        emoji_div2.appendChild(btn_emoji);
    //⋎∨⋁
    if (id_mess[0] == "e"){
        id_mess = id_mess.substring(1, id_mess.length);
    }
    curr_m.innerHTML = "";
    curr_m.appendChild(emoji_div2);
    curr_m.appendChild(ul);
    globalThis.menu_id = "m" + id_mess;
    showdiv1("m" + id_mess);
    window.location.hash = "#m" + id_mess;
    return false;
}


function show_more_emoji(id_mess){
    const curr_m = document.getElementById("mm" + id_mess);
    document.getElementById("ul_on_menu" + id_mess).innerHTML = "";
    document.getElementById("emoji" + id_mess).innerHTML = "";
    const emoji_div2 = document.createElement("div");
    for (let i = 0; i < emoji.length; i++){
        var btn_emoji = document.createElement("button");
        btn_emoji.classList = "btn emoji-button";
        btn_emoji.textContent = emoji[i];
        btn_emoji.setAttribute("onclick", `set_emoji(${id_mess}, ${i})`);
        emoji_div2.appendChild(btn_emoji);
    }
    curr_m.appendChild(emoji_div2);
}


function copyToClipboard(id_m) {
    var t = document.getElementById("text" + id_m).textContent.trim();
    navigator.clipboard.writeText(t);
    exit_menu();
  }


function unset_emoji(id_message){
    delete_mess(id_message);
}



function close_edit() {
    app.edit_id = "";
    app.ui.edit_flag = false;
    document.getElementById("edit-label").style.display = "none";
}
