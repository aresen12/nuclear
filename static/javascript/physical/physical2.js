const D_core = 11.8;  // Диаметр зоны
const H_core = 7.0;  // Высота зоны
const N_grid = 9;  // Сетка
const R2_cut = 20;  // Отсечка углов
const N_cells = 69;  // Число ячеек
const a_cell = D_core / N_grid;  // Шаг ячейки
const V_cell = a_cell ** 2 * H_core;  // Объем ячейки

var f_fuel = 0.024;  // Доля топлива
var f_gr = 0.750;  // Доля графита
var f_w = 0.226;  // Доля теплоносителя

const N_A = 6.022e23;  // Число Авогадро
const k_B = 8.617e-5;  // Постоянная Больцмана
const E_f = 200e6 * 1.602e-19;  // Энергия деления
var nu_f = 2.43;  // Нейтронов на деление
var Lambda_n = 2.5e-4;  // Время жизни
var power_nom = 3200e6;  // Номинальная мощность

groups = [
    {"b": 0.000215, "l": 0.0124},
    {"b": 0.001424, "l": 0.0305},
    {"b": 0.001274, "l": 0.111},
    {"b": 0.002568, "l": 0.301},
    {"b": 0.000748, "l": 1.14},
    {"b": 0.000273, "l": 3.01},
];
const T0 = 293.15;  // Опорная температура
const sigma_f_u5 = 585e-28;  // Деление U-235
const sigma_a_u5 = 681e-28;  // Поглощение U-235
const rho_UO2 = 10.4e3;  // Плотность UO2
const M_UO2 = 0.270;  // Молярная масса UO2
const enrich = 0.02;  // Обогащение
const M_C = 12e-3;  // Молярная масса C
const rho_gr = 1650.0;  // Плотность графита
const sigma_s_C = 4.75e-28;  // Рассеяние C
const sigma_a_C = 0.0035e-28;  // Поглощение C
const mu_C = 0.209;  // Косинус рассеяния C
const M_H2O = 18e-3;  // Молярная масса воды
const sigma_b_H = 80.26e-28;  // Рассеяние H
const sigma_a_H = 0.332e-28;  // Поглощение H
const mu_H = 2.0 / 3.0;  // Косинус рассеяния H
const f_rod_vol = 0.02;  // Доля СУЗ
const Sigma_rod_full = 20.0;  // Сечение СУЗ

const E0_U8 = 6.674;  // Энергия резонанса
const Gamma_U8 = 0.0273;  // Ширина резонанса
const sigma0_U8 = 2.5e-24;  // Пик резонанса
const A_U8 = 238.0;  // Масса U-238
const sigma_b_U8 = 10e-28;  // Фоновое сечение
const A_res = 8.0;  // Параметр резонанса
const xi_gr = 0.158;  // Замедление графит
const xi_w = 0.92  // Замедление вода
const f_homog = 0.1756;  // Гомогенизация
const E_lo = 6.0;
const  E_hi = 7.4;  // Окно энергии
const N_E_grid = 401;  // Точек по энергии

const alpha_void = 0.0098;  // Паровой коэффициент
const alpha_D = -1.2e-5;  // Доплер коэффициент

const T_nass = 285.8 + 273.15;  // Насыщение
const T_in = 270.0 + 273.15;  // Вход воды
const T_ref_h = 270.0 + 273.15;  // Опора энтальпии
const h_in_ref = 1190e3;  // Энтальпия входа
const h_f_sat = 1267e3;  // Энтальпия воды
const h_g_sat = 2772e3;  // Энтальпия пара
const l_v = h_g_sat - h_f_sat;  // Теплота парообразования
const cp_w = 4.9e3;  // Теплоемкость воды
const cp_s = 2.4e3;  // Теплоемкость пара
const rho_w = 740.0;  // Плотность воды
const rho_s = 36.5;  // Плотность пара
const slip_S = 1.5;  // Скольжение пара
const m_total_default = 10400.0;  // Расход полный

mu_w = 9.0e-5;  // Вязкость воды
k_w = 0.5;  // Теплопроводность воды
D_ch = 0.08;  // Диаметр канала
A_flow_cell = 0.38;  // Сечение потока
A_surf_fc = 30.0;  // Поверхность топливо
A_surf_gc = 12.0;  // Поверхность графит

