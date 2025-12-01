import { useState, useEffect, useMemo, memo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Ambulance, Flame, Building2, ShieldAlert, LogOut, ZoomIn, ZoomOut, RotateCcw, Radio, Siren, CheckCircle } from 'lucide-react'

// ==========================================
// 1. CONFIGURATION & MOCK DATA
// ==========================================
const CONFIG = {
  GRID_SIZE: 25,
  CELL_SIZE: 60,
  STREET_GAP: 8,
  ANIMATION_SPEED_MS: 800,
  BUILDING_DENSITY: 0.1, // Increased slightly for look
  TOWER_CHANCE: 0.25,
  EXTRUSION_FACTOR: 3,
}

const BLOCK_SIZE = CONFIG.CELL_SIZE - CONFIG.STREET_GAP
const BLOCK_OFFSET = CONFIG.STREET_GAP / 2

// Defined here so the Generator knows where NOT to put buildings
const INITIAL_STATIONS = [
  { id: 's1', x: 2, y: 2, name: 'Main HQ', type: 'hq' },
  { id: 's2', x: 20, y: 4, name: 'North Precinct', type: 'police' },
  { id: 's3', x: 5, y: 20, name: 'Fire Station 5', type: 'fire' }
]

// ==========================================
// 2. MOCK API
// ==========================================
const mockApi = {
  resolveIncident: (vehicleId, incidentId) => {
    return new Promise((resolve) => {
      console.log(`[API] 📡 Transmitting: Unit ${vehicleId} reached Incident ${incidentId}...`)
      setTimeout(() => {
        console.log(`[API] ✅ Confirmed: Incident ${incidentId} resolved.`)
        resolve({ status: 200, message: 'Incident Cleared' })
      }, 1500) // Simulate network latency
    })
  }
}

// ==========================================
// 3. HELPER FUNCTIONS
// ==========================================
const toPixels = (x, y) => ({
  x: x * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2,
  y: y * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2,
})

// Modified to accept occupied coordinates
const generateCityLayout = (stations) => {
  const buildings = []
  
  // Create a Set of "x,y" strings for O(1) lookup of station locations
  const occupiedCoords = new Set(stations.map(s => `${s.x},${s.y}`))

  for (let y = 0; y < CONFIG.GRID_SIZE; y++) {
    for (let x = 0; x < CONFIG.GRID_SIZE; x++) {
      // 1. Check Collision with Stations
      if (occupiedCoords.has(`${x},${y}`)) continue;

      // 2. Random Generation
      if (Math.random() < CONFIG.BUILDING_DENSITY) {
        // Keep center somewhat clear for roads/action
        if (x > 8 && x < 16 && y > 8 && y < 16 && Math.random() > 0.1) continue 

        const isTower = Math.random() < CONFIG.TOWER_CHANCE
        const height = isTower ? Math.floor(Math.random() * 4) + 3 : Math.floor(Math.random() * 2) + 1
        const variant = Math.floor(Math.random() * 3)

        buildings.push({ id: `bld-${x}-${y}`, x, y, height, variant, isTower })
      }
    }
  }
  // Sort for correct Z-index rendering (Painter's Algorithm)
  buildings.sort((a, b) => (a.y - b.y) || (a.x - b.x))
  return { buildings }
}

// ==========================================
// 4. SUB-COMPONENTS
// ==========================================
const BuildingNeon3D = memo(({ b }) => {
  const xBase = b.x * CONFIG.CELL_SIZE + BLOCK_OFFSET
  const yBase = b.y * CONFIG.CELL_SIZE + BLOCK_OFFSET
  const w = BLOCK_SIZE
  const h = BLOCK_SIZE
  const extrusion = b.height * CONFIG.EXTRUSION_FACTOR
  const roofY = yBase - extrusion
  const strokeColor = b.isTower ? '#22d3ee' : '#1e40af'
  const fill = "#050b14"

  return (
    <g className="building-3d group hover:opacity-100 transition-opacity duration-300">
      <rect x={xBase} y={yBase} width={w} height={h} className="fill-black opacity-40" />
      <path d={`M ${xBase},${yBase + h} L ${xBase + w},${yBase + h} L ${xBase + w},${roofY + h} L ${xBase},${roofY + h} Z`} fill={fill} stroke={strokeColor} className="opacity-80" />
      <path d={`M ${xBase + w},${yBase + h} L ${xBase + w + (extrusion/3)},${yBase + h - (extrusion/3)} L ${xBase + w + (extrusion/3)},${roofY + h - (extrusion/3)} L ${xBase + w},${roofY + h} Z`} fill="#020408" stroke={strokeColor} className="opacity-60" />
      <rect x={xBase} y={roofY} width={w} height={h} fill={fill} stroke={strokeColor} className="group-hover:stroke-white transition-colors" />
      {b.variant === 1 && <rect x={xBase} y={roofY} width={w} height={h} fill="url(#roof-vents)" opacity="0.3" />}
      {b.variant === 2 && <rect x={xBase} y={roofY} width={w} height={h} fill="url(#roof-grid)" opacity="0.4" />}
      {b.isTower && (
        <g>
           <line x1={xBase + w/2} y1={roofY + h/2} x2={xBase + w/2} y2={roofY - 15} className="stroke-cyan-400 stroke-2" />
           <circle cx={xBase + w/2} cy={roofY - 15} r="2" className="fill-white animate-pulse" />
        </g>
      )}
    </g>
  )
})

