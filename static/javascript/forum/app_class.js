class Application{
    constructor(id_user, chat_id, status){
        this.id_user = id_user;
        this.chat_list = [];
        this.ui = new UIdata();
        this.edit_id = 0;
        this.c_chat = new CurrentChat(chat_id, status);
    }

    search_chat(){

        for (let i = 0; i < this.chat_list.length; i++){

        }
    }
}



class UIdata{
    constructor(){
        this.answer_flag = false;
        this.edit_flag = false;
        this.mobile = false;
        this.enter_flag = true;
        this.menu_id = "";
        this.check_mobile();
    }
    check_mobile(){
        if ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i .test(navigator.userAgent)) && (auto == 1)){
            this.mobile = true;
            mobile_settings();
        }
    }

    set_enter(key) {
        if(key == 2) {
            document.cookie = "enter=2";
            this.enter_flag = false;
        } else {
            this.enter_flag = true;
            document.cookie = "enter=1";
        }
}
}


function mobile_settings() {
        var x = document.getElementById("background-img");
        var y = document.getElementById("container-mess");
        x.style.display = "none";
        var button = document.getElementById("button").style.visibility = 'hidden';
        y.style.display = "none";
}


class Chat{
    constructor(chat_id, status, name=""){
        this.chat_id = chat_id;
        this.status = status;
        this.name = name;
    }
}


class CurrentChat extends Chat{
    constructor(chat_id, status){
        super(chat_id, status);
        this.image_list = [];
        this.pinned_list = [];
        this.file_list = [];
    }
}