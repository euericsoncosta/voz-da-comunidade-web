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
 * @param {function} setView - Função de navegação.
 */
const ReportView = ({ setView, locationData, user, onSubmitReport, loading, error }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [type, setType] = useState('infraestrutura'); // "segurança", "ambiente", "infraestrutura"
  
  // Estados para Upload de Imagem
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  // CORREÇÃO E BLINDAGEM DA GEOLOCALIZAÇÃO:
  // Evita a armadilha do objeto vazio "{}" que é considerado truthy no JS
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
    <div className="flex-1 p-8 space-y-8 overflow-y-auto no-scrollbar pb-32 animate-in zoom-in-95 duration-500 bg-[#fdfcf0]">
      
      {/* Header */}
      <header className="flex items-center gap-4">
        <button 
          type="button"
          onClick={() => setView('map')}
          className="p-3 bg-white border border-[#e5e4d7] rounded-2xl text-slate-400 active:scale-90 transition-all shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-black text-black tracking-tighter uppercase italic leading-none">
            Novo Relato
          </h2>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
            Sua voz em Horizonte
          </p>
        </div>
      </header>

      {/* Box de Geolocalização Fixada */}
      <div className="bg-white p-6 rounded-[32px] border border-[#e5e4d7] shadow-sm space-y-3">
        <div className="flex items-center gap-3 text-blue-600">
          <MapPin size={18} strokeWidth={2.5} />
          <span className="text-[10px] font-black uppercase tracking-widest">Coordenadas da Mira do Mapa</span>
        </div>
        <div className="text-[11px] font-bold text-slate-500">
          <p>Latitude: <span className="text-black font-black">{safeLocation.lat.toFixed(6)}</span></p>
          <p className="mt-1">Longitude: <span className="text-black font-black">{safeLocation.lng.toFixed(6)}</span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[40px] border border-[#e5e4d7] p-8 shadow-xl space-y-8">
        
        {/* Campo de Título */}
        <div className="space-y-2">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
            O que está acontecendo? *
          </label>
          <input 
            type="text" 
            placeholder="Ex: Cano estourado ou Poste sem luz" 
            className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-bold text-black outline-none focus:ring-4 ring-blue-600/5 transition-all"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Upload de Imagem */}
        <div className="space-y-3">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
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
            <div className="relative w-full h-52 rounded-[28px] overflow-hidden border border-[#e5e4d7]">
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
                className="h-28 bg-blue-50 border-2 border-dashed border-blue-200 rounded-3xl flex flex-col items-center justify-center text-blue-600 gap-2 active:scale-95 transition-all hover:bg-blue-100/50"
              >
                <Camera size={28} />
                <span className="text-[8px] font-black uppercase tracking-widest">Tirar Foto</span>
              </button>
              <button 
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="h-28 bg-slate-50 border-2 border-dashed border-[#e5e4d7] rounded-3xl flex flex-col items-center justify-center text-slate-400 gap-2 active:scale-95 transition-all hover:bg-slate-100"
              >
                <ImageIcon size={28} />
                <span className="text-[8px] font-black uppercase tracking-widest">Galeria</span>
              </button>
            </div>
          )}
        </div>

        {/* Seleção de Categoria */}
        <div className="space-y-3">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
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
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl border transition-all whitespace-nowrap ${isActive ? 'bg-black text-white border-black shadow-lg scale-105' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
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
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Bairro *
          </label>
          <input 
            type="text" 
            placeholder="Ex: Centro, Dunas, Planalto" 
            className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-bold text-black outline-none focus:ring-4 ring-blue-600/5 transition-all"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            required
          />
        </div>

        {/* Descrição Detalhada */}
        <div className="space-y-2">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Descrição Detalhada *
          </label>
          <textarea 
            rows={4} 
            placeholder="Descreva a situação detalhadamente..." 
            className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black outline-none focus:ring-4 ring-blue-600/5 transition-all resize-none"
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
          className="w-full h-20 bg-black text-white rounded-[32px] font-black text-xs uppercase tracking-[3px] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-slate-900 disabled:opacity-50 group"
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

      <p className="text-center text-[8px] font-black text-slate-300 uppercase tracking-[4px]">
        Smart Squad • Horizonte Digital
      </p>

    </div>
  );
};

export default ReportView;