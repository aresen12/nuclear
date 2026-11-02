function display_hi(){
    document.getElementById("select").style.display = "none";
    document.getElementById("select_task").style.display = "none";
    document.getElementById("teach_alert").innerHTML = `<h1 class="color-my-white center-div">Учебная игра</h1>
    <p class="color-my-white teach-text">Добро пожаловать на Блочный щит! Сейчас мы вместе выведем реактор на мощность в 20 МВт.<p>
    <button class="flex-div center-div btn btn-game btn-warning " onclick="game.teacher.next()">Дальше</button>
    `;
}

function display_syz_info(){
    document.getElementById("teach_alert").innerHTML = `
    <h1 class="color-my-white center-div">Учебная игра</h1>
    <p class="color-my-white teach-text">Чтобы увеличить мощность, нужно извлечь часть
     регулирующих стержней. Чтобы снизить мощность, необходимо опустить стержни в реактор.<p>
    <button class="btn btn-game btn-warning flex-div center-div " onclick="game.teacher.next()">Дальше</button>
    `;
}


function display_q_next(){
    showdiv1('game_select_d');
    document.getElementById("teach_alert").innerHTML = `
    <h1 class="color-my-white center-div">Учебная игра</h1>
    <p class="color-my-white teach-text">Хотите ли вы продолжить изучать другие должности в симуляторе?<p>
    <button class="flex-div center-div btn btn-game btn-warning" onclick="game.teacher.next()">Хочу</button>
    <button class="flex-div center-div btn btn-game btn-danger" onclick="showdiv1('game_select_d')">Пока освоюсь с этим</button>
    `;
}

function display_viyb_info(){
    window.location.hash = "#viyb";
    document.getElementById("teach_alert").innerHTML = `
    <h1 class="color-my-white center-div">Учебная игра</h1>
    <p  class="color-my-white teach-text">Теперь мы переместились на пульт ВИУБ (Ведущего инженера
    по управлению блоком). Его задача контролировать охлаждение реактора.</p>
    <button class="flex-div center-div btn btn-game btn-warning" onclick="game.teacher.next()">Дальше</button>
    `;
}


function display_viyt_info(){
    window.location.hash = "#viyt";
    document.getElementById("teach_alert").innerHTML = `
    <h1 class="color-my-white center-div">Учебная игра</h1>
    <p  class="color-my-white teach-text">Теперь мы переместились на пульт ВИУТ (Ведущего инженера
    по управлению Турбинами). Его задача контролировать турбины и электроснабжение блока.</p>
    <button class="flex-div center-div btn btn-game btn-warning" onclick="game.teacher.next()">Дальше</button>
    `;
}

function display_end(){
    window.location.hash = "#viyb";
    document.getElementById("teach_alert").innerHTML = `
    <h1 class="color-my-white center-div">Учебная игра</h1>
    <p class="color-my-white teach-text">Поздравляем! Вы прошли обучение!</p>
    <button class="flex-div center-div btn btn-game btn-warning" onclick="game.teacher.next()">закрыть</button>
    `;
}


function display_gcn_info(){
    document.getElementById("teach_alert").innerHTML = `
    <h1 class="color-my-white center-div">Учебная игра</h1>
    <p class="color-my-white teach-text">Реактор охлаждается водой (теплоносителем). Её подают в реактор Главные
    циркуляционные насосы (ГЦН). Чтобы увеличить подачу воды, нужно нажать кнопку Б (больше)  напротив насоса. Чтобы уменьшить подачу воды, нужно нажать кнопку М (меньше) напротив насоса. </p>
    <button class="flex-div center-div btn btn-game btn-warning" onclick="game.teacher.next()">Дальше</button>
    `;
    }


function display_pvs_info(){
    document.getElementById("teach_alert").innerHTML = `
    <h1 class="color-my-white center-div">Учебная игра</h1>
    <p class="color-my-white teach-text">Попадая в реактор, вода нагревается и частично испаряется.
    Получившаяся пароводяная смесь (ПВС) попадает в Барабан сепараторы(БС) и разделяется на воду и пар.<p>
    <button class="flex-div center-div btn btn-game btn-warning center-div" onclick="game.teacher.next()">Дальше</button>
    `;
}


function show_hints(id_hint){
    const del_div = document.getElementById(`${id_hint}_hint`);
    if (del_div){
        del_div.remove();
    } else {
    add_tolip(id_hint, `${hints_json[id_hint]}
    <button class="btn btn-game btn-warning">Закрыть</button>
    `, `${id_hint}_hint`);
    }
}


function add_tolip(id_div, text, id_t, top=true){
    let cont = document.getElementById(id_div);
    if (top){
    cont.innerHTML =   `<div id="${id_t}" class="cont-tooltip">
                                 <div class="tooltip" >${text} </div>
                                 <div class="n-tooltip"></div>
                             </div>` + cont.innerHTML;
    } else {
        cont.innerHTML = cont.innerHTML + `<div id="${id_t}" class="cont-tooltip-bottom">
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
    if (div.style.border == "2px solid red"){
        div.style.border = "";
    } else {
        div.style.border = "2px solid red";
    }


}
// document.getElementById("teach_alert").textContent