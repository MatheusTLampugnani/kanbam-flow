import React, { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';

export default function ManageFieldsModal({ show, board, onClose, onSaveSchema }) {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    if (board && board.customFieldsSchema) {
      setFields(board.customFieldsSchema);
    }
  }, [board, show]);

  if (!show) return null;

  const addField = () => {
    const newField = {
      id: Date.now().toString(),
      name: '',
      type: 'text',
      options: '' // Apenas para o tipo "select"
    };
    setFields([...fields, newField]);
  };

  const removeField = (id) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const updateField = (id, key, value) => {
    setFields(fields.map(f => f.id === id ? { ...f, [key]: value } : f));
  };

  const handleSave = () => {
    const validFields = fields.filter(f => f.name.trim() !== '');
    onSaveSchema(board.id, validFields);
    onClose();
  };

  return (
    <>
      <div className="modal-backdrop fade show" style={{ opacity: 0.5 }} onClick={onClose}></div>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            
            <div className="modal-header border-bottom px-4 py-3.5 bg-body-tertiary d-flex align-items-center justify-content-between">
              <h5 className="modal-title fw-bold text-body" style={{ letterSpacing: '-0.02em' }}>Campos Customizados</h5>
              <button type="button" className="btn-close shadow-none" onClick={onClose}></button>
            </div>
            
            <div className="modal-body px-4 py-3 bg-body">
              <p className="text-secondary small mb-4 fw-semibold" style={{ fontSize: '0.85rem' }}>Defina propriedades globais (ex: Patrimônio, Setor, Custos, URLs). Elas aparecerão como campos de preenchimento em todos os cartões deste quadro.</p>
              
              <div className="d-flex flex-column gap-3 mb-3">
                {fields.map((field) => (
                  <div key={field.id} className="d-flex gap-2.5 align-items-start p-3 bg-body-tertiary border border-secondary border-opacity-10" style={{ borderRadius: '12px' }}>
                    <div className="flex-grow-1">
                      <input 
                        className="form-control form-control-sm mb-2 shadow-none bg-body text-body border-secondary border-opacity-20" 
                        placeholder="Nome da propriedade (ex: Equipamento, Setor...)"
                        value={field.name}
                        onChange={(e) => updateField(field.id, 'name', e.target.value)}
                        style={{ borderRadius: '8px', fontSize: '0.85rem', padding: '6px 10px' }}
                      />
                      {field.type === 'select' && (
                        <input 
                          className="form-control form-control-sm shadow-none mt-2 bg-body text-body border-secondary border-opacity-20" 
                          placeholder="Opções separadas por vírgula (ex: RH, TI, Vendas)"
                          value={field.options}
                          onChange={(e) => updateField(field.id, 'options', e.target.value)}
                          style={{ borderRadius: '8px', fontSize: '0.82rem', padding: '6px 10px' }}
                        />
                      )}
                    </div>
                    
                    <select 
                      className="form-select form-select-sm shadow-none w-auto bg-body text-body border-secondary border-opacity-20"
                      value={field.type}
                      onChange={(e) => updateField(field.id, 'type', e.target.value)}
                      style={{ borderRadius: '8px', fontSize: '0.85rem', padding: '6px 28px 6px 10px' }}
                    >
                      <option value="text">Texto Curto</option>
                      <option value="textarea">Texto Longo</option>
                      <option value="number">Número</option>
                      <option value="currency">Moeda (R$)</option>
                      <option value="date">Data</option>
                      <option value="url">Link / URL</option>
                      <option value="select">Lista Suspensa</option>
                      <option value="checkbox">Caixa de Seleção</option>
                    </select>
                    
                    <button className="btn btn-outline-danger btn-sm p-2 border-0 shadow-none d-flex align-items-center" onClick={() => removeField(field.id)} style={{ borderRadius: '8px' }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              <button className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2 mt-3 fw-bold px-3 py-2" onClick={addField} style={{ borderRadius: '8px', fontSize: '0.82rem' }}>
                <Plus size={15} /> Novo Campo
              </button>
            </div>
            
            <div className="modal-footer border-top px-4 py-3 bg-body">
              <button type="button" className="btn btn-outline-secondary fw-semibold px-4" onClick={onClose} style={{ borderRadius: '10px', fontSize: '0.9rem' }}>Cancelar</button>
              <button type="button" className="btn btn-primary fw-bold px-4" onClick={handleSave} style={{ borderRadius: '10px', fontSize: '0.9rem' }}>Salvar Alterações</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}