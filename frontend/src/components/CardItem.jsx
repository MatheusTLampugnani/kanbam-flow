import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Trash2, GripVertical, AlignLeft, CheckSquare, Calendar, User } from 'lucide-react';

export default function CardItem({ card, index, onDelete, onEditClick }) {
  
  const priorityColors = {
    'Baixa': 'border border-info border-opacity-20 bg-info-subtle text-info-emphasis',
    'Média': 'border border-warning border-opacity-20 bg-warning-subtle text-warning-emphasis',
    'Alta': 'border border-danger border-opacity-20 bg-danger-subtle text-danger-emphasis',
    'Urgente': 'border border-danger border-opacity-40 bg-danger text-white fw-bold'
  };
  
  const badgeClass = priorityColors[card.priority] || priorityColors['Média'];

  // Verifica se tem checklist e qual o progresso
  const hasChecklist = card.checklist && card.checklist.length > 0;
  const checklistCompleted = hasChecklist ? card.checklist.filter(c => c.completed).length : 0;
  const checklistTotal = hasChecklist ? card.checklist.length : 0;
  const isChecklistDone = hasChecklist && checklistCompleted === checklistTotal;

  return (
    <Draggable draggableId={card.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`card border-1 ${snapshot.isDragging ? 'shadow-lg border-primary border-opacity-50' : 'shadow-sm'}`}
          style={{
            ...provided.draggableProps.style,
            cursor: snapshot.isDragging ? 'grabbing' : 'grab',
            backgroundColor: card.tags && card.tags.length > 0 
              ? `color-mix(in srgb, ${card.tags[0].color} 12%, rgba(var(--bs-body-bg-rgb), 0.85))` 
              : 'rgba(var(--bs-body-bg-rgb), 0.85)',
            borderLeft: card.tags && card.tags.length > 0 
              ? `5px solid ${card.tags[0].color}` 
              : undefined,
          }}
          onClick={() => onEditClick(card)}
        >
          <div className="card-body p-2.5 px-3">
            
            {/* ETIQUETAS DO CARTÃO */}
            {card.tags && card.tags.length > 0 && (
              <div className="d-flex flex-wrap gap-1 mb-2">
                {card.tags.map(tag => (
                  <span 
                    key={tag.id} 
                    className="badge rounded" 
                    style={{ 
                      backgroundColor: tag.color, 
                      fontSize: '0.62rem', 
                      fontWeight: '700', 
                      padding: '3px 7px',
                      letterSpacing: '0.02em',
                      color: '#fff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                  >
                    {tag.text || '\u00A0\u00A0'}
                  </span>
                ))}
              </div>
            )}
            
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className={`badge rounded-pill ${badgeClass}`} style={{ fontSize: '0.68rem', padding: '3px 8px' }}>
                {card.priority || 'Média'}
              </span>
              <div className="text-secondary opacity-25 p-0.5 d-flex align-items-center">
                <GripVertical size={14} />
              </div>
            </div>

            <h6 className="card-title fw-bold mb-2" style={{ fontSize: '0.92rem', letterSpacing: '-0.015em' }}>
              {card.title}
            </h6>
            
            {/* Ícones de Metadados (Descrição e Checklist) */}
            {(card.description || hasChecklist) && (
              <div className="d-flex gap-3 text-secondary mb-2" style={{ opacity: 0.8 }}>
                {card.description && (
                  <div className="d-flex align-items-center gap-1.5" title="Possui descrição" style={{ fontSize: '0.75rem' }}>
                    <AlignLeft size={13} className="text-muted" />
                    <span className="small text-muted fw-semibold">Detalhamento</span>
                  </div>
                )}
                {hasChecklist && (
                  <div className={`d-flex align-items-center gap-1.5 ${isChecklistDone ? 'text-success' : 'text-muted'}`} style={{ fontSize: '0.75rem', fontWeight: '700' }}>
                    <CheckSquare size={13} className={isChecklistDone ? 'text-success' : 'text-muted'} /> 
                    <span>{checklistCompleted}/{checklistTotal}</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="d-flex justify-content-between align-items-center border-top pt-2 mt-2 border-secondary border-opacity-10">
              <div className="d-flex flex-wrap align-items-center gap-2 text-muted w-75 overflow-hidden">
                {card.assignee && (
                  <div className="d-flex align-items-center gap-1 text-truncate" title={`Responsável: ${card.assignee}`}>
                    <span className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0" style={{ width: '16px', height: '16px', fontSize: '0.55rem' }}>
                      {card.assignee.charAt(0).toUpperCase()}
                    </span>
                    <span className="text-truncate" style={{ fontSize: '0.72rem', fontWeight: '600' }}>{card.assignee}</span>
                  </div>
                )}
                {card.dueDate ? (
                  <div className="d-flex align-items-center gap-1 text-warning-emphasis fw-semibold" style={{ fontSize: '0.72rem' }} title="Prazo de entrega">
                    <Calendar size={11} className="opacity-75" />
                    <span>{new Date(card.dueDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                ) : (
                  !card.assignee && (
                    <div className="d-flex align-items-center gap-1 text-secondary opacity-75" style={{ fontSize: '0.7rem' }}>
                      <Calendar size={11} className="opacity-60" />
                      <span>#{card.id} • {new Date(card.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )
                )}
              </div>
              <button 
                className="btn btn-link p-0 text-secondary border-0 shadow-none d-flex" 
                onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
                style={{ outline: 'none' }}
                onMouseOver={(e) => e.currentTarget.style.color = 'var(--bs-danger)'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--text)'}
              >
                <Trash2 size={14} className="opacity-50 hover-opacity-100" />
              </button>
            </div>

          </div>
        </div>
      )}
    </Draggable>
  );
}