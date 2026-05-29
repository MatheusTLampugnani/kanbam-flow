import React from 'react';
import { BarChart3, CheckSquare, AlertTriangle, Users, X, Award, ListTodo, ClipboardList } from 'lucide-react';

export default function StatsModal({ show, board, onClose }) {
  if (!show || !board) return null;

  // Cálculos Estatísticos
  const columns = board.columns || [];
  
  // 1. Total de tarefas
  let totalCards = 0;
  let urgentCards = 0;
  let highCards = 0;
  let mediumCards = 0;
  let lowCards = 0;
  
  let totalChecklistItems = 0;
  let completedChecklistItems = 0;
  
  const assigneeStats = {}; // { 'Nome': { total: 0, completedChecklists: 0, totalChecklists: 0 } }
  const columnStats = []; // [ { title: 'A Fazer', count: 0, percent: 0 } ]

  columns.forEach(col => {
    const cards = col.cards || [];
    totalCards += cards.length;
    
    columnStats.push({
      id: col.id,
      title: col.title,
      count: cards.length
    });

    cards.forEach(card => {
      // Prioridades
      if (card.priority === 'Urgente') urgentCards++;
      else if (card.priority === 'Alta') highCards++;
      else if (card.priority === 'Média') mediumCards++;
      else if (card.priority === 'Baixa') lowCards++;

      // Subtarefas / Checklist
      const checklist = card.checklist || [];
      totalChecklistItems += checklist.length;
      const completedItems = checklist.filter(c => c.completed).length;
      completedChecklistItems += completedItems;

      // Colaboradores
      if (card.assignee) {
        const name = card.assignee;
        if (!assigneeStats[name]) {
          assigneeStats[name] = { total: 0, completedChecklists: 0, totalChecklists: 0 };
        }
        assigneeStats[name].total += 1;
        assigneeStats[name].totalChecklists += checklist.length;
        assigneeStats[name].completedChecklists += completedItems;
      }
    });
  });

  // Percentuais das listas
  columnStats.forEach(stat => {
    stat.percent = totalCards > 0 ? Math.round((stat.count / totalCards) * 100) : 0;
  });

  // Percentual total do checklist
  const totalChecklistPercent = totalChecklistItems > 0 
    ? Math.round((completedChecklistItems / totalChecklistItems) * 100) 
    : 0;

  // Encontrar o colaborador destaque (mais tarefas)
  let topAssignee = null;
  let maxTasks = 0;
  Object.keys(assigneeStats).forEach(name => {
    if (assigneeStats[name].total > maxTasks) {
      maxTasks = assigneeStats[name].total;
      topAssignee = name;
    }
  });

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show" style={{ opacity: 0.6 }} onClick={onClose}></div>
      
      {/* Modal */}
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            
            <div className="modal-header border-bottom px-4 py-3.5 bg-body-tertiary">
              <h5 className="modal-title fw-bold d-flex align-items-center gap-2" style={{ letterSpacing: '-0.02em', color: 'var(--text-h)' }}>
                <BarChart3 size={20} className="text-primary" /> Dashboard de Métricas do Quadro
              </h5>
              <button type="button" className="btn-close shadow-none" onClick={onClose} aria-label="Close"></button>
            </div>

            <div className="modal-body p-4 bg-body">
              
              {/* CARTÕES DE RESUMO (KPIs) */}
              <div className="row g-2 g-md-3 mb-4 stats-kpi-row">
                
                <div className="col-6 col-md-3">
                  <div className="card border-0 bg-primary-bg-subtle text-primary-emphasis p-2 p-sm-3 h-100 rounded-3 shadow-sm" style={{ borderRadius: '12px !important' }}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="small fw-bold text-uppercase text-muted mb-1" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>Total de Tarefas</h6>
                        <h2 className="fw-extrabold mb-0" style={{ letterSpacing: '-0.03em' }}>{totalCards}</h2>
                      </div>
                      <div className="bg-primary text-white rounded p-1.5 p-sm-2 d-flex shadow-sm"><ClipboardList size={16} /></div>
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="card border-0 bg-danger-subtle text-danger-emphasis p-2 p-sm-3 h-100 rounded-3 shadow-sm" style={{ borderRadius: '12px !important' }}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="small fw-bold text-uppercase text-muted mb-1" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>Alertas Urgentes</h6>
                        <h2 className="fw-extrabold mb-0" style={{ letterSpacing: '-0.03em' }}>{urgentCards}</h2>
                      </div>
                      <div className="bg-danger text-white rounded p-1.5 p-sm-2 d-flex shadow-sm"><AlertTriangle size={16} /></div>
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="card border-0 bg-success-subtle text-success-emphasis p-2 p-sm-3 h-100 rounded-3 shadow-sm" style={{ borderRadius: '12px !important' }}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="small fw-bold text-uppercase text-muted mb-1" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>Foco Subtarefas</h6>
                        <h2 className="fw-extrabold mb-0" style={{ letterSpacing: '-0.03em' }}>{totalChecklistPercent}%</h2>
                      </div>
                      <div className="bg-success text-white rounded p-1.5 p-sm-2 d-flex shadow-sm"><CheckSquare size={16} /></div>
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="card border-0 bg-info-subtle text-info-emphasis p-2 p-sm-3 h-100 rounded-3 shadow-sm" style={{ borderRadius: '12px !important' }}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="small fw-bold text-uppercase text-muted mb-1" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>Membro Destaque</h6>
                        <h6 className="fw-bold mb-0 mt-1 text-truncate" style={{ fontSize: '0.82rem', maxWidth: '85px' }}>
                          {topAssignee ? `🏆 ${topAssignee}` : 'Nenhum'}
                        </h6>
                      </div>
                      <div className="bg-info text-white rounded p-1.5 p-sm-2 d-flex shadow-sm"><Award size={16} /></div>
                    </div>
                  </div>
                </div>

              </div>

              <div className="row g-4">
                
                {/* DISTRIBUIÇÃO POR LISTAS / COLUNAS */}
                <div className="col-md-6">
                  <div className="card border p-3.5 rounded-3 h-100 bg-body-tertiary" style={{ borderRadius: '14px' }}>
                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-h)', fontSize: '0.88rem' }}><ListTodo size={16} className="text-secondary" /> Distribuição por Lista</h6>
                    <div className="d-flex flex-column gap-3">
                      {columnStats.map(stat => (
                        <div key={stat.id} className="mb-1">
                          <div className="d-flex justify-content-between align-items-center mb-1.5 small fw-semibold" style={{ fontSize: '0.82rem' }}>
                            <span>{stat.title}</span>
                            <span className="text-muted">{stat.count} ({stat.percent}%)</span>
                          </div>
                          <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
                            <div 
                              className="progress-bar bg-primary" 
                              role="progressbar" 
                              style={{ width: `${stat.percent}%`, borderRadius: '4px' }} 
                              aria-valuenow={stat.percent} 
                              aria-valuemin="0" 
                              aria-valuemax="100"
                            ></div>
                          </div>
                        </div>
                      ))}
                      {columnStats.length === 0 && <p className="text-muted small text-center my-3">Nenhuma lista disponível.</p>}
                    </div>
                  </div>
                </div>

                {/* DISTRIBUIÇÃO POR PRIORIDADES */}
                <div className="col-md-6">
                  <div className="card border p-3.5 rounded-3 h-100 bg-body-tertiary" style={{ borderRadius: '14px' }}>
                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-h)', fontSize: '0.88rem' }}><AlertTriangle size={16} className="text-secondary" /> Nível de Prioridades</h6>
                    <div className="d-flex flex-column gap-3">
                      
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-1.5 small fw-semibold" style={{ fontSize: '0.82rem' }}>
                          <span className="badge bg-danger text-white rounded-pill" style={{fontSize: '0.65rem', padding: '3px 8px'}}>🚨 Urgente</span>
                          <span>{urgentCards}</span>
                        </div>
                        <div className="progress" style={{ height: '6px', borderRadius: '3px' }}><div className="progress-bar bg-danger" style={{ width: `${totalCards > 0 ? (urgentCards / totalCards) * 100 : 0}%`, borderRadius: '3px' }}></div></div>
                      </div>

                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-1.5 small fw-semibold" style={{ fontSize: '0.82rem' }}>
                          <span className="badge bg-danger-subtle text-danger-emphasis rounded-pill border border-danger border-opacity-10" style={{fontSize: '0.65rem', padding: '3px 8px'}}>Alta</span>
                          <span>{highCards}</span>
                        </div>
                        <div className="progress" style={{ height: '6px', borderRadius: '3px' }}><div className="progress-bar bg-danger bg-opacity-75" style={{ width: `${totalCards > 0 ? (highCards / totalCards) * 100 : 0}%`, borderRadius: '3px' }}></div></div>
                      </div>

                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-1.5 small fw-semibold" style={{ fontSize: '0.82rem' }}>
                          <span className="badge bg-warning-subtle text-warning-emphasis rounded-pill border border-warning border-opacity-10" style={{fontSize: '0.65rem', padding: '3px 8px'}}>Média</span>
                          <span>{mediumCards}</span>
                        </div>
                        <div className="progress" style={{ height: '6px', borderRadius: '3px' }}><div className="progress-bar bg-warning" style={{ width: `${totalCards > 0 ? (mediumCards / totalCards) * 100 : 0}%`, borderRadius: '3px' }}></div></div>
                      </div>

                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-1.5 small fw-semibold" style={{ fontSize: '0.82rem' }}>
                          <span className="badge bg-info-subtle text-info-emphasis rounded-pill border border-info border-opacity-10" style={{fontSize: '0.65rem', padding: '3px 8px'}}>Baixa</span>
                          <span>{lowCards}</span>
                        </div>
                        <div className="progress" style={{ height: '6px', borderRadius: '3px' }}><div className="progress-bar bg-info" style={{ width: `${totalCards > 0 ? (lowCards / totalCards) * 100 : 0}%`, borderRadius: '3px' }}></div></div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* DESEMPENHO E DISTRIBUIÇÃO POR COLABORADOR */}
                <div className="col-12">
                  <div className="card border p-3.5 rounded-3 bg-body-tertiary" style={{ borderRadius: '14px' }}>
                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-h)', fontSize: '0.88rem' }}><Users size={16} className="text-secondary" /> Desempenho por Colaborador</h6>
                    <div className="table-responsive">
                      <table className="table table-sm table-hover table-borderless align-middle mb-0" style={{ fontSize: '0.88rem' }}>
                        <thead className="table-light">
                          <tr style={{ borderBottom: '1px solid rgba(var(--bs-border-color-rgb), 0.4)' }}>
                            <th className="px-3 py-2 text-uppercase tracking-wider small fw-bold text-secondary" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>Colaborador</th>
                            <th className="py-2 text-center text-uppercase tracking-wider small fw-bold text-secondary" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>Tarefas Ativas</th>
                            <th className="py-2 text-center text-uppercase tracking-wider small fw-bold text-secondary" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>Subtarefas</th>
                            <th className="py-2 text-end pe-3 text-uppercase tracking-wider small fw-bold text-secondary" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>Progresso de Entrega</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(assigneeStats).map(name => {
                            const stat = assigneeStats[name];
                            const percent = stat.totalChecklists > 0 
                              ? Math.round((stat.completedChecklists / stat.totalChecklists) * 100) 
                              : 0;
                            return (
                              <tr key={name} className="border-bottom border-secondary-subtle">
                                <td className="px-3 py-2.5 fw-bold d-flex align-items-center gap-2">
                                  <div className="text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{
                                    width: '26px', 
                                    height: '26px', 
                                    fontSize: '0.75rem',
                                    background: 'linear-gradient(135deg, var(--accent) 0%, #3b82f6 100%)'
                                  }}>
                                    {name.charAt(0).toUpperCase()}
                                  </div>
                                  <span>{name}</span>
                                </td>
                                <td className="text-center py-2.5"><span className="badge rounded bg-secondary-subtle text-secondary fw-bold px-2 py-1" style={{ fontSize: '0.75rem' }}>{stat.total}</span></td>
                                <td className="text-center py-2.5 text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>{stat.completedChecklists}/{stat.totalChecklists}</td>
                                <td className="py-2.5 text-end pe-3">
                                  <div className="d-flex align-items-center justify-content-end gap-2">
                                    <span className="small text-body fw-bold" style={{ fontSize: '0.78rem' }}>{percent}%</span>
                                    <div className="progress" style={{ width: '70px', height: '6px', borderRadius: '3px' }}>
                                      <div className={`progress-bar ${percent === 100 ? 'bg-success' : 'bg-primary'}`} style={{ width: `${percent}%`, borderRadius: '3px' }}></div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          {Object.keys(assigneeStats).length === 0 && (
                            <tr>
                              <td colSpan="4" className="text-center text-muted py-4 small fw-medium">Nenhum colaborador com tarefa atribuída neste quadro.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            <div className="modal-footer border-top px-4 py-3 bg-body">
              <button type="button" className="btn btn-secondary fw-semibold px-4" onClick={onClose} style={{ borderRadius: '10px', fontSize: '0.9rem' }}>Fechar Dashboard</button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
