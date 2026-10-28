const errors2 = {
  "mode_kom": "Режим КОМ",
  "high_rho_total": "реактивность 1.25",
  "alert_baz": "БАЗ",
  "alert_power_q": "АЗС-Р",
  "alert_az": "ПК-АЗ",
  "alert_az_1": "АЗ-1",
  "alert_az_2": "АЗ-2",
  "alert_az_5": "АЗ-5",
  "ar_broken": "АР неиспр",
  "ar_turn_down": "АР откл",
  "azsr_turn_down": "АЗСР откл",
  "azs_turn_down": "АЗС откл",
  "azsr_on": "АЗСР-ВКЛ",
  "azs_on": "АЗС-ВКЛ",
  "high_speed_power": "Превыш Скор",
  "m_ozr_ar": "М ОЗР АР",
  "m_ozr": "М ОЗР",
  "az_call": "АЗ набран",
  "up_direction": "Извлек",
  "down_direction": "Опуск",
  "azs": "АЗС",
  "h_lower_water_level_BS1": "H БС1 ↓ 0.75",
  "h_lower_water_level_BS2": "H БС2 ↓ 0.75",
  "h_high_water_level_BS1": "H БС1 ↑ 1.25",
  "h_high_water_level_BS2": "H БС2 ↑ 1.25",
  "level_down1": "Cброс БС1",
  "level_down2": "Cброс БС2",
  "1_n_error": "ГНЦ1 неиспр",
  "2_n_error": "ГНЦ2 неиспр",
  "3_n_error": "ПЭН1 неиспр",
  "4_n_error": "ПЭН2 неиспр",
  "1_a_error": "АГНЦ1 неиспр",
  "2_a_error": "АГНЦ2 неиспр",
  "3_a_error": "АПЭН1 неиспр",
  "4_a_error": "АПЭН2 неиспр",
  "alert_high_temperature2": "Т ББ ↑",
  "alert_high_temperatureBS1": "Т БС1 ↑",
  "alert_high_temperatureBS2": "Т БС2 ↑",
  "1_n_turn_down": "ГНЦ1 ОТКЛ",
  "2_n_turn_down": "ГНЦ2 ОТКЛ",
  "3_n_turn_down": "ПЭН1 ОТКЛ",
  "4_n_turn_down": "ПЭН2 ОТКЛ",
  "1_a_turn_down": "АГНЦ1 ОТКЛ",
  "2_a_turn_down": "АГНЦ2 ОТКЛ",
  "3_a_turn_down": "АПЭН1 ОТКЛ",
  "4_a_turn_down": "АПЭН2 ОТКЛ",
  "tk_broke": "Разрыв ТК",
  "mpa": "МПА",
  "saor": "САОР",
  "bs1_level_up": "H БС1 ↑",
  "bs2_level_up": "H БС2 ↑",
  "turn_down_rdg2": "РДГ2 откл",
  "turn_down_rdg1": "РДГ1 откл",
  "turn_down_t2": "ТГ2 откл",
  "turn_down_t1": "ТГ1 откл",
  "m_down_t1": "ТГ1 потеря момента",
  "m_down_t2": "ТГ2 потеря момента",
  "rdg1_broken": "РДГ1 неиспр",
  "rdg2_broken": "РДГ2 неиспр",
  "lep1_broken": "ЛЭП1 неиспр",
  "lep2_broken": "ЛЭП2 неиспр",
  "tsn_broken": "ТСН неиспр",
  "e_h": "Превыш Нагрузки",
  "alert_high_e_power_t1": "Высокая мощность ТГ1",
  "alert_high_turnovers1": "Высокие обороты ТГ1",
  "alert_high_turnovers2": "Высокие обороты ТГ2",
  "alert_high_e_power_t2": "Высокая мощность ТГ2",
  "error_t1": "ТГ1 неиспр",
  "error_t2": "ТГ2 неиспр"

  }


