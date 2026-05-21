import React, { useEffect, useState, useCallback } from 'react';
import { 
  TrendingUp, 
  Zap, 
  Award, 
  BarChart3, 
  Users, 
  CheckCircle2, 
  ChevronRight,
  Shield,
  Leaf,
  Construction,
  Loader2,
  RefreshCcw,
  AlertCircle
} from 'lucide-react';

// --- CONFIGURAÇÃO DA API (Alinhe com o seu backend ativo local ou de produção) ---
const API_BASE = 'https://voz-da-comunidade-api-1.onrender.com';
// const API_BASE = 'http://localhost:3000';

/**
 * ImpactView - Painel de Transparência e Resultados Autogestor de API.
 * Autossuficiente: Faz requisições diretas ao banco de dados para evitar tela em branco.
 * Otimizado: Ocultação nativa de scrollbars horizontais e verticais para telemóvel.
 */
const ImpactView = ({ stats, isDark }) => {
  const [localStats, setLocalStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apiError, setApiError] = useState(null);

  // 1. FUNÇÃO INDEPENDENTE DE CONEXÃO À API (Puxa do endpoint '/' que contém o objeto stats)
  const loadStatsDirectly = useCallback(async (showLoadingIndicator = true) => {
    if (showLoadingIndicator) setLoading(true);
    setApiError(null);
    try {
      const res = await fetch(`${API_BASE}/?city=horizonte`, {
        credentials: 'include', // Essencial para passar os cookies de sessão e persistir login
        headers: { 'Accept': 'application/json' }
      });
      const json = await res.json();
      
      if (json.status === 'success' && json.data && json.data.stats) {
        setLocalStats(json.data.stats);
      } else {
        throw new Error("Formato de dados inválido.");
      }
    } catch (err) {
      console.warn("⚠️ Servidor offline ou inacessível. Usando dados defensivos de demonstração.");
      setApiError("Sem ligação ao servidor. Exibindo dados de demonstração.");
      
      // Fallback amigável de demonstração para que a tela NUNCA fique em branco
      setLocalStats({
        resolutionRate: 75,
        total: 18,
        likes: 54,
        ranking: [
          { name: 'Centro', count: 8 },
          { name: 'Planalto', count: 6 },
          { name: 'Dunas', count: 4 }
        ]
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Busca os dados assim que o ecrã é montado
  useEffect(() => {
    loadStatsDirectly(true);
  }, [loadStatsDirectly]);

  // Função para o botão de atualização manual
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadStatsDirectly(false);
  };
  
  // Valores padrão de segurança (Fallback total)
  const defaultStats = {
    resolutionRate: 0,
    total: 0,
    likes: 0,
    activeCitizens: 0,
    ranking: []
  };

  // Cadeia de decisão de dados (Estatísticas locais da API > Prop de fallback > Padrão de Segurança)
  const activeStats = localStats || stats || defaultStats;

  // Mescla inteligente para garantir propriedades calculadas
  const data = {
    ...defaultStats,
    ...activeStats,
    // Se o backend não enviar os cidadãos ativos, calcula dinamicamente baseado nos apoios
    activeCitizens: activeStats.activeCitizens || ((activeStats && activeStats.likes) ? Math.max(1, Math.round(activeStats.likes / 3)) : 0)
  };

  // Mapeamento dinâmico de ícones para o ranking de bairros
  const getNeighborhoodIcon = (name) => {
    const lowerName = String(name).toLowerCase();
    if (lowerName.includes('centro') || lowerName.includes('planalto')) {
      return <Construction size={12} className="text-blue-500" />;
    }
    if (lowerName.includes('dunas') || lowerName.includes('ambiente')) {
      return <Leaf size={12} className="text-emerald-500" />;
    }
    return <Shield size={12} className="text-red-500" />;
  };

  // Tela de Carregamento Simpatia
  if (loading && !localStats) {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center gap-3 ${isDark ? 'bg-slate-950 text-white' : 'bg-[#fdfcf0] text-black'}`}>
        <Loader2 className="animate-spin text-blue-600" size={32} />
        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[4px]">A carregar impacto...</p>
      </div>
    );
  }

  return (
    <div className={`flex-1 p-8 space-y-8 overflow-y-auto no-scrollbar pb-32 animate-in slide-in-from-bottom-10 duration-700 transition-colors duration-500 ${isDark ? 'bg-slate-950 text-white' : 'bg-[#fdfcf0] text-black'}`}>
      
      {/* Bloco de estilo local para forçar a remoção de barras de rolagem em todos os browsers */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .no-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}} />

      {/* Cabeçalho com botão de Atualizar integrado */}
      <header className="flex justify-between items-center">
        <div>
          <h2 className={`text-3xl font-black tracking-tighter uppercase italic leading-none ${isDark ? 'text-white' : 'text-black'}`}>
            Impacto Social
          </h2>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[4px] mt-2">
            Transparência Horizonte
          </p>
        </div>

        {/* Botão de Refresh sob demanda */}
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`p-3 rounded-xl active:scale-90 transition-all border ${isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-[#e5e4d7] text-slate-400'}`}
        >
          <RefreshCcw size={18} className={isRefreshing ? 'animate-spin text-blue-500' : ''} />
        </button>
      </header>

      {/* Alerta caso esteja offline usando dados locais */}
      {apiError && (
        <div className="p-4 bg-orange-50 border border-orange-100 text-orange-600 text-[9px] font-black uppercase rounded-2xl flex items-center gap-3 animate-in fade-in duration-300">
          <AlertCircle size={16} />
          <span>{apiError}</span>
        </div>
      )}

      {/* Card de Destaque - Taxa de Resolução */}
      <section className={`rounded-[44px] p-8 relative overflow-hidden shadow-2xl transition-colors ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-black text-white'}`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/20 blur-[80px] rounded-full -mr-20 -mt-20"></div>
        
        <div className="flex justify-between items-start mb-10 relative z-10">
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Taxa de Resolução</p>
            <h3 className="text-5xl font-black italic tracking-tighter text-white">
              {data.resolutionRate}%
            </h3>
          </div>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-md border shadow-lg ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white/10 border-white/10'}`}>
            <Zap size={28} className="text-blue-400" fill="currentColor" />
          </div>
        </div>

        <div className="space-y-3 relative z-10">
          <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-white/10'}`}>
             <div 
               className="bg-blue-500 h-full transition-all duration-1000 ease-out" 
               style={{ width: `${data.resolutionRate}%` }}
             ></div>
          </div>
          <p className="text-slate-400 text-[11px] font-medium leading-relaxed italic opacity-80">
            Estamos acima da média regional de reparos urbanos em Horizonte. Cada relato resolvido fortalece a nossa comunidade.
          </p>
        </div>
      </section>

      {/* Grade de Estatísticas Rápidas */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`p-5 rounded-[32px] border text-center shadow-sm active:scale-95 transition-transform ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#e5e4d7]'}`}>
          <BarChart3 className="mx-auto mb-2 text-blue-500" size={22} />
          <span className={`block text-lg font-black leading-none ${isDark ? 'text-white' : 'text-black'}`}>{data.total}</span>
          <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-1">Relatos</p>
        </div>
        
        <div className={`p-5 rounded-[32px] border text-center shadow-sm active:scale-95 transition-transform ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#e5e4d7]'}`}>
          <Award className="mx-auto mb-2 text-pink-500" size={22} />
          <span className={`block text-lg font-black leading-none ${isDark ? 'text-white' : 'text-black'}`}>{data.likes}</span>
          <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-1">Apoios</p>
        </div>

        <div className={`p-5 rounded-[32px] border text-center shadow-sm active:scale-95 transition-transform ${isDark ? 'bg-slate-900 border-slate-900' : 'bg-white border-[#e5e4d7]'}`}>
          <Users className="mx-auto mb-2 text-emerald-500" size={22} />
          <span className={`block text-lg font-black leading-none ${isDark ? 'text-white' : 'text-black'}`}>{data.activeCitizens}</span>
          <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-1">Ativos</p>
        </div>
      </div>

      {/* Seção do Ranking por Bairro */}
      <div className="space-y-5">
        <div className="flex items-center justify-between px-2">
          <h4 className={`text-[11px] font-black uppercase tracking-[3px] ${isDark ? 'text-slate-400' : 'text-black'}`}>Focos por Bairro</h4>
          <TrendingUp size={16} className="text-slate-400 opacity-50" />
        </div>

        <div className={`border rounded-[40px] p-8 space-y-7 shadow-sm transition-colors ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#e5e4d7]'}`}>
          {data.ranking && data.ranking.length > 0 ? (
            data.ranking.map((item, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    {getNeighborhoodIcon(item.name)}
                    <span className={`text-xs font-black uppercase tracking-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{item.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{item.count} denúncias</span>
                </div>
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
                  <div 
                    className={`h-full transition-all duration-700 delay-300 ${isDark ? 'bg-blue-500' : 'bg-slate-900'}`} 
                    style={{ width: `${data.ranking[0]?.count ? (item.count / data.ranking[0].count) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-xs opacity-40 py-4">Nenhum dado por bairro registrado.</p>
          )}
        </div>
      </div>

      {/* Banner de Engajamento */}
      <div className={`rounded-[35px] p-6 flex items-center justify-between group cursor-pointer active:scale-95 transition-all shadow-xl border ${isDark ? 'bg-blue-600 border-blue-500 shadow-blue-950/40' : 'bg-blue-600 border-blue-600 shadow-blue-200'}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <CheckCircle2 size={24} className="text-blue-600" />
          </div>
          <div>
            <h5 className="text-white font-black uppercase text-sm leading-none">Seja a mudança</h5>
            <p className="text-blue-100 text-[9px] font-bold uppercase mt-1 tracking-tight">Reporte problemas na sua rua</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-white opacity-40 group-hover:translate-x-1 transition-transform" />
      </div>

    </div>
  );
};

export default ImpactView;