import React, { useState } from 'react';
import { LayoutDashboard, Lock, User, UserPlus } from 'lucide-react';
import api from '../api/axios';
import bannerImg from '../assets/banner.png';

export default function Login({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isRegistering) {
        await api.post('/register', { name, username, password });
        setSuccessMsg('Conta criada com sucesso! Agora você pode entrar.');
        setIsRegistering(false);
        setPassword('');
      } else {
        const res = await api.post('/login', { username, password });
        localStorage.setItem('kanban-token', res.data.token);
        localStorage.setItem('kanban-user', JSON.stringify(res.data.user));
        onLoginSuccess(res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Ocorreu um erro no servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center" style={{
      background: 'radial-gradient(circle at 50% 50%, #1e1b4b 0%, #090d16 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Detalhes de brilho neon decorativos */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '20%',
        width: '300px',
        height: '300px',
        background: 'rgba(79, 70, 229, 0.15)',
        filter: 'blur(100px)',
        borderRadius: '50%'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '20%',
        width: '300px',
        height: '300px',
        background: 'rgba(129, 140, 248, 0.12)',
        filter: 'blur(100px)',
        borderRadius: '50%'
      }} />

      <div className="card border-0 shadow-lg" style={{
        width: '90%',
        maxWidth: '420px',
        borderRadius: '20px',
        overflow: 'hidden',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
      }}>

        <div className="text-center border-bottom border-secondary border-opacity-10 d-flex justify-content-center align-items-center bg-transparent" style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px', overflow: 'hidden', height: '120px' }}>
          <img
            src={bannerImg}
            alt="KanbanFlow Banner"
            style={{
              height: '210px',
              maxWidth: '115%',
              objectFit: 'contain',
              marginTop: '-45px',
              marginBottom: '-45px',
              filter: 'invert(1) hue-rotate(180deg) brightness(1.2)'
            }}
          />
        </div>

        <div className="card-body p-4 p-sm-5">
          {error && <div className="alert alert-danger py-2 small fw-semibold text-center border-0" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5' }}>{error}</div>}
          {successMsg && <div className="alert alert-success py-2 small fw-semibold text-center border-0" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0' }}>{successMsg}</div>}

          <form onSubmit={handleSubmit}>
            {isRegistering && (
              <div className="mb-3">
                <label className="form-label text-white-50 small fw-bold mb-2">Nome Completo</label>
                <div className="input-group">
                  <span className="input-group-text login-input-icon border-end-0"><UserPlus size={16} /></span>
                  <input
                    type="text"
                    className="form-control login-input border-start-0 shadow-none"
                    placeholder="Ex: João Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isRegistering}
                    style={{ fontSize: '0.9rem' }}
                  />
                </div>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label text-white-50 small fw-bold mb-2">Nome de Usuário (Login)</label>
              <div className="input-group">
                <span className="input-group-text login-input-icon border-end-0"><User size={16} /></span>
                <input
                  type="text"
                  className="form-control login-input border-start-0 shadow-none"
                  placeholder="Ex: joao.silva"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{ fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label text-white-50 small fw-bold mb-2">Senha</label>
              <div className="input-group">
                <span className="input-group-text login-input-icon border-end-0"><Lock size={16} /></span>
                <input
                  type="password"
                  className="form-control login-input border-start-0 shadow-none"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 fw-bold py-2.5 shadow-sm" disabled={loading} style={{
              borderRadius: '10px',
              fontSize: '0.95rem'
            }}>
              {loading ? 'Carregando...' : (isRegistering ? 'Cadastrar Usuário' : 'Entrar no Sistema')}
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              type="button"
              className="btn btn-link text-decoration-none text-white-50 small fw-semibold border-0 shadow-none"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setSuccessMsg('');
              }}
              style={{ fontSize: '0.85rem', outline: 'none' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
              onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}
            >
              {isRegistering ? 'Já tem conta? Fazer Login' : 'Ainda não tem conta? Criar agora'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}