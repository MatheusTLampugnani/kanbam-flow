import React, { useState, useRef, useEffect } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus, MoreHorizontal, X, Layout } from 'lucide-react';
import CardItem from './CardItem';

export default function Column({ column, cards, onAddCard, onDeleteCard, onUpdateColumn, onDeleteColumn, onEditCardClick }) {
  // Estados para Edição do Título da Coluna
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(column.title);
  
  // Estados para Adição de Cartões (Inline Composer)
  const [isAdding, setIsAdding] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const textareaRef = useRef(null);

  // Auto-focus na textarea de nova tarefa
  useEffect(() => {
    if (isAdding && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isAdding]);

  // Funções da Coluna
  const saveTitle = () => {
    if (tempTitle.trim() !== column.title && tempTitle.trim() !== '') {
      onUpdateColumn(column.id, tempTitle.trim());
    } else {
      setTempTitle(column.title);
    }
    setIsEditingTitle(false);
  };

  // Funções do Cartão
  const handleTaskSubmit = (e) => {
    e?.preventDefault();
    if (taskTitle.trim()) {
      onAddCard(column.id, taskTitle.trim());
      setTaskTitle('');
      setIsAdding(false);
    }
  };

  const handleTaskKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTaskSubmit();
    }
    if (e.key === 'Escape') {
      setIsAdding(false);
      setTaskTitle('');
    }
  };

  return (
    <div className="column-wrapper d-flex flex-column h-100">
      <div className="card h-100" style={{ 
        borderRadius: '16px',
        backgroundColor: 'rgba(var(--bs-tertiary-bg-rgb), 0.5)',
        border: '1px solid rgba(var(--bs-border-color-rgb), 0.5)',
        backdropFilter: 'blur(10px)'
      }}>
        
        {/* Header da Coluna */}
        <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center pt-3.5 pb-2 px-3">
          <div className="d-flex align-items-center gap-2 flex-grow-1 me-2">
            {isEditingTitle ? (
              <input 
                className="form-control form-control-sm fw-bold border-primary shadow-none py-1 bg-body text-body"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={saveTitle}
                onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
                autoFocus
                style={{ fontSize: '0.85rem', borderRadius: '6px' }}
              />
            ) : (
              <h6 
                className="mb-0 text-uppercase fw-bold flex-grow-1 text-truncate" 
                style={{ 
                  fontSize: '0.78rem', 
                  cursor: 'pointer',
                  letterSpacing: '0.06em',
                  color: 'var(--text-h)',
                  opacity: 0.9
                }}
                onClick={() => setIsEditingTitle(true)}
                title="Clique para editar"
              >
                {column.title}
              </h6>
            )}
            <span className="badge rounded-circle d-flex align-items-center justify-content-center" style={{ 
              fontSize: '0.7rem', 
              fontWeight: '700',
              width: '20px', 
              height: '20px',
              backgroundColor: 'rgba(var(--bs-primary-rgb), 0.1)',
              color: 'var(--accent)'
            }}>{cards.length}</span>
          </div>
          
          <div className="dropdown">
            <button className="btn btn-link text-secondary p-1 border-0 shadow-none d-flex align-items-center" data-bs-toggle="dropdown" aria-expanded="false">
              <MoreHorizontal size={16} />
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow border-0 py-1" style={{ fontSize: '0.85rem' }}>
              <li>
                <button 
                  className="dropdown-item text-danger py-1 small fw-semibold" 
                  onClick={() => onDeleteColumn(column.id)}
                >
                  Excluir Lista
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Corpo: Lista de Cartões */}
        <Droppable droppableId={column.id.toString()}>
          {(provided, snapshot) => (
            <div
              className="card-body card-list p-2"
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ 
                backgroundColor: snapshot.isDraggingOver ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
                transition: 'background-color 0.2s ease',
                borderRadius: '12px'
              }}
            >
              {cards.map((card, index) => (
                <CardItem 
                  key={card.id} 
                  card={card} 
                  index={index} 
                  onDelete={onDeleteCard} 
                  onEditClick={onEditCardClick}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Footer: Adicionar Cartão */}
        <div className="card-footer bg-transparent border-0 pt-0 pb-3.5 px-2.5 mt-auto">
          {isAdding ? (
            <div className="bg-body p-2.5 rounded shadow-sm border" style={{
              borderRadius: '10px',
              border: '1px solid rgba(var(--bs-border-color-rgb), 0.6) !important'
            }}>
              <textarea
                ref={textareaRef}
                className="form-control border-0 p-1 mb-2.5 shadow-none bg-transparent text-body"
                placeholder="Insira um título..."
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                onKeyDown={handleTaskKeyDown}
                rows={2}
                style={{ resize: 'none', fontSize: '0.88rem' }}
              />
              <div className="d-flex align-items-center justify-content-start gap-2">
                <button className="btn btn-primary btn-sm px-3 fw-bold shadow-sm" onClick={handleTaskSubmit} style={{ borderRadius: '6px' }}>
                  Adicionar
                </button>
                <button 
                  className="btn btn-link text-secondary p-1 border-0 shadow-none d-flex" 
                  onClick={() => { setIsAdding(false); setTaskTitle(''); }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ) : (
            <button 
              className="btn text-secondary w-100 d-flex align-items-center gap-2 px-2.5 py-2 border-0 shadow-none"
              onClick={() => setIsAdding(true)}
              style={{ transition: 'all 0.2s ease', textAlign: 'left', borderRadius: '10px', backgroundColor: 'transparent' }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(var(--bs-primary-rgb), 0.05)';
                e.currentTarget.style.color = 'var(--accent)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text)';
              }}
            >
              <Plus size={16} /> <span className="fw-bold" style={{ fontSize: '0.85rem' }}>Adicionar cartão</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}