const cp_UO2 = 330.0;  // Теплоемкость UO2
const cp_gr = 1700.0;  // Теплоемкость графита
const c_f = rho_UO2 * f_fuel * V_cell * cp_UO2;  // Емкость топлива
const c_g = rho_gr * f_gr * V_cell * cp_gr;  // Емкость графита
const k_gr = 40.0; //  Теплопроводность графита
const G_gg = k_gr * f_gr * H_core;  // Проводимость соседей
const tau_w = 1.5;  // Время прохода
const n_fuel = 0.934;  # Доля в топливе
const n = 0.055;  // Доля в графите
const n_w = 0.011;  // Доля в воде

const dt_sim = 0.05;  // Шаг модели
const ROD_INIT_PCT = 20.0;  // СУЗ начальное


function lin_space(a, b, n){
    if (n == 1){
        return [a];
    }
    let st = (b - a) / (n - 1);
    let mass = [];
    for (let i = 0; i < n; i++){
        mass.push(a + st * i);
    }
    return mass;
}


function interp(x, xs, ys){
    if (x <= xs[0]){
        return ys[0];
    }
    if (x >= xs[-1]){
        return ys[-1];
    }
    let lo = 0;
    let hi = len(xs) - 1;
    while (hi - lo > 1){
        let mid = Number(((lo + hi) / 2).toFixed(0));
        if (xs[mid] <= x){
            lo = mid;
        } else{
            hi = mid;
        }
    }
    return ys[lo] + (ys[hi] - ys[lo]) * (x - xs[lo]) / (xs[hi] - xs[lo]);
}


// Учебная модель реактора: перевод расчётного ядра на JavaScript.
// Графический интерфейс tkinter удалён; имена функций и переменных сохранены.
// Упрощённая учебная модель, не предназначенная для управления реальным реактором.
function mat_vec(A,v) {
    return A.map(row=>row.reduce((s,a,i)=>s+a*v[i],0));
}

function mat_inv(A) {
    const n=A.length,M=A.map((r,i)=>[...r,...Array.from( {
        length:n
    },(_,j)=>i===j?1:0)]);
    for(let c=0;c<n;c++) {
        let p=c;
        for(let r=c+1;r<n;r++)if(Math.abs(M[r][c])>Math.abs(M[p][c]))p=r;
        if(Math.abs(M[p][c])<1e-300)throw Error('Матрица вырождена');
        [M[c],M[p]]=[M[p],M[c]];
        const d=M[c][c],rc=M[c].map(z=>z/d);
        M[c]=rc;
        for(let r=0;r<n;r++)if(r!==c) {
            const f=M[r][c];
            if(f!==0)M[r]=M[r].map((a,j)=>a-f*rc[j]);
        }
    }
    return M.map(r=>r.slice(n));
}

function eig_max(M,v0=null,tol=1e-12,it_max=5000) {
    const n=M.length;
    let v=v0?[...v0]:Array(n).fill(1),s=v.reduce((a,z)=>a+z,0);
    v=v.map(z=>z/s);
    let lam=0;
    for(let it=0;it<it_max;it++) {
        let w=mat_vec(M,v);
        lam=w.reduce((a,z)=>a+z,0);
        if(lam<=0)break;
        w=w.map(z=>z/lam);
        const dv=Math.max(...w.map((a,i)=>Math.abs(a-v[i])));
        v=w;
        if(dv<tol)break;
    }
    return[lam,v];
}


function build_geometry() {
    const idx=[];
    for(let iy=-4;iy<=4;iy++)for(let ix=-4;ix<=4;ix++)if(ix*ix+iy*iy<=R2_cut)idx.push([ix,iy]);
    if(idx.length!==N_cells)throw Error('Неверное число ячеек');
    const grid=idx,coords=grid.map(([ix,iy])=>[ix*a_cell,iy*a_cell]);
    const R=coords.map(p=>coords.map(q=>Math.hypot(p[0]-q[0],p[1]-q[1])));
    for(let i=0;i<N_cells;i++)R[i][i]=1;
    const adj=R.map((row,i)=>row.map((v,j)=>i!==j&&Math.abs(v-a_cell)<1e-6?1:0));
    return {
        grid,R,adj
    };
}


