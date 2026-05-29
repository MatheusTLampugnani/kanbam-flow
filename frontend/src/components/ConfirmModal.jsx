import React from 'react';

export default function ConfirmModal({ show, title, message, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <>
      {/* Fundo escuro (Backdrop) */}
      <div 
        className="modal-backdrop fade show" 
        style={{ opacity: 0.5 }}
        onClick={onCancel}
      ></div>

      {/* Janela do Modal */}
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }}>
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            
            <div className="modal-header border-bottom-0 pb-0 pt-4 px-4 bg-transparent d-flex justify-content-between align-items-center">
              <h5 className="modal-title fw-bold text-body" style={{ letterSpacing: '-0.02em' }}>{title}</h5>
              <button 
                type="button" 
                className="btn-close shadow-none" 
                onClick={onCancel}
                aria-label="Close"
              ></button>
            </div>
            
            <div className="modal-body px-4 py-3 text-secondary" style={{ fontSize: '0.92rem', lineHeight: '1.5' }}>
              {message}
            </div>
            
            <div className="modal-footer border-top-0 pt-2 pb-4 px-4 gap-2 justify-content-end bg-transparent">
              <button 
                type="button" 
                className="btn btn-light fw-bold px-3.5 py-2" 
                onClick={onCancel}
                style={{ borderRadius: '10px', fontSize: '0.85rem' }}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn btn-danger fw-bold px-3.5 py-2" 
                onClick={onConfirm}
                style={{ borderRadius: '10px', fontSize: '0.85rem', boxShadow: '0 4px 10px rgba(220,53,69,0.2)' }}
              >
                Confirmar
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}