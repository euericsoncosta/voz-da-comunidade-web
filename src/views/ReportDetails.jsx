import React from 'react';
import { 
  ChevronLeft, 
  MapPin, 
  User, 
  Clock, 
  Send, 
  Loader2, 
  MessageSquare,
  Shield,
  Leaf,
  Construction,
  Image as ImageIcon
} from 'lucide-react';

/**
 * ReportDetails - Vista detalhada com sistema de comentários funcional e exibição de evidência.
 * CONFIGURAÇÃO: Dark mode global unificado com o App.
 */
const ReportDetails = ({ 
  selectedReport, 
  setView, 
  handlePostComment, 
  newComment, 
  setNewComment, 
  loading,
  isDark // Propriedade adicionada para o controle do Dark Mode
}) => {

  if (!selectedReport) return null;

  // Lógica de ícones por categoria
  const getCategoryIcon = (type) => {
    const t = String(type).toLowerCase();
    if (t.includes('segur')) return <Shield size={14} />;
    if (t.includes('ambie')) return <Leaf size={14} />;
    return <Construction size={14} />;
  };

  return (
    <div className={`flex-1 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500 transition-colors duration-500 ${isDark ? 'bg-slate-950 text-white' : 'bg-[#fdfcf0] text-black'}`}>
      
      {/* 1. Header de Navegação */}
      <div className={`p-6 flex items-center gap-4 border-b backdrop-blur-md shrink-0 transition-colors duration-500 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/50 border-[#e5e4d7]'}`}>
        <button 
          onClick={() => setView('feed')} 
          className={`p-2 rounded-xl shadow-sm transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-slate-50'}`}
        >
          <ChevronLeft size={20} className={isDark ? 'text-white' : 'text-black'} />
        </button>
        <h3 className={`font-black uppercase italic text-sm tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
          Detalhes da Ocorrência
        </h3>
      </div>

      {/* 2. Área de Conteúdo Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-40">
        
        {/* Card Principal */}
        <div className={`p-8 rounded-[40px] border shadow-sm space-y-4 transition-colors duration-500 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#e5e4d7]'}`}>
          <div className="flex items-center justify-between">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-black uppercase ${isDark ? 'bg-blue-950/50 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              {getCategoryIcon(selectedReport.type)} {selectedReport.type}
            </div>
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border ${isDark ? 'bg-slate-950 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
              <Clock size={10} />
              <span className="text-[8px] font-black uppercase tracking-widest">
                {selectedReport.status || 'Pendente'}
              </span>
            </div>
          </div>

          <h2 className={`text-xl font-black uppercase leading-tight ${isDark ? 'text-white' : 'text-black'}`}>
            {selectedReport.title}
          </h2>

          {/* Exibição da Imagem */}
          <div className={`w-full h-64 rounded-[28px] border flex items-center justify-center overflow-hidden shadow-inner transition-colors ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
            {selectedReport.imageUrl ? (
              <img 
                src={selectedReport.imageUrl} 
                className="w-full h-full object-cover" 
                alt="Evidência da ocorrência" 
              />
            ) : (
              <div className="flex flex-col items-center gap-2 opacity-20">
                <ImageIcon size={32} className={isDark ? 'text-white' : 'text-black'} />
                <p className={`text-[10px] font-black uppercase italic tracking-widest ${isDark ? 'text-white' : 'text-black'}`}>
                  Sem imagem anexada
                </p>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {selectedReport.neighborhood}, Horizonte
            </span>
          </div>

          <p className={`text-sm italic leading-relaxed py-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            "{selectedReport.description}"
          </p>

          <div className={`pt-4 border-t flex items-center gap-3 ${isDark ? 'border-slate-800' : 'border-slate-50'}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${isDark ? 'bg-blue-950/60 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
              {selectedReport.userName?.[0].toUpperCase()}
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase">
              Relatado por {selectedReport.userName}
            </span>
          </div>
        </div>

        {/* Secção de Comentários */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 ml-2">
            <MessageSquare size={14} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">
              Conversa Comunitária
            </h4>
          </div>

          <div className="space-y-4">
            {selectedReport.comments && selectedReport.comments.length > 0 ? (
              selectedReport.comments.map((c, index) => (
                <div 
                  key={index} 
                  className={`p-5 rounded-[30px] border shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300 transition-colors ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#e5e4d7]'}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <User size={10} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                    <p className={`text-[10px] font-black uppercase ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      {c.userName}
                    </p>
                  </div>
                  <p className={`text-xs font-medium leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    "{c.content}"
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 opacity-30">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Ainda não há comentários.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Barra de Comentário Fixa Inferior */}
      <div className={`absolute bottom-0 left-0 right-0 p-6 pb-10 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.02)] border-t transition-colors duration-500 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#e5e4d7]'}`}>
        <form onSubmit={handlePostComment} className="flex gap-3 w-full">
          <div className={`flex-1 h-14 rounded-2xl border focus-within:ring-4 ring-black/5 transition-all flex items-center px-4 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
            <input 
              type="text" 
              placeholder="Escreva um comentário..." 
              className={`bg-transparent flex-1 outline-none text-sm font-bold placeholder:text-slate-400 ${isDark ? 'text-white' : 'text-black'}`} 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading || !newComment.trim()} 
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-50 disabled:bg-slate-400 ${isDark ? 'bg-blue-600 text-white shadow-blue-500/10' : 'bg-black text-white'}`}
          >
            {loading ? <Loader2 className="animate-spin" size={20}/> : <Send size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportDetails;