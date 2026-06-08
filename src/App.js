import React from "react";
import { useState, useRef, useEffect, useCallback } from "react";

// ─── TRANSLATIONS ───────────────────────────────────────────────────────────
const T = {
  en: {
    appName: "INTrouble",
    appSub: "INDUSTRIAL TROUBLESHOOTING SYSTEM",
    safety: "⚠ SAFETY NOTICE",
    safetyText: "Always apply LOTO procedures, verify zero energy state, and wear appropriate PPE before performing any diagnostic steps.",
    selectCategory: "SELECT SYSTEM CATEGORY",
    selectBrand: "SELECT EQUIPMENT BRAND",
    commonFaults: "COMMON FAULTS",
    describeFault: "OR DESCRIBE YOUR FAULT",
    faultPlaceholder: "e.g. Relay 87T tripped on transformer...",
    newSession: "← NEW SESSION",
    history: "FAULT HISTORY",
    noHistory: "No fault sessions recorded yet.",
    exportPDF: "📄 Export PDF Report",
    offlineMode: "OFFLINE MODE",
    onlineMode: "AI-ASSISTED MODE",
    offlineNotice: "Offline: Using built-in diagnostic trees. Connect to internet for AI assistance.",
    typeResponse: "Type YES / NO or describe what you observe...",
    diagnosis: "DIAGNOSIS COMPLETE",
    brand: "Brand",
    category: "Category",
    fault: "Fault",
    duration: "Duration",
    steps: "Steps",
    allBrands: "All Brands",
    clearHistory: "Clear History",
    sessionSaved: "✓ Session saved to history",
    min: "min",
    language: "Language",
    home: "Home",
    historyTab: "History",
    nav: { home: "Home", history: "History" },
    categories: {
      distribution: { label: "Energy Distribution", desc: "Transformers, switchgear, feeders, protection relays" },
      equipment: { label: "Electrical Equipment", desc: "Motors, generators, UPS, VFDs, capacitor banks" },
      control: { label: "Control & Command", desc: "Control panels, contactors, relays, wiring faults" },
      plc: { label: "PLC / SCADA", desc: "PLC faults, HMI issues, comms errors, I/O diagnostics" },
    }
  },
  fr: {
    appName: "INTrouble",
    appSub: "SYSTÈME DE DIAGNOSTIC INDUSTRIEL",
    safety: "⚠ AVERTISSEMENT SÉCURITÉ",
    safetyText: "Appliquer toujours les procédures LOTO, vérifier l'absence de tension et porter les EPI appropriés avant tout diagnostic.",
    selectCategory: "SÉLECTIONNER LA CATÉGORIE",
    selectBrand: "SÉLECTIONNER LA MARQUE",
    commonFaults: "PANNES COURANTES",
    describeFault: "OU DÉCRIVEZ VOTRE PANNE",
    faultPlaceholder: "ex. Déclenchement relais 87T transformateur...",
    newSession: "← NOUVELLE SESSION",
    history: "HISTORIQUE DES PANNES",
    noHistory: "Aucune session enregistrée.",
    exportPDF: "📄 Exporter Rapport PDF",
    offlineMode: "MODE HORS LIGNE",
    onlineMode: "MODE ASSISTÉ IA",
    offlineNotice: "Hors ligne: Arbres de diagnostic intégrés. Connectez-vous pour l'assistance IA.",
    typeResponse: "Tapez OUI / NON ou décrivez ce que vous observez...",
    diagnosis: "DIAGNOSTIC TERMINÉ",
    brand: "Marque",
    category: "Catégorie",
    fault: "Panne",
    duration: "Durée",
    steps: "Étapes",
    allBrands: "Toutes Marques",
    clearHistory: "Effacer Historique",
    sessionSaved: "✓ Session sauvegardée",
    min: "min",
    language: "Langue",
    home: "Accueil",
    historyTab: "Historique",
    nav: { home: "Accueil", history: "Historique" },
    categories: {
      distribution: { label: "Distribution Énergie", desc: "Transformateurs, tableaux HTA, relais de protection" },
      equipment: { label: "Équipements Électriques", desc: "Moteurs, groupes, onduleurs, variateurs" },
      control: { label: "Commande & Contrôle", desc: "Armoires, contacteurs, relais, câblage" },
      plc: { label: "API / SCADA", desc: "Pannes API, IHM, erreurs communication, E/S" },
    }
  },
  es: {
    appName: "INTrouble",
    appSub: "SISTEMA DE DIAGNÓSTICO INDUSTRIAL",
    safety: "⚠ AVISO DE SEGURIDAD",
    safetyText: "Aplique siempre los procedimientos LOTO, verifique estado de cero energía y use EPP adecuado antes de realizar diagnósticos.",
    selectCategory: "SELECCIONAR CATEGORÍA",
    selectBrand: "SELECCIONAR MARCA",
    commonFaults: "FALLAS COMUNES",
    describeFault: "O DESCRIBA SU FALLA",
    faultPlaceholder: "ej. Relé 87T disparado en transformador...",
    newSession: "← NUEVA SESIÓN",
    history: "HISTORIAL DE FALLAS",
    noHistory: "No hay sesiones registradas.",
    exportPDF: "📄 Exportar Informe PDF",
    offlineMode: "MODO SIN CONEXIÓN",
    onlineMode: "MODO ASISTIDO IA",
    offlineNotice: "Sin conexión: Usando árboles de diagnóstico integrados.",
    typeResponse: "Escriba SÍ / NO o describa lo que observa...",
    diagnosis: "DIAGNÓSTICO COMPLETO",
    brand: "Marca",
    category: "Categoría",
    fault: "Falla",
    duration: "Duración",
    steps: "Pasos",
    allBrands: "Todas las Marcas",
    clearHistory: "Limpiar Historial",
    sessionSaved: "✓ Sesión guardada en historial",
    min: "min",
    language: "Idioma",
    home: "Inicio",
    historyTab: "Historial",
    nav: { home: "Inicio", history: "Historial" },
    categories: {
      distribution: { label: "Distribución Energía", desc: "Transformadores, tableros, relés de protección" },
      equipment: { label: "Equipos Eléctricos", desc: "Motores, generadores, UPS, variadores" },
      control: { label: "Mando y Control", desc: "Tableros, contactores, relés, cableado" },
      plc: { label: "PLC / SCADA", desc: "Fallas PLC, HMI, errores comunicación, E/S" },
    }
  },
  de: {
    appName: "INTrouble",
    appSub: "INDUSTRIELLES DIAGNOSESYSTEM",
    safety: "⚠ SICHERHEITSHINWEIS",
    safetyText: "Wenden Sie stets LOTO-Verfahren an, prüfen Sie den spannungsfreien Zustand und tragen Sie geeignete PSA vor allen Diagnoseschritten.",
    selectCategory: "SYSTEMKATEGORIE WÄHLEN",
    selectBrand: "GERÄTEMARKE WÄHLEN",
    commonFaults: "HÄUFIGE STÖRUNGEN",
    describeFault: "ODER STÖRUNG BESCHREIBEN",
    faultPlaceholder: "z.B. Schutzrelais 87T am Transformator ausgelöst...",
    newSession: "← NEUE SITZUNG",
    history: "STÖRUNGSPROTOKOLL",
    noHistory: "Noch keine Sitzungen aufgezeichnet.",
    exportPDF: "📄 PDF-Bericht exportieren",
    offlineMode: "OFFLINE-MODUS",
    onlineMode: "KI-UNTERSTÜTZTER MODUS",
    offlineNotice: "Offline: Integrierte Diagnosebäume aktiv. Verbindung für KI-Unterstützung herstellen.",
    typeResponse: "JA / NEIN eingeben oder Beobachtung beschreiben...",
    diagnosis: "DIAGNOSE ABGESCHLOSSEN",
    brand: "Marke",
    category: "Kategorie",
    fault: "Störung",
    duration: "Dauer",
    steps: "Schritte",
    allBrands: "Alle Marken",
    clearHistory: "Protokoll löschen",
    sessionSaved: "✓ Sitzung gespeichert",
    min: "Min",
    language: "Sprache",
    home: "Start",
    historyTab: "Protokoll",
    nav: { home: "Start", history: "Protokoll" },
    categories: {
      distribution: { label: "Energieverteilung", desc: "Transformatoren, Schaltanlagen, Schutzrelais" },
      equipment: { label: "Elektrische Geräte", desc: "Motoren, Generatoren, USV, Umrichter" },
      control: { label: "Steuerung & Befehl", desc: "Schaltschränke, Schütze, Relais, Verdrahtung" },
      plc: { label: "SPS / SCADA", desc: "SPS-Störungen, HMI, Kommunikationsfehler, E/A" },
    }
  },
};

