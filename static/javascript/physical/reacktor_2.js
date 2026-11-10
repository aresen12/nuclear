

// стержни СУЗ для расчета матриц не трогать
let suz = [
    [-1, -1, 15, 15, 0, 15, 15, -1, -1],
    [-1, 15, 15, 15, 15, 15, 15, 15, -1],
    [15, 15, 15, 15, 15, 15, 15, 15, 15],
    [15, 15, 15, 15, 15, 15, 15, 15, 15],
    [0, 15, 15, 15, 100, 15, 15, 15, 0],
    [15, 15, 15, 15, 15, 15, 15, 15, 15],
    [15, 15, 15, 15, 15, 15, 15, 15, 15],
    [-1, 15, 15, 15, 15, 15, 15, 15, -1],
    [-1, -1, 15, 15, 0, 15, 15, -1, -1]
];
for(let i = 0; i<suz.length;i++){
 for(let j = 0; j<suz[i].length;j++){
    if(suz[i][j] !== -1){
      suz[i][j] = 15
    }
  }
}


let left_water  = 5124.6;  // расход через левую половину (34 ячейки), кг/с (10400*34/69)
let right_water = 5275.4;  // расход через правую половину (35 ячеек), кг/с (10400*35/69)
let T_left_water  = 543.15; // температура воды на ВХОДЕ в левую половину, К
let T_right_water = 543.15; // температура воды на ВХОДЕ в правую половину, К
let P_left  = 6.5;          // давление левой половины, МПа
let P_right = 6.5;          // давление правой половины, МПа

// N[y][x] = {m, b, c:[c1..c6]} ---> m - медленные, b - быстрые нейтроны (шт. в ячейке),
//                                c - ядра-предшественники запаздывающих нейтронов 6 групп (шт.)
// T[y][x] = {t_u, t_g, ental, t_w, t_out}
//   t_u - топливо, К; t_g - графит, К; ental - средняя энтальпия воды, Дж/кг;
//   t_w - температура воды в ячейке, К; t_out - температура воды на выходе ячейки, К

let N, T;




//  КОНСТАНТЫ!!!!!!!!!!!

const PI = Math.PI;

// ВРЕМЯ
const DT = 0.001;              // шаг внутреннего подшага, с
const STEPS = 1000;            // подшагов за один вызов
const CALL_TIME = DT * STEPS;  // время одного вызова (интервал усреднения), с
const P_NOM = 3200e6;          // номинальная тепловая мощность, Вт

//  Геометрия
const SIZE = 9;                         // матрица 9*9
const N_CELLS = 69;                     // активных ячеек
const D_CORE = 11.8;                    // диаметр активной зоны, м
const H_CORE = 7.0;                     // высота активной зоны, м
const A_CELL = D_CORE / SIZE;           // сторона ячейки, м
const V_CELL = A_CELL * A_CELL * H_CORE;// объём ячейки, м3
const N_CHANNELS = 1661;                // топливных каналов в РБМК-1000
const CH_IN_CELL = N_CHANNELS / N_CELLS;// каналов в одной ячейке модели
const PITCH = 0.25;                     // шаг решётки графитовых колонн, м
const D_HOLE = 0.114;                   // отверстие в графитовой колонне, м
const RODS_IN_CH = 18;                  // твэлов в кассете
const D_PELLET = 0.0115;                // диаметр топливной таблетки, м
const D_CLAD = 0.0136;                  // наружный диаметр оболочки твэла, м
const D_CLAD_IN = 0.0118;               // внутренний диаметр оболочки, м
const D_TUBE = 0.015;                   // центральная несущая труба кассеты, м (оценка)
const D_CH = 0.080;                     // внутренний диаметр трубы канала, м

const L_RODS = CH_IN_CELL * RODS_IN_CH * H_CORE;                       // длина всех твэлов ячейки, м
const F_FUEL = L_RODS * PI / 4 * D_PELLET ** 2 / V_CELL;               // объёмная доля топлива
const A_FLOW = PI / 4 * (D_CH ** 2 - RODS_IN_CH * D_CLAD ** 2 - D_TUBE ** 2); // проходное сечение канала, м2
const D_HYD = 4 * A_FLOW / (PI * (D_CH + RODS_IN_CH * D_CLAD + D_TUBE)); // гидравлический диаметр, м
const F_WATER = CH_IN_CELL * A_FLOW * H_CORE / V_CELL;                 // объёмная доля теплоносителя
const F_GR = 1 - PI / 4 * D_HOLE ** 2 / PITCH ** 2;                    // объёмная доля графита

