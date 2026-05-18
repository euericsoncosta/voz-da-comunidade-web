import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  UserPlus, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck,
  Loader2,
  AlertCircle
} from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

/**
 * SignupView - Ecrã dedicado à criação de novas contas no ecossistema Voz da Comunidade.
 * @param {function} setView - Função de navegação para alternar entre ecrãs.
 * @param {function} handleSignup - Função que processa o registo na API.
 * @param {boolean} loading - Estado de carregamento da submissão.
 * @param {string} error - Mensagem de erro vinda da API.
 */
const SignupView = ({ setView, handleSignup, loading, error }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [agreed, setAgreed] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      // Nota: O App.jsx tratará a validação final, mas podemos adicionar avisos locais
      return;
    }
    handleSignup(formData);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#fdfcf0] min-h-screen animate-in fade-in duration-700 overflow-y-auto no-scrollbar">
      
      {}
      <header className="p-6">
        <button 
          onClick={() => setView('auth')}
          className="p-3 bg-white border border-[#e5e4d7] rounded-2xl text-slate-400 active:scale-90 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
      </header>

      <div className="flex-1 px-8 pb-12 flex flex-col">
        
        {}
        <div className="flex flex-col items-center mb-10">
          <div className="mb-6">
            <BrandLogo size={140} showSubtitle={false} />
          </div>
          <h2 className="text-2xl font-black text-black uppercase italic leading-none tracking-tighter text-center">
            Criar Nova Conta
          </h2>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[4px] mt-3 text-center">
            Junte-se à Mudança em Horizonte
          </p>
        </div>

        {}
        <form onSubmit={onSubmit} className="space-y-5">
          
          {/* Campo: Nome Completo */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
            <div className="flex items-center bg-white border border-[#e5e4d7] h-14 px-5 rounded-[22px] focus-within:ring-4 ring-blue-600/5 transition-all shadow-sm">
              <User size={18} className="text-slate-300 mr-3" />
              <input 
                type="text" 
                placeholder="Ex: José da Silva" 
                className="bg-transparent flex-1 outline-none text-sm font-bold text-slate-700" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>
          </div>

          {/* Campo: E-mail */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
            <div className="flex items-center bg-white border border-[#e5e4d7] h-14 px-5 rounded-[22px] focus-within:ring-4 ring-blue-600/5 transition-all shadow-sm">
              <Mail size={18} className="text-slate-300 mr-3" />
              <input 
                type="email" 
                placeholder="seu@email.com" 
                className="bg-transparent flex-1 outline-none text-sm font-bold text-slate-700" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required 
              />
            </div>
          </div>

          {}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha</label>
              <div className="flex items-center bg-white border border-[#e5e4d7] h-14 px-5 rounded-[22px] focus-within:ring-4 ring-blue-600/5 transition-all shadow-sm">
                <Lock size={16} className="text-slate-300 mr-2" />
                <input 
                  type="password" 
                  placeholder="••••" 
                  className="bg-transparent flex-1 outline-none text-sm font-bold text-slate-700" 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  required 
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirmar</label>
              <div className="flex items-center bg-white border border-[#e5e4d7] h-14 px-5 rounded-[22px] focus-within:ring-4 ring-blue-600/5 transition-all shadow-sm">
                <ShieldCheck size={16} className="text-slate-300 mr-2" />
                <input 
                  type="password" 
                  placeholder="••••" 
                  className="bg-transparent flex-1 outline-none text-sm font-bold text-slate-700" 
                  value={formData.confirmPassword}
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  required 
                />
              </div>
            </div>
          </div>

          {}
          {/* Checkbox de Termos Éticos (Diferencial OBT) */}
          <div className="flex items-start gap-3 p-4 bg-white/50 rounded-2xl border border-[#e5e4d7] mt-2">
            <button 
              type="button"
              onClick={() => setAgreed(!agreed)}
              className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${agreed ? 'bg-blue-600 border-blue-600' : 'border-slate-200 bg-white'}`}
            >
              {agreed && <CheckCircle2 size={12} className="text-white" />}
            </button>
            <p className="text-[10px] font-medium text-slate-500 leading-tight">
              Concordo em participar ativamente da comunidade e entendo que meus relatos são públicos para fins de transparência municipal.
            </p>
          </div>

          {/* Feedback de Erro da API */}
          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-[10px] font-black uppercase rounded-2xl border border-red-100 flex items-center gap-3 animate-in shake duration-500">
              <AlertCircle size={16}/> {error}
            </div>
          )}

          {/* Botão de Finalização */}
          <button 
            type="submit" 
            disabled={loading || !agreed} 
            className="w-full h-18 bg-black text-white rounded-[28px] font-black text-xs uppercase tracking-[3px] shadow-2xl py-6 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Finalizar Registo
                <UserPlus size={18}/>
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[9px] font-black text-slate-300 uppercase tracking-[4px]">
          Smart Squad • Horizonte Digital
        </p>
      </div>
    </div>
  );
};

export default SignupView;