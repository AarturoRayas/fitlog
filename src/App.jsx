import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG DATA
// ─────────────────────────────────────────────────────────────────────────────
const CONFIG = {
  goal: "Recomposición Corporal",
  targetWeightKg: 100,
  dailyCalories: 2880,
  macros: { proteinGrams: 240, carbsGrams: 300, fatsGrams: 80 },
  meals: [
    {
      id: 1,
      name: "Comida 1 – Soporte Hormonal",
      emoji: "🥚",
      items: [
        { ingredient: "Huevo entero", state: "Crudo", weight: "300g (6 pzs)", notes: "Sin aceite" },
        { ingredient: "Avena en hojuelas", state: "Cruda", weight: "100g", notes: "Agua al gusto" },
      ],
    },
    {
      id: 2,
      name: "Comida 2 – Pre-Entreno",
      emoji: "⚡",
      items: [
        { ingredient: "Pechuga de pollo", state: "Cruda", weight: "300g", notes: "Pesar antes de cocinar" },
        { ingredient: "Arroz blanco", state: "Cocido", weight: "350g", notes: "Misma proporción de agua" },
      ],
    },
    {
      id: 3,
      name: "Comida 3 – Post-Entreno",
      emoji: "💪",
      items: [
        { ingredient: "Atún en agua", state: "Drenado", weight: "180g (~2 latas)", notes: "Drenar todo el líquido" },
        { ingredient: "Arroz blanco", state: "Cocido", weight: "250g", notes: "Misma proporción de agua" },
      ],
    },
    {
      id: 4,
      name: "Comida 4 – Cierre Nocturno",
      emoji: "🌙",
      items: [
        { ingredient: "Pechuga de pollo", state: "Cruda", weight: "120g", notes: "Pesar antes de cocinar" },
        { ingredient: "Queso panela fresco", state: "Fresco", weight: "150g", notes: "" },
        { ingredient: "Pan de caja blanco", state: "Tal cual", weight: "4 rebanadas", notes: "Estructurar como sándwichs" },
      ],
    },
  ],
  workoutPlan: {
    monday: {
      type: "Empuje", cardio: 30, emoji: "🏋️",
      exercises: [
        { name: "Press de banca plano", sets: 3, reps: "6-8", rir: "RIR 1" },
        { name: "Press militar", sets: 3, reps: "8-10", rir: "RIR 1-2" },
        { name: "Peck fly / Cruce de poleas", sets: 2, reps: "10-12", rir: "RIR 1-2" },
        { name: "Elevaciones laterales", sets: 3, reps: "12-15", rir: "RIR 1-2" },
        { name: "Copa tríceps a dos manos", sets: 3, reps: "10-12", rir: "RIR 1-2" },
      ],
    },
    tuesday: {
      type: "Tirón", cardio: 30, emoji: "🔙",
      exercises: [
        { name: "Jalón al pecho / Dominadas", sets: 3, reps: "6-8", rir: "RIR 1" },
        { name: "Remo en polea sentado", sets: 3, reps: "8-10", rir: "RIR 1-2" },
        { name: "Pullover con cuerda", sets: 2, reps: "12-15", rir: "RIR 1-2" },
        { name: "Curl predicador", sets: 3, reps: "10-12", rir: "RIR 1-2" },
        { name: "Curl martillo", sets: 2, reps: "10-12", rir: "RIR 1-2" },
      ],
    },
    wednesday: {
      type: "Pierna – Cuádriceps", cardio: 30, emoji: "🦵",
      exercises: [
        { name: "Sentadilla (libre o Smith)", sets: 3, reps: "6-8", rir: "RIR 1" },
        { name: "Prensa de piernas", sets: 3, reps: "8-10", rir: "RIR 1-2" },
        { name: "Peso muerto rumano", sets: 3, reps: "8-10", rir: "RIR 1-2" },
        { name: "Extensiones de cuádriceps", sets: 2, reps: "12-15", rir: "RIR 1-2" },
        { name: "Pantorrilla de pie o sentado", sets: 4, reps: "12-15", rir: "RIR 1-2" },
      ],
    },
    thursday: {
      type: "Torso – Empuje + Tirón", cardio: 30, emoji: "💪",
      exercises: [
        { name: "Press inclinado con mancuernas", sets: 3, reps: "8-10", rir: "RIR 1-2" },
        { name: "Remo con barra / mancuerna", sets: 3, reps: "8-10", rir: "RIR 1-2" },
        { name: "Elevaciones laterales", sets: 3, reps: "12-15", rir: "RIR 1-2" },
        { name: "Pájaros / Facepull", sets: 3, reps: "12-15", rir: "RIR 1-2" },
        { name: "Tríceps en polea con cuerda", sets: 3, reps: "10-12", rir: "RIR 1-2" },
      ],
    },
    friday: {
      type: "Pierna – Cadena Posterior", cardio: 30, emoji: "🍑",
      exercises: [
        { name: "Hip thrust (máquina o libre)", sets: 3, reps: "6-8", rir: "RIR 1" },
        { name: "Desplantes fijos con mancuernas", sets: 3, reps: "10-12", rir: "RIR 1-2" },
        { name: "Femoral acostado o sentado", sets: 3, reps: "10-12", rir: "RIR 1-2" },
        { name: "Aductor en máquina", sets: 2, reps: "12-15", rir: "RIR 1-2" },
        { name: "Pantorrilla de pie o sentado", sets: 4, reps: "12-15", rir: "RIR 1-2" },
      ],
    },
    saturday: {
      type: "Descanso Activo", cardio: 30, emoji: "🚶",
      exercises: [{ name: "Caminata ligera", sets: 1, reps: "30 min", rir: "Recuperación" }],
    },
    sunday: { type: "Descanso Total", cardio: 0, emoji: "😴", exercises: [] },
  },
};

