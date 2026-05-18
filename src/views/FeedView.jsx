import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  ThumbsUp, 
  MessageSquare, 
  Bell, 
  Sun, 
  Moon, 
  RefreshCcw, 
  AlertCircle, 
  CheckCircle, 
  CheckCircle2, 
  Clock, 
  Navigation,
  Loader2
} from 'lucide-react';

/**
 * FeedView - Lista cronológica de ocorrências ajustada para Web.
 * CONFIGURAÇÃO: Dark mode global unificado com o App.
 */
const FeedView = ({ 
  reports, 
  setReports, 
  handleLike, 
  setView, // Inserido aqui para garantir o funcionamento do clique de detalhes
  setSelectedReport, 
  isDark, 
  setIsDark 
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [showResolvedOnly, setShowResolvedOnly] = useState(false);

  // Alinhado com a porta do App para evitar erros de conexão local
  const API_BASE = 'http://localhost:3000'; 
  const CURRENT_USER_ID = 1;

  const displayReports = useMemo(() => {
    let filtered = reports;
    if (selectedFilter) {
      filtered = filtered.filter(r => String(r.type).toLowerCase() === selectedFilter.toLowerCase());
    }
    if (showResolvedOnly) {
      filtered = filtered.filter(r => r.status === 'resolvido');
    }
    return filtered;
  }, [reports, selectedFilter, showResolvedOnly]);

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/feed?userId=${CURRENT_USER_ID}`, {
        credentials: 'include'
      });
      const json = await response.json();
      if (json.status === 'success') setReports(json.data);
    } catch (e) {
      console.error("Erro ao atualizar feed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-screen overflow-hidden transition-colors duration-500 ${isDark ? 'bg-slate-950 text-white' : 'bg-[#fdfcf0] text-black'}`}>
      
      <header className={`p-6 border-b shrink-0 transition-colors duration-500 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#e5e4d7]'}`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-black italic uppercase leading-none">Linha do Tempo</h2>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1 flex items-center gap-1">
              <MapPin size={10} /> Horizonte Ativa
            </p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-3 rounded-xl active:scale-90 transition-all ${isDark ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-400'}`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              onClick={refreshData}
              className={`p-3 rounded-xl active:scale-90 transition-all ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-400'}`}
            >
              <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            <div className={`p-3 rounded-xl border transition-colors ${isDark ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-[#e5e4d7] text-slate-400'}`}>
              <Bell size={18} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: '', label: 'Tudo' },
            { id: 'segurança', label: 'Segurança' },
            { id: 'ambiente', label: 'Ambiente' },
            { id: 'infraestrutura', label: 'Infra' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border whitespace-nowrap transition-all
                ${selectedFilter === f.id 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : isDark ? 'border-slate-800 text-slate-500' : 'border-[#e5e4d7] text-slate-400'}`}
            >
              {f.label}
            </button>
          ))}
          
          <div className={`w-[1px] h-4 mx-1 transition-colors ${isDark ? 'bg-slate-800' : 'bg-[#e5e4d7]'}`} />

          <button
            onClick={() => setShowResolvedOnly(!showResolvedOnly)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border whitespace-nowrap flex items-center gap-2 transition-all
              ${showResolvedOnly 
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                : 'border-emerald-500/30 text-emerald-500'}`}
          >
            <CheckCircle size={14} />
            Resolvidos
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6 pb-32 no-scrollbar">
        {loading ? (
          <div className="py-20 text-center opacity-30 flex flex-col items-center gap-2">
            <Loader2 className="animate-spin" />
            <p className="text-xs font-black uppercase tracking-widest">Sincronizando relatos...</p>
          </div>
        ) : displayReports.length === 0 ? (
          <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4">
            <AlertCircle size={40} />
            <p className="text-xs font-black uppercase tracking-widest">Nenhum relato encontrado.</p>
          </div>
        ) : (
          displayReports.map(item => {
            const isResolved = item.status === 'resolvido';
            const categoryColor = String(item.type).toLowerCase().includes('segur') ? 'text-red-500' : 'text-emerald-500';

            return (
              <div 
                key={item.id} 
                className={`group rounded-[40px] border transition-all overflow-hidden shadow-sm
                  ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#e5e4d7]'}`}
              >
                {/* Banner de Status */}
                {isResolved && (
                  <div className="bg-emerald-500 py-2 flex items-center justify-center gap-2">
                    <CheckCircle2 size={12} className="text-white" />
                    <span className="text-[9px] font-black text-white uppercase tracking-wider">Resolvido pela Prefeitura</span>
                  </div>
                )}

                {/* Header do Cartão */}
                <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => { setSelectedReport(item); setView('details'); }}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-colors
                    ${isDark ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                    {item.userName?.[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black">{item.userName}</p>
                    <p className="text-[9px] font-bold uppercase tracking-tighter opacity-50">
                      {item.neighborhood} • {item.type}
                    </p>
                  </div>
                </div>

                {/* Imagem */}
                {item.imageUrl && (
                  <div className="w-full h-48 bg-slate-100 overflow-hidden cursor-pointer" onClick={() => { setSelectedReport(item); setView('details'); }}>
                    <img 
                      src={item.imageUrl} 
                      className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isResolved ? 'opacity-70' : ''}`} 
                      alt="Evidência" 
                    />
                  </div>
                )}

                {/* Conteúdo */}
                <div className="p-6 space-y-2 cursor-pointer" onClick={() => { setSelectedReport(item); setView('details'); }}>
                  <p className={`text-[9px] font-black uppercase tracking-widest ${isResolved ? 'text-emerald-500' : categoryColor}`}>
                    {isResolved ? '✓ Concluído' : `• ${item.type}`}
                  </p>
                  <h4 className="font-black text-sm uppercase leading-tight pr-4">
                    {item.title}
                  </h4>
                  <p className="text-xs opacity-60 italic line-clamp-2">
                    "{item.description}"
                  </p>
                </div>

                {/* Rodapé Social */}
                <div className={`p-6 pt-0 flex gap-6 items-center border-t mt-4 pt-4 transition-colors ${isDark ? 'border-slate-800' : 'border-slate-50'}`}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(item.id);
                    }} 
                    className={`flex items-center gap-1.5 text-[10px] font-black uppercase transition-all 
                      ${item.userLiked ? 'text-blue-600' : 'text-slate-300 hover:text-blue-400'}`}
                  >
                    <ThumbsUp size={16} fill={item.userLiked ? "currentColor" : "none"} strokeWidth={2.5} /> 
                    {item.likes_count || 0} APOIOS
                  </button>
                  
                  <div className="flex items-center gap-1.5 text-slate-300 text-[10px] font-black uppercase">
                    <MessageSquare size={16} strokeWidth={2.5} /> 
                    {item.comments_count || 0}
                  </div>

                  <button className={`ml-auto p-3 rounded-2xl text-white active:scale-90 transition-all
                    ${isResolved ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-black shadow-black/20'} shadow-lg`}>
                    <Navigation size={18} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
};

export default FeedView;