function global_error(text){
let div = document.getElementById("global_error_d");
div.style.display = "block";
    div.innerHTML = `<div style="margin-left:auto;margin-right:auto; width: fit-content;"><svg xmlns="http://www.w3.org/2000/svg"
     width="660" height="330" viewBox="0 0 660 330">

  <defs>
    <!-- Основной металл -->
    <linearGradient id="panelMetal" x1="0" y1="0" x2=".15" y2="1">
      <stop offset="0" stop-color="#512b27"/>
      <stop offset=".18" stop-color="#38201e"/>
      <stop offset=".55" stop-color="#241b1a"/>
      <stop offset="1" stop-color="#3b211e"/>
    </linearGradient>

    <!-- Металлическая рамка -->
    <linearGradient id="redFrame" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d1a095"/>
      <stop offset=".16" stop-color="#8c443a"/>
      <stop offset=".48" stop-color="#4b2925"/>
      <stop offset=".8" stop-color="#a84a3e"/>
      <stop offset="1" stop-color="#35201d"/>
    </linearGradient>

    <!-- Красная кнопка -->
    <linearGradient id="buttonRed" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d83d30"/>
      <stop offset=".45" stop-color="#a91510"/>
      <stop offset="1" stop-color="#590b09"/>
    </linearGradient>

    <!-- Диагональные аварийные полосы -->
    <pattern id="hazardStripes" width="24" height="24"
             patternUnits="userSpaceOnUse"
             patternTransform="skewX(-28)">
      <rect width="24" height="24" fill="#391c1a"/>
      <rect width="10" height="24" fill="#a9382d"/>
    </pattern>

    <!-- Потёртости металла -->
    <pattern id="wear" width="71" height="47"
             patternUnits="userSpaceOnUse">
      <path d="M4 9l9-1 M31 21l13-2 M52 6l5 1
               M15 39l7-1 M58 34l8-2"
            stroke="#d5a095" stroke-width=".7" opacity=".22"/>
      <circle cx="20" cy="13" r=".8"
              fill="#e8c1ae" opacity=".3"/>
      <circle cx="49" cy="40" r="1"
              fill="#080909" opacity=".5"/>
      <path d="M35 3l-2 4 M7 29l3-2"
            stroke="#0c0c0b" stroke-width="1" opacity=".55"/>
    </pattern>

    <!-- Только умеренная тень, без свечения контура -->
    <filter id="shadow"
            x="-5%" y="-5%" width="110%" height="115%"
            color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
      <feOffset dy="2"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope=".45"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Винт -->
    <g id="screw">
      <circle r="7" fill="#151513"
              stroke="#b9a397" stroke-width="1.5"/>
      <circle r="4.5" fill="#66554c"
              stroke="#2a201d" stroke-width="1"/>
      <path d="M-2.5-2.5L2.5 2.5 M2.5-2.5L-2.5 2.5"
            stroke="#d0b7a5" stroke-width="1"/>
      <circle cx="-1.5" cy="-1.5" r="1" fill="#f0d8c4"/>
    </g>
  </defs>

  <!-- Внешняя рамка с чёткими границами -->
  <rect x="8.5" y="8.5" width="643" height="313"
        rx="5" fill="#292321"
        stroke="#171715" stroke-width="2"/>

  <rect x="13.5" y="13.5" width="633" height="303"
        rx="3" fill="url(#panelMetal)"
        stroke="#b65a4b" stroke-width="1.5"/>

  <rect x="18.5" y="18.5" width="623" height="293"
        rx="2" fill="none"
        stroke="#e17a68" stroke-width="1"/>

  <rect x="22" y="22" width="616" height="286"
        rx="1" fill="none"
        stroke="#171513" stroke-width="1"/>

  <!-- Основная поверхность -->
  <rect x="23" y="23" width="614" height="283"
        fill="url(#panelMetal)"/>

  <!-- Верхняя аварийная полоса -->
  <rect x="25" y="25" width="610" height="22"
        fill="url(#hazardStripes)"/>

  <path d="M26 49H634"
        stroke="#ff7765" stroke-width="1.5"/>

  <!-- Нижние металлические грани -->
  <path d="M25 302H635"
        stroke="#100f0e" stroke-width="2"/>
  <path d="M28 306H632"
        stroke="#b05b4c" stroke-width="1" opacity=".8"/>

  <!-- Поверхностные потёртости -->
  <rect x="22" y="23" width="616" height="283"
        fill="url(#wear)" opacity=".8"/>

  <!-- Винты по углам -->
  <use href="#screw" x="29" y="29"/>
  <use href="#screw" x="631" y="29"/>
  <use href="#screw" x="29" y="301"/>
  <use href="#screw" x="631" y="301"/>

  <!-- Предупреждающий символ -->
  <g transform="translate(100 133)">
    <path d="M0-43L48 39Q51 44 44 44H-44Q-51 44-48 39Z"
          fill="#321c19"
          stroke="#ff6554" stroke-width="4"
          stroke-linejoin="round"/>

    <path d="M0-32L37 34H-37Z"
          fill="none"
          stroke="#b93f34" stroke-width="1.5"/>

    <rect x="-4.5" y="-20" width="9" height="34"
          rx="4" fill="#ff9c89"/>

    <circle cx="0" cy="25" r="5" fill="#ff9c89"/>

    <path d="M-2-19Q0-22 3-18"
          fill="none"
          stroke="#ffe0d1" stroke-width="1.5"/>
  </g>

  <!-- ЗАГОЛОВОК -->
  <text x="160" y="91"
        font-family="Arial, Helvetica, sans-serif"
        font-size="24" font-weight="bold"
        letter-spacing=".8"
        fill="#ff6254">
    КРИТИЧЕСКАЯ АВАРИЯ
  </text>

  <!-- ОСНОВНОЕ СООБЩЕНИЕ -->
  <text x="160" y="132"
        font-family="Arial, Helvetica, sans-serif"
        font-size="24" font-weight="bold"
        fill="#f3d9d2">
    ПЕРЕГРЕВ РЕАКТОРА!
  </text>

  <!-- СТАТУС АВАРИИ -->
  <text x="160" y="161"
        font-family="Arial, Helvetica, sans-serif"
        font-size="17" font-weight="bold"
        letter-spacing=".4"
        fill="#f4b5a9">
    РЕАКТОР УНИЧТОЖЕН
  </text>

  <!-- Разделитель -->
  <path d="M160 178H610"
        stroke="#b9473b" stroke-width="1.5"/>
  <path d="M160 180H610"
        stroke="#ff8a78" stroke-width=".5" opacity=".6"/>

  <!-- ОПИСАНИЕ АВАРИИ -->
  <text x="160" y="202"
        font-family="Arial, Helvetica, sans-serif"
        font-size="14" fill="#e2d7cf">
    <tspan x="160" dy="0">
      Температура превысила допустимый предел.
    </tspan>
    <tspan x="160" dy="20">
      Работа энергоблока прекращена.
    </tspan>
  </text>

  <!-- КНОПКА ПОДТВЕРЖДЕНИЯ -->
  <g>
    <rect x="347" y="253" width="205" height="40" onclick="alert('test')"
          rx="4" fill="#090909"
          stroke="#160e0d" stroke-width="2"/>

    <rect x="350" y="250" width="199" height="40"
          rx="4" fill="url(#redFrame)"
          stroke="#e87967" stroke-width="1.5"/>

    <rect x="356" y="255" width="187" height="30"
          rx="2" fill="url(#buttonRed)"
          stroke="#48100d" stroke-width="1.5"/>

    <path d="M362 258H537"
          stroke="#ff9c88" stroke-width="1" opacity=".8"/>
  </g>

    <text x="449" y="275"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="14" fill="#fff0e9">
    ПРИНЯТЬ
  </text>

</svg></div>`;
document.getElementById("button_ok").addEventListener("click", e => {
    alert("test");

})
}


function show_mnemo(reactor){
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            show_mnemo_i_j(reactor.sterg[i][j], i, j);
        }
    }
}


function exit_menu(menu_id){
    document.getElementById(menu_id).style.display = "none";
}


function show_mnemo_i_j(value, i, j){
    try{
        var m = document.getElementById(`m${i}_${j}`);
        if (value == 100){
            m.style.background = "#b3c79f";
        } else if (value == 0){
            m.style.background = "#ffb961";
        } else {
            m.style.background = "";
        }
    m.textContent = value;
    }catch(error){
    }
}