const DAYS_ES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const DAYS_LABEL = { monday: "LUN", tuesday: "MAR", wednesday: "MIÉ", thursday: "JUE", friday: "VIE", saturday: "SÁB", sunday: "DOM" };

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const STORAGE_KEY = "fitness_tracker_v2";

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    log: {},        // { "YYYY-MM-DD": { meals: [bool,bool,bool,bool], workout: bool, cardio: bool, weight: number, notes: string, exercises: [{weight,reps}] } }
    bodyWeights: [], // [{ date, weight }]
  };
}

function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getDay() {
  return DAYS_ES[new Date().getDay()];
}

// ─────────────────────────────────────────────────────────────────────────────
// MINI COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function MacroBar({ label, value, max, color }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 11, fontFamily: "'Courier New', monospace", letterSpacing: 2 }}>
        <span style={{ color: "#888" }}>{label}</span>
        <span style={{ color }}>{value}g / {max}g</span>
      </div>
      <div style={{ height: 6, background: "#1a1a1a", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

function CheckButton({ checked, onClick, label, sub }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 12, width: "100%",
      padding: "12px 16px", marginBottom: 6,
      background: checked ? "rgba(255,200,0,0.07)" : "#111",
      border: checked ? "1px solid #ffc800" : "1px solid #252525",
      borderRadius: 4, cursor: "pointer", textAlign: "left", transition: "all 0.2s"
    }}>
      <div style={{
        width: 20, height: 20, border: checked ? "2px solid #ffc800" : "2px solid #444",
        borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, background: checked ? "#ffc800" : "transparent", transition: "all 0.2s"
      }}>
        {checked && <span style={{ color: "#000", fontSize: 12, fontWeight: 900 }}>✓</span>}
      </div>
      <div>
        <div style={{ color: checked ? "#ffc800" : "#ccc", fontSize: 13, fontFamily: "'Courier New', monospace", letterSpacing: 1 }}>{label}</div>
        {sub && <div style={{ color: "#555", fontSize: 11, marginTop: 2 }}>{sub}</div>}
      </div>
    </button>
  );
}

