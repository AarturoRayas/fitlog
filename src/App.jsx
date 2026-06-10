import { useState, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const CONFIG = {
  goal: "Recomposición Corporal",
  targetWeightKg: 100,
  dailyCalories: 2880,
  macros: { proteinGrams: 240, carbsGrams: 300, fatsGrams: 80 },
  meals: [
    { id: 1, name: "Comida 1 – Soporte Hormonal", emoji: "🥚",
      items: [
        { ingredient: "Huevo entero", state: "Crudo", weight: "300g (6 pzs)", notes: "Sin aceite" },
        { ingredient: "Avena en hojuelas", state: "Cruda", weight: "100g", notes: "Agua al gusto" },
      ] },
    { id: 2, name: "Comida 2 – Pre-Entreno", emoji: "⚡",
      items: [
        { ingredient: "Pechuga de pollo", state: "Cruda", weight: "300g", notes: "Pesar antes de cocinar" },
        { ingredient: "Arroz blanco", state: "Cocido", weight: "350g", notes: "Misma proporción de agua" },
      ] },
    { id: 3, name: "Comida 3 – Post-Entreno", emoji: "💪",
      items: [
        { ingredient: "Atún en agua", state: "Drenado", weight: "180g (~2 latas)", notes: "Drenar todo el líquido" },
        { ingredient: "Arroz blanco", state: "Cocido", weight: "250g", notes: "Misma proporción de agua" },
      ] },
    { id: 4, name: "Comida 4 – Cierre Nocturno", emoji: "🌙",
      items: [
        { ingredient: "Pechuga de pollo", state: "Cruda", weight: "120g", notes: "Pesar antes de cocinar" },
        { ingredient: "Queso panela fresco", state: "Fresco", weight: "150g", notes: "" },
        { ingredient: "Pan de caja blanco", state: "Tal cual", weight: "4 rebanadas", notes: "Sándwichs" },
      ] },
  ],
  workoutPlan: {
    monday:    { type: "Empuje", cardio: 30, emoji: "🏋️", exercises: [
      { name: "Press de banca plano", sets: 3, reps: "6-8", rir: "RIR 1" },
      { name: "Press militar", sets: 3, reps: "8-10", rir: "RIR 1-2" },
      { name: "Peck fly / Cruce de poleas", sets: 2, reps: "10-12", rir: "RIR 1-2" },
      { name: "Elevaciones laterales", sets: 3, reps: "12-15", rir: "RIR 1-2" },
      { name: "Copa tríceps a dos manos", sets: 3, reps: "10-12", rir: "RIR 1-2" },
    ]},
    tuesday:   { type: "Tirón", cardio: 30, emoji: "🔙", exercises: [
      { name: "Jalón al pecho / Dominadas", sets: 3, reps: "6-8", rir: "RIR 1" },
      { name: "Remo en polea sentado", sets: 3, reps: "8-10", rir: "RIR 1-2" },
      { name: "Pullover con cuerda", sets: 2, reps: "12-15", rir: "RIR 1-2" },
      { name: "Curl predicador", sets: 3, reps: "10-12", rir: "RIR 1-2" },
      { name: "Curl martillo", sets: 2, reps: "10-12", rir: "RIR 1-2" },
    ]},
    wednesday: { type: "Pierna – Cuádriceps", cardio: 30, emoji: "🦵", exercises: [
      { name: "Sentadilla (libre o Smith)", sets: 3, reps: "6-8", rir: "RIR 1" },
      { name: "Prensa de piernas", sets: 3, reps: "8-10", rir: "RIR 1-2" },
      { name: "Peso muerto rumano", sets: 3, reps: "8-10", rir: "RIR 1-2" },
      { name: "Extensiones de cuádriceps", sets: 2, reps: "12-15", rir: "RIR 1-2" },
      { name: "Pantorrilla de pie o sentado", sets: 4, reps: "12-15", rir: "RIR 1-2" },
    ]},
    thursday:  { type: "Torso – Empuje + Tirón", cardio: 30, emoji: "💪", exercises: [
      { name: "Press inclinado con mancuernas", sets: 3, reps: "8-10", rir: "RIR 1-2" },
      { name: "Remo con barra / mancuerna", sets: 3, reps: "8-10", rir: "RIR 1-2" },
      { name: "Elevaciones laterales", sets: 3, reps: "12-15", rir: "RIR 1-2" },
      { name: "Pájaros / Facepull", sets: 3, reps: "12-15", rir: "RIR 1-2" },
      { name: "Tríceps en polea con cuerda", sets: 3, reps: "10-12", rir: "RIR 1-2" },
    ]},
    friday:    { type: "Pierna – Cadena Posterior", cardio: 30, emoji: "🍑", exercises: [
      { name: "Hip thrust (máquina o libre)", sets: 3, reps: "6-8", rir: "RIR 1" },
      { name: "Desplantes fijos con mancuernas", sets: 3, reps: "10-12", rir: "RIR 1-2" },
      { name: "Femoral acostado o sentado", sets: 3, reps: "10-12", rir: "RIR 1-2" },
      { name: "Aductor en máquina", sets: 2, reps: "12-15", rir: "RIR 1-2" },
      { name: "Pantorrilla de pie o sentado", sets: 4, reps: "12-15", rir: "RIR 1-2" },
    ]},
    saturday:  { type: "Descanso Activo", cardio: 30, emoji: "🚶", exercises: [
      { name: "Caminata ligera", sets: 1, reps: "30 min", rir: "Recuperación" },
    ]},
    sunday:    { type: "Descanso Total", cardio: 0, emoji: "😴", exercises: [] },
  },
};

const DAYS_ES = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
const DAYS_LABEL = { monday:"LUN", tuesday:"MAR", wednesday:"MIÉ", thursday:"JUE", friday:"VIE", saturday:"SÁB", sunday:"DOM" };
const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────────────────────────────────────
const STORAGE_KEY = "fitness_tracker_v2";
function loadData() {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r); } catch {}
  return { log: {}, bodyWeights: [] };
}
function saveData(d) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {} }
function todayKey() { return new Date().toISOString().slice(0,10); }
function getDayName(dateStr) { return DAYS_ES[new Date(dateStr + "T12:00:00").getDay()]; }
function emptyEntry(dateStr) {
  const plan = CONFIG.workoutPlan[getDayName(dateStr)];
  return {
    meals: [false,false,false,false],
    workout: false, cardio: false, weight: null, notes: "",
    exercises: plan.exercises.map(() => ({ weight: "", reps: "", done: false })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED STYLES
// ─────────────────────────────────────────────────────────────────────────────
const cardStyle = { background:"#0d0d0d", border:"1px solid #1e1e1e", borderRadius:6, padding:20, marginBottom:14 };
const inputStyle = { width:"100%", boxSizing:"border-box", background:"#0d0d0d", border:"1px solid #252525", color:"#ccc", padding:"10px 12px", fontSize:12, borderRadius:3, fontFamily:"'Courier New',monospace", outline:"none" };
const btnYellow = { padding:"10px 20px", background:"#ffc800", color:"#000", border:"none", borderRadius:3, cursor:"pointer", fontFamily:"'Courier New',monospace", fontWeight:700, fontSize:12, letterSpacing:1 };

function sectionTitle(t) {
  return <div style={{ fontSize:10, fontFamily:"'Courier New',monospace", letterSpacing:3, color:"#ffc800", marginBottom:12, borderBottom:"1px solid #1a1a1a", paddingBottom:8 }}>{t}</div>;
}

// ─────────────────────────────────────────────────────────────────────────────
// PILL
// ─────────────────────────────────────────────────────────────────────────────
function Pill({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding:"6px 14px", fontSize:11, fontFamily:"'Courier New',monospace", letterSpacing:2,
      background: active ? "#ffc800" : "#111", color: active ? "#000" : "#555",
      border: active ? "1px solid #ffc800" : "1px solid #252525",
      borderRadius:2, cursor:"pointer", transition:"all 0.2s", fontWeight: active ? 700 : 400,
    }}>{children}</button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MACRO BAR
// ─────────────────────────────────────────────────────────────────────────────
function MacroBar({ label, value, max, color }) {
  const pct = Math.min(100, (value/max)*100);
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4, fontSize:11, fontFamily:"'Courier New',monospace", letterSpacing:2 }}>
        <span style={{ color:"#888" }}>{label}</span>
        <span style={{ color }}>{value}g / {max}g</span>
      </div>
      <div style={{ height:6, background:"#1a1a1a", borderRadius:3, overflow:"hidden" }}>
        <div style={{ width:`${pct}%`, height:"100%", background:color, borderRadius:3, transition:"width 0.5s ease" }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WEIGHT CHART
// ─────────────────────────────────────────────────────────────────────────────
function WeightChart({ data }) {
  if (data.length < 2) return (
    <div style={{ textAlign:"center", color:"#444", fontSize:12, padding:"30px 0", fontFamily:"'Courier New',monospace" }}>
      REGISTRA AL MENOS 2 PESOS PARA VER PROGRESO
    </div>
  );
  const weights = data.map(d => d.weight);
  const min = Math.min(...weights)-1, max = Math.max(...weights)+1;
  const W=500, H=100;
  const pts = data.map((d,i) => {
    const x=(i/(data.length-1))*W, y=H-((d.weight-min)/(max-min))*H;
    return `${x},${y}`;
  });
  const lineD = "M "+pts.join(" L ");
  const areaD = `M 0,${H} L ${lineD.slice(2)} L ${W},${H} Z`;
  const last=data[data.length-1], first=data[0];
  const diff=(last.weight-first.weight).toFixed(1);
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:8 }}>
        <div>
          <div style={{ fontSize:28, fontWeight:900, color:"#ffc800", fontFamily:"'Courier New',monospace" }}>{last.weight} <span style={{ fontSize:14, color:"#666" }}>kg</span></div>
          <div style={{ fontSize:11, color: diff>=0 ? "#4caf50" : "#f44336", fontFamily:"'Courier New',monospace" }}>{diff>=0?"+":""}{diff} kg · Meta: {CONFIG.targetWeightKg} kg</div>
        </div>
        <div style={{ fontSize:11, color:"#444", fontFamily:"'Courier New',monospace", textAlign:"right" }}>{data.length} registros<br/>{first.date} → {last.date}</div>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible" }}>
        <defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffc800" stopOpacity="0.15"/><stop offset="100%" stopColor="#ffc800" stopOpacity="0"/></linearGradient></defs>
        <path d={areaD} fill="url(#wg)"/>
        <path d={lineD} fill="none" stroke="#ffc800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {data.map((d,i) => { const x=(i/(data.length-1))*W, y=H-((d.weight-min)/(max-min))*H; return <circle key={i} cx={x} cy={y} r={i===data.length-1?5:3} fill={i===data.length-1?"#ffc800":"#333"} stroke="#ffc80066" strokeWidth="1.5"/>; })}
      </svg>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, fontSize:10, color:"#444", fontFamily:"'Courier New',monospace" }}><span>{first.date}</span><span>{last.date}</span></div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CALENDAR HEATMAP (click to edit)