function my_alert(id_error, text){
    var div = document.getElementById(id_error);
    if (div.style.background == ""){
            div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 0 220 56">
  <defs>
    <linearGradient id="fy-on" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d1d0c5"/>
      <stop offset=".3" stop-color="#8a8c80"/>
      <stop offset=".6" stop-color="#b0afa3"/>
      <stop offset="1" stop-color="#4a4c44"/>
    </linearGradient>
    <radialGradient id="ly-on" cx=".35" cy=".3" r=".85">
      <stop offset="0" stop-color="#fffbe0"/>
      <stop offset=".3" stop-color="#fff176"/>
      <stop offset=".7" stop-color="#ffd21f"/>
      <stop offset="1" stop-color="#c79200"/>
    </radialGradient>
    <filter id="gy-on" x="-40%" y="-80%" width="180%" height="260%">
      <feGaussianBlur stdDeviation="4"/>
    </filter>
  </defs>
  <rect x="2" y="2" width="216" height="52" rx="4" fill="#55574f" stroke="#292b26" stroke-width="1.5"/>
  <rect x="12" y="7" width="196" height="42" rx="6" fill="url(#fy-on)" stroke="#33352f" stroke-width="1.2"/>
  <rect x="15" y="10" width="190" height="36" rx="5" fill="#191b17"/>
  <rect x="18" y="13" width="184" height="30" rx="4" fill="#ffd600" opacity=".6" filter="url(#gy-on)"/>
  <rect x="18" y="13" width="184" height="30" rx="4" fill="url(#ly-on)" stroke="#8a5f00" stroke-width=".8"/>
  <rect x="20" y="14" width="180" height="11" rx="3" fill="#ffffff" opacity=".4"/>
  <text x="110" y="25" text-anchor="middle" dominant-baseline="central" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="bold" fill="#5c3d00" letter-spacing=".5">${errors2[id_error]}</text>
  <g fill="#45473f" stroke="#c2c0b1" stroke-width=".7">
    <circle cx="6" cy="6" r="1.6"/>
    <circle cx="214" cy="6" r="1.6"/>
    <circle cx="6" cy="50" r="1.6"/>
    <circle cx="214" cy="50" r="1.6"/>
  </g>
</svg>`;
        div.style.background = "#fcf172";
        console.log("test_update");
    } else {
        div.style.background = "";
    div.innerHTML =`<svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 0 220 56">
  <defs>
    <linearGradient id="fg-off" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d1d0c5"/>
      <stop offset=".3" stop-color="#8a8c80"/>
      <stop offset=".6" stop-color="#b0afa3"/>
      <stop offset="1" stop-color="#4a4c44"/>
    </linearGradient>
    <radialGradient id="lg-off" cx=".35" cy=".3" r=".85">
      <stop offset="0" stop-color="#5c6b5e"/>
      <stop offset=".4" stop-color="#34403a"/>
      <stop offset=".8" stop-color="#1e261f"/>
      <stop offset="1" stop-color="#141a15"/>
    </radialGradient>
  </defs>
  <rect x="2" y="2" width="216" height="52" rx="4" fill="#55574f" stroke="#292b26" stroke-width="1.5"/>
  <rect x="12" y="7" width="196" height="42" rx="6" fill="url(#fg-off)" stroke="#33352f" stroke-width="1.2"/>
  <rect x="15" y="10" width="190" height="36" rx="5" fill="#191b17"/>
  <rect x="18" y="13" width="184" height="30" rx="4" fill="url(#lg-off)" stroke="#0e130f" stroke-width=".8"/>
  <rect x="20" y="14" width="180" height="11" rx="3" fill="#ffffff" opacity=".08"/>
   <text x="110" y="25" text-anchor="middle" dominant-baseline="central" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="bold" fill="#6e7669" letter-spacing=".5">${errors2[id_error]}</text>
  <g fill="#45473f" stroke="#c2c0b1" stroke-width=".7">
    <circle cx="6" cy="6" r="1.6"/>
    <circle cx="214" cy="6" r="1.6"/>
    <circle cx="6" cy="50" r="1.6"/>
    <circle cx="214" cy="50" r="1.6"/>
  </g>
</svg>`
    }
}


function start_alert(id_error){
    var div = document.getElementById(id_error);
     div.style.background = "#fcf172";
     div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 0 220 56">
  <defs>
    <linearGradient id="fy-on" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d1d0c5"/>
      <stop offset=".3" stop-color="#8a8c80"/>
      <stop offset=".6" stop-color="#b0afa3"/>
      <stop offset="1" stop-color="#4a4c44"/>
    </linearGradient>
    <radialGradient id="ly-on" cx=".35" cy=".3" r=".85">
      <stop offset="0" stop-color="#fffbe0"/>
      <stop offset=".3" stop-color="#fff176"/>
      <stop offset=".7" stop-color="#ffd21f"/>
      <stop offset="1" stop-color="#c79200"/>
    </radialGradient>
    <filter id="gy-on" x="-40%" y="-80%" width="180%" height="260%">
      <feGaussianBlur stdDeviation="4"/>
    </filter>
  </defs>
  <rect x="2" y="2" width="216" height="52" rx="4" fill="#55574f" stroke="#292b26" stroke-width="1.5"/>
  <rect x="12" y="7" width="196" height="42" rx="6" fill="url(#fy-on)" stroke="#33352f" stroke-width="1.2"/>
  <rect x="15" y="10" width="190" height="36" rx="5" fill="#191b17"/>
  <rect x="18" y="13" width="184" height="30" rx="4" fill="#ffd600" opacity=".6" filter="url(#gy-on)"/>
  <rect x="18" y="13" width="184" height="30" rx="4" fill="url(#ly-on)" stroke="#8a5f00" stroke-width=".8"/>
  <rect x="20" y="14" width="180" height="11" rx="3" fill="#ffffff" opacity=".4"/>
  <text x="110" y="25" text-anchor="middle" dominant-baseline="central" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="bold" fill="#5c3d00" letter-spacing=".5">${errors2[id_error]}</text>
  <g fill="#45473f" stroke="#c2c0b1" stroke-width=".7">
    <circle cx="6" cy="6" r="1.6"/>
    <circle cx="214" cy="6" r="1.6"/>
    <circle cx="6" cy="50" r="1.6"/>
    <circle cx="214" cy="50" r="1.6"/>
  </g>
</svg>`;
}


function start_alert_background(id_error){
    var div = document.getElementById(id_error);
     div.style.background = "#fcf172";
}


function red_alert(id_error){
    var div = document.getElementById(id_error);
    if (div.style.background == ""){
        div.style.background = "red";
        div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 0 220 56">
  <defs>
    <linearGradient id="fr-on" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d1d0c5"/>
      <stop offset=".3" stop-color="#8a8c80"/>
      <stop offset=".6" stop-color="#b0afa3"/>
      <stop offset="1" stop-color="#4a4c44"/>
    </linearGradient>
    <radialGradient id="lr-on" cx=".35" cy=".3" r=".85">
      <stop offset="0" stop-color="#ffe0e0"/>
      <stop offset=".3" stop-color="#ff7070"/>
      <stop offset=".7" stop-color="#ec2626"/>
      <stop offset="1" stop-color="#9a0d0d"/>
    </radialGradient>
    <filter id="gr-on" x="-40%" y="-80%" width="180%" height="260%">
      <feGaussianBlur stdDeviation="4"/>
    </filter>
  </defs>
  <rect x="2" y="2" width="216" height="52" rx="4" fill="#55574f" stroke="#292b26" stroke-width="1.5"/>
  <rect x="12" y="7" width="196" height="42" rx="6" fill="url(#fr-on)" stroke="#33352f" stroke-width="1.2"/>
  <rect x="15" y="10" width="190" height="36" rx="5" fill="#191b17"/>
  <rect x="18" y="13" width="184" height="30" rx="4" fill="#ff1a1a" opacity=".6" filter="url(#gr-on)"/>
  <rect x="18" y="13" width="184" height="30" rx="4" fill="url(#lr-on)" stroke="#5e0606" stroke-width=".8"/>
  <rect x="20" y="14" width="180" height="11" rx="3" fill="#ffffff" opacity=".35"/>
    <text x="110" y="25" text-anchor="middle" dominant-baseline="central" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="bold" fill="#5a0808" letter-spacing=".5">${errors2[id_error]}</text>
  <g fill="#45473f" stroke="#c2c0b1" stroke-width=".7">
    <circle cx="6" cy="6" r="1.6"/>
    <circle cx="214" cy="6" r="1.6"/>
    <circle cx="6" cy="50" r="1.6"/>
    <circle cx="214" cy="50" r="1.6"/>
  </g>
</svg>`
    } else {
        stop_alert(id_error);
    }
}


function stop_alert_background(id_error){
    var div = document.getElementById(id_error);
    try{
        div.style.background = "";
     } catch(e){
        console.log("error id", id_error);
    }
}

function stop_alert(id_error){
    var div = document.getElementById(id_error);
    try{
            div.style.background = "";
         div.innerHTML =`<svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 0 220 56">
  <defs>
    <linearGradient id="fg-off" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d1d0c5"/>
      <stop offset=".3" stop-color="#8a8c80"/>
      <stop offset=".6" stop-color="#b0afa3"/>
      <stop offset="1" stop-color="#4a4c44"/>
    </linearGradient>
    <radialGradient id="lg-off" cx=".35" cy=".3" r=".85">
      <stop offset="0" stop-color="#5c6b5e"/>
      <stop offset=".4" stop-color="#34403a"/>
      <stop offset=".8" stop-color="#1e261f"/>
      <stop offset="1" stop-color="#141a15"/>
    </radialGradient>
  </defs>
  <rect x="2" y="2" width="216" height="52" rx="4" fill="#55574f" stroke="#292b26" stroke-width="1.5"/>
  <rect x="12" y="7" width="196" height="42" rx="6" fill="url(#fg-off)" stroke="#33352f" stroke-width="1.2"/>
  <rect x="15" y="10" width="190" height="36" rx="5" fill="#191b17"/>
  <rect x="18" y="13" width="184" height="30" rx="4" fill="url(#lg-off)" stroke="#0e130f" stroke-width=".8"/>
  <rect x="20" y="14" width="180" height="11" rx="3" fill="#ffffff" opacity=".08"/>
   <text x="110" y="25" text-anchor="middle" dominant-baseline="central" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="bold" fill="#6e7669" letter-spacing=".5">${errors2[id_error]}</text>
  <g fill="#45473f" stroke="#c2c0b1" stroke-width=".7">
    <circle cx="6" cy="6" r="1.6"/>
    <circle cx="214" cy="6" r="1.6"/>
    <circle cx="6" cy="50" r="1.6"/>
    <circle cx="214" cy="50" r="1.6"/>
  </g>
</svg>`
    } catch(e){
        console.log("error id", id_error);
    }
}


function start_UI(reactor){
    var k = Object.keys(errors2);
    for (i = 0; i < k.length; i++){
        document.getElementById(k[i]).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 0 220 56">
  <defs>
    <linearGradient id="fg-off" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d1d0c5"/>
      <stop offset=".3" stop-color="#8a8c80"/>
      <stop offset=".6" stop-color="#b0afa3"/>
      <stop offset="1" stop-color="#4a4c44"/>
    </linearGradient>
    <radialGradient id="lg-off" cx=".35" cy=".3" r=".85">
      <stop offset="0" stop-color="#5c6b5e"/>
      <stop offset=".4" stop-color="#34403a"/>
      <stop offset=".8" stop-color="#1e261f"/>
      <stop offset="1" stop-color="#141a15"/>
    </radialGradient>
  </defs>
  <rect x="2" y="2" width="216" height="52" rx="4" fill="#55574f" stroke="#292b26" stroke-width="1.5"/>
  <rect x="12" y="7" width="196" height="42" rx="6" fill="url(#fg-off)" stroke="#33352f" stroke-width="1.2"/>
  <rect x="15" y="10" width="190" height="36" rx="5" fill="#191b17"/>
  <rect x="18" y="13" width="184" height="30" rx="4" fill="url(#lg-off)" stroke="#0e130f" stroke-width=".8"/>
  <rect x="20" y="14" width="180" height="11" rx="3" fill="#ffffff" opacity=".08"/>
   <text x="110" y="25" text-anchor="middle" dominant-baseline="central" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="bold" fill="#6e7669" letter-spacing=".5">${errors2[k[i]]}</text>
  <g fill="#45473f" stroke="#c2c0b1" stroke-width=".7">
    <circle cx="6" cy="6" r="1.6"/>
    <circle cx="214" cy="6" r="1.6"/>
    <circle cx="6" cy="50" r="1.6"/>
    <circle cx="214" cy="50" r="1.6"/>
  </g>
</svg>`;

    }
    var k = Object.keys(reactor.gcn);
    for (i = 0; i < k.length; i++){
        ui_power_source(reactor.gcn[k[i]].source_power, k[i]);
        if (!reactor.gcn[k[i]].work){
            start_alert(`${reactor.gcn[k[i]].id_pump}_turn_down`);
        } else {
            stop_alert(`${reactor.gcn[k[i]].id_pump}_turn_down`);
        }
    }
    if(!reactor.rdg1.work){
        start_alert(`turn_down_${reactor.rdg1.id_rdg}`);
    } else {
        stop_alert(`turn_down_${reactor.rdg1.id_rdg}`);
    }
    ui_power(`${reactor.rdg1.id_rdg}_s`, reactor.rdg1.work);
    ui_power(`${reactor.rdg2.id_rdg}_s`, reactor.rdg2.work);
    if(!reactor.rdg2.work){
        start_alert(`turn_down_${reactor.rdg2.id_rdg}`);
    } else {
        stop_alert(`turn_down_${reactor.rdg2.id_rdg}`);
    }
    for (let i = 0; i < reactor.chosen.length; i++){
        chosen(reactor.chosen[i][0], reactor.chosen[i][1], true);
    }
    ui_power("lar_s", reactor.az.power_ar);
    ui_speed_SYZ(reactor.speed_SYZ);
    if (reactor.az.mode == 2){
       turn("azsr_start", 1, "АЗСР");
       turn("azs_start", 0, "АЗС");
       stop_alert("azs_on");
       stop_alert('azsr_turn_down');
    } else if (reactor.az.mode == 1){
        turn("azs_start", 1, "АЗС");
        turn("azsr_start", 0, "АЗСР");
        green_alert("azs_on")
        stop_alert("azsr_on");
        stop_alert('azs_turn_down');
    } else {
        stop_alert("azsr_on");
        stop_alert("azs_on");
        start_alert('azs_turn_down');
        start_alert('azsr_turn_down');
    }
}


function ui_thermal_power_mnemo(sek){
    for (let i = 0; i < 9; i++) {
            for (let j = 0; j < re.sterg[i].length; j++) {
                if (re.sterg[i][j] == -1){
                    continue;
                }
                ui_thermal_power_laz(i, j, sek[get_sektor_number(i, j)])
            }
    }

}

// type  1 - danger 2 - 3 - green
function ui_thermal_power_laz(i, j, type){
    try{
        var div = document.getElementById(`m2${i}_${j}`);
        if (type == 1){
            div.style.background = "red";
        } else if (type == 2) {
            div.style.background = "#fcf172";
        } else {
            div.style.background = "green";
        }
    } catch(e){
     console.log(`m2${i}_${j}`)
    }
}


function showdiv1(Div){
    var x = document.getElementById(Div);
    if(x.style.display=="none") {
        x.style.display = "block";
        return true;
    }
    x.style.display = "none";
    return false;
}


function showdivFlex(Div){
    var x = document.getElementById(Div);
    if(x.style.display=="none") {
        x.style.display = "flex";
        return true;
    }
    x.style.display = "none";
    return false;
}



function ui_speed_SYZ(speed){
    for (let i = 1; i < 6; i++){
        if (speed == i){
            start_alert_background(`s${i}`);
        } else {
            stop_alert_background(`s${i}`);
        }
    }
}


function chosen(i, j, flag){
    if (flag){
        document.getElementById(`s${i}_${j}`).style.border = "1px solid white";
    } else {
        document.getElementById(`s${i}_${j}`).style.border = "1px solid black";
    }
}

function setup_UI(reactor){
//СУЗ
    document.getElementById("W_Q").value = `${(reactor.physical.thermal_power / 1e6 ).toFixed(0)}`;
    document.getElementById("reactivnost").value = reactor.physical.rho_total;
    document.getElementById("speed_power").value = reactor.az.period_power;
    document.getElementById("ozr_ar").value = reactor.az.ozr_ar;
    document.getElementById("ozr").value = reactor.physical.ozr.toFixed(1);
    document.getElementById("grafit_temp").value = reactor.physical.graphite_temp.toFixed(0);
//    Турбины
    document.getElementById("w_e1").value = reactor.t1.w_e;
    document.getElementById("w_e2").value = reactor.t2.w_e;
    document.getElementById("T_reactor").value = reactor.physical.outlet_temp.toFixed(0);
    document.getElementById("obr_t1").value = reactor.t1.obr;
    document.getElementById("obr_t2").value = reactor.t2.obr;
    document.getElementById("rdg1_p").value = reactor.rdg1.power_e.toFixed(0);
    document.getElementById("rdg2_p").value = reactor.rdg2.power_e.toFixed(0);
    document.getElementById("p_in_reactor").value = reactor.physical.p_in_reactor;
    document.getElementById("g_max_t1").value = reactor.t1.g_max;
    document.getElementById("g_max_t2").value = reactor.t2.g_max;
//    Насосы
    var k = Object.keys(reactor.gcn);
    for (i = 0; i < k.length; i++){
        document.getElementById(k[i]).value = reactor.gcn[k[i]].g;
    }
    document.getElementById("T_2_H2O").value = reactor.T_2_H2O;
//    БС
    document.getElementById("h_braban_s1").value = `${(reactor.bs1.h_braban_s).toFixed(2)}`;
    document.getElementById("fuel_temp").value = reactor.physical.fuel_temp.toFixed(0);
    document.getElementById("T_H2O1").value = reactor.bs1.T_H2O.toFixed(0);
    document.getElementById("h_braban_s2").value = reactor.bs2.h_braban_s.toFixed(2);
    document.getElementById("m_sep2").value = reactor.bs2.m_sep;
    document.getElementById("m_sep1").value = reactor.bs1.m_sep;
    document.getElementById("p_bs1").value = reactor.bs1.p.toFixed(1);
    document.getElementById("p_bs2").value = reactor.bs2.p.toFixed(1);
    document.getElementById("T_H2O2").value = reactor.bs2.T_H2O.toFixed(0);
    document.getElementById("power_lep1").value = reactor.power_lep1;
    document.getElementById("power_lep2").value = reactor.power_lep2;
    if (game.type == 4){
        document.getElementById("game-time").textContent = game.time_work;
        document.getElementById("last_time").textContent = game.tasks[game.id_task]["time"] - game.global_time;
    }
        document.getElementById("power_lar_show").value = reactor.az.power_ar  / 1e6 ;

    if (rc.copy){
        show_mnemo(reactor);
        for (i = 0; i < k.length; i++){
            ui_power_source(reactor.gcn[k[i]].source_power, k[i]);
        }
    }

}


function green_alert(id_error){
    var div = document.getElementById(id_error);
     div.style.background = "#7ba05b";
     div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 0 220 56">
  <defs>
    <linearGradient id="fg-on" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d1d0c5"/>
      <stop offset=".3" stop-color="#8a8c80"/>
      <stop offset=".6" stop-color="#b0afa3"/>
      <stop offset="1" stop-color="#4a4c44"/>
    </linearGradient>
    <radialGradient id="lg-on" cx=".35" cy=".3" r=".85">
      <stop offset="0" stop-color="#f2fff0"/>
      <stop offset=".3" stop-color="#7dff8a"/>
      <stop offset=".7" stop-color="#2fd646"/>
      <stop offset="1" stop-color="#128a2a"/>
    </radialGradient>
    <filter id="gg-on" x="-40%" y="-80%" width="180%" height="260%">
      <feGaussianBlur stdDeviation="4"/>
    </filter>
  </defs>
  <rect x="2" y="2" width="216" height="52" rx="4" fill="#55574f" stroke="#292b26" stroke-width="1.5"/>
  <rect x="12" y="7" width="196" height="42" rx="6" fill="url(#fg-on)" stroke="#33352f" stroke-width="1.2"/>
  <rect x="15" y="10" width="190" height="36" rx="5" fill="#191b17"/>
  <rect x="18" y="13" width="184" height="30" rx="4" fill="#35ff55" opacity=".6" filter="url(#gg-on)"/>
  <rect x="18" y="13" width="184" height="30" rx="4" fill="url(#lg-on)" stroke="#0b5c1a" stroke-width=".8"/>
  <rect x="20" y="14" width="180" height="11" rx="3" fill="#ffffff" opacity=".35"/>
   <text x="110" y="25" text-anchor="middle" dominant-baseline="central" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="bold" fill="#0b3d14" letter-spacing=".5">${errors2[id_error]}</text>
   <g fill="#45473f" stroke="#c2c0b1" stroke-width=".7">
    <circle cx="6" cy="6" r="1.6"/>
    <circle cx="214" cy="6" r="1.6"/>
    <circle cx="6" cy="50" r="1.6"/>
    <circle cx="214" cy="50" r="1.6"/>
  </g>
</svg>`;
}


function go_sector(sector){
    window.location.hash = "#";
    if (sector == 1){
        window.location.hash = "#viyr";
    } else if (sector == 2){
        window.location.hash = "#viyb";
    }else if (sector == 3){
        window.location.hash = "#viyt";
    }
}

function ui_power(id_div, flag){
    if(flag) {
        document.getElementById(id_div).style.background = "green";
    } else {
        document.getElementById(id_div).style.background = "red";
    }
    try{
    if (!copy){
        socket.emit("method_send", {"room": room_id, "function": "ui_power", "id_div": id_div, "flag": flag});
    }
   } catch(error){
   }
}


function set_direction_ui(flag, id_div){
    if (!copy){
    socket.emit("method_send", {"room": room_id, "function": "set_direction_ui", "flag": flag, "id_div": id_div});
    }
    if (flag){
        document.getElementById(id_div).textContent = "\\";
    } else {
        document.getElementById(id_div).textContent = "/";
    }
}

function turn(id_div, flag, text=""){
    if (flag){
        document.getElementById(id_div).innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg"  height="55" viewBox="8 6 752 435">
  <defs>
    <linearGradient id="plate" x1="0" y1="0" x2=".9" y2="1">
      <stop offset="0" stop-color="#a6a499"/>
      <stop offset=".48" stop-color="#89887e"/>
      <stop offset="1" stop-color="#77776e"/>
    </linearGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#53544d"/>
      <stop offset=".25" stop-color="#b1b09f"/>
      <stop offset=".75" stop-color="#77776b"/>
      <stop offset="1" stop-color="#44463f"/>
    </linearGradient>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2=".8">
      <stop offset="0" stop-color="#34352f"/>
      <stop offset=".2" stop-color="#a6a494"/>
      <stop offset=".43" stop-color="#77766b"/>
      <stop offset=".7" stop-color="#b8b5a4"/>
      <stop offset="1" stop-color="#34352f"/>
    </linearGradient>
    <radialGradient id="disc" cx=".38" cy=".32" r=".75">
      <stop offset="0" stop-color="#aaa797"/>
      <stop offset=".65" stop-color="#77766c"/>
      <stop offset="1" stop-color="#44453f"/>
    </radialGradient>
    <linearGradient id="handle" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#111210"/>
      <stop offset=".18" stop-color="#343530"/>
      <stop offset=".45" stop-color="#1d1e1b"/>
      <stop offset=".8" stop-color="#10110f"/>
      <stop offset="1" stop-color="#050605"/>
    </linearGradient>
    <linearGradient id="label" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#242520"/>
      <stop offset="1" stop-color="#11120f"/>
    </linearGradient>

    <filter id="softShadow" x="-30%" y="-30%" width="160%" height="170%">
      <feGaussianBlur stdDeviation="3"/>
    </filter>
    <g id="screw">
      <circle r="12" fill="#44453f" stroke="#c7c4b3" stroke-width="3"/>
      <circle r="8" fill="#20211e" stroke="#77776b" stroke-width="1.5"/>
      <circle r="4.5" fill="#090a08"/>
      <path d="M-3-3L3 3" stroke="#77786d" stroke-width="1.5"/>
    </g>
  </defs>

  <!-- Панель без лишних полей -->
  <rect x="8" y="6" width="752" height="500" rx="21"
        fill="none" stroke="#55568e" stroke-width="3"/>
  <rect x="17" y="15" width="734" height="482" rx="17"
        fill="none" stroke="#c3c0ae" stroke-width="3"/>
  <rect x="28" y="25" width="712" height="462" rx="13"
        fill="none" stroke="#d0cdbb" stroke-width="3" opacity=".75"/>
  <rect x="34" y="31" width="700" height="450" rx="10"
        fill="none" stroke="#65665d" stroke-width="1.5"/>

  <use href="#screw" x="34" y="33"/>
  <use href="#screw" x="734" y="33"/>
  <use href="#screw" x="34" y="479"/>
  <use href="#screw" x="734" y="479"/>

  <!-- Подписи -->
  <g font-family="Arial, Helvetica, sans-serif"
     font-weight="bold" fill="#24251f" text-anchor="middle">
    <text x="156" y="231" font-size="84">ВКЛ</text>
  </g>
    <g transform="translate(200, 580)">
 <g transform="rotate(-90)">
  <!-- Круглое основание -->
  <ellipse cx="384" cy="180" rx="119" ry="123"
           fill="#141511" opacity=".4" filter="url(#shadow)"/>
  <circle cx="384" cy="196" r="113"
          fill="#282923" stroke="#42433c" stroke-width="5"/>
  <circle cx="384" cy="196" r="106"
          fill="url(#steel)" stroke="#292a25" stroke-width="3"/>
  <circle cx="384" cy="196" r="94"
          fill="url(#disc)" stroke="#c1beac" stroke-width="3"/>
  <circle cx="384" cy="196" r="89"
          fill="none" stroke="#56574f" stroke-width="2"/>
  <circle cx="384" cy="206" r="101"
          fill="none" stroke="#dedbca" stroke-width="1.5" opacity=".6"/>

  <!-- Рукоятка -->
  <rect x="353" y="60" width="67" height="260" rx="29"
        fill="#080908" opacity=".7" filter="url(#softShadow)"/>
  <rect x="354" y="62" width="60" height="254" rx="27"
        fill="#080908" stroke="#252621" stroke-width="4"/>
  <rect x="359" y="67" width="50" height="244" rx="23"
        fill="url(#handle)" stroke="#090a08" stroke-width="2"/>
  <rect x="363" y="72" width="4" height="232" rx="2"
        fill="#77786e" opacity=".6"/>
  <path d="M370 119Q374 111 386 112"
        fill="none" stroke="#9b9a8d" stroke-width="2"
        stroke-linecap="round" opacity=".8"/>
  <path d="M402 120V335"
        fill="none" stroke="#050605" stroke-width="2"/>

  <!-- Стрелка -->
  <path d="M384 89L370 127H379V159H389V127H398Z"
        fill="#e5e0cb" stroke="#c8c3b1" stroke-width="1.5"/>

  <!-- Центральный фиксатор -->
  <circle cx="384" cy="194" r="17"
          fill="#10110f" stroke="#4c4d45" stroke-width="3"/>
  <circle cx="384" cy="194" r="11"
          fill="url(#steel)" stroke="#191a17" stroke-width="2"/>
  <circle cx="384" cy="194" r="4.5"
          fill="#e1ddcc" stroke="#66675d" stroke-width="1.5"/>
  <circle cx="382" cy="192" r="1.5" fill="#fff" opacity=".8"/>
 </g>
    </g>
  <!-- Табличка АЗ-5 -->
  <rect x="225" y="330" width="322" height="108" rx="10"
        fill="#33342e" opacity=".65"/>
  <rect x="226" y="331" width="316" height="108" rx="10"
        fill="url(#edge)" stroke="#41423b" stroke-width="2"/>
  <rect x="231" y="336" width="306" height="98" rx="7"
        fill="url(#label)" stroke="#d0cbb8" stroke-width="2.5"/>
  <rect x="227" y="332" width="314" height="96" rx="4"
        fill="none" stroke="#55564c" stroke-width="1"/>

  <text x="384" y="410" text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif"
        font-size="100" font-weight="bold"
        letter-spacing="2" fill="#e0dac5">${text}</text>

</svg>
        `;
    } else {
        document.getElementById(id_div).innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg"  height="55" viewBox="8 6 752 435">
  <defs>
    <linearGradient id="plate" x1="0" y1="0" x2=".9" y2="1">
      <stop offset="0" stop-color="#a6a499"/>
      <stop offset=".48" stop-color="#89887e"/>
      <stop offset="1" stop-color="#77776e"/>
    </linearGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#53544d"/>
      <stop offset=".25" stop-color="#b1b09f"/>
      <stop offset=".75" stop-color="#77776b"/>
      <stop offset="1" stop-color="#44463f"/>
    </linearGradient>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2=".8">
      <stop offset="0" stop-color="#34352f"/>
      <stop offset=".2" stop-color="#a6a494"/>
      <stop offset=".43" stop-color="#77766b"/>
      <stop offset=".7" stop-color="#b8b5a4"/>
      <stop offset="1" stop-color="#34352f"/>
    </linearGradient>
    <radialGradient id="disc" cx=".38" cy=".32" r=".75">
      <stop offset="0" stop-color="#aaa797"/>
      <stop offset=".65" stop-color="#77766c"/>
      <stop offset="1" stop-color="#44453f"/>
    </radialGradient>
    <linearGradient id="handle" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#111210"/>
      <stop offset=".18" stop-color="#343530"/>
      <stop offset=".45" stop-color="#1d1e1b"/>
      <stop offset=".8" stop-color="#10110f"/>
      <stop offset="1" stop-color="#050605"/>
    </linearGradient>
    <linearGradient id="label" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#242520"/>
      <stop offset="1" stop-color="#11120f"/>
    </linearGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="170%">
      <feGaussianBlur stdDeviation="7"/>
    </filter>
    <filter id="softShadow" x="-30%" y="-30%" width="160%" height="170%">
      <feGaussianBlur stdDeviation="3"/>
    </filter>
    <g id="screw">
      <circle r="12" fill="#44453f" stroke="#c7c4b3" stroke-width="3"/>
      <circle r="8" fill="#20211e" stroke="#77776b" stroke-width="1.5"/>
      <circle r="4.5" fill="#090a08"/>
      <path d="M-3-3L3 3" stroke="#77786d" stroke-width="1.5"/>
    </g>
  </defs>

  <!-- Панель без лишних полей -->
  <rect x="8" y="6" width="752" height="500" rx="21"
        fill="none" stroke="#55564e" stroke-width="3"/>
  <rect x="17" y="15" width="734" height="482" rx="17"
        fill="none" stroke="#4d4e47" stroke-width="3"/>
  <rect x="28" y="25" width="712" height="462" rx="13"
        fill="none" stroke="#d0cdbb" stroke-width="3" opacity=".75"/>
  <rect x="34" y="31" width="700" height="450" rx="10"
        fill="none" stroke="#65665d" stroke-width="1.5"/>

  <use href="#screw" x="34" y="33"/>
  <use href="#screw" x="734" y="33"/>
  <use href="#screw" x="34" y="479"/>
  <use href="#screw" x="734" y="479"/>

  <!-- Подписи -->
  <g font-family="Arial, Helvetica, sans-serif"
     font-weight="bold" fill="#24251f" text-anchor="middle">
    <text x="156" y="231" font-size="84">ВКЛ</text>
  </g>

  <!-- Круглое основание -->
  <ellipse cx="384" cy="180" rx="119" ry="123"
           fill="#141511" opacity=".4" filter="url(#shadow)"/>
  <circle cx="384" cy="196" r="113"
          fill="#282923" stroke="#42433c" stroke-width="5"/>
  <circle cx="384" cy="196" r="106"
          fill="url(#steel)" stroke="#292a25" stroke-width="3"/>
  <circle cx="384" cy="196" r="94"
          fill="url(#disc)" stroke="#c1beac" stroke-width="3"/>
  <circle cx="384" cy="196" r="89"
          fill="none" stroke="#56574f" stroke-width="2"/>
  <circle cx="384" cy="206" r="101"
          fill="none" stroke="#dedbca" stroke-width="1.5" opacity=".6"/>

  <!-- Рукоятка -->
  <rect x="353" y="60" width="67" height="260" rx="29"
        fill="#080908" opacity=".7" filter="url(#softShadow)"/>
  <rect x="354" y="62" width="60" height="254" rx="27"
        fill="#080908" stroke="#252621" stroke-width="4"/>
  <rect x="359" y="67" width="50" height="244" rx="23"
        fill="url(#handle)" stroke="#090a08" stroke-width="2"/>
  <rect x="363" y="72" width="4" height="232" rx="2"
        fill="#77786e" opacity=".6"/>
  <path d="M370 119Q374 111 386 112"
        fill="none" stroke="#9b9a8d" stroke-width="2"
        stroke-linecap="round" opacity=".8"/>
  <path d="M402 120V335"
        fill="none" stroke="#050605" stroke-width="2"/>

  <!-- Стрелка -->
  <path d="M384 89L370 127H379V159H389V127H398Z"
        fill="#e5e0cb" stroke="#c8c3b1" stroke-width="1.5"/>

  <!-- Центральный фиксатор -->
  <circle cx="384" cy="194" r="17"
          fill="#10110f" stroke="#4c4d45" stroke-width="3"/>
  <circle cx="384" cy="194" r="11"
          fill="url(#steel)" stroke="#191a17" stroke-width="2"/>
  <circle cx="384" cy="194" r="4.5"
          fill="#e1ddcc" stroke="#66675d" stroke-width="1.5"/>
  <circle cx="382" cy="192" r="1.5" fill="#fff" opacity=".8"/>

  <!-- Табличка АЗ-5 -->
  <rect x="225" y="330" width="322" height="108" rx="10"
        fill="#33342e" opacity=".65"/>
  <rect x="226" y="331" width="316" height="108" rx="10"
        fill="url(#edge)" stroke="#41423b" stroke-width="2"/>
  <rect x="231" y="336" width="306" height="98" rx="7"
        fill="url(#label)" stroke="#d0cbb8" stroke-width="2.5"/>
  <rect x="227" y="332" width="314" height="96" rx="4"
        fill="none" stroke="#55564c" stroke-width="1"/>

  <text x="384" y="410" text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif"
        font-size="100" font-weight="bold"
        letter-spacing="2" fill="#e0dac5">${text}</text>

</svg>
                             `;
    }
}


function ui_direction(direction){
    if (direction == 1){
        ui_power("up_direction", true);
        ui_power("down_direction", false);
    } else if (direction == -1){
        ui_power("up_direction", false);
        ui_power("down_direction", true);
    } else {
        ui_power("up_direction", false);
        ui_power("down_direction", false);
    }
}


function ui_power_source(number, id_pump){
    for (let i = 1; i < 6; i++){
        if (number == i){
            start_alert_background(`${number}_source_${id_pump}`);
        }  else {
            stop_alert_background(`${i}_source_${id_pump}`);
        }
    }
}


function select_game_menu(){
    showdiv1("game_select_d");
}


function gener_select_task_menu(tasks){
    let cont = document.getElementById("select_task");
    var k = Object.keys(tasks);
    k.sort();
    for (i = 0; i < k.length; i++){
        cont.innerHTML += `<div onclick="game.set_task(${k[i]})" class="card" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">Задания</h5>
    <h6 class="card-subtitle mb-2 text-body-secondary">За выполнение ${tasks[k[i]]["points"]} очков</h6>
    <p class="card-text">${tasks[k[i]]["text"]}</p>
    <p class="card-text">Время на выполнение ${tasks[k[i]]["time"]}с.</p>

  </div>
</div>`;
    }
}


function clear_and_write_text_task(text){
    let cont = document.getElementById("select_task");
    cont.textContent = text;
}

//document.addEventListener('mousemove', e => {
//	const x = (e.clientX / window.screen.availWidth) * 360;
//	const x2 = (e.clientX / window.screen.availWidth) * 180;
//	document.getElementById("viyr").style.background = `linear-gradient(90deg, hsl(${x}, 100%, 50%), hsl(${x2}, 50%, 50%)`;
//});