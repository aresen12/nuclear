function display_hi(){
    document.getElementById("select").style.display = "none";
    document.getElementById("select_task").style.display = "none";
    document.getElementById("teach_alert").innerHTML = `<p>Добро пожаловать на Блочный щит. Сейчас мы вместе выведем реактор на мощность в 20 МВТ<p>
    <button class="btn btn-game btn-warning" onclick="game.teacher.next()">Дальше</button>
    `;
}

function display_syz_info(){
    document.getElementById("teach_alert").innerHTML = `<p>Для того, чтобы увеличить мощность, нужно извлечь часть
     регулирующих стержней, а чтобы снизить наоборот опустить их в реактор.<p>
    <button class="btn btn-game btn-warning" onclick="game.teacher.next()">Дальше</button>
    `;
}


function display_q_next(){
    showdiv1('game_select_d');
    document.getElementById("teach_alert").innerHTML = `<p>Хочешь продолжить изучать другие должности в симуляторе<p>
    <button class="btn btn-game btn-warning" onclick="game.teacher.next()">Хочу</button>
    <button class="btn btn-game btn-danger" onclick="showdiv1('game_select_d')">пока освоюсь с этим</button>
    `;
}

function display_viyb_info(){
    window.location.hash = "#viyb";
    document.getElementById("teach_alert").innerHTML = `<p>Теперь мы переместились не пульт ВИУБ(Ведущего инженера
    по управлению блоком. Его задача контролировать охлаждение реактора.<p>
    <button class="btn btn-game btn-warning" onclick="game.teacher.next()">Дальше</button>
    `;
}


function display_gcn_info(){
    document.getElementById("teach_alert").innerHTML = `<p>Реактор охлаждается водой. В него её подают Главные
    циркуляционные насосы(ГЦН). Чтобы увеличить подачу воды нужно нажать кнопку Б напротив насоса.<p>
    <button class="btn btn-game btn-warning" onclick="game.teacher.next()">Дальше</button>
    `;
    }


function display_pvs_info(){
    document.getElementById("teach_alert").innerHTML = `<p>Попадая в реактор вода нагревается и частично испаряется.
    И попадает в Барабан сепараторы(БС), где пароводяная смесь(ПВС) разделяется на воду и пар.<p>
    <button class="btn btn-game btn-warning" onclick="game.teacher.next()">Дальше</button>
    `;
}


function add_tolip(id_div, text, id_t, top=true){
    let cont = document.getElementById(id_div);
    if (top){
    cont.innerHTML =   `<div onclick="game.teacher.next()" id="${id_t}" class="cont-tooltip">
                                 <div class="tooltip" >${text} </div>
                                 <div class="n-tooltip"></div>
                             </div>` + cont.innerHTML;
    } else {
        cont.innerHTML = cont.innerHTML + `<div onclick="game.teacher.next()" id="${id_t}" class="cont-tooltip-bottom">
        <div class="v-tooltip"></div>
                                 <div class="tooltip" >${text} </div>

                             </div>`;
    }

}
function delete_toolip(id_div){
    document.getElementById(id_div).remove();
}


function alert_block(id_div){
    let div = document.getElementById(id_div);
    console.log(div);
    if (div.style.border == "2px solid red"){
        div.style.border = "";
    } else {
        div.style.border = "2px solid red";
    }


}
// document.getElementById("teach_alert").textContent