//  Ядерные данные(верим что правдивые)
const N_A = 6.022e23;          // число Авогадро, 1/моль
const BARN = 1e-28;            // барн, м2
const V0 = 2200;               // скорость тепловых нейтронов, м/с
const E_F = 200e6 * 1.602e-19; // энергия одного деления, Дж
const NU = 2.43;               // нейтронов на деление U-235
const EPS = 1.03;              // коэффициент размножения на быстрых нейтронах
const ENRICH = 0.02;           // обогащение по U-235
const RHO_UO2 = 10400;         // плотность UO2, кг/м3
const M_UO2 = 0.270;           // молярная масса UO2, кг/моль
const RHO_GR = 1650;           // плотность графита, кг/м3
const M_C = 0.012;             // молярная масса углерода, кг/моль
const M_H2O = 0.018;           // молярная масса воды, кг/моль
const SF_U5 = 585;             // деление U-235 тепловыми, барн
const SA_U5 = 681;             // поглощение U-235, барн
const SA_U8 = 2.68;            // поглощение U-238 тепловыми, барн
const SA_C = 0.0035;           // поглощение углерода, барн
const SS_C = 4.75;             // рассеяние углерода, барн
const SA_H = 0.332;            // поглощение водорода, барн
const SA_O = 0.00019;          // поглощение кислорода, барн
const XI_C = 0.158;            // средняя потеря логарифма энергии на углероде
const MU_C = 2 / (3 * 12);     // средний косинус рассеяния на углероде

// резонансный захват U-238 и эффект Доплера (корреляция Хелстранда)
const DANCOFF = 0.4;                                        // затенение твэлов в 18-стержневой сборке(плюс-минус)
const S_M = 4 / (D_PELLET * 100 * RHO_UO2 / 1000) * (1 - DANCOFF); // поверхность к массе, см2/г
const RI_300 = 4.45 + 26.6 * Math.sqrt(S_M);                // резонансный интеграл при 300 К, барн(сам хз, в формуле надо)
const B_DOP = 6.1e-3 + 4.7e-3 * S_M;                        // доплеровский рост интеграла, 1/К^0.5

// макросечения (на объём ячейки)
const N_UO2 = RHO_UO2 / M_UO2 * N_A * F_FUEL;  // молекул UO2 в м3 ячейки
const N_U5 = N_UO2 * ENRICH;                    // ядер U-235, 1/м3
const N_U8 = N_UO2 * (1 - ENRICH);              // ядер U-238, 1/м3
const SIG_F = N_U5 * SF_U5 * BARN;              // сечение деления, 1/м
const SIG_A_FUEL = (N_U5 * SA_U5 + N_U8 * SA_U8) * BARN; // поглощение в топливе, 1/м
const N_CARBON = RHO_GR / M_C * N_A * F_GR;     // ядер углерода, 1/м3
const SIG_A_GR = N_CARBON * SA_C * BARN;        // поглощение в графите, 1/м
const SIG_S_GR = N_CARBON * SS_C * BARN;        // рассеяние в графите, 1/м
const SLOW_POWER = XI_C * SIG_S_GR;             // замедляющая способность графита, 1/м
const T_SLOW = 2 / (SLOW_POWER * V0);           // время замедления до тепловой энергии, с
const D_TH = 1 / (3 * (SIG_S_GR * (1 - MU_C) + SIG_A_FUEL + SIG_A_GR)); // Коэфф. Диффузии тепловых, м
const AGE = 0.040;                              // возраст нейтронов в решётке РБМК, м2 (оценка +- квадратный километр)

// стержни СУЗ: «чёрный» поглотитель, поглощение = поток × поверхность / 4 - так умный дядя сказал, так что верим
const R_ROD = 0.035;                            // радиус поглотителя, м (с погрешностью)
const RODS_PER_CELL = 211 / N_CELLS;            // стержней СУЗ на ячейку модели
const SIG_ROD = RODS_PER_CELL * (2 * PI * R_ROD * H_CORE / 4) / V_CELL; // при полном вводе, 1/м

// перенос нейтронов между ячейками и утечка
const K_FAST = AGE / (T_SLOW * A_CELL ** 2);    // обмен быстрыми с соседом, 1/с
const K_SLOW = D_TH * V0 / A_CELL ** 2;         // обмен медленными с соседом, 1/с
const REFL = 0.4;                               // экономия от графитового отражателя, м (оценка)
const EXTRAP = 2.13 * D_TH + REFL;              // длина экстраполяции на границе, м
const EDGE = A_CELL / (A_CELL / 2 + EXTRAP);    // доля утечки через свободную грань
const BZ2 = (PI / (H_CORE + 2 * EXTRAP)) ** 2;  // осевой геометрический параметр, 1/м2
const AX_FAST = AGE / T_SLOW * BZ2;             // осевая утечка быстрых, 1/с
const AX_SLOW = D_TH * V0 * BZ2;                // осевая утечка медленных, 1/с

//Дальше мои полномочия все...
// Запаздывающие нейтроны U-235 (Кипин)
const BETA   = [0.000215, 0.001424, 0.001274, 0.002568, 0.000748, 0.000273]; // доли групп
const LAMBDA = [0.0124, 0.0305, 0.111, 0.301, 1.14, 3.01];                   // постоянные распада, 1/с
const BETA_SUM = BETA.reduce((a, v) => a + v, 0);            // полная доля, 0.0065

// источник: спонтанное деление U-238 (0.0136 нейтрона/(с·г))
const M_U8_G = RHO_UO2 * F_FUEL * V_CELL * (238 / 270) * (1 - ENRICH) * 1000; // масса U-238 в ячейке, г
const S_SRC = M_U8_G * 0.0136;                  // нейтронов в секунду на ячейку