function build_doppler_table(T_points=null) {
    if(T_points===null)T_points=lin_space(300,3000,55);
    const E=lin_space(E_lo,E_hi,N_E_grid),dE=E[1]-E[0],g2=(Gamma_U8/2)**2,sig_raw=E.map(e=>sigma0_U8*g2/((e-E0_U8)**2+g2)),sig_tab=[];
    for(const T of T_points) {
        const std=Math.sqrt(E0_U8*k_B*T/A_U8),wm=Math.min(N_E_grid-1,Math.trunc(8*std/dE)+1),w=Array.from( {
            length:wm+1
        },(_,d)=>Math.exp(-.5*(d*dE/std)**2)),wf=[...w.slice(1).reverse(),...w],sig_D=[];
        for(let i=0;i<N_E_grid;i++) {
            const lo=Math.max(0,i-wm),hi=Math.min(N_E_grid-1,i+wm),ker=wf.slice(wm-(i-lo),wm+(hi-i)+1),vals=sig_raw.slice(lo,hi+1);
            sig_D.push(ker.reduce((s,a,j)=>s+a*vals[j],0)/ker.reduce((s,a)=>s+a,0));
        }
        const phi=E.map((e,i)=>(1/e)/(1+sig_D[i]/sigma_b_U8)),num=sig_D.reduce((s,v,i)=>s+v*phi[i],0);
        sig_tab.push(f_homog*num/phi.reduce((s,v)=>s+v,0));
    }
    return {
        T_points,sig_tab
    };
}


const  {
    T_points:T_tab,sig_tab:sig_u8_tab
}
=build_doppler_table();
function sigma_u8_eff(T) {
    return interp(T,T_tab,sig_u8_tab);
}
function void_fraction(x) {
    if(x<=0)return 0;
    return x/(x+slip_S*(1-x)*rho_s/rho_w);
}
function macro_fuel(T_f,T_n) {
    const N_UO2=rho_UO2*N_A/M_UO2*f_fuel,N_U235=N_UO2*enrich,N_U238=N_UO2*(1-enrich),ratio=Math.sqrt(T0/T_n),Sigma_f=N_U235*sigma_f_u5*ratio,Sigma_a=N_U235*sigma_a_u5*ratio+N_U238*sigma_u8_eff(T_f);
    return[Sigma_f,Sigma_a];
}
function macro_water(alpha_v) {
    const rho_mix=alpha_v*rho_s+(1-alpha_v)*rho_w,N_H2O=rho_mix/M_H2O*N_A*f_w;
    return[N_H2O*2*sigma_b_H,N_H2O*2*sigma_a_H];
}
function macro_graphite() {
    const N_C=rho_gr/M_C*N_A*f_gr;
    return[N_C*sigma_s_C,N_C*sigma_a_C];
}


function macro_rods(ozr_pct) {
    if(!Array.isArray(ozr_pct))throw Error(`ozr_pct должен быть списком из ${N_cells} чисел`);
    const pct=ozr_pct.map(Number);
    if(pct.length!==N_cells)throw Error(`ozr_pct должен содержать ${N_cells} значений`);
    if(!pct.every(Number.isFinite))throw Error('Все значения ozr_pct должны быть конечными');
    if(pct.some(v=>v<0||v>100))throw Error('Положение СУЗ должно быть в диапазоне от 0 до 100%');
    return pct.map(v=>f_rod_vol*Sigma_rod_full*v/100);
}