// ─── BRANDS ─────────────────────────────────────────────────────────────────
const BRANDS = [
  { id: "abb", label: "ABB", color: "#cc0000", logo: "ABB" },
  { id: "schneider", label: "Schneider Electric", color: "#3dcd58", logo: "SE" },
  { id: "siemens", label: "Siemens", color: "#009999", logo: "SIE" },
  { id: "ge", label: "GE / General Electric", color: "#003087", logo: "GE" },
  { id: "rockwell", label: "Rockwell / Allen-Bradley", color: "#cc2233", logo: "AB" },
  { id: "eaton", label: "Eaton", color: "#f0a500", logo: "EAT" },
  { id: "legrand", label: "Legrand", color: "#8b1a1a", logo: "LGR" },
  { id: "other", label: "Other / Generic", color: "#64748b", logo: "GEN" },
];

const BRAND_KNOWLEDGE = {
  abb: `ABB-specific context: Reference ABB product lines — REF615/REF630 protection relays, RET615 transformer protection, ACS880/ACS580 drives, MNS/ArTu switchgear, SACE Emax/Tmax breakers, Symphony Plus/800xA SCADA, AC500/AC31 PLCs, UNITROL excitation systems. Mention ABB fault codes (e.g. F####), ABB Ability platform, FENA/FEIP adapter modules, DriveAP tool for ACS drives diagnostics.`,
  schneider: `Schneider Electric-specific context: Reference Easergy P3/P5 relays, Sepam 10/20/40/80 protection relays, Altivar ATV630/ATV930 drives, Masterpact NT/NW/MTZ breakers, Prisma/SM6/RM6 switchgear, Modicon M340/M580/Quantum PLCs, Unity Pro/EcoStruxure Machine Expert software, PowerLogic PM5000 meters, EcoStruxure SCADA Expert. Mention Schneider fault codes and EtherNet/IP, Modbus TCP protocols.`,
  siemens: `Siemens-specific context: Reference SIPROTEC 4/5 protection relays (7SJ, 7UT, 7SA series), SINAMICS G120/S120 drives, SIRIUS 3RW soft starters, SENTRON 3VA/3VL breakers, 8DJH/8DA switchgear, SIMATIC S7-300/400/1200/1500 PLCs, TIA Portal/Step7 programming, WinCC SCADA, PROFIBUS/PROFINET protocols. Reference Siemens fault codes (F####/A####), SINEMA Remote Connect, STARTER/Startdrive commissioning tools.`,
  ge: `GE / General Electric context: Reference Multilin 350/469/489/745 protection relays, Entelliguard/PowerBreak breakers, AV300/AV900 drives, Vernova grid solutions, GE Mark VI/VIe turbine controls, Proficy iFIX/CIMPLICITY SCADA, PACSystems RX3i/CPE PLCs. Mention GE EnerVista software, GE relay event logs, GARD protective relay analysis.`,
  rockwell: `Rockwell Automation / Allen-Bradley context: Reference ControlLogix/CompactLogix/MicroLogix PLCs, PowerFlex 525/755 drives, SMP-3 motor protection, CENTERLINE MCC, Studio 5000/RSLogix 5000 programming, FactoryTalk View SCADA, DeviceNet/EtherNet/IP protocols. Mention RSLinx diagnostics, add-on instructions (AOI), controller fault codes (Major/Minor faults), tag-based I/O.`,
  eaton: `Eaton context: Reference Eaton IQ relays, xEnergy/NZM/IZM breakers, SPX/SVX drives, Freedom/Digitrip MCC, PowerXpert SCADA, XC100/XC200 PLCs. Mention Eaton's arc flash protection solutions and Power Xpert software.`,
  legrand: `Legrand context: Reference Legrand Vistop disconnectors, DPX³ breakers, Bticino panels, Zucchini busbar trunking systems. Mention Legrand energy monitoring tools and DMX³ range.`,
  other: `Generic electrical equipment: Use standard IEC/IEEE references, generic fault code formats, universal diagnostic principles applicable to any manufacturer's equipment.`,
};