// ─────────────────────────────────────────────────────────────────────────────
function CalendarHeatmap({ log, onSelectDay }) {
  const today = new Date();
  const days = [];
  for (let i=55; i>=0; i--) {
    const d=new Date(today); d.setDate(d.getDate()-i);
    const key=d.toISOString().slice(0,10);
    const entry=log[key];
    const mealsDone=entry ? entry.meals.filter(Boolean).length : 0;
    let level=0;
    if(entry){ if(entry.workout && mealsDone>=3) level=3; else if(entry.workout||mealsDone>=3) level=2; else if(mealsDone>=1) level=1; }
    days.push({ key, level });
  }
  const colors=["#111","#3d3000","#806200","#ffc800"];
  return (
    <div>
      <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
        {days.map((d,i) => (
          <div key={i} title={`${d.key} — toca para editar`} onClick={() => onSelectDay(d.key)} style={{
            width:14, height:14, borderRadius:2,
            background:colors[d.level],
            border: d.key===todayKey() ? "1px solid #ffc800" : "1px solid #1a1a1a",
            cursor:"pointer", transition:"transform 0.1s",
          }}
          onMouseEnter={e=>e.target.style.transform="scale(1.3)"}
          onMouseLeave={e=>e.target.style.transform="scale(1)"}
          />
        ))}
      </div>
      <div style={{ display:"flex", gap:12, marginTop:10, fontSize:9, color:"#444" }}>
        {[["#111","Sin registro"],["#3d3000","Algo"],["#806200","Parcial"],["#ffc800","Completo"]].map(([c,l])=>(
          <div key={l} style={{ display:"flex", alignItems:"center", gap:4 }}>
            <div style={{ width:10, height:10, background:c, borderRadius:2 }}/><span>{l}</span>
          </div>
        ))}
        <span style={{ marginLeft:"auto", color:"#555" }}>toca un día para editar</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MINI CALENDAR (month view, click day)
// ─────────────────────────────────────────────────────────────────────────────
function MiniCalendar({ log, onSelectDay, selectedDate }) {
  const today = todayKey();
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date(); return { year: d.getFullYear(), month: d.getMonth() };
  });

  const { year, month } = viewDate;
  const firstDay = new Date(year, month, 1).getDay(); // 0=sun
  const daysInMonth = new Date(year, month+1, 0).getDate();

  // pad so week starts on Mon
  const startPad = (firstDay === 0 ? 6 : firstDay - 1);
  const cells = [];
  for(let i=0; i<startPad; i++) cells.push(null);
  for(let d=1; d<=daysInMonth; d++) {
    const key = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    cells.push(key);
  }

  const colors = ["#111","#3d3000","#806200","#ffc800"];
  const getLevel = (key) => {
    const entry = log[key];
    if(!entry) return 0;
    const m = entry.meals.filter(Boolean).length;
    if(entry.workout && m>=3) return 3;
    if(entry.workout || m>=3) return 2;
    if(m>=1) return 1;
    return 0;
  };

  const prevMonth = () => setViewDate(v => {
    if(v.month===0) return { year:v.year-1, month:11 };
    return { year:v.year, month:v.month-1 };
  });
  const nextMonth = () => setViewDate(v => {
    if(v.month===11) return { year:v.year+1, month:0 };
    return { year:v.year, month:v.month+1 };
  });

  const isFuture = (key) => key > today;

  return (
    <div style={{ background:"#0a0a0a", border:"1px solid #1e1e1e", borderRadius:6, padding:16, marginBottom:14 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <button onClick={prevMonth} style={{ background:"none", border:"1px solid #222", color:"#888", borderRadius:3, padding:"4px 10px", cursor:"pointer", fontSize:14 }}>‹</button>
        <div style={{ fontFamily:"'Courier New',monospace", fontSize:12, letterSpacing:3, color:"#ffc800" }}>
          {MONTHS_ES[month].toUpperCase()} {year}
        </div>
        <button onClick={nextMonth} style={{ background:"none", border:"1px solid #222", color:"#888", borderRadius:3, padding:"4px 10px", cursor:"pointer", fontSize:14 }}>›</button>
      </div>

      {/* Day headers */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:4 }}>
        {["L","M","X","J","V","S","D"].map(d => (
          <div key={d} style={{ textAlign:"center", fontSize:9, color:"#444", fontFamily:"'Courier New',monospace", letterSpacing:1, padding:"2px 0" }}>{d}</div>
        ))}
      </div>

      {/* Cells */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
        {cells.map((key, i) => {
          if(!key) return <div key={i}/>;
          const level = getLevel(key);
          const isToday = key===today;
          const isSelected = key===selectedDate;
          const future = isFuture(key);
          const day = parseInt(key.split("-")[2]);
          return (
            <div key={i} onClick={() => !future && onSelectDay(key)}
              style={{
                aspectRatio:"1", display:"flex", alignItems:"center", justifyContent:"center",
                borderRadius:4, fontSize:11, fontFamily:"'Courier New',monospace", fontWeight:700,
                background: isSelected ? "#ffc800" : level>0 ? colors[level] : "#111",
                color: isSelected ? "#000" : isToday ? "#ffc800" : future ? "#2a2a2a" : level>0 ? "#ffc80099" : "#444",
                border: isToday && !isSelected ? "1px solid #ffc80060" : "1px solid transparent",
                cursor: future ? "default" : "pointer",
                transition:"all 0.15s",
                opacity: future ? 0.3 : 1,
              }}
              onMouseEnter={e=>{ if(!future) e.currentTarget.style.opacity="0.8"; }}
              onMouseLeave={e=>{ if(!future) e.currentTarget.style.opacity="1"; }}
            >{day}</div>
          );
        })}
      </div>

      {selectedDate && (
        <div style={{ marginTop:10, padding:"6px 10px", background:"rgba(255,200,0,0.06)", border:"1px solid #ffc80030", borderRadius:3, fontSize:10, color:"#ffc800", fontFamily:"'Courier New',monospace", letterSpacing:1 }}>
          EDITANDO: {selectedDate} — {CONFIG.workoutPlan[getDayName(selectedDate)].emoji} {CONFIG.workoutPlan[getDayName(selectedDate)].type.toUpperCase()}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DAY EDITOR — full edit of any day
// ─────────────────────────────────────────────────────────────────────────────
function DayEditor({ dateStr, data, persist, onClose }) {
  const entry = data.log[dateStr] || emptyEntry(dateStr);
  const dayName = getDayName(dateStr);
  const plan = CONFIG.workoutPlan[dayName];
  const isToday = dateStr === todayKey();

  const bwEntry = (data.bodyWeights||[]).find(e=>e.date===dateStr);
  const [weightInput, setWeightInput] = useState(bwEntry ? String(bwEntry.weight) : "");

  const updateEntry = useCallback((patch) => {
    const next = { ...data, log: { ...data.log, [dateStr]: { ...entry, ...patch } } };
    persist(next);
  }, [data, dateStr, entry, persist]);

  const saveWeight = () => {
    const w = parseFloat(weightInput);
    if(!w || w<30 || w>300) return;
    const bw = [...(data.bodyWeights||[]).filter(e=>e.date!==dateStr), { date:dateStr, weight:w }]
      .sort((a,b)=>a.date.localeCompare(b.date));
    persist({ ...data, bodyWeights:bw });
  };

  const toggleMeal = (i) => {
    const meals=[...entry.meals]; meals[i]=!meals[i]; updateEntry({ meals });
  };

  const updateExercise = (i, val) => {
    const exercises=[...(entry.exercises||plan.exercises.map(()=>({})))];
    exercises[i]=val; updateEntry({ exercises });
  };

  const mealsDone = entry.meals.filter(Boolean).length;
  const exDone = (entry.exercises||[]).filter(e=>e.done).length;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.92)", zIndex:200, overflowY:"auto" }}>
      <div style={{ maxWidth:640, margin:"0 auto", padding:"16px 16px 60px" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, padding:"12px 16px", background:"#0d0d0d", border:"1px solid #ffc80030", borderRadius:6 }}>
          <div>
            <div style={{ fontSize:11, color:"#ffc800", fontFamily:"'Courier New',monospace", letterSpacing:3 }}>
              {isToday ? "HOY" : "EDITANDO DÍA"} {plan.emoji}
            </div>
            <div style={{ fontSize:16, fontWeight:900, color:"#ddd", fontFamily:"'Courier New',monospace", marginTop:2 }}>
              {dateStr} · {plan.type}
            </div>
          </div>
          <button onClick={onClose} style={{ background:"#1a1a1a", border:"1px solid #333", color:"#888", borderRadius:4, padding:"8px 14px", cursor:"pointer", fontSize:13, fontFamily:"'Courier New',monospace" }}>✕ CERRAR</button>
        </div>

        {/* Summary badges */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
          {[
            { label:"COMIDAS", val:`${mealsDone}/4`, ok: mealsDone===4 },
            { label:"EJERCICIOS", val: plan.exercises.length>0 ? `${exDone}/${plan.exercises.length}` : "—", ok: plan.exercises.length>0 && exDone===plan.exercises.length },
            { label:"PESO", val: bwEntry ? `${bwEntry.weight}kg` : "—", ok: !!bwEntry },
          ].map(s=>(
            <div key={s.label} style={{ textAlign:"center", padding:12, background:"#080808", border:`1px solid ${s.ok?"#ffc80040":"#1a1a1a"}`, borderRadius:4 }}>
              <div style={{ fontSize:9, color:"#444", letterSpacing:2, fontFamily:"'Courier New',monospace", marginBottom:4 }}>{s.label}</div>
              <div style={{ fontSize:18, fontWeight:900, color: s.ok?"#ffc800":"#555", fontFamily:"'Courier New',monospace" }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* COMIDAS */}
        <div style={cardStyle}>
          {sectionTitle("COMIDAS")}
          {CONFIG.meals.map((meal,i)=>(
            <button key={i} onClick={()=>toggleMeal(i)} style={{
              display:"flex", alignItems:"center", gap:12, width:"100%",
              padding:"12px 14px", marginBottom:6,
              background: entry.meals[i] ? "rgba(255,200,0,0.07)" : "#111",
              border: entry.meals[i] ? "1px solid #ffc800" : "1px solid #252525",
              borderRadius:4, cursor:"pointer", textAlign:"left",
            }}>
              <div style={{ width:20, height:20, border: entry.meals[i]?"2px solid #ffc800":"2px solid #444", borderRadius:3, background: entry.meals[i]?"#ffc800":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {entry.meals[i] && <span style={{ color:"#000", fontSize:12, fontWeight:900 }}>✓</span>}
              </div>
              <div>
                <div style={{ color: entry.meals[i]?"#ffc800":"#ccc", fontSize:13, fontFamily:"'Courier New',monospace" }}>{meal.emoji} {meal.name}</div>
                <div style={{ color:"#555", fontSize:10, marginTop:2 }}>{meal.items.map(it=>`${it.ingredient} ${it.weight}`).join(" · ")}</div>
              </div>
            </button>
          ))}
        </div>

        {/* ENTRENAMIENTO */}
        <div style={cardStyle}>
          {sectionTitle(`ENTRENAMIENTO — ${plan.type.toUpperCase()}`)}
          <div style={{ display:"flex", gap:8, marginBottom:14 }}>
            <button onClick={()=>updateEntry({ workout:!entry.workout })} style={{ padding:"8px 16px", fontSize:10, letterSpacing:1, fontFamily:"'Courier New',monospace", background: entry.workout?"#ffc800":"transparent", color: entry.workout?"#000":"#555", border:`1px solid ${entry.workout?"#ffc800":"#333"}`, borderRadius:3, cursor:"pointer" }}>✓ ENTRENO COMPLETO</button>
            {plan.cardio>0 && <button onClick={()=>updateEntry({ cardio:!entry.cardio })} style={{ padding:"8px 16px", fontSize:10, letterSpacing:1, fontFamily:"'Courier New',monospace", background: entry.cardio?"#4caf50":"transparent", color: entry.cardio?"#000":"#555", border:`1px solid ${entry.cardio?"#4caf50":"#333"}`, borderRadius:3, cursor:"pointer" }}>✓ CARDIO {plan.cardio} MIN</button>}
          </div>

          {plan.exercises.length===0 && <div style={{ fontSize:11, color:"#444", fontFamily:"'Courier New',monospace" }}>DÍA DE DESCANSO 😴</div>}

          {plan.exercises.map((ex,i)=>{
            const exEntry = (entry.exercises||[])[i] || {};
            return (
              <div key={i} style={{ padding:"12px 14px", marginBottom:6, background: exEntry.done?"rgba(255,200,0,0.04)":"#0d0d0d", border: exEntry.done?"1px solid #ffc80040":"1px solid #1a1a1a", borderRadius:4 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom: exEntry.done?0:8 }}>
                  <button onClick={()=>updateExercise(i,{...exEntry, done:!exEntry.done})} style={{ width:18, height:18, border: exEntry.done?"2px solid #ffc800":"2px solid #333", background: exEntry.done?"#ffc800":"transparent", borderRadius:2, cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {exEntry.done && <span style={{ fontSize:10, fontWeight:900, color:"#000" }}>✓</span>}
                  </button>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, color: exEntry.done?"#ffc800":"#bbb", fontFamily:"'Courier New',monospace" }}>{ex.name}</div>
                    <div style={{ fontSize:10, color:"#444", marginTop:2 }}>{ex.sets} series · {ex.reps} reps · {ex.rir}</div>
                  </div>
                </div>
                {!exEntry.done && (
                  <div style={{ display:"flex", gap:8, paddingLeft:28 }}>
                    <input value={exEntry.weight||""} onChange={e=>updateExercise(i,{...exEntry,weight:e.target.value})} placeholder="Kg usado"
                      style={{ flex:1, background:"#141414", border:"1px solid #252525", color:"#ccc", padding:"6px 8px", fontSize:11, borderRadius:3, fontFamily:"'Courier New',monospace" }}/>
                    <input value={exEntry.reps||""} onChange={e=>updateExercise(i,{...exEntry,reps:e.target.value})} placeholder="Reps reales"
                      style={{ flex:1, background:"#141414", border:"1px solid #252525", color:"#ccc", padding:"6px 8px", fontSize:11, borderRadius:3, fontFamily:"'Courier New',monospace" }}/>
                  </div>
                )}
                {exEntry.done && (exEntry.weight||exEntry.reps) && (
                  <div style={{ paddingLeft:28, fontSize:10, color:"#666", fontFamily:"'Courier New',monospace", marginTop:4 }}>
                    {exEntry.weight && <span>{exEntry.weight}kg </span>}
                    {exEntry.reps && <span>· {exEntry.reps} reps</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* PESO Y NOTAS */}
        <div style={cardStyle}>
          {sectionTitle("PESO Y NOTAS")}
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:10, color:"#555", marginBottom:6, letterSpacing:2, fontFamily:"'Courier New',monospace" }}>PESO CORPORAL (KG)</div>
            <div style={{ display:"flex", gap:8 }}>
              <input value={weightInput} onChange={e=>setWeightInput(e.target.value)} placeholder={bwEntry?`Actual: ${bwEntry.weight}kg`:"Ej. 87.5"} style={{ ...inputStyle, flex:1 }} type="number" step="0.1" onKeyDown={e=>e.key==="Enter"&&saveWeight()}/>
              <button onClick={saveWeight} style={btnYellow}>GUARDAR</button>
            </div>
            {bwEntry && <div style={{ fontSize:10, color:"#4caf50", marginTop:6, fontFamily:"'Courier New',monospace" }}>✓ Registrado: {bwEntry.weight} kg</div>}
          </div>
          <div>
            <div style={{ fontSize:10, color:"#555", marginBottom:6, letterSpacing:2, fontFamily:"'Courier New',monospace" }}>NOTAS DEL DÍA</div>
            <textarea value={entry.notes||""} rows={3} onChange={e=>updateEntry({ notes:e.target.value })} placeholder="Cómo te sentiste, qué mejorar..."
              style={{ ...inputStyle, resize:"vertical" }}/>
          </div>
        </div>

        <button onClick={onClose} style={{ ...btnYellow, width:"100%", padding:"14px" }}>GUARDAR Y CERRAR</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(loadData);
  const [tab, setTab] = useState("today");
  const [editingDate, setEditingDate] = useState(null);

  const today = todayKey();
  const dayKey = DAYS_ES[new Date().getDay()];

  const persist = useCallback((d) => { setData(d); saveData(d); }, []);

  const openDay = (dateStr) => {
    // ensure entry exists
    if(!data.log[dateStr]) {
      const entry = emptyEntry(dateStr);
      persist({ ...data, log:{ ...data.log, [dateStr]:entry } });
    }
    setEditingDate(dateStr);
  };

  const todayEntry = data.log[today] || emptyEntry(today);
  const dayName = getDayName(today);
  const workout = CONFIG.workoutPlan[dayName];
  const mealsDone = todayEntry.meals.filter(Boolean).length;
  const exDone = (todayEntry.exercises||[]).filter(e=>e.done).length;

  const getStreak = () => {
    let streak=0; const d=new Date();
    while(true) {
      const k=d.toISOString().slice(0,10);
      const e=data.log[k];
      if(!e || (!e.workout && e.meals.filter(Boolean).length<2)) break;
      streak++; d.setDate(d.getDate()-1);
    }
    return streak;
  };

  const weekDays=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];

  return (
    <div style={{ minHeight:"100vh", background:"#080808", color:"#ddd", fontFamily:"'Courier New',monospace" }}>

      {/* EDITOR MODAL */}
      {editingDate && (
        <DayEditor dateStr={editingDate} data={data} persist={persist} onClose={()=>setEditingDate(null)}/>
      )}

      {/* HEADER */}
      <div style={{ background:"#0a0a0a", borderBottom:"1px solid #1a1a1a", padding:"14px 16px", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ maxWidth:640, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, flexWrap:"wrap" }}>
          <div>
            <div style={{ fontSize:13, fontWeight:900, letterSpacing:4, color:"#ffc800" }}>FITLOG</div>
            <div style={{ fontSize:9, color:"#444", letterSpacing:2 }}>{CONFIG.goal.toUpperCase()}</div>
          </div>
          <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
            {[["today","HOY"],["edit","EDITAR DÍA"],["diet","DIETA"],["workout","ENTRENO"],["progress","PROGRESO"]].map(([k,l])=>(
              <Pill key={k} active={tab===k} onClick={()=>setTab(k)}>{l}</Pill>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:640, margin:"0 auto", padding:"20px 16px" }}>

        {/* ── HOY ── */}
        {tab==="today" && (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:14 }}>
              {[
                { label:"RACHA", value:getStreak(), unit:"días", color:"#ffc800" },
                { label:"COMIDAS", value:`${mealsDone}/4`, color: mealsDone===4?"#4caf50":"#888" },
                { label:"EJERCICIOS", value:`${exDone}/${workout.exercises.length||"—"}`, color: exDone===workout.exercises.length&&workout.exercises.length>0?"#4caf50":"#888" },
              ].map(s=>(
                <div key={s.label} style={{ ...cardStyle, textAlign:"center", padding:14 }}>
                  <div style={{ fontSize:9, letterSpacing:3, color:"#444", marginBottom:4 }}>{s.label}</div>
                  <div style={{ fontSize:20, fontWeight:900, color:s.color }}>{s.value}</div>
                  {s.unit && <div style={{ fontSize:9, color:"#555" }}>{s.unit}</div>}
                </div>
              ))}
            </div>

            {/* Quick open today editor */}
            <button onClick={()=>openDay(today)} style={{
              width:"100%", padding:"16px", marginBottom:14,
              background:"rgba(255,200,0,0.05)", border:"1px solid #ffc80040",
              borderRadius:6, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between"
            }}>
              <div style={{ textAlign:"left" }}>
                <div style={{ fontSize:10, color:"#ffc800", letterSpacing:3, fontFamily:"'Courier New',monospace" }}>HOY {workout.emoji}</div>
                <div style={{ fontSize:14, fontWeight:700, color:"#ddd", fontFamily:"'Courier New',monospace", marginTop:2 }}>{workout.type}</div>
                {workout.cardio>0 && <div style={{ fontSize:10, color:"#555", marginTop:2 }}>+ {workout.cardio} min cardio</div>}
              </div>
              <div style={{ fontSize:11, color:"#ffc800", fontFamily:"'Courier New',monospace", letterSpacing:2 }}>
                REGISTRAR →
              </div>
            </button>

            {/* Week overview */}
            <div style={cardStyle}>
              {sectionTitle("SEMANA")}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>
                {weekDays.map((d)=>{
                  const plan=CONFIG.workoutPlan[d];
                  // find this week's date for this day
                  const now=new Date();
                  const todayDow=now.getDay(); // 0=sun
                  const targetDow=DAYS_ES.indexOf(d);
                  const diff=targetDow-todayDow;
                  const dd=new Date(now); dd.setDate(dd.getDate()+diff);
                  const key=dd.toISOString().slice(0,10);
                  const entry=data.log[key];
                  const isT=d===dayKey;
                  const meals=entry?.meals?.filter(Boolean).length||0;
                  return (
                    <div key={d} onClick={()=>openDay(key)} style={{ padding:"8px 4px", textAlign:"center", background: isT?"rgba(255,200,0,0.08)":"#0d0d0d", border: isT?"1px solid #ffc800":"1px solid #1a1a1a", borderRadius:4, cursor:"pointer" }}
                      onMouseEnter={e=>e.currentTarget.style.borderColor="#ffc80060"}
                      onMouseLeave={e=>e.currentTarget.style.borderColor=isT?"#ffc800":"#1a1a1a"}>
                      <div style={{ fontSize:9, color: isT?"#ffc800":"#555", letterSpacing:1 }}>{DAYS_LABEL[d]}</div>
                      <div style={{ fontSize:16, margin:"3px 0" }}>{plan.emoji}</div>
                      {entry ? (
                        <div style={{ fontSize:8, color:"#ffc80099" }}>{meals}/4</div>
                      ) : (
                        <div style={{ fontSize:8, color:"#252525" }}>—</div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{ fontSize:9, color:"#333", textAlign:"center", marginTop:8, letterSpacing:1 }}>TOCA CUALQUIER DÍA PARA EDITAR</div>
            </div>

            {/* Recent log */}
            <div style={cardStyle}>
              {sectionTitle("ÚLTIMOS REGISTROS")}
              {Object.entries(data.log).slice(-5).reverse().map(([date,entry])=>(
                <div key={date} onClick={()=>openDay(date)} style={{ padding:"10px 0", borderBottom:"1px solid #111", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}
                  onMouseEnter={e=>e.currentTarget.style.background="#0f0f0f"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <div>
                    <div style={{ fontSize:11, color: date===today?"#ffc800":"#888" }}>{date}{date===today?" (hoy)":""}</div>
                    {entry.notes && <div style={{ fontSize:10, color:"#444", marginTop:2 }}>{entry.notes.slice(0,40)}…</div>}
                  </div>
                  <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                    {entry.workout && <span style={{ fontSize:9, color:"#4caf50", border:"1px solid #4caf5033", padding:"2px 5px", borderRadius:2 }}>ENTRENO</span>}
                    <span style={{ fontSize:9, color:"#ffc800" }}>{entry.meals.filter(Boolean).length}/4</span>
                    <span style={{ fontSize:10, color:"#444" }}>›</span>
                  </div>
                </div>
              ))}
              {Object.keys(data.log).length===0 && <div style={{ textAlign:"center", color:"#333", fontSize:11, padding:"20px 0" }}>SIN REGISTROS AÚN</div>}
            </div>
          </div>
        )}

        {/* ── EDITAR DÍA ── */}
        {tab==="edit" && (
          <div>
            {sectionTitle("SELECCIONA UN DÍA PARA EDITAR")}
            <MiniCalendar log={data.log} onSelectDay={(d)=>{ openDay(d); setTab("today"); }} selectedDate={editingDate}/>
            <div style={cardStyle}>
              {sectionTitle("O TOCA EN EL MAPA DE ACTIVIDAD")}
              <CalendarHeatmap log={data.log} onSelectDay={(d)=>{ openDay(d); setTab("today"); }}/>
            </div>
            <div style={{ ...cardStyle, borderColor:"#1a1a1a" }}>
              {sectionTitle("HISTORIAL COMPLETO")}
              {Object.entries(data.log).reverse().map(([date,entry])=>{
                const bw=(data.bodyWeights||[]).find(e=>e.date===date);
                return (
                  <div key={date} onClick={()=>{ openDay(date); setTab("today"); }} style={{ padding:"10px 12px", marginBottom:6, background:"#080808", border:"1px solid #141414", borderRadius:4, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor="#ffc80030"}
                    onMouseLeave={e=>e.currentTarget.style.borderColor="#141414"}>
                    <div>
                      <div style={{ fontSize:12, color: date===today?"#ffc800":"#888", fontWeight: date===today?700:400 }}>
                        {CONFIG.workoutPlan[getDayName(date)].emoji} {date}{date===today?" — HOY":""}
                      </div>
                      <div style={{ display:"flex", gap:8, marginTop:4 }}>
                        <span style={{ fontSize:9, color: entry.workout?"#4caf50":"#333" }}>● ENTRENO</span>
                        <span style={{ fontSize:9, color: entry.cardio?"#4caf50":"#333" }}>● CARDIO</span>
                        <span style={{ fontSize:9, color: entry.meals.filter(Boolean).length>0?"#ffc800":"#333" }}>● {entry.meals.filter(Boolean).length}/4 COMIDAS</span>
                        {bw && <span style={{ fontSize:9, color:"#ffc800" }}>● {bw.weight}kg</span>}
                      </div>
                      {entry.notes && <div style={{ fontSize:10, color:"#444", marginTop:3 }}>{entry.notes.slice(0,50)}{entry.notes.length>50?"…":""}</div>}
                    </div>
                    <div style={{ fontSize:12, color:"#333" }}>›</div>
                  </div>
                );
              })}
              {Object.keys(data.log).length===0 && <div style={{ textAlign:"center", color:"#333", fontSize:11, padding:"20px 0" }}>SIN REGISTROS AÚN</div>}
            </div>
          </div>
        )}

        {/* ── DIETA ── */}
        {tab==="diet" && (
          <div>
            <div style={cardStyle}>
              {sectionTitle("MACROS OBJETIVO DIARIO")}
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
                <div>
                  <div style={{ fontSize:28, fontWeight:900, color:"#ffc800" }}>{CONFIG.dailyCalories}</div>
                  <div style={{ fontSize:10, color:"#555", letterSpacing:2 }}>CALORÍAS/DÍA</div>
                </div>
                <div style={{ display:"flex", gap:16 }}>
                  {[["P",CONFIG.macros.proteinGrams,"#4caf50"],["C",CONFIG.macros.carbsGrams,"#2196f3"],["G",CONFIG.macros.fatsGrams,"#ff9800"]].map(([l,v,c])=>(
                    <div key={l} style={{ textAlign:"center" }}>
                      <div style={{ fontSize:18, fontWeight:900, color:c }}>{v}g</div>
                      <div style={{ fontSize:9, color:"#555", letterSpacing:2 }}>{l==="P"?"PROT":l==="C"?"CARBS":"GRASAS"}</div>
                    </div>
                  ))}
                </div>
              </div>
              <MacroBar label="PROTEÍNA" value={CONFIG.macros.proteinGrams} max={CONFIG.macros.proteinGrams} color="#4caf50"/>
              <MacroBar label="CARBOHIDRATOS" value={CONFIG.macros.carbsGrams} max={CONFIG.macros.carbsGrams} color="#2196f3"/>
              <MacroBar label="GRASAS" value={CONFIG.macros.fatsGrams} max={CONFIG.macros.fatsGrams} color="#ff9800"/>
            </div>
            {CONFIG.meals.map(meal=>(
              <div key={meal.id} style={cardStyle}>
                {sectionTitle(`${meal.emoji} ${meal.name.toUpperCase()}`)}
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                  <thead><tr style={{ color:"#444", borderBottom:"1px solid #1a1a1a" }}>
                    {["INGREDIENTE","ESTADO","CANTIDAD","NOTA"].map(h=><td key={h} style={{ padding:"4px 8px 8px 0", letterSpacing:1, fontSize:9 }}>{h}</td>)}
                  </tr></thead>
                  <tbody>
                    {meal.items.map((item,i)=>(
                      <tr key={i} style={{ borderBottom:"1px solid #111" }}>
                        <td style={{ padding:"10px 8px 10px 0", color:"#ddd" }}>{item.ingredient}</td>
                        <td style={{ color:"#888" }}>{item.state}</td>
                        <td style={{ color:"#ffc800", fontWeight:700 }}>{item.weight}</td>
                        <td style={{ color:"#555", fontSize:10 }}>{item.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* ── ENTRENO ── */}
        {tab==="workout" && (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:14 }}>
              {weekDays.map(d=>{
                const plan=CONFIG.workoutPlan[d];
                const isT=d===dayKey;
                return (
                  <div key={d} style={{ padding:"8px 4px", textAlign:"center", background: isT?"rgba(255,200,0,0.08)":"#0d0d0d", border: isT?"1px solid #ffc800":"1px solid #1a1a1a", borderRadius:4 }}>
                    <div style={{ fontSize:9, color: isT?"#ffc800":"#555", letterSpacing:1 }}>{DAYS_LABEL[d]}</div>
                    <div style={{ fontSize:16, margin:"4px 0" }}>{plan.emoji}</div>
                    <div style={{ fontSize:8, color:"#444", lineHeight:1.3 }}>{plan.type.split(" – ")[0]}</div>
                  </div>
                );
              })}
            </div>
            {weekDays.map(d=>{
              const plan=CONFIG.workoutPlan[d]; const isT=d===dayKey;
              if(plan.exercises.length===0) return null;
              return (
                <div key={d} style={{ ...cardStyle, borderColor: isT?"#ffc80030":"#1e1e1e" }}>
                  {sectionTitle(`${plan.emoji} ${DAYS_LABEL[d]} — ${plan.type.toUpperCase()}`)}
                  {plan.cardio>0 && <div style={{ fontSize:10, color:"#666", marginBottom:10 }}><span style={{ color:"#ffc800" }}>▸</span> {plan.cardio} MIN CARDIO</div>}
                  {plan.exercises.map((ex,i)=>(
                    <div key={i} style={{ padding:"8px 0", borderBottom: i<plan.exercises.length-1?"1px solid #111":"none" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div style={{ fontSize:12, color:"#ccc" }}>{ex.name}</div>
                        <div style={{ fontSize:10, color:"#ffc800", fontWeight:700, whiteSpace:"nowrap", marginLeft:8 }}>{ex.sets}×{ex.reps}</div>
                      </div>
                      <div style={{ fontSize:10, color:"#444", marginTop:2 }}>{ex.rir}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* ── PROGRESO ── */}
        {tab==="progress" && (
          <div>
            <div style={cardStyle}>
              {sectionTitle("PESO CORPORAL")}
              <WeightChart data={data.bodyWeights||[]}/>
            </div>
            <div style={cardStyle}>
              {sectionTitle("MAPA DE ACTIVIDAD (toca para editar)")}
              <CalendarHeatmap log={data.log} onSelectDay={(d)=>{ openDay(d); }}/>
            </div>
            <div style={{ textAlign:"center", marginTop:20 }}>
              <button onClick={()=>{ if(window.confirm("¿Borrar todos los datos? No se puede deshacer.")) { persist({ log:{}, bodyWeights:[] }); } }}
                style={{ fontSize:10, color:"#333", background:"none", border:"1px solid #1a1a1a", padding:"8px 16px", borderRadius:3, cursor:"pointer", letterSpacing:2 }}>
                REINICIAR DATOS
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ textAlign:"center", padding:"20px 0 30px", fontSize:9, color:"#222", letterSpacing:3 }}>
        FITLOG · {CONFIG.goal.toUpperCase()} · META {CONFIG.targetWeightKg}KG
      </div>
    </div>
  );
}