let SIG_EXTRA = 0; // поглощение продуктов деления, Xe, выгорания, 1/м — вычисляется в start_state()

// Тепловые константы(это хоть чуть-чуть знаем)
const SHARE_FUEL = 0.934;  // доля энергии деления в топливе
const SHARE_GR = 0.055;    // доля в графите (гамма, замедление)
const SHARE_W = 0.011;     // доля прямо в воде
const CP_UO2 = 310;        // теплоёмкость UO2, Дж/(кг*К)
const CP_GR = 1600;        // теплоёмкость графита при 500–600 C, Дж/(кг*К)
const K_UO2 = 3.0;         // теплопроводность UO2, Вт/(м*К)
const K_ZR = 17;           // теплопроводность циркониевой оболочки, Вт/(м*К)
const H_GAP = 5000;        // проводимость зазора таблетка–оболочка, Вт/(м2*К)
const K_GR = 30;           // теплопроводность облучённого графита, Вт/(м*К)
const G_GR_LIN = 56;       // графит --- канал на метр канала, Вт/(м*К) (из T_гр~550 C на номинале)

const C_FUEL = RHO_UO2 * F_FUEL * V_CELL * CP_UO2;  // теплоёмкость топлива ячейки, Дж/К
const C_GR = RHO_GR * F_GR * V_CELL * CP_GR;        // теплоёмкость графита ячейки, Дж/К
const R_FUEL_IN = 1 / (8 * PI * K_UO2)              // таблетка (средняя температура)
                + 1 / (PI * D_PELLET * H_GAP)        // газовый зазор
                + Math.log(D_CLAD / D_CLAD_IN) / (2 * PI * K_ZR); // оболочка; м*К/Вт
const G_GW = G_GR_LIN * CH_IN_CELL * H_CORE;        // графит --- вода в ячейке, Вт/К
const G_GG = K_GR * F_GR * H_CORE;                  // графит --- графит соседа, Вт/К

//  Теплоноситель(перекочевал с моего давление)
const MU_L = 9.0e-5;   // вязкость воды, Па*с
const K_L = 0.57;      // теплопроводность воды, Вт/(м*К)
const MU_S = 1.9e-5;   // вязкость пара, Па*с
const K_S = 0.06;      // теплопроводность пара, Вт/(м*К)
const CP_S = 3000;     // теплоёмкость перегретого пара, Дж/(кг*К)
const H_MIN = 1000;    // теплоотдача без расхода (естественная конвекция), Вт/(м2*К)
const SLIP = 1.5;      // скольжение пара относительно воды
const DRHO_DT = 1.9;   // рост плотности недогретой воды, кг/(м3*К)
const RHO_MAX_W = 1000;// предел плотности воды, кг/м3

// линия насыщения IAPWS-IF97: p МПа, ts К, hf/hg Дж/кг, rf/rg кг/м3,
// cp - средняя теплоёмкость недогретой воды вблизи насыщения, Дж/(кг*К)[так интернет сказал]
const SAT = [
  { p: 0.1, ts: 372.76, hf: 417.4e3,  hg: 2675.0e3, rf: 958.6, rg: 0.590, cp: 4.22e3 },
  { p: 1,   ts: 453.03, hf: 762.5e3,  hg: 2777.1e3, rf: 887.1, rg: 5.145, cp: 4.40e3 },
  { p: 3,   ts: 507.00, hf: 1008.3e3, hg: 2803.2e3, rf: 822.0, rg: 15.00, cp: 4.77e3 },
  { p: 5,   ts: 537.09, hf: 1154.5e3, hg: 2794.2e3, rf: 777.4, rg: 25.35, cp: 5.00e3 },
  { p: 6,   ts: 548.74, hf: 1213.9e3, hg: 2784.6e3, rf: 758.2, rg: 30.82, cp: 5.15e3 },
  { p: 7,   ts: 558.98, hf: 1267.7e3, hg: 2773.5e3, rf: 740.1, rg: 36.54, cp: 5.30e3 },
  { p: 8,   ts: 568.16, hf: 1317.3e3, hg: 2759.0e3, rf: 722.4, rg: 42.52, cp: 5.50e3 },
  { p: 10,  ts: 584.15, hf: 1407.9e3, hg: 2725.5e3, rf: 688.6, rg: 55.46, cp: 6.00e3 }
];

// проверка устойчивости явного переноса нейтронов между ячейками
if (DT * 4 * K_FAST > 1) throw new Error("DT слишком велик для переноса быстрых нейтронов");

const LAYOUT = build_layout(suz); // карта ячеек и соседей


//шаг реактора
function reacktor_step(suz, N, T, left_water, right_water, T_left_water, T_right_water, P_left, P_right) {
  const rods = read_rods(suz);
  const flow = make_flow(left_water, right_water, T_left_water, T_right_water, P_left, P_right);
  const s = unpack(N, T);
  const sum = new_sum(s, flow);
  for (let k = 0; k < STEPS; k++) sub_step(s, rods, flow, sum);
  return pack(s, sum, flow, left_water, right_water);
}



//  ПОДШАГ
// Один подшаг DT: вода -> сечения -> нейтроны -> тепло
function sub_step(s, rods, flow, sum) {
  const w = water_all(s, flow);
  const nuc = nuclear(s, w, rods);
  neutron_step(s, nuc, DT, sum, 0);
  heat_step(s, w, flow, DT, sum);
}



//  ГЕОМЕТРИЯ
// Карта ячеек: координаты, половина контура, соседи, свободные грани
function build_layout(suz) {
  const cells = [], id = [];
  for (let y = 0; y < SIZE; y++) {
    id.push([]);
    for (let x = 0; x < SIZE; x++) {
      if (suz[y][x] === -1) { id[y].push(-1); continue; }
      const left = x < 4 || (x === 4 && y < 4); // левая половина 34 ячейки
      id[y].push(cells.length);
      cells.push({ x, y, side: left ? 0 : 1 });
    }
  }
  if (cells.length !== N_CELLS) throw new Error("Ячеек должно быть 69, найдено " + cells.length);
  if (cells.filter(c => c.side === 0).length !== 34) throw new Error("В левой половине должно быть 34 ячейки");

  const pairs = [], nb = cells.map(() => []), free = new Float64Array(N_CELLS);
  cells.forEach((c, k) => {
    for (const [x, y] of [[c.x + 1, c.y], [c.x - 1, c.y], [c.x, c.y + 1], [c.x, c.y - 1]]) {
      const j = (x >= 0 && x < SIZE && y >= 0 && y < SIZE) ? id[y][x] : -1;
      if (j === -1) { free[k]++; continue; }
      nb[k].push(j);
      if (j > k) pairs.push([k, j]); // каждая пара один раз
    }
  });
  return { cells, pairs, nb, free };
}

// Пустая матрица 9*9 с заглушками -1
function empty_grid(fill) {
  return Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, fill));
}

// Сумма массива
function total(a) {
  let r = 0; for (const v of a) r += v; return r;
}



//  ВВОД / ВЫВОД


// Положения СУЗ по ячейкам
function read_rods(suz) {
  return Float64Array.from(LAYOUT.cells, c => {
    const v = suz[c.y][c.x];
    if (!(v >= 0 && v <= 100)) throw new Error(`СУЗ [${c.y}][${c.x}] = ${v}, допустимо 0..100`);
    return v;
  });
}

// Расход, энтальпия входа и давление для каждой ячейки
function make_flow(lw, rw, tl, tr, pl, pr) {
  if (!(lw >= 0 && rw >= 0)) throw new Error("Расход не может быть отрицательным");
  const count = [34, 35];
  const mass = [lw / count[0], rw / count[1]];
  const h_side = [inlet_h(tl, pl), inlet_h(tr, pr)];
  const pres = [pl, pr];
  return {
    m: Float64Array.from(LAYOUT.cells, c => mass[c.side]),     // кг/с через ячейку
    h_in: Float64Array.from(LAYOUT.cells, c => h_side[c.side]),// Дж/кг на входе
    P: Float64Array.from(LAYOUT.cells, c => pres[c.side]),     // МПа
    P_side: pres
  };
}

// Матрицы -> массивы по ячейкам
function unpack(N, T) {
  const get = f => Float64Array.from(LAYOUT.cells, c => f(N[c.y][c.x], T[c.y][c.x]));
  const s = {
    b: get(n => n.b), m: get(n => n.m),
    c: BETA.map((_, i) => get(n => n.c[i])),
    tu: get((n, t) => t.t_u), tg: get((n, t) => t.t_g), h: get((n, t) => t.ental),
    ms: new Float64Array(N_CELLS) // масса пара на прошлом подшаге, кг
  };
  for (const a of [s.b, s.m, ...s.c]) if (a.some(v => !(v >= 0))) throw new Error("Отрицательное число нейтронов на входе");
  return s;
}

// Энтальпия на выходе ячейки (линейный профиль по высоте)
function out_h(s, flow, k) {
  return flow.m[k] > 0 ? 2 * s.h[k] - flow.h_in[k] : s.h[k];
}

// Масса пара в ячейке, кг
function steam_mass(w) {
  return (w.x >= 1 ? w.rho : w.s.rg * w.void) * F_WATER * V_CELL;
}

// Массивы -> матрицы N, T, Void и масса пара
function to_matrices(s, flow) {
  const N = empty_grid(() => ({ m: -1, b: -1, c: [-1, -1, -1, -1, -1, -1] }));
  const T = empty_grid(() => ({ t_u: -1, t_g: -1, ental: -1, t_w: -1, t_out: -1 }));
  const Void = empty_grid(() => -1);
  const ms = new Float64Array(N_CELLS);
  LAYOUT.cells.forEach((c, k) => {
    const w = water_state(s.h[k], flow.P[k]);
    N[c.y][c.x] = { m: s.m[k], b: s.b[k], c: s.c.map(g => g[k]) };
    T[c.y][c.x] = { t_u: s.tu[k], t_g: s.tg[k], ental: s.h[k], t_w: w.t,
                    t_out: water_state(out_h(s, flow, k), flow.P[k]).t };
    Void[c.y][c.x] = w.void;
    ms[k] = steam_mass(w);
  });
  return { N, T, Void, ms };
}