// ─── OFFLINE DIAGNOSTIC TREES ────────────────────────────────────────────────
const OFFLINE_TREES = {
  "Motor won't start": [
    "🔴 SAFETY: Verify LOTO applied. Check voltage presence with multimeter before touching terminals.\n\n🔍 STEP 1: Is control power (24VDC or 120VAC) present at the control circuit?\n✅ IF YES → Go to Step 2\n❌ IF NO → Check control transformer fuse, MCB, or power supply. Measure input voltage to transformer.",
    "🔍 STEP 2: Is the START command reaching the motor starter coil (measure coil terminals)?\n✅ IF YES → Go to Step 3\n❌ IF NO → Check interlocks, E-stop circuit, safety relay output. Trace 0V signal backward.",
    "🔍 STEP 3: Does the contactor/starter coil energize (click sound, LED)?\n✅ IF YES → Go to Step 4\n❌ IF NO → Measure coil voltage. If voltage present but no pull-in → replace coil. If no voltage → check control wiring.",
    "🔍 STEP 4: Is motor overload relay in RESET state (not tripped)?\n✅ IF YES → Go to Step 5\n❌ IF NO → Reset overload. Check motor current vs. relay setting. Verify motor isn't mechanically jammed.",
    "🔍 STEP 5: Measure line voltage at motor terminals (U1-V1-W1). Are all 3 phases present and balanced (within 2%)?\n✅ IF YES → 🎯 DIAGNOSIS: Motor winding or mechanical fault. Measure winding resistance and insulation (Megger test).\n🔧 CORRECTIVE ACTION: Check winding resistance balance. If Megger <1MΩ → rewind or replace motor.\n❌ IF NO → Check main contactor power contacts, fuses, and cable connections.",
  ],
  "VFD fault / overcurrent trip": [
    "🔴 SAFETY: Do NOT reset drive under load without understanding fault cause. Check drive display for fault code.\n\n🔍 STEP 1: Note the exact fault code on the drive display. Is it an overcurrent (OC), overload (OL), or overvoltage (OV) fault?\n✅ IF OC/OL → Go to Step 2\n✅ IF OV → Go to Step 4\n❌ IF OTHER → Note code and check drive manual for specific cause.",
    "🔍 STEP 2: Check motor cable for damage or moisture. Disconnect motor and test insulation resistance (500VDC Megger between each phase and ground). Is insulation >1MΩ?\n✅ IF YES → Go to Step 3\n❌ IF NO → Cable or motor winding insulation fault. Replace cable or rewind motor.",
    "🔍 STEP 3: Verify drive output current setting matches motor nameplate. Is acceleration ramp time (Acc) set too short (<3s for heavy loads)?\n✅ IF YES → Increase acceleration ramp time. Check load for mechanical jamming.\n❌ IF NO → 🎯 DIAGNOSIS: Drive IGBT or current sensor fault.\n🔧 CORRECTIVE ACTION: Contact manufacturer for drive internal fault diagnosis.",
    "🔍 STEP 4 (Overvoltage): Measure DC bus voltage during deceleration. Is deceleration ramp too fast?\n✅ IF YES → Increase deceleration ramp time (Dec parameter). Add braking resistor if needed.\n❌ IF NO → Check incoming supply for voltage spikes. Install line reactor if voltage unstable.",
  ],
  "PLC in STOP mode / CPU fault": [
    "🔴 SAFETY: Verify impact of PLC restart on connected machinery. Inform supervisor before any restart.\n\n🔍 STEP 1: Check CPU status LEDs. Is there a RUN/STOP/FAULT LED pattern? Note exact LED state.\n✅ IF FAULT LED ON → Go to Step 2\n✅ IF STOP ONLY → Go to Step 3\n❌ IF NO POWER LED → Check 24VDC power supply to CPU rack.",
    "🔍 STEP 2: Connect programming software (TIA Portal/Studio 5000/Unity Pro). Read diagnostic buffer/fault table. Is there a hardware fault (I/O module, rack)?\n✅ IF YES → Identify faulty module (red LED on module). Replace module. Clear fault and restart.\n❌ IF SOFTWARE FAULT → Check program execution error. May need program download or battery replacement.",
    "🔍 STEP 3: Was PLC placed in STOP by operator or remote command? Check HMI/SCADA for STOP command.\n✅ IF YES → Clear condition, switch key switch to RUN, restart.\n❌ IF NO → Check for program scan time overrun. Review watchdog timer setting.",
  ],
  "Transformer overtemperature alarm": [
    "🔴 SAFETY: Do NOT touch transformer enclosure. High surface temperature possible. Maintain safe distance.\n\n🔍 STEP 1: Check ambient temperature and ventilation. Is cooling fan (if present) running?\n✅ IF FAN NOT RUNNING → Check fan motor fuse, contactor, thermostat contact. Restart fan manually.\n✅ IF FAN RUNNING → Go to Step 2",
    "🔍 STEP 2: Check transformer load current (primary and secondary). Is load current above rated kVA?\n✅ IF OVERLOADED → Identify and shed non-critical loads. Check for load growth since last inspection.\n❌ IF WITHIN RATING → Go to Step 3",
    "🔍 STEP 3: Check winding temperature sensor (PT100/thermistor). Compare reading with handheld IR thermometer.\n✅ IF SENSOR READING MATCHES → Real overtemperature. Reduce load and improve ventilation.\n❌ IF SENSOR MISREADS → 🎯 DIAGNOSIS: Faulty temperature sensor or relay.\n🔧 CORRECTIVE ACTION: Calibrate or replace PT100 sensor. Check Wth relay setting.",
  ],
};