const StationMarker = memo(({ s }) => {
  const xBase = s.x * CONFIG.CELL_SIZE + BLOCK_OFFSET
  const yBase = s.y * CONFIG.CELL_SIZE + BLOCK_OFFSET
  const w = BLOCK_SIZE
  const h = BLOCK_SIZE
  const roofY = yBase - 20 

  return (
    <g className="cursor-pointer group">
      <rect x={xBase} y={yBase} width={w} height={h} className="fill-black opacity-60" />
      <path d={`M ${xBase},${yBase + h} L ${xBase + w},${yBase + h} L ${xBase + w},${roofY + h} L ${xBase},${roofY + h} Z`} fill="#1a1205" stroke="#f59e0b" strokeWidth="1.5" />
      <path d={`M ${xBase + w},${yBase + h} L ${xBase + w + 10},${yBase + h - 10} L ${xBase + w + 10},${roofY + h - 10} L ${xBase + w},${roofY + h} Z`} fill="#1a1205" stroke="#f59e0b" strokeWidth="1.5" className="opacity-60" />
      <rect x={xBase} y={roofY} width={w} height={h} fill="#291b05" stroke="#f59e0b" strokeWidth="1.5" />
      <g transform={`translate(${xBase + w/2}, ${roofY - 15})`} className="group-hover:-translate-y-4 transition-transform duration-300">
        <circle r={18} className="fill-amber-500/10 stroke-amber-500/30 animate-ping" />
        <circle r={14} className="fill-[#0f0a02] stroke-amber-500 stroke-1" />
        <g transform="translate(-10, -10)">
          {s.type === 'hq' && <Building2 className="text-amber-400" size={20} />}
          {s.type === 'police' && <Siren className="text-blue-400" size={20} />}
          {s.type === 'fire' && <Flame className="text-red-400" size={20} />}
          {!s.type && <Radio className="text-amber-400" size={20} />}
        </g>
      </g>
      <text x={xBase + w/2} y={yBase + h + 20} className="text-[10px] fill-amber-400 font-bold uppercase text-center opacity-0 group-hover:opacity-100 transition-opacity" textAnchor="middle">{s.name}</text>
    </g>
  )
})

