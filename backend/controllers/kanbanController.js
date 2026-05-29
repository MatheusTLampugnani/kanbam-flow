const { Board, Column, Card, User } = require('../models');

// --- BOARDS ---
exports.getBoards = async (req, res) => {
  try {
    const boards = await Board.findAll({
      include: [{
        model: Column, as: 'columns',
        include: [{ model: Card, as: 'cards' }]
      }],
      order: [
        ['id', 'ASC'],
        [{ model: Column, as: 'columns' }, 'id', 'ASC'],
        [{ model: Column, as: 'columns' }, { model: Card, as: 'cards' }, 'order', 'ASC']
      ]
    });

    const userBoards = boards.filter(b => 
      b.ownerId === req.user.id || (b.sharedWith && b.sharedWith.includes(req.user.username))
    );

    res.json(userBoards);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.createBoard = async (req, res) => {
  try {
    const board = await Board.create({ title: req.body.title, ownerId: req.user.id });
    res.status(201).json(board);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.shareBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    
    const board = await Board.findByPk(id);
    if (!board) return res.status(404).json({ error: 'Quadro não encontrado' });
    if (board.ownerId !== req.user.id) return res.status(403).json({ error: 'Apenas o dono pode convidar pessoas' });

    const targetUser = await User.findOne({ where: { username } });
    if (!targetUser) return res.status(404).json({ error: 'Usuário não encontrado' });

    const currentShared = board.sharedWith || [];
    if (!currentShared.includes(username)) {
      await board.update({ sharedWith: [...currentShared, username] });
    }
    
    res.json({ message: `Quadro compartilhado com ${targetUser.name}!` });
  } catch (error) { res.status(500).json({ error: error.message }); }
};


exports.updateBoardSchema = async (req, res) => {
  try {
    const { id } = req.params;
    const { customFieldsSchema } = req.body;
    await Board.update({ customFieldsSchema }, { where: { id } });
    res.json({ message: 'Esquema atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createColumn = async (req, res) => {
  try {
    const { title, boardId } = req.body;
    const column = await Column.create({ title, boardId });
    res.status(201).json({ ...column.toJSON(), cards: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateColumn = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    await Column.update({ title }, { where: { id } });
    res.json({ message: 'Coluna atualizada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteColumn = async (req, res) => {
  try {
    const { id } = req.params;
    await Column.destroy({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- CARTÕES ---
exports.createCard = async (req, res) => {
  try {
    const { title, description, columnId } = req.body;
    const card = await Card.create({ title, description, columnId });
    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCardColumn = async (req, res) => {
  try {
    const { id } = req.params;
    const { columnId, order } = req.body;
    const card = await Card.findByPk(id);
    
    if (!card) return res.status(404).json({ error: 'Card not found' });
    
    const oldColumnId = card.columnId;
    const targetColumnId = parseInt(columnId);
    
    if (oldColumnId === targetColumnId) {
      // Reordenando dentro da mesma coluna
      const cards = await Card.findAll({ 
        where: { columnId: oldColumnId },
        order: [['order', 'ASC'], ['id', 'ASC']]
      });
      
      // Remove o card da lista e insere na nova posição
      const filtered = cards.filter(c => c.id !== card.id);
      filtered.splice(order, 0, card);
      
      // Atualiza os orders sequencialmente no banco
      for (let i = 0; i < filtered.length; i++) {
        await filtered[i].update({ order: i });
      }
    } else {
      // Movendo para outra coluna
      // 1. Reordenar coluna antiga
      const oldCards = await Card.findAll({ 
        where: { columnId: oldColumnId },
        order: [['order', 'ASC'], ['id', 'ASC']]
      });
      const filteredOld = oldCards.filter(c => c.id !== card.id);
      for (let i = 0; i < filteredOld.length; i++) {
        await filteredOld[i].update({ order: i });
      }
      
      // 2. Inserir na nova coluna e reordenar
      const newCards = await Card.findAll({ 
        where: { columnId: targetColumnId },
        order: [['order', 'ASC'], ['id', 'ASC']]
      });
      newCards.splice(order, 0, card);
      for (let i = 0; i < newCards.length; i++) {
        await newCards[i].update({ columnId: targetColumnId, order: i });
      }
    }
    
    const updatedCard = await Card.findByPk(id);
    res.json(updatedCard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCardDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, assignee, dueDate, checklist, tags, comments, customFieldsData } = req.body;
    
    const card = await Card.findByPk(id);
    if (!card) return res.status(404).json({ error: 'Card not found' });
    
    const updatedFields = {
      title,
      description,
      priority: priority || 'Média',
      assignee: assignee === '' ? null : assignee,
      dueDate: dueDate === '' ? null : dueDate,
      checklist: checklist || [],
      tags: tags || [],
      customFieldsData: customFieldsData || {}
    };

    if (comments !== undefined) {
      updatedFields.comments = comments;
    }
    
    await card.update(updatedFields);
    res.json(card);
  } catch (error) {
    console.error("ERRO NO BACKEND AO ATUALIZAR CARD DETAILS:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    await Card.destroy({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const board = await Board.findByPk(id);
    if (!board) return res.status(404).json({ error: 'Quadro não encontrado' });
    if (board.ownerId !== req.user.id) return res.status(403).json({ error: 'Apenas o proprietário pode renomear o quadro' });
    await board.update({ title });
    res.json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const board = await Board.findByPk(id);
    if (!board) return res.status(404).json({ error: 'Quadro não encontrado' });
    if (board.ownerId !== req.user.id) return res.status(403).json({ error: 'Apenas o proprietário pode excluir o quadro' });
    await board.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};