// ─── CATEGORIES ──────────────────────────────────────────────────────────────
const CATEGORY_DATA = [
  { id: "distribution", icon: "⚡", color: "#f59e0b" },
  { id: "equipment", icon: "🔌", color: "#10b981" },
  { id: "control", icon: "🎛️", color: "#3b82f6" },
  { id: "plc", icon: "💻", color: "#8b5cf6" },
];

const QUICK_FAULTS = {
  distribution: ["Transformer overtemperature alarm", "Protection relay trip (overcurrent)", "Busbar fault / short circuit", "Feeder breaker won't close", "Ground fault detected", "Voltage dip / flicker on bus"],
  equipment: ["Motor won't start", "VFD fault / overcurrent trip", "Generator voltage instability", "UPS on bypass / battery fault", "Motor overheating", "Soft starter fault"],
  control: ["Control circuit not energizing", "Contactor chattering / not holding", "Pushbutton / selector switch fault", "Wiring short / insulation fault", "Panel cooling fan failure", "Emergency stop circuit fault"],
  plc: ["PLC in STOP mode / CPU fault", "I/O module communication loss", "HMI not connecting to PLC", "Analog signal out of range", "Program execution error", "Network/fieldbus communication fault"],
};

// ─── PDF GENERATOR ───────────────────────────────────────────────────────────
function generatePDFContent(session, lang) {
  const t = T[lang];
  const date = new Date(session.startTime).toLocaleString();
  const lines = [
    `FAULT RESOLVER PRO — DIAGNOSTIC REPORT`,
    `${"=".repeat(50)}`,
    `Date: ${date}`,
    `${t.category}: ${session.categoryLabel}`,
    `${t.brand}: ${session.brandLabel}`,
    `${t.fault}: ${session.faultDescription}`,
    `${t.duration}: ${session.duration} ${t.min}`,
    `${t.steps}: ${Math.floor(session.messages.length / 2)}`,
    `${"=".repeat(50)}`,
    `CONVERSATION LOG:`,
    ``,
    ...session.messages.map(m => `[${m.role.toUpperCase()}]\n${m.content}\n`),
    `${"=".repeat(50)}`,
    `Generated by Fault Resolver Pro`,
  ];
  return lines.join("\n");
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 16px", background: "#1a2332", borderRadius: 8, width: "fit-content", border: "1px solid #2a3a52" }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#f59e0b", animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${i*0.2}s` }} />
      ))}
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 14 }}>
      {!isUser && <div style={{ width: 32, height: 32, borderRadius: 6, background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, marginRight: 10, flexShrink: 0, marginTop: 2 }}>⚡</div>}
      <div style={{ maxWidth: "82%", background: isUser ? "#1e3a5f" : "#111c2d", border: isUser ? "1px solid #2563eb" : "1px solid #1e3a5f", borderRadius: isUser ? "12px 12px 2px 12px" : "12px 12px 12px 2px", padding: "12px 16px", color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "'IBM Plex Mono', monospace" }}>
        {msg.content}
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("en");
  const [screen, setScreen] = useState("home"); // home | brand | category | chat | history
  const [tab, setTab] = useState("home");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionFault, setSessionFault] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [faultHistory, setFaultHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("faultHistory") || "[]"); } catch { return []; }
  });
  const [sessionStart, setSessionStart] = useState(null);
  const [offlineStep, setOfflineStep] = useState(0);
  const [savedToast, setSavedToast] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const bottomRef = useRef(null);
  const t = T[lang];

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  useEffect(() => {
    try { localStorage.setItem("faultHistory", JSON.stringify(faultHistory)); } catch {}
  }, [faultHistory]);

  const saveSession = useCallback((msgs, fault, catLabel, brandLabel, start) => {
    const session = {
      id: Date.now(),
      startTime: start || Date.now(),
      duration: Math.round((Date.now() - (start || Date.now())) / 60000),
      categoryLabel: catLabel,
      brandLabel: brandLabel,
      faultDescription: fault,
      messages: msgs,
      lang,
    };
    setFaultHistory(prev => [session, ...prev.slice(0, 49)]);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  }, [lang]);

  const buildSystemPrompt = () => {
    const brandKnowledge = selectedBrand ? BRAND_KNOWLEDGE[selectedBrand.id] : "";
    return `You are an expert electrical field technician assistant specializing in:
- Energy Distribution (MV/LV switchgear, transformers, feeders, protection relays)
- Electrical Equipment (motors, generators, UPS, power factor correction, VFDs)
- Control & Command Systems (control panels, contactors, relays, wiring)
- PLC / SCADA (Siemens, Allen-Bradley, Schneider, HMI, communication faults)

${brandKnowledge ? `EQUIPMENT BRAND CONTEXT:\n${brandKnowledge}\n` : ""}

LANGUAGE: Respond in ${lang === "en" ? "English" : lang === "fr" ? "French" : lang === "es" ? "Spanish" : "German"}.

You guide field technicians through structured, step-by-step troubleshooting:
1. Always start with SAFETY checks (lockout/tagout, voltage presence, PPE)
2. Ask ONE focused diagnostic question at a time
3. Provide clear, action-oriented instructions
4. Suggest specific measurements (voltages, currents, resistance values, signal states)
5. Reference brand-specific fault codes and tools when relevant
6. Conclude each step with: what to do if YES and what to do if NO
7. When root cause is identified: provide 🎯 DIAGNOSIS and 🔧 CORRECTIVE ACTION

Format each response with:
- 🔴 SAFETY (if applicable at start)
- 🔍 STEP [N]: [Action]
- ✅ IF YES → ...
- ❌ IF NO → ...
- Or 🎯 DIAGNOSIS + 🔧 CORRECTIVE ACTION when fault is found

Keep responses concise and practical for field use.`;
  };

  const startSession = async (faultDescription) => {
    setSessionFault(faultDescription);
    setScreen("chat");
    setMessages([]);
    setOfflineStep(0);
    const start = Date.now();
    setSessionStart(start);
    const userMsg = { role: "user", content: `🔧 FAULT REPORTED: ${faultDescription}` };

    if (!isOnline) {
      // Offline mode
      const tree = OFFLINE_TREES[faultDescription];
      if (tree) {
        const reply = { role: "assistant", content: tree[0] };
        setMessages([userMsg, reply]);
        setOfflineStep(1);
      } else {
        setMessages([userMsg, { role: "assistant", content: `${t.offlineNotice}\n\n🔍 STEP 1: Check safety — apply LOTO, verify zero energy state, wear PPE.\n\nPlease describe your specific observations so far.` }]);
      }
      return;
    }

    setLoading(true);
    setMessages([userMsg]);
    const initialMsg = `Category: ${selectedCategory?.label || ""}\nBrand: ${selectedBrand?.label || "Generic"}\nFault reported: ${faultDescription}\n\nPlease begin the troubleshooting sequence.`;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: buildSystemPrompt(),
          messages: [{ role: "user", content: initialMsg }],
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "Error getting response.";
      const newMsgs = [userMsg, { role: "assistant", content: reply }];
      setMessages(newMsgs);
    } catch {
      setMessages([userMsg, { role: "assistant", content: "⚠️ Connection error. Switching to offline mode.\n\n" + (OFFLINE_TREES[faultDescription]?.[0] || t.offlineNotice) }]);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);

    if (!isOnline) {
      // Offline step progression
      const tree = OFFLINE_TREES[sessionFault];
      if (tree && offlineStep < tree.length) {
        const reply = tree[offlineStep];
        setMessages([...newMessages, { role: "assistant", content: reply }]);
        setOfflineStep(s => s + 1);
      } else {
        setMessages([...newMessages, { role: "assistant", content: "🎯 DIAGNOSIS: End of offline diagnostic tree.\n🔧 CORRECTIVE ACTION: Connect to internet for advanced AI-assisted diagnosis or contact manufacturer support." }]);
        saveSession(newMessages, sessionFault, selectedCategory?.label, selectedBrand?.label, sessionStart);
      }
      return;
    }

    setLoading(true);
    const apiMessages = [
      { role: "user", content: `Category: ${selectedCategory?.label}\nBrand: ${selectedBrand?.label || "Generic"}\nFault: ${sessionFault}\n\nBegin troubleshooting.` },
      ...newMessages.slice(1).map(m => ({ role: m.role, content: m.content })),
    ];
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: buildSystemPrompt(),
          messages: apiMessages,
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "Error.";
      const finalMsgs = [...newMessages, { role: "assistant", content: reply }];
      setMessages(finalMsgs);
      if (reply.includes("🎯") || reply.includes("DIAGNOSIS") || reply.includes("DIAGNOS")) {
        saveSession(finalMsgs, sessionFault, selectedCategory?.label, selectedBrand?.label, sessionStart);
      }
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "⚠️ Connection error." }]);
    }
    setLoading(false);
  };

  const exportPDF = (session) => {
    const content = generatePDFContent(session, session.lang || lang);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fault-report-${new Date(session.startTime).toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCurrentPDF = () => {
    const session = { id: Date.now(), startTime: sessionStart, duration: Math.round((Date.now()-sessionStart)/60000), categoryLabel: selectedCategory?.label, brandLabel: selectedBrand?.label, faultDescription: sessionFault, messages, lang };
    exportPDF(session);
  };

  const reset = () => {
    if (messages.length > 2) saveSession(messages, sessionFault, selectedCategory?.label, selectedBrand?.label, sessionStart);
    setScreen("home"); setTab("home"); setSelectedCategory(null); setSelectedBrand(null);
    setMessages([]); setInput(""); setSessionFault(""); setOfflineStep(0);
  };

  const navigate = (t) => {
    setTab(t);
    if (t === "home") { reset(); }
    else if (t === "history") { setScreen("history"); }
  };

  const categories = CATEGORY_DATA.map(c => ({ ...c, label: t.categories[c.id].label, desc: t.categories[c.id].desc }));

  return (
    <div style={{ minHeight: "100vh", background: "#070d17", color: "#e2e8f0", fontFamily: "'IBM Plex Mono', monospace", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #070d17; } ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }
        @keyframes pulse { 0%,100% { opacity:0.3; transform:scale(0.8); } 50% { opacity:1; transform:scale(1); } }
        @keyframes slideIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes toastIn { from { opacity:0; transform:translateX(100px); } to { opacity:1; transform:translateX(0); } }
        .card:hover { border-color: var(--accent) !important; background: #0d1a2e !important; transform: translateY(-2px); transition: all 0.2s; }
        .btn-ghost:hover { background: #1e3a5f !important; }
        .fault-btn:hover { background: #1e3a5f !important; border-color: #3b82f6 !important; }
        input:focus, textarea:focus { outline: none; border-color: #f59e0b !important; }
        .history-item:hover { background: #0d1a2e !important; }
        .lang-btn:hover { background: #1e3a5f !important; }
      `}</style>

      {/* Toast */}
      {savedToast && (
        <div style={{ position: "fixed", top: 80, right: 16, background: "#10b981", color: "#000", padding: "10px 16px", borderRadius: 8, fontSize: 12, fontFamily: "inherit", zIndex: 1000, animation: "toastIn 0.3s ease" }}>
          {t.sessionSaved}
        </div>
      )}

      {/* Header */}
      <div style={{ background: "#0a1628", borderBottom: "1px solid #1e3a5f", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, background: "#f59e0b", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 2, color: "#f59e0b" }}>{t.appName}</div>
            <div style={{ fontSize: 9, color: "#64748b", letterSpacing: 1 }}>{t.appSub}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Online indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 8px", background: isOnline ? "#0d2a1a" : "#2a1a0d", border: `1px solid ${isOnline ? "#10b981" : "#f59e0b"}`, borderRadius: 20, fontSize: 10, color: isOnline ? "#10b981" : "#f59e0b" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: isOnline ? "#10b981" : "#f59e0b", animation: "pulse 2s infinite" }} />
            {isOnline ? "AI" : "OFF"}
          </div>
          {/* Lang selector */}
          <div style={{ position: "relative" }}>
            <button className="lang-btn" onClick={() => setShowLangMenu(v => !v)} style={{ background: "#0a1628", border: "1px solid #1e3a5f", color: "#94a3b8", padding: "5px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>
              {lang.toUpperCase()} ▾
            </button>
            {showLangMenu && (
              <div style={{ position: "absolute", right: 0, top: "110%", background: "#0a1628", border: "1px solid #1e3a5f", borderRadius: 8, zIndex: 100, overflow: "hidden", minWidth: 100 }}>
                {["en","fr","es","de"].map(l => (
                  <button key={l} onClick={() => { setLang(l); setShowLangMenu(false); }} style={{ display: "block", width: "100%", padding: "8px 14px", background: lang===l ? "#1e3a5f" : "transparent", border: "none", color: "#e2e8f0", fontSize: 12, fontFamily: "inherit", cursor: "pointer", textAlign: "left" }}>
                    {l==="en"?"🇬🇧 English":l==="fr"?"🇫🇷 Français":l==="es"?"🇪🇸 Español":"🇩🇪 Deutsch"}
                  </button>
                ))}
              </div>
            )}
          </div>
          {screen !== "home" && screen !== "history" && (
            <button className="btn-ghost" onClick={reset} style={{ background: "transparent", border: "1px solid #2a3a52", color: "#94a3b8", padding: "5px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>
              {t.newSession}
            </button>
          )}
        </div>
      </div>

      {/* Offline banner */}
      {!isOnline && screen !== "history" && (
        <div style={{ background: "#2a1a0d", borderBottom: "1px solid #f59e0b", padding: "8px 16px", fontSize: 11, color: "#f59e0b", textAlign: "center" }}>
          📡 {t.offlineNotice}
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>

        {/* HOME */}
        {screen === "home" && (
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", maxWidth: 680, margin: "0 auto", width: "100%", animation: "slideIn 0.3s ease" }}>
            <div style={{ marginBottom: 20, padding: "14px 16px", background: "#0a1628", border: "1px solid #1e3a5f", borderRadius: 8, borderLeft: "3px solid #f59e0b" }}>
              <div style={{ fontSize: 11, color: "#f59e0b", letterSpacing: 1, marginBottom: 5 }}>{t.safety}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{t.safetyText}</div>
            </div>

            <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 1, marginBottom: 10 }}>{t.selectBrand}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
              {BRANDS.map(b => (
                <button key={b.id} onClick={() => setSelectedBrand(b)} style={{ padding: "6px 12px", borderRadius: 20, border: `1px solid ${selectedBrand?.id===b.id ? b.color : "#1e3a5f"}`, background: selectedBrand?.id===b.id ? b.color+"22" : "#0a1628", color: selectedBrand?.id===b.id ? b.color : "#94a3b8", fontSize: 11, fontFamily: "inherit", cursor: "pointer", transition: "all 0.15s" }}>
                  {b.label}
                </button>
              ))}
            </div>

            <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 1, marginBottom: 10 }}>{t.selectCategory}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {categories.map(cat => (
                <div key={cat.id} className="card" onClick={() => { setSelectedCategory(cat); setScreen("category"); }}
                  style={{ background: "#0a1628", border: "1px solid #1e3a5f", borderRadius: 10, padding: "16px 14px", cursor: "pointer", "--accent": cat.color }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{cat.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: cat.color, marginBottom: 3 }}>{cat.label}</div>
                  <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.4 }}>{cat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BRAND → CATEGORY FAULTS */}
        {screen === "category" && selectedCategory && (
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", maxWidth: 680, margin: "0 auto", width: "100%", animation: "slideIn 0.3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <span style={{ fontSize: 22 }}>{selectedCategory.icon}</span>
              <div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 2, color: selectedCategory.color }}>{selectedCategory.label}</div>
                {selectedBrand && <div style={{ fontSize: 11, color: selectedBrand.color }}>{selectedBrand.label}</div>}
              </div>
            </div>

            <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 1, marginBottom: 10 }}>{t.commonFaults}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {QUICK_FAULTS[selectedCategory.id].map((fault, i) => (
                <button key={i} className="fault-btn" onClick={() => startSession(fault)} style={{ background: "#0a1628", border: "1px solid #1e3a5f", color: "#cbd5e1", padding: "11px 14px", borderRadius: 8, cursor: "pointer", textAlign: "left", fontSize: 12, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s" }}>
                  <span style={{ color: selectedCategory.color }}>›</span>{fault}
                </button>
              ))}
            </div>

            <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 1, marginBottom: 10 }}>{t.describeFault}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key==="Enter"&&input.trim()) { startSession(input.trim()); setInput(""); } }}
                placeholder={t.faultPlaceholder}
                style={{ flex: 1, background: "#0a1628", border: "1px solid #1e3a5f", borderRadius: 8, padding: "11px 14px", color: "#e2e8f0", fontSize: 12, fontFamily: "inherit" }} />
              <button onClick={() => { if (input.trim()) { startSession(input.trim()); setInput(""); } }}
                style={{ background: selectedCategory.color, border: "none", borderRadius: 8, padding: "0 16px", color: "#000", fontSize: 18, cursor: "pointer", fontWeight: 700 }}>→</button>
            </div>
          </div>
        )}

        {/* CHAT */}
        {screen === "chat" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", maxWidth: 720, margin: "0 auto", width: "100%" }}>
            <div style={{ padding: "8px 16px", background: "#0a1628", borderBottom: "1px solid #1e3a5f", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 11, color: "#64748b", display: "flex", gap: 12, flexWrap: "wrap" }}>
                {selectedCategory && <span style={{ color: selectedCategory.color }}>{selectedCategory.icon} {selectedCategory.label}</span>}
                {selectedBrand && <span style={{ color: selectedBrand.color }}>● {selectedBrand.label}</span>}
              </div>
              <button onClick={exportCurrentPDF} style={{ background: "transparent", border: "1px solid #2a3a52", color: "#94a3b8", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 10, fontFamily: "inherit" }}>
                📄 PDF
              </button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
              {messages.map((msg, i) => <Message key={i} msg={msg} />)}
              {loading && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 6, background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚡</div>
                  <TypingIndicator />
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div style={{ padding: "12px 16px", background: "#0a1628", borderTop: "1px solid #1e3a5f", display: "flex", gap: 8 }}>
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key==="Enter"&&!e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder={t.typeResponse} rows={2}
                style={{ flex: 1, background: "#111c2d", border: "1px solid #1e3a5f", borderRadius: 8, padding: "10px 12px", color: "#e2e8f0", fontSize: 12, fontFamily: "inherit", resize: "none", lineHeight: 1.5 }} />
              <button onClick={sendMessage} disabled={loading || !input.trim()}
                style={{ background: loading||!input.trim() ? "#1e3a5f" : "#f59e0b", border: "none", borderRadius: 8, padding: "0 16px", color: loading ? "#64748b" : "#000", fontSize: 18, cursor: loading ? "not-allowed" : "pointer", fontWeight: 700 }}>↑</button>
            </div>
          </div>
        )}

        {/* HISTORY */}
        {screen === "history" && (
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", maxWidth: 680, margin: "0 auto", width: "100%", animation: "slideIn 0.3s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 2, color: "#f59e0b" }}>{t.history}</div>
              {faultHistory.length > 0 && (
                <button onClick={() => { if (confirm("Clear all history?")) setFaultHistory([]); }}
                  style={{ background: "transparent", border: "1px solid #2a3a52", color: "#64748b", padding: "5px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>
                  {t.clearHistory}
                </button>
              )}
            </div>
            {faultHistory.length === 0 ? (
              <div style={{ textAlign: "center", color: "#64748b", fontSize: 13, marginTop: 60 }}>{t.noHistory}</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {faultHistory.map(session => (
                  <div key={session.id} className="history-item" style={{ background: "#0a1628", border: "1px solid #1e3a5f", borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600, marginBottom: 4 }}>{session.faultDescription}</div>
                        <div style={{ fontSize: 10, color: "#64748b", display: "flex", gap: 12, flexWrap: "wrap" }}>
                          <span>{session.categoryLabel}</span>
                          {session.brandLabel && <span style={{ color: "#94a3b8" }}>● {session.brandLabel}</span>}
                          <span>{new Date(session.startTime).toLocaleDateString()}</span>
                          <span>{session.duration || 0} {t.min}</span>
                          <span>{Math.floor(session.messages.length/2)} {t.steps}</span>
                        </div>
                      </div>
                      <button onClick={() => exportPDF(session)} style={{ background: "#111c2d", border: "1px solid #1e3a5f", color: "#94a3b8", padding: "5px 10px", borderRadius: 6, cursor: "pointer", fontSize: 10, fontFamily: "inherit", flexShrink: 0, marginLeft: 10 }}>
                        📄
                      </button>
                    </div>
                    {session.messages.length > 0 && (
                      <div style={{ fontSize: 11, color: "#475569", borderTop: "1px solid #1e3a5f", paddingTop: 8, lineHeight: 1.4 }}>
                        {session.messages[session.messages.length-1]?.content?.slice(0, 120)}…
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ background: "#0a1628", borderTop: "1px solid #1e3a5f", display: "flex", flexShrink: 0 }}>
        {[{ id: "home", icon: "🏠", label: t.nav.home }, { id: "history", icon: "📋", label: t.nav.history }].map(item => (
          <button key={item.id} onClick={() => navigate(item.id)}
            style={{ flex: 1, background: "transparent", border: "none", color: tab===item.id ? "#f59e0b" : "#64748b", padding: "12px 0 10px", cursor: "pointer", fontFamily: "inherit", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, borderTop: tab===item.id ? "2px solid #f59e0b" : "2px solid transparent" }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span style={{ fontSize: 10, letterSpacing: 0.5 }}>{item.label}</span>
            {item.id === "history" && faultHistory.length > 0 && (
              <span style={{ position: "absolute", marginLeft: 30, marginTop: -18, background: "#f59e0b", color: "#000", borderRadius: 10, fontSize: 9, padding: "1px 5px", fontWeight: 700 }}>{faultHistory.length}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
