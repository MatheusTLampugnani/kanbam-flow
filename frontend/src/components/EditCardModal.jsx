import React, { useState, useEffect } from 'react';
import { AlignLeft, CheckSquare, Clock, User, Plus, Trash2, Tag, Link as LinkIcon, DollarSign, X, MessageSquare } from 'lucide-react';

export default function EditCardModal({ card, board, currentUser, users = [], show, onClose, onSave, onAddBoardField }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Média');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');

  const [checklist, setChecklist] = useState([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');

  const [tags, setTags] = useState([]);
  const [newTagText, setNewTagText] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3b82f6');
  const presetColors = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b'];

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const [customValues, setCustomValues] = useState({});

  const [showNewFieldForm, setShowNewFieldForm] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('date');
  const [newFieldOptions, setNewFieldOptions] = useState('');

  useEffect(() => {
    if (card) {
      setTitle(card.title || '');
      setDescription(card.description || '');
      setPriority(card.priority || 'Média');
      setAssignee(card.assignee || '');
      setDueDate(card.dueDate ? card.dueDate.split('T')[0] : '');
      setChecklist(card.checklist || []);
      setTags(card.tags || []);
      setComments(card.comments || []);
      setCustomValues(card.customFieldsData || {});
    }
  }, [card]);

  if (!show || !card || !board) return null;

  const handleCustomChange = (fieldId, value) => setCustomValues(prev => ({ ...prev, [fieldId]: value }));

  const handleSave = () => {
    onSave(card.id, { title, description, priority, assignee, dueDate, checklist, tags, comments, customFieldsData: customValues });
  };

  const addChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    setChecklist([...checklist, { id: Date.now().toString(), text: newChecklistItem, completed: false }]);
    setNewChecklistItem('');
  };
  const toggleChecklist = (id) => setChecklist(checklist.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  const removeChecklistItem = (id) => setChecklist(checklist.filter(item => item.id !== id));

  const addTag = () => {
    if (!newTagText.trim()) return;
    setTags([...tags, { id: Date.now().toString(), text: newTagText.trim(), color: newTagColor }]);
    setNewTagText('');
  };
  const removeTag = (id) => setTags(tags.filter(t => t.id !== id));

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const commentObj = {
      id: Date.now().toString(),
      text: newComment.trim(),
      author: currentUser?.name || 'Usuário',
      date: new Date().toISOString()
    };
    setComments([commentObj, ...comments]);
    setNewComment('');
  };

  const handleCreateField = () => {
    if (!newFieldName.trim()) return;
    const newField = { id: Date.now().toString(), name: newFieldName.trim(), type: newFieldType, options: newFieldOptions.trim() };
    const updatedSchema = [...(board.customFieldsSchema || []), newField];
    onAddBoardField(board.id, updatedSchema);
    setShowNewFieldForm(false); setNewFieldName(''); setNewFieldType('date'); setNewFieldOptions('');
  };

  const handleRemoveField = (fieldId) => {
    const updatedSchema = (board.customFieldsSchema || []).filter(f => f.id !== fieldId);
    onAddBoardField(board.id, updatedSchema);
  };

  const renderCustomInput = (field) => {
    const value = customValues[field.id] !== undefined ? customValues[field.id] : '';
    if (field.type === 'select') {
      const options = field.options ? field.options.split(',').map(o => o.trim()) : [];
      return (
        <select className="form-select form-select-sm shadow-none bg-body text-body border-secondary border-opacity-20 py-1.5" value={value} onChange={(e) => handleCustomChange(field.id, e.target.value)} style={{ borderRadius: '8px' }}>
          <option value="">Selecione...</option>
          {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
        </select>
      );
    }
    if (field.type === 'checkbox') return <div className="form-check mt-1"><input className="form-check-input shadow-none border-secondary border-opacity-30" type="checkbox" checked={!!value} onChange={(e) => handleCustomChange(field.id, e.target.checked)} /></div>;
    if (field.type === 'textarea') return <textarea className="form-control form-control-sm shadow-none bg-body text-body border-secondary border-opacity-20" rows="3" value={value} onChange={(e) => handleCustomChange(field.id, e.target.value)} style={{ borderRadius: '8px' }}></textarea>;
    if (field.type === 'currency') return <div className="input-group input-group-sm"><span className="input-group-text bg-body-secondary border-secondary border-opacity-20 text-secondary"><DollarSign size={13} /></span><input type="number" step="0.01" className="form-control shadow-none bg-body text-body border-secondary border-opacity-20" value={value} onChange={(e) => handleCustomChange(field.id, e.target.value)} style={{ borderRadius: '8px' }} /></div>;
    if (field.type === 'url') return <div className="input-group input-group-sm"><span className="input-group-text bg-body-secondary border-secondary border-opacity-20 text-secondary"><LinkIcon size={13} /></span><input type="url" placeholder="https://" className="form-control shadow-none bg-body text-body border-secondary border-opacity-20" value={value} onChange={(e) => handleCustomChange(field.id, e.target.value)} style={{ borderRadius: '8px' }} /></div>;
    return <input type={field.type} className="form-control form-control-sm shadow-none bg-body text-body border-secondary border-opacity-20 py-1.5" value={value} onChange={(e) => handleCustomChange(field.id, e.target.value)} style={{ borderRadius: '8px' }} />;
  };

  const completedCount = checklist.filter(c => c.completed).length;
  const progressPercent = checklist.length === 0 ? 0 : Math.round((completedCount / checklist.length) * 100);

  return (
    <>
      <div className="modal-backdrop fade show" style={{ opacity: 0.6 }} onClick={onClose}></div>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
          <div className="modal-content border-0 shadow-lg bg-body" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            <div className="modal-header border-bottom px-4 py-3 bg-body-tertiary d-flex align-items-center justify-content-between">
              <input
                className="form-control form-control-lg fw-bold border-0 bg-transparent px-0 shadow-none text-body flex-grow-1 me-3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ fontSize: '1.4rem', letterSpacing: '-0.02em' }}
                placeholder="Título do cartão..."
              />
              <button type="button" className="btn-close shadow-none" onClick={onClose}></button>
            </div>

            <div className="modal-body p-0">
              <div className="row g-0 h-100">
                <div className="col-md-8 p-4 card-details-main">

                  {/* Descrição */}
                  <div className="mb-4">
                    <div className="d-flex align-items-center gap-2 mb-2 text-secondary fw-bold" style={{ fontSize: '0.85rem' }}><AlignLeft size={16} /> Descrição / Observação</div>
                    <textarea className="form-control shadow-none bg-body-tertiary border-0 p-3" rows="4" placeholder="Adicione detalhes, observações ou links..." value={description} onChange={(e) => setDescription(e.target.value)} style={{ borderRadius: '12px', fontSize: '0.92rem' }}></textarea>
                  </div>

                  {/* Subtarefas */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-2 text-secondary fw-bold" style={{ fontSize: '0.85rem' }}><CheckSquare size={16} /> Subtarefas</div>
                      <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary">{progressPercent}%</span>
                    </div>
                    <div className="progress mb-3" style={{ height: '6px', borderRadius: '3px' }}><div className={`progress-bar ${progressPercent === 100 ? 'bg-success' : 'bg-primary'}`} style={{ width: `${progressPercent}%`, borderRadius: '3px' }}></div></div>
                    <div className="d-flex flex-column gap-2 mb-3">
                      {checklist.map(item => (
                        <div key={item.id} className="d-flex align-items-center gap-2 p-2 bg-body-tertiary rounded border border-secondary border-opacity-10" style={{ borderRadius: '8px' }}>
                          <input type="checkbox" className="form-check-input mt-0 shadow-none border-secondary border-opacity-35" checked={item.completed} onChange={() => toggleChecklist(item.id)} />
                          <span className={`flex-grow-1 ${item.completed ? 'text-decoration-line-through text-muted' : 'text-body'}`} style={{ fontSize: '0.88rem', fontWeight: '500' }}>{item.text}</span>
                          <button className="btn btn-link text-secondary p-1 border-0 shadow-none opacity-50 hover-opacity-100" onClick={() => removeChecklistItem(item.id)} style={{ outline: 'none' }}><Trash2 size={14} /></button>
                        </div>
                      ))}
                    </div>
                    <div className="d-flex gap-2">
                      <input type="text" className="form-control form-control-sm shadow-none bg-body-tertiary border-0 px-2.5 py-1.5" placeholder="Adicionar uma tarefa menor..." value={newChecklistItem} onChange={(e) => setNewChecklistItem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addChecklistItem()} style={{ borderRadius: '8px', fontSize: '0.85rem' }} />
                      <button className="btn btn-secondary btn-sm px-3 fw-bold" onClick={addChecklistItem} style={{ borderRadius: '8px', fontSize: '0.82rem' }}>Adicionar</button>
                    </div>
                  </div>

                  <hr className="my-4 border-secondary opacity-10" />

                  {/* Comentários */}
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3.5 text-secondary fw-bold" style={{ fontSize: '0.85rem' }}>
                      <MessageSquare size={16} /> Comentários e Histórico
                    </div>
                    <div className="d-flex gap-3 mb-4">
                      <div className="text-white rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0" style={{ 
                        width: '36px', 
                        height: '36px', 
                        fontSize: '0.85rem',
                        background: 'linear-gradient(135deg, var(--accent) 0%, #3b82f6 100%)',
                        boxShadow: '0 2px 6px rgba(79,70,229,0.2)'
                      }}>
                        {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="flex-grow-1">
                        <textarea className="form-control shadow-none bg-body-tertiary border-0 mb-2 p-2.5" rows="2" placeholder="Escreva um comentário..." value={newComment} onChange={(e) => setNewComment(e.target.value)} style={{ borderRadius: '10px', fontSize: '0.88rem' }}></textarea>
                        <button className="btn btn-primary btn-sm px-3.5 fw-bold" onClick={handleAddComment} style={{ borderRadius: '8px', fontSize: '0.82rem' }}>Salvar Comentário</button>
                      </div>
                    </div>
                    <div className="d-flex flex-column gap-3.5">
                      {comments.map(comment => (
                        <div key={comment.id} className="d-flex gap-3">
                          <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0" style={{ 
                            width: '36px', 
                            height: '36px', 
                            fontSize: '0.85rem',
                            background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
                          }}>
                            {comment.author ? comment.author.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-baseline gap-2">
                              <span className="fw-bold text-body" style={{ fontSize: '0.88rem' }}>{comment.author}</span>
                              <span className="text-muted small" style={{ fontSize: '0.72rem' }}>{new Date(comment.date).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                            </div>
                            <div className="bg-body-tertiary p-2.5 rounded mt-1 border border-secondary border-opacity-10 text-body" style={{ borderRadius: '10px', fontSize: '0.88rem', lineHeight: '1.45' }}>
                              {comment.text}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Painel Lateral de Propriedades */}
                <div className="col-md-4 bg-body-tertiary border-start p-4 card-details-sidebar">
                  <h6 className="text-muted fw-bold mb-4" style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Propriedades Personalizadas</h6>

                  <div className="d-flex flex-column gap-3">
                    
                    {board.customFieldsSchema && board.customFieldsSchema.length > 0 && (
                      <div className="d-flex flex-column gap-3 mb-2">
                        {board.customFieldsSchema.map(field => (
                          <div key={field.id} className="p-2.5 rounded bg-body bg-opacity-50 border border-secondary border-opacity-10" style={{ borderRadius: '10px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-1.5">
                              <label className="text-secondary fw-bold small mb-0" style={{ fontSize: '0.75rem', opacity: 0.95 }}>{field.name}</label>
                              <button
                                type="button"
                                className="btn btn-link p-0 text-secondary opacity-40 hover-danger border-0 shadow-none d-flex"
                                onClick={() => handleRemoveField(field.id)}
                                title="Excluir esta propriedade do quadro permanentemente"
                                style={{ transition: 'color 0.2s', outline: 'none' }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                            {renderCustomInput(field)}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Formulário Inline de Novo Campo */}
                    {showNewFieldForm ? (
                      <div className="p-3 border rounded bg-body-secondary mb-2" style={{ fontSize: '0.8rem', borderRadius: '12px' }}>
                        <div className="mb-2">
                          <label className="form-label text-secondary small fw-bold mb-1">Nome da Propriedade</label>
                          <input
                            type="text"
                            className="form-control form-control-sm shadow-none bg-body text-body"
                            placeholder="Ex: Patrimônio, Setor..."
                            value={newFieldName}
                            onChange={(e) => setNewFieldName(e.target.value)}
                            style={{ borderRadius: '6px' }}
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label text-secondary small fw-bold mb-1">Tipo de Campo</label>
                          <select
                            className="form-select form-select-sm shadow-none bg-body text-body"
                            value={newFieldType}
                            onChange={(e) => setNewFieldType(e.target.value)}
                            style={{ borderRadius: '6px' }}
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
                        </div>
                        {newFieldType === 'select' && (
                          <div className="mb-2">
                            <label className="form-label text-secondary small fw-bold mb-1">Opções (separadas por vírgula)</label>
                            <input
                              type="text"
                              className="form-control form-control-sm shadow-none bg-body text-body"
                              placeholder="Ex: TI, RH, Vendas"
                              value={newFieldOptions}
                              onChange={(e) => setNewFieldOptions(e.target.value)}
                              style={{ borderRadius: '6px' }}
                            />
                          </div>
                        )}
                        <div className="d-flex gap-2 justify-content-end mt-3">
                          <button type="button" className="btn btn-primary btn-sm px-3 fw-bold" onClick={handleCreateField} style={{ borderRadius: '6px' }}>Adicionar</button>
                          <button type="button" className="btn btn-light btn-sm fw-semibold" onClick={() => setShowNewFieldForm(false)} style={{ borderRadius: '6px' }}>Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm w-100 d-flex align-items-center justify-content-center gap-2 fw-bold shadow-none border-0 bg-body-secondary py-2.5 mt-2"
                        onClick={() => setShowNewFieldForm(true)}
                        style={{ borderRadius: '10px', fontSize: '0.85rem' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(var(--bs-primary-rgb), 0.08)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bs-secondary-bg)'}
                      >
                        <Plus size={14} /> Adicionar Propriedade
                      </button>
                    )}

                  </div>
                </div>

              </div>
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