function Pill({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 14px", fontSize: 11, fontFamily: "'Courier New', monospace", letterSpacing: 2,
      background: active ? "#ffc800" : "#111", color: active ? "#000" : "#555",
      border: active ? "1px solid #ffc800" : "1px solid #252525",
      borderRadius: 2, cursor: "pointer", transition: "all 0.2s", fontWeight: active ? 700 : 400
    }}>{children}</button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WEIGHT SPARKLINE
// ─────────────────────────────────────────────────────────────────────────────
function WeightChart({ data }) {
  if (data.length < 2) return (
    <div style={{ textAlign: "center", color: "#444", fontSize: 12, padding: "30px 0", fontFamily: "'Courier New', monospace" }}>
      REGISTRA AL MENOS 2 PESOS PARA VER PROGRESO
    </div>
  );
  const weights = data.map(d => d.weight);
  const min = Math.min(...weights) - 1;
  const max = Math.max(...weights) + 1;
  const W = 500, H = 100;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((d.weight - min) / (max - min)) * H;
    return `${x},${y}`;
  });
  const lineD = "M " + pts.join(" L ");
  const areaD = `M 0,${H} L ${lineD.slice(2)} L ${W},${H} Z`;
  const last = data[data.length - 1];
  const first = data[0];
  const diff = (last.weight - first.weight).toFixed(1);
  const isUp = diff >= 0;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#ffc800", fontFamily: "'Courier New', monospace" }}>
            {last.weight} <span style={{ fontSize: 14, color: "#666" }}>kg</span>
          </div>
          <div style={{ fontSize: 11, color: isUp ? "#4caf50" : "#f44336", fontFamily: "'Courier New', monospace" }}>
            {isUp ? "+" : ""}{diff} kg total · Meta: {CONFIG.targetWeightKg} kg
          </div>
        </div>
        <div style={{ fontSize: 11, color: "#444", fontFamily: "'Courier New', monospace", textAlign: "right" }}>
          {data.length} registros<br />{first.date} → {last.date}
        </div>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffc800" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ffc800" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#wg)" />
        <path d={lineD} fill="none" stroke="#ffc800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * W;
          const y = H - ((d.weight - min) / (max - min)) * H;
          return (
            <circle key={i} cx={x} cy={y} r={i === data.length - 1 ? 5 : 3}
              fill={i === data.length - 1 ? "#ffc800" : "#333"}
              stroke={i === data.length - 1 ? "#ffc800" : "#ffc80066"}
              strokeWidth="1.5" />
          );
        })}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: "#444", fontFamily: "'Courier New', monospace" }}>
        <span>{first.date}</span><span>{last.date}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CALENDAR HEATMAP (last 8 weeks)
