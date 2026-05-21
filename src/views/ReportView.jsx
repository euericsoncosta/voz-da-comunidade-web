import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Image as ImageIcon, 
  MapPin, 
  CheckCircle2, 
  ChevronLeft,
  Shield,
  Leaf,
  Construction,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';

/**
 * ReportView - Formulário real para envio de novas ocorrências georreferenciadas.
 * @param {object} locationData - Coordenadas de GPS capturadas pela mira no MapView.
 * @param {object} user - Utilizador autenticado na sessão.
 * @param {function} onSubmitReport - Função global no App.jsx para enviar os dados para o Render.
 * @param {boolean} loading - Estado de carregamento do envio.
 * @param {string} error - Mensagem de erro retornada pela API (sessão expirada, erro de rede, etc).
 * @param {boolean} isDark - Estado de tema escuro/claro integrado.
 * @param {function} setView - Função de navegação.
 */
const ReportView = ({ setView, locationData, user, onSubmitReport, loading, error, isDark }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [type, setType] = useState('infraestrutura'); // "segurança", "ambiente", "infraestrutura"
  
  // Estados para Upload de Imagem
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  // PALETA DE CORES ADAPTATIVA PARA MODO ESCURO / MODO CLARO
  const theme = {
    background: isDark ? 'bg-slate-950 text-white' : 'bg-[#fdfcf0] text-black',
    card: isDark ? 'bg-slate-900 border-slate-800 text-white shadow-xl' : 'bg-white border-[#e5e4d7] text-black shadow-sm',
    text: isDark ? 'text-slate-100' : 'text-slate-900',
    subtext: isDark ? 'text-slate-400' : 'text-slate-500',
    input: isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-slate-50 border-slate-100 text-black placeholder:text-slate-400',
    border: isDark ? 'border-slate-800' : 'border-[#e5e4d7]'
  };

  // CORREÇÃO E BLINDAGEM DA GEOLOCALIZAÇÃO:
  const safeLocation = (locationData && locationData.lat && locationData.lng) 
    ? { lat: Number(locationData.lat), lng: Number(locationData.lng) } 
    : { lat: -4.1011, lng: -38.5086 }; // Padrão Horizonte-CE

  const categories = [
    { id: 'infraestrutura', label: 'Infraestrutura', icon: Construction, color: 'text-blue-500', activeBg: 'bg-blue-600' },
    { id: 'segurança', label: 'Segurança', icon: Shield, color: 'text-red-500', activeBg: 'bg-red-500' },
    { id: 'ambiente', label: 'Meio Ambiente', icon: Leaf, color: 'text-emerald-500', activeBg: 'bg-emerald-500' },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !neighborhood.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Passa o pacote completo de dados para a função do App.jsx, incluindo lat/lng validados
    if (onSubmitReport) {
      onSubmitReport({
        title,
        description,
        neighborhood,
        type,
        imageFile,
        lat: safeLocation.lat,
        lng: safeLocation.lng
      });
    } else {
      console.log("Simulação de envio:", { title, description, neighborhood, type, safeLocation });
      setView('map');
    }
  };

  return (
    <div className={`flex-1 p-8 space-y-8 overflow-y-auto no-scrollbar pb-32 animate-in zoom-in-95 duration-500 transition-colors duration-500 ${theme.background}`}>
      
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

      {/* Header */}
      <header className="flex items-center gap-4">
        <button 
          type="button"
          onClick={() => setView('map')}
          className={`p-3 rounded-2xl active:scale-90 transition-all border ${theme.card}`}
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className={`text-2xl font-black tracking-tighter uppercase italic leading-none ${theme.text}`}>
            Novo Relato
          </h2>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
            Sua voz em Horizonte
          </p>
        </div>
      </header>

      {/* Box de Geolocalização Fixada */}
      <div className={`p-6 rounded-[32px] border space-y-3 ${theme.card}`}>
        <div className="flex items-center gap-3 text-blue-600">
          <MapPin size={18} strokeWidth={2.5} />
          <span className="text-[10px] font-black uppercase tracking-widest">Coordenadas da Mira do Mapa</span>
        </div>
        <div className={`text-[11px] font-bold ${theme.subtext}`}>
          <p>Latitude: <span className={`${theme.text} font-black`}>{safeLocation.lat.toFixed(6)}</span></p>
          <p className="mt-1">Longitude: <span className={`${theme.text} font-black`}>{safeLocation.lng.toFixed(6)}</span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={`rounded-[40px] border p-8 shadow-xl space-y-8 ${theme.card}`}>
        
        {/* Campo de Título */}
        <div className="space-y-2">
          <label className={`text-[9px] font-black uppercase tracking-widest ml-1 ${theme.subtext}`}>
            O que está acontecendo? *
          </label>
          <input 
            type="text" 
            placeholder="Ex: Cano estourado ou Poste sem luz" 
            className={`w-full h-16 rounded-2xl px-6 text-sm font-bold outline-none focus:ring-4 ring-blue-600/5 transition-all border ${theme.input}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Upload de Imagem */}
        <div className="space-y-3">
          <label className={`text-[9px] font-black uppercase tracking-widest ml-1 ${theme.subtext}`}>
            Evidência Visual (Foto)
          </label>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />

          {imagePreview ? (
            <div className={`relative w-full h-52 rounded-[28px] overflow-hidden border ${theme.border}`}>
              <img src={imagePreview} className="w-full h-full object-cover" alt="Pré-visualização" />
              <button 
                type="button" 
                onClick={() => { setImagePreview(null); setImageFile(null); }}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => fileInputRef.current.click()}
                className={`h-28 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-all ${isDark ? 'bg-blue-950/30 border-blue-500/30 text-blue-400 hover:bg-blue-900/20' : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100/50'}`}
              >
                <Camera size={28} />
                <span className="text-[8px] font-black uppercase tracking-widest">Tirar Foto</span>
              </button>
              <button 
                type="button"
                onClick={() => fileInputRef.current.click()}
                className={`h-28 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-all ${isDark ? 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800' : 'bg-slate-50 border-[#e5e4d7] text-slate-400 hover:bg-slate-100'}`}
              >
                <ImageIcon size={28} />
                <span className="text-[8px] font-black uppercase tracking-widest">Galeria</span>
              </button>
            </div>
          )}
        </div>

        {/* Seleção de Categoria */}
        <div className="space-y-3">
          <label className={`text-[9px] font-black uppercase tracking-widest ml-1 ${theme.subtext}`}>
            Categoria do Problema *
          </label>
          <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = type === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setType(cat.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl border transition-all whitespace-nowrap ${
                    isActive 
                      ? (isDark ? 'bg-blue-600 text-white border-transparent shadow-lg scale-105 shadow-blue-500/20' : 'bg-black text-white border-transparent shadow-lg scale-105') 
                      : (isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-400')
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-white' : cat.color} />
                  <span className="text-[9px] font-black uppercase">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Campo de Bairro */}
        <div className="space-y-2">
          <label className={`text-[9px] font-black uppercase tracking-widest ml-1 ${theme.subtext}`}>
            Bairro *
          </label>
          <input 
            type="text" 
            placeholder="Ex: Centro, Dunas, Planalto" 
            className={`w-full h-16 rounded-2xl px-6 text-sm font-bold outline-none focus:ring-4 ring-blue-600/5 transition-all border ${theme.input}`}
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            required
          />
        </div>

        {/* Descrição Detalhada */}
        <div className="space-y-2">
          <label className={`text-[9px] font-black uppercase tracking-widest ml-1 ${theme.subtext}`}>
            Descrição Detalhada *
          </label>
          <textarea 
            rows={4} 
            placeholder="Descreva a situação detalhadamente..." 
            className={`w-full p-6 rounded-2xl text-sm font-bold outline-none focus:ring-4 ring-blue-600/5 transition-all resize-none border ${theme.input}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Mensagem de Erro da API */}
        {error && (
          <div className="p-4 bg-orange-50 border border-orange-200 text-orange-600 text-[10px] font-black uppercase rounded-2xl flex items-center gap-3 animate-in shake duration-500">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Botão de Publicação */}
        <button 
          type="submit"
          disabled={loading}
          className={`w-full h-20 rounded-[32px] font-black text-xs uppercase tracking-[3px] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all group ${
            isDark 
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/10' 
              : 'bg-black hover:bg-slate-900 text-white'
          } disabled:opacity-50`}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Publicar Relato 
              <CheckCircle2 size={20} className="group-hover:rotate-12 transition-transform" />
            </>
          )}
        </button>
      </form>

      <p className={`text-center text-[8px] font-black uppercase tracking-[4px] ${theme.subtext}`}>
        Smart Squad • Horizonte Digital
      </p>

    </div>
  );
};

export default ReportView;