function cell_cross_sections(T_f,T_g,x,ozr_pct) {
    const[Sig_s_gr,Sig_a_gr]=macro_graphite(),Sig_a_rod=macro_rods(ozr_pct),Sig_f=[],Sig_a=[],Sig_tr=[];
    for(let i=0;i<N_cells;i++) {
        const[Sf,Sa_fuel]=macro_fuel(T_f[i],T_g[i]),[Sig_s_w,Sig_a_w]=macro_water(void_fraction(x[i])),Sa=Sa_fuel+Sig_a_w+Sig_a_gr+Sig_a_rod[i];
        Sig_f.push(Sf);
        Sig_a.push(Sa);
        Sig_tr.push(Sa+Sig_s_gr*(1-mu_C)+Sig_s_w*(1-mu_H));
    }
    return[Sig_f,Sig_a,Sig_tr];
}
function transfer_matrix(Sig_a,Sig_tr,R) {
    const n_c=Sig_a.length,D=Sig_tr.map(s=>1/(3*s)),L=D.map((v,i)=>Math.max(Math.sqrt(v/Sig_a[i]),a_cell)),esc=L.map(v=>Math.exp(-a_cell/v)),W=Array.from( {
        length:n_c
    },(_,i)=>Array.from( {
        length:n_c
    },(_,j)=>i===j?0:Sig_a[i]*Math.exp(-(R[i][j]-a_cell)/L[j])/R[i][j]**2)),W_sum=Array.from( {
        length:n_c
    },(_,j)=>Math.max(W.reduce((s,row)=>s+row[j],0),1e-300));
    return Array.from( {
        length:n_c
    },(_,i)=>Array.from( {
        length:n_c
    },(_,j)=>i===j?1-esc[j]:esc[j]*W[i][j]/W_sum[j]));
}
function resonance_escape(x) {
    return x.map(xi=> {
        const rho_mix=void_fraction(xi)*rho_s+(1-void_fraction(xi))*rho_w,N_gr=rho_gr/M_C*N_A*f_gr,Sig_mod_gr=xi_gr*N_gr*sigma_s_C,Sig_mod_w=xi_w*rho_mix/M_H2O*N_A*f_w*2*sigma_b_H;return Math.exp(-A_res/(Sig_mod_gr+Sig_mod_w));
    });
}
const _warm= {
    S:null
};
function solve_keff(T,eta) {
    const M=eta.map((v,i)=>eta.map((_,j)=>nu_f*v*T[i][j])),[lam,S]=eig_max(M,_warm.S);
    _warm.S=S;
    return[lam,S];
}
function kinetics_step(P,C,rho_r,dt) {
    const e=lam_arr.map(l=>Math.exp(-l*dt)),a=1-dt*(rho_r-b)/Lambda_n-dt*beta_arr.reduce((s,v,i)=>s+v/Lambda_n*(1-e[i]),0),rhs=P+dt*lam_arr.reduce((s,v,i)=>s+v*C[i]*e[i],0),P_new=rhs/a,C_new=C.map((v,i)=>v*e[i]+beta_arr[i]*P_new/(Lambda_n*lam_arr[i])*(1-e[i]));
    return[P_new,C_new];
}
function kinetics_advance(P,C,rho_r,dt) {
    const dt_max=Math.min(dt,sub_frac*Lambda_n/Math.max(rho_r,b)),n_sub=Math.min(500,Math.max(1,Math.ceil(dt/dt_max))),dt_sub=dt/n_sub;
    for(let i=0;i<n_sub;i++)[P,C]=kinetics_step(P,C,rho_r,dt_sub);
    return[P,C];
}
function inlet_enthalpy(T_inlet) {
    return h_in_ref+cp_w*(T_inlet-T_ref_h);
}
function coolant_from_enthalpy(h) {
    const T_w=[],x=[];
    for(const hi of h) {
        if(hi<=h_f_sat) {
            T_w.push(T_ref_h+(hi-h_in_ref)/cp_w);
            x.push(0);
        }
        else {
            x.push(Math.min(1,(hi-h_f_sat)/l_v));
            T_w.push(hi<=h_g_sat?T_nass:T_nass+(hi-h_g_sat)/cp_s);
        }
    }
    return[T_w,x];
}
function heat_transfer_coeff(x,m_cell) {
    const Pr=mu_w*cp_w/k_w,out=[];
    for(let i=0;i<x.length;i++) {
        const G=m_cell[i]/A_flow_cell,Re=G*D_ch/mu_w,Nu=.023*Re**.8*Pr**.4;
        out.push(Nu*k_w/D_ch*(1+2.5*x[i]));
    }
    return out;
}
function split_coolant_flows(grid) {
    const left=[],right=[];
    grid.forEach(([ix,iy],k)=> {
        if(ix<0||(ix===0&&iy<0))left.push(k);else right.push(k);
    });
    if(left.length!==34||right.length!==35)throw Error(`Неверное разбиение зоны: слева ${left.length}, справа ${right.length}`);
    return[left,right];
}
const  {
    grid,R,adj
}
=build_geometry();
const[left_cells,right_cells]=split_coolant_flows(grid);
function coolant_arrays(m_left,m_right,T_left,T_right) {
    const m_cell=Array(N_cells).fill(0),T_in_cells=Array(N_cells).fill(0);
    for(const k of left_cells) {
        m_cell[k]=m_left/left_cells.length;
        T_in_cells[k]=T_left;
    }
    for(const k of right_cells) {
        m_cell[k]=m_right/right_cells.length;
        T_in_cells[k]=T_right;
    }
    return[m_cell,T_in_cells];
}
let _exchange_dt=null,_exchange_matrix=null;
function exchange_matrix(dt) {
    if(_exchange_dt===dt&&_exchange_matrix!==null)return _exchange_matrix;
    const deg=adj.map(row=>row.reduce((s,v)=>s+v,0)),q=dt*G_gg/c_g,A=Array.from( {
        length:N_cells
    },(_,i)=>Array.from( {
        length:N_cells
    },(_,j)=>i===j?1+q*deg[i]:-q*adj[i][j]));
    _exchange_matrix=mat_inv(A);
    _exchange_dt=dt;
    return _exchange_matrix;
}


function heat_exchange(T_g,dt) {
    return mat_vec(exchange_matrix(dt),T_g);
}


function init_state(m_left=m_total_default/2,m_right=m_total_default/2,T_left=T_in,T_right=T_in) {
    const P=power_nom,C=beta_arr.map((v,i)=>v*P/(Lambda_n*lam_arr[i])),P_cell=Array(N_cells).fill(P/N_cells),[m_cell,T_in_cells]=coolant_arrays(m_left,m_right,T_left,T_right),x0=Array(N_cells).fill(.14),h_conv=heat_transfer_coeff(x0,m_cell),UA_fc=h_conv.map(v=>v*A_surf_fc),UA_gc=h_conv.map(v=>v*A_surf_gc);
    let T_w=Array(N_cells).fill(T_nass);
    const T_f=T_w.map((v,i)=>v+n_fuel*P_cell[i]/UA_fc[i]),T_g=T_w.map((v,i)=>v+n*P_cell[i]/UA_gc[i]),Q_w=T_w.map((v,i)=>n_w*P_cell[i]+UA_fc[i]*(T_f[i]-v)+UA_gc[i]*(T_g[i]-v)),h=Q_w.map((v,i)=>inlet_enthalpy(T_in_cells[i])+v/m_cell[i]);
    [T_w]=coolant_from_enthalpy(h);
    const[,x]=coolant_from_enthalpy(h);
    return {
        P,C,T_f,T_g,T_w,h,x,t:0,T_f_ref:[...T_f],T_g_ref:[...T_g],x_ref:[...x]
    };
}

// Кэш нейтронной части: она зависит только от СУЗ и опорного состояния
const _neu= {
    key:null,rho:0,share:null
};


