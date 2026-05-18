import React, { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

import BrandLogo from './components/BrandLogo';
import AuthView from './views/AuthView';
import SignupView from './views/SignupView';
import MapView from './views/MapView';
import FeedView from './views/FeedView';
import ReportView from './views/ReportView';
import ReportDetails from './views/ReportDetails';
import ImpactView from './views/ImpactView';

// const API_BASE = 'https://voz-da-comunidade-api-1.onrender.com';
const API_BASE = 'http://localhost:3000';

export default function App() {
  const [locationData, setLocationData] = useState({ lat: -4.1011, lng: -38.5086 });
  const [view, setView] = useState('splash');
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [newComment, setNewComment] = useState('');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const init = async () => {
      const savedUser = localStorage.getItem('vcom_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setView('map');
      } else {
        setTimeout(() => setView('auth'), 2500);
      }
    };
    init();
  }, []);

  const fetchData = useCallback(async (currentUserId) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/feed?city=horizonte${currentUserId ? `&userId=${currentUserId}` : ''}`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' } 
      });
      const json = await res.json();
      if (json.status === 'success') {
        const reportsData = Array.isArray(json.data) ? json.data : (json.data.reports || []);
        const sanitized = reportsData.map(r => ({
          ...r,
          likes_count: Number(r.likes_count) || 0,
          comments: Array.isArray(r.comments) ? r.comments : []
        }));
        setReports(sanitized);
        if (json.data.stats) setStats(json.data.stats);
      }
    } catch (err) {
      console.error("Erro ao buscar dados.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAuth = async (e, mode) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const endpoint = mode === 'login' ? '/login' : '/signup';
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.status === 'success') {
        const userData = data.user || { ...formData, id: Date.now() };
        setUser(userData);
        localStorage.setItem('vcom_user', JSON.stringify(userData));
        setView('map');
      } else { 
        setError(data.message || 'Erro de autenticação.'); 
      }
    } catch (err) { 
      setError('Servidor a iniciar. Tente novamente em instantes.'); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleLike = async (id) => {
    if (!user) return;
    try {
      setReports(prev => prev.map(r => r.id === id ? { 
        ...r, 
        userLiked: !r.userLiked, 
        likes_count: r.userLiked ? Math.max(0, r.likes_count - 1) : r.likes_count + 1 
      } : r));

      const res = await fetch(`${API_BASE}/reports/${id}/like`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await res.json();
      if (data.status === 'success') {
        fetchData(user.id);
      } else if (res.status === 401) {
        setError("Sessão expirada. Faça login novamente.");
        setView('auth');
      } else {
        setError(data.message || 'Erro ao curtir.');
      }
    } catch (err) {
      console.error("Erro ao curtir:", err);
      setError('Erro de rede ou servidor. Tente novamente.');
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedReport) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reports/${selectedReport.id}/comments`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: newComment,
          userId: user.id,
          userName: user.name
        })
      });
      const json = await res.json();
      
      if (json.status === 'success') {
        const comment = json.data;
        setSelectedReport(prev => ({ ...prev, comments: [comment, ...prev.comments] }));
        setReports(prev => prev.map(r => r.id === selectedReport.id ? {
          ...r, comments: [comment, ...(r.comments || [])]
        } : r));
        setNewComment('');
      } else if (res.status === 401) {
        setError("Sessão expirada. Faça login novamente.");
        setView('auth');
      }
    } catch (err) {
      setError("Falha ao publicar comentário.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && ['map', 'feed', 'impact'].includes(view)) fetchData(user.id);
  }, [user, view, fetchData]);

  const handleCreateReport = async (reportData) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('title', reportData.title);
      formData.append('description', reportData.description);
      formData.append('neighborhood', reportData.neighborhood);
      formData.append('type', reportData.type);
      formData.append('lat', reportData.lat);
      formData.append('lng', reportData.lng);
      formData.append('city', 'horizonte');
      formData.append('userId', user.id);
      formData.append('userName', user.name);
      if (reportData.imageFile) {
        formData.append('image', reportData.imageFile);
      }

      const res = await fetch(`${API_BASE}/reports/store`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();

      if (data.status === 'success') {
        setView('feed');
        fetchData();
      } else if (res.status === 401) {
        setError("Sessão expirada. Faça login novamente.");
        setView('auth');
      } else {
        setError(data.message || 'Erro ao criar relato.');
      }
    } catch (err) {
      console.error("Erro ao enviar relato:", err);
      setError('Erro de rede ou servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderView = () => {
    switch(view) {
      case 'auth': 
        return <AuthView 
          authMode="login"
          setAuthMode={() => setView('signup')}
          handleAuth={handleAuth} 
          formData={formData} 
          setFormData={setFormData} 
          loading={loading} 
          error={error} 
        />;
      case 'signup': 
        return <AuthView
          authMode="signup"
          setAuthMode={() => setView('auth')}
          handleAuth={handleAuth} 
          formData={formData} 
          setFormData={setFormData} 
          loading={loading} 
          error={error} 
        />;
      case 'map': 
      // return <MapView reports={reports} loading={loading} fetchData={fetchData} setView={setView} setSelectedReport={setSelectedReport} setLocationData={setLocationData} />;
      return (
    <MapView 
      reports={reports} 
      loading={loading} 
      fetchData={fetchData} 
      setView={setView} 
      setSelectedReport={setSelectedReport} 
      setLocationData={setLocationData} 
      isDark={isDark} // <-- Garanta que esta linha existe
    />
  ); 
      case 'feed': 
        return (
          <FeedView 
            reports={reports} 
            setReports={setReports}
            handleLike={handleLike} 
            setView={setView} 
            setSelectedReport={setSelectedReport} 
            isDark={isDark} 
            setIsDark={setIsDark} 
          />
        );  
      case 'report': 
        return (
          <ReportView 
            setView={setView} 
            locationData={locationData}
            user={user}
            onSubmitReport={handleCreateReport}
            loading={loading}
            error={error}
          />
        );
      case 'details': 
        return <ReportDetails selectedReport={selectedReport} setView={setView} handlePostComment={handlePostComment} newComment={newComment} setNewComment={setNewComment} isDark={isDark} loading={loading} />;
      case 'impact': 
        // return <ImpactView  fetchData={fetchData} isDark={isDark} stats={stats}  />;
        return (
          <ImpactView 
            stats={stats} 
            isDark={isDark} 
            fetchData={() => fetchData(user?.id)} // Passa a função de atualização para o filho
          />
        );
      default:
        return (
          <div className="h-screen w-full flex flex-col items-center justify-center bg-[#fdfcf0]">
            <BrandLogo size={220} />
            <div className="mt-12 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">A sincronizar Horizonte...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-[420px] h-screen md:h-[840px] bg-black rounded-none md:rounded-[60px] border-0 md:border-[12px] border-slate-900 shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Espaço reservado para a renderização das views de conteúdo */}
        <div className="flex-1 overflow-hidden flex flex-col relative bg-[#fdfcf0]">
          {renderView()}
        </div>

        {user && !['auth', 'signup', 'splash', 'report', 'details'].includes(view) && (
          <nav className={`h-24 backdrop-blur-xl border-t flex items-center justify-around px-4 shrink-0 z-[150] pb-6 transition-colors duration-500 ${isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-[#e5e4d7]'}`}>
            <button onClick={() => setView('map')} className={`text-[7px] font-black uppercase ${view === 'map' ? (isDark ? 'text-white' : 'text-black') : 'text-slate-500'}`}>Mapa</button>
            <button onClick={() => setView('feed')} className={`text-[7px] font-black uppercase ${view === 'feed' ? (isDark ? 'text-white' : 'text-black') : 'text-slate-500'}`}>Feed</button>
            <button onClick={() => setView('report')} className={`w-14 h-14 rounded-2xl flex items-center justify-center -mt-10 border-[6px] shadow-xl transition-all ${isDark ? 'bg-blue-600 text-white border-slate-950' : 'bg-black text-white border-[#fdfcf0]'}`}>+</button>
            <button onClick={() => setView('impact')} className={`text-[7px] font-black uppercase ${view === 'impact' ? (isDark ? 'text-white' : 'text-black') : 'text-slate-500'}`}>Impacto</button>
            <button onClick={() => { localStorage.clear(); setUser(null); setView('auth'); }} className="text-[7px] font-black uppercase text-red-400">Sair</button>
          </nav>
        )}

        <div className="h-1.5 w-32 bg-slate-200 rounded-full mx-auto mb-3 shrink-0"></div>
      </div>
    </div>
  );
}