// Температура смешанной воды на выходе левой и правой половины, К
function outlet_temps(s, flow) {
  const mh = [0, 0], m = [0, 0], hs = [0, 0], cnt = [0, 0];
  LAYOUT.cells.forEach((c, k) => {
    const h = out_h(s, flow, k);
    mh[c.side] += flow.m[k] * h; m[c.side] += flow.m[k]; hs[c.side] += h; cnt[c.side]++;
  });
  return [0, 1].map(i => water_state(m[i] > 0 ? mh[i] / m[i] : hs[i] / cnt[i], flow.P_side[i]).t);
}

// Сборка результата
function pack(s, sum, flow, lw, rw) {
  const out = to_matrices(s, flow);
  const Power = empty_grid(() => -1), Energy = empty_grid(() => -1);
  const Steam = empty_grid(() => ({ mass: -1, rate: -1, second: -1 }));
  LAYOUT.cells.forEach((c, k) => {
    Energy[c.y][c.x] = sum.energy[k];               // Дж за вызов
    Power[c.y][c.x] = sum.energy[k] / CALL_TIME;    // средняя мощность, Вт
    Steam[c.y][c.x] = { mass: out.ms[k],            // масса пара в ячейке, кг
                        rate: sum.steam_rate[k],    // скорость образования пара, кг/с
                        second: sum.steam[k] };     // пар за интервал, кг
  });
  const [t_l, t_r] = outlet_temps(s, flow);
  return {
    N: out.N, T: out.T,
    left_water: lw, right_water: rw,
    T_left_water: t_l, T_right_water: t_r, // ВЫХОД(не перепутать) воды, К
    Void: out.Void, Steam, Power, Energy,
    power_total: sum.e_gen / CALL_TIME,    // Вт
    energy_total: sum.e_gen,               // Дж
    check: make_check(s, sum)
  };
}



//  ВОДА И ПАР(самое сложное, что тут есть)


// Параметры насыщения при давлении P (линейная интерполяция таблицы)
function sat(P) {
  if (P <= SAT[0].p) return SAT[0];
  if (P >= SAT[SAT.length - 1].p) return SAT[SAT.length - 1];
  let i = 0; while (SAT[i + 1].p < P) i++;
  const a = SAT[i], b = SAT[i + 1], f = (P - a.p) / (b.p - a.p), r = {};
  for (const key in a) r[key] = a[key] + f * (b[key] - a[key]);
  return r;
}

// Состояние воды по энтальпии h (Дж/кг) и давлению P (МПа)
function water_state(h, P) {
  const s = sat(P);
  if (h < s.hf) { // недогретая вода
    const t = s.ts - (s.hf - h) / s.cp;
    return { t, x: 0, void: 0, rho: Math.min(RHO_MAX_W, s.rf + DRHO_DT * (s.ts - t)), s };
  }
  if (h <= s.hg) { // пароводяная смесь
    const x = (h - s.hf) / (s.hg - s.hf);                       // массовое паросодержание
    const v = x / (x + SLIP * (1 - x) * s.rg / s.rf);            // объёмное паросодержание
    return { t: s.ts, x, void: v, rho: v * s.rg + (1 - v) * s.rf, s };
  }
  const t = s.ts + (h - s.hg) / CP_S; // перегретый пар
  return { t, x: 1, void: 1, rho: s.rg * s.ts / t, s };
}

// Энтальпия воды на входе, Дж/кг
function inlet_h(T_in, P) {
  const s = sat(P);
  return T_in >= s.ts ? s.hf : s.hf - s.cp * (s.ts - T_in);
}

// Состояние воды во всех ячейках
function water_all(s, flow) {
  const w = new Array(N_CELLS);
  for (let k = 0; k < N_CELLS; k++) w[k] = water_state(s.h[k], flow.P[k]);
  return w;
}

// Коэффициент теплоотдачи к воде (Диттус–Болтер) 😁, Вт/(м2*К)
function heat_coef(m_cell, x, cp_l) {
  const g = m_cell / CH_IN_CELL / A_FLOW; // массовая скорость, кг/(м2·с)
  const h_l = 0.023 * Math.pow(g * D_HYD / MU_L, 0.8) * Math.pow(MU_L * cp_l / K_L, 0.4) * K_L / D_HYD;
  const h_s = 0.023 * Math.pow(g * D_HYD / MU_S, 0.8) * Math.pow(MU_S * CP_S / K_S, 0.4) * K_S / D_HYD;
  return Math.max(H_MIN, (1 - x) * h_l + x * h_s);
}

// Проводимость топливо -> вода в ячейке, Вт/К
function fuel_cond(hc) {
  return L_RODS / (R_FUEL_IN + 1 / (PI * D_CLAD * hc));
}



//  НЕЙТРОНЫ ☆*: .｡. o(≧▽≦)o .｡.:*☆ (аааааааааааааааааааааааааааааааааааааааааааааААА)


