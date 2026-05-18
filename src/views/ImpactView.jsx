import React, { useEffect, useState } from 'react';
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
  RefreshCcw 
} from 'lucide-react';

/**
 * ImpactView - Painel de Transparência e Resultados Autogestor de API.
 * CONFIGURAÇÃO: Correção do travamento de carregamento e atualização sob demanda.
 */
const ImpactView = ({ stats, isDark, fetchData }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dispara a busca de dados apenas UMA vez quando a tela de Impacto é montada
  useEffect(() => {
    if (fetchData) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Mantido vazio para evitar o loop infinito no backend

  // Função para lidar com o clique de refresh manual
  const handleRefresh = async () => {
    if (!fetchData) return;
    setIsRefreshing(true);
    try {
      await fetchData(); 
    } catch (error) {
      console.error("Erro ao atualizar métricas:", error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Valores zerados padrão para evitar quebras se o backend retornar objeto vazio
  const defaultStats = {
    resolutionRate: 0,
    total: 0,
    likes: 0,
    activeCitizens: 0,
    ranking: []
  };

  // Se 'stats' existir, usa ele. Se não, usa o 'defaultStats' (evita travar a tela)
  const data = stats || defaultStats;

  return (
    <div className={`flex-1 p-8 space-y-8 overflow-y-auto no-scrollbar pb-32 animate-in slide-in-from-bottom-10 duration-700 transition-colors duration-500 ${isDark ? 'bg-slate-950 text-white' : 'bg-[#fdfcf0] text-black'}`}>
      
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

        <div className={`p-5 rounded-[32px] border text-center shadow-sm active:scale-95 transition-transform ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#e5e4d7]'}`}>
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
                    {item.type === 'infra' && <Construction size={12} className="text-blue-500" />}
                    {item.type === 'seguranca' && <Shield size={12} className="text-red-500" />}
                    {item.type === 'ambiente' && <Leaf size={12} className="text-emerald-500" />}
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