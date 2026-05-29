import React, { useState, useEffect } from 'react';
import { UserPlus, User, X } from 'lucide-react';

export default function ShareModal({ show, onClose, onShare }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    if (show) {
      setUsername('');
      setFeedback({ type: '', message: '' });
    }
  }, [show]);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      await onShare(username);
      setFeedback({ type: 'success', message: 'Quadro compartilhado com sucesso!' });
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setFeedback({ type: 'error', message: error.response?.data?.error || 'Erro ao convidar usuário.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show" style={{ opacity: 0.5 }} onClick={onClose}></div>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '420px' }}>
          <div className="modal-content border-0 shadow-lg bg-body" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            
            <div className="modal-header border-bottom px-4 py-3.5 bg-body-tertiary d-flex align-items-center justify-content-between">
              <h5 className="modal-title fw-bold d-flex align-items-center gap-2 text-body" style={{ letterSpacing: '-0.02em' }}>
                <UserPlus size={18} className="text-primary" /> Compartilhar Quadro
              </h5>
              <button type="button" className="btn-close shadow-none" onClick={onClose}></button>
            </div>
            
            <div className="modal-body p-4 bg-body">
              <p className="text-secondary small mb-4 fw-semibold" style={{ fontSize: '0.85rem' }}>
                Digite o nome de usuário (login) do seu colega para conceder acesso total a este quadro.
              </p>

              {feedback.message && (
                <div className={`alert py-2 small fw-semibold text-center border-0 mb-3`} style={{
                  backgroundColor: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: feedback.type === 'success' ? '#a7f3d0' : '#fca5a5'
                }}>
                  {feedback.message}
                </div>
              )}

              <form onSubmit={handleSubmit} id="shareForm">
                <label className="form-label text-secondary small fw-bold mb-2">Nome de Usuário</label>
                <div className="input-group">
                  <span className="input-group-text bg-body-secondary border-end-0 text-secondary border-secondary border-opacity-20" style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                    <User size={15} />
                  </span>
                  <input 
                    type="text" 
                    className="form-control bg-body text-body border-start-0 shadow-none border-secondary border-opacity-20 py-2" 
                    placeholder="Ex: joao.silva" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoFocus
                    required 
                    style={{ fontSize: '0.9rem', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
                  />
                </div>
              </form>
            </div>
            
            <div className="modal-footer border-top px-4 py-3 bg-body">
              <button type="button" className="btn btn-outline-secondary fw-semibold px-4" onClick={onClose} style={{ borderRadius: '10px', fontSize: '0.9rem' }}>Cancelar</button>
              <button type="submit" form="shareForm" className="btn btn-primary fw-bold px-4" disabled={loading} style={{ borderRadius: '10px', fontSize: '0.9rem' }}>
                {loading ? 'Convidando...' : 'Compartilhar'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}