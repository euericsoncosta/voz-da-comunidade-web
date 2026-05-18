import React from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

/**
 * AuthView - Responsável pelo acesso ao ecossistema.
 * CORREÇÃO: Lógica de textos e botões sincronizada com o modo selecionado.
 */
const AuthView = ({ 
  authMode, 
  setAuthMode, 
  handleAuth, 
  formData, 
  setFormData, 
  loading, 
  error 
}) => {
  
  return (
    <div className="flex-1 flex flex-col px-8 justify-center bg-[#fdfcf0] animate-in fade-in duration-700 min-h-screen">
      
      {/* 1. Logótipo Oficial */}
      <div className="mb-12 flex justify-center">
        <BrandLogo size={180} color="#000000" />
      </div>

      {/* 2. Cabeçalho Dinâmico */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black text-black uppercase italic leading-none tracking-tighter">
          {authMode === 'login' ? 'Aceder ao Sistema' : 'Criar Nova Conta'}
        </h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] mt-3">
          Identidade Cidadã Horizonte
        </p>
      </div>

      {/* 3. Formulário */}
      <form onSubmit={(e) => handleAuth(e, authMode)} className="space-y-5">
        
        {/* Campo Nome (Aparece apenas no modo de Registo) */}
        {authMode === 'signup' && (
          <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Nome Completo
            </label>
            <div className="flex items-center bg-white border border-[#e5e4d7] h-14 px-5 rounded-[22px] focus-within:ring-4 ring-black/5 transition-all shadow-sm">
              <User size={18} className="text-slate-300 mr-3" />
              <input 
                type="text" 
                placeholder="Ex: José da Silva" 
                className="bg-transparent flex-1 outline-none text-sm font-bold text-slate-700" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required={authMode === 'signup'} 
              />
            </div>
          </div>
        )}
        
        {/* Campo E-mail */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
            E-mail
          </label>
          <div className="flex items-center bg-white border border-[#e5e4d7] h-14 px-5 rounded-[22px] focus-within:ring-4 ring-black/5 transition-all shadow-sm">
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

        {/* Campo Senha */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Palavra-passe
          </label>
          <div className="flex items-center bg-white border border-[#e5e4d7] h-14 px-5 rounded-[22px] focus-within:ring-4 ring-black/5 transition-all shadow-sm">
            <Lock size={18} className="text-slate-300 mr-3" />
            <input 
              type="password" 
              placeholder="••••••••" 
              className="bg-transparent flex-1 outline-none text-sm font-bold text-slate-700" 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-[10px] font-black uppercase rounded-2xl border border-red-100 flex items-center gap-3 animate-in shake duration-500">
            <AlertCircle size={16}/> {error}
          </div>
        )}

        {/* Botão de Ação Principal */}
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full h-18 bg-black text-white rounded-[28px] font-black text-xs uppercase tracking-[3px] shadow-2xl py-6 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              {authMode === 'login' ? 'Entrar no Sistema' : 'Finalizar Registo'} 
              <ArrowRight size={18}/>
            </>
          )}
        </button>
      </form>

      {/* 4. Alternância entre Modos (Footer) */}
      <button 
        onClick={() => {
          setAuthMode(authMode === 'login' ? 'signup' : 'login');
          setFormData({ name: '', email: '', password: '' });
        }} 
        className="mt-10 text-[11px] font-bold text-slate-400 hover:text-black transition-colors uppercase text-center"
      >
        {authMode === 'login' ? (
          <>Ainda não tem conta? <span className="text-black font-black underline decoration-blue-600 decoration-2 underline-offset-4">REGISTAR AQUI</span></>
        ) : (
          <>Já possui uma conta? <span className="text-black font-black underline decoration-blue-600 decoration-2 underline-offset-4">FAZER LOGIN</span></>
        )}
      </button>
    </div>
  );
};

export default AuthView;