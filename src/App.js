import React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

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
  { id: "ge", label: "GE", color: "#003087", logo: "GE" },
  { id: "rockwell", label: "Rockwell / Allen-Bradley", color: "#cc2233", logo: "AB" },
  { id: "eaton", label: "Eaton", color: "#f0a500", logo: "EAT" },
  { id: "legrand", label: "Legrand", color: "#8b1a1a", logo: "LGR" },
  { id: "hitachi", label: "Hitachi Energy", color: "#e60026", logo: "HIT" },
  { id: "samsung", label: "Samsung Corporation", color: "#1428a0", logo: "SAM" },
  { id: "panasonic", label: "Panasonic Holdings", color: "#0033a0", logo: "PAN" },
  { id: "bosch", label: "Bosch / Rexroth", color: "#e20015", logo: "BSH" },
  { id: "mitsubishi", label: "Mitsubishi Electric", color: "#e60012", logo: "MEL" },
  { id: "other", label: "Other / Generic", color: "#64748b", logo: "GEN" },
];

const BRAND_KNOWLEDGE = {
  abb: `ABB-specific context: Reference ABB product lines — REF615/REF630 protection relays, RET615 transformer protection, ACS880/ACS580 drives, MNS/ArTu switchgear, SACE Emax/Tmax breakers, Symphony Plus/800xA SCADA, AC500/AC31 PLCs, UNITROL excitation systems. Mention ABB fault codes (e.g. F####), ABB Ability platform, FENA/FEIP adapter modules, DriveAP tool for ACS drives diagnostics.`,
  schneider: `Schneider Electric-specific context: Reference Easergy P3/P5 relays, Sepam 10/20/40/80 protection relays, Altivar ATV630/ATV930 drives, Masterpact NT/NW/MTZ breakers, Prisma/SM6/RM6 switchgear, Modicon M340/M580/Quantum PLCs, Unity Pro/EcoStruxure Machine Expert software, PowerLogic PM5000 meters, EcoStruxure SCADA Expert. Mention Schneider fault codes and EtherNet/IP, Modbus TCP protocols.`,
  siemens: `Siemens-specific context: Reference SIPROTEC 4/5 protection relays (7SJ, 7UT, 7SA series), SINAMICS G120/S120 drives, SIRIUS 3RW soft starters, SENTRON 3VA/3VL breakers, 8DJH/8DA switchgear, SIMATIC S7-300/400/1200/1500 PLCs, TIA Portal/Step7 programming, WinCC SCADA, PROFIBUS/PROFINET protocols. Reference Siemens fault codes (F####/A####), SINEMA Remote Connect, STARTER/Startdrive commissioning tools.`,
  ge: `GE context: Reference Multilin 350/469/489/745 protection relays, Entelliguard/PowerBreak breakers, AV300/AV900 drives, Vernova grid solutions, GE Mark VI/VIe turbine controls, Proficy iFIX/CIMPLICITY SCADA, PACSystems RX3i/CPE PLCs. Mention GE EnerVista software, GE relay event logs, GARD protective relay analysis.`,
  rockwell: `Rockwell Automation / Allen-Bradley context: Reference ControlLogix/CompactLogix/MicroLogix PLCs, PowerFlex 525/755 drives, SMP-3 motor protection, CENTERLINE MCC, Studio 5000/RSLogix 5000 programming, FactoryTalk View SCADA, DeviceNet/EtherNet/IP protocols. Mention RSLinx diagnostics, add-on instructions (AOI), controller fault codes (Major/Minor faults), tag-based I/O.`,
  eaton: `Eaton context: Reference Eaton IQ relays, xEnergy/NZM/IZM breakers, SPX/SVX drives, Freedom/Digitrip MCC, PowerXpert SCADA, XC100/XC200 PLCs. Mention Eaton's arc flash protection solutions and Power Xpert software.`,
  hitachi: `Hitachi Energy context: Reference Hitachi Energy (formerly ABB Power Grids) product lines — SR750/SR760 protection relays, Hitachi SJ700/WJ200 drives, H-series inverters, Hitachi Energy SCADA (Ellipse/Lumada), EH-150/EH-300 PLCs, Hitachi switchgear and transformer solutions. Mention Hitachi Energy TXpert digital transformers, Grid Automation portfolio, and MACH control system for substations.`,
  samsung: `Samsung Corporation context: Reference Samsung SDI battery systems and ESS (Energy Storage Systems), Samsung C&T electrical infrastructure projects, Samsung SDI lithium-ion battery modules for UPS and grid storage. Mention Samsung BMS (Battery Management System) fault codes, SDI cell balancing diagnostics, and ESS communication protocols (CAN, Modbus). For industrial drives and controls, reference Samsung-affiliated partners.`,
  panasonic: `Panasonic Holdings context: Reference Panasonic MINAS A6/A5 servo drives and motors, FP0R/FP-X/FP7 PLC series, Panasonic BH/BBW circuit breakers, SUNX/Panasonic Industrial sensors (EX, CX, FX series), Panasonic relay modules (HF, HY, HN series), GT/FPWIN Pro programming software. Mention Panasonic ID network, MEWTOCOL Modbus protocol, servo tuning via PANATERM software.`,
  bosch: `Bosch / Rexroth context: Reference Bosch Rexroth IndraDrive C/M/CS/Mi series drives, Indramat legacy servo systems, ctrlX AUTOMATION platform, MTX CNC controls, IndraCL motion controllers, Rexroth Sytronix hydraulic drives. Mention Rexroth IndraWorks engineering software, SERCOS/PROFINET/EtherNet-IP protocols, Bosch Building Technologies fire/security panels, Bosch Rexroth diagnostic codes (F#### / E####).`,
  mitsubishi: `Mitsubishi Electric context: Reference MELSEC iQ-R/iQ-F/Q/L/FX PLC series, GOT2000/GOT1000 HMI series, FREQROL FR-A800/F800/E800 VFDs, MELSERVO MR-J4/MR-J5 servo drives, MELPRO-D/A protection relays, MELSECnet/CC-Link/CC-Link IE Field/IE Control network protocols. Mention GX Works3/GX Works2 programming software, FR Configurator2 for drives, EcoMonitorLight energy metering, and Mitsubishi fault codes (Err.####, ALM####).`,
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

// ─── ENGINEERING TOOLS ───────────────────────────────────────────────────────
const TOOLS = [
  { id: "swl",  icon: "📐", label: "Single-Wire Scheme (LV/MV/HV)",            group: "design",     color: "#f59e0b" },
  { id: "mwl",  icon: "📋", label: "Multi-Wire Scheme (LV/MV/HV)",             group: "design",     color: "#f59e0b" },
  { id: "mwa",  icon: "🔍", label: "Multi-Wire Scheme Analysis",                group: "analysis",   color: "#3b82f6" },
  { id: "ccd",  icon: "🔌", label: "Conductor & Cable Dimensioning",            group: "dimension",  color: "#10b981" },
  { id: "dcd",  icon: "⚙️",  label: "Device & Component Dimensioning",          group: "dimension",  color: "#10b981" },
  { id: "pb",   icon: "⚖️",  label: "Power Balance Calculation",                group: "calc",       color: "#8b5cf6" },
  { id: "vd",   icon: "📉", label: "Voltage Drop (1ph & 3ph)",                  group: "calc",       color: "#8b5cf6" },
  { id: "sc1",  icon: "⚡", label: "Short-Circuit Current (1ph)",               group: "calc",       color: "#8b5cf6" },
  { id: "sc3",  icon: "⚡", label: "Short-Circuit Current (3ph LV/MV/HV)",      group: "calc",       color: "#8b5cf6" },
  { id: "li",   icon: "💡", label: "Lighting Installation Calculation",          group: "calc",       color: "#8b5cf6" },
  { id: "gn",   icon: "🌍", label: "Grounding Network Calculation",             group: "calc",       color: "#8b5cf6" },
  { id: "frt",  icon: "🌊", label: "Francis Turbine Generator — Defects & Repair", group: "hydro",  color: "#06b6d4" },
  { id: "kpt",  icon: "🌊", label: "Kaplan Turbine Generator — Defects & Repair",  group: "hydro",  color: "#06b6d4" },
];

const TOOL_GROUPS = {
  design:    { label: "⚙️ SCHEMATIC DESIGN",      color: "#f59e0b" },
  analysis:  { label: "🔍 SCHEME ANALYSIS",        color: "#3b82f6" },
  dimension: { label: "📏 DIMENSIONING",           color: "#10b981" },
  calc:      { label: "🧮 CALCULATIONS",           color: "#8b5cf6" },
  hydro:     { label: "🌊 HYDRO GENERATORS",       color: "#06b6d4" },
};

const TOOL_PROMPTS = {
  swl: `You are an expert electrical design engineer specializing in single-line diagrams (SLD) for LV (≤1kV), MV (1–36kV), and HV (>36kV) networks, following IEC 60617 and IEC 61082 standards.
Start by asking the user for: voltage level, number of feeders/transformers, total installed power, type of loads, protection requirements (overcurrent, earth fault, differential), and any special requirements (emergency supply, bus coupler, metering).
Then generate a complete SLD using structured ASCII notation with:
- Power sources (utility, transformer, generator) at the top
- Main busbar(s) clearly labelled with voltage
- Each feeder on a separate branch with breaker, fuse or disconnector symbol
- Protection device references (e.g. 51, 50, 87T, 27, 59) per IEC 60617
- Measurement points (CT, VT, kWh meter)
- Equipment designations per IEC 81346
End with a bill of materials table (item, reference, rating, qty).`,

  mwl: `You are an expert electrical design engineer specializing in multi-wire (detailed wiring) diagrams following IEC 60617, IEC 61082, and EN 81346 standards.
Start by asking the user for: circuit type (power circuit / control circuit / both), voltage levels (e.g. 400V AC / 24VDC), list of components required (motor, contactor, relay, PLC I/O, pushbuttons, etc.), interlocking requirements, and safety circuit requirements (E-stop, safety relay).
Then generate:
- Power circuit diagram with terminals, wire numbers, and cable references
- Control circuit diagram with all contacts, coils, and auxiliary circuits
- Terminal strip layout (X1:1, X1:2…)
- Wire numbering per IEC 60204
- Component designation list (K1, F1, S1, etc.)
Keep the layout structured top-to-bottom, L1→L2→L3→N→PE for power; L+/L- for DC control.`,

  mwa: `You are an expert electrical engineer specializing in verification and analysis of multi-wire electrical diagrams following IEC 60204, IEC 60364, and EN 81346.
Ask the user to describe the circuit or paste its textual description (component list, connections, wire numbers). Then systematically analyze for:
1. Protection coordination (correct fuse/breaker ratings vs load)
2. Interlock logic integrity (NO/NC contact usage, self-holding circuits)
3. Safety circuit completeness (E-stop loop, safety relay category per ISO 13849)
4. Missing or duplicated wire numbers
5. Incorrect coil voltages or contact ratings
6. PE/ground continuity
7. Missing surge suppressors on coils
8. Compliance with IEC 60204-1
Provide a structured ANALYSIS REPORT with: ✅ OK items, ⚠️ WARNINGS, ❌ ERRORS, and 🔧 CORRECTIVE ACTIONS for each finding.`,

  ccd: `You are an expert electrical engineer for conductor and cable sizing following IEC 60364-5-52, HD 60364, and NF C 15-100.
Ask the user for: load type and power (kW) or current (A), voltage (1ph 230V / 3ph 400V), power factor, installation method (A1/A2/B1/B2/C/D1/D2/E/F per IEC 60364-5-52 Table B.52.1), ambient temperature (°C), number of grouped circuits, cable material (Cu or Al), insulation type (PVC/XLPE/EPR), circuit length (m).
Then calculate step by step:
1. Load current In (A)
2. Correction factors (Ct temperature, Cg grouping, Ci insulation)
3. Required current capacity Iz = In / (Ct × Cg × Ci)
4. Selected cross-section from IEC table (mm²)
5. Voltage drop ΔU (V and %) — verify ≤3% lighting, ≤5% other
6. Short-circuit thermal withstand: minimum S = I_cc × √t / k (mm²)
7. Protection device rating recommendation
Present results in a clear table.`,

  dcd: `You are an expert electrical engineer for selection and sizing of protection devices and electrical components per IEC 60947, IEC 60898, and IEC 60364.
Ask the user for: load type (motor / resistive / lighting / capacitor bank / mixed), rated power (kW) and voltage, starting method (DOL / star-delta / soft starter / VFD), power factor, upstream supply Icc (kA), coordination requirement (selectivity / back-up).
Then size and recommend:
1. Main contactor (AC-3 rating, thermal current)
2. Motor protection relay or overload relay (class 10/20, setting range)
3. Circuit breaker (In, Icn breaking capacity, trip curve B/C/D)
4. Fuse (type gG/gM, rating)
5. Soft starter or VFD parameters if applicable
6. Busbar rating if applicable
Show calculation for each device with standard reference. Flag any selectivity conflicts between upstream and downstream devices.`,

  pb: `You are an expert electrical engineer for power balance calculations per IEC 60364 and IEC 60076.
Ask the user to provide a load list with for each load: name, rated power (kW), voltage (1ph/3ph), power factor (cos φ), demand factor (%), simultaneity factor (%). Also ask for supply type (utility / transformer / generator) and voltage level.
Then calculate:
1. Active power per load: P = Prated × Kd × Ks
2. Reactive power per load: Q = P × tan(arccos φ)
3. Totals: ΣP (kW), ΣQ (kVAR), ΣS (kVA)
4. Overall power factor
5. Recommended transformer rating (kVA) with 20% margin
6. Recommended generator rating (kVA) with 25% margin and starting kVA surge
7. Power factor correction capacitor bank sizing (to reach target cos φ ≥ 0.92)
Present a full load schedule table + summary.`,

  vd: `You are an expert electrical engineer for voltage drop calculation in single-phase and three-phase LV networks per IEC 60364-5-52 and NF C 15-100 appendix C.
Ask the user for: circuit type (1ph 2-wire / 3ph 3-wire / 3ph 4-wire), supply voltage (V), conductor material (Cu/Al), cross-section (mm²), circuit length (m), load current (A) or power (kW) + cos φ.
Calculate using the formula:
- 1ph: ΔU = (2 × L × I × (R·cosφ + X·sinφ)) / 1000
- 3ph: ΔU = (√3 × L × I × (R·cosφ + X·sinφ)) / 1000
Where R = ρ/S (Ω/km), X ≈ 0.08 Ω/km (cables) or 0.35 Ω/km (overhead lines).
Present: ΔU in volts, ΔU%, compliance check (≤3% lighting / ≤5% force / ≤8% total from source), and recommended cross-section upgrade if non-compliant.`,

  sc1: `You are an expert electrical engineer for single-phase short-circuit current calculations per IEC 60909 and NF C 15-100.
Ask the user for: supply voltage (V), upstream three-phase Icc or source impedance (Zs), transformer rating (kVA) and Ucc%, phase and neutral conductor cross-section (mm²) and material (Cu/Al), circuit length (m), cable installation method.
Calculate:
1. Transformer impedance: Zt = (Ucc% × U²) / (100 × Sn)
2. Cable impedance: Zc = ρ × L / S (for phase + neutral loop)
3. Maximum Icc (at origin): Icc_max = U / (√3 × Zt)
4. Minimum Icc (end of circuit, 1ph): Icc_min = 0.8 × U / (2 × Zc + Zt/3)
5. Check protection device breaking capacity ≥ Icc_max
6. Check cable thermal withstand: S_min = Icc × √t / k
Flag any non-compliance and recommend corrective actions.`,

  sc3: `You are an expert electrical engineer for three-phase short-circuit current calculations in LV (≤1kV), MV (1–36kV), and HV (>36kV) networks per IEC 60909.
Ask the user for: network voltage (kV), short-circuit power at PCC (MVA) or source impedance, transformer(s) rating (MVA/kVA) and Ucc%, cable/line parameters (length, cross-section, impedance per km), any in-feed generators (MVA, X''d%).
Calculate applying IEC 60909 impedance correction factors (KT, KG, KS):
1. Initial symmetrical short-circuit current I''k3 (kA rms)
2. Peak current ip = κ × √2 × I''k3
3. Breaking current Ib (accounting for motor contribution decay)
4. Thermal equivalent current Ith = I''k3 × √(1 + m + n)
Provide results at each network node (HV busbar, MV busbar, LV busbar). Recommend equipment ratings (breaker Icw, cable Ith withstand).`,

  li: `You are an expert lighting design engineer per EN 12464-1 (indoor workplaces) and EN 13201 (outdoor/road lighting).
Ask the user for: room or area type (office / workshop / corridor / warehouse / outdoor road), dimensions (L × W × H in metres), ceiling/wall/floor reflectances (%), required maintained illuminance Em (lux) per EN 12464-1 Table, luminaire type (LED, fluorescent), luminaire luminous flux (lm), luminaire efficiency (LOR), mounting height (m), maintenance factor MF (typically 0.67–0.80).
Calculate using the Lumen Method:
1. Room index: RI = (L × W) / (Hm × (L + W))
2. Utilisation factor UF from table (based on RI and reflectances)
3. Number of luminaires: N = (Em × A) / (Φ × UF × MF)
4. Uniformity check: Uo = Emin/Em ≥ 0.40 (general) or 0.60 (task area)
5. Installed power density: W/m²
6. Luminaire layout recommendation (rows × columns, spacing/height ratio ≤ 1.5)
Verify compliance with EN 12464-1 requirements.`,

  gn: `You are an expert electrical engineer for earthing and grounding system design per IEC 60364-5-54, IEC 62305-3, and IEEE Std 80.
Ask the user for: installation type (building LV / substation MV-HV / lightning protection), soil resistivity ρ (Ω·m) measured or estimated, maximum earth fault current If (A) and fault clearing time (s), allowable touch voltage (≤50V AC per IEC 60364), electrode type preferred (vertical rod / horizontal strip / ring conductor / mesh grid).
Calculate:
1. Required earth resistance: Re ≤ Vc / If
2. Single vertical rod resistance: R = (ρ / 2πL) × (ln(4L/d) − 1)
3. Horizontal strip/ring: R = (ρ / 2πL) × ln(2L²/ah)
4. Mesh grid (IEEE 80): Rm, step voltage Es, touch voltage Et
5. Number of electrodes in parallel to achieve Re target
6. Ground potential rise GPR = If × Re — flag if GPR > 1000V (MV/HV sites)
7. Equipotential bonding requirements
Provide electrode configuration drawing in ASCII and bill of materials.`,

  frt: `You are an expert electrical and mechanical engineer specializing in hydroelectric synchronous generators driven by Francis turbines, following IEC 60034 (rotating machines) and IEC 60193 (hydraulic turbines).
Guide the user through structured diagnosis and repair of Francis turbine generator defects. Cover all systems:
ELECTRICAL: stator winding insulation breakdown (turn-to-turn, phase-to-ground, phase-to-phase), stator core lamination faults, rotor field winding short circuits, slip ring and brush gear wear, excitation system faults (AVR, diodes, thyristors), protection relay misoperation (87G differential, 40 loss of excitation, 21 impedance, 59/27 over-undervoltage, 81 frequency).
MECHANICAL: guide bearing wear (radial bearings — upper, lower, turbine-side), thrust bearing overheating, shaft runout and misalignment, rotor pole looseness or imbalance, stator frame vibration, cooling system faults (air/water heat exchangers), labyrinth seal leakage.
HYDRAULIC: runner blade cavitation damage, wicket gate (guide vane) servo fault, governor regulation instability, draft tube pressure pulsation, spiral casing leakage.
For each reported defect: provide 🔴 SAFETY precautions, 🔍 DIAGNOSTIC STEPS with measurements, 🎯 ROOT CAUSE identification, and 🔧 CORRECTIVE ACTION with IEC reference where applicable.`,

  kpt: `You are an expert electrical and mechanical engineer specializing in hydroelectric synchronous generators driven by Kaplan (adjustable-blade axial-flow) turbines, following IEC 60034 and IEC 60193 standards.
Guide the user through structured diagnosis and repair of Kaplan turbine generator defects. Cover all systems:
ELECTRICAL: stator winding insulation faults (end-winding vibration damage specific to Kaplan vertical-shaft machines), rotor winding and pole connection faults, excitation system faults, slip ring and brush gear, protection relay misoperation (87G, 40, 32 reverse power, 78 out-of-step).
MECHANICAL: axial thrust bearing faults (critical on Kaplan — combined hydraulic + weight thrust load), upper and lower guide bearings, shaft seal water system faults, rotor/stator air gap uniformity (Kaplan large-diameter rotors), rotor pole locking, vibration from runner imbalance.
HYDRAULIC (Kaplan-specific): runner blade pitch control mechanism faults (hydraulic servo actuator inside hub, blade trunnion bearing seizure, oil pressure unit faults, position feedback sensor faults, blade angle vs guide vane angle cam relationship), hub seal ring leakage (internal oil contamination of water passage), cavitation on runner blades due to incorrect blade/gate combination, governor stability and combined regulation (blade + gate simultaneous control).
For each reported defect: provide 🔴 SAFETY precautions, 🔍 DIAGNOSTIC STEPS with measurements, 🎯 ROOT CAUSE identification, and 🔧 CORRECTIVE ACTION with IEC/IEC 60193 reference where applicable.`,
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
  const [selectedTool, setSelectedTool] = useState(null);
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
  if (selectedTool) {
    return TOOL_PROMPTS[selectedTool.id] + `\n\nLANGUAGE: Respond in ${lang === "en" ? "English" : lang === "fr" ? "French" : lang === "es" ? "Spanish" : "German"}.`;
  }
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

const startToolSession = async (tool) => {
  setSelectedTool(tool);
  setScreen("chat");
  setMessages([]);
  setSessionFault(tool.label);
  const start = Date.now();
  setSessionStart(start);
  const userMsg = { role: "user", content: `🛠️ TOOL: ${tool.label}` };
  setLoading(true);
  setMessages([userMsg]);
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: TOOL_PROMPTS[tool.id] + `\n\nLANGUAGE: Respond in ${lang === "en" ? "English" : lang === "fr" ? "French" : lang === "es" ? "Spanish" : "German"}.`,
        messages: [{ role: "user", content: `Start the ${tool.label} tool. Greet the user briefly and ask for the first required inputs.` }],
      }),
    });
    const data = await res.json();
    const reply = data.content?.map(b => b.text || "").join("") || "Error getting response.";
    setMessages([userMsg, { role: "assistant", content: reply }]);
  } catch {
    setMessages([userMsg, { role: "assistant", content: "⚠️ Connection error. This tool requires internet connection." }]);
  }
  setLoading(false);
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
    setMessages([]); setInput(""); setSessionFault(""); setOfflineStep(0); setSelectedTool(null);
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

        {/* LEFT — logo + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.png" alt="INTrouble" style={{ height: 55, borderRadius: 6 }} />
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 2, color: "#f59e0b" }}>{t.appName}</div>
            <div style={{ fontSize: 9, color: "#64748b", letterSpacing: 1 }}>{t.appSub}</div>
          </div>
        </div>

        {/* RIGHT — buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button style={{ background: "transparent", border: "1px solid #f59e0b", color: "#f59e0b", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>
            🔐 Login
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 8px", background: isOnline ? "#0d2a1a" : "#2a1a0d", border: `1px solid ${isOnline ? "#10b981" : "#f59e0b"}`, borderRadius: 20, fontSize: 10, color: isOnline ? "#10b981" : "#f59e0b" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: isOnline ? "#10b981" : "#f59e0b", animation: "pulse 2s infinite" }} />
            {isOnline ? "AI" : "OFF"}
          </div>
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
{/* TOOLS */}
{screen === "tools" && (
  <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", maxWidth: 680, margin: "0 auto", width: "100%", animation: "slideIn 0.3s ease" }}>
    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 2, color: "#f59e0b", marginBottom: 18 }}>🛠️ ENGINEERING TOOLS</div>
    {Object.entries(TOOL_GROUPS).map(([groupId, group]) => {
     const groupTools = TOOLS.filter(tool => tool.group === groupId);
      return (
        <div key={groupId} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: group.color, letterSpacing: 1, marginBottom: 8, borderBottom: `1px solid ${group.color}22`, paddingBottom: 4 }}>{group.label}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {groupTools.map(tool => (
              <button key={tool.id} className="fault-btn" onClick={() => startToolSession(tool)}
                style={{ background: "#0a1628", border: "1px solid #1e3a5f", color: "#cbd5e1", padding: "11px 14px", borderRadius: 8, cursor: "pointer", textAlign: "left", fontSize: 12, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 10, transition: "all 0.15s" }}>
                <span style={{ fontSize: 16 }}>{tool.icon}</span>
                <span style={{ color: tool.color, marginRight: 4 }}>›</span>
                {tool.label}
              </button>
            ))}
          </div>
        </div>
      );
    })}
  </div>
)}
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
  {[
    { id: "home",    icon: "🏠", label: t.nav.home },
    { id: "tools",   icon: "🛠️", label: "Tools" },
    { id: "history", icon: "📋", label: t.nav.history },
  ].map(item => (
    <button key={item.id} onClick={() => {
      setTab(item.id);
      if (item.id === "home") { reset(); }
      else if (item.id === "tools") { reset(); setScreen("tools"); setTab("tools"); }
      else if (item.id === "history") { setScreen("history"); }
    }}
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