// Локальные нейтронные свойства ячеек
function nuclear(s, w, rods) {
  const n = N_CELLS;
  const loss1 = new Float64Array(n), loss2 = new Float64Array(n), p = new Float64Array(n), sig_a = new Float64Array(n);
  for (let k = 0; k < n; k++) {
    // поглощение водой зависит от плотности смеси -> положительный паровой эффект
    const sig_w = w[k].rho / M_H2O * N_A * F_WATER * (2 * SA_H + SA_O) * BARN;
    sig_a[k] = SIG_A_FUEL + SIG_A_GR + sig_w + SIG_ROD * rods[k] / 100 + SIG_EXTRA;
    // доплер: резонансный интеграл растёт с температурой топлива
    const ri = RI_300 * (1 + B_DOP * (Math.sqrt(s.tu[k]) - Math.sqrt(300)));
    p[k] = Math.exp(-N_U8 * ri * BARN / SLOW_POWER); // вероятность избежать резонансного захвата
    const edge = LAYOUT.free[k] * EDGE;
    loss1[k] = 1 / T_SLOW + AX_FAST + K_FAST * edge;          // уход быстрых: замедление + утечка, 1/с
    loss2[k] = sig_a[k] * V0 + AX_SLOW + K_SLOW * edge;       // уход медленных: поглощение + утечка, 1/с
  }
  return { loss1, loss2, p, sig_a };
}

// Шаг нейтронов: перенос явно, местные процессы неявно, предшественники точно
function neutron_step(s, nuc, dt, sum, depth) {
  const n = N_CELLS, born = NU * EPS * SIG_F * V0; // быстрых рождается на 1 медленный за 1 с
  const e = LAMBDA.map(l => Math.exp(-l * dt));
  let g = (1 - BETA_SUM) * dt;                     // мгновенные + запаздывающие, выпущенные в этом шаге
  BETA.forEach((bt, i) => { g += bt * (dt - (1 - e[i]) / LAMBDA[i]); });
  g *= born;
  const q = dt / T_SLOW;

  // если разгон быстрее шага - делим шаг пополам
  let worst = 0;
  for (let k = 0; k < n; k++) worst = Math.max(worst, q * nuc.p[k] * g / ((1 + dt * nuc.loss1[k]) * (1 + dt * nuc.loss2[k])));
  if (worst > 0.9) {
    if (depth >= 12) throw new Error("Разгон на мгновенных нейтронах быстрее минимального шага");
    neutron_step(s, nuc, dt / 2, sum, depth + 1);
    neutron_step(s, nuc, dt / 2, sum, depth + 1);
    return;
  }

  // перенос к соседям: сколько ушло из одной, столько пришло в другую закон!
  const db = new Float64Array(n), dm = new Float64Array(n);
  for (const [i, j] of LAYOUT.pairs) {
    const fb = K_FAST * (s.b[i] - s.b[j]), fm = K_SLOW * (s.m[i] - s.m[j]);
    db[i] -= fb; db[j] += fb; dm[i] -= fm; dm[j] += fm;
  }

  for (let k = 0; k < n; k++) {
    let x = s.b[k] + dt * (db[k] + S_SRC);
    for (let i = 0; i < 6; i++) x += s.c[i][k] * (1 - e[i]); // распад старых предшественников
    const a1 = 1 + dt * nuc.loss1[k], a2 = 1 + dt * nuc.loss2[k], qp = q * nuc.p[k];
    const y = s.m[k] + dt * dm[k];
    const m1 = (y + qp * x / a1) / (a2 - qp * g / a1);  // медленные
    const b1 = (x + g * m1) / a1;                       // быстрые
    const f1 = born * m1;                               // нейтронов деления в секунду
    for (let i = 0; i < 6; i++) s.c[i][k] = s.c[i][k] * e[i] + BETA[i] * f1 * (1 - e[i]) / LAMBDA[i];
    s.b[k] = b1; s.m[k] = m1;
    sum.n_src += S_SRC * dt;
    sum.n_fis += f1 * dt;
    sum.n_lost += dt * ((nuc.loss1[k] - nuc.p[k] / T_SLOW) * b1 + nuc.loss2[k] * m1); // поглощены или утекли
  }
}



//  ТЕПЛО(ненавижу уже эту вашу термодинамику)


// Шаг теплообмена: топливо, графит, вода, соседи, поток, пар
function heat_step(s, w, flow, dt, sum) {
  const q_gg = new Float64Array(N_CELLS); // тепло от соседнего графита, Вт
  for (const [i, j] of LAYOUT.pairs) {
    const q = G_GG * (s.tg[i] - s.tg[j]); q_gg[i] -= q; q_gg[j] += q;
  }
  for (let k = 0; k < N_CELLS; k++) {
    const wk = w[k];
    const pw = E_F * SIG_F * V0 * s.m[k];                                   // мощность деления, Вт
    const q_fw = fuel_cond(heat_coef(flow.m[k], wk.x, wk.s.cp)) * (s.tu[k] - wk.t); // топливо -> вода, Вт
    const q_gw = G_GW * (s.tg[k] - wk.t);                                   // графит -> вода, Вт
    const h_out = out_h(s, flow, k);
    const q_out = flow.m[k] * (h_out - flow.h_in[k]);                       // уносит поток, Вт
    const m_w = F_WATER * V_CELL * wk.rho;                                  // масса воды в ячейке, кг
    const dh = dt * (SHARE_W * pw + q_fw + q_gw - q_out) / m_w;

    s.tu[k] += dt * (SHARE_FUEL * pw - q_fw) / C_FUEL;
    s.tg[k] += dt * (SHARE_GR * pw - q_gw + q_gg[k]) / C_GR;
    s.h[k] += dh;

    // пар: скорость образования = рост массы в ячейке + унос потоком
    const ms = steam_mass(wk);
    const x_out = Math.min(1, Math.max(0, (h_out - wk.s.hf) / (wk.s.hg - wk.s.hf)));
    const rate = (ms - s.ms[k]) / dt + flow.m[k] * x_out;
    s.ms[k] = ms;
    sum.steam_rate[k] = rate;
    sum.steam[k] += rate * dt;

    sum.energy[k] += pw * dt;
    sum.e_gen += pw * dt;
    sum.e_water += m_w * dh;
    sum.e_out += q_out * dt;
  }
}