// ==========================================
// 5. MAIN DISPATCH SYSTEM
// ==========================================
export default function DispatchSystem() {
  // State
  const [layout, setLayout] = useState({ buildings: [] })
  const [vehicles, setVehicles] = useState([])
  const [incidents, setIncidents] = useState([])
  const [stations] = useState(INITIAL_STATIONS)
  const [apiLogs, setApiLogs] = useState([]) // For visual feedback of API calls
  
  // Viewport
  const [view, setView] = useState({ x: -100, y: -100, k: 0.8 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const navigate = useNavigate()

  // --- INIT ---
  useEffect(() => {
    // Pass stations to generator to prevent overlap
    setLayout(generateCityLayout(stations))

    setIncidents([{ id: 'i1', x: 12, y: 12, type: 'fire' }, { id: 'i2', x: 18, y: 6, type: 'medical' }])
    
    setVehicles([
      { 
        id: 'v1', type: 'ambulance', currentPos: { x: 2, y: 2 }, targetIncidentId: 'i1', status: 'moving',
        path: [{x:2,y:2},{x:3,y:2},{x:4,y:2},{x:5,y:2},{x:6,y:2},{x:7,y:2},{x:8,y:2},{x:9,y:2},{x:10,y:2},{x:11,y:2},{x:12,y:2},{x:12,y:3},{x:12,y:4},{x:12,y:5},{x:12,y:6},{x:12,y:7},{x:12,y:8},{x:12,y:9},{x:12,y:10},{x:12,y:11},{x:12,y:12}],
        pathIndex: 0
      },
      {
        id: 'v2', type: 'police', currentPos: { x: 20, y: 4 }, targetIncidentId: 'i2', status: 'moving',
        path: [{x:20,y:4},{x:19,y:4},{x:18,y:4},{x:18,y:5},{x:18,y:6}],
        pathIndex: 0
      }
    ])
  }, [stations])

  // --- SIMULATION LOOP & API TRIGGER ---
  useEffect(() => {
    const tick = setInterval(() => {
      setVehicles(prevVehicles => {
        return prevVehicles.map(v => {
          // If already arrived, do nothing
          if (v.status !== 'moving') return v

          // Check if vehicle has reached destination
          if (v.pathIndex >= v.path.length - 1) {
            
            // TRIGGER API (Side Effect inside Logic)
            handleVehicleArrival(v)
            
            return { 
              ...v, 
              status: 'arrived', 
              currentPos: v.path[v.path.length - 1] 
            }
          }

          // Otherwise, move to next step
          return { 
            ...v, 
            pathIndex: v.pathIndex + 1, 
            currentPos: v.path[v.pathIndex + 1] 
          }
        })
      })
    }, CONFIG.ANIMATION_SPEED_MS)

    return () => clearInterval(tick)
  }, [])

  // --- HANDLERS ---
  const handleVehicleArrival = async (vehicle) => {
    // 1. Log to UI
    setApiLogs(prev => [`Unit ${vehicle.id} arrived. Syncing...`, ...prev].slice(0,3))

    // 2. Call Mock API
    try {
      await mockApi.resolveIncident(vehicle.id, vehicle.targetIncidentId)
      
      // 3. Update State on Success (Remove Incident)
      setIncidents(prev => prev.filter(i => i.id !== vehicle.targetIncidentId))
      setApiLogs(prev => [`Incident ${vehicle.targetIncidentId} CLEARED.`, ...prev].slice(0,3))
      
    } catch (error) {
      console.error("API Error", error)
    }
  }

  const handleWheel = (e) => {
    e.preventDefault()
    setView(prev => ({ ...prev, k: Math.min(Math.max(0.4, prev.k - e.deltaY * 0.001), 2.5) }))
  }

  // --- RENDER HELPERS ---
  const renderPath = (v) => {
    if (v.status !== 'moving') return null
    const d = v.path.map((p, i) => {
      const pix = toPixels(p.x, p.y)
      return `${i===0?'M':'L'} ${pix.x} ${pix.y}`
    }).join(' ')
    return <path key={`path-${v.id}`} d={d} className="fill-none stroke-cyan-500/30 stroke-2 stroke-dasharray-[4,4] animate-pulse" />
  }

  // Calculated stats for the Header
  const activeUnitCount = vehicles.filter(v => v.status === 'moving').length
  const activeIncidentCount = incidents.length

  return (
    <div className="h-screen w-screen bg-[#050b14] bg-[radial-gradient(circle_at_center,_#0c162d_0%,_#050b14_100%)] flex flex-col overflow-hidden font-mono text-cyan-100">
      
      {/* HEADER */}
      <div className="absolute top-0 left-0 w-full z-20 pointer-events-none border-b border-blue-900/50 bg-[#050b14]/80 backdrop-blur-sm p-4 flex justify-between items-center">
        <div className="flex items-center gap-3 pointer-events-auto">
          <ShieldAlert className="text-cyan-400 animate-pulse" size={24} />
          <div>
            <h1 className="text-xl font-bold tracking-[0.2em] text-cyan-400 shadow-cyan-500/50 text-shadow">DISPATCH // COMMAND</h1>
            <div className="text-[10px] text-blue-400 flex gap-4 mt-1">
              <span className="flex items-center gap-1"><Radio size={10} /> ACTIVE UNITS: {activeUnitCount}</span>
              <span className="flex items-center gap-1"><Flame size={10} /> PENDING INCIDENTS: {activeIncidentCount}</span>
            </div>
          </div>
        </div>
        
        {/* API Logs Display */}
        <div className="hidden md:flex flex-col items-end mr-4">
           {apiLogs.map((log, i) => (
             <span key={i} className="text-[10px] text-emerald-400/80">{log}</span>
           ))}
        </div>

        <button onClick={() => navigate('/')} className="pointer-events-auto flex items-center gap-2 px-3 py-1 bg-red-900/20 border border-red-800 text-red-400 text-xs rounded uppercase tracking-wider">
          <LogOut size={12} /> Abort
        </button>
      </div>

      {/* CONTROLS */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2 pointer-events-auto">
        <div className="bg-[#0c162d] border border-blue-800 p-1 rounded-md flex flex-col gap-1 shadow-lg">
          <button onClick={() => setView(v => ({...v, k: v.k + 0.2}))} className="p-2 hover:bg-blue-900/50 text-cyan-400"><ZoomIn size={18}/></button>
          <button onClick={() => setView(v => ({...v, k: Math.max(0.4, v.k - 0.2)}))} className="p-2 hover:bg-blue-900/50 text-cyan-400"><ZoomOut size={18}/></button>
          <button onClick={() => setView({ x: -100, y: -100, k: 0.8 })} className="p-2 hover:bg-blue-900/50 text-cyan-400 border-t border-blue-900"><RotateCcw size={16}/></button>
        </div>
      </div>

      {/* MAP */}
      <div 
        className={`flex-1 relative overflow-hidden cursor-${isDragging ? 'grabbing' : 'grab'}`}
        onMouseDown={(e) => { setIsDragging(true); setDragStart({ x: e.clientX - view.x, y: e.clientY - view.y }) }}
        onMouseMove={(e) => isDragging && setView({ ...view, x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onWheel={handleWheel}
      >
        <svg width="100%" height="100%" className="block touch-none select-none">
          <defs>
            <pattern id="grid-bg" x="0" y="0" width={CONFIG.CELL_SIZE} height={CONFIG.CELL_SIZE} patternUnits="userSpaceOnUse">
              <path d={`M ${CONFIG.CELL_SIZE} 0 L 0 0 0 ${CONFIG.CELL_SIZE}`} fill="none" stroke="#1e3a8a" strokeWidth="1" strokeOpacity="0.3"/>
            </pattern>
            <pattern id="roof-vents" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse"><line x1="0" y1="5" x2="10" y2="5" className="stroke-cyan-800 stroke-2 opacity-60"/></pattern>
            <pattern id="roof-grid" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M 8 0 L 0 0 0 8" className="fill-none stroke-blue-600 stroke-1 opacity-40"/></pattern>
            <filter id="neon-glow"><feGaussianBlur stdDeviation="3" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>

          <g transform={`translate(${view.x}, ${view.y}) scale(${view.k})`}>
            {/* Ground */}
            <rect x={-5000} y={-5000} width={10000} height={10000} fill="url(#grid-bg)" />
            
            {/* Floor Grid */}
            {Array.from({ length: CONFIG.GRID_SIZE }).map((_, y) => 
               Array.from({ length: CONFIG.GRID_SIZE }).map((_, x) => (
                 <rect key={`floor-${x}-${y}`} x={x*CONFIG.CELL_SIZE+BLOCK_OFFSET} y={y*CONFIG.CELL_SIZE+BLOCK_OFFSET} width={BLOCK_SIZE} height={BLOCK_SIZE} className="fill-[#0f1f3d] stroke-[#1e3a8a] stroke-[0.5]" />
               ))
            )}

            {/* Paths */}
            {vehicles.map(v => renderPath(v))}

            {/* Stations */}
            {stations.map(s => <StationMarker key={s.id} s={s} />)}

            {/* Buildings */}
            {layout.buildings.map(b => <BuildingNeon3D key={b.id} b={b} />)}

            {/* Incidents */}
            {incidents.map(inc => {
              const p = toPixels(inc.x, inc.y)
              return (
                <g key={inc.id} transform={`translate(${p.x}, ${p.y})`} filter="url(#neon-glow)">
                  <circle r={25} className="fill-red-500/10 stroke-red-500 stroke-1 animate-ping opacity-50"/>
                  <circle r={10} className="fill-[#050b14] stroke-red-500 stroke-2"/>
                  <Flame className="text-red-500" x={-8} y={-8} size={16} />
                  <line x1={0} y1={10} x2={0} y2={25} className="stroke-red-500/50 stroke-1" />
                  <circle cx={0} cy={25} r={2} className="fill-red-500" />
                </g>
              )
            })}

            {/* Vehicles */}
            {vehicles.map(v => {
              const p = toPixels(v.currentPos.x, v.currentPos.y)
              return (
                <g key={v.id} style={{ transform: `translate(${p.x}px, ${p.y}px)`, transition: v.status === 'moving' ? `transform ${CONFIG.ANIMATION_SPEED_MS}ms linear` : 'none' }}>
                  <g transform="translate(0, -10)">
                    <rect x={-12} y={-12} width={24} height={24} rx="4" className="fill-[#050b14] stroke-cyan-400 stroke-2" />
                    {v.status === 'arrived' ? <CheckCircle className="text-emerald-400" x={-10} y={-10} size={20} /> : <Ambulance className="text-cyan-400" x={-10} y={-10} size={20} />}
                  </g>
                  <ellipse cx={0} cy={8} rx={10} ry={4} className="fill-cyan-500/30 blur-[2px]" />
                </g>
              )
            })}
          </g>
        </svg>
      </div>
      <div className="absolute bottom-2 left-0 w-full text-center pointer-events-none"><p className="text-[10px] text-blue-900 tracking-[0.5em] font-bold opacity-60">SECURE CONNECTION // ENCRYPTED</p></div>
    </div>
  )
}