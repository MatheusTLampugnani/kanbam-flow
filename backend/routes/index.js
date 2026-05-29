const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const kanbanController = require('../controllers/kanbanController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas Livres (Login e Cadastro)
router.post('/login', authController.login);
router.post('/register', authController.register);

router.use(authMiddleware);

// --- Rota de Usuários / Colaboradores ---
router.get('/users', authController.getUsers);

// --- Rotas de Boards ---
router.get('/boards', kanbanController.getBoards);
router.post('/boards', kanbanController.createBoard);
router.put('/boards/:id', kanbanController.updateBoard);
router.delete('/boards/:id', kanbanController.deleteBoard);
router.put('/boards/:id/schema', kanbanController.updateBoardSchema);
router.post('/boards/:id/share', kanbanController.shareBoard);

// --- Rotas de Colunas ---
router.post('/columns', kanbanController.createColumn);
router.put('/columns/:id', kanbanController.updateColumn);
router.delete('/columns/:id', kanbanController.deleteColumn);

// --- Rotas de Cartões ---
router.post('/cards', kanbanController.createCard);
router.put('/cards/:id', kanbanController.updateCardColumn);
router.delete('/cards/:id', kanbanController.deleteCard);
router.put('/cards/:id/details', kanbanController.updateCardDetails);

module.exports = router;