//  НАКОПЛЕНИЕ И ПРОВЕРКИ


// Полное число нейтронов с предшественниками
function neutrons_total(s) {
  return total(s.b) + total(s.m) + s.c.reduce((a, g) => a + total(g), 0);
}

// Счётчики за вызов
function new_sum(s, flow) {
  for (let k = 0; k < N_CELLS; k++) s.ms[k] = steam_mass(water_state(s.h[k], flow.P[k]));
  const n = N_CELLS;
  return {
    energy: new Float64Array(n), steam: new Float64Array(n), steam_rate: new Float64Array(n),
    e_gen: 0, e_water: 0, e_out: 0,
    tu0: total(s.tu), tg0: total(s.tg), n0: neutrons_total(s),
    n_src: 0, n_fis: 0, n_lost: 0
  };
}

// Баланс энергии и нейтронов за вызов
function make_check(s, sum) {
  const e_fuel = C_FUEL * (total(s.tu) - sum.tu0);
  const e_gr = C_GR * (total(s.tg) - sum.tg0);
  const e_err = sum.e_gen - e_fuel - e_gr - sum.e_water - sum.e_out;
  const n_now = neutrons_total(s);
  const n_err = n_now - sum.n0 - sum.n_src - sum.n_fis + sum.n_lost;
  return {
    energy: { gen: sum.e_gen, fuel: e_fuel, graphite: e_gr, water: sum.e_water, out: sum.e_out,
              error: e_err, rel: e_err / Math.max(sum.e_gen, 1) },
    neutrons: { start: sum.n0, end: n_now, error: n_err, rel: n_err / Math.max(n_now, 1) },
    positive: [s.b, s.m, ...s.c].every(a => a.every(v => v >= 0))
  };
}



//  НОМИНАЛЬНОЕ СОСТОЯНИЕ(костыли пошли)


// Итерационное решение для одной группы (Гаусс–Зейдель) - 🤷‍♂️🤷‍♀️🤷‍♂️
function gs_solve(v, loss, kd, src) {
  for (let sweep = 0; sweep < 20; sweep++)
    for (let k = 0; k < N_CELLS; k++) {
      let inflow = 0; for (const j of LAYOUT.nb[k]) inflow += v[j];
      v[k] = (src[k] + kd * inflow) / (loss[k] + kd * LAYOUT.nb[k].length);
    }
}

// Коэффициент размножения и форма поля (степенной метод)
function solve_k(nuc, b, m) {
  const src = new Float64Array(N_CELLS), born = NU * EPS * SIG_F * V0;
  let k = 1;
  for (let it = 0; it < 150; it++) {
    const old = total(m);
    for (let i = 0; i < N_CELLS; i++) src[i] = born * m[i] / k;
    gs_solve(b, nuc.loss1, K_FAST, src);
    for (let i = 0; i < N_CELLS; i++) src[i] = nuc.p[i] * b[i] / T_SLOW;
    gs_solve(m, nuc.loss2, K_SLOW, src);
    k *= total(m) / old;
  }
  return k;
}

// Стационарные температуры при текущей мощности
function steady_heat(s, flow) {
  for (let k = 0; k < N_CELLS; k++) {
    const pw = E_F * SIG_F * V0 * s.m[k];
    s.h[k] = flow.h_in[k] + pw / flow.m[k] / 2;  // средняя энтальпия = вход + половина нагрева
    const w = water_state(s.h[k], flow.P[k]);
    s.tu[k] = w.t + SHARE_FUEL * pw / fuel_cond(heat_coef(flow.m[k], w.x, w.s.cp));
    s.tg[k] = w.t + SHARE_GR * pw / G_GW;
  }
}