function reactor_step(state,ozr_pct,m_left,m_right,T_left=T_in,T_right=T_in,dt=dt_sim) {
    const {
        T_f,T_g,T_w,x,h,T_f_ref,x_ref
    }
    =state,[m_cell,T_in_cells]=coolant_arrays(m_left,m_right,T_left,T_right),[rho_static,share]=neutron_block(state,ozr_pct),rho_void=alpha_void*x.reduce((s,v,i)=>s+share[i]*(void_fraction(v)-void_fraction(x_ref[i]),0),0),h_conv=heat_transfer_coeff(x,m_cell),UA_fc=h_conv.map(v=>v*A_surf_fc),UA_gc=h_conv.map(v=>v*A_surf_gc);
    let P=state.P,C=[...state.C],Tf=[...T_f],t_left=dt,n_sub=0,E_tot=0,rho_r=0;
    while(t_left>1e-12) {
        const rho_dop=alpha_D*Tf.reduce((s,v,i)=>s+share[i]*(v-T_f_ref[i]),0);
        rho_r=rho_static+rho_void+rho_dop;
        let dts=Math.min(t_left,sub_frac*Lambda_n/Math.max(rho_r,b));
        if(n_sub>=n_sub_max-1||t_left-dts<.1*dts)dts=t_left;
        const P_old=P;
        [P,C]=kinetics_advance(P,C,rho_r,dts);
        const P_avg=.5*(P_old+P);
        E_tot+=P_avg*dts;
        for(let i=0;i<N_cells;i++)Tf[i]+=dts*(n_fuel*P_avg*share[i]-UA_fc[i]*(Tf[i]-T_w[i]))/c_f;
        t_left-=dts;
        n_sub++;
    }
    const denom=1-rho_r,k_eff=Math.abs(denom)>1e-12?1/denom:Infinity,P_mean=E_tot/dt;
    let T_g_new=T_g.map((v,i)=>v+dt*(n*P_mean*share[i]-UA_gc[i]*(v-T_w[i]))/c_g);
    T_g_new=heat_exchange(T_g_new,dt);
    const Q_w=T_w.map((v,i)=>n_w*P_mean*share[i]+UA_fc[i]*(Tf[i]-v)+UA_gc[i]*(T_g_new[i]-v)),h_target=Q_w.map((v,i)=>inlet_enthalpy(T_in_cells[i])+v/m_cell[i]),h_new=h.map((v,i)=>v+dt*(h_target[i]-v)/tau_w),[T_w_new,x_new]=coolant_from_enthalpy(h_new),new_state= {
        P,C,T_f:Tf,T_g:T_g_new,T_w:T_w_new,h:h_new,x:x_new,t:state.t+dt,T_f_ref:state.T_f_ref,T_g_ref:state.T_g_ref,x_ref:state.x_ref
    };
    return[new_state, {
        k_eff,rho:rho_r
    }];
}
//// Консольный пример вместо графического интерфейса.
//const RUN_CONSOLE_DEMO=true,DEMO_T_END=40,DEMO_T_UP=5,DEMO_T_DOWN=20,DEMO_ROD_UP=10,DEMO_PRINT_EVERY=2;
//function run_console_demo(t_end=DEMO_T_END,print_every=DEMO_PRINT_EVERY) {
//    let state=init_state();
//    const rods=Array(N_cells).fill(ROD_INIT_PCT),centre=grid.findIndex(([ix,iy])=>ix===0&&iy===0),m_half=m_total_default/2,n_steps=Math.round(t_end/dt_sim),every=Math.max(1,Math.round(print_every/dt_sim)),up_step=Math.round(DEMO_T_UP/dt_sim),down_step=Math.round(DEMO_T_DOWN/dt_sim),rows=[];
//    console.log('t, с | P, % | k_eff | rho/beta | Tf max, C | Tg max, C | x max');
//    for(let i=0;i<=n_steps;i++) {
//        if(i===up_step)rods[centre]=DEMO_ROD_UP;
//        if(i===down_step)rods[centre]=ROD_INIT_PCT;
//        let diag;
//        [state,diag]=reactor_step(state,rods,m_half,m_half);
//        const P=state.P;
//        if(!(Number.isFinite(P)&&P<1e30)) {
//            console.log(`Расчет остановлен при t=${state.t.toFixed(2)} с`);
//            break;
//        }
//        if(i%every===0) {
//            const row=[state.t,P/power_nom*100,diag.k_eff,diag.rho/b,Math.max(...state.T_f)-273.15,Math.max(...state.T_g)-273.15,Math.max(...state.x)];
//            rows.push(row);
//            console.log(row.map(v=>Number(v).toFixed(3)).join(' | '));
//        }
//    }
//    return rows;
//}


class Modal2 {
    constructor(){
        this.thermal_power = 0;
        this.thermal_power_list = [];
        this.temp_graf = [];
        this.temp_fuel = [];
        this.temp_out_water = [];
        this.h = []; // энтальпия
        this.x = [];
        this.T_f_ref = [];
        this.T_g_ref = [];
        this.x_ref = [];
        this.split_coolant_flows(this.grid);

    }

    neutron_block(ozr_pct) {
    const key=JSON.stringify([ozr_pct, this.T_f_ref, this.T_g_ref, this.x_ref]);
    if(_neu.key!==key) {
        const[Sig_f, Sig_a, Sig_tr]=cell_cross_sections(this.T_f_ref,this.T_g_ref,this.x_ref,ozr_pct),T=transfer_matrix(Sig_a,Sig_tr,R),eta=Sig_f.map((v,i)=>v / Sig_a[i]),[k_static,S]=solve_keff(T, eta), TS=mat_vec(T, S),fis=eta.map((v, i)=>v * TS[i]),fs=Math.max(fis.reduce((s, v) => s + v, 0), 1e-300);
        _neu.rho=(k_static-1) / k_static;
        _neu.share=fis.map(v=>v/fs);
        _neu.key=key;
    }
    return[_neu.rho,_neu.share];
}

