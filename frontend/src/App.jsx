import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import {
  LayoutDashboard, Users, Settings, Bell, Plus, X, Search, Filter,
  Sun, Moon, UserPlus, ChevronLeft, ChevronRight, FolderPlus,
  Edit3, Trash2, LogOut, CheckCircle2, Shield, MoreVertical, BarChart3, Menu
} from 'lucide-react';
import api from './api/axios';
import bannerImg from './assets/banner.png';
import logoImg from './assets/logo.png';

import Column from './components/Column';
import ConfirmModal from './components/ConfirmModal';
import EditCardModal from './components/EditCardModal';
import ManageFieldsModal from './components/ManageFieldsModal';
import Login from './components/Login';
import ShareModal from './components/ShareModal';
import StatsModal from './components/StatsModal';

import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('kanban-user');
    const token = localStorage.getItem('kanban-token');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (!parsed.id && token) {
        try {
          // Decodifica a carga útil do JWT em Base64
          const payload = token.split('.')[1];
          const decoded = JSON.parse(atob(payload));
          parsed.id = decoded.id;
          localStorage.setItem('kanban-user', JSON.stringify(parsed));
        } catch (e) {
          console.error("Erro ao auto-recuperar ID do usuário a partir do token:", e);
        }
      }
      return parsed;
    }
    return null;
  });

  const [boards, setBoards] = useState([]);
  const [board, setBoard] = useState(null);
  const [users, setUsers] = useState([]);

  // Controle de Interface
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return window.innerWidth < 768;
  });
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isRenamingBoard, setIsRenamingBoard] = useState(false);
  const [renameBoardTitle, setRenameBoardTitle] = useState('');
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [editingBoardTitle, setEditingBoardTitle] = useState('');

  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const [confirmModal, setConfirmModal] = useState({ show: false, title: '', message: '', onConfirm: null });
  const [editingCard, setEditingCard] = useState(null);
  const [showManageFields, setShowManageFields] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const [theme, setTheme] = useState(localStorage.getItem('kanban-theme') || 'light');

  const closeModal = () => setConfirmModal({ show: false, title: '', message: '', onConfirm: null });

  const handleLogout = () => {
    localStorage.removeItem('kanban-token');
    localStorage.removeItem('kanban-user');
    setUser(null);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('kanban-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (error) {
      console.error("Erro ao buscar colaboradores", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBoards();
      fetchUsers();
    }
  }, [user]);

  const fetchBoards = async (selectBoardId = null) => {
    try {
      const res = await api.get('/boards');
      setBoards(res.data);
      if (res.data.length > 0) {
        let active = res.data[0];
        if (selectBoardId) {
          const found = res.data.find(b => b.id === selectBoardId);
          if (found) active = found;
        } else if (board) {
          const found = res.data.find(b => b.id === board.id);
          if (found) active = found;
        }
        setBoard(active);
      } else {
        // Inicializa o primeiro quadro se não houver nenhum
        const newBoard = await api.post('/boards', { title: 'Meu Workspace' });
        await api.post('/columns', { title: 'A Fazer', boardId: newBoard.data.id });
        await api.post('/columns', { title: 'Em Progresso', boardId: newBoard.data.id });
        fetchBoards(newBoard.data.id);
      }
    } catch (error) {
      console.error("Erro ao buscar dados", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  // Ações de Quadros (Boards)
  const handleCreateBoard = async () => {
    if (!newBoardTitle.trim()) return;
    try {
      const res = await api.post('/boards', { title: newBoardTitle.trim() });
      await api.post('/columns', { title: 'A Fazer', boardId: res.data.id });
      await api.post('/columns', { title: 'Em Progresso', boardId: res.data.id });
      setNewBoardTitle('');
      setIsAddingBoard(false);
      fetchBoards(res.data.id);
    } catch (error) {
      console.error("Erro ao criar quadro", error);
    }
  };

  const handleRenameBoard = async () => {
    if (!renameBoardTitle.trim() || !board) return;
    try {
      await api.put(`/boards/${board.id}`, { title: renameBoardTitle.trim() });
      setIsRenamingBoard(false);
      fetchBoards(board.id);
    } catch (error) {
      console.error("Erro ao renomear quadro", error);
    }
  };

  const handleInlineRenameBoard = async (boardId) => {
    if (!editingBoardTitle.trim()) return;
    try {
      await api.put(`/boards/${boardId}`, { title: editingBoardTitle.trim() });
      setEditingBoardId(null);
      fetchBoards(board.id);
    } catch (error) {
      console.error("Erro ao renomear quadro", error);
    }
  };

  const handleDeleteBoard = (boardId) => {
    setConfirmModal({
      show: true,
      title: 'Excluir Quadro',
      message: 'Tem certeza que deseja excluir este quadro e todos os seus cartões permanentemente?',
      onConfirm: async () => {
        try {
          await api.delete(`/boards/${boardId}`);
          closeModal();
          // Limpa o estado ativo e recarrega
          setBoard(null);
          fetchBoards();
        } catch (error) {
          console.error("Erro ao excluir quadro", error);
        }
      }
    });
  };

  const handleSaveBoardSchema = async (boardId, newSchema) => {
    await api.put(`/boards/${boardId}/schema`, { customFieldsSchema: newSchema });
    fetchBoards(boardId);
  };

  const handleShareBoard = async (username) => {
    return await api.post(`/boards/${board.id}/share`, { username });
  };

  // Ações de Colunas
  const handleCreateColumn = async () => {
    if (!newColumnTitle.trim() || !board) return;
    await api.post('/columns', { title: newColumnTitle.trim(), boardId: board.id });
    setNewColumnTitle('');
    setIsAddingColumn(false);
    fetchBoards(board.id);
  };

  const handleUpdateColumn = async (columnId, newTitle) => {
    await api.put(`/columns/${columnId}`, { title: newTitle });
    fetchBoards(board.id);
  };

  const handleDeleteColumn = (columnId) => {
    setConfirmModal({
      show: true,
      title: 'Excluir Lista',
      message: 'Deseja excluir esta lista e todos os cartões nela?',
      onConfirm: async () => {
        await api.delete(`/columns/${columnId}`);
        fetchBoards(board.id);
        closeModal();
      }
    });
  };

  // Ações de Cartões
  const handleAddCard = async (columnId, title) => {
    await api.post('/cards', { title, columnId });
    fetchBoards(board.id);
  };

  const onDeleteCard = (id) => {
    setConfirmModal({
      show: true,
      title: 'Excluir Tarefa',
      message: 'Deseja excluir este cartão permanentemente?',
      onConfirm: async () => {
        await api.delete(`/cards/${id}`);
        fetchBoards(board.id);
        closeModal();
      }
    });
  };

  const handleSaveCardDetails = async (cardId, updatedData) => {
    await api.put(`/cards/${cardId}/details`, updatedData);
    setEditingCard(null);
    fetchBoards(board.id);
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;

    const sourceColIndex = board.columns.findIndex(c => c.id.toString() === source.droppableId);
    const destColIndex = board.columns.findIndex(c => c.id.toString() === destination.droppableId);

    const newBoard = { ...board };
    const [movedCard] = newBoard.columns[sourceColIndex].cards.splice(source.index, 1);
    movedCard.columnId = parseInt(destination.droppableId);
    newBoard.columns[destColIndex].cards.splice(destination.index, 0, movedCard);
    setBoard(newBoard);

    await api.put(`/cards/${draggableId}`, { columnId: destination.droppableId, order: destination.index });
  };

  if (!user) {
    return <Login onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />;
  }

  if (!board) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center bg-body-secondary">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  const filteredColumns = (board.columns || []).map(column => {
    const filteredCards = (column.cards || []).filter(card => {
      const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.description && card.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesPriority = filterPriority ? card.priority === filterPriority : true;
      return matchesSearch && matchesPriority;
    });
    return { ...column, cards: filteredCards };
  });

  const isBoardOwner = board.ownerId === user.id;

  return (
    <div className="app-layout">

      <ConfirmModal show={confirmModal.show} title={confirmModal.title} message={confirmModal.message} onConfirm={confirmModal.onConfirm} onCancel={closeModal} />
      <ManageFieldsModal show={showManageFields} board={board} onClose={() => setShowManageFields(false)} onSaveSchema={handleSaveBoardSchema} />
      <EditCardModal show={!!editingCard} card={editingCard} board={board} currentUser={user} users={users} onClose={() => setEditingCard(null)} onSave={handleSaveCardDetails} onAddBoardField={handleSaveBoardSchema} />
      <ShareModal show={showShareModal} onClose={() => setShowShareModal(false)} onShare={handleShareBoard} />
      <StatsModal show={showStatsModal} board={board} onClose={() => setShowStatsModal(false)} />

      {/* BACKGROUND BACKDROP PARA MOBILE */}
      {!isSidebarCollapsed && (
        <div
          className="sidebar-backdrop d-md-none"
          onClick={() => setIsSidebarCollapsed(true)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 99,
          }}
        />
      )}

      {/* BARRA LATERAL (SIDEBAR) */}
      <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand flex-grow-1 d-flex align-items-center justify-content-start overflow-hidden">
            {isSidebarCollapsed ? (
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  borderRadius: '6px'
                }}
              >
                <img
                  src={bannerImg}
                  alt="KF"
                  style={{
                    height: '76px',
                    width: 'auto',
                    maxWidth: 'none',
                    marginLeft: '-4px',
                    filter: theme === 'dark' ? 'invert(1) hue-rotate(180deg) brightness(1.2)' : 'none'
                  }}
                />
              </div>
            ) : (
              <div style={{ height: '44px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                <img
                  src={bannerImg}
                  alt="KanbanFlow Logo"
                  style={{
                    height: '110px',
                    width: 'auto',
                    maxWidth: '185px',
                    objectFit: 'contain',
                    marginTop: '-28px',
                    marginBottom: '-28px',
                    filter: theme === 'dark' ? 'invert(1) hue-rotate(180deg) brightness(1.2)' : 'none'
                  }}
                />
              </div>
            )}
          </div>
          <button
            className="btn btn-link text-secondary p-1 shadow-none"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            title={isSidebarCollapsed ? "Expandir" : "Recolher"}
          >
            {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <div className="sidebar-content">
          <div>
            {!isSidebarCollapsed && <h6 className="sidebar-section-title">Quadros</h6>}
            <ul className="sidebar-menu-list">
              {boards.map(b => {
                const isOwner = b.ownerId === user.id;
                const isActive = b.id === board.id;

                if (editingBoardId === b.id) {
                  return (
                    <li key={b.id} className="mb-1 px-1">
                      <div className="d-flex gap-1 align-items-center bg-body p-1 rounded border">
                        <input
                          type="text"
                          className="form-control form-control-sm shadow-none border-primary py-0"
                          value={editingBoardTitle}
                          onChange={(e) => setEditingBoardTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleInlineRenameBoard(b.id);
                            if (e.key === 'Escape') setEditingBoardId(null);
                          }}
                          autoFocus
                        />
                        <button className="btn btn-success btn-sm p-1 d-flex shadow-none" onClick={() => handleInlineRenameBoard(b.id)}><CheckCircle2 size={13} /></button>
                        <button className="btn btn-light btn-sm p-1 d-flex shadow-none" onClick={() => setEditingBoardId(null)}><X size={13} /></button>
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={b.id} className="mb-1">
                    <div className={`d-flex align-items-center justify-content-between rounded ${isActive ? 'bg-primary-bg-subtle' : ''}`} style={{ position: 'relative' }}>
                      <button
                        className={`sidebar-menu-item flex-grow-1 m-0 border-0 bg-transparent text-start ${isActive ? 'active' : ''}`}
                        onClick={() => {
                          setBoard(b);
                          setIsRenamingBoard(false);
                          if (window.innerWidth < 768) {
                            setIsSidebarCollapsed(true); // Auto-recolhe ao selecionar quadro no celular
                          }
                        }}
                        title={b.title}
                        style={{ outline: 'none' }}
                      >
                        <div className="sidebar-item-label text-truncate">
                          {isOwner ? <Shield size={16} className="text-primary-emphasis" /> : <Users size={16} className="text-secondary" />}
                          {!isSidebarCollapsed && <span className="text-truncate">{b.title}</span>}
                        </div>
                      </button>

                      {!isSidebarCollapsed && isOwner && (
                        <div className="dropdown me-2">
                          <button className="btn btn-link p-1 text-secondary border-0 shadow-none d-flex align-items-center" data-bs-toggle="dropdown" aria-expanded="false">
                            <MoreVertical size={14} />
                          </button>
                          <ul className="dropdown-menu shadow border-0 py-1" style={{ fontSize: '0.85rem' }}>
                            <li>
                              <button
                                className="dropdown-item py-1 small fw-medium d-flex align-items-center gap-2"
                                onClick={() => {
                                  setEditingBoardId(b.id);
                                  setEditingBoardTitle(b.title);
                                }}
                              >
                                <Edit3 size={12} /> Renomear
                              </button>
                            </li>
                            {boards.length > 1 && (
                              <li>
                                <button
                                  className="dropdown-item py-1 text-danger small fw-medium d-flex align-items-center gap-2"
                                  onClick={() => handleDeleteBoard(b.id)}
                                >
                                  <Trash2 size={12} /> Excluir
                                </button>
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Criar Quadro Inline */}
            {!isSidebarCollapsed && (
              <div className="mt-3 px-2">
                {isAddingBoard ? (
                  <div className="p-2 border rounded bg-body">
                    <input
                      type="text"
                      className="form-control form-control-sm mb-2 shadow-none border-primary"
                      placeholder="Título do quadro..."
                      value={newBoardTitle}
                      onChange={(e) => setNewBoardTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreateBoard()}
                      autoFocus
                    />
                    <div className="d-flex gap-2">
                      <button className="btn btn-primary btn-sm px-3" onClick={handleCreateBoard}>Criar</button>
                      <button className="btn btn-link text-secondary p-0 shadow-none" onClick={() => setIsAddingBoard(false)}><X size={18} /></button>
                    </div>
                  </div>
                ) : (
                  <button className="btn btn-link text-decoration-none text-secondary p-0 small d-flex align-items-center gap-2 fw-medium shadow-none hover-primary" onClick={() => setIsAddingBoard(true)}>
                    <FolderPlus size={16} /> Novo Quadro
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <div className="main-content">

        {/* NAV SUPERIOR */}
        <nav className="navbar navbar-expand-lg border-bottom shadow-sm px-3 flex-shrink-0 bg-body">
          <div className="container-fluid px-0">
            <div className="d-flex align-items-center gap-3">
              <button
                className="btn btn-link text-secondary p-0 shadow-none d-md-none me-1"
                onClick={() => setIsSidebarCollapsed(false)}
                title="Abrir Menu"
              >
                <Menu size={22} />
              </button>

              {isRenamingBoard ? (
                <div className="d-flex gap-2 align-items-center">
                  <input
                    className="form-control form-control-sm fw-bold shadow-none"
                    value={renameBoardTitle}
                    onChange={(e) => setRenameBoardTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRenameBoard()}
                    autoFocus
                  />
                  <button className="btn btn-success btn-sm px-2 py-1" onClick={handleRenameBoard}><CheckCircle2 size={16} /></button>
                  <button className="btn btn-light btn-sm px-2 py-1" onClick={() => setIsRenamingBoard(false)}><X size={16} /></button>
                </div>
              ) : (
                <div className="navbar-brand d-flex align-items-center gap-2 fw-bold mb-0">
                  <span>{board.title}</span>
                  {isBoardOwner && (
                    <div className="dropdown">
                      <button className="btn btn-link text-secondary p-1 shadow-none" data-bs-toggle="dropdown">
                        <MoreVertical size={16} />
                      </button>
                      <ul className="dropdown-menu shadow border-0 mt-1">
                        <li>
                          <button
                            className="dropdown-item small fw-medium d-flex align-items-center gap-2"
                            onClick={() => {
                              setIsRenamingBoard(true);
                              setRenameBoardTitle(board.title);
                            }}
                          >
                            <Edit3 size={14} /> Renomear Quadro
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item small fw-medium d-flex align-items-center gap-2"
                            onClick={() => setShowManageFields(true)}
                          >
                            <Settings size={14} /> Campos Customizados
                          </button>
                        </li>
                        {boards.length > 1 && (
                          <>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                              <button
                                className="dropdown-item text-danger small fw-medium d-flex align-items-center gap-2"
                                onClick={() => handleDeleteBoard(board.id)}
                              >
                                <Trash2 size={14} /> Excluir Quadro
                              </button>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Pesquisa e Filtros (Apenas Desktop) */}
            <div className="d-none d-md-flex align-items-center gap-4 flex-grow-1 justify-content-center px-4">
              <div className="input-group input-group-sm" style={{ maxWidth: '350px' }}>
                <span className="input-group-text bg-body-tertiary border-end-0"><Search size={15} className="text-secondary" /></span>
                <input type="text" className="form-control bg-body-tertiary border-start-0 shadow-none" placeholder="Buscar tarefas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>

              <div className="d-flex align-items-center gap-2">
                <Filter size={15} className="text-secondary" />
                <select className="form-select form-select-sm shadow-none border-0 bg-body-tertiary fw-medium text-secondary" style={{ width: '160px' }} value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                  <option value="">Todas Prioridades</option>
                  <option value="Baixa">Baixa</option>
                  <option value="Média">Média</option>
                  <option value="Alta">Alta</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>
            </div>

            {/* Ações da Conta e Layout */}
            <div className="d-flex align-items-center gap-2 gap-sm-3 ms-auto ms-md-0">
              <div onClick={toggleTheme} style={{ cursor: 'pointer' }} className="p-1" title="Alternar Tema">
                {theme === 'light' ? <Moon size={18} className="text-secondary" /> : <Sun size={18} className="text-warning" />}
              </div>
              <div className="vr text-secondary opacity-25 d-none d-sm-block"></div>

              <button
                className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2 fw-medium px-2 px-md-3 shadow-none border-0 bg-body-tertiary"
                onClick={() => setShowStatsModal(true)}
                title="Estatísticas"
              >
                <BarChart3 size={16} /> <span className="d-none d-md-inline">Estatísticas</span>
              </button>

              <button
                className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2 fw-medium px-2 px-md-3 shadow-none border-0 bg-body-tertiary"
                onClick={() => setShowShareModal(true)}
                title="Compartilhar"
              >
                <UserPlus size={16} /> <span className="d-none d-md-inline">Compartilhar</span>
              </button>

              <div className="dropdown">
                <div
                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
                  style={{ width: '32px', height: '32px', cursor: 'pointer' }}
                  data-bs-toggle="dropdown"
                  title="Sua Conta"
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                  <li className="px-3 py-2 text-muted small border-bottom">Logado como <strong>{user?.username}</strong></li>
                  <li><button className="dropdown-item text-danger fw-medium mt-1" onClick={handleLogout}>Sair do Sistema</button></li>
                </ul>
              </div>

            </div>
          </div>
        </nav>

        {/* BARRA DE FILTROS MOBILE */}
        <div className="d-flex d-md-none gap-2 px-3 py-2 border-bottom bg-body flex-shrink-0 align-items-center justify-content-between shadow-sm">
          <div className="input-group input-group-sm flex-grow-1" style={{ maxWidth: '60%' }}>
            <span className="input-group-text bg-body-tertiary border-end-0 py-1"><Search size={14} className="text-secondary" /></span>
            <input type="text" className="form-control bg-body-tertiary border-start-0 shadow-none py-1" placeholder="Buscar tarefas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ fontSize: '0.82rem' }} />
          </div>

          <div className="d-flex align-items-center gap-1 flex-shrink-0" style={{ maxWidth: '40%' }}>
            <Filter size={13} className="text-secondary" />
            <select className="form-select form-select-sm shadow-none border-0 bg-body-tertiary fw-semibold text-secondary py-1 pe-4" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} style={{ fontSize: '0.8rem', paddingLeft: '4px' }}>
              <option value="">Prioridades</option>
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
              <option value="Urgente">Urgente</option>
            </select>
          </div>
        </div>

        {/* CONTAINER DO QUADRO (KANBAN BOARD) */}
        <main className="flex-grow-1 overflow-auto">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="board-container">
              {filteredColumns.map(column => (
                <Column
                  key={column.id}
                  column={column}
                  cards={column.cards || []}
                  onAddCard={handleAddCard}
                  onDeleteCard={onDeleteCard}
                  onUpdateColumn={handleUpdateColumn}
                  onDeleteColumn={handleDeleteColumn}
                  onEditCardClick={(card) => setEditingCard(card)}
                />
              ))}

              {/* Adicionar Outra Lista */}
              <div className="column-wrapper" style={{ minWidth: '280px' }}>
                {isAddingColumn ? (
                  <div className="card bg-body-tertiary p-2 border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                    <input
                      className="form-control mb-2 shadow-none border-primary"
                      placeholder="Insira o título da lista..."
                      value={newColumnTitle}
                      onChange={(e) => setNewColumnTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreateColumn()}
                      autoFocus
                    />
                    <div className="d-flex gap-2">
                      <button className="btn btn-primary btn-sm px-3 fw-medium" onClick={handleCreateColumn}>Adicionar</button>
                      <button className="btn btn-link text-secondary p-1 shadow-none" onClick={() => setIsAddingColumn(false)}><X size={20} /></button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="btn w-100 text-start d-flex align-items-center gap-2 fw-medium text-secondary"
                    style={{ backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: '12px', padding: '12px', border: 'none' }}
                    onClick={() => setIsAddingColumn(true)}
                  >
                    <Plus size={18} /> Adicionar outra lista
                  </button>
                )}
              </div>
            </div>
          </DragDropContext>
        </main>
      </div>

    </div>
  );
}

export default App;