// Расчёт номинала: критичность, 3200 МВт, равновесные температуры и предшественники
function start_state(suz, lw, rw, tl, tr, pl, pr) {
  const rods = read_rods(suz);
  const flow = make_flow(lw, rw, tl, tr, pl, pr);
  if (flow.m.some(v => v <= 0)) throw new Error("Для номинала нужен расход > 0");
  const n = N_CELLS;
  const s = {
    b: new Float64Array(n).fill(1),
    m: new Float64Array(n).fill(P_NOM / n / (E_F * SIG_F * V0)),
    c: BETA.map(() => new Float64Array(n)),
    tu: new Float64Array(n), tg: new Float64Array(n), h: new Float64Array(n),
    ms: new Float64Array(n)
  };
  steady_heat(s, flow);
  for (let it = 0; it < 40; it++) {
    const nuc = nuclear(s, water_all(s, flow), rods);
    const k = solve_k(nuc, s.b, s.m);
    SIG_EXTRA += total(nuc.sig_a) / n * (k - 1); // добавочное поглощение до k = 1
    const scale = P_NOM / (E_F * SIG_F * V0 * total(s.m));
    for (let i = 0; i < n; i++) { s.m[i] *= scale; s.b[i] *= scale; }
    steady_heat(s, flow);
    if (Math.abs(k - 1) < 1e-7) break;
  }
  if (SIG_EXTRA < 0) throw new Error("При таких СУЗ реактор не выходит на номинал: выведите стержни");
  for (let i = 0; i < 6; i++)
    for (let k = 0; k < n; k++) s.c[i][k] = BETA[i] * NU * EPS * SIG_F * V0 * s.m[k] / LAMBDA[i];
  const out = to_matrices(s, flow);
  return { N: out.N, T: out.T };
}



//  ЗАПОЛНЕНИЕ НАЧАЛЬНОГО СОСТОЯНИЯ (3200 МВт)
({ N, T } = start_state(suz, left_water, right_water, T_left_water, T_right_water, P_left, P_right));

//пример использование трогать можно

suz = [
    [-1, -1, 15, 15, 15, 15, 15, -1, -1],
    [-1, 15, 15, 15, 15, 15, 15, 15, -1],
    [15, 15, 15, 15, 15, 15, 15, 15, 15],
    [15, 15, 15, 15, 15, 15, 15, 15, 15],
    [15, 15, 15, 15, 15, 15, 15, 15, 15],
    [15, 15, 15, 15, 15, 15, 15, 15, 15],
    [15, 15, 15, 15, 15, 15, 15, 15, 15],
    [-1, 15, 15, 15, 15, 15, 15, 15, -1],
    [-1, -1, 15, 15, 15, 15, 15, -1, -1]
];

for(let i = 0; i<suz.length;i++){
  for(let j = 0; j<suz[i].length;j++){
    if(suz[i][j] !== -1){
      suz[i][j] = 15
    }
  }
}
//считает реактивность
function get_reactivity() {
  const rods = read_rods(suz);

  const flow = make_flow(
    left_water,
    right_water,
    T_left_water,
    T_right_water,
    P_left,
    P_right
  );

  const state = unpack(N, T);
  const water = water_all(state, flow);
  const properties = nuclear(state, water, rods);

  // solve_k изменяет переданные массивы, поэтому используем копии
  const k = solve_k(
    properties,
    Float64Array.from(state.b),
    Float64Array.from(state.m)
  );

  return {
    k: k,
    rho: (k - 1) / k
  };
}

let time = 0;

 setInterval(() => {
  try {
    const result = reacktor_step(
      suz,
      N,
      T,
      left_water,
      right_water,
      T_left_water,
      T_right_water,
      P_left,
      P_right
    );
    console.log(result.T[3][3].t_u-273)
    console.log(result.T[3][3].t_g-273)
    // Сохраняем состояние для следующего шага
    N = result.N;
    T = result.T;
    time += 1;

    const reaction = get_reactivity();

    let leftVoidSum = 0;
    let rightVoidSum = 0;
    let leftCells = 0;
    let rightCells = 0;



    for (const cell of LAYOUT.cells) {
      const voidValue = result.Void[cell.y][cell.x];


      // cell.side: 0 — левый контур, 1 — правый
      if (cell.side === 0) {
        leftVoidSum += voidValue;
        leftCells++;
      } else {
        rightVoidSum += voidValue;
        rightCells++;
      }


    }

    const leftVoidAvg = leftVoidSum / leftCells;
    const rightVoidAvg = rightVoidSum / rightCells;

    // Условные показатели: средний Void * входной расход
    const leftVoidFlow = leftVoidAvg * left_water;
    const rightVoidFlow = rightVoidAvg * right_water;

    console.log(
      `Время: ${time} с | ` +
      `Мощность: ${(result.power_total / 1e6).toFixed(2)} МВт | ` +
      `Реактивность: ${(reaction.rho * 100).toFixed(4)} % | ` +
      `k: ${reaction.k.toFixed(5)}`
    );

    console.log(
      `Левый контур | ` +
      `T выхода: ${result.T_left_water.toFixed(2)-273} K | ` +
      `Средний Void: ${(leftVoidAvg * 100).toFixed(2)} % | ` +
      `Void * расход: ${leftVoidFlow.toFixed(2)} кг/с`
    );

    console.log(
      `Правый контур | ` +
      `T выхода: ${result.T_right_water.toFixed(2)-273} K | ` +
      `Средний Void: ${(rightVoidAvg * 100).toFixed(2)} % | ` +
      `Void * расход: ${rightVoidFlow.toFixed(2)} кг/с`
    );



    console.log("--------------------------------------------------");

  } catch (error) {

  }
}, 500);