    split_coolant_flows(grid) {
        this.left_cells = [];
        this.right_cells = [];
        grid.forEach(([ix, iy], k) => {
          if (ix < 0 || (ix === 0 && iy < 0)) this.left_cells.push(k);
          else this.right_cells.push(k);
        });
    }
//
//
//    build_geometry(){
//        this.grid = [];
//        for (let iy = -4; iy <= 4; iy++){
//            for (let ix = -4; ix <= 4; ix++){
//                 if (ix * ix + iy * iy <= R2_cut) {
//                    grid.push([ix, iy]);
//                 }
//            }
//        }
//        const N = grid.length, R = Array.from({ length: N }, () => Array(N).fill(0));
//        const adj = Array.from({ length: N }, () => Array(N).fill(0));
//        for (let i = 0; i < N; i++) {
//            for (let j = 0; j < N; j++) {
//                const dx = (grid[i][0] - grid[j][0]) * a_cell;
//                const dy = (grid[i][1] - grid[j][1]) * a_cell;
//                R[i][j] = i === j ? 1.0 : Math.sqrt(dx * dx + dy * dy);
//                if (i !== j && Math.abs(R[i][j] - a_cell) < 1e-6){
//                    adj[i][j] = 1;
//                }
//            }
//        }
//        return { grid, R, adj };
//    }
//
//     coolant_arrays(m_left, m_right, T_left, T_right) {
//        const m_cell = Array(N_cells).fill(0), T_in_cells = Array(N_cells).fill(0);
//        this.left_cells.forEach(i => { m_cell[i] = m_left / this.left_cells.length; T_in_cells[i] = T_left; });
//        this.right_cells.forEach(i => { m_cell[i] = m_right / this.right_cells.length; T_in_cells[i] = T_right; });
//        return [m_cell, T_in_cells];
//  }


    update(ozr_pct, m_left, m_right, T_left, T_right){
        let m = coolant_arrays(m_left, m_right, T_m_left, T_m_left);
        this.m_cell = m[0];
        this.T_in_cells = m[0];
        let m = this.neutron_block(ozr_pct);
        let rho_static = m[0];
        let share = m[1];
        let summ = 0;
        for (let 1 = 0; i < N_cells; i++){
            summ += share[i] * (void_fraction(x[i]) - void_fraction(x_ref[i]))
        }
        rho_void = alpha_void * summ;

    let h_conv = heat_transfer_coeff(this.x, this.m_cell);
    let UA_fc = [];
    let UA_gc = [];
    for (let i = 0; i < h_conv.length; i++){
        UA_fc.push(h_conv[i] * A_surf_fc);
        UA_gc.push(h_conv[i] * A_surf_gc);
    }
    let t_left = dt;
    let n_sub = 0;
    let E_tot = 0.0;
    while (t_left > 1e-12){
        let summ = 0;
        for (let i = 0; i < N_cells; i++){
            summ += share[i] * (this.Tf[i] - this.T_f_ref[i])
        }
        let rho_dop = alpha_D * summ;
        let rho_r = rho_static + rho_void + rho_dop;
        let dts = Math.min(t_left, sub_frac * Lambda_n / Math.max(rho_r, b));
        if (n_sub >= n_sub_max - 1 || t_left - dts < 0.1 * dts){
            dts = t_left;
        }
        this.P_old = this.P;
        let m = kinetics_advance(this.P, this.C, rho_r, dts);
        this.P = m[0];
        this.C = m[1];
        let Tf = [...this.T_f];
        let P_avg = 0.5 * (this.P_old + this.P);  // средняя мощность подшага
        E_tot += P_avg * dts;
        for (let i = 0; i < N_cells; i++){
            this.Tf[i] += dts * (n_fuel * P_avg * share[i] - UA_fc[i] * (Tf[i] - this.T_w[i])) / c_f;
        }
        t_left -= dts;
        n_sub += 1;
        }
         let denom = 1.0 - rho_r;
        let k_eff = 1.0 / Math.abs(denom);
        let P_mean = E_tot / dt;
        let T_g_new = [];
        let Q_w = [];
        let h_new = [];
        let h_target = [];
        for (let i = 0; i < N_cells; i++){
            T_g_new.push(this.T_g[i] + dt * (n * P_mean * share[i] - UA_gc[i] * (this.T_g[i] - this.T_w[i])) / c_g);
            Q_w.push(n_w * P_mean * share[i] + UA_fc[i] * (Tf[i] - this.T_w[i]) + UA_gc[i] * (T_g_new[i] - this.T_w[i]));
            h_new.push(h[i] + dt * (h_target[i] - h[i]) / tau_w);
            h_target.push(inlet_enthalpy(this.T_in_cells[i]) + this.Q_w[i] / this.m_cell[i]);
        }
        this.T_g = heat_exchange(T_g_new, dt);
        let m = coolant_from_enthalpy(h_new);
        this.T_w = m[0];
        this.x = m[1];

    }
}