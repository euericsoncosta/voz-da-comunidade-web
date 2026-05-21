import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  RefreshCw, 
  Navigation, 
  Shield, 
  Leaf, 
  Construction, 
  Plus, 
  Target 
} from 'lucide-react';

const HORIZONTE_CENTER = [-4.096288, -38.496038];
const ZOOM_DEFAULT = 14;

const categories = [
  {
    key: 'seguranca',
    label: 'Segurança',
    color: '#ef4444',
    icon: Shield,
    match: (t) => String(t).toLowerCase().includes('segur'),
  },
  {
    key: 'ambiente',
    label: 'Ambiente',
    color: '#10b981',
    icon: Leaf,
    match: (t) => String(t).toLowerCase().includes('ambie') || String(t).toLowerCase().includes('meio'),
  },
  {
    key: 'infra',
    label: 'Infraestrutura',
    color: '#3b82f6',
    icon: Construction,
    match: () => true,
  },
];

const getCat = (type) => categories.find((c) => c.key !== 'infra' && c.match(type)) || categories[2];

const getCoords = (r, index) => {
  if (r.lat && r.lng) return [parseFloat(r.lat), parseFloat(r.lng)];
  const angle = (index * 137.5 * Math.PI) / 180;
  const radius = 0.005 + (index % 5) * 0.003;
  return [HORIZONTE_CENTER[0] + Math.cos(angle) * radius, HORIZONTE_CENTER[1] + Math.sin(angle) * radius];
};