// ─────────────────────────────────────────────────────────────────────────────
function CalendarHeatmap({ log }) {
  const today = new Date();
  const days = [];
  for (let i = 55; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const entry = log[key];
    const mealsDone = entry ? entry.meals.filter(Boolean).length : 0;
    const workoutDone = entry?.workout;
    let level = 0;
    if (entry) {
      if (workoutDone && mealsDone >= 3) level = 3;
      else if (workoutDone || mealsDone >= 3) level = 2;
      else if (mealsDone >= 1) level = 1;
    }
    days.push({ key, level, day: d.getDate(), month: d.getMonth() });
  }
  const colors = ["#111", "#3d3000", "#806200", "#ffc800"];

  return (
    <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
      {days.map((d, i) => (
        <div key={i} title={d.key} style={{
          width: 12, height: 12, borderRadius: 2,
          background: colors[d.level],
          border: d.key === todayKey() ? "1px solid #ffc800" : "1px solid transparent",
          cursor: "default"
        }} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXERCISE LOG ROW
// ─────────────────────────────────────────────────────────────────────────────
function ExerciseRow({ exercise, logEntry, onChange }) {
  const [weight, setWeight] = useState(logEntry?.weight || "");
  const [reps, setReps] = useState(logEntry?.reps || "");
  const [done, setDone] = useState(logEntry?.done || false);

  useEffect(() => {
    onChange({ weight, reps, done });
  }, [weight, reps, done]);

  return (
    <div style={{
      padding: "12px 14px", marginBottom: 6,
      background: done ? "rgba(255,200,0,0.04)" : "#0d0d0d",
      border: done ? "1px solid #ffc80040" : "1px solid #1a1a1a",
      borderRadius: 4
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: done ? 0 : 8 }}>
        <button onClick={() => setDone(!done)} style={{
          width: 18, height: 18, border: done ? "2px solid #ffc800" : "2px solid #333",
          background: done ? "#ffc800" : "transparent", borderRadius: 2, cursor: "pointer",
          flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          {done && <span style={{ fontSize: 10, fontWeight: 900, color: "#000" }}>✓</span>}
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: done ? "#ffc800" : "#bbb", fontFamily: "'Courier New', monospace" }}>{exercise.name}</div>
          <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>
            {exercise.sets} series · {exercise.reps} reps · {exercise.rir}
          </div>
        </div>
      </div>
      {!done && (
        <div style={{ display: "flex", gap: 8, paddingLeft: 28 }}>
          <input value={weight} onChange={e => setWeight(e.target.value)} placeholder="Kg usado"
            style={{ flex: 1, background: "#141414", border: "1px solid #252525", color: "#ccc", padding: "6px 8px", fontSize: 11, borderRadius: 3, fontFamily: "'Courier New', monospace" }} />
          <input value={reps} onChange={e => setReps(e.target.value)} placeholder="Reps reales"
            style={{ flex: 1, background: "#141414", border: "1px solid #252525", color: "#ccc", padding: "6px 8px", fontSize: 11, borderRadius: 3, fontFamily: "'Courier New', monospace" }} />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(loadData);
  const [tab, setTab] = useState("today");
  const [newWeight, setNewWeight] = useState("");
  const [noteText, setNoteText] = useState("");

  const today = todayKey();
  const dayKey = getDay();
  const workout = CONFIG.workoutPlan[dayKey];

  // Ensure today's entry exists
  const todayEntry = data.log[today] || {
    meals: [false, false, false, false],
    workout: false,
    cardio: false,
    weight: null,
    notes: "",
    exercises: workout.exercises.map(() => ({ weight: "", reps: "", done: false })),
  };

  const persist = useCallback((updatedData) => {
    setData(updatedData);
    saveData(updatedData);
  }, []);

  const updateToday = useCallback((patch) => {
    const next = { ...data, log: { ...data.log, [today]: { ...todayEntry, ...patch } } };
    persist(next);
  }, [data, today, todayEntry, persist]);

  const toggleMeal = (idx) => {
    const meals = [...todayEntry.meals];
    meals[idx] = !meals[idx];
    updateToday({ meals });
  };

  const mealsDone = todayEntry.meals.filter(Boolean).length;
  const mealPct = Math.round((mealsDone / 4) * 100);
  const exerciseDone = todayEntry.exercises?.filter(e => e.done).length || 0;
  const exTotal = workout.exercises.length;

  // Save body weight
  const saveWeight = () => {
    const w = parseFloat(newWeight);
    if (!w || w < 30 || w > 300) return;
    const bw = [...(data.bodyWeights || []).filter(e => e.date !== today), { date: today, weight: w }]
      .sort((a, b) => a.date.localeCompare(b.date));
    persist({ ...data, bodyWeights: bw });
    setNewWeight("");
  };

  // Streak calculation
  const getStreak = () => {
    let streak = 0;
    const d = new Date();
    while (true) {
      const k = d.toISOString().slice(0, 10);
      const e = data.log[k];
      if (!e || (!e.workout && e.meals.filter(Boolean).length < 2)) break;
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  };

  const weekDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
  const weekData = weekDays.map((d, i) => {
    const dd = new Date(weekStart);
    dd.setDate(dd.getDate() + i);
    const k = dd.toISOString().slice(0, 10);
    return { day: d, key: k, entry: data.log[k], plan: CONFIG.workoutPlan[d] };
  });

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    background: "#0d0d0d", border: "1px solid #252525", color: "#ccc",
    padding: "10px 12px", fontSize: 12, borderRadius: 3,
    fontFamily: "'Courier New', monospace", outline: "none"
  };

  const btnStyle = {
    padding: "10px 20px", background: "#ffc800", color: "#000",
    border: "none", borderRadius: 3, cursor: "pointer",
    fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 12, letterSpacing: 1
  };

  const cardStyle = {
    background: "#0d0d0d", border: "1px solid #1e1e1e",
    borderRadius: 6, padding: 20, marginBottom: 14
  };

  const sectionTitle = (t) => (
    <div style={{ fontSize: 10, fontFamily: "'Courier New', monospace", letterSpacing: 3, color: "#ffc800", marginBottom: 12, borderBottom: "1px solid #1a1a1a", paddingBottom: 8 }}>
      {t}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#ddd", fontFamily: "'Courier New', monospace" }}>
      {/* HEADER */}
      <div style={{ background: "#0a0a0a", borderBottom: "1px solid #1a1a1a", padding: "16px 20px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: 4, color: "#ffc800" }}>FITLOG</div>
            <div style={{ fontSize: 10, color: "#444", letterSpacing: 2 }}>{CONFIG.goal.toUpperCase()}</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[["today","HOY"],["diet","DIETA"],["workout","ENTRENO"],["progress","PROGRESO"]].map(([k,l]) => (
              <Pill key={k} active={tab === k} onClick={() => setTab(k)}>{l}</Pill>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "20px 16px" }}>

        {/* ── TODAY ── */}
        {tab === "today" && (
          <div>
            {/* Quick Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[
                { label: "RACHA", value: getStreak(), unit: "días", color: "#ffc800" },
                { label: "COMIDAS", value: `${mealsDone}/4`, unit: "", color: mealsDone === 4 ? "#4caf50" : "#888" },
                { label: "EJERCICIOS", value: `${exerciseDone}/${exTotal}`, unit: "", color: exerciseDone === exTotal && exTotal > 0 ? "#4caf50" : "#888" },
              ].map(s => (
                <div key={s.label} style={{ ...cardStyle, textAlign: "center", padding: 14 }}>
                  <div style={{ fontSize: 9, letterSpacing: 3, color: "#444", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
                  {s.unit && <div style={{ fontSize: 9, color: "#555" }}>{s.unit}</div>}
                </div>
              ))}
            </div>

            {/* Today's workout card */}
            <div style={{ ...cardStyle, borderColor: "#252525" }}>
              {sectionTitle(`HOY — ${DAYS_LABEL[dayKey]} ${workout.emoji}`)}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 14, color: "#ffc800", fontWeight: 700 }}>{workout.type}</div>
                  {workout.cardio > 0 && <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>+ {workout.cardio} min cardio</div>}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => updateToday({ workout: !todayEntry.workout })} style={{
                    padding: "6px 14px", fontSize: 10, letterSpacing: 1,
                    background: todayEntry.workout ? "#ffc800" : "transparent",
                    color: todayEntry.workout ? "#000" : "#555",
                    border: "1px solid " + (todayEntry.workout ? "#ffc800" : "#333"),
                    borderRadius: 2, cursor: "pointer"
                  }}>ENTRENO ✓</button>
                  {workout.cardio > 0 && (
                    <button onClick={() => updateToday({ cardio: !todayEntry.cardio })} style={{
                      padding: "6px 14px", fontSize: 10, letterSpacing: 1,
                      background: todayEntry.cardio ? "#4caf50" : "transparent",
                      color: todayEntry.cardio ? "#000" : "#555",
                      border: "1px solid " + (todayEntry.cardio ? "#4caf50" : "#333"),
                      borderRadius: 2, cursor: "pointer"
                    }}>CARDIO ✓</button>
                  )}
                </div>
              </div>
              {/* Exercise list */}
              {workout.exercises.map((ex, i) => (
                <ExerciseRow key={i} exercise={ex}
                  logEntry={todayEntry.exercises?.[i]}
                  onChange={(val) => {
                    const exercises = [...(todayEntry.exercises || workout.exercises.map(() => ({})))];
                    exercises[i] = val;
                    updateToday({ exercises });
                  }} />
              ))}
            </div>

            {/* Meals */}
            <div style={cardStyle}>
              {sectionTitle("COMIDAS DEL DÍA")}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 10, color: "#555" }}>
                  <span>PROGRESO</span><span style={{ color: mealPct === 100 ? "#4caf50" : "#888" }}>{mealPct}%</span>
                </div>
                <div style={{ height: 4, background: "#1a1a1a", borderRadius: 2 }}>
                  <div style={{ width: `${mealPct}%`, height: "100%", background: mealPct === 100 ? "#4caf50" : "#ffc800", borderRadius: 2, transition: "width 0.4s" }} />
                </div>
              </div>
              {CONFIG.meals.map((meal, i) => (
                <CheckButton key={i} checked={todayEntry.meals[i]} onClick={() => toggleMeal(i)}
                  label={`${meal.emoji} ${meal.name}`}
                  sub={meal.items.map(it => `${it.ingredient} ${it.weight}`).join(" · ")} />
              ))}
            </div>

            {/* Weight + Notes */}
            <div style={cardStyle}>
              {sectionTitle("REGISTRO DEL DÍA")}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: "#555", marginBottom: 6, letterSpacing: 2 }}>PESO CORPORAL (KG)</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={newWeight} onChange={e => setNewWeight(e.target.value)}
                    placeholder={todayEntry.weight ? `Último: ${todayEntry.weight}kg` : "Ej. 87.5"}
                    style={{ ...inputStyle, flex: 1 }} type="number" step="0.1"
                    onKeyDown={e => e.key === "Enter" && saveWeight()} />
                  <button onClick={saveWeight} style={btnStyle}>GUARDAR</button>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#555", marginBottom: 6, letterSpacing: 2 }}>NOTAS DEL DÍA</div>
                <textarea value={todayEntry.notes || ""} rows={3}
                  onChange={e => updateToday({ notes: e.target.value })}
                  placeholder="Cómo te sentiste, qué mejorar..."
                  style={{ ...inputStyle, resize: "vertical" }} />
              </div>
            </div>
          </div>
        )}

        {/* ── DIET ── */}
        {tab === "diet" && (
          <div>
            <div style={cardStyle}>
              {sectionTitle("MACROS OBJETIVO DIARIO")}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#ffc800" }}>{CONFIG.dailyCalories}</div>
                  <div style={{ fontSize: 10, color: "#555", letterSpacing: 2 }}>CALORÍAS/DÍA</div>
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  {[["P", CONFIG.macros.proteinGrams, "#4caf50"], ["C", CONFIG.macros.carbsGrams, "#2196f3"], ["G", CONFIG.macros.fatsGrams, "#ff9800"]].map(([l, v, c]) => (
                    <div key={l} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: c }}>{v}g</div>
                      <div style={{ fontSize: 9, color: "#555", letterSpacing: 2 }}>{l === "P" ? "PROT" : l === "C" ? "CARBS" : "GRASAS"}</div>
                    </div>
                  ))}
                </div>
              </div>
              <MacroBar label="PROTEÍNA" value={CONFIG.macros.proteinGrams} max={CONFIG.macros.proteinGrams} color="#4caf50" />
              <MacroBar label="CARBOHIDRATOS" value={CONFIG.macros.carbsGrams} max={CONFIG.macros.carbsGrams} color="#2196f3" />
              <MacroBar label="GRASAS" value={CONFIG.macros.fatsGrams} max={CONFIG.macros.fatsGrams} color="#ff9800" />
            </div>

            {CONFIG.meals.map((meal) => (
              <div key={meal.id} style={cardStyle}>
                {sectionTitle(`${meal.emoji} ${meal.name.toUpperCase()}`)}
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <thead>
                    <tr style={{ color: "#444", borderBottom: "1px solid #1a1a1a" }}>
                      {["INGREDIENTE", "ESTADO", "CANTIDAD", "NOTA"].map(h => (
                        <td key={h} style={{ padding: "4px 8px 8px 0", letterSpacing: 1, fontSize: 9 }}>{h}</td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {meal.items.map((item, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #111" }}>
                        <td style={{ padding: "10px 8px 10px 0", color: "#ddd" }}>{item.ingredient}</td>
                        <td style={{ color: "#888" }}>{item.state}</td>
                        <td style={{ color: "#ffc800", fontWeight: 700 }}>{item.weight}</td>
                        <td style={{ color: "#555", fontSize: 10 }}>{item.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* ── WORKOUT ── */}
        {tab === "workout" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 14 }}>
              {weekDays.map((d) => {
                const plan = CONFIG.workoutPlan[d];
                const isToday = d === dayKey;
                return (
                  <div key={d} style={{
                    padding: "8px 4px", textAlign: "center",
                    background: isToday ? "rgba(255,200,0,0.08)" : "#0d0d0d",
                    border: isToday ? "1px solid #ffc800" : "1px solid #1a1a1a",
                    borderRadius: 4
                  }}>
                    <div style={{ fontSize: 9, color: isToday ? "#ffc800" : "#555", letterSpacing: 1 }}>{DAYS_LABEL[d]}</div>
                    <div style={{ fontSize: 16, margin: "4px 0" }}>{plan.emoji}</div>
                    <div style={{ fontSize: 8, color: "#444", lineHeight: 1.3 }}>{plan.type.split(" – ")[0]}</div>
                  </div>
                );
              })}
            </div>

            {weekDays.map((d) => {
              const plan = CONFIG.workoutPlan[d];
              const isToday = d === dayKey;
              if (plan.exercises.length === 0) return null;
              return (
                <div key={d} style={{ ...cardStyle, borderColor: isToday ? "#ffc80030" : "#1e1e1e" }}>
                  {sectionTitle(`${plan.emoji} ${DAYS_LABEL[d]} — ${plan.type.toUpperCase()}`)}
                  {plan.cardio > 0 && (
                    <div style={{ fontSize: 10, color: "#666", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: "#ffc800" }}>▸</span> {plan.cardio} MIN CARDIO
                    </div>
                  )}
                  {plan.exercises.map((ex, i) => (
                    <div key={i} style={{ padding: "8px 0", borderBottom: i < plan.exercises.length - 1 ? "1px solid #111" : "none" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 12, color: "#ccc" }}>{ex.name}</div>
                        <div style={{ fontSize: 10, color: "#ffc800", fontWeight: 700, whiteSpace: "nowrap", marginLeft: 8 }}>
                          {ex.sets}×{ex.reps}
                        </div>
                      </div>
                      <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>{ex.rir}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* ── PROGRESS ── */}
        {tab === "progress" && (
          <div>
            <div style={cardStyle}>
              {sectionTitle("PESO CORPORAL")}
              <WeightChart data={data.bodyWeights || []} />
            </div>

            <div style={cardStyle}>
              {sectionTitle("ACTIVIDAD (ÚLTIMAS 8 SEMANAS)")}
              <CalendarHeatmap log={data.log} />
              <div style={{ display: "flex", gap: 12, marginTop: 12, fontSize: 9, color: "#444" }}>
                {[["#111", "Sin registro"], ["#3d3000", "Algo"], ["#806200", "Parcial"], ["#ffc800", "Completo"]].map(([c, l]) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 10, height: 10, background: c, borderRadius: 2 }} />
                    <span>{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly summary */}
            <div style={cardStyle}>
              {sectionTitle("SEMANA ACTUAL")}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {weekData.map(({ day, key, entry, plan }) => {
                  const meals = entry?.meals?.filter(Boolean).length || 0;
                  const wk = entry?.workout;
                  const cd = entry?.cardio;
                  const isT = key === today;
                  return (
                    <div key={day} style={{
                      padding: 12, background: "#080808",
                      border: isT ? "1px solid #ffc80050" : "1px solid #141414",
                      borderRadius: 4
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 10, letterSpacing: 2, color: isT ? "#ffc800" : "#555" }}>{DAYS_LABEL[day]}</span>
                        <span style={{ fontSize: 10 }}>{plan.emoji}</span>
                      </div>
                      <div style={{ fontSize: 9, color: "#333", marginBottom: 4 }}>{plan.type}</div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <div style={{ fontSize: 9, color: wk ? "#4caf50" : "#333" }}>● ENTRENO</div>
                        <div style={{ fontSize: 9, color: cd ? "#4caf50" : "#333" }}>● CARDIO</div>
                        <div style={{ fontSize: 9, color: meals > 0 ? "#ffc800" : "#333" }}>● {meals}/4</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent log */}
            <div style={cardStyle}>
              {sectionTitle("HISTORIAL RECIENTE")}
              {Object.entries(data.log).slice(-10).reverse().map(([date, entry]) => (
                <div key={date} style={{ padding: "10px 0", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#888" }}>{date}</div>
                    {entry.notes && <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>{entry.notes.slice(0, 50)}{entry.notes.length > 50 ? "…" : ""}</div>}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {entry.workout && <span style={{ fontSize: 9, color: "#4caf50", border: "1px solid #4caf5033", padding: "2px 6px", borderRadius: 2 }}>ENTRENO</span>}
                    {entry.cardio && <span style={{ fontSize: 9, color: "#2196f3", border: "1px solid #2196f333", padding: "2px 6px", borderRadius: 2 }}>CARDIO</span>}
                    <span style={{ fontSize: 9, color: "#ffc800" }}>{entry.meals.filter(Boolean).length}/4 🍽</span>
                    {(() => {
                      const bwEntry = (data.bodyWeights || []).find(e => e.date === date);
                      return bwEntry ? <span style={{ fontSize: 10, color: "#ffc800", fontWeight: 700 }}>{bwEntry.weight}kg</span> : null;
                    })()}
                  </div>
                </div>
              ))}
              {Object.keys(data.log).length === 0 && (
                <div style={{ textAlign: "center", color: "#333", fontSize: 11, padding: "20px 0" }}>SIN REGISTROS AÚN</div>
              )}
            </div>

            {/* Reset */}
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button onClick={() => { if (window.confirm("¿Borrar todos los datos? Esto no se puede deshacer.")) { persist({ log: {}, bodyWeights: [] }); } }}
                style={{ fontSize: 10, color: "#333", background: "none", border: "1px solid #1a1a1a", padding: "8px 16px", borderRadius: 3, cursor: "pointer", letterSpacing: 2 }}>
                REINICIAR DATOS
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "20px 0 30px", fontSize: 9, color: "#222", letterSpacing: 3 }}>
        FITLOG · {CONFIG.goal.toUpperCase()} · META {CONFIG.targetWeightKg}KG
      </div>
    </div>
  );
}