export default function MapView({ reports, loading, fetchData, setView, setSelectedReport, setLocationData, isDark }) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersLayer = useRef(null);
  const tileLayerRef = useRef(null); // Ref para atualizar as texturas em tempo real

  const [activeFilters, setActiveFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [leafletReady, setLeafletReady] = useState(!!window.L);

  // Expor função global para cliques no popup
  useEffect(() => {
    window.handleDetalhesClick = (reportId) => {
      const report = reports.find(r => String(r.id) === String(reportId));
      if (report) {
        setSelectedReport(report);
        setView('details');
      }
    };
  }, [reports, setSelectedReport, setView]);

  // Carregar arquivos do Leaflet dinamicamente
  useEffect(() => {
    if (window.L) { setLeafletReady(true); return; }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => setLeafletReady(true);
    document.head.appendChild(script);
  }, []);

  // Inicializar o mapa
  useEffect(() => {
    if (!leafletReady || !mapRef.current || leafletMap.current) return;
    const L = window.L;

    const map = L.map(mapRef.current, {
      center: HORIZONTE_CENTER,
      zoom: ZOOM_DEFAULT,
      zoomControl: false,
    });

    // Define a URL inicial baseada no modo atual
    const tileUrl = isDark 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    tileLayerRef.current = L.tileLayer(tileUrl, {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    markersLayer.current = L.layerGroup().addTo(map);
    leafletMap.current = map;
  }, [leafletReady]);

  // Atualizar a textura do mapa dinamicamente quando 'isDark' mudar
  useEffect(() => {
    if (leafletMap.current && tileLayerRef.current) {
      const newUrl = isDark 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
      
      tileLayerRef.current.setUrl(newUrl);
    }
  }, [isDark]);

  const visibleReports = useMemo(() => {
    let result = reports;
    if (activeFilters.length > 0)
      result = result.filter((r) => activeFilters.includes(getCat(r.type).key));
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter((r) => (r.title || '').toLowerCase().includes(q));
    }
    return result;
  }, [reports, activeFilters, searchTerm]);

  // Atualizar Pins e Customizar Janelas de Popup com base no tema
  useEffect(() => {
    if (!leafletReady || !markersLayer.current) return;
    const L = window.L;
    markersLayer.current.clearLayers();

    visibleReports.forEach((r, i) => {
      const cat = getCat(r.type);
      const coords = getCoords(r, i);

      // Cores internas do PopUp baseadas no Dark Mode
      const popBg = isDark ? '#0f172a' : '#ffffff';
      const popText = isDark ? '#ffffff' : '#000000';
      const popSubtext = isDark ? '#94a3b8' : '#64748b';
      const popBtnBg = isDark ? '#ffffff' : '#000000';
      const popBtnText = isDark ? '#000000' : '#ffffff';

      const icon = L.divIcon({
        html: `
          <div style="background:${cat.color}; width:30px; height:30px; border-radius:10px 10px 0 10px; transform:rotate(-45deg); border:3px solid ${isDark ? '#0f172a' : '#ffffff'}; display:flex; align-items:center; justify-content:center; box-shadow:0 10px 15px -3px rgba(0,0,0,0.4)">
            <div style="transform:rotate(45deg); color:white; font-size:12px; font-weight:bold;">!</div>
          </div>`,
        className: '',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -35],
      });

      const marker = L.marker(coords, { icon });

      const popupContent = `
        <div style="font-family:'Inter',sans-serif; padding:5px; min-width:180px; color:${popText};">
          <h4 style="margin:0 0 5px; font-size:14px; font-weight:900; text-transform:uppercase; color:${popText};">${r.title || 'Ocorrência'}</h4>
          <p style="margin:0 0 15px; font-size:11px; color:${popSubtext}; line-height:1.4;">${r.description ? r.description.slice(0, 60) + '...' : 'Clique abaixo para ver mais.'}</p>
          <button 
            onclick="window.handleDetalhesClick('${r.id}')"
            style="width:100%; background:${popBtnBg}; color:${popBtnText}; border:none; border-radius:8px; padding:10px; font-size:10px; font-weight:900; text-transform:uppercase; cursor:pointer;"
          >
            Ver Detalhes Completos
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);
      markersLayer.current.addLayer(marker);
    });
  }, [visibleReports, leafletReady, isDark]);

  const toggleFilter = (key) =>
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  return (
    <div className={`flex-1 flex flex-col relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-slate-950 text-white' : 'bg-[#fdfcf0] text-black'}`}>
      
      {/* Estilos CSS Injetados para forçar o container nativo do Leaflet Popup a aceitar Dark Mode */}
      <style>{`
        .leaflet-popup-content-wrapper, .leaflet-popup-tip {
          background: ${isDark ? '#0f172a !important' : '#ffffff !important'};
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.3);
        }
        .leaflet-popup-close-button {
          color: ${isDark ? '#94a3b8 !important' : '#64748b !important'};
        }
      `}</style>

      {/* 1. BARRA DE BUSCA E FILTROS */}
      <div className="absolute top-4 left-4 right-4 z-[1000] space-y-3">
        <div className={`backdrop-blur-xl h-14 rounded-[26px] border shadow-2xl flex items-center px-5 gap-3 transition-colors duration-500 ${isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-[#e5e4d7]'}`}>
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="PROCURAR EM HORIZONTE..."
            className={`flex-1 bg-transparent outline-none text-[11px] font-black uppercase tracking-widest placeholder:text-slate-400 ${isDark ? 'text-white' : 'text-black'}`}
          />
          <button 
            onClick={fetchData} 
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${isDark ? 'bg-slate-800 text-white' : 'bg-slate-50 text-black'}`}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => {
            const isSelected = activeFilters.includes(cat.key);
            return (
              <button
                key={cat.key}
                onClick={() => toggleFilter(cat.key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border shadow-sm text-[9px] font-black uppercase tracking-widest transition-all 
                  ${isSelected 
                    ? isDark ? 'bg-white text-black border-white' : 'bg-black text-white border-black'
                    : isDark ? 'bg-slate-900 text-slate-400 border-slate-800' : 'bg-white text-slate-500 border-[#e5e4d7]'}`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MIRA DE PRECISÃO (CROSSHAIR) - FIXA NO CENTRO */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[500] pointer-events-none flex flex-col items-center">
        <div className="relative">
          <Target size={40} className={isDark ? "text-blue-400 opacity-90" : "text-blue-600 opacity-80"} strokeWidth={1.5} />
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full shadow-lg border ${isDark ? 'bg-blue-400 border-slate-900 shadow-blue-500/80' : 'bg-blue-600 border-white shadow-blue-500/50'}`}></div>
        </div>
        <div className={`mt-4 backdrop-blur px-3 py-1.5 rounded-xl flex items-center gap-2 border shadow-2xl transition-colors ${isDark ? 'bg-slate-900/90 text-white border-white/10' : 'bg-slate-900/90 text-white border-white/10'}`}>
          <span className="text-[8px] font-black uppercase tracking-[2px]">Posicione o Foco Aqui</span>
        </div>
      </div>

      {/* 3. CONTENTOR DO MAPA LEAFLET */}
      <div ref={mapRef} className="flex-1 z-[1]" />

      {/* 4. BOTÕES FLUTUANTES (FABs) */}
      <div className="absolute bottom-28 right-4 flex flex-col gap-4 z-[1000]">
        <button
          onClick={() => leafletMap.current?.setView(HORIZONTE_CENTER, ZOOM_DEFAULT)}
          className={`w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center active:scale-90 transition-all border ${isDark ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-black border-[#e5e4d7]'}`}
        >
          <Navigation size={24} />
        </button>
        <button
          onClick={() => {
            const center = leafletMap.current?.getCenter();
            if (center && setLocationData) {
              setLocationData({
                lat: center.lat,
                lng: center.lng
              });
            }
            setView('report');
          }}
          className={`w-16 h-16 rounded-[24px] shadow-2xl flex items-center justify-center border-[6px] active:scale-95 transition-all group ${isDark ? 'bg-blue-600 text-white border-slate-950' : 'bg-black text-white border-[#fdfcf0]'}`}
        >
          <Plus size={32} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
        </button>
      </div>
